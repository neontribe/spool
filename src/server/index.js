const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql/schema.js');

var app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    pretty: true,
    graphiql: true
}));

module.exports = app;

/* instanbul ignore if */
if (!module.parent) {
    app.listen(process.env.PORT || 3001);
}
