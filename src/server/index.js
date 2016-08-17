const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql/schema.js');
const path = require('path');
const cors = require('cors');

var app = express();

var useCors = function () { return (req, res, next) => next(); }
if(process.env.NODE_ENV !== 'production') {
    useCors = cors;
}

/* GRAPHQL Endpoint */
app.use('/graphql', useCors(), graphqlHTTP({
    schema: schema,
    pretty: true,
    graphiql: true
}));

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
