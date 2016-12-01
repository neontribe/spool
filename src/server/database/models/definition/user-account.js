module.exports = function(sequelize, DataTypes) {
    return sequelize.define('UserAccount', {
        userId: {
            type: DataTypes.INTEGER,
            field: 'user_id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        authHash: {
            type: DataTypes.STRING(255),
            field: 'auth_hash',
            allowNull: true
        },
        seenIntroduction: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'seen_introduction',
            allowNull: false,
        },
        seenSharing: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'seen_sharing',
            allowNull: false,
        },
        sharing: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'sharing',
            allowNull: false,
        },
        roleId: {
            type: DataTypes.INTEGER,
            field: 'role_id',
            allowNull: true,
            references: {
                model: 'role',
                key: 'role_id'
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
        tableName: 'user_account',
        timestamps: true
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var UserAccount = model.UserAccount;
    var Entry = model.Entry;
    var Region = model.Region;
    var Role = model.Role;
    var Medium = model.Medium;
    var Sentiment = model.Sentiment;

    UserAccount.hasMany(Entry, {
        as: 'EntryAuthorIdFkeys',
        foreignKey: 'author_id',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION'
    });

    UserAccount.hasMany(Entry, {
        as: 'EntryOwnerIdFkeys',
        foreignKey: 'owner_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    UserAccount.belongsTo(Region, {
        as: 'Region',
        foreignKey: 'region_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    UserAccount.belongsTo(Role, {
        as: 'Role',
        foreignKey: 'role_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    UserAccount.belongsToMany(Medium, {
        as: 'EntryMedia',
        through: Entry,
        foreignKey: 'author_id',
        otherKey: 'media_id',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION'
    });

    UserAccount.belongsToMany(UserAccount, {
        as: 'EntryOwners',
        through: Entry,
        foreignKey: 'author_id',
        otherKey: 'owner_id',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION'
    });

    UserAccount.belongsToMany(Sentiment, {
        as: 'EntrySentiments',
        through: Entry,
        foreignKey: 'author_id',
        otherKey: 'sentiment_id',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION'
    });

    UserAccount.belongsToMany(UserAccount, {
        as: 'EntryAuthors',
        through: Entry,
        foreignKey: 'owner_id',
        otherKey: 'author_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    UserAccount.belongsToMany(Medium, {
        as: 'EntryMedia',
        through: Entry,
        foreignKey: 'owner_id',
        otherKey: 'media_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

    UserAccount.belongsToMany(Sentiment, {
        as: 'EntrySentiments',
        through: Entry,
        foreignKey: 'owner_id',
        otherKey: 'sentiment_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });
};
