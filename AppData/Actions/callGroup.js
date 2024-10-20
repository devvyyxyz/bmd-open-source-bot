module.exports = {
  category: "Control",
  data: {
    name: "Call Group"
  },
  UI: [
    {
      element: "input",
      name: "Command / Event Custom ID",
      storeAs: "customID"
    },
    {
      element: "toggle",
      storeAs: "await",
      name: "Await Until Command Finishes Running?"
    }
  ],
  subtitle: (actionData) => {
    let data = require('../data.json');
    let commands = data.commands;
    let foundCommand;
    for (let cmd in commands) {
      let command = commands[cmd];
      if (command.customId == actionData.customID) {
        foundCommand = command
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
    let data = require('../data.json');

    let shared = values.shareVariables ? bridge.variables : {}

    let commands = data.commands;
    for (let cmd in commands) {
      let command = commands[cmd];
      if (command.customId == bridge.transf(values.customID)) {
        if (values.await == true) {
          await bridge.runner(cmd, message, client, shared)
        } else {
          bridge.runner(cmd, message, client, shared)
        }
      }
    }
  }
};
