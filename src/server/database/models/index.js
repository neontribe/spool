var model = {};
var initialized = false;

function init(sequelize) {
    delete module.exports.init; // Destroy itself to prevent repeated calls and clash with a model named 'init'.
    initialized = true;
    // Import model files and assign them to `model` object.
    model.Entry = sequelize.import('./definition/entry.js');
    model.EntryTopic = sequelize.import('./definition/entry-topic.js');
    model.EntryUserRequest = sequelize.import('./definition/entry-user-request.js');
    model.Medium = sequelize.import('./definition/media.js');
    model.Region = sequelize.import('./definition/region.js');
    model.Request = sequelize.import('./definition/request.js');
    model.RequestTopic = sequelize.import('./definition/request-topic.js');
    model.Role = sequelize.import('./definition/role.js');
    model.Sentiment = sequelize.import('./definition/sentiment.js');
    model.SequelizeDatum = sequelize.import('./definition/sequelize-data.js');
    model.SequelizeMetum = sequelize.import('./definition/sequelize-meta.js');
    model.Topic = sequelize.import('./definition/topic.js');
    model.UserAccount = sequelize.import('./definition/user-account.js');
    model.UserRequest = sequelize.import('./definition/user-request.js');

    // All models are initialized. Now connect them with relations.
    require('./definition/entry.js').initRelations();
    require('./definition/entry-topic.js').initRelations();
    require('./definition/entry-user-request.js').initRelations();
    require('./definition/media.js').initRelations();
    require('./definition/region.js').initRelations();
    require('./definition/request.js').initRelations();
    require('./definition/request-topic.js').initRelations();
    require('./definition/role.js').initRelations();
    require('./definition/sentiment.js').initRelations();
    require('./definition/sequelize-data.js').initRelations();
    require('./definition/sequelize-meta.js').initRelations();
    require('./definition/topic.js').initRelations();
    require('./definition/user-account.js').initRelations();
    require('./definition/user-request.js').initRelations();
    return model;
}

// Note: While using this module, DO NOT FORGET FIRST CALL model.init(sequelize). Otherwise you get undefined.
module.exports = model;
module.exports.init = init;
module.exports.isInitialized = initialized;
