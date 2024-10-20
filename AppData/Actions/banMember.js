module.exports = {
  category: "Members",
  data: {
    name: "Ban Member",
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
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "deleteHistory",
      name: "Delete History",
      choices: {
        "none": { name: "None" },
        "60": { name: "1 Hour" },
        "120": { name: "2 Hours" },
        "240": { name: "4 Hours" },
        "480": { name: "8 Hours" },
        "1440": { name: "1 Day" },
        "4320": { name: "3 Days" },
        "10080": { name: "1 Week" },
        custom: { name: "Custom (Minutes)", field: true }
      }
    }
  ],
  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `Member: ${constants.user(values.member)} - Reason: ${values.reason}`
  },
  
  async run(values, msg, client, bridge) {
    let user = await bridge.getUser(values.member)

    let deleteMessageSeconds;

    if (values.deleteHistory.type != 'none') {
      if (values.deleteHistory.type != 'custom') {
        deleteMessageSeconds = Number(values.deleteHistory.type) * 60
      } else {
        deleteMessageSeconds = Number(bridge.transf(values.deleteHistory.value)) * 60
      }
    }

    await bridge.guild.createBan(user.id, {
      reason: bridge.transf(values.reason) || undefined
    })
  },
};
