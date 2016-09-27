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

const RegionDefinitionType = new ql.GraphQLObjectType({
    name: 'RegionDefinitionType',
    fields: {
        type: { type: ql.GraphQLString, resolve: (region) => region.type },
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
        topics: { type: new ql.GraphQLList(ql.GraphQLString) }
    }
});

const UserRequestInputType = new ql.GraphQLInputObjectType({
    name: 'UserRequestInputType',
    fields: {
        id: { type: new ql.GraphQLNonNull(ql.GraphQLInt) },
        access: { type: new ql.GraphQLNonNull(ql.GraphQLBoolean) },
        hide: { type: new ql.GraphQLNonNull(ql.GraphQLBoolean) },
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

const TopicCountType = new ql.GraphQLObjectType({
    name: 'TopicCount',
    fields: {
        topic: {
            type: TopicType,
            resolve: (obj) => {
                return {
                    name: obj.name,
                    type: obj.type,
                };
            }
        },
        entryCount: {
            type: ql.GraphQLInt,
            resolve: (obj) => {
                return obj.entry_count;
            }
        },
        creatorCount: {
            type: ql.GraphQLInt,
            resolve: (obj) => {
                return obj.creator_count;
            }
        }
    }
});

const RequestInputType = new ql.GraphQLInputObjectType({
    name: 'RequestInput',
    fields: {
        range: {
            type: DateRangeInputType
        },
        reason: { type: ql.GraphQLString },
        name: { type: ql.GraphQLString },
        org: { type: ql.GraphQLString },
        avatar: { type: ql.GraphQLString },
        topics: { type: new ql.GraphQLList(ql.GraphQLString) }
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
    SentimentType,
    TopicType,
    RoleDefinitionType,
    RegionDefinitionType,
    MediaInputType,
    EntryInputType,
    RequestInputType,
    DateRangeInputType,
    TopicCountType,
    UserInputType,
    UserRequestInputType,
};
