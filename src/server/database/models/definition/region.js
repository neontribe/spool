module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Region', {
        regionId: {
            type: DataTypes.INTEGER,
            field: 'region_id',
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
        tableName: 'region',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var Region = model.Region;
    var UserAccount = model.UserAccount;
    var Role = model.Role;

    Region.hasMany(UserAccount, {
        as: 'UserAccountRegionIdFkeys',
        foreignKey: 'region_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Region.belongsToMany(Role, {
        as: 'UserAccountRoles',
        through: UserAccount,
        foreignKey: 'region_id',
        otherKey: 'role_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

};
