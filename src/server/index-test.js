var app = require('./index.js');
var request = require('supertest');

describe('graphql endpoint', function() {
    it('should serve a 400 at its root', function(done){
        request(app)
            .get('/graphql')
            .expect(400, done);
    });
});
