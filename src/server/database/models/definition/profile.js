module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Profile', {
        profileId: {
            type: DataTypes.INTEGER,
            field: 'profile_id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        age: {
            type: DataTypes.INTEGER,
            field: 'age',
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(255),
            field: 'name',
            allowNull: true
        },
        altName: {
            type: DataTypes.STRING(255),
            field: 'alt_name',
            allowNull: true
        },
        residenceId: {
            type: DataTypes.INTEGER,
            field: 'residence_id',
            allowNull: true,
            references: {
                model: 'residence',
                key: 'residence_id'
            },
            onUpdate: 'NO ACTION',
            onDelete: 'NO ACTION'
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at',
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at',
            allowNull: true
        }
    }, {
        schema: 'public',
        tableName: 'profile',
        timestamps: true
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var Profile = model.Profile;
    var ProfileService = model.ProfileService;
    var UserAccount = model.UserAccount;
    var Residence = model.Residence;
    var Service = model.Service;

    Profile.hasMany(ProfileService, {
        as: 'ServiceProfileIdFkeys',
        foreignKey: 'profile_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    Profile.belongsToMany(Service, {
        as: 'ProfileServiceServices',
        through: ProfileService,
        foreignKey: 'profile_id',
        otherKey: 'service_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

   Profile.hasMany(UserAccount, {
        as: 'UserAccountProfileIdFkeys',
        foreignKey: 'profile_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Profile.belongsTo(Residence, {
        as: 'Residence',
        foreignKey: 'residence_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });
};
