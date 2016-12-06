const ql = require('graphql');
const relayql = require('graphql-relay');
const types = require('./types.js');
const {sequelize, models, helpers} = require('../database');
const moment = require('moment');
const _ = require('lodash');
const spool = require('../spool.js');
const winston = require('winston');

var {nodeInterface, nodeField} = relayql.nodeDefinitions(
    /* retrieve given an id and type */
    (globalId, context) => {
        // keeping unusde 'type' here since it is important later and easy to forget
        // eslint-disable-next-line no-unused-vars
        var {type, id} = relayql.fromGlobalId(globalId);
        if (type === 'Creator') {
            return models.UserAccount.findOne({
                where: {
                    userId: context.userId,
                },
                include: helpers.includes.UserAccount.basicCreator,
            }).then((user) => user ? { creator: true } : null).catch((e) => winston.warn(e));
        }
        if (type === 'Consumer') {
            return models.UserAccount.findOne({
                where: {
                    userId: context.userId,
                },
                include: helpers.includes.UserAccount.basicConsumer,
            }).then((user) => user ? { consumer: true } : null).catch((e) => winston.warn(e));
        }
        if (type === 'User') {
            return models.UserAccount.findOne({
                where: {
                    userId: context.userId,
                },
                include: helpers.includes.UserAccount.leftRoleAndRegion,
            }).catch((e) => winston.warn(e));
        }
        if (type === 'Entry') {
            if(!context.Role) {
                winston.info(`Failed to resolve ${type} node due to missing role`);
                return null;
            }

            if(context.Role.type === 'creator') {
                // if we are a creator, get the entry directly
                return models.Entry.findOne({
                    where: {
                        entryId: id,
                        ownerId: context.userId,
                    },
                    include: helpers.includes.Entry.basic
                }).catch((e) => winston.warn(e));
            }

            if(context.Role.type === 'consumer') {
                // only give entries to consumers where they are sharing and
                // the regions match
                return models.Entry.findOne({
                    where: {
                        entryId: id,
                    },
                    include: [
                        {
                            model: models.UserAccount,
                            as: 'Owner',
                            where: {
                                sharing: true,
                                regionId: context.regionId
                            }
                        },
                        ...helpers.includes.Entry.basic
                    ],
                }).catch((e) => winston.warn(e));
            }
        }
        winston.info(`Failed to resolve ${type} node for ${id}`);
        return null;
    },
    /* resolve given an object */
    (obj) => {
        if (obj instanceof models.Entry.Instance) {
            // eslint-disable-next-line no-use-before-define
            return EntryType;
        }
        if (obj instanceof models.UserAccount.Instance){
            // eslint-disable-next-line no-use-before-define
            return UserType;
        }
        if (obj.consumer) {
            // eslint-disable-next-line no-use-before-define
            return ConsumerType;
        }
        if (obj.creator) {
            // eslint-disable-next-line no-use-before-define
            return CreatorType;
        }
    });

const UserType = new ql.GraphQLObjectType({
    name: 'User',
    fields: {
        id: relayql.globalIdField('User', (root) => root.userId),
        role: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return root.Role && root.Role.type;
            },
        },
        region: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return root.Region && root.Region.type;
            },
        }
    },
    interfaces: [nodeInterface]
});

const EntryType = new ql.GraphQLObjectType({
    name: 'Entry',
    fields: {
        id: relayql.globalIdField('Entry', (root) => root.entryId),
        media: {
            type: types.MediaType,
            resolve: (root) => {
                return root.Medium;
            },
        },
        sentiment: {
            type: types.SentimentType,
            resolve: (root) => {
                return root.Sentiment;
            },
        },
        topics: {
            type: new ql.GraphQLList(types.TopicType),
            resolve: (root) => {
                return root.EntryTopicTopics;
            },
        },
        created: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return moment(root.createdAt).format();
            },
        },
        updated: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return moment(root.updatedAt).format();
            },
        }
    },
    interfaces: [nodeInterface]
});
var entryConnectionDefinition =
    relayql.connectionDefinitions({nodeType: EntryType});

const CreatorActivityCountType = new ql.GraphQLObjectType({
    name: 'CreatorActivityCount',
    fields: {
        active: {
            type: ql.GraphQLInt,
            resolve: (root) => {
                return root.active;
            },
        },
        stale: {
            type: ql.GraphQLInt,
            resolve: (root) => {
                return root.stale;
            },
        }
    }
});

