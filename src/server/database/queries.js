const entryCreate = `
INSERT INTO
    entry (author_id, owner_id, media_id, sentiment_type_id)
VALUES
    ($authorId, $ownerId, $mediaId,
        (SELECT sentiment_type_id FROM sentiment_type WHERE sentiment_type.type = $sentimentType))`;

const entryByOwner = `
SELECT
    entry.entry_id AS id,

    sentiment_type.type AS sentiment_type,

    author.user_id AS author_id,
    author.first_name AS author_first_name,
    author.last_name AS author_last_name,
    author.email AS author_email,

    owner.user_id AS owner_id,
    owner.first_name AS owner_first_name,
    owner.last_name AS owner_last_name,
    owner.email AS owner_email,

    media_type.type AS media_type_type,
    media.media_id AS media_id,
    media.text AS media_text

FROM 
    entry
JOIN 
    user AS author ON author.user_id = entry.author_id
JOIN
    user AS owner ON owner.user_id = entry.owner_id
JOIN
    media ON media.media_id = entry.media_id
JOIN 
    media_type ON media_type.media_type_id = media.type_id
JOIN
    sentiment_type ON sentiment_type.sentiment_type_id = entry.sentiment_type_id
WHERE
    entry.owner_id = $ownerId`;

/* some DRY concerns here */
const entryById = `
SELECT
    entry.entry_id AS id,

    sentiment_type.type AS sentiment_type,

    author.user_id AS author_id,
    author.first_name AS author_first_name,
    author.last_name AS author_last_name,
    author.email AS author_email,

    owner.user_id AS owner_id,
    owner.first_name AS owner_first_name,
    owner.last_name AS owner_last_name,
    owner.email AS owner_email,

    media_type.type AS media_type_type,
    media.media_id AS media_id,
    media.text AS media_text

FROM 
    entry
JOIN 
    user AS author ON author.user_id = entry.author_id
JOIN
    user AS owner ON owner.user_id = entry.owner_id
JOIN
    media ON media.media_id = entry.media_id
JOIN 
    media_type ON media_type.media_type_id = media.type_id
JOIN
    sentiment_type ON sentiment_type.sentiment_type_id = entry.sentiment_type_id
WHERE
    entry.entry_id = $entryId`;


const topicByEntry = `
SELECT
    topic_type.type AS topic_type
FROM
    x_entry_topics
JOIN
    topic_type ON topic_type.topic_type_id = x_entry_topics.topic_type_id
WHERE
    x_entry_topics.entry_id = $entryId`;

const topicCreate = `
INSERT INTO
    x_entry_topics (entry_id, topic_type_id)
VALUES
    ($entryId, (SELECT topic_type_id FROM topic_type WHERE topic_type.type = $type))`;

const mediaCreate = `
INSERT INTO
    media (text, type_id)
VALUES
    ($text, (SELECT media_type_id FROM media_type WHERE media_type.type = $type))`;


module.exports = {
    entry: {
        byId: entryById,
        byOwner: entryByOwner,
        create: entryCreate
    },
    topic: {
        byEntry: topicByEntry,
        create: topicCreate
    },
    media: {
        create: mediaCreate
    }
}