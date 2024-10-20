module.exports = {
  category: "Members",
  data: { name: "Get Member" },
  UI: [
    {
      element: "input",
      storeAs: "id",
      name: "Member ID"
    },
    "-",
    {
      element: "storage",
      storeAs: "store"
    }
  ],

  compatibility: ["Any"],
  subtitle: "ID: $[id]$",

  async run(values, message, client, bridge) {
    let user = await client.rest.users.get(bridge.transf(values.id))

    bridge.store(values.store, user)
  },
};
