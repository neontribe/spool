const SQL = require('sql-template-strings');

const entryCreate = (authorId, ownerId, mediaId, sentimentType) => SQL`
INSERT INTO
    entry (author_id, owner_id, media_id, sentiment_type_id, timestamp)
VALUES
    (${authorId}, ${ownerId}, ${mediaId},
        (SELECT sentiment_type_id FROM sentiment_type WHERE sentiment_type.type = ${sentimentType}), now())
RETURNING
    entry_id`.setName('entry_create');

const entryByOwner = (ownerId) => SQL`
SELECT
    entry.entry_id AS id,

    entry.timestamp,

    sentiment_type.type AS sentiment_type,

    author.user_id AS author_id,

    owner.user_id AS owner_id,

    media.media_id AS media_id,
    media.text AS media_text,
    media.video AS media_video,
    media.video_thumbnail AS media_video_thumbnail,
    media.image AS media_image,
    media.image_thumbnail AS media_image_thumbnail

FROM 
    entry
JOIN 
    user_account AS author ON author.user_id = entry.author_id
JOIN
    user_account AS owner ON owner.user_id = entry.owner_id
JOIN
    media ON media.media_id = entry.media_id
JOIN
    sentiment_type ON sentiment_type.sentiment_type_id = entry.sentiment_type_id
WHERE
    entry.owner_id = ${ownerId}
ORDER BY
    timestamp DESC`.setName('entry_by_owner_id');

/* some DRY concerns here */
const entryById = (entryId) => SQL`
SELECT
    entry.entry_id AS id,

    entry.timestamp,

    sentiment_type.type AS sentiment_type,

    author.user_id AS author_id,

    owner.user_id AS owner_id,

    media.media_id AS media_id,
    media.text AS media_text,
    media.video AS media_video,
    media.video_thumbnail AS media_video_thumbnail,
    media.image AS media_image,
    media.image_thumbnail AS media_image_thumbnail

FROM 
    entry
JOIN 
    user_account AS author ON author.user_id = entry.author_id
JOIN
    user_account AS owner ON owner.user_id = entry.owner_id
JOIN
    media ON media.media_id = entry.media_id
JOIN
    sentiment_type ON sentiment_type.sentiment_type_id = entry.sentiment_type_id
WHERE
    entry.entry_id = ${entryId}`.setName('entry_by_entry_id');


const topicByEntry = (entryId) => SQL`
SELECT
    topic_type.type AS topic_type,
    topic_type.name AS topic_name
FROM
    x_entry_topics
JOIN
    topic_type ON topic_type.topic_type_id = x_entry_topics.topic_type_id
WHERE
    x_entry_topics.entry_id = ${entryId}`.setName('topic_by_entry_id');

const topicAll = () => SQL`
SELECT
    topic_type.type AS topic_type,
    topic_type.name AS topic_name
FROM
    topic_type`.setName('topic_all');

const topicCreate = (entryId, type) => SQL`
INSERT INTO
    x_entry_topics (entry_id, topic_type_id)
VALUES
    (${entryId}, (SELECT topic_type_id FROM topic_type WHERE topic_type.type = ${type}))`.setName('topic_create');

const mediaCreate = (text, video, videoThumbnail, image, imageThumbnail) => SQL`
INSERT INTO
    media (text, video, video_thumbnail, image, image_thumbnail)
VALUES
    (${text}, ${video}, ${videoThumbnail}, ${image}, ${imageThumbnail})
RETURNING
    media_id`.setName('media_create');

const userByAuthHash = (hash) => SQL`
SELECT
    user_id AS id,
    auth_hash AS auth_hash
FROM
    user_account
WHERE
    user_account.auth_hash = ${hash}`.setName('user_by_auth_hash');

const userById = (userId) => SQL`
SELECT
    user_id AS id,
    auth_hash
FROM
    user_account
WHERE
    user_account.user_id = ${userId}`.setName('user_by_user_id');

const userCreate = (hash) => SQL`
INSERT INTO
    user_account (auth_hash)
VALUES
    (${hash})
RETURNING
    user_id AS id`.setName('user_create');

const userRewardsConfigure = (id) => SQL`
INSERT INTO
    x_users_reward_types (user_id, reward_type_id)
SELECT
    ${id} AS user_id,
    reward_type.reward_type_id
FROM
    reward_type`.setName('user_rewards_configure');

module.exports = {
    entry: {
        byId: entryById,
        byOwner: entryByOwner,
        create: entryCreate,
    },
    topic: {
        byEntry: topicByEntry,
        create: topicCreate,
        all: topicAll
    },
    media: {
        create: mediaCreate,
    },
    user: {
        byAuthHash: userByAuthHash,
        byId: userById,
        create: userCreate,
        rewards: {
            configure: userRewardsConfigure
        }
    }
}
