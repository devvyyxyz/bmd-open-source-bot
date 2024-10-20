module.exports = {
  data: {
    name: "Get Forum Tag Info",
  },
  category: "Channels",
  UI: [
    {
      element: "variable",
      storeAs: "tag"
    },
    "-",
    {
      element: "halfDropdown",
      storeAs: "get",
      name: "Get",
      choices: [
        {
          name: "Name"
        },
        {
          name: "ID"
        },
        {
          name: "Emoji"
        },
        {
          name: "Appliable Just By Moderators?"
        }
      ]
    },
    "-",
    {
      element: "storage",
      storeAs: "store"
    }
  ],
  compatibility: ["Any"],

  subtitle: (values, constants) => {
    return `${values.get} of ${constants.variable(values.tag)} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, message, client, bridge) {
    let tag = await bridge.get(values.tag)

    let output;
    switch (values.get) {
      case "Name":
        output = tag.name;
        break;
      case "ID":
        output = tag.id;
        break;
      case "Emoji":
        output = tag.emoji;
        break;
      case "Appliable Just By Moderators?":
        output = tag.moderated;
        break;
    }

    bridge.store(values.store, output)
  },
};
