const { Role } = require("oceanic.js");

module.exports = {
  category: "Roles",
  data: {
    name: "Get Role Info",
    role: {type: "mentioned", value: ""}
  },
  UI: [
    {
      element: "role",
      name: "Role",
      storeAs: "role",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "get",
      name: "Get",
      choices: {
        name: { name: "Name" },
        id: { name: "ID" },
        guild: { name: "Server" },
        color: { name: "Color" },
        position: { name: "Position" },
        members: { name: "Members" }
      }
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],
  
  compatibility: ["Any"],
  subtitle: (values, constants, thisAction) => {
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.role(values.role)} - Store As: ${constants.variable(values.store)}`
  },
  

  async run(values, message, client, bridge) {    
    /**
     * @type {Role}
     */
    let role = await bridge.getRole(values.role);

    let output;
    switch (values.get.type) {
      case "color":
        output = role.color.toString(16);
        break;
      case "members":
        output = (await require('./getGuildInfo').getMembers(bridge)).filter(m => m.roles.includes(role.id));
        break;
      default:
        output = role[values.get.type];
        break;
    }

    bridge.store(values.store, output)
  },
};
