module.exports = {
  category: "Emoji",
  data: { name: "Get Emoji Info" },
  UI: [
    {
      element: "variable",
      name: "Emoji",
      storeAs: "emoji"
    },
    "-",
    {
      element: "typedDropdown",
      name: "Get",
      storeAs: "get",
      choices: {
        name: { name: "Name" },
        id: { name: "ID" },
        animated: { name: "Is Animated?" },
        available: { name: "Is Available?" },
        requireColons: { name: "Requires Colons?" },
        imageURL: { name: "Image URL" },
        user: { name: "Author" }
      }
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: (values, constants, thisAction) => {
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.variable(values.emoji)} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, message, client, bridge) {
    let emoji = bridge.get(values.emoji);

    let output;
    let specificOutputs = ["imageURL"];

    if (specificOutputs.includes(values.get.type)) {
      switch (values.get) {
        case 'imageURL':
          output = `https://cdn.discordapp.com/emojis/${emoji.id}.png?size=512&quality=lossless`
          break
      }
    } else {
      output = emoji[values.get.type];
    }

    bridge.store(values.store, output)
  },
};
