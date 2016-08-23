const ql = require('graphql');
const models = require('../database/models');

const MediaType = new ql.GraphQLObjectType({
    name: 'Media',
    fields: {
        text: { type: ql.GraphQLString },
        video: { 
            type: ql.GraphQLString,
            resolve: (media) => media.video ? '/s3/assets/'+media.video : null
        },
        thumbnail: { 
            type: ql.GraphQLString,
            resolve: (media) => media.thumbnail ? '/s3/assets/'+media.thumbnail : null
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
        type: { type: ql.GraphQLString, resolve: (topic) => topic.type },
        name: { type: ql.GraphQLString, resolve: (topic) => topic.name }
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
        topic: { type: new ql.GraphQLList(ql.GraphQLString) }
    }
});

module.exports = {
    MediaType,
    UserType,
    SentimentType,
    TopicType,
    MediaInputType,
    EntryInputType
};
