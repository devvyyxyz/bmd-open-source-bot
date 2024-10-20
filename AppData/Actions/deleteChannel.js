module.exports = {
  category: "Channels",
  data: {
    name: "Delete Channel",
  },
  UI: [
    {
      element: "channelInput",
      storeAs: "channel",
      excludeUsers: true
    }
  ],

  compatibility: ["Any"],

  subtitle: (data, constants) => {
    return `Delete: ${constants.channel(data.channel)}`
  },
  async run(values, message, client, bridge) {
    let channel = await bridge.getChannel(values.channel)

    channel.delete()
  },
};
