const ql = require('graphql');
const relayql = require('graphql-relay');
const types = require('./types.js');
const {sequelize, models, helpers} = require('../database');
const moment = require('moment');
const _ = require('lodash');
const spool = require('../spool.js');
const winston = require('winston');
const shuffle = require('shuffle-array');
const randomSeed = require('random-seed');
const EntryFilter = require('./entry-filter.js');

var {nodeInterface, nodeField} = relayql.nodeDefinitions(
    /* retrieve given an id and type */
    (globalId, context) => {
        // keeping unusde 'type' here since it is important later and easy to forget
        // eslint-disable-next-line no-unused-vars
        var {type, id} = relayql.fromGlobalId(globalId);
        if (type === 'Creator') {
            return models.UserAccount.findOne({
                where: {
                    userId: context.userId,
                },
                include: helpers.includes.UserAccount.basicCreator,
            }).then((user) => user ? { creator: true } : null).catch((e) => winston.warn(e));
        }
        if (type === 'Consumer') {
            return models.UserAccount.findOne({
                where: {
                    userId: context.userId,
                },
                include: helpers.includes.UserAccount.basicConsumer,
            }).then((user) => user ? { consumer: true } : null).catch((e) => winston.warn(e));
        }
        if (type === 'User') {
            return models.UserAccount.findOne({
                where: {
                    userId: context.userId,
                },
                include: helpers.includes.UserAccount.leftProfile,
            }).catch((e) => winston.warn(e));
        }
        if (type === 'Profile') {
            if(!context.Role || context.Role.type === 'creator') {
                return models.Profile.findOne({
                    where: {
                        profileId: id
                    },
                    include: [
                        {
                            model: models.UserAccount,
                            as: 'UserAccount',
                            where: {
                                userId: context.userId
                            }
                        }
                    ]
                }).catch((e) => winston.warn(e));
            }
            if(context.Role.type === 'consumer') {}
        }
        if (type === 'Entry') {
            if(!context.Role) {
                winston.info(`Failed to resolve ${type} node due to missing role`);
                return null;
            }

            if(context.Role.type === 'creator') {
                // if we are a creator, get the entry directly
                return models.Entry.findOne({
                    where: {
                        entryId: id,
                        ownerId: context.userId,
                    },
                    include: helpers.includes.Entry.basic
                }).catch((e) => winston.warn(e));
            }

            if(context.Role.type === 'consumer') {
                // only give entries to consumers where they are sharing and
                // the regions match
                return models.Entry.findOne({
                    where: {
                        entryId: id,
                    },
                    include: [
                        {
                            model: models.UserAccount,
                            as: 'Owner',
                            where: {
                                regionId: context.regionId
                            },
                            include: [{
                                model: models.Profile,
                                as: 'Profile',
                                where: {
                                    sharing: true,
                                }
                            }]
                        },
                        ...helpers.includes.Entry.basic
                    ],
                }).catch((e) => winston.warn(e));
            }
        }
        winston.info(`Failed to resolve ${type} node for ${id}`);
        return null;
    },
    /* resolve given an object */
    (obj) => {
        if (obj instanceof models.Entry.Instance) {
            // eslint-disable-next-line no-use-before-define
            return EntryType;
        }
        if (obj instanceof models.UserAccount.Instance){
            // eslint-disable-next-line no-use-before-define
            return UserType;
        }
        if (obj instanceof models.Profile.Instance){
            // eslint-disable-next-line no-use-before-define
            return ProfileType;
        }
        if (obj.consumer) {
            // eslint-disable-next-line no-use-before-define
            return ConsumerType;
        }
        if (obj.creator) {
            // eslint-disable-next-line no-use-before-define
            return CreatorType;
        }
    });

