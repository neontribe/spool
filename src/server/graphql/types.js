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
        id: { type: ql.GraphQLInt }
    }
});


const SentimentType = new ql.GraphQLObjectType({
    name: 'Sentiment',
    fields: {
        type: { type: ql.GraphQLString, resolve: (sentiment) => sentiment.type }
    }
});

const TopicType = new ql.GraphQLObjectType({
    name: 'Topic',
    fields: {
        type: { type: ql.GraphQLString, resolve: (topic) => topic.type }
    }
});

/*
 * GraphQL does not support union input types
 * So the resolution of union types can be done run-time
 * https://github.com/graphql/graphql-js/issues/207
 */
const MediaInputType = new ql.GraphQLInputObjectType({
    name: 'MediaInput',
    fields: {
        text: { type: ql.GraphQLString }
    }
});

const EntryInputType = new ql.GraphQLInputObjectType({
    name: 'EntryInput',
    fields: {
        media: { type: MediaInputType },
        author: { type: ql.GraphQLInt },
        owner: { type: ql.GraphQLInt },
        sentiment: { type: ql.GraphQLString },
        topic: { type: ql.GraphQLString }
    }
});

module.exports = {
    VideoMediaType,
    ImageMediaType,
    TextMediaType,
    MediaType,
    UserType,
    SentimentType,
    TopicType,
    MediaInputType,
    EntryInputType
};
