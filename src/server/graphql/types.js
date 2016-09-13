const ql = require('graphql');
require('../database/models');

const MediaType = new ql.GraphQLObjectType({
    name: 'Media',
    fields: {
        text: { type: ql.GraphQLString },
        video: {
            type: ql.GraphQLString,
            resolve: (media) => media.video ? '/s3/assets/'+media.video : null
        },
        videoThumbnail: {
            type: ql.GraphQLString,
            resolve: (media) => media.videoThumbnail ? '/s3/assets/'+media.videoThumbnail : null
        },
        image: {
            type: ql.GraphQLString,
            resolve: (media) => media.image ? '/s3/assets/'+media.image : null
        },
        imageThumbnail: {
            type: ql.GraphQLString,
            resolve: (media) => media.imageThumbnail ? '/s3/assets/'+media.imageThumbnail : null
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

const RoleDefinitionType = new ql.GraphQLObjectType({
    name: 'RoleDefinition',
    fields: {
        type: { type: ql.GraphQLString, resolve: (role) => role.type },
        name: { type: ql.GraphQLString, resolve: (role) => role.name },
        secret: { type: ql.GraphQLString, resolve: (role) => role.secret }
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
        videoThumbnail: { type: ql.GraphQLString },
        image: { type: ql.GraphQLString },
        imageThumbnail: { type: ql.GraphQLString }
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

const DateRangeInputType = new ql.GraphQLInputObjectType({
    name: 'DateRangeInput',
    fields: {
        from: {
            type: new ql.GraphQLNonNull(ql.GraphQLString)
        },
        to: {
            type: new ql.GraphQLNonNull(ql.GraphQLString)
        }
    }
});

const RequestInputType = new ql.GraphQLInputObjectType({
    name: 'RequestInput',
    fields: {
        range: {
            type: DateRangeInputType
        }
    }
});

const UserInputType = new ql.GraphQLInputObjectType({
    name: 'UserInput',
    fields: {
        region: {
            type: new ql.GraphQLNonNull(ql.GraphQLString)
        },
        roleSecret: {
            type: new ql.GraphQLNonNull(ql.GraphQLString)
        }
    }
});

module.exports = {
    MediaType,
    UserType,
    SentimentType,
    TopicType,
    RoleDefinitionType,
    MediaInputType,
    EntryInputType,
    RequestInputType,
    DateRangeInputType,
    UserInputType,
};
