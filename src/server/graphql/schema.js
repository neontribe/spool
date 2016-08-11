const ql = require('graphql');
const db = require('../database/database.js');
const types = require('./types.js');

module.exports = new ql.GraphQLSchema({
    query: new ql.GraphQLObjectType({
        name: 'Query',
        fields: {
            entriesByOwner: {
                type: new ql.GraphQLList(types.EntryType),
                args: {
                    id: { type: ql.GraphQLInt }
                },
                resolve: (_, {id}) => db.lib.Entry.findByOwnerId(db.connect(), id)
            }
        }
    })
});
