SPOOL
======

Hipster BadgeZone
-----------------
[![Code Climate](https://codeclimate.com/github/neontribe/spool/badges/gpa.svg)](https://codeclimate.com/github/neontribe/spool)
[![Build Status](https://travis-ci.org/neontribe/spool.svg?branch=master)](https://travis-ci.org/neontribe/spool)
[![Coverage Status](https://coveralls.io/repos/github/neontribe/spool/badge.svg)](https://coveralls.io/github/neontribe/spool)
[![dependencies Status](https://david-dm.org/neontribe/spool/status.svg)](https://david-dm.org/neontribe/spool)

Installation
============

Cloning the repo and running `npm install` should currently do it.

If your editor throws warnings about missing linter plugins you'll need to do

`npm install -g eslint babel-eslint eslint-plugin-react eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-flowtype`

the react/eslint teams hope to make this go away soon...

Sprint Zero
-----------

* Communications

  https://spoolhq.slack.com

* Story control

  https://trello.com/b/ILmFhpGH

* Issue control

  https://github.com/neontribe/spool/issues

* Version Control

  http://github.com/neontribe/spool

* Continuous Integration

  http://travis-ci.org/neontribe/spool

* Continuous Deployment

  Heroku pipeline: https://dashboard.heroku.com/pipelines/63256697-cf93-44e2-83a0-1b6467fe609e
  Staging app: https://spool-staging.herokuapp.com
  Production app: https://spool-production.herokuapp.com

  Review apps:
    For each Pull Request listed at https://github.com/neontribe/spool/pulls there will be a review app at https://spool-staging-pr-{Pull_Request_Number}

* Fancy integrations

    * SNYK
    * dependencies.io
    * Code Climate
    * Coveralls

Temporary/Stopgap Support Information
============

Adding new Regions/Services directly to production
------------

1. Retrieve the postgres connection environment variable from Heroku
```
psql postgres://foo:bar@foobar.com
```
2. View existing Regions:
```
SELECT * FROM region;
```
3. View existing Services:
```
SELECT * FROM service;
```
4. View connections between Regions and Services:
```
SELECT * FROM region_service;
```
5. Lazy?:
```
SELECT
  region.region_id,
  region.type AS region_type,
  service.type AS service_type,
  service.name AS service_name
FROM
  region
JOIN
  region_service ON region_service.region_id = region.region_id
JOIN
  service ON service.service_id = region_service.service_id;
  ```
6. Create a new region(s):
```
INSERT INTO region ("type") VALUES ('A'), ('B'), ('C') RETURNING *;
```
7. Create a new service(s):
```
INSERT INTO service ("type", "name") VALUES ('foo_bar', 'Foo Bar'), ('baz', 'Baz') RETURNING *;
```
8. Connect a service(s) to a region:
```
INSERT INTO region_service ("region_id", "service_id") VALUES (1, 2), (1, 3), (1, 4);
```

Don't forget
-------------

- Semicolon after SQL statement, otherwise the prompt will go onto the next line
- Update the spreadsheet as the changes will need the appropriate code update at some point in the future
