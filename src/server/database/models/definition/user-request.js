'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('UserRequest', {
        userRequestId: {
            type: DataTypes.INTEGER,
            field: 'user_request_id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
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
        userId: {
            type: DataTypes.INTEGER,
            field: 'user_id',
            allowNull: true,
            references: {
                model: 'user_account',
                key: 'user_id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'CASCADE'
        },
        seen: {
            type: DataTypes.BOOLEAN,
            field: 'seen',
            allowNull: true,
            defaultValue: false
        }
    }, {
        schema: 'public',
        tableName: 'user_request',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var UserRequest = model.UserRequest;
    var EntryUserRequest = model.EntryUserRequest;
    var Request = model.Request;
    var UserAccount = model.UserAccount;
    var Entry = model.Entry;

    UserRequest.hasMany(EntryUserRequest, {
        as: 'EntryUserRequestUserRequestIdFkeys',
        foreignKey: 'user_request_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    UserRequest.belongsTo(Request, {
        as: 'Request',
        foreignKey: 'request_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    UserRequest.belongsTo(UserAccount, {
        as: 'User',
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    UserRequest.belongsToMany(Entry, {
        as: 'EntryUserRequestEntries',
        through: EntryUserRequest,
        foreignKey: 'user_request_id',
        otherKey: 'entry_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

};
