module.exports = {
  category: "Members",
    data: {
      name: "Deafen Member",
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
    subtitle: 'Reason: $[reason]$',
    async run(values, msg, client, bridge) {
      let guild = bridge.guild;
      
      let user = bridge.getUser(values.member)
      let member = await user.member;
      member = member.id;
      
      if (values.reason.trim() == "") {
        guild.editMember(member, {
          deaf: true
        });
      } else {
        guild.editMember(member, {
          deaf: true,
          reason: bridge.transf(values.reason),
        });
      }
    },
  };
  