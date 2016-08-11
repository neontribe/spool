const ql = require('graphql');
const db = require('./database.js');

const VideoMediaType = new ql.GraphQLObjectType({
    name: 'VideoMedia',
    fields: {
        text: { type: ql.GraphQLString }
    }
});

const ImageMediaType = new ql.GraphQLObjectType({
    name: 'ImageMedia',
    fields: {
        text: { type: ql.GraphQLString }
    }
});

const TextMediaType = new ql.GraphQLObjectType({
    name: 'TextMedia',
    fields: {
        text: { type: ql.GraphQLString, resolve: (data) => data.text }
    }
});

const MediaType = new ql.GraphQLUnionType({
    name: 'Media',
    types: [ VideoMediaType, ImageMediaType, TextMediaType ],
    resolveType(value) {
        return TextMediaType;
    }
});

const UserType = new ql.GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: ql.GraphQLInt },
        firstName: { type: ql.GraphQLString },
        lastName: { type: ql.GraphQLString },
        email: { type: ql.GraphQLString }
    }
});

const EntryType = new ql.GraphQLObjectType({
    name: 'Entry',
    fields: {
        id: { type: ql.GraphQLInt },
        media: { 
            type: MediaType,
            resolve: (diary) =>  diary.media
        },
        author: { 
            type: UserType,
            resolve: (diary) => diary.author
        },
        owner: { 
            type: UserType,
            resolve: (diary) => diary.owner
        }
    }
});

module.exports = new ql.GraphQLSchema({
    query: new ql.GraphQLObjectType({
        name: 'Query',
        fields: {
            entriesByOwner: {
                type: new ql.GraphQLList(EntryType),
                args: {
                    id: { type: ql.GraphQLInt }
                },
                resolve: (_, {id}) => db.Entry.findByOwnerId(db.connect(), id)
            }
        }
    })
});
