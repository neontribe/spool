var app = require('../src/server/index.js');
var request = require('supertest');

describe('Placeholder app', function() {
    it('should serve a 200 at its root', function(done){
        request(app)
            .get('/')
            .expect(200, done);
    });
});
