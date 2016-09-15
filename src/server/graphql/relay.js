const ql = require('graphql');
const relayql = require('graphql-relay');
const types = require('./types.js');
const db = require('../database/database.js');
const models = require('../database/models.js');
const moment = require('moment');
const _ = require('lodash');
const spool = require('../spool.js');

var {nodeInterface, nodeField} = relayql.nodeDefinitions(
    /* retrieve given an id and type */
    (globalId) => {
        // keeping unusde 'type' here since it is important later and easy to forget
        // eslint-disable-next-line no-unused-vars
        var {type, id} = relayql.fromGlobalId(globalId);
        if (type === 'Entry') {
            return models.Entry.findById(db, id).then((entries) => entries.shift());
        } else if (type === 'Viewer') {
            return models.User.findById(db, id).then((users) => users.shift());
        } else if (type === 'UserRequest') {
            return models.UserRequest.findById(db, id).then((userRequests) => userRequests.shift());
        } else if (type === 'Request') {
            return models.Request.findById(db, id).then((requests) => requests.shift());
        }
    },
    /* resolve given an object */
    (obj) => {
        if (obj instanceof models.Entry) {
            // eslint-disable-next-line no-use-before-define
            return EntryType
        } else if (obj instanceof models.UserRequest) {
            // eslint-disable-next-line no-use-before-define
            return UserRequestType
        } else if (obj instanceof models.Request) {
            // eslint-disable-next-line no-use-before-define
            return RequestType
        } else {
            // eslint-disable-next-line no-use-before-define
            return ViewerType
        }
    });

const EntryType = new ql.GraphQLObjectType({
    name: 'Entry',
    fields: {
        id: relayql.globalIdField(),
        _id: { type: ql.GraphQLInt },
        media: {
            type: types.MediaType,
            resolve: (entry) =>  entry.media
        },
        author: {
            type: types.UserType,
            resolve: (entry) => entry.author
        },
        owner: {
            type: types.UserType,
            resolve: (entry) => entry.owner
        },
        sentiment: {
            type: types.SentimentType,
            resolve: (entry) => entry.sentiment
        },
        topic: {
            type: new ql.GraphQLList(types.TopicType),
            resolve: (entry) => models.Topic.findByEntryId(db, entry.id)
        },
        timestamp: {
            type: ql.GraphQLString,
            resolve: (entry) => entry.timestamp.format()
        }
    },
    interfaces: [nodeInterface]
});

var entryConnectionDefinition =
    relayql.connectionDefinitions({nodeType: EntryType});

const getSentimentCount = function (sentimentType, userId) {
    return models.Entry.findByOwnerId(db, userId).then(function(result) {
        return result.reduce(function(reduction, entry) {
            if (entry.sentiment.type === sentimentType) {
                reduction++;
            }
            return reduction;
        }, 0);
    });
}

const RequestType = new ql.GraphQLObjectType({
    name: 'Request',
    fields: {
        id: relayql.globalIdField(),
        _id: {
            type: ql.GraphQLInt,
            resolve: (request) => request._id
        },
        from: {
            type: ql.GraphQLString,
            resolve: (request) => request.from
        },
        to: {
            type: ql.GraphQLString,
            resolve: (request) => request.to
        },
        region: {
            type: ql.GraphQLString,
            resolve: (request) => request.region
        },
        user: {
            type: types.UserType,
            resolve: (request) => request.user
        },
        topic: {
            type: new ql.GraphQLList(types.TopicType),
            resolve: (request) => models.Topic.findByRequestId(db, request._id)
        },
        reason: {
            type: ql.GraphQLString,
            resolve: (request) => request.reason
        },
        name: {
            type: ql.GraphQLString,
            resolve: (request) => request.name
        },
        org: {
            type: ql.GraphQLString,
            resolve: (request) => request.org
        },
        avatar: {
            type: ql.GraphQLString,
            resolve: (request) => request.avatar
        }
        //userRequests ? :-)
    },
    interfaces: [nodeInterface]
});

const UserRequestType = new ql.GraphQLObjectType({
    name: 'UserRequest',
    fields: {
        id: relayql.globalIdField(),
        _id: {
            type: ql.GraphQLInt,
            resolve: (userRequest) => userRequest._id
        },
        request: {
            type: RequestType,
            resolve: (userRequest) => userRequest.request
        },
        seen: {
            type: ql.GraphQLBoolean,
            resolve: (userRequest) => userRequest.seen
        }
    },
    interfaces: [nodeInterface]
});

var userRequestConnectionDefinition =
    relayql.connectionDefinitions({nodeType: UserRequestType});

