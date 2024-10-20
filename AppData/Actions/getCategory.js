module.exports = {
  data: {
    name: "Get Category",
  },
  category: "Channels",
  UI: [
    {
      element: "input",
      storeAs: "id",
      name: "Category ID"
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store"
    }
  ],

  subtitle: (values, constants) => {
    return `Category ID: ${values.id} - Store As ${constants.variable(values.store)}`
  },

  async run(values, interaction, client, bridge) {
    bridge.store(values.store, await client.rest.channels.get(bridge.transf(values.id)))
  },
};
