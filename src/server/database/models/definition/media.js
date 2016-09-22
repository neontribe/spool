'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Medium', {
        mediaId: {
            type: DataTypes.INTEGER,
            field: 'media_id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        text: {
            type: DataTypes.STRING(255),
            field: 'text',
            allowNull: true
        },
        video: {
            type: DataTypes.STRING(255),
            field: 'video',
            allowNull: true
        },
        videoThumbnail: {
            type: DataTypes.STRING(255),
            field: 'video_thumbnail',
            allowNull: true
        },
        image: {
            type: DataTypes.STRING(255),
            field: 'image',
            allowNull: true
        },
        imageThumbnail: {
            type: DataTypes.STRING(255),
            field: 'image_thumbnail',
            allowNull: true
        }
    }, {
        schema: 'public',
        tableName: 'media',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var Medium = model.Medium;
    var Entry = model.Entry;
    var UserAccount = model.UserAccount;
    var Sentiment = model.Sentiment;

    Medium.hasMany(Entry, {
        as: 'EntryMediaIdFkeys',
        foreignKey: 'media_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Medium.belongsToMany(UserAccount, {
        as: 'EntryAuthors',
        through: Entry,
        foreignKey: 'media_id',
        otherKey: 'author_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Medium.belongsToMany(UserAccount, {
        as: 'EntryOwners',
        through: Entry,
        foreignKey: 'media_id',
        otherKey: 'owner_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Medium.belongsToMany(Sentiment, {
        as: 'EntrySentiments',
        through: Entry,
        foreignKey: 'media_id',
        otherKey: 'sentiment_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

};
