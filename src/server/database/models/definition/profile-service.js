module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ProfileService', {
        profileId: {
            type: DataTypes.INTEGER,
            field: 'profile_id',
            allowNull: true,
            references: {
                model: 'profile',
                key: 'profile_id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION'
        },
        serviceId: {
            type: DataTypes.INTEGER,
            field: 'service_id',
            allowNull: true,
            references: {
                model: 'service',
                key: 'service_id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION'
        }
    }, {
        schema: 'public',
        tableName: 'profile_service',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');

    var ProfileService = model.ProfileService;
    var Profile = model.Profile;
    var Service = model.Service;

    ProfileService.belongsTo(Profile, {
        as: 'Profile',
        foreignKey: 'profile_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    ProfileService.belongsTo(Service, {
        as: 'Service',
        foreignKey: 'service_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });
};
