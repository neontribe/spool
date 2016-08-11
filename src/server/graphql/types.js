const ql = require('graphql');

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
        text: { type: ql.GraphQLString, resolve: (media) => media.text }
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
            resolve: (entry) =>  entry.media
        },
        author: { 
            type: UserType,
            resolve: (entry) => entry.author
        },
        owner: { 
            type: UserType,
            resolve: (entry) => entry.owner
        }
    }
});

module.exports = {
    EntryType
}
