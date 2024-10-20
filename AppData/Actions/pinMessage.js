module.exports = {
  data: {
    name: "Pin Message"
  },
  category: "Messages",
  UI: [
    {
      element: "message",
      storeAs: "message",
      name: "Message"
    }   
  ],

  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `Message: ${constants.message(values.message)}`
  },

  async run(values, msg, client, bridge) {
    let message = await bridge.getMessage(values.message)

    await message.pin()
  },
};
