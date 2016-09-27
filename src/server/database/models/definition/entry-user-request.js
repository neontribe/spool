'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('EntryUserRequest', {
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
        userRequestId: {
            type: DataTypes.INTEGER,
            field: 'user_request_id',
            allowNull: true,
            references: {
                model: 'user_request',
                key: 'user_request_id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'CASCADE'
        },
        access: {
            type: DataTypes.BOOLEAN,
            field: 'access',
            allowNull: false,
            defaultValue: false
        }
    }, {
        schema: 'public',
        tableName: 'entry_user_request',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var EntryUserRequest = model.EntryUserRequest;
    var Entry = model.Entry;
    var UserRequest = model.UserRequest;

    EntryUserRequest.belongsTo(Entry, {
        as: 'Entry',
        foreignKey: 'entry_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    EntryUserRequest.belongsTo(UserRequest, {
        as: 'UserRequest',
        foreignKey: 'user_request_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

};
