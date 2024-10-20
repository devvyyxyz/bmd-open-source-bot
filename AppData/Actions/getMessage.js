module.exports = {
  category: "Messages",
  data: { name: "Get Message" },
  UI: [
    {
      element: "channel",
      storeAs: "channel",
      name: "Message Channel"
    },
    "_",
    {
      element: "input",
      name: "Message ID",
      storeAs: "messageID"
    },
    "-",
    {
      element: "storage",
      storeAs: "store"
    }
  ],

  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `ID: ${values.messageID} - Channel: ${constants.channel(values.channel)} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, _msg, client, bridge) {
    let channel = await bridge.getChannel(values.channel);
    let messageID = bridge.transf(values.messageID);

    try {
      let message = await channel.getMessage(messageID);
      bridge.store(values.store, message);
    } catch (error) {
      let message = undefined;
      bridge.store(values.store, message);
    }
  },
};
