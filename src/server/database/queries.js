const SQL = require('sql-template-strings');

const entryCreate = (authorId, ownerId, sentimentType) => SQL`
INSERT INTO
    entry (author_id, owner_id, sentiment_type_id, timestamp)
VALUES
    (${authorId}, ${ownerId},
        (SELECT sentiment_type_id FROM sentiment_type WHERE sentiment_type.type = ${sentimentType}), now())
RETURNING
    entry_id`.setName('entry_create');

const requestCreate = (userId, start, end) => SQL`
INSERT INTO
    request (user_id, start, end)
VALUES
    (${userId}, ${start}, ${end})
RETURNING
    request_id`.setName('request_create');

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
LEFT JOIN 
    user_account AS author ON author.user_id = entry.author_id
JOIN
    user_account AS owner ON owner.user_id = entry.owner_id
JOIN
    media ON media.entry_id = entry.entry_id
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
LEFT JOIN 
    user_account AS author ON author.user_id = entry.author_id
JOIN
    user_account AS owner ON owner.user_id = entry.owner_id
JOIN
    media ON media.entry_id = entry.entry_id
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

const entryTopicCreate = (entryId, type) => SQL`
INSERT INTO
    x_entry_topics (entry_id, topic_type_id)
VALUES
    (${entryId}, (SELECT topic_type_id FROM topic_type WHERE topic_type.type = ${type}))`.setName('entry_topic_create');

const requestTopicCreate = (requestId, type) => SQL`
INSERT INTO
    x_request_topics (request_id, topic_type_id)
VALUES
    (${requestId}, (SELECT topic_type_id FROM topic_type WHERE topic_type.type = ${type}))`.setName('request_topic_create');

/*
 * Given a requestId
 * Inserts records into 'user_request' where the request end is less than the user account creation timestamp and the user does not already have a matching record in 'user_request'
 */
const userRequestCreate = (requestId) => SQL`
INSERT INTO
    user_request (request_id, user_id)
VALUES
    (
        SELECT
            request.request_id,
            potential_user.user_id
        FROM
            request
        JOIN
            user_account AS policy_user ON policy_user.user_id = request.user_id
        JOIN
            user_account AS potential_user 
            ON potential_user.timestamp < request.end
            AND potential_user.region_type_id = policy_user.region_type_id
        LEFT JOIN 
            user_request AS existing_user 
            ON existing_user.request_id = request.request_id 
            AND existing_user.user_id = potential_user.id
        WHERE
            request.request_id = ${request_id}
        AND
            existing_user.user_id IS NULL
     )
RETURNING
    user_request.user_request_id`.setName('user_request_create');

/*
 * Given a userRequestId
 * Inserts records into 'x_entries_user_requests' where the request end is less than the
 * entry creation timestamp and the entry does not already have a matching record in 'x_entries_user_requests'
 */
const userRequestEntryCreate = (userRequestId) => SQL`
INSERT INTO
    x_entries_user_requests (entry_id, user_request_id)
VALUES
    (
        SELECT
            potential_entry.entry_id,
            user_request.user_request_id
        FROM
            user_request
        JOIN
            request ON request.request_id = user_request.request_id
        JOIN
            entry AS potential_entry
            ON potential_entry.timestamp < request.end
            AND potential_entry.owner_id = user_request.user_id
        LEFT JOIN
            x_entries_user_requests AS existing_entry
            ON existing_entry.entry_id = potential_entry.entry_id
            AND existing_entry.user_request_id = user_request.user_request_id
        WHERE
            user_request.user_request_id = ${userRequestId}
        AND
            existing_entry.user_request_id IS NULL
    )`.setName('user_request_entry_create');

/*
 * Given a entryId
 * Inserts records into 'x_entries_user_requests' where the request end is less than the
 * entry creatino timestamp and the entry does not already have a matching record in
 * 'x_entries_user_requests'
 */
