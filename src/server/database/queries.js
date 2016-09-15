const SQL = require('sql-template-strings');

const entry = {
    _root: SQL`
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
            sentiment_type ON sentiment_type.sentiment_type_id = entry.sentiment_type_id`,
    byId: (entryId) => SQL``
        .append(entry._root)
        .append(SQL` WHERE entry.entry_id = ${entryId}`)
        .setName('entry_by_entry_id'),
    byOwner: (ownerId) => SQL``
        .append(entry._root)
        .append(SQL` WHERE entry.owner_id = ${ownerId}`)
        .append(SQL` ORDER BY timestamp DESC`)
        .setName('entry_by_owner_id'),
    byOwnerBeforeTimestamp: (ownerId, timestamp) => SQL``
        .append(entry._root)
        .append(SQL` WHERE entry.owner_id = ${ownerId}`)
        .append(SQL` AND entry.timestamp < ${timestamp}`)
        .setName('entry_by_user_and_timestamp'),
    create: (authorId, ownerId, sentimentType) => SQL`
        INSERT INTO
            entry (author_id, owner_id, sentiment_type_id, timestamp)
        VALUES
            (${authorId}, ${ownerId},
                (SELECT sentiment_type_id FROM sentiment_type WHERE sentiment_type.type = ${sentimentType}), now())
        RETURNING
            entry_id`.setName('entry_create'),
    countByRange: (from, to) => SQL`
        SELECT
            owner_id,
            COUNT(entry.entry_id)
        FROM
            entry
        WHERE
            entry.timestamp
                BETWEEN ${from} AND ${to}
        GROUP BY
                entry.owner_id`.setName('entry_count_by_range'),
};

const topic = {
    _root: SQL`
        SELECT
            topic_type.type AS topic_type,
            topic_type.name AS topic_name
        FROM
            topic_type`,
    byEntry: (entryId) => SQL``
        .append(topic._root)
        .append(SQL`
        JOIN
            x_entry_topics ON x_entry_topics.topic_type_id = topic_type.topic_type_id
        WHERE
        x_entry_topics.entry_id = ${entryId}`)
        .setName('topic_by_entry_id'),
    byRequest: (requestId) => SQL``
        .append(topic._root)
        .append(SQL`
        JOIN
            x_request_topics ON x_request_topics.topic_type_id = topic_type.topic_type_id
        WHERE
            x_request_topics.request_id = ${requestId}`)
        .setName('topic_by_request_id'),
    entry: {
        create: (entryId, type) => SQL`
            INSERT INTO
                x_entry_topics (entry_id, topic_type_id)
            VALUES
                (${entryId}, (SELECT topic_type_id FROM topic_type WHERE topic_type.type = ${type}))`.setName('topic_entry_create'),
    },
    request: {
        create: (requestId, type) => SQL`
            INSERT INTO
                x_request_topics (request_id, topic_type_id)
            VALUES
                (${requestId}, (SELECT topic_type_id FROM topic_type WHERE topic_type.type = ${type}))`.setName('topic_request_create'),
    },
    all: () => SQL``.append(topic._root).setName('topic_all'),
    countsByRange: (from, to) => SQL`
        SELECT
            topic_type.type AS topic_type,
            topic_type.name AS topic_name,
            COUNT(entry.entry_id) AS entry_count,
            COUNT(DISTINCT entry.owner_id) AS creator_count
        FROM
            topic_type
        LEFT JOIN
            x_entry_topics ON x_entry_topics.topic_type_id = topic_type.topic_type_id
        LEFT JOIN
            entry ON entry.entry_id = x_entry_topics.entry_id AND entry.timestamp BETWEEN ${from} AND ${to}
        GROUP BY
            topic_type.type, topic_type.name
        `.setName('topic_counts_by_range'),
};

const media = {
    create: (entryId, text, video, videoThumbnail, image, imageThumbnail) => SQL`
    INSERT INTO
        media (entry_id, text, video, video_thumbnail, image, image_thumbnail)
    VALUES
        (${entryId}, ${text}, ${video}, ${videoThumbnail}, ${image}, ${imageThumbnail})
    RETURNING
        media_id`.setName('media_create'),
};

