module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Topic', {
        topicId: {
            type: DataTypes.INTEGER,
            field: 'topic_id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING(255),
            field: 'type',
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(255),
            field: 'name',
            allowNull: true
        }
    }, {
        schema: 'public',
        tableName: 'topic',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var Topic = model.Topic;
    var EntryTopic = model.EntryTopic;
    var RequestTopic = model.RequestTopic;
    var Entry = model.Entry;
    var Request = model.Request;

    Topic.hasMany(EntryTopic, {
        as: 'EntryTopicTopicIdFkeys',
        foreignKey: 'topic_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Topic.hasMany(RequestTopic, {
        as: 'RequestTopicTopicIdFkeys',
        foreignKey: 'topic_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Topic.belongsToMany(Entry, {
        as: 'EntryTopicEntries',
        through: EntryTopic,
        foreignKey: 'topic_id',
        otherKey: 'entry_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Topic.belongsToMany(Request, {
        as: 'RequestTopicRequests',
        through: RequestTopic,
        foreignKey: 'topic_id',
        otherKey: 'request_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

};
