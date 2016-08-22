const SQL = require('sql-template-strings');

const entryCreate = (authorId, ownerId, mediaId, sentimentType) => SQL`
INSERT INTO
    entry (author_id, owner_id, media_id, sentiment_type_id)
VALUES
    (${authorId}, ${ownerId}, ${mediaId},
        (SELECT sentiment_type_id FROM sentiment_type WHERE sentiment_type.type = ${sentimentType}))
RETURNING
    entry_id`.setName('entry_create');

const entryByOwner = (ownerId) => SQL`
SELECT
    entry.entry_id AS id,

    sentiment_type.type AS sentiment_type,

    author.user_id AS author_id,

    owner.user_id AS owner_id,

    media_type.type AS media_type_type,
    media.media_id AS media_id,
    media.text AS media_text

FROM
    entry
JOIN
    user_account AS author ON author.user_id = entry.author_id
JOIN
    user_account AS owner ON owner.user_id = entry.owner_id
JOIN
    media ON media.media_id = entry.media_id
JOIN
    media_type ON media_type.media_type_id = media.type_id
JOIN
    sentiment_type ON sentiment_type.sentiment_type_id = entry.sentiment_type_id
WHERE
    entry.owner_id = ${ownerId}`.setName('entry_by_owner_id');

/* some DRY concerns here */
const entryById = (entryId) => SQL`
SELECT
    entry.entry_id AS id,

    sentiment_type.type AS sentiment_type,

    author.user_id AS author_id,

    owner.user_id AS owner_id,

    media_type.type AS media_type_type,
    media.media_id AS media_id,
    media.text AS media_text

FROM
    entry
JOIN
    user_account AS author ON author.user_id = entry.author_id
JOIN
    user_account AS owner ON owner.user_id = entry.owner_id
JOIN
    media ON media.media_id = entry.media_id
JOIN
    media_type ON media_type.media_type_id = media.type_id
JOIN
    sentiment_type ON sentiment_type.sentiment_type_id = entry.sentiment_type_id
WHERE
    entry.entry_id = ${entryId}`.setName('entry_by_entry_id');

const topicByEntry = (entryId) => SQL`
SELECT
    topic_type.type AS topic_type
FROM
    x_entry_topics
JOIN
    topic_type ON topic_type.topic_type_id = x_entry_topics.topic_type_id
WHERE
    x_entry_topics.entry_id = ${entryId}`.setName('topic_by_entry_id');

const topicCreate = (entryId, type) => SQL`
INSERT INTO
    x_entry_topics (entry_id, topic_type_id)
VALUES
    (${entryId}, (SELECT topic_type_id FROM topic_type WHERE topic_type.type = ${type}))`.setName('topic_create');

const mediaCreate = (text, type) => SQL`
INSERT INTO
    media (text, type_id)
VALUES
    (${text}, (SELECT media_type_id FROM media_type WHERE media_type.type = ${type}))
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

module.exports = {
    entry: {
        byId: entryById,
        byOwner: entryByOwner,
        create: entryCreate,
    },
    topic: {
        byEntry: topicByEntry,
        create: topicCreate,
    },
    media: {
        create: mediaCreate,
    },
    user: {
        byAuthHash: userByAuthHash,
        byId: userById,
        create: userCreate,
    }
}
