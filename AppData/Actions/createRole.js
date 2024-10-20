module.exports = {
  category: "Roles",
  data: {
    name: "Create Role",
    color: "#000000"
  },
  UI: [
    {
      element: "input",
      name: "Role Name",
      storeAs: "roleName"
    },
    "-",
    {
      element: "input",
      name: "Role Color",
      storeAs: "color"
    },
    "_",
    {
      element: "input",
      name: "Reason",
      storeAs: "reason",
      placeholder: "Optional"
    },
    "-",
    {
      element: "toggle",
      name: "Display Role Separately?",
      storeAs: "hoist"
    },
    {
      element: "toggle",
      name: "Make Role Mentionable",
      storeAs: "mentionable"
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],
  
  subtitle: "Name: $[roleName]$",
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let roleParameters = {
      name: bridge.transf(values.roleName),
      color: parseInt(
        bridge.transf(values.color).replace("#", ""),
        16,
      ),
      hoist: values.hoist,
      reason:
        values.reason != ""
          ? bridge.transf(values.reason)
          : "-",
      mentionable: values.mentionable,
    };

    let role = await bridge.guild.createRole(roleParameters)
    bridge.store(values.store, role)
  },
};
