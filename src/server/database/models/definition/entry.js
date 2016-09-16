'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Entry', {
        entryId: {
            type: DataTypes.INTEGER,
            field: 'entry_id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        authorId: {
            type: DataTypes.INTEGER,
            field: 'author_id',
            allowNull: true,
            references: {
                model: 'user_account',
                key: 'user_id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'SET NULL'
        },
        ownerId: {
            type: DataTypes.INTEGER,
            field: 'owner_id',
            allowNull: true,
            references: {
                model: 'user_account',
                key: 'user_id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'CASCADE'
        },
        sentimentId: {
            type: DataTypes.INTEGER,
            field: 'sentiment_id',
            allowNull: true,
            references: {
                model: 'sentiment',
                key: 'sentiment_id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION'
        },
        timestamp: {
            type: DataTypes.DATE,
            field: 'timestamp',
            allowNull: true
        }
    }, {
        schema: 'public',
        tableName: 'entry',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var Entry = model.Entry;
    var EntryTopic = model.EntryTopic;
    var EntryUserRequest = model.EntryUserRequest;
    var Medium = model.Medium;
    var UserAccount = model.UserAccount;
    var Sentiment = model.Sentiment;
    var Topic = model.Topic;
    var UserRequest = model.UserRequest;

    Entry.hasMany(EntryTopic, {
        as: 'TopicEntryIdFkeys',
        foreignKey: 'entry_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    Entry.hasMany(EntryUserRequest, {
        as: 'UserRequestEntryIdFkeys',
        foreignKey: 'entry_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    Entry.hasMany(Medium, {
        as: 'MediaEntryIdFkeys',
        foreignKey: 'entry_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    Entry.belongsTo(UserAccount, {
        as: 'Author',
        foreignKey: 'author_id',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION'
    });

    Entry.belongsTo(UserAccount, {
        as: 'Owner',
        foreignKey: 'owner_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    Entry.belongsTo(Sentiment, {
        as: 'Sentiment',
        foreignKey: 'sentiment_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Entry.belongsToMany(Topic, {
        as: 'EntryTopicTopics',
        through: EntryTopic,
        foreignKey: 'entry_id',
        otherKey: 'topic_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    Entry.belongsToMany(UserRequest, {
        as: 'EntryUserRequestUserRequests',
        through: EntryUserRequest,
        foreignKey: 'entry_id',
        otherKey: 'user_request_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

};
