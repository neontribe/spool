const co = require('co');
const {models, helpers} = require('./database');
const _ = require('lodash');
const moment = require('moment');
const winston = require('winston');

function makeUserRequest (user, request) {
    return co(function* () {
        var existing = yield models.UserRequest.findOne({
            requestId: request.requestId,
            userId: user.userId,
        });
        if (!existing) {
            // for each of the users, create a user_request for that user
            var userRequest = yield models.UserRequest.create({
                requestId: request.requestId,
                userId: user.userId,
            }, {
                returning: true,
            });
            // find all entries that are in the bounds of the request
            // they match the userId of the request maker
            // and the entry was created between the request range
            var entries = yield models.Entry.findAll({
                where: {
                    ownerId: user.userId,
                    createdAt: {
                        $between: [request.from, request.to]
                    }
                },
                include: [
                    {
                        model: models.Topic,
                        as: 'EntryTopicTopics',
                        where: {
                            type: request.RequestTopicTopics.map((t) => t.type),
                        },
                    },
                ]
            });
            // link the entries to the user request
            yield entries.map((entry) => entry.addEntryUserRequestUserRequest(userRequest));
        }
    }).catch((e) => winston.warn(e));
}

function makeRequest(request, topics) {
    return co(function* () {
        //insert a new request, grab the insert id
        var insertRequest = models.Request.create(request, {
            returning: true,
        });
        //find the list of topics that match this request
        var findTopics = models.Topic.findAll({
            where: {
                type: topics
            },
        });
        //wait for both tasks to complete
        var [newRequest, requestTopics] = yield [insertRequest, findTopics];
        //insert relation between request and topics
        yield newRequest.addRequestTopicTopics(requestTopics);
        //find the full request data
        var fullRequest = yield models.Request.findOne({
            where: {
                requestId: newRequest.requestId
            },
            include: helpers.includes.Request.basic,
        });
        var users = yield models.UserAccount.findAll({
            where: {
                regionId: request.regionId
            },
            include: helpers.includes.UserAccount.basicCreator
        });
        yield users.map((user) => makeUserRequest(user, fullRequest));
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

function makeEntry(userId, mediaData, sentimentData, topicsData) {
    return co(function* () {
        var insertMedia = models.Medium.create(mediaData, {
            returning: true,
        });
        var findSentiment = models.Sentiment.findAll().then((sentiments) => {
            return _.find(sentiments, { type: sentimentData });
        });
        var findTopics = models.Topic.findAll({
            where: {
                type: topicsData
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

            var now = moment().format();
            // find every request open for this user whos criteria matches
            // this new entry
            var matchingRequests = yield models.UserRequest.findAll({
                where: {
                    userId: userId,
                },
                include: [
                    {
                        model: models.Request,
                        as: 'Request',
                        where: {
                            to: {
                                $gte: now,
                            }
                        },
                        include: [
                            {
                                model: models.Topic,
                                as: 'RequestTopicTopics',
                                where: {
                                    type: topicsData,
                                },
                            },
                        ]
                    },
                ]
            });
            yield newEntry.addEntryUserRequestUserRequests(matchingRequests);
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
            // since we have region and role we should backdate requests
            if (role.type === "creator") {
                var now = moment().format();
                // find all requests where the region matches this user and
                // the range spans past (or is) the current date
                var findRequests = models.Request.findAll({
                    where: {
                        regionId: region.regionId,
                        to: {
                            $gte: now,
                        }
                    },
                    include: helpers.includes.Request.basic
                });
                //find the full user data
                var findUser = models.UserAccount.findOne({
                    where: {
                        userId: id,
                    },
                    include: helpers.includes.UserAccount.basicCreator
                });
                var [requests, user] = yield [findRequests, findUser];
                yield requests.map((request) => makeUserRequest(user, request));
            }
        }
        return {};
    }).catch((e) => winston.warn(e));
}

function updateUserRequest(id, hide, access) {
    return co(function* () {
        var updatePromise = models.UserRequest.update({
            seen: hide,
        }, {
            where: {
                userRequestId: id
            }
        });
        var updateEntryPromise = Promise.resolve(true);
        if (access) {
            updateEntryPromise = models.EntryUserRequest.update({
                access: true
            }, {
                where: {
                    userRequestId: id
                }
            });
        }
        yield [updatePromise, updateEntryPromise];
        var userRequest = yield models.UserRequest.findOne({
            where: {
                userRequestId: id,
            },
            include: helpers.includes.UserRequest.basic,
        });
        return {
            userRequest,
        };
    }).catch((e) => winston.warn(e));
}

module.exports = {
    makeRequest,
    getCreatorSentimentCount,
    makeEntry,
    updateUser,
    makeUserRequest,
    updateUserRequest
}
