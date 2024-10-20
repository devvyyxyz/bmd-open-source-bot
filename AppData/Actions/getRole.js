module.exports = {
  category: "Roles",
  data: { name: "Get Role" },
  UI: [
    {
      element: "input",
      name: "Role ID",
      storeAs: "id"
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: "ID: $[id]$",
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let role = await bridge.guild.roles.get(bridge.transf(values.id))
    bridge.store(values.store, role)
  },
};
