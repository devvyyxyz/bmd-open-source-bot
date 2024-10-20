module.exports = {
  category: "Channels",
  data: {
    name: "Clone Channel",
  },
  UI: [
    {
      element: "channel",
      excludeUsers: true,
      storeAs: "channel"
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Duplicated Channel As"
    }
  ],

  subtitle: (data, constants) => {
    return `${constants.channel(data.channel)}`
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let channel = await bridge.getChannel(values.channel);
    
    channel.permissionOverwrites = channel.permissionOverwrites.map((overwrite) => {return {allow: overwrite.allow, deny: overwrite.deny, id: overwrite.id, type: overwrite.type}})

    let newChannel = await bridge.guild.createChannel(channel.type, channel)

    bridge.store(values.store, newChannel)
  },
};
