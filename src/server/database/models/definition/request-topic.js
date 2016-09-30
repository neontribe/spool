module.exports = function(sequelize, DataTypes) {
    return sequelize.define('RequestTopic', {
        requestId: {
            type: DataTypes.INTEGER,
            field: 'request_id',
            allowNull: true,
            references: {
                model: 'request',
                key: 'request_id'
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
        tableName: 'request_topic',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var RequestTopic = model.RequestTopic;
    var Request = model.Request;
    var Topic = model.Topic;

    RequestTopic.belongsTo(Request, {
        as: 'Request',
        foreignKey: 'request_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    RequestTopic.belongsTo(Topic, {
        as: 'Topic',
        foreignKey: 'topic_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

};
