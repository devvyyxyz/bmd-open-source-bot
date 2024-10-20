module.exports = {
  category: "Reactions",
  data: { name: "Add Reaction" },
  UI: [
    {
      element: "message",
      storeAs: "message",
      name: "Message"
    },
    "-",
    {
      element: "inputGroup",
      nameSchemes: ["Emoji Name", "Emoji ID"],
      storeAs: ["emojiName", "emojiID"],
      placeholder: ["Can Also Be An Emoji", "Optional"]
    }
  ],


  compatibility: ["Any"],

  subtitle: (data, constants) => {
    let message = 'Command Message'
    if (data.message.type != 'commandMessage') {
      message = constants.variable(data.message)
    }
    return `Add To: ${message} - Emoji: ${data.emojiName}`
  },

  async run(values, msg, client, bridge) {
    let message = await bridge.getMessage(values.message);

    let emojiID = ':' + bridge.transf(values.emojiID).trim();
    let emojiName = bridge.transf(values.emojiName).trim();
    
    if (emojiID == ':') {
      emojiID = ''
    }
    
    await message.createReaction(`${emojiName}${emojiID}`);
  },
};
