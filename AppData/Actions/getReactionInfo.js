module.exports = {
  category: "Reactions",
  data: {
    name: "Get Reaction Info"
  },
  UI: [
    {
      element: "var",
      name: "Reaction",
      storeAs: "reaction"
    },
    "-",
    {
      element: "halfDropdown",
      storeAs: "get",
      name: "Get",
      choices: [
        {
          name: "Author"
        },
        {
          name: "Emoji"
        },
        {
          name: "Emoji ID"
        },
        {
          name: "Message"
        }
      ]
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  compatibility: ["Any"],

  subtitle: (values, constants) => {
    return `${values.get} of ${constants.variable(values.reaction)} - Store As: ${constants.variable(values.store)}`
  },
  run(values, message, client, bridge) {
    let reaction = bridge.get(values.reaction)

    let output;
    switch (values.get) {
      case "Author":
        output = reaction.author
        break
      case "Emoji":
        output = reaction.emoji
        break
      case "Emoji ID":
        output = reaction.emojiID;
        break
      case "Message":
        output = reaction.message
        break
    }

    bridge.store(values.store, output)
  },
};