const EntryAccessType = new ql.GraphQLObjectType({
    name: 'EntryAccess',
    fields: {
        entries: {
            type: entryConnectionDefinition.connectionType,
            args: relayql.connectionArgs,
            resolve: ({range, topics, regionId}, args) => {
                var from = moment(range.from);
                var to = moment(range.to);

                return relayql.connectionFromPromisedArray(models.Entry.findAll({
                    where: {
                        createdAt: {
                            $between: [range.from, range.to]
                        }
                    },
                    include: [
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
                            where: {
                                //excluding entries which don't have a matching topic
                                type: {
                                    $in: topics
                                },
                            }
                        },
                        {
                            model: models.UserAccount,
                            as: 'Owner',
                            where: {
                                //and avoiding any entries whos sharing is diabled
                                //or their origin region is not part of the request
                                sharing: true,
                                regionId: regionId
                            }
                        },
                    ]
                }).catch((e) => winston.warn(e)), args);

                // find all matching entries
                return relayql.connectionFromPromisedArray(models.Entry.findAll({
                    where: {
                        // which were created between the range parameters
                        createdAt: {
                            $between: [from, to]
                        }
                    },
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    include: [
                        {
                            model: models.Topic,
                            as: 'EntryTopicTopics',
                            where: {
                                //excluding entries which don't have a matching topic
                                type: {
                                    $in: topics
                                }
                            }
                        },
                        {
                            model: models.UserAccount,
                            as: 'Owner',
                            where: {
                                //and avoiding any entries whos sharing is diabled
                                //or their origin region is not part of the request
                                sharing: true,
                                regionId: regionId
                            }
                        },
                    ]
                }).catch((e) => winston.warn(e)), args);
            }
        }
    }
});

const ConsumerType = new ql.GraphQLObjectType({
    name: 'Consumer',
    fields: {
        id: relayql.globalIdField('Consumer', (root, args, context) => context.userId),
        creatorActivityCount: {
            type: CreatorActivityCountType,
            args: {
                range: {
                    type: types.DateRangeInputType,
                }
            },
            resolve: function(root, {range}, context) {
                var from = moment(range.from);
                var to = moment(range.to);
                var regionId = context.regionId
                return sequelize.query(helpers.queries.UserAccount.entryActivity(from.format(), to.format(), regionId))
                .then(([results, metadata]) => results)
                .then(function(results) {
                    return results.reduce(function(reduction, row) {
                        if(row.count >= 1) {
                            reduction.active++;
                        } else {
                            reduction.stale++;
                        }
                        return reduction;
                    }, {
                        active: 0,
                        stale: 0
                    });
                }).catch((e) => winston.warn(e));
            },
        },
        topicCounts: {
            type: new ql.GraphQLList(types.TopicCountType),
            args: {
                range: {
                    type: types.DateRangeInputType,
                }
            },
            resolve: function(root, {range}, context) {
                var from = moment(range.from);
                var to = moment(range.to);
                var regionId = context.regionId;

                return sequelize.query(helpers.queries.Topic.countsByRange(from.format(), to.format(), regionId))
                .then(([results, metadata]) => results)
                .catch((e) => winston.warn(e));
            },
        },
        topics: {
            type: new ql.GraphQLList(types.TopicType),
            resolve: () => {
                return models.Topic.findAll().catch((e) => winston.warn(e));
            },
        },
        access: {
            type: EntryAccessType,
            args: {
                range: {
                    type: types.DateRangeInputType,
                },
                topics: {
                    type: types.TopicsInputType,
                }
            },
            resolve: (root, {range, topics}, {regionId}) => {
                return {range, topics, regionId}
            }
        }
    },
    interfaces: [nodeInterface]
});

const consumerField = {
    type: ConsumerType,
    resolve: (root, args, context) => {
        return models.UserAccount.findOne({
            where: {
                userId: context.userId,
            },
            include: helpers.includes.UserAccount.basicConsumer,
        }).then((user) => user ? { consumer: true } : null).catch((e) => winston.warn(e));
    },
}

