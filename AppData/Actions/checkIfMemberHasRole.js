module.exports = {
  category: "Members",
  data: {
    name: "Check If Member Has Role",
  },
  UI: [
    {
      element: "memberInput",
      storeAs: "member",
      name: "Member"
    },
    "-",
    {
      element: "role",
      name: "Role",
      storeAs: "role"
    },
    "-",
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If True"
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If False"
    }
  ],

  subtitle: (data, constants) => {
    return `Member: ${constants.user(data.member)} - Role: ${constants.role(data.role)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let user = await bridge.getUser(values.member)
    let member = await user.member;

    let role = await bridge.getRole(values.role);
    
    let hasRole = member.roles.includes(role.id);

    if (hasRole == true) {
      await bridge.call(values.true, values.trueActions)
    } else {
      await bridge.call(values.false, values.falseActions)
    }
  },
};