const ResidenceType = new ql.GraphQLObjectType({
    name: 'Residence',
    fields: {
        type: {
            type: ql.GraphQLString,
            resolve: (root) => root.type
        },
        name: {
            type: ql.GraphQLString,
            resolve: (root) => root.name
        },
    }
});
const ProfileType = new ql.GraphQLObjectType({
    name: 'Profile',
    fields: {
        id: relayql.globalIdField('Profile', (root) => root.profileId),
        name: {
            type: ql.GraphQLString,
            resolve: (root) => root.name
        },
        age: {
            type: ql.GraphQLInt,
            resolve: (root) => root.age
        },
        nickname: {
            type: ql.GraphQLString,
            resolve: (root) => root.altName
        },
        services: {
            type: new ql.GraphQLList(types.ServiceType),
            resolve: (root) => {
                return root.ProfileServiceServices
            }
        },
        residence: {
            type: ResidenceType,
            resolve: (root) => {
                return root.Residence;
            }
        },
        isSharing: {
            type: ql.GraphQLBoolean,
            resolve: (root) => {
                return root.sharing;
            }
        },
        isIntroduced: {
            type: ql.GraphQLBoolean,
            resolve: (root) => {
                return root.introduced;
            }
        }
    },
    interfaces: [nodeInterface]
});

const UserType = new ql.GraphQLObjectType({
    name: 'User',
    fields: {
        id: relayql.globalIdField('User', (root) => root.userId),
        role: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return root.Role && root.Role.type;
            },
        },
        region: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return root.Region && root.Region.type;
            },
        },
        profile: {
            type: ProfileType,
            resolve: (root) => {
                return root.Profile
            }
        }
    },
    interfaces: [nodeInterface]
});

const EntryOwnerType = new ql.GraphQLObjectType({
    name: 'EntryOwner',
    fields: {
        age: {
            type: ql.GraphQLInt,
            resolve: (root) => {
                return root.age;
            },
        },
        residency: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return root.Residence.name;
            }
        },
        services: {
            type: new ql.GraphQLList(types.ServiceType),
            resolve: (root) => {
                return root.ProfileServiceServices;
            }
        }
    }
});

const EntryType = new ql.GraphQLObjectType({
    name: 'Entry',
    fields: {
        id: relayql.globalIdField('Entry', (root) => root.entryId),
        owner: {
            type: EntryOwnerType,
            resolve: (root) => {
                return models.Profile.findOne({
                    where: {
                        profileId: root.Owner.profileId
                    },
                    include: [{
                        model: models.Residence,
                        as: 'Residence'
                    }, {
                        model: models.Service,
                        as: 'ProfileServiceServices',
                    }]
                });
            }
        },
        media: {
            type: types.MediaType,
            resolve: (root) => {
                return root.Medium;
            },
        },
        sentiment: {
            type: types.SentimentType,
            resolve: (root) => {
                return root.Sentiment;
            },
        },
        topics: {
            type: new ql.GraphQLList(types.TopicType),
            resolve: (root) => {
                return root.EntryTopicTopics;
            },
        },
        views: {
            type: ql.GraphQLInt,
            resolve: (root) => {
                return root.views
            }
        },
        created: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return moment(root.createdAt).format();
            },
        },
        updated: {
            type: ql.GraphQLString,
            resolve: (root) => {
                return moment(root.updatedAt).format();
            },
        }
    },
    interfaces: [nodeInterface]
});
var entryConnectionDefinition =
    relayql.connectionDefinitions({nodeType: EntryType});

const CreatorActivityType = new ql.GraphQLObjectType({
    name: 'CreatorActivity',
    fields: {
        active: {
            type: ql.GraphQLInt,
            resolve: (root) => {
                return root.active;
            },
        },
        stale: {
            type: ql.GraphQLInt,
            resolve: (root) => {
                return root.stale;
            },
        }
    }
});

const CreatorSentimentType = new ql.GraphQLObjectType({
    name: 'CreatorSentiment',
    fields: {
        happy: {
            type: ql.GraphQLInt,
            resolve: (root) => {
                return root.happy;
            },
        },
        sad: {
            type: ql.GraphQLInt,
            resolve: (root) => {
                return root.sad;
            },
        }
    }
});

