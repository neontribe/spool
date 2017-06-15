SELECT
  user_account.created_at AS creationDate,
  user_account.user_id AS userId,
  profile.supporter AS supporter,
  profile.age AS age,
  region.name AS region,
  residence.name AS residence

FROM
  user_account

JOIN
  profile ON profile.profile_id = user_account.profile_id
JOIN
  residence ON residence.residence_id = profile.residence_id
JOIN
  region ON region.region_id = user_account.region_id

WHERE
  profile.sharing = true
AND
  user_account.region_id != 1; -- demo region
