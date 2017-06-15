SELECT
  user_account.user_id AS userId,
  service.name AS service

FROM
  user_account

JOIN
  profile ON profile.profile_id = user_account.profile_id
JOIN
  profile_service ON profile_service.profile_id = profile.profile_id
JOIN
  service ON service.service_id = profile_service.service_id

WHERE
  profile.sharing = true
AND
  user_account.region_id != 1; -- demo region
