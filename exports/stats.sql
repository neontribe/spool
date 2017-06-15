SELECT
  SUM(if(user_account.sharing, 1, 0)) AS sharingUsers,
  SUM(if(user_account.sharing, 0, 1)) AS nonSharingUsers

FROM
  user_account

WHERE
  user_account.region_id != 1; -- demo region
