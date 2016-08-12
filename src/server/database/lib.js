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
    constructor(id) {}
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

class Entry {
    constructor(id, owner, author, media, sentiment) {
        this.id = id;
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
            }, (error, rows) => { error ? reject(error) : resolve(rows) });
        });

        p = p.then(function (rows) {
            return rows.map((row) =>  Entry.inflate(row));
        }).catch(function(rejection) {
            throw rejection;
        });

        return p;
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
            }, (error, rows) => { error ? reject(error) : resolve(rows) });
        });

        p = p.then(function (rows) {
            return rows.map((row) => Topic.inflate(row, 'topic_'));
        }).catch(function(rejection) {
            throw rejection;
        });

        return p;
    }
}

module.exports = {
    Entry,
    Topic
}
