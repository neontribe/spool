const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql/schema.js');
const path = require('path');
const cors = require('cors');
const jwt = require('express-jwt');
const sha256 = require('sha256');
const db = require('./database/database.js');
const models = require('./database/models.js');

var app = express();

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
        var hash = sha256.x2(userId);
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
        audience: process.env.REACT_APP_AUTH0_CLIENT_ID
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

/* Static Resouces */
app.use(express.static('build'));

/* Drop all routes through to index.html to support browserHistory routing in react */
app.get('*', function (request, response){
  response.sendFile(path.resolve('build', 'index.html'))
})

module.exports = app;

/* instanbul ignore if */
if (!module.parent) {
    app.listen(process.env.PORT || 3001);
}
