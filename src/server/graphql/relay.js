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
        if (type === 'Creator' || type === 'Consumer' || type === 'User') {
            // if we are a generic user type just go ahead and grab it
            return models.UserAccount.findOne({
                where: {
                    userId: context.userId,
                },
                include: [{ model: models.Role }, { model: models.Region }],
            }).catch((e) => winston.warn(e));
        }
        if (type === 'Entry') {
            if(!context.Role) {
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
                // only return an Entry node if it part of a user request
                // whos parent request is owned by the consumer
                return models.Entry.findOne({
                    where: {
                        entryId: id,
                    },
                    include: [
                        {
                            model: models.EntryUserRequest,
                            as: 'EntryUserRequest',
                            include: [
                                {
                                    model: models.UserRequest,
                                    as: 'UserRequest',
                                    include: [
                                        {
                                            model: models.Request,
                                            as: 'Request',
                                            where: {
                                                userId: context.userId
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        ...helpers.includes.Entry.basic
                    ],
                }).catch((e) => winston.warn(e));
            }
        }
        if (type === 'UserRequest') {
            if(!context.Role) {
                return null;
            }
            // only creators can access user request for themselves
            if(context.Role.type === 'creator') {
                return models.UserRequest.findOne({
                    where: {
                        userRequestId: id,
                        userId: context.userId,
                    },
                }).catch((e) => winston.warn(e));
            }
        }
        if (type === 'Request') {
            if(!context.Role) {
                return null;
            }
            // only consumers can access requests for themselves
            if(context.Role.type === 'consumer') {
                return models.Request.findOne({
                    where: {
                        requestId: id,
                        userId: context.userId,
                    },
                    include: helpers.includes.Request.basic
                }).catch((e) => winston.warn(e));
            }
        }
        return null;
    },
    /* resolve given an object */
    (obj) => {
        if (obj instanceof models.Entry.Instance) {
            // eslint-disable-next-line no-use-before-define
            return EntryType
        } else if (obj instanceof models.UserRequest.Instance) {
            // eslint-disable-next-line no-use-before-define
            return UserRequestType
        } else if (obj instanceof models.Request.Instance) {
            // eslint-disable-next-line no-use-before-define
            return RequestType
        } else if (obj instanceof models.UserAccount.Instance){
            winston.warn('nodeDefinitions are unresolvable for UserAccount instances');
            return null;
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

const RequestType = new ql.GraphQLObjectType({
    name: 'Request',
    // function since we need circular structures here (utilizing var hoisting)
    fields: () => ({
        id: relayql.globalIdField('Request', (root) => root.requestId),
        from: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return moment(root.from).format();
            },
        },
        to: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return moment(root.to).format();
            },
        },
        region: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return root.Region && root.Region.type;
            },
        },
        topics: {
            type: new ql.GraphQLList(types.TopicType),
            resolve: (root) => {
                return root.RequestTopicTopics;
            },
        },
        reason: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return root.reason;
            },
        },
        name: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return root.name;
            },
        },
        org: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return root.org;
            },
        },
        avatar: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return root.avatar;
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
        },
        entries: {
            type: entryConnectionDefinition.connectionType,
            args: relayql.connectionArgs,
            resolve: (root, args, context) => {
                // if they are not a consumer, they can't see entries attached to this
                if(!context.Role || context.Role.type !== 'consumer') {
                    return relayql.connectionFromArray([], args);
                }
                var entries = models.EntryUserRequest.findAll({
                    where: {
                        access: true,
                    },
                    include: [
                        {
                            model: models.UserRequest,
                            as: 'UserRequest',
                            where: {
                                requestId: root.requestId,
                            },
                        },
                        {
                            model: models.Entry,
                            as: 'Entry',
                            include: helpers.includes.Entry.basic,
                        },
                    ],
                })
                .then((results) => results.map((result) => result.Entry))
                .catch((e) => winston.warn(e));
                return relayql.connectionFromPromisedArray(entries, args);
            },
        }
    }),
    interfaces: [nodeInterface]
});
var requestConnectionDefinition =
    relayql.connectionDefinitions({nodeType: RequestType});

