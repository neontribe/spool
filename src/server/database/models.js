const queries = require('./queries');

class Sentiment {
    constructor(type) {
        this.type = type;
    }

    static inflate(row, prefix = '') {
        var p = (name) => prefix + name;

        var type = row[p('type')];
        return new Sentiment(type);
    }
}

class Media {
    static create(db, media) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(queries.media.create(media.text, 'text'), function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.rows[0].media_id);
                    }
                    done();
                });
            });
        });
        return p;
    }
}
class TextMedia extends Media {
    constructor(id, text) {
        super();
        this.id = id;
        this.text = text;
    }

    static inflate(row, prefix = '') {
        var p = (name) => prefix + name;

        var id = row[p('id')];
        var text = row[p('text')];
        return new TextMedia(id, text);
    }
}

class User {
    constructor(id, firstName, lastName, email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    static inflate(row, prefix = '') {
        var p = (name) => prefix + name;

        var id = row[p('id')];
        var firstName = row[p('first_name')];
        var lastName = row[p('last_name')];
        var email = row[p('email')];

        return new User(id, firstName, lastName, email);
    }
}

class Topic {
    constructor(type) {
        this.type = type;
    }

    static inflate(row, prefix = '') {
        var p = (name) => prefix + name;

        var type = row[p('type')];
        return new Topic(type);
    }

    static findByEntryId(db, id) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(queries.topic.byEntry(id), function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.rows);
                    }
                    done();
                });
            });
        });

        p = p.then(function (rows) {
            return rows.map((row) => Topic.inflate(row, 'topic_'));
        })

        return p;
    }

    static create(db, id, type) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(queries.topic.create(id, type), function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        //1:M, no ID
                        resolve();
                    }
                    done();
                });
            });
        });
        return p;
    }
}

class Entry {
    constructor(id, owner, author, media, sentiment) {
        this.id = id;
        this._id = id;
        this.owner = owner;
        this.author = author;
        this.media = media;
        this.sentiment = sentiment;
    }

    /*
     * @method inflate
     * Returns a new Entry instance containing the data inflated from the row
     *
     * todo: should prefix be an object (rather than a string) allow mapping of prefixes for subclasses
     */
    static inflate(row, prefix = '') {
        var p = (name) => prefix + name;

        var id = row[p('id')];
        var media = TextMedia.inflate(row, 'media_');
        var author = User.inflate(row, 'author_');
        var owner = User.inflate(row, 'owner_');
        var sentiment = Sentiment.inflate(row, 'sentiment_');

        return new Entry(id, owner, author, media, sentiment);
    }

    /*
     * @method findByOwnerId
     * Returns a promise that on success will resolve to an array of Entry
     */
    static findByOwnerId(db, id) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(queries.entry.byOwner(id), function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.rows)
                    }
                    done();
                });
            });
        });

        p = p.then(function (rows) {
            return rows.map((row) => Entry.inflate(row));
        });

        return p;
    }

    static findById(db, id) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(queries.entry.byId(id), function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.rows)
                    }
                    done();
                });
            });
        });

        p = p.then(function (rows) {
            return rows.map((row) => Entry.inflate(row));
        });

        return p;
    }

    static create(db, entry) {
        var p = new Promise(function (resolve, reject) {
            // sentiment is lookup during entry insert
            var mediaPromise = Media.create(db, entry.media);
            mediaPromise.then(function(mediaId) {
                db.connect().then(function({client, done}) {
                    client.query(queries.entry.create(entry.author, entry.owner, mediaId, entry.sentiment), function (error, result) {
                        if (error) {
                            reject(error);
                        } else {
                            let id = result.rows[0].entry_id;
                            Topic.create(db, id, entry.topic).then(() => resolve(id));
                        }
                        done();
                    });
                });
            });
        });

        p = p.then(function(id) {
            //take the entryId, grab the entry record (1 row, array) and return the result
            return Entry.findById(db, id).then((entries) => entries.shift());
        });

        return p;
    }
}

module.exports = {
    Entry,
    Topic
}
