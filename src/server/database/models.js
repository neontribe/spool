const moment = require('moment');
const queries = require('./queries');
const db = require('./database');

class Reward {
	constructor(id, user, type, name, goal, completed) {
		this.id = id;
		this.user = user;
		this.type = type
		this.name = name;
		this.goal = goal;
		this.completed = completed ? moment(completed) : false;
	}

	validate(goal, current) {
		return goal === current;
	}

	set current(value) {
		this.current = value;
		if (this.validate(this.goal, this.current) && !this.completed) {
			this.completed = moment();
			Reward.complete(db, this.userId, this.id);
		}
	}

	toString() {
		return this.name;
	}

	static inflate(row) {}
	static findByUserIdAndType(userId, type) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(true, function (error, result) {
                    done();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.rows)
                    }
                });
            });
        });
		p = p.then(rows => rows.map(r => Reward.inflate(r)));
        return p;
	}

	static complete(userId, rewardTypeId) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(queries.user.rewards.complete(userId, rewardTypeId), function (error, result) {
                    done();
                    if (error) {
                        reject(error);
                    } else {
                        resolve()
                    }
                });
            });
        });
        return p;
	}
}
class CountReward extends Reward {
	constructor(type, name, goal, completed) {
		super(type, name, goal, completed);
	}
	validate(goal, current) {
		return current >= goal
	}
	toString() {
		//string sub goal adn current
		return this.name;
	}
}

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
    constructor(id, text, video, videoThumbnail, image, imageThumbnail) {
        this.id = id;
        this.text = text;
        this.video = video;
        this.videoThumbnail = videoThumbnail;
        this.image = image;
        this.imageThumbnail = imageThumbnail;
    }

    static inflate(row, prefix = '') {
        var p = (name) => prefix + name;
        var id = row[p('id')];
        var text = row[p('text')];
        var video = row[p('video')];
        var videoThumbnail = row[p('video_thumbnail')];

        var image = row[p('image')];
        var imageThumbnail = row[p('image_thumbnail')];
        
        return new Media(id, text, video, videoThumbnail, image, imageThumbnail);
    }

    static create(db, userId, media) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(queries.media.create(media.text, media.video, media.videoThumbnail, media.image, media.imageThumbnail), function (error, result) {
                    done();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.rows[0].media_id);
                    }
                });
            });
        });
        return p;
    }
}

class User {
    constructor(id, authHash) {
        this.id = id;
        this.authHash = authHash
    }

    static inflate(row, prefix = '') {
        var p = (name) => prefix + name;

        var id = row[p('id')];
        var authHash = row[p('auth_hash')];

        return new User(id, authHash);
    }

    static create(db, authHash) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(queries.user.create(authHash), function (error, result) {
                    if (error) {
                        done();
                        reject(error);
                    } else {
                        var id = result.rows[0].id;
                        client.query(queries.user.rewards.configure(id), function (error, result) {
                            done();
                            if (error) {
                                reject(error);
                            } else {
                                resolve(User.findById(db, id).then((users) => users.shift()));
                            }
                        });
                    }
                });
            });
        });

        return p;

    }

    static findById(db, id) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(queries.user.byId(id), function (error, result) {
                    done();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.rows)
                    }
                });
            });
        });

        p = p.then(function (rows) {
            return rows.map((row) => User.inflate(row));
        });

        return p;
    }

    static findByAuthHash(db, authHash) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(queries.user.byAuthHash(authHash), function (error, result) {
                    done();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.rows);
                    }
                });
            });
        });

        p = p.then(function (rows) {
            return rows.map((row) => User.inflate(row));
        });

        return p;
    }
}

class Topic {
    constructor(type, name) {
        this.type = type;
        this.name = name;
    }

    static inflate(row, prefix = '') {
        var p = (name) => prefix + name;

        var type = row[p('type')];
        var name = row[p('name')];
        return new Topic(type, name);
    }

    static findByEntryId(db, id) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(queries.topic.byEntry(id), function (error, result) {
                    done();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.rows);
                    }
                });
            });
        });

        p = p.then(function (rows) {
            return rows.map((row) => Topic.inflate(row, 'topic_'));
        });

        return p;
    }

    static findAll(db) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(queries.topic.all(), function (error, result) {
                    done();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.rows);
                    }
                });
            });
        });

        p = p.then(function (rows) {
            return rows.map((row) => Topic.inflate(row, 'topic_'));
        });

        return p;
    }

    static create(db, id, type) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(queries.topic.create(id, type), function (error, result) {
                    done();
                    if (error) {
                        reject(error);
                    } else {
                        //1:M, no ID
                        resolve();
                    }
                });
            });
        });
        return p;
    }
}

class Entry {
    constructor(id, owner, author, media, sentiment, timestamp) {
        this.id = id;
        this._id = id;
        this.owner = owner;
        this.author = author;
        this.media = media;
        this.sentiment = sentiment;
        this.timestamp = moment(timestamp);
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
        var media = Media.inflate(row, 'media_');
        var author = User.inflate(row, 'author_');
        var owner = User.inflate(row, 'owner_');
        var sentiment = Sentiment.inflate(row, 'sentiment_');
        var timestamp = row[p('timestamp')];

        return new Entry(id, owner, author, media, sentiment, timestamp);
    }

    /*
     * @method findByOwnerId
     * Returns a promise that on success will resolve to an array of Entry
     */
    static findByOwnerId(db, id) {
        var p = new Promise(function (resolve, reject) {
            db.connect().then(function({client, done}) {
                client.query(queries.entry.byOwner(id), function (error, result) {
                    done();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.rows)
                    }
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
                    done();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.rows)
                    }
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
            var mediaPromise = Media.create(db, entry.owner, entry.media);
            mediaPromise.then(function(mediaId) {
                db.connect().then(function({client, done}) {
                    client.query(queries.entry.create(entry.author, entry.owner, mediaId, entry.sentiment), function (error, result) {
                        done();
                        if (error) {
                            reject(error);
                        } else {
                            let id = result.rows[0].entry_id;
                            Promise.all(entry.topic.map((t) => Topic.create(db, id, t))).then(function() {
                                resolve(Entry.findById(db, id).then((entries) => entries.shift()));
                            });
                        }
                    });
                });
            });
        });

        return p;
    }
}

module.exports = {
    Entry,
    Topic,
    User,
    Media
}
