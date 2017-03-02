const SQL = require('sql-template-strings');
const models = require('./models');

module.exports = {
    includes: {
        UserAccount: {
            basic: [
                {
                    model: models.Role,
                    as: 'Role'
                },
                {
                    model: models.Region,
                    as: 'Region'
                }
            ],
            basicConsumer: [
                {
                    model: models.Role,
                    as: 'Role',
                    where: {
                        type: 'consumer'
                    }
                },
                {
                    model: models.Region,
                    as: 'Region'
                },
                {
                    model: models.Profile,
                    required: false,
                    as: 'Profile',
                    include: [
                        {
                            model: models.Service,
                            as: 'ProfileServiceServices'
                        }
                    ]
                }
            ],
            basicCreator: [
                {
                    model: models.Role,
                    as: 'Role',
                    where: {
                        type: 'creator'
                    }
                },
                {
                    model: models.Region,
                    as: 'Region'
                }
            ],
            leftProfile: [
                {
                    model: models.Role,
                    required: false,
                    as: 'Role'
                },
                {
                    model: models.Region,
                    required: false,
                    as: 'Region'
                },
                {
                    model: models.Profile,
                    required: false,
                    as: 'Profile',
                    include: [
                        {
                            model: models.Service,
                            as: 'ProfileServiceServices'
                        },
                        {
                            model: models.Residence,
                            as: 'Residence'
                        }
                    ]
                }
            ]
        },
        Entry: {
            basic: [
                {
                    model: models.Medium,
                    as: 'Medium'
                },
                {
                    model: models.Sentiment,
                    as: 'Sentiment'
                },
                {
                    model: models.Topic,
                    as: 'EntryTopicTopics'
                }
            ],
            sentiment: [
                {
                    model: models.Sentiment,
                    as: 'Sentiment'
                }
            ]
        }
    },
    queries: {
        Topic: {
            countsByRange: (from, to, regionId, serviceIds) => SQL`
            SELECT
                topic.type AS type,
                topic.name AS name,
                COUNT(DISTINCT entry.entry_id) AS entry_count,
                COUNT(DISTINCT user_account.user_id) AS creator_count
            FROM
                topic
            JOIN
                entry_topic ON entry_topic.topic_id = topic.topic_id
            JOIN
                entry ON entry.entry_id = entry_topic.entry_id 
                AND entry.created_at BETWEEN ${from} AND ${to}
            JOIN
                user_account ON user_account.user_id = entry.owner_id
                AND user_account.region_id = ${regionId}
            JOIN
                 profile ON profile.profile_id = user_account.profile_id
            JOIN
                 profile_service ON profile_service.profile_id = profile.profile_id
                 AND profile_service.service_id = ANY(${serviceIds})
            GROUP BY
                topic.type, topic.name
            `.useBind()
        },
        UserAccount: {
            entryActivity: (from, to, regionId, serviceIds) => SQL`
            SELECT
                COUNT(entry.entry_id) AS count
            FROM
                user_account
            JOIN
                 profile ON profile.profile_id = user_account.profile_id
            JOIN
                 profile_service ON profile_service.profile_id = profile.profile_id
            LEFT JOIN
                entry ON entry.owner_id = user_account.user_id AND entry.created_at BETWEEN ${from} AND ${to}
            WHERE
                user_account.created_at >= ${from}
            AND
                user_account.region_id = ${regionId}
            AND
                user_account.role_id = ( SELECT role_id FROM role WHERE role.type = 'creator' )
            AND
                profile_service.service_id = ANY(${serviceIds})
            GROUP BY
                user_account.user_id
            `.useBind()
        },
        Entry: {
            incrementViews: (entries) => SQL`
                UPDATE
                    entry
                SET
                    views = views + 1
                WHERE
                    entry_id = ANY(${entries})`.useBind()
        }
    }
};
