
const roleName = process.argv[2];
const userId = process.argv[3];
if (!roleName) {
    return console.error("No role name provided. 'creator' or 'consumer'");
}

if (!userId) {
    return console.error("No user identifier determined");
}
console.info("Update role: ", roleName, "User identifier (base64 tuple): ", userId);

const {models} = require('../src/server/database');

models.Role.findOne({
    where: {
        type: roleName.toLowerCase()
    }
}).then(function(role) {
    if(!role) {
        console.error("No matching role found", roleName);
        return process.exit(1);
    }
    const relayql = require('graphql-relay');
    var {type, id} = relayql.fromGlobalId(userId);

    models.UserAccount.update({ roleId: role.roleId }, {
        where: {
            userId: id
        },
        returning: true
    }).then(function(user) {
        console.log("User Updated: ", JSON.stringify(user));
        return process.exit(0);
    });
});
