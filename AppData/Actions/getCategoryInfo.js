module.exports = {
  data: {
    name: "Get Category Info",
  },
  category: "Channels",
  UI: [
    {
      element: "var",
      storeAs: "category",
      name: "Category"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "get",
      name: "Get",
      choices: {
        name: { name: "Name" },
        id: { name: "ID" },
        guild: { name: "Server" },
        channels: { name: "Channels" },
        position: { name: "Position" },
      },
    },
    "-",
    {
      element: "storage",
      storeAs: "store"
    }
  ],
  compatibility: ["Any"],

  subtitle: (values, constants, thisAction) => {
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.channel(values.attachment)} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, message, client, bridge) {
    let category = await bridge.get(values.category);

    let output;
    switch (values.get.type) {
      case "channels":
        let ids = category.channels.map((c) => c.id);
        output = [];

        for (let i in ids) {
          output = await bridge.getChannel({ type: "id", value: ids[i] });
        }
        break;
      default:
        output = category[values.get.type];
        break;
    }

    bridge.store(values.store, output)
  },
};