const CreatorRoleType = new ql.GraphQLObjectType({
    name: 'Creator',
    fields: {
        entries: {
            type: entryConnectionDefinition.connectionType,
            args: relayql.connectionArgs,
            resolve: (creator, args, context) => relayql.connectionFromPromisedArray(models.Entry.findByOwnerId(db, creator.id), args)
        },
        requests: {
            type: userRequestConnectionDefinition.connectionType,
            args: relayql.connectionArgs,
            resolve: (creator, args, context) => relayql.connectionFromPromisedArray(models.UserRequest.findByUserNotSeen(db, creator.id), args)
        },
        happyCount: {
            type: ql.GraphQLInt,
            resolve: (creator, args, context) => getSentimentCount("happy", creator.id)
        },
        sadCount: {
            type: ql.GraphQLInt,
            resolve: (creator, args, context) => getSentimentCount("sad", creator.id)
        }
    }
});

const CreatorActivityCountType = new ql.GraphQLObjectType({
    name: 'CreatorActivityCount',
    fields: {
        active: {
            type: ql.GraphQLInt,
            resolve: (counts) => counts.active
        },
        stale: {
            type: ql.GraphQLInt,
            resolve: (counts) => counts.stale
        }
    }
});

const ConsumerRoleType = new ql.GraphQLObjectType({
    name: 'Consumer',
    fields: {
        creatorActivityCount: {
            type: CreatorActivityCountType,
            args: {
                range: {
                    type: types.DateRangeInputType,
                }
            },
            resolve: function(consumer, {range}) {
                var fromDate = moment(range.from);
                var toDate = moment(range.to);
                return models.Count.findCreatorActivity(db, fromDate, toDate)
            }
        },
        topicCounts: {
            type: new ql.GraphQLList(types.TopicCountType),
            args: {
                range: {
                    type: types.DateRangeInputType,
                }
            },
            resolve: function(consumer, {range}) {
                var fromDate = moment(range.from);
                var toDate = moment(range.to);
                return models.Count.findTopicCounts(db, fromDate, toDate)
            }
        }
    }
});

const MissingRoleType = new ql.GraphQLObjectType({
    name: 'Missing',
    fields: {
        information: {
            type: new ql.GraphQLList(ql.GraphQLString),
            resolve: () => ['location', 'role']
        }
    }
});

const RoleType = new ql.GraphQLUnionType({
    name: 'Role',
    types: [ CreatorRoleType, ConsumerRoleType, MissingRoleType ],
    resolveType(user) {
        if (!user.role) {
            return MissingRoleType;
        }
        if (user.role === 'creator') {
            return CreatorRoleType;
        }
        if (user.role === 'consumer') {
            return ConsumerRoleType;
        }
    }
});

const ViewerType = new ql.GraphQLObjectType({
    name: 'Viewer',
    fields: {
        id: relayql.globalIdField(),
        role: {
            type: RoleType,
            resolve: (viewer, args, context) => viewer,
        },
        region: {
            type: ql.GraphQLString,
            resolve: (viewer, args, context) => viewer.region,
        },
        topics: {
            type: new ql.GraphQLList(types.TopicType),
            resolve: () => models.Topic.findAll(db)
        }
    },
    interfaces: [nodeInterface]
});

const viewerField = {
    type: ViewerType,
    resolve: (root, args, context) =>  models.User.findById(db, context.id).then((users) => users.shift())
}

const MetaType = new ql.GraphQLObjectType({
    name: 'Meta',
    fields: {
        regions: {
            type: new ql.GraphQLList(ql.GraphQLString),
            resolve: () => models.Region.findAll(db)
        },
        roles: {
            type: new ql.GraphQLList(types.RoleDefinitionType),
            resolve: () => models.Role.findAll(db)
        }
    }
});

const metaField = {
    type: MetaType,
    resolve: () => true
}

const createEntry = relayql.mutationWithClientMutationId({
    name: 'CreateEntry',
    inputFields: {
        entry: {
            type: types.EntryInputType
        }
    },
    outputFields: {
        viewer: viewerField,
        entryEdge: {
            type: entryConnectionDefinition.edgeType,
            resolve: (entry, args, context) => {
                return models.Entry.findByOwnerId(db, context.id).then(function(rows) {
                    var indexOfEntry = _.findIndex(rows, { '_id': entry._id });
                    return {
                        cursor: relayql.offsetToCursor(indexOfEntry),
                        node: entry,
                    }
                });
           }
        }
    },
    mutateAndGetPayload: function mutateEntryPayload({entry}, context) {
        entry.author = context.id;
        entry.owner = context.id;
        return models.Entry.create(db, entry);
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
        viewer: viewerField
    },
    mutateAndGetPayload: function mutateUserPayload({user}, context) {
        return models.User.updateById(db, context.id, user.roleSecret, user.region).then(function() {
            return {};
        });
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
        viewer: viewerField
    },
    mutateAndGetPayload: function mutateEntryPayload({request}, context) {
        if (context.role !== "consumer") {
            return {};
        }
        request.userId = context.id;
        request.range.from = moment(request.range.from);
        request.range.to = moment(request.range.to);
        request.region = context.region;
        // make new request
        return spool.makeRequest(request).then(function() {
            return {};
        });
    }
});

module.exports = {
    fields: {
        nodeField,
        viewerField,
        metaField,
    },
    mutations: {
        createEntry,
        createRequest,
        updateUser,
    }
}
