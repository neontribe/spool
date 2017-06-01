const co = require('co');
const {models, helpers} = require('./database');
const _ = require('lodash');
const winston = require('winston');

function getCreatorSentimentCount (sentimentType, userId) {
    return models.Entry.findAll({
        where: {
            ownerId: userId
        },
        include: helpers.includes.Entry.sentiment
    }).then(function (result) {
        return result.reduce(function (reduction, entry) {
            if (entry.Sentiment.type === sentimentType) {
                reduction++;
            }
            return reduction;
        }, 0);
    }).catch((e) => winston.warn(e));
}

function makeEntry (userId, mediaData, sentimentData, topicsData) {
    return co(function* () {
        var insertMedia = models.Medium.create(mediaData, {
            returning: true
        });
        var findSentiment = models.Sentiment.findAll().then((sentiments) => {
            return _.find(sentiments, { type: sentimentData });
        });
        var findTopics = models.Topic.findAll({
            where: {
                type: topicsData
            }
        });
        var [media, sentiment, topics] = yield [insertMedia, findSentiment, findTopics];
        if (sentiment && media && topics.length >= 1) {
            var newEntry = yield models.Entry.create({
                mediaId: media.mediaId,
                sentimentId: sentiment.sentimentId,
                ownerId: userId,
                authorId: userId
            }, {
                returning: true
            });
            yield newEntry.addEntryTopicTopics(topics);
            return {
                entry: yield models.Entry.findOne({
                    where: {
                        entryId: newEntry.entryId
                    },
                    include: helpers.includes.Entry.basic
                })
            };
        }
    }).catch((e) => winston.warn(e));
}

function updateUser (id, data) {
    return co(function* () {
        var findRegion = models.Region.findOne({ where: { type: data.region } });
        var findResidence = models.Residence.findOne({ where: { type: data.residence } });
        var findServices = models.Service.findAll({
            where: {
                type: {
                    $in: data.services
                }
            }
        });
        var findUser = models.UserAccount.findOne({
            where: { userId: id },
            include: helpers.includes.UserAccount.leftProfile });
        var [region, user, residence, services] = yield [findRegion, findUser, findResidence, findServices];
        if (region && user && residence && services.length) {
            var profileData = {
                age: data.age,
                name: data.name,
                altName: data.nickname,
                residenceId: residence.residenceId
            };
            var Profile = user.Profile;
            if (!Profile) {
                Profile = yield models.Profile.create(profileData, {
                    returning: true
                });
            } else {
                models.Profile.update(profileData, {
                    where: {
                        profileId: Profile.profileId
                    }
                });
            }

            const accountData = { profileId: Profile.profileId };

            /* Prevent consumers and supporters from changing their services and regions */
            if (user.Role.type === 'creator' && !Profile.supporter) {
                yield models.ProfileService.destroy({
                    where: {
                        profileId: Profile.profileId
                    }
                });
                yield Profile.addProfileServiceServices(services);
                accountData.regionId = region.regionId;
            }

            yield models.UserAccount.update(accountData, {
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
    updateUser
};
