const SQL = require('sql-template-strings');
const url = require('url')
const Sequelize = require('sequelize');
const models = require('./models');
const winston = require('winston');

if (!process.env.DATABASE_URL) {
    throw new Error('Cannot find DATABASE_URL in environment variables');
}

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
};

const sequelizeLog = (msg) => winston.info(msg);
var sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'postgres',
    port: config.port,
    pool: {
        min: 0,
        max: 5,
        idle: 10000
    },
    /* Disabling native postgres */
    //    native: true,
    ssl: config.ssl,
    logging: sequelizeLog,
});
models.init(sequelize);

const helpers = {
    includes: {
        UserAccount: {
            basic: [
                {
                    model: models.Role,
                    as: 'Role',
                }, 
                {
                    model: models.Region,
                    as: 'Region',
                },
            ],
            basicConsumer: [
                {
                    model: models.Role,
                    as: 'Role',
                    where: {
                        type: 'consumer',
                    },
                }, 
                {
                    model: models.Region,
                    as: 'Region',
                },
            ],
            basicCreator: [
                {
                    model: models.Role,
                    as: 'Role',
                    where: {
                        type: 'creator',
                    },
                }, 
                {
                    model: models.Region,
                    as: 'Region',
                },
            ],
            leftRoleAndRegion: [
                {
                    model: models.Role,
                    required: false,
                    as: 'Role',
                }, 
                {
                    model: models.Region,
                    required: false,
                    as: 'Region',
                },
            ],
        },
        Entry: {
            basic: [
                {
                    model: models.Medium,
                    as: 'Medium',
                },
                {
                    model: models.Sentiment,
                    as: 'Sentiment',
                },
                {
                    model: models.Topic,
                    as: 'EntryTopicTopics',
                }
            ],
            sentiment: [
                {
                    model: models.Sentiment,
                    as: 'Sentiment',
                },
            ],
        },
        Request: {
            basic: [
                {
                    model: models.Topic,
                    as: 'RequestTopicTopics',
                },
                {
                    model: models.Region,
                    as: 'Region',
                },
            ]
        },
        UserRequest: {
            basic: [
                {
                    model: models.Request,
                    as: 'Request',
                    include: [
                        {
                            model: models.Topic,
                            as: 'RequestTopicTopics',
                        },
                        {
                            model: models.Region,
                            as: 'Region',
                        },
                    ]
                }
            ],
        },
    },
    queries: {
        Topic: {
            countsByRange: (from, to, regionId) => SQL`
            SELECT
                topic.type AS type,
                topic.name AS name,
                COUNT(user_account.user_id) AS entry_count,
                COUNT(DISTINCT user_account.user_id) AS creator_count
            FROM
                topic
            LEFT JOIN
                entry_topic ON entry_topic.topic_id = topic.topic_id
            LEFT JOIN
                entry ON entry.entry_id = entry_topic.entry_id 
                AND entry.created_at BETWEEN ${from} AND ${to}
            LEFT JOIN
                user_account ON user_account.user_id = entry.owner_id
                AND user_account.region_id = ${regionId}
            GROUP BY
                topic.type, topic.name
            `.useBind(),
        },
        UserAccount: {
            entryActivity: (from, to, regionId) => SQL`
            SELECT
                COUNT(entry.entry_id) AS count
            FROM
                user_account
            LEFT JOIN
                entry ON entry.owner_id = user_account.user_id AND entry.created_at BETWEEN ${from} AND ${to}
            WHERE
                user_account.created_at >= ${from}
            AND
                user_account.region_id = ${regionId}
            GROUP BY
                user_account.user_id
            `.useBind(),
        }
    }
}
module.exports = {
    sequelize,
    models,
    helpers,
}
