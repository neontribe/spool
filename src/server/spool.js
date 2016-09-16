const co = require('co');
const {models} = require('./database');
const moment = require('moment');

function makeRequest(request) {
    return co(function* () {
        // make a new request
        var newRequest = yield models.Request.create(db, request);
        // find each consumer user that is in the request region
        var users = yield models.User.findByRoleAndRegionType(db, "creator", newRequest.region);
        // for each of the users, create a user_request for that user
        var userRequests = yield users.map((user) => models.UserRequest.create(db, newRequest.id, user.id));
        yield userRequests.map(function* (userRequest) {
            // find all entries that are in the bounds of the request
            var entries = yield models.Entry.findByOwnerBeforeTimestamp(db, userRequest.user.id, userRequest.request.to);
            // link the entries to the user request
            yield entries.map(entry => models.UserRequest.linkEntry(db, entry.id, userRequest.id));
        });
    });
        /*
        var request = yield model
        var p = new Promise(function(resolve, reject) {
            models.Request.create(db, request.userId, moment(request.start), moment(request.end))
            .then(function(newRequest) {
                // resolve find all users matching the request region
                models.User.findByRegionType(db, newRequest.region).then(function(users) {
                    Promise.all(users.map(function(user) {
                        return new Promise(function(r, rj) {
                            models.UserRequest.create(db, newRequest.id, user.id).then(function(userRequest) {
                                //find all entries that this request would affect
                                models.Entry.findByOwnerBeforeTimestamp(db, userRequest.user.id, userRequest.request.end)
                                .then(function(entries) {
                                    Promise.all(entries.map(entry =>  models.UserRequest.linkEntry(db, entry.id, userRequest.id)))
                                    .then(() => r());
                                });
                            });
                        });
                    })).then(() => resolve());
                });
            });
        }); */
}

module.exports = {
    makeRequest
}
