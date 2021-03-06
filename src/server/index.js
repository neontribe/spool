const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql/schema.js');
const cors = require('cors');
const s3Router = require('./s3Router');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const {models, helpers} = require('./database');
const createHash = require('sha.js');
const sslRedirect = require('heroku-ssl-redirect');
const path = require('path');
const compression = require('compression');
const serveStatic = require('serve-static');
const winston = require('winston');

var app = express();

app.use(compression());

// enable ssl redirect when the NODE_ENV is production
app.use(sslRedirect(['production']));

var useCors = function () { return (req, res, next) => next(); };
var formatErrors;
if (process.env.NODE_ENV !== 'production') {
    useCors = cors;
    formatErrors = error => ({
        message: error.message,
        locations: error.locations,
        stack: error.stack
    });
    winston.level = 'info';
}

/*
 * @function reconcileUserMiddleware
 *
 * This middleware checks the authenticated user in req.user
 * and confirms that user exists in the database
 * If the user does not, it is a new auth0 signup... we should then create
 * their entry in the database
 */
function reconcileUser () {
    var userCreateCache = {};
    return function reconcileUserMiddleware (req, res, next) {
        var userId = req.user.sub;
        var sha256 = createHash('sha256');
        var hash = sha256.update(userId).digest('hex');
        var p = new Promise(function findUserPromise (resolve, reject) {
            models.UserAccount.findOne({
                where: {
                    authHash: hash
                },
                include: helpers.includes.UserAccount.leftProfile
            }).then(function handleFindUser (user) {
                if (user) {
                    resolve(user);
                } else {
                    userCreateCache[userId] = userCreateCache[userId] || models.UserAccount.create({
                        authHash: hash,
                        // todo, avoid this hardcoded value
                        roleId: 1
                    });
                    return userCreateCache[userId].then(function (user) {
                        return resolve(user);
                    });
                }
            }).catch((e) => winston.warn(e));
        });
        p.then(function handleFoundUser (user) {
            userCreateCache[userId] = undefined;
            req.user = user;
            return next();
        });
    };
};

/* GRAPHQL Endpoint */
app.use(
    '/graphql',
    useCors(),
    jwt({
        // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: 'https://' + process.env.AUTH0_DOMAIN + '/.well-known/jwks.json'
        }),
        audience: process.env.AUTH0_CLIENT_ID,
        issuer: 'https://' + process.env.AUTH0_DOMAIN + '/',
        algorithms: [ 'RS256' ]
    }),
    reconcileUser(),
    graphqlHTTP(request => ({
        context: request.user,
        schema: schema,
        pretty: true,
        graphiql: true,
        formatError: formatErrors
    }))
);

app.use('/s3', bodyParser.json(), s3Router({
    bucket: process.env.S3_BUCKET,
    ACL: 'private'
}));

/* Static Resouces */
app.use(serveStatic('build', {maxAge: '30 days'}));

/* Drop all routes through to index.html to support browserHistory routing in react */
app.get('*', function (request, response) {
    response.sendFile(path.resolve('build', 'index.html'));
});

module.exports = app;

/* instanbul ignore if */
if (!module.parent) {
    app.listen(process.env.PORT || 3001);
}
