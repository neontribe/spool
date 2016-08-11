const sqlite3 = require('sqlite3');

const DATABASE_FILE = './experiment.db';
const findByUser = `
        SELECT
            entries.id,
            author.id AS author_id,
            author.firstName AS author_firstName,
            author.lastName AS author_lastName,
            author.email AS author_email,
            owner.id AS owner_id,
            owner.firstName AS owner_firstName,
            owner.lastName AS owner_lastName,
            owner.email AS owner_email,
            mediaTypes.type AS media_type,
            media.id AS media_id,
            media.text AS media_text
        FROM 
            entries
        JOIN 
            users AS author ON author.id = entries.authorId
        JOIN
            users AS owner ON owner.id = entries.ownerId
        JOIN
            media ON media.id = entries.mediaId
        JOIN 
            mediaTypes ON mediaTypes.id = media.typeId
        WHERE
            entries.ownerId = $owner`;

const QUERIES = {
    entries: {
        findByUser
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
        var firstName = row[p('firstName')];
        var lastName = row[p('lastName')];
        var email = row[p('email')];

        return new User(id, firstName, lastName, email);
    }
}

class Entry {
    constructor(id, owner, author, media) {
        this.id = id;
        this.owner = owner;
        this.author = author;
        this.media = media;
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
        return new Entry(id, owner, author, media);
    }

    /*
     * @method findByOwnerId
     * Returns a promise that on success will resolve to an array of Entry
     */
    static findByOwnerId(db, id) {
        var p = new Promise(function (resolve, reject) {
            db.all(QUERIES.entries.findByUser, {
                $owner: id
            }, (error, rows) => { error ? reject(error) : resolve(rows) });
        });

        p = p.then(function (rows) {
            return rows.map((row) =>  Entry.inflate(row));
        }).catch(function(rejection) {
            // todo error handling
        });

        return p;
    }
}

var db;
module.exports = {
    connect: function() {
        if (!db) {
            db = new sqlite3.Database(DATABASE_FILE);
        }
        return db;
    },
    Entry
}
