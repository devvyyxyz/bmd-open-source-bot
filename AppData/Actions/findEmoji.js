module.exports = {
  category: "Emoji",
  data: { name: "Find Emoji" },
  UI: [
    {
      element: "dropdown",
      name: "Find Emoji By",
      storeAs: "method",
      extraField: "value",
      choices: [
        {
          name: "Name",
          field: true,
          placeholder: "Emoji Name"
        },
        {
          name: "ID",
          field: true,
          placeholder: "Emoji ID"
        }
      ]
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Emoji As"
    }
  ],
  subtitle: (data, constants) => {
    return `Find By ${data.method} (${data.value || "Blank"}) - Store As ${constants.variable(data.store)}`
  },
  async run(values, message, client, bridge) {
    let emojis = await bridge.guild.getEmojis();

    let matchValue;
    let toMatch = bridge.transf(values.value)

    if (values.method == 'Emoji Name') {
      matchValue = 'name'
    } else {
      matchValue = 'id'
    }

    bridge.store(values.store, emojis.filter(emoji => emoji[matchValue] == toMatch)[0])
  },
};
