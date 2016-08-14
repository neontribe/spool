const ql = require('graphql');
const relay = require('./relay');

const QueryType = new ql.GraphQLObjectType({
    name: 'Query',
    fields: {
        node: relay.fields.nodeField,
        entryByOwner: relay.fields.entryByOwnerField
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