const UserRequestType = new ql.GraphQLObjectType({
    name: 'UserRequest',
    fields: {
        id: relayql.globalIdField('UserRequest', (root) => root.userRequestId),
        request: {
            type: RequestType,
            resolve: (root) => {
                return root.Request;
            },
        },
        seen: {
            type: ql.GraphQLBoolean,
            resolve: (root) => {
                return root.seen;
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
var userRequestConnectionDefinition =
    relayql.connectionDefinitions({nodeType: UserRequestType});

const EntryRequest = new ql.GraphQLObjectType({
    name: 'EntryRequest',
    fields: {
        access: {
            type: ql.GraphQLBoolean,
            resolve: (root) => {
                return root.access;
            },
        },
        userRequest: {
            type: UserRequestType,
            resolve: (root) => {
                return root.UserRequest
            }
        }
    },
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
        },
        requests: {
            type: new ql.GraphQLList(EntryRequest),
            resolve: (root, args, context) => {
                //if they are not a creator, they can't see requests attached to this
                if(!context.Role || context.Role.type !== 'creator') {
                    return [];
                }
                return models.EntryUserRequest.findAll({
                    where: {
                        entryId: root.entryId,
                    },
                    include: [
                        {
                            model: models.UserRequest,
                            as: 'UserRequest',
                            include: helpers.includes.UserRequest.basic
                        }
                    ]
                }).catch((e) => winston.warn(e));
            }
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

const ConsumerType = new ql.GraphQLObjectType({
    name: 'Consumer',
    fields: {
        id: relayql.globalIdField('Consumer', (root) => root.userId),
        creatorActivityCount: {
            type: CreatorActivityCountType,
            args: {
                range: {
                    type: types.DateRangeInputType,
                }
            },
            resolve: function(root, {range}) {
                var from = moment(range.from);
                var to = moment(range.to);
                var regionId = root.regionId
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
                var regionId = root.regionId;

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
        requests: {
            type: requestConnectionDefinition.connectionType,
            args: relayql.connectionArgs,
            resolve: (root, args, context) => {
                return relayql.connectionFromPromisedArray(models.Request.findAll({
                    where: {
                        userId: root.userId
                    },
                    include: helpers.includes.Request.basic
                }).catch((e) => winston.warn(e)), args);
            },
        },
    }
});
const consumerField = {
    type: ConsumerType,
    resolve: (root, args, context) => {
        return models.UserAccount.findOne({
            where: {
                userId: context.userId,
            },
            include: helpers.includes.UserAccount.basicConsumer,
        }).catch((e) => winston.warn(e));
    },
}

const CreatorType = new ql.GraphQLObjectType({
    name: 'Creator',
    fields: {
        id: relayql.globalIdField('Creator', (root) => root.userId),
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
                        ownerId: root.userId,
                    },
                    include: helpers.includes.Entry.basic
                }).catch((e) => winston.warn(e)), args);
            },
        },
        requests: {
            type: userRequestConnectionDefinition.connectionType,
            args: relayql.connectionArgs,
            resolve: (root, args, context) => {
                return relayql.connectionFromPromisedArray(models.UserRequest.findAll({
                    where: {
                        userId: root.userId,
                        seen: false
                    },
                    include: helpers.includes.UserRequest.basic
                }).catch((e) => winston.warn(e)), args);
            },
        },
        happyCount: {
            type: ql.GraphQLInt,
            resolve: (root, args, context) => {
                return spool.getCreatorSentimentCount("happy", root.userId);
            },
        },
        sadCount: {
            type: ql.GraphQLInt,
            resolve: (root, args, context) => {
                return spool.getCreatorSentimentCount("sad", root.userId);
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
            include: helpers.includes.UserAccount.basic,
        }).catch((e) => winston.warn(e));
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
            return {};
        }
        var media = entry.media;
        var topics = entry.topics;
        var sentiment = entry.sentiment;
        return spool.makeEntry(context.userId, media, sentiment, topics)
    }
});

const updateUserRequest = relayql.mutationWithClientMutationId({
    name: 'UpdateUserRequest',
    inputFields: {
        userRequest: {
            type: types.UserRequestInputType
        },
    },
    outputFields: {
        creator: creatorField,
        userRequestId: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return root.userRequestId;
            }
        },
    },
    mutateAndGetPayload: function mutateEntryPayload({userRequest}, context) {
        if (!context.Role || context.Role.type !== "creator") {
            return {};
        }
        return new Promise(function(resolve, reject) {
            var id = relayql.fromGlobalId(userRequest.id).id;
            models.UserRequest.findOne({
                where: {
                    userRequestId: id,
                    userId: context.userId,
                }
            }).then(function (request) {
                if(!request) {
                    resolve({});
                } else {
                    // The request will always be hidden, for now
                    resolve(spool.updateUserRequest(id, userRequest.hide, userRequest.access)
                            .then(() => {
                                return {userRequestId: userRequest.id};
                            }));
                }
            }).catch((e) => winston.warn(e));
        }).catch((e) => winston.warn(e));
    }
});

const updateEntryRequest = relayql.mutationWithClientMutationId({
    name: 'UpdateEntryRequest',
    inputFields: {
        entryId: {
            type: new ql.GraphQLNonNull(ql.GraphQLString),
        },
        userRequestId: {
            type: new ql.GraphQLNonNull(ql.GraphQLString),
        },
        access: {
            type: ql.GraphQLBoolean
        },
    },
    outputFields: {
      creator: creatorField,
    },
    mutateAndGetPayload: function mutateEntryPayload({entryId, userRequestId, access}, context) {
        if (!context.Role || context.Role.type !== "creator") {
            return {};
        }
        return new Promise(function(resolve, reject) {
            userRequestId = relayql.fromGlobalId(userRequestId).id;
            entryId = relayql.fromGlobalId(entryId).id;
            models.Entry.findOne({
                where: {
                    entryId: entryId,
                    ownerId: context.userId
                }
            }).then(function(entry) {
                if(!entry) {
                    resolve({});
                } else {
                    models.EntryUserRequest.update({
                        access,
                    }, {
                        where: {
                            entryId: entryId,
                            userRequestId: userRequestId,
                        }
                    }).then(() => resolve({}));
                }
            }).catch((e) => winston.warn(e));
        }).catch((e) => winston.warn(e));
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

const createRequest = relayql.mutationWithClientMutationId({
    name: 'CreateRequest',
    inputFields: {
        request: {
            type: types.RequestInputType
        }
    },
    outputFields: {
        consumer: consumerField
    },
    mutateAndGetPayload: function mutateRequestPayload({request}, context) {
        if (!context.Role || context.Role.type !== "consumer") {
            return {};
        }
        var requestData = {
            userId: context.userId,
            regionId: context.regionId,
            from: moment(request.range.from).format(),
            to: moment(request.range.to).format(),
            avatar: request.avatar,
            name: request.name,
            org: request.org,
            reason: request.reason,
        };
        var topics = request.topics;
        // make new request
        return spool.makeRequest(requestData, topics).then(function() {
            return {};
        });
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
        createRequest,
        updateUser,
        updateUserRequest,
        updateEntryRequest,
    }
}