const DataAccessType = new ql.GraphQLObjectType({
    name: 'DataAccess',
    fields: {
        sentiment: {
            type: CreatorSentimentType,
            resolve: function({range, regionId}) {
                var from = moment(range.from);
                var to = moment(range.to);
                return models.Entry.findAll({
                    where: {
                        createdAt: {
                            $between: [from.format(), to.format()]
                        }
                    },
                    include: [
                        {
                            model: models.Sentiment,
                            as: 'Sentiment',
                        },
                        {
                            model: models.UserAccount,
                            as: 'Owner',
                            where: {
                                regionId: regionId,
                                createdAt: {
                                    $gte: from.format()
                                },
                            }
                        },
                    ]
                }).then(function(results) {
                    return results.reduce(function(reduction, row) {
                        reduction[row.Sentiment.type]++;
                        return reduction;
                    }, {
                        happy: 0,
                        sad: 0
                    });
                }).catch((e) => winston.warn(e));
            }
        },
        topics: {
            type: new ql.GraphQLList(types.TopicCountType),
            args: {
                range: {
                    type: types.DateRangeInputType,
                }
            },
            resolve: function({range, regionId}) {
                var from = moment(range.from);
                var to = moment(range.to);
                return sequelize.query(helpers.queries.Topic.countsByRange(from.format(), to.format(), regionId))
                .then(([results, metadata]) => results)
                .catch((e) => winston.warn(e));
            },
        },
        activity: {
            type: CreatorActivityType,
            resolve: function({range, regionId}, args) {
                var from = moment(range.from);
                var to = moment(range.to);
                return sequelize.query(helpers.queries.UserAccount.entryActivity(from.format(), to.format(), regionId))
                .then(([results, metadata]) => results)
                .then(function(results) {
                    return results.reduce(function(reduction, row) {
                        if(row.count >= 1) {
                            reduction.active++;
                        } else {
                            reduction.stale++;
                        }
                        return reduction;
                    }, {
                        active: 0,
                        stale: 0
                    });
                }).catch((e) => winston.warn(e));
            },
        },
        entries: {
            type: entryConnectionDefinition.connectionType,
            args: Object.assign({
                topics: {
                    type: types.TopicsInputType,
                },
            }, relayql.connectionArgs),
            resolve: ({range, regionId}, args) => {
                const { topics } = args;
                var from = moment(range.from);
                var to = moment(range.to);

                return relayql.connectionFromPromisedArray(models.Entry.findAll({
                    where: {
                        createdAt: {
                            $between: [from.format(), to.format()]
                        }
                    },
                    include: [
                        {
                            model: models.Medium,
                            as: 'Medium',
                        },
                        {
                            model: models.Sentiment,
                            as: 'Sentiment',
                        },
                        {
                            model: models.Topic,
                            as: 'EntryTopicTopics',
                            where: {
                                //excluding entries which don't have a matching topic
                                type: {
                                    $in: topics
                                },
                            }
                        },
                        {
                            model: models.UserAccount,
                            as: 'Owner',
                            where: {
                                regionId: regionId
                            },
                            include: [{
                                model: models.Profile,
                                as: 'Profile',
                                where: {
                                    sharing: true,
                                }
                            }]
                        },
                    ]
                }).then(function(entries) {
                    // we don't need to wait for this to complete
                    const ids = entries.map((entry) => parseInt(entry.entryId, 10));
                    winston.warn(ids);
                    sequelize.query(helpers.queries.Entry.incrementViews(ids))
                    return entries;
                }).catch((e) => winston.warn(e)), args);
            }
        }
    }
});

const ConsumerType = new ql.GraphQLObjectType({
    name: 'Consumer',
    fields: {
        id: relayql.globalIdField('Consumer', (root, args, context) => context.userId),
        topics: {
            type: new ql.GraphQLList(types.TopicType),
            resolve: () => {
                return models.Topic.findAll().catch((e) => winston.warn(e));
            },
        },
        access: {
            type: DataAccessType,
            args: {
                range: {
                    type: types.DateRangeInputType,
                },
            },
            resolve: (root, {range}, {regionId}) => {
                return {range, regionId}
            }
        }
    },
    interfaces: [nodeInterface]
});

