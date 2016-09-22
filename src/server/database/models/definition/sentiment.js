'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Sentiment', {
        sentimentId: {
            type: DataTypes.INTEGER,
            field: 'sentiment_id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING(255),
            field: 'type',
            allowNull: true
        }
    }, {
        schema: 'public',
        tableName: 'sentiment',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var Sentiment = model.Sentiment;
    var Entry = model.Entry;
    var UserAccount = model.UserAccount;
    var Medium = model.Medium;

    Sentiment.hasMany(Entry, {
        as: 'EntrySentimentIdFkeys',
        foreignKey: 'sentiment_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Sentiment.belongsToMany(UserAccount, {
        as: 'EntryAuthors',
        through: Entry,
        foreignKey: 'sentiment_id',
        otherKey: 'author_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Sentiment.belongsToMany(Medium, {
        as: 'EntryMedia',
        through: Entry,
        foreignKey: 'sentiment_id',
        otherKey: 'media_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Sentiment.belongsToMany(UserAccount, {
        as: 'EntryOwners',
        through: Entry,
        foreignKey: 'sentiment_id',
        otherKey: 'owner_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

};
