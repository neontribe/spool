const co = require('co');
const {models, helpers} = require('./database');
const _ = require('lodash');
const moment = require('moment');
const winston = require('winston');

function makeRequest(request, topics) {
    return co(function* () {
        // make a new request
        var insertRequest = models.Request.create(request, {
            returning: true,
        });
        var findTopics = models.Topic.findAll({
            where: {
                type: topics
            },
        });
        var [newRequest, requestTopics] = yield [insertRequest, findTopics];
        yield newRequest.addRequestTopicTopics(requestTopics);

        // find each consumer user that is in the request region
        var users = yield models.UserAccount.findAll({
            where: {
                regionId: request.regionId
            },
            include: helpers.includes.UserAccount.basicCreator
        });

        // for each of the users, create a user_request for that user
        var userRequests = yield users.map((user) => models.UserRequest.create({
            requestId: newRequest.requestId,
            userId: user.userId,
        }, {
            returning: true,
        }));
        yield userRequests.map(function* (userRequest) {
            // find all entries that are in the bounds of the request
            var entries = yield models.Entry.findAll({
                where: {
                    ownerId: userRequest.userId,
                    createdAt: {
                        gte: newRequest.from
                    }
                },
                include: [
                    {
                        model: models.Topic,
                        as: 'EntryTopicTopics',
                        where: {
                            type: topics
                        },
                    },
                ]
            });
            // link the entries to the user request
            yield entries.map(entry => entry.addEntryUserRequestUserRequest(userRequest));
        });
    }).catch((e) => winston.warn(e));
}

function getCreatorSentimentCount (sentimentType, userId) {
    return models.Entry.findAll({
        where: {
            ownerId: userId
        },
        include: helpers.includes.Entry.sentiment
    }).then(function(result) {
        return result.reduce(function(reduction, entry) {
            if (entry.Sentiment.type === sentimentType) {
                reduction++;
            }
            return reduction;
        }, 0);
    }).catch((e) => winston.warn(e));
}

function makeEntry(userId, entry) {
    return co(function* () {
        var insertMedia = models.Medium.create(entry.media, {
            returning: true,
        });
        var findSentiment = models.Sentiment.findAll().then((sentiments) => {
            return _.find(sentiments, { type: entry.sentiment });
        });
        var findTopics = models.Topic.findAll({
            where: {
                type: entry.topics
            },
        });
        var [media, sentiment, topics] = yield [insertMedia, findSentiment, findTopics];
        if (sentiment && media && topics.length >= 1) {
            var newEntry = yield models.Entry.create({
                mediaId: media.mediaId,
                sentimentId: sentiment.sentimentId,
                ownerId: userId,
                authorId: userId,
            }, {
                returning: true,
            });
            yield newEntry.addEntryTopicTopics(topics);
            return {
                entry: yield models.Entry.findOne({
                    where: {
                        entryId: newEntry.entryId,
                    },
                    include: helpers.includes.Entry.basic
                }) 
            };
        }
    }).catch((e) => winston.warn(e));
}

function updateUser(id, userRegion, roleSecret) {
    return co(function* () {
        var findRegion = models.Region.findOne({ where: { type: userRegion } });
        var findRole = models.Role.findOne({ where: { secret: roleSecret } });
        var [region, role] = yield [findRegion, findRole];
        if (region && role) {
            yield models.UserAccount.update({
                roleId: role.roleId,
                regionId: region.regionId,
            }, {
                where: {
                    userId: id
                }
            });
        }
        return {};
    }).catch((e) => winston.warn(e));
}

module.exports = {
    makeRequest,
    getCreatorSentimentCount,
    makeEntry,
    updateUser
}
