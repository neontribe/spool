const ql = require('graphql');
const types = require('./types.js');

module.exports = new ql.GraphQLSchema({
    query: types.QueryType
});
