var model = {};
var initialized = false;

function init (sequelize) {
    delete module.exports.init; // Destroy itself to prevent repeated calls and clash with a model named 'init'.
    initialized = true;
    // Import model files and assign them to `model` object.
    model.Entry = sequelize.import('./definition/entry.js');
    model.EntryTopic = sequelize.import('./definition/entry-topic.js');
    model.Medium = sequelize.import('./definition/media.js');
    model.Region = sequelize.import('./definition/region.js');
    model.Service = sequelize.import('./definition/service.js');
    model.RegionService = sequelize.import('./definition/region-service.js');
    model.Role = sequelize.import('./definition/role.js');
    model.Sentiment = sequelize.import('./definition/sentiment.js');
    model.SequelizeDatum = sequelize.import('./definition/sequelize-data.js');
    model.SequelizeMetum = sequelize.import('./definition/sequelize-meta.js');
    model.Topic = sequelize.import('./definition/topic.js');
    model.UserAccount = sequelize.import('./definition/user-account.js');
    model.Profile = sequelize.import('./definition/profile.js');
    model.Residence = sequelize.import('./definition/residence.js');
    model.ProfileService = sequelize.import('./definition/profile-service.js');

    // All models are initialized. Now connect them with relations.
    require('./definition/entry.js').initRelations();
    require('./definition/entry-topic.js').initRelations();
    require('./definition/media.js').initRelations();
    require('./definition/region.js').initRelations();
    require('./definition/region-service.js').initRelations();
    require('./definition/service.js').initRelations();
    require('./definition/role.js').initRelations();
    require('./definition/sentiment.js').initRelations();
    require('./definition/sequelize-data.js').initRelations();
    require('./definition/sequelize-meta.js').initRelations();
    require('./definition/topic.js').initRelations();
    require('./definition/profile.js').initRelations();
    require('./definition/residence.js').initRelations();
    require('./definition/profile-service.js').initRelations();
    require('./definition/user-account.js').initRelations();
    return model;
}

// Note: While using this module, DO NOT FORGET FIRST CALL model.init(sequelize). Otherwise you get undefined.
module.exports = model;
module.exports.init = init;
module.exports.isInitialized = initialized;
