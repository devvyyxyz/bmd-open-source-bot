module.exports = {
  category: "Reactions",
  data: { name: "Remove Reaction", user: {type: "me", value: ''} },
  UI: [
    {
      element: "var",
      also: {
        commandMessage: "Command Message"
      },
      and: {
        commandMessage: false
      },
      storeAs: "message",
      name: "Message"
    },
    "-",
    {
      element: "inputGroup",
      nameSchemes: ["Emoji Name", "Emoji ID"],
      storeAs: ["emojiName", "emojiID"],
      placeholder: ["Can Also Be An Emoji", "Optional"]
    },
    "-",
    {
      element: "user",
      name: "Remove Reaction Of User",
      storeAs: "user",
      also: {
        me: "Bot"
      },
      and: {
        me: false
      }
    }
  ],


  compatibility: ["Any"],

  subtitle: "Emoji: $[emojiName]$",

  async run(values, msg, client, bridge) {
    let message;
    if (values.message.type == 'commandMessage') {
      message = msg;
    } else {
      message = bridge.get(values.message)
    }

    let emojiID = ':' + bridge.transf(values.emojiID).trim();
    let emojiName = bridge.transf(values.emojiName).trim();
    if (emojiID == ':') {
      emojiID = ''
    }
    
    let user;
    if (values.user.type == 'me') {
      user = `@me`
    } else {
      user = await bridge.getUser(values.user)
      user = await user
      user = user.id
    }
    
    await message.deleteReaction(`${emojiName}${emojiID}`, user);
  },
};
