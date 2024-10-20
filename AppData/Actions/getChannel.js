module.exports = {
  category: "Channels",
  data: {
    name: "Get Channel",
  },
  UI: [
    {
      element: "input",
      storeAs: "id",
      name: "Channel ID"
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store"
    }
  ],

  subtitle: (values, constants) => {
    return `Channel ID: ${values.id} - Store AS: ${constants.variable(values.store)}`
  },

  async run(values, interaction, client, bridge) {
    bridge.store(values.store, client.getChannel(bridge.transf(values.id)))
  },
};