const consumerField = {
    type: ConsumerType,
    resolve: (root, args, context) => {
        return models.UserAccount.findOne({
            where: {
                userId: context.userId,
            },
            include: helpers.includes.UserAccount.basicConsumer,
        }).then((user) => user ? { consumer: true } : null).catch((e) => winston.warn(e));
    },
}

const EntryFilterArgsType = new ql.GraphQLInputObjectType({
    name: 'EntryFilterArgs',
    fields: {
        sentiment: {
            type: new ql.GraphQLList(ql.GraphQLString)
        },
        topics: {
            type: new ql.GraphQLList(ql.GraphQLString)
        },
        media: {
            type: new ql.GraphQLInputObjectType({
                name: 'MediaFilterType',
                fields: {
                    video: { type: ql.GraphQLBoolean },
                    image: { type: ql.GraphQLBoolean },
                    text: { type: ql.GraphQLBoolean }
                }
            })
        }
    }
});

const CreatorType = new ql.GraphQLObjectType({
    name: 'Creator',
    fields: {
        id: relayql.globalIdField('Creator', (root, args, context) => context.userId),
        topics: {
            type: new ql.GraphQLList(types.TopicType),
            resolve: () => {
                return models.Topic.findAll().catch((e) => winston.warn(e));
            },
        },
        entries: {
            type: entryConnectionDefinition.connectionType,
            args: Object.assign({
                random: {
                    type: ql.GraphQLBoolean,
                },
                filter: {
                    type: EntryFilterArgsType
                }
            }, relayql.connectionArgs),
            resolve: (root, args, context) => {
                return relayql.connectionFromPromisedArray(models.Entry.findAll({
                    where: {
                        ownerId: context.userId,
                    },
                    include: helpers.includes.Entry.basic,
                    order: [
                        ['createdAt', 'DESC']
                    ],
                }).then(function(entries) {
                    if(args.filter && Object.keys(args.filter).length) {
                        let filter = new EntryFilter(args.filter);
                        entries = filter.filter(entries);
                    }
                    if(args.random) {
                        let first = entries.shift();
                        let generator = randomSeed.create(context.userId);
                        entries = shuffle(entries, {
                            rng: generator.random
                        });
                        entries.push(first);
                    }
                    return entries;
                }).catch((e) => winston.warn(e)), args);
            }
        },
        happyCount: {
            type: ql.GraphQLInt,
            resolve: (root, args, context) => {
                return spool.getCreatorSentimentCount("happy", context.userId);
            },
        },
        sadCount: {
            type: ql.GraphQLInt,
            resolve: (root, args, context) => {
                return spool.getCreatorSentimentCount("sad", context.userId);
            },
        },
    },
    interfaces: [nodeInterface]
});

const creatorField = {
    type: CreatorType,
    resolve: (root, args, context) => {
        return models.UserAccount.findOne({
            where: {
                userId: context.userId,
            },
            include: helpers.includes.UserAccount.basicCreator,
        }).then((user) => user ? { creator: true } : null).catch((e) => winston.warn(e));
    },
}

const userField = {
    type: UserType,
    resolve: (root, args, context) => {
        return models.UserAccount.findOne({
            where: {
                userId: context.userId,
            },
            include: helpers.includes.UserAccount.leftProfile,
        }).catch((e) => winston.warn(e));
    },
}
const MetaType = new ql.GraphQLObjectType({
    name: 'Meta',
    fields: {
        regions: {
            type: new ql.GraphQLList(types.RegionType),
            resolve: () => {
                return models.Region.findAll({
                    include: [
                        {
                            model: models.Service,
                            as: 'RegionServiceServices',
                        }
                    ]
                }).catch((e) => winston.warn(e));
            },
        },
        roles: {
            type: new ql.GraphQLList(types.RoleType),
            resolve: () => {
                return models.Role.findAll().catch((e) => winston.warn(e));
            },
        },
        residences: {
            type: new ql.GraphQLList(ResidenceType),
            resolve: () => {
                return models.Residence.findAll().catch((e) => winston.warn(e));
            }
        }
    },
});

