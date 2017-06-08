const inquirer = require('inquirer');
const { fromGlobalId } = require('graphql-relay');
const Queue = require('promise-queue');
const winston = require('winston');
const args = require('minimist')(process.argv.slice(2));
const Table = require('cli-table');

const { models, helpers } = require('../src/server/database');
winston.level = 'warn';

class Prompt {
  constructor (queue) {
    this.prompt = inquirer.createPromptModule();
    this.queue = queue;
  }

  get questions () {
    return []
  }

  next (prompt) {
    return () => { prompt.start() }
  }

  processAnswers (answers) {
    return this.next(new Prompt(this.queue));
  }

  start () {
    return new Promise((resolve, reject) => {
      const questions = this.questions;
      if (!questions.length) {
        return reject(new Error('Invalid question format: '+questions));
      }

      this.prompt(this.questions, (answers) => {
        const nextFn = this.processAnswers(answers)
        if (nextFn) {
          this.queue.add(nextFn);
        }
        resolve();
      });
    });
  }
}

class MainPrompt extends Prompt {
  get questions () {
    return [
      {
        type: 'list',
        name: 'task',
        message: 'What do you want to do?',
        choices: [
          {
            name: 'View Regions and Services',
            value: 'view/regionservices',
          },
          {
            name: 'Change User',
            value: 'change/user',
          }
        ]
      }
    ]
  }

  processAnswers (answers) {
    console.dir(answers);
    /*  switch (answers.task) {
      case 'view/regionservices':
        return 
        break;
      case 'change/user': */
    /*        break;
    }
    console.dir(answers); */
      return this.next(new UserConfigurationPrompt(this.queue));
  }
}

class UserConfigurationPrompt extends Prompt {
  get questions () {
    return [
      {
        type: 'input',
        name: 'user',
        message: 'Please enter a UserId (global identifier format)',
        validate: (userId) => {
          const { id } = fromGlobalId(userId);
          if (!isNaN(id) && parseInt(id, 10) > 0) {
            return true;
          }
          return 'UserId must be a Relay compatible global identifier string, for example: "VXNlcjox"';
        },
        filter: (userId) => {
          debugger;
          const { id } = fromGlobalId(userId);
          return models.UserAccount.findOne({
            where: {
              userId: id
            },
            include: helpers.includes.UserAccount.leftProfile
          }).then((user) => {
            debugger;
            console.log("\n"+this.makeUserTable(user)+"\n");
            return user;
          }).catch((e) => winston.warn(e));
        }
      },
    ];
  }

  makeUserTable(user) {
      const userTable = new Table({
        head: ['Data', 'Values'],
        colWidths: [20, 80]
      });

      if (user.Profile) {
        userTable.push(['Name', user.Profile.name]);
        userTable.push(['Nickname', user.Profile.altName]);
      }

      userTable.push(['Database Id', user.userId]);
      userTable.push(['Creation Date', user.createdAt]);
      userTable.push(['Role', user.Role.name]);

      if (user.Region) {
        userTable.push(['Region', user.Region.type]);
      }

      if (user.Profile) {
        userTable.push(['Services', user.Profile.ProfileServiceServices.map(({name}) => name).join(', ')]);
        userTable.push(['Supporter', user.Profile.supporter]);
        userTable.push(['Seen Introduction', user.Profile.introduced]);
        userTable.push(['Sharing Data', user.Profile.sharing]);
        userTable.push(['Residence', user.Profile.Residence.name]);
      }

      return userTable.toString();
  }

  processAnswers (answers) {
    //  console.dir(answers);
    return this.next(new MainPrompt(this.queue));
  }
}

const queue = new Queue(1, Infinity);
const spoolTool = new MainPrompt(queue);
queue.add(() => spoolTool.start());

    /*

if (args.help) {
    const helpTable = new Table({
        head: ['Argument', 'Example'],
        colWidths: [20, 80]
    });

    helpTable.push(['--role', '--role="creator", --role="consumer"']);
    helpTable.push(['--id', '--id="vDfi0y"']);
    helpTable.push(['--region', '--region="South Shields"']);
    helpTable.push(['--services', '--services="service_a,service_b"']);
    console.log(helpTable.toString());
    return process.exit(0);
}

const roleName = args.role;
const userId = args.id;
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
}); */
