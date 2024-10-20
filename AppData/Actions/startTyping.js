module.exports = {
  data: { name: "Start Typing" },
  category: "Channels",
  UI: [
    {
      element: "channelInput",
      name: "In Channel",
      storeAs: "channel"
    }
  ],

  subtitle: "-",
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let channel = await bridge.getChannel(values.channel)

    channel.sendTyping()
  },
};
