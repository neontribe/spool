module.exports = function(sequelize, DataTypes) {
    return sequelize.define('RegionService', {
        regionId: {
            type: DataTypes.INTEGER,
            field: 'region_id',
            allowNull: true,
            references: {
                model: 'region',
                key: 'region_id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'CASCADE'
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
        tableName: 'region_service',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var RegionService = model.RegionService;
    var Region = model.Region;
    var Service = model.Service;

    RegionService.belongsTo(Region, {
        as: 'Region',
        foreignKey: 'region_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    RegionService.belongsTo(Service, {
        as: 'Service',
        foreignKey: 'service_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

};
