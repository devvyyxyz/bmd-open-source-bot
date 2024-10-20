module.exports = {
    data: {
      name: "Unban Member",
    },
    category: "Members",
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
      let guild = bridge.guild;
      
      let member = await bridge.getUser(values.member)
      member = member.id;
      
      if (values.reason.trim() == "") {
        guild.removeBan(member)
      } else {
        guild.removeBan(member, bridge.transf(values.reason))
      }
    },
  };
  