const ql = require('graphql');
const relayql = require('graphql-relay');
const types = require('./types.js');
const db = require('../database/database.js');
const models = require('../database/models.js');
const _ = require('lodash');

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
        }
    },
    /* resolve given an object */
    (obj) => {
        if (obj.media) {
            // eslint-disable-next-line no-use-before-define
            return EntryType
        } else {
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
            type: types.TopicType,
            // we are popping a single type off the list since we are only supporting a single topic for now
            resolve: (entry) => models.Topic.findByEntryId(db, entry.id).then((topics) => topics.shift())
        }
    },
    interfaces: [nodeInterface]
});

var entryConnectionDefinition =
    relayql.connectionDefinitions({nodeType: EntryType});

const ViewerType = new ql.GraphQLObjectType({
    name: 'Viewer',
    fields: {
        id: relayql.globalIdField(),
        entries: {
            type: entryConnectionDefinition.connectionType,
            args: relayql.connectionArgs,
            resolve: (viewer, args, context) => relayql.connectionFromPromisedArray(models.Entry.findByOwnerId(db, context.id), args)
        }
    },
    interfaces: [nodeInterface]
});

const viewerField = {
    type: ViewerType,
    resolve: (root, args, context) =>  models.User.findById(db, context.id).then((users) => users.shift()),
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

module.exports = {
    fields: {
        nodeField,
        viewerField
    },
    mutations: {
        createEntry
    }
}
