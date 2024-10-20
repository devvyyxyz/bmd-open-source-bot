module.exports = {
  category: "Messages",
  data: {
    name: "Delete Message",
  },
  UI: [
    {
      element: "message",
      storeAs: "message",
      name: "Message",
    }
  ],

  compatibility: ["Slash"],
  subtitle: (values, constants) => {
    return `${constants.message(values.message)}`
  },

  async run(values, msg, client, bridge) {
    var message = await bridge.getMessage(values.message);

    if (message.interaction && message.interaction.deleteOriginal) {
      if (message.interaction.deffered) {
        await message.interaction.deleteFollowup(message.id)
      } else {
        await message.interaction.deleteOriginal(message.id)
      }
    } else {

      await message.delete()
    }

  },
};