const entryUserRequestCreate = (entryId) => SQL`
INSERT INTO
    x_entries_user_requests (entry_id, user_request_id)
VALUES
    (
        SELECT
            entry.entry_id,
            user_request.user_request_id
        FROM
            entry
        JOIN
            user_request ON user_request.user_id = entry.owner_id
        JOIN
            request AS potential_request
            ON potential_request.end > entry.timestamp
            AND potential_request.request_id = user_request.request_id
        LEFT JOIN
            x_entries_user_requests AS existing_user_request
            ON existing_user_request.user_request_id = user_request.user_request_id
            AND existing_user_request.entry_id = entry.entry_id
        WHERE
            entry.entry_id = ${entryId}
        AND
            existing_user_request.entry_id IS NULL
    )`.setName('entry_user_request_create');

const mediaCreate = (entryId, text, video, videoThumbnail, image, imageThumbnail) => SQL`
INSERT INTO
    media (entry_id, text, video, video_thumbnail, image, image_thumbnail)
VALUES
    (${entryId}, ${text}, ${video}, ${videoThumbnail}, ${image}, ${imageThumbnail})
RETURNING
    media_id`.setName('media_create');

const userByAuthHash = (hash) => SQL`
SELECT
    user_id AS id,
    auth_hash AS auth_hash,
    role_type.type AS role,
    region_type.type AS region
FROM
    user_account
LEFT JOIN
    role_type ON role_type.role_type_id = user_account.role_type_id
LEFT JOIN
    region_type ON region_type.region_type_id = user_account.region_type_id
WHERE
    user_account.auth_hash = ${hash}`.setName('user_by_auth_hash');

const userById = (userId) => SQL`
SELECT
    user_id AS id,
    auth_hash,
    role_type.type AS role,
    region_type.type AS region
FROM
    user_account
LEFT JOIN
    role_type ON role_type.role_type_id = user_account.role_type_id
LEFT JOIN
    region_type ON region_type.region_type_id = user_account.region_type_id
WHERE
    user_account.user_id = ${userId}`.setName('user_by_user_id');

const userCreate = (hash) => SQL`
INSERT INTO
    user_account (auth_hash)
VALUES
    (${hash})
RETURNING
    user_id AS id`.setName('user_create');

const userUpdateById = (userId, roleSecret, region = 'Test') => SQL`
UPDATE
    user_account
SET
    role_type_id = (SELECT role_type_id FROM role_type WHERE role_type.secret = ${roleSecret}),
    region_type_id = (SELECT region_type_id FROM region_type WHERE region_type.type = ${region})
WHERE
    user_account.user_id = ${userId}`.setName('user_update_role');

const entryCountByRange = (from, to) => SQL`
    SELECT
        owner_id,
        COUNT(entry.entry_id)
    FROM
        entry
    WHERE
        entry.timestamp
            BETWEEN ${from} AND ${to}
    GROUP BY
        entry.owner_id
`.setName('entry_count_by_range')

const regionAll = () => SQL`
    SELECT
        region_type.type
    FROM
        region_type
`.setName('region_all');

const roleAll = () => SQL`
    SELECT
        role_type.type,
        role_type.name,
        role_type.secret,
        role_type.hidden
    FROM
        role_type
`.setName('role_all');


module.exports = {
    request: {
        create: requestCreate,
        topics: {
            create: requestTopicCreate
        },
        users: {
            create: requestUserCreate
        }
    },
    userRequest: {
        create: userRequestCreate,
        entries: {
            create: userRequestEntryCreate
        }
    },
    entry: {
        byId: entryById,
        byOwner: entryByOwner,
        create: entryCreate,
        countByRange: entryCountByRange,
        userRequest: {
            create: entryUserRequestCreate,
        },
        topics: {
            create: entryTopicCreate,
        }
    },
    topic: {
        byEntry: topicByEntry,
        all: topicAll
    },
    media: {
        create: mediaCreate,
    },
    user: {
        byAuthHash: userByAuthHash,
        byId: userById,
        create: userCreate,
        updateById: userUpdateById,
    },
    role: {
        all: roleAll
    },
    region: {
        all: regionAll,
    },
}
