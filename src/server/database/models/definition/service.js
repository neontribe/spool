module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Service', {
        serviceId: {
            type: DataTypes.INTEGER,
            field: 'service_id',
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
        tableName: 'service',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var Service = model.Service;
    var RegionService = model.RegionService;
    var Region = model.Region;
    var ProfileService = model.ProfileService;
    var Profile = model.Profile;

    Service.hasMany(RegionService, {
        as: 'RegionServiceServiceIdFkeys',
        foreignKey: 'service_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Service.belongsToMany(Region, {
        as: 'RegionServiceEntries',
        through: RegionService,
        foreignKey: 'service_id',
        otherKey: 'region_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Service.hasMany(ProfileService, {
        as: 'ProfileServiceServiceIdFkeys',
        foreignKey: 'service_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Service.belongsToMany(Profile, {
        as: 'ProfileServiceEntries',
        through: ProfileService,
        foreignKey: 'service_id',
        otherKey: 'profile_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });
};
