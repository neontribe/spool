const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql/schema.js');
const cors = require('cors');
const s3Router = require('./s3Router');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const db = require('./database/database.js');
const models = require('./database/models.js');
const createHash = require('sha.js');
const sslRedirect = require('heroku-ssl-redirect');

var app = express();

// enable ssl redirect when the NODE_ENV is production
app.use(sslRedirect(['production']));

var useCors = function () { return (req, res, next) => next(); }
var formatErrors;
if(process.env.NODE_ENV !== 'production') {
    useCors = cors;
    formatErrors = error => ({
        message: error.message,
        locations: error.locations,
        stack: error.stack
    });
}

/*
 * @function reconcileUserMiddleware
 *
 * This middleware checks the authenticated user in req.user
 * and confirms that user exists in the database
 * If the user does not, it is a new auth0 signup... we should then create
 * their entry in the database
 */
function reconcileUser() {
    var userCreateCache = {}
    return function reconcileUserMiddleware (req, res, next) {
        var userId = req.user.sub;
        var sha256 = createHash('sha256')
        var hash = sha256.update(userId).digest('hex');
        var p = new Promise(function findUserPromise(resolve, reject) {
            models.User.findByAuthHash(db, hash).then(function handleFindUser(rows) {
                if (rows.length > 0) {
                    resolve(rows.shift());
                } else {
                    userCreateCache[userId] = userCreateCache[userId] || models.User.create(db, hash);
                    userCreateCache[userId].then(function(user) {
                        resolve(user);
                    });
                }
            });
        });
        p.then(function handleFoundUser(user) {
            userCreateCache[userId] = undefined;
            req.user = user;
            next();
        });
    }
};

/* GRAPHQL Endpoint */
app.use(
    '/graphql',
    useCors(),
    jwt({
        secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
        audience: process.env.AUTH0_CLIENT_ID
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
app.use(express.static('build'));

/* Drop all routes through to index.html to support browserHistory routing in react */
// app.get('*', function (request, response){
//   response.sendFile(path.resolve('build', 'index.html'))
// })

module.exports = app;

/* instanbul ignore if */
if (!module.parent) {
    app.listen(process.env.PORT || 3001);
}
