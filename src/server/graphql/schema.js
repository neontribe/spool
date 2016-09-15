const ql = require('graphql');
const relay = require('./relay');

const QueryType = new ql.GraphQLObjectType({
    name: 'Query',
    fields: {
        node: relay.fields.nodeField,
        viewer: relay.fields.viewerField,
        meta: relay.fields.metaField,
    },
})

const MutationType = new ql.GraphQLObjectType({
    name: 'Mutations',
    fields: {
        createEntry: relay.mutations.createEntry,
        createRequest: relay.mutations.createRequest,
        updateUser: relay.mutations.updateUser,
    }
});

module.exports = new ql.GraphQLSchema({
    query: QueryType,
    mutation: MutationType
});
