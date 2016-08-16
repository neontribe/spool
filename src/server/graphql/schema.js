const ql = require('graphql');
const relay = require('./relay');

const QueryType = new ql.GraphQLObjectType({
    name: 'Query',
    fields: {
        node: relay.fields.nodeField,
        entries: relay.fields.entriesField
    },
})

const MutationType = new ql.GraphQLObjectType({
    name: 'Mutations',
    fields: {
        createEntry: relay.mutations.createEntry
    }
});

module.exports = new ql.GraphQLSchema({
    query: QueryType,
    mutation: MutationType
});
