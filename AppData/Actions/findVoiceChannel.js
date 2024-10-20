module.exports = {
  category: "Channels",
  data: {
    name: "Find Voice Channel",
  },
  UI: [
    {
      element: "dropdown",
      storeAs: "method",
      extraField: "value",
      name: "Find By",
      choices: [
        {
          name: "ID",
          field: true
        },
        {
          name: "Name",
          field: true
        },
        {
          name: "Position",
          field: true
        }
      ]
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store"
    }
  ],

  async run(values, interaction, client, bridge) {
    let channels = await bridge.guild.getChannels();

    let toMatch = bridge.transf(values.value);
    bridge.store(values.store, channels.filter(channel => channel[values.method.toLowerCase()] == toMatch && channel.type == require('oceanic.js').ChannelTypes.GUILD_VOICE))
  },
};
