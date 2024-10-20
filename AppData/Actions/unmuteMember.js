module.exports = {
    data: {
      name: "Unmute Member",
    },
    category: "Members",
    UI: [
      {
        element: "memberInput",
        storeAs: "member"
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
    subtitle: 'Reason: $[reason]$',
    async run(values, msg, client, bridge) {
      let guild = bridge.guild;
      
      let user = bridge.getUser(values.member)
      let member = await user.member;
      member = member.id;
      
      if (values.reason.trim() == "") {
        guild.editMember(member, {
          mute: false
        });
      } else {
        guild.editMember(member, {
          mute: false,
          reason: bridge.transf(values.reason),
        });
      }
    },
  };
