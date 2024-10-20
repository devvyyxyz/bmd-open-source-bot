module.exports = {
  data: {
    name: "Get Guild"
  },
  category: "Guilds",
  UI: [
    {
      element: "input",
      storeAs: "id",
      name: "Guild ID"
    },
    {
      element: "storage",
      storeAs: "store"
    }
  ],

  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `Guild ID: ${values.id} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, interaction, client, bridge) {
    let guild = await client.rest.guilds.get(bridge.transf(values.id))
    bridge.store(values.store, guild)
  },
};
