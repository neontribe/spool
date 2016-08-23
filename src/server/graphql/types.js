const ql = require('graphql');
const models = require('../database/models');

const VideoMediaType = new ql.GraphQLObjectType({
    name: 'VideoMedia',
    fields: {
        video: { 
            type: ql.GraphQLString,
            resolve: (media) => '/s3/assets/'+media.video
        },
        thumbnail: { 
            type: ql.GraphQLString,
            resolve: (media) => '/s3/assets/'+media.thumbnail
        }
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
        if(value instanceof models.TextMedia) {
            return TextMediaType;
        } else if (value instanceof models.VideoMedia) {
            return VideoMediaType;
        }
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
 *
 * todo Union type for inputs
 */
const MediaInputType = new ql.GraphQLInputObjectType({
    name: 'MediaInput',
    fields: {
        text: { type: ql.GraphQLString },
        video: { type: ql.GraphQLString },
        thumbnail: { type: ql.GraphQLString },
        image: { type: ql.GraphQLString }
    }
});

const EntryInputType = new ql.GraphQLInputObjectType({
    name: 'EntryInput',
    fields: {
        media: { type: MediaInputType },
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
