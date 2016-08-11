const findByUser = `
        SELECT
            entries.id,
            author.id AS author_id,
            author.firstName AS author_firstName,
            author.lastName AS author_lastName,
            author.email AS author_email,
            owner.id AS owner_id,
            owner.firstName AS owner_firstName,
            owner.lastName AS owner_lastName,
            owner.email AS owner_email,
            mediaTypes.type AS media_type,
            media.id AS media_id,
            media.text AS media_text
        FROM 
            entries
        JOIN 
            users AS author ON author.id = entries.authorId
        JOIN
            users AS owner ON owner.id = entries.ownerId
        JOIN
            media ON media.id = entries.mediaId
        JOIN 
            mediaTypes ON mediaTypes.id = media.typeId
        WHERE
            entries.ownerId = $owner`;

module.exports = {
    entries: {
        findByUser
    }
}
