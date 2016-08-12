const ql = require('graphql');
const db = require('../database/database.js');

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
        },
        sentiment: {
            type: SentimentType,
            resolve: (entry) => entry.sentiment
        },
        topic: {
            type: TopicType,
            // we are popping a single type off the list since we are only supporting a single topic for now
            resolve: (entry) => db.lib.Topic.findByEntryId(db.connect(), entry.id).then((topics) => topics.shift())
        }
    }
});

const QueryType = new ql.GraphQLObjectType({
    name: 'Query',
    fields: {
        entryByOwner: {
            type: new ql.GraphQLList(EntryType),
            args: {
                id: { type: ql.GraphQLInt }
            },
            resolve: (_, {id}) => db.lib.Entry.findByOwnerId(db.connect(), id)
        }
    }
})

module.exports = {
    QueryType
}