const metaField = {
    type: MetaType,
    resolve: () => true,
}

const createEntry = relayql.mutationWithClientMutationId({
    name: 'CreateEntry',
    inputFields: {
        entry: {
            type: types.EntryInputType
        }
    },
    outputFields: {
        creator: creatorField,
        entryEdge: {
            type: entryConnectionDefinition.edgeType,
            resolve: ({entry}, args, context) => {
                return models.Entry.findAll({
                    where: {
                        ownerId: context.userId,
                    }
                }).then(function(entries) {
                    var indexOfEntry = _.findIndex(entries, { entryId: entry.entryId });
                    return {
                        cursor: relayql.offsetToCursor(indexOfEntry),
                        node: entry,
                    };
                }).catch((e) => winston.warn(e));
           },
        },
    },
    mutateAndGetPayload: function mutateEntryPayload({entry}, context) {
        if (!context.Role || context.Role.type !== "creator") {
            winston.info(`Failed createEntry mutation due to role mismatch`);
            return {};
        }
        var media = entry.media;
        var topics = entry.topics;
        var sentiment = entry.sentiment;
        return spool.makeEntry(context.userId, media, sentiment, topics)
    }
});

const updatePrivacy = relayql.mutationWithClientMutationId({
    name: 'UpdatePrivacy',
    inputFields: {
        privacy: {
            type: types.PrivacyInputType
        }
    },
    outputFields: {
        user: userField,
    },
    mutateAndGetPayload: function mutatePrivacyPayload({privacy}, context) {
        if (!context.Profile) {
            return {};
        }
        return models.Profile.update({
            sharing: privacy.sharing
        }, {
            where: {
                profileId: context.Profile.profileId
            }
            //return an empty object to store mutationId
        }).then(() => ({}));
    }
});

const hideIntroduction = relayql.mutationWithClientMutationId({
    name: 'HideIntroduction',
    outputFields: {
        user: userField,
    },
    mutateAndGetPayload: function mutateIntroductionPayload({privacy}, context) {
        if (!context.Profile) {
            return {};
        }
        return models.Profile.update({
            introduced: true
        }, {
            where: {
                profileId: context.Profile.profileId
            }
            //return an empty object to store mutationId
        }).then(() => ({}));
    }
});

const updateUser = relayql.mutationWithClientMutationId({
    name: 'UpdateUser',
    inputFields: {
        user: {
            type: types.UserInputType
        }
    },
    outputFields: {
        user: userField
    },
    mutateAndGetPayload: function mutateUserPayload({user}, context) {
        return spool.updateUser(context.userId, user);
    }
}); 

const deleteEntry = relayql.mutationWithClientMutationId({
    name: 'DeleteEntry',
    inputFields: {
        entryId: {
            type: ql.GraphQLString,
        }
    },
    outputFields: {
        creator: creatorField,
        deletedEntryId: {
            type: ql.GraphQLString,
            resolve: ({entryId}) => entryId,
        }
    },
    mutateAndGetPayload: function mutateUserPayload({entryId}, context) {
        const ownerId = context.userId;
        const { id } = relayql.fromGlobalId(entryId);
        return models.Entry.destroy({
            where: {
                entryId: id,
                ownerId,
            },
        }).then(() => ({ entryId })).catch((e) => winston.warn(e));
    }
}); 

module.exports = {
    fields: {
        nodeField,
        creatorField,
        consumerField,
        userField,
        metaField,
    },
    mutations: {
        createEntry,
        updateUser,
        deleteEntry,
        updatePrivacy,
        hideIntroduction
    }
}
