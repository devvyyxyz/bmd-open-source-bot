let data = require('../data.json');
let commands = data.commands;

module.exports = {
  category: "Control",
  data: {
    name: "Run Command Or Event"
  },
  UI: [
    {
      element: "typedDropdown",
      storeAs: "command",
      name: "Group",
      choices: (() => {
        let result = {};

        commands.forEach(command => {
          result[command.customId] = {name: command.name || "<i>[No Name]</i>", field: false};
        });
        return result;
      })()
    },
    "-",
    {
      element: "toggle",
      storeAs: "await",
      name: "Await Until Command Finishes Running?"
    }
  ],
  subtitle: (actionData) => {
  let foundCommand;
    for (let cmd in commands) {
      let command = commands[cmd];
      if (command.customId == actionData.command.type) {
        foundCommand = command;
      }
    }

    if (!foundCommand) {
      return `Run: Group Not Found!`
    } else {
      return `Group Name: ${foundCommand.name} - ID: ${foundCommand.customId}`
    }
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let commands = data.commands;
    for (let cmd in commands) {
      let command = commands[cmd];
      if (command.customId == bridge.transf(values.command.type)) {
        if (values.await == true) {
          await bridge.runner(cmd);
        } else {
          bridge.runner(cmd);
        }
      }
    }
  }
};
