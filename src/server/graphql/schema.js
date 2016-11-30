const ql = require('graphql');
const relay = require('./relay');

const QueryType = new ql.GraphQLObjectType({
    name: 'Query',
    fields: {
        node: relay.fields.nodeField,
        creator: relay.fields.creatorField,
        consumer: relay.fields.consumerField,
        user: relay.fields.userField,
        meta: relay.fields.metaField,
    },
});

const MutationType = new ql.GraphQLObjectType({
    name: 'Mutations',
    fields: {
        createEntry: relay.mutations.createEntry,
        updateUser: relay.mutations.updateUser,
    },
});

module.exports = new ql.GraphQLSchema({
    query: QueryType,
    mutation: MutationType,
});
