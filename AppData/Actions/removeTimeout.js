module.exports = {
  data: {
    name: "Remove Timeout",
  },
  category: "Members",
  UI: [
    {
      element: "userInput",
      name: "Member",
      storeAs: "member"
    },
    "-",
    {
      element: "input",
      max: 256,
      name: "Reason",
      placeholder: "Leave Blank For None",
      storeAs: "reason"
    }
  ],
  
  subtitle: "Reason: $[reason]$",
  compatibility: ["Any"],

  async run(values, message, client,  bridge) {
    let member = await bridge.getUser(values.member)
    member = await member.member

    if (values.reason.trim() == "") {
      member.edit({
        communicationDisabledUntil: null
      });
    } else {
      member.edit({
        communicationDisabledUntil: null,
        reason: bridge.transf(values.reason),
      });
    }
  },
};
