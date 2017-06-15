SELECT
  entry.entry_id AS entryId,
  topic.name AS name

FROM
  entry

JOIN
  user_account ON user_account.user_id = entry.owner_id
JOIN
  profile ON profile.profile_id = user_account.profile_id
JOIN
  entry_topic ON entry_topic.entry_id = entry.entry_id 
JOIN
  topic ON topic.topic_id = entry_topic.topic_id

WHERE
  profile.sharing = true
AND
  user_account.region_id != 1; -- demo region
