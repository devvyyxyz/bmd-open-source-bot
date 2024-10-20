module.exports = {
  category: "Roles",
  data: { name: "Get Guild Roles List" },
  UI: [
    {
      element: "halfDropdown",
      name: "Get List Of Guild Roles",
      storeAs: "get",
      choices: [
        {
          name: "IDs"
        },
        {
          name: "Variables"
        },
        {
          name: "Names"
        }
      ]
    },
    "-",
    {
      element: "storage",
      name: "Store List As",
      storeAs: "store"
    },
  ],

  subtitle: (values, constants) => {
    return `Store Role ${values.get} As ${constants.variable(values.store)}`
  },
  async run(values, interaction, client, bridge) {
    let output = [];
    for (let role of bridge.guild.roles) {
      if (values.get == "IDs") {
        output.push(role.id);
      } else if (values.get == "Variables") {
        output.push(role);
      } else {
        output.push(role.name);
      }
    }

    bridge.store(values.store, output)
  },
};
