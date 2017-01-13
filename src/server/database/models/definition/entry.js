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
        mediaId: {
            type: DataTypes.INTEGER,
            field: 'media_id',
            allowNull: true,
            references: {
                model: 'media',
                key: 'media_id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION'
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
        views: {
            type: DataTypes.INTEGER,
            field: 'views',
            allowNull: false,
            defaultValue: 0
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at',
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at',
            allowNull: true
        }
    }, {
        schema: 'public',
        tableName: 'entry',
        timestamps: true
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var Entry = model.Entry;
    var EntryTopic = model.EntryTopic;
    var UserAccount = model.UserAccount;
    var Medium = model.Medium;
    var Sentiment = model.Sentiment;
    var Topic = model.Topic;

    Entry.hasMany(EntryTopic, {
        as: 'TopicEntryIdFkeys',
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

    Entry.belongsTo(Medium, {
        as: 'Medium',
        foreignKey: 'media_id',
        onDelete: 'NO ACTION',
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
};
