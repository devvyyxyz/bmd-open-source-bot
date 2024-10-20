module.exports = {
  data: {
    name: "Change Server",
  },
  category: "Servers",
  UI: [
    {
      element: "var",
      storeAs: "guild",
      also: {
        command: "Command Server",
        id: "ID"
      },
      and: {
        command: false
      },
      name: "Server"
    }
  ],

  compatibility: ["Any"],

  subtitle: (values, constants) => {
    if (values.guild.type == 'command') {
      return `To Command Server`
    } else if (values.guild.type == 'id') {
      return `To Server ID (${values.guild.value})`
    } else {
      return `To ${constants.variable(values.guild)}`
    }
  },
  async run(values, message, client, bridge) {
    let guild;
    if (values.guild.type == 'command') {
      guild = message.guild;
    } else if (values.guild.type == 'id') {
      guild = client.guilds.get(bridge.transf(values.guild.value))
    } else {
      guild = await bridge.get(values.guild)
    }

    bridge.guild = guild;
  },
};
