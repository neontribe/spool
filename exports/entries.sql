SELECT
  entry.created_at AS creationDate,
  entry.entry_id AS entryId,
  entry.owner_id AS ownerId,
  entry.author_id AS authorId,
  media.text AS text,
  media.image AS image,
  media.video AS video,
  sentiment.type AS sentiment,
  entry.views AS viewCount

FROM
  entry

JOIN
  user_account ON user_account.user_id = entry.owner_id
JOIN
  profile ON profile.profile_id = user_account.profile_id
JOIN
  sentiment ON sentiment.sentiment_id = entry.sentiment_id
JOIN
  media ON media.media_id = entry.media_id

WHERE
  profile.sharing = true
AND
  user_account.region_id != 1; -- demo region
