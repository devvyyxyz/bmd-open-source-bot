const { Role } = require("oceanic.js");

module.exports = {
  category: "Roles",
  data: {
    name: "Delete Role",
  },
  UI: [
    {
      element: "role",
      name: "Role",
      storeAs: "role",
    },
    "-",
    {
      element: "input",
      storeAs: "reason",
      name: "Reason",
      placeholder: "Optional"
    }
  ],
  
  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `Role: ${constants.role(values.role)} - Reason: ${values.reason}`
  },
  

  async run(values, message, client, bridge) {    
    /**
     * @type {Role}
     */
    let role = await bridge.getRole(values.role);
    role.delete(bridge.transf(values.reason))
  },
};