const CreatorType = new ql.GraphQLObjectType({
    name: 'Creator',
    fields: {
        id: relayql.globalIdField('Creator', (root, args, context) => context.userId),
        topics: {
            type: new ql.GraphQLList(types.TopicType),
            resolve: () => {
                return models.Topic.findAll().catch((e) => winston.warn(e));
            },
        },
        entries: {
            type: entryConnectionDefinition.connectionType,
            args: relayql.connectionArgs,
            resolve: (root, args, context) => {
                return relayql.connectionFromPromisedArray(models.Entry.findAll({
                    where: {
                        ownerId: context.userId,
                    },
                    include: helpers.includes.Entry.basic,
                    order: [
                        ['createdAt', 'DESC']
                    ],
                }).catch((e) => winston.warn(e)), args);
            },
        },
        sharing: {
            type: ql.GraphQLBoolean,
            resolve: (root, args, context) => {
                return context.sharing;
            },
        },
        seenSharing: {
            type: ql.GraphQLBoolean,
            resolve: (root, args, context) => {
                return context.seenSharing;
            },
        },
        seenIntroduction: {
            type: ql.GraphQLBoolean,
            resolve: (root, args, context) => {
                return context.seenIntroduction;
            },
        },
        happyCount: {
            type: ql.GraphQLInt,
            resolve: (root, args, context) => {
                return spool.getCreatorSentimentCount("happy", context.userId);
            },
        },
        sadCount: {
            type: ql.GraphQLInt,
            resolve: (root, args, context) => {
                return spool.getCreatorSentimentCount("sad", context.userId);
            },
        },
    },
    interfaces: [nodeInterface]
});

const creatorField = {
    type: CreatorType,
    resolve: (root, args, context) => {
        return models.UserAccount.findOne({
            where: {
                userId: context.userId,
            },
            include: helpers.includes.UserAccount.basicCreator,
        }).then((user) => user ? { creator: true } : null).catch((e) => winston.warn(e));
    },
}

const userField = {
    type: UserType,
    resolve: (root, args, context) => {
        return models.UserAccount.findOne({
            where: {
                userId: context.userId,
            },
            include: helpers.includes.UserAccount.leftRoleAndRegion,
        }).catch((e) => winston.warn(e));
    },
}

const MetaType = new ql.GraphQLObjectType({
    name: 'Meta',
    fields: {
        regions: {
            type: new ql.GraphQLList(types.RegionDefinitionType),
            resolve: () => {
                return models.Region.findAll().catch((e) => winston.warn(e));
            },
        },
        roles: {
            type: new ql.GraphQLList(types.RoleDefinitionType),
            resolve: () => {
                return models.Role.findAll().catch((e) => winston.warn(e));
            },
        },
    },
});

const metaField = {
    type: MetaType,
    resolve: () => true,
}

const createEntry = relayql.mutationWithClientMutationId({
    name: 'CreateEntry',
    inputFields: {
        entry: {
            type: types.EntryInputType
        }
    },
    outputFields: {
        creator: creatorField,
        entryEdge: {
            type: entryConnectionDefinition.edgeType,
            resolve: ({entry}, args, context) => {
                return models.Entry.findAll({
                    where: {
                        ownerId: context.userId,
                    }
                }).then(function(entries) {
                    var indexOfEntry = _.findIndex(entries, { entryId: entry.entryId });
                    return {
                        cursor: relayql.offsetToCursor(indexOfEntry),
                        node: entry,
                    };
                }).catch((e) => winston.warn(e));
           },
        },
    },
    mutateAndGetPayload: function mutateEntryPayload({entry}, context) {
        if (!context.Role || context.Role.type !== "creator") {
            winston.info(`Failed createEntry mutation due to role mismatch`);
            return {};
        }
        var media = entry.media;
        var topics = entry.topics;
        var sentiment = entry.sentiment;
        return spool.makeEntry(context.userId, media, sentiment, topics)
    }
});

const updateUser = relayql.mutationWithClientMutationId({
    name: 'UpdateUser',
    inputFields: {
        user: {
            type: types.UserInputType
        }
    },
    outputFields: {
        user: userField
    },
    mutateAndGetPayload: function mutateUserPayload({user}, context) {
        return spool.updateUser(context.userId, user.region, user.roleSecret);
    }
}); 

const deleteEntry = relayql.mutationWithClientMutationId({
    name: 'DeleteEntry',
    inputFields: {
        entryId: {
            type: ql.GraphQLInt,
        }
    },
    outputFields: {
        creator: creatorField,
        deletedEntryId: {
            type: ql.GraphQLInt,
            resolve: (entryId) => entryId,
        }
    },
    mutateAndGetPayload: function mutateUserPayload({entryId}, context) {
        const ownerId = context.userId;
        const { id } = relayql.fromGlobalId(entryId);
        return models.Entry.destroy({
            where: {
                entryId: id,
                ownerId,
            },
        }).catch((e) => winston.warn(e));
    }
}); 

module.exports = {
    fields: {
        nodeField,
        creatorField,
        consumerField,
        userField,
        metaField,
    },
    mutations: {
        createEntry,
        updateUser,
        deleteEntry,
    }
}
