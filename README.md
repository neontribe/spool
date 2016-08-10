SPOOL
=====

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
