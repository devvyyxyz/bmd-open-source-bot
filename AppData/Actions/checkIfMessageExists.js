module.exports = {
  data: {
    name: "Check If Message Exists",
  },
  category: "Messages",
  UI: [
    {
      element: "message",
      storeAs: "message"
    },
    "-",
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If Found"
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If Not Found"
    }
  ],
  subtitle: "",
  compatibility: ["Any"],
  async run(values, _message, client, bridge) {
    let message = await bridge.getMessage(values.message);
   
    let found = false;
    try {
      let foundMessage = await message.channel.getMessage(message.id);
      if (foundMessage.channel) {
        found = true;
      }
    } catch (e) {}

    if (found == true) {
      await bridge.call(values.true, values.trueActions)
    } else {
      await bridge.call(values.false, values.falseActions)
    }
  },
};
