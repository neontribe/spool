var fs = require('fs');
var path = require('path');
var ql  = require('graphql');
var qlutils = require('graphql/utilities');
var introspectionQuery = qlutils.introspectionQuery;
var printSchema = qlutils.printSchema;
var Schema = require('../src/server/graphql/schema.js');

// Save JSON of full schema introspection for Babel Relay Plugin to use
ql.graphql(Schema, introspectionQuery).then(function(result) {
  if (result.errors) {
      console.error(
          'ERROR introspecting schema: ',
          JSON.stringify(result.errors, null, 2)
      );
  } else {
      fs.writeFileSync(
          path.join(__dirname, '..', process.env.REACT_APP_GRAPHQL_URL),
          JSON.stringify(result, null, 2)
      );
  }
});

// Save user readable type system shorthand of schema
fs.writeFileSync(
  path.join(__dirname, '../config/schema.graphql'),
  printSchema(Schema)
);
