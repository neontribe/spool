module.exports = function(sequelize, DataTypes) {
    return sequelize.define('EntryTopic', {
        entryId: {
            type: DataTypes.INTEGER,
            field: 'entry_id',
            allowNull: true,
            references: {
                model: 'entry',
                key: 'entry_id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'CASCADE'
        },
        topicId: {
            type: DataTypes.INTEGER,
            field: 'topic_id',
            allowNull: true,
            references: {
                model: 'topic',
                key: 'topic_id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION'
        }
    }, {
        schema: 'public',
        tableName: 'entry_topic',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var EntryTopic = model.EntryTopic;
    var Entry = model.Entry;
    var Topic = model.Topic;

    EntryTopic.belongsTo(Entry, {
        as: 'Entry',
        foreignKey: 'entry_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    EntryTopic.belongsTo(Topic, {
        as: 'Topic',
        foreignKey: 'topic_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

};
