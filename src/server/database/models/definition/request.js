'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Request', {
        requestId: {
            type: DataTypes.INTEGER,
            field: 'request_id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            field: 'user_id',
            allowNull: true,
            references: {
                model: 'user_account',
                key: 'user_id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION'
        },
        regionId: {
            type: DataTypes.INTEGER,
            field: 'region_id',
            allowNull: true,
            references: {
                model: 'region',
                key: 'region_id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION'
        },
        reason: {
            type: DataTypes.STRING(255),
            field: 'reason',
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(255),
            field: 'name',
            allowNull: true
        },
        org: {
            type: DataTypes.STRING(255),
            field: 'org',
            allowNull: true
        },
        avatar: {
            type: DataTypes.STRING(255),
            field: 'avatar',
            allowNull: true
        },
        from: {
            type: DataTypes.DATE,
            field: 'from',
            allowNull: true
        },
        to: {
            type: DataTypes.DATE,
            field: 'to',
            allowNull: true
        }
    }, {
        schema: 'public',
        tableName: 'request',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var Request = model.Request;
    var RequestTopic = model.RequestTopic;
    var UserRequest = model.UserRequest;
    var Region = model.Region;
    var UserAccount = model.UserAccount;
    var Topic = model.Topic;

    Request.hasMany(RequestTopic, {
        as: 'TopicRequestIdFkeys',
        foreignKey: 'request_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    Request.hasMany(UserRequest, {
        as: 'UserRequestRequestIdFkeys',
        foreignKey: 'request_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    Request.belongsTo(Region, {
        as: 'Region',
        foreignKey: 'region_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Request.belongsTo(UserAccount, {
        as: 'User',
        foreignKey: 'user_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Request.belongsToMany(Topic, {
        as: 'RequestTopicTopics',
        through: RequestTopic,
        foreignKey: 'request_id',
        otherKey: 'topic_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    Request.belongsToMany(UserAccount, {
        as: 'UserRequestUsers',
        through: UserRequest,
        foreignKey: 'request_id',
        otherKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

};
