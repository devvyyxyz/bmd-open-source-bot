module.exports = {
  data: {
    name: "Leave Server",
  },
  category: "Servers",
  UI: [
    {
      element: "guild",
      storeAs: "guild",
    }
  ],
  subtitle: (values, constants) => {
    return `${constants.guild(values.guild)}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    if (!values.guild) {
      await bridge.guild.leave()
    } else {
      let guild = await bridge.getGuild(values.guild);
      await guild.leave();
    }
  },
};
