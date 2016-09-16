'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Medium', {
        mediaId: {
            type: DataTypes.INTEGER,
            field: 'media_id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
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
        text: {
            type: DataTypes.STRING(255),
            field: 'text',
            allowNull: true
        },
        video: {
            type: DataTypes.STRING(255),
            field: 'video',
            allowNull: true
        },
        videoThumbnail: {
            type: DataTypes.STRING(255),
            field: 'video_thumbnail',
            allowNull: true
        },
        image: {
            type: DataTypes.STRING(255),
            field: 'image',
            allowNull: true
        },
        imageThumbnail: {
            type: DataTypes.STRING(255),
            field: 'image_thumbnail',
            allowNull: true
        }
    }, {
        schema: 'public',
        tableName: 'media',
        timestamps: false
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var Medium = model.Medium;
    var Entry = model.Entry;

    Medium.belongsTo(Entry, {
        as: 'Entry',
        foreignKey: 'entry_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });

};
