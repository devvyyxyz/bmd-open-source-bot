module.exports = {
  category: "Roles",
  data: { name: "Find Role" },
  UI: [
    {
      element: "dropdown",
      name: "Find Role By",
      storeAs: "method",
      extraField: "value",
      choices: [
        {
          name: "Role Name",
          field: true,
        },
        {
          name: "Role ID",
          field: true,
        },
        {
          name: "Role Position",
          field: true
        }
      ]
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Role As"
    }
  ],
  subtitle: (data, constants) => {
    return `Find By ${data.method} (${data.value || "Blank"}) - Store As ${constants.variable(data.store)}`
  },
  async run(values, message, client, bridge) {
    let roles = await bridge.guild.getRoles();

    let toMatch = bridge.transf(values.value)

    let translations = {
      'Role Name': 'name',
      'Role ID': 'id',
      'Role Position': 'position'
    }

    bridge.store(values.store, roles.find(role => role[translations[values.method]] == toMatch))
  },
};