const user = {
    _root: SQL`
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
            region_type ON region_type.region_type_id = user_account.region_type_id`,
    byAuthHash: (hash) => SQL``
        .append(user._root)
        .append(SQL` WHERE user_account.auth_hash = ${hash}`)
        .setName('user_by_auth_hash'),
    byId: (userId) => SQL``
        .append(user._root)
        .append(SQL` WHERE user_account.user_id = ${userId}`)
        .setName('user_by_user_id') ,
    byRoleAndRegionType: (roleType, regionType) => SQL``
        .append(user._root)
        .append(SQL` WHERE region_type.type = ${regionType}`)
        .append(SQL` AND role_type.type = ${roleType}`)
        .setName('user_by_region_type'),
    create: (hash) => SQL`
        INSERT INTO
            user_account (auth_hash, timestamp)
        VALUES
            (${hash}, now())
        RETURNING
            user_id AS id`.setName('user_create'),
    updateById: (userId, roleSecret, region = 'Test') => SQL`
        UPDATE
            user_account
        SET
            role_type_id = (SELECT role_type_id FROM role_type WHERE role_type.secret = ${roleSecret}),
            region_type_id = (SELECT region_type_id FROM region_type WHERE region_type.type = ${region})
        WHERE
            user_account.user_id = ${userId}`.setName('user_update_role'),
};

const region = {
    all: () => SQL`
        SELECT
            region_type.type
        FROM
            region_type`.setName('region_all'),
};

const role = {
    all: () => SQL`
        SELECT
            role_type.type,
            role_type.name,
            role_type.secret,
            role_type.hidden
        FROM
            role_type`.setName('role_all'),
};

const request = {
    _root: SQL`
        SELECT
            request.request_id AS id,
            request.user_id,
            request.from,
            request.to,
            region_type.type AS region,
            request.reason,
            request.name,
            request.org,
            request.avatar
        FROM
            request
        JOIN
            region_type ON region_type.region_type_id = request.region_type_id`,
    create: (userId, from, to, regionType, reason, name, org, avatar) => SQL`
        INSERT INTO
            request ("user_id", "from", "to", "reason", "name", "org","avatar", "region_type_id")
        VALUES
            (${userId}, ${from}, ${to}, ${reason}, ${name}, ${org}, ${avatar}, (SELECT region_type_id FROM region_type WHERE region_type.type = ${regionType}))
        RETURNING
            request_id`.setName('request_create'),
    byId: (requestId) => SQL``
        .append(request._root)
        .append(SQL` WHERE request.request_id = ${requestId}`),
    byRegionBeforeEnd: (regionType, timestamp) => SQL``
        .append(request._root)
        .append(SQL` WHERE region_type.type = ${regionType} AND request.to > timestamp`)
        .setName('request_by_region_before_end'),
}

const user_request = {
    _root: SQL`
        SELECT
            user_request.user_request_id AS id,
            user_request.user_id,
            user_request.seen,
            user_request.request_id,
            request.reason AS request_reason,
            request.name AS request_name,
            request.org AS request_org,
            request.avatar AS request_avatar,
            request.user_id AS request_user_id,
            request.from AS request_from,
            request.to AS request_to,
            region_type.type AS request_region
        FROM
            user_request
        JOIN
            request ON request.request_id = user_request.request_id
        JOIN
            region_type ON region_type.region_type_id = request.region_type_id`,
    create: (requestId, userId) => SQL`
        INSERT INTO
            user_request (request_id, user_id)
        VALUES
            (${requestId}, ${userId})
        RETURNING
            user_request_id`.setName('user_request_create'),
    entry: {
        create: (entryId, userRequestId) => SQL`
            INSERT INTO
                x_entries_user_requests (entry_id, user_request_id)
            VALUES
                (${entryId}, ${userRequestId})`.setName('user_request_entries_create'),
    },
    byUserNotSeen: (userId) => SQL``
        .append(user_request._root)
        .append(SQL` WHERE user_request.user_id = ${userId} AND user_request.seen IS FALSE`)
        .setName('user_request_by_user_not_seen'),
    byId: (userRequestId) => SQL``
        .append(user_request._root)
        .append(SQL` WHERE user_request.user_request_id = ${userRequestId}`)
        .setName('user_request_by_user_request_id'),
    byUserBeforeEnd: (userId, timestamp) => SQL``
        .append(user_request._root)
        .append(SQL` WHERE user_request.user_id = ${userId} AND request.end > ${timestamp}`)
        .setName('user_request_by_user_before_timestamp'),
}

module.exports = {
    entry,
    topic,
    media,
    user,
    role,
    region,
    request,
    user_request,
};
