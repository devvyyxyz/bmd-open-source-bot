module.exports = {
  category: "Modularity",
  data: { name: "Create Modular Poll Option" },
  UI: [
    {
      element: "input",
      storeAs: "label",
      name: "Label",
    },
    "-",
    {
      element: "inputGroup",
      nameSchemes: ["Emoji Name <span style='opacity: 50%;'>Optional</span>", "Emoji ID <span style='opacity: 50%;'>Optional</span>"],
      storeAs: ["emojiName", "emojiID"],
      placeholder: ["Can Also Be An Emoji", ""]
    },
    {
      element: "toggle",
      name: "Make The Emoji Animated",
      storeAs: "isEmojiAnimated"
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: (data, constants) => {
    return `Store As: ${constants.variable(data.store)}`
  },

  run(values, message, client, bridge) {
    let option = { data: values };

    let endAnswer = {
      pollMedia: {
        text: bridge.transf(option.data.label)
      }
    }

    let emoji = {
      name: null,
      id: null
    }

    if (option.data.emojiName.trim() != '') {
      emoji.name = bridge.transf(option.data.emojiName)

      if (option.data.emojiID.trim() != '') {
        emoji.id = bridge.transf(option.data.emojiID)
      }

      emoji.animated = option.data.isEmojiAnimated
    } else {
      emoji = undefined;
    }

    endAnswer.pollMedia.emoji = emoji;

    bridge.store(values.store, endAnswer);
  },
};