module.exports = {
  category: "Members",
  data: { name: "Find Member" },
  UI: [
    {
      element: "dropdown",
      name: "Find Member By",
      storeAs: "method",
      extraField: "value",
      choices: [
        {
          name: "Member Nickname",
          field: true,
        },
        {
          name: "Member Username",
          field: true,
        },
        {
          name: "Member Name",
          field: true
        },
        {
          name: "Member ID",
          field: true
        }
      ]
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Member As"
    }
  ],
  subtitle: (data, constants) => {
    return `Find By ${data.method} (${data.value || "Blank"}) - Store As ${constants.variable(data.store)}`
  },
  async run(values, message, client, bridge) {
    let members = await require('./getGuildInfo.js').getMembers(bridge);

    let toMatch = bridge.transf(values.value)

    bridge.store(values.store, members.find(member => {
      if (values.method == 'Member Nickname') {
        return member.displayName == toMatch;
      }
      if (values.method == 'Member Name') {
        return member.user.globalName == toMatch;
      }
      if (values.method == 'Member Name') {
        return member.user.globalName == toMatch;
      }
      if (values.method == 'Member ID') {
        return member.id == toMatch;
      }
    }))
  },
};
