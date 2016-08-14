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
            db.run(queries.media.create, {
                $text: media.text,
                $type: 'text'
            }, function (error) {
                if (error) {
                    return reject(error);
                }
                return resolve(this.lastID);  
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
            db.all(queries.topic.byEntry, {
                $entryId: id
            }, (error, rows) => error ? reject(error) : resolve(rows));
        });

        p = p.then(function (rows) {
            return rows.map((row) => Topic.inflate(row, 'topic_'));
        })

        return p;
    }

    static create(db, id, type) {
        var p = new Promise(function (resolve, reject) {
            db.run(queries.topic.create, {
                $entryId: id,
                $type: type
            }, function (error) {
                if (error) {
                    return reject(error);
                }
                resolve(this.lastID);
            })
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
            db.all(queries.entry.byOwner, {
                $ownerId: id
            }, (error, rows) => error ? reject(error) : resolve(rows));
        });

        p = p.then(function (rows) {
            return rows.map((row) => Entry.inflate(row));
        });

        return p;
    }

    static findById(db, id) {
        var p = new Promise(function (resolve, reject) {
            db.all(queries.entry.byId, {
                $entryId: id
            }, (error, rows) => error ? reject(error) : resolve(rows));
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
                db.run(queries.entry.create, {
                    $ownerId: entry.owner,
                    $authorId: entry.author,
                    $mediaId: mediaId,
                    $sentimentType: entry.sentiment,
                }, function (error) {
                    if (error) {
                        return reject(error);
                    }
                    var id = this.lastID;
                    // insert the topics then resolve the main promise with the entry insert id
                    // we dont actually care about the IDs Topic.create will resolve...
                    // we control the execution purely to ensure no race conditions exist
                    Promise.all(entry.topic.map((t) => Topic.create(db, id, t.type)))
                        .then(() => resolve(id))
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
