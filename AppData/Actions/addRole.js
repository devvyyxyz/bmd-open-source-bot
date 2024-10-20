module.exports = {
  category: "Roles",
  data: {
    name: "Add Role",
  },
  UI: [
    {
      element: "memberInput",
      storeAs: "member",
      name: "Add To Member"
    },
    "-",
    {
      element: "role",
      storeAs: "role",
      name: "Role",
    },
    "-",
    {
      element: "input",
      max: "256",
      placeholder: "Optional",
      name: "Reason",
      storeAs: "reason"
    }
  ],

  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `Add ${constants.role(values.role)} to ${constants.user(values.member)}`
  },

  async run(values, message, client, bridge) {
    let role = await bridge.getRole(values.role);

    let user = await bridge.getUser(values.member);
    user = await user.member;
    user.addRole(role.id, bridge.transf(values.reason));
  },
};
