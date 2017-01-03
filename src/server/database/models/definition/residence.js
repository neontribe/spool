module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Residence', {
        residenceId: {
            type: DataTypes.INTEGER,
            field: 'residence_id',
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
        tableName: 'residence',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var Residence = model.Residence;
    var Profile = model.Profile;

    Residence.hasMany(Profile, {
        as: 'ProfileResidenceIdFkeys',
        foreignKey: 'residence_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });
};
