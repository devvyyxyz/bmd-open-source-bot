module.exports = {
  data: { name: "Get User" },
  category: "Users",
  UI: [
    {
      element: "input",
      storeAs: "id",
      name: "User ID"
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
