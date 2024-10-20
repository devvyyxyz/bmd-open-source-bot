module.exports = {
  category: "Roles",
  data: { name: "Get Everyone Role" },
  UI: [
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: (values, constants) => {
    return `Store As: ${constants.variable(values.store)}`
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let roles = await bridge.guild.getRoles();
    bridge.store(values.store, roles.find(r => r.name == "@everyone" && r.position == 0))
  },
};
