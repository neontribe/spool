const co = require('co');
const {models, helpers} = require('./database');
const _ = require('lodash');
const moment = require('moment');
const winston = require('winston');

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
    getCreatorSentimentCount,
    makeEntry,
    updateUser,
}
