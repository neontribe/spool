const ql = require('graphql');
const relayql = require('graphql-relay');
const types = require('./types.js');
const db = require('../database/database.js');

var {nodeInterface, nodeField} = relayql.nodeDefinitions(
    /* retrieve given an id and type */
    (globalId) => {
        // keeping unusde 'type' here since it is important later and easy to forget
        // eslint-disable-next-line no-unused-vars
        var {type, id} = relayql.fromGlobalId(globalId);
        return db.lib.Entry.findById(db.connect(), id).then((entries) => entries.shift());
    },
    /* resolve given an object */
    // eslint-disable-next-line no-use-before-define
    (obj) => EntryType);

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
            resolve: (entry) => db.lib.Topic.findByEntryId(db.connect(), entry.id).then((topics) => topics.shift())
        }
    },
    interfaces: [nodeInterface]
});

const createEntry = relayql.mutationWithClientMutationId({
    name: 'CreateEntry',
    inputFields: {
        entry: {
            type: types.EntryInputType
        }
    },
    outputFields: {
        entry: {
            type: EntryType,
            resolve: (entry) => {
                return entry;
            }
        }
    },
    mutateAndGetPayload: ({entry}) => { 
        return db.lib.Entry.create(db.connect(), entry);
    }
});

const entryByOwnerField = {
    type: new ql.GraphQLList(EntryType),
    args: {
        id: { type: ql.GraphQLInt }
    },
    resolve: (_, {id}) => db.lib.Entry.findByOwnerId(db.connect(), id)
} ;

module.exports = {
    fields: {
        nodeField,
        entryByOwnerField
    },
    mutations: {
        createEntry
    }
}