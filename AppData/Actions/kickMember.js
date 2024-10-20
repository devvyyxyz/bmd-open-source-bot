module.exports = {
  category: "Members",
  data: {
    name: "Kick Member",
  },
  UI: [
    {
      element: "memberInput",
      storeAs: "member",
      name: "Member"
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
    return `Member: ${constants.user(values.member)} - Reason: ${values.reason}`
  },
  async run(values, msg, client, bridge) {
    let user = await bridge.getUser(values.member)
    let member = await user.member;
    member.kick(bridge.transf(values.reason));
  },
};
