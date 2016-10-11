module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Role', {
        roleId: {
            type: DataTypes.INTEGER,
            field: 'role_id',
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
        },
        secret: {
            type: DataTypes.STRING(255),
            field: 'secret',
            allowNull: true
        },
        hidden: {
            type: DataTypes.BOOLEAN,
            field: 'hidden',
            allowNull: true
        }
    }, {
        schema: 'public',
        tableName: 'role',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var Role = model.Role;
    var UserAccount = model.UserAccount;
    var Region = model.Region;

    Role.hasMany(UserAccount, {
        as: 'UserAccountRoleIdFkeys',
        foreignKey: 'role_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Role.belongsToMany(Region, {
        as: 'UserAccountRegions',
        through: UserAccount,
        foreignKey: 'role_id',
        otherKey: 'region_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

};
