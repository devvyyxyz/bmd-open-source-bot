module.exports = {
  category: "Invites",
  data: { name: "Find Invite" },
  UI: [
    {
      element: "dropdown",
      name: "Find Invite By",
      storeAs: "method",
      extraField: "value",
      choices: [
        {
          name: "Invite Code",
          field: true,
          placeholder: "Invite ID"
        },
        {
          name: "Channel ID",
          field: true,
          placeholder: "Channel ID"
        },
      ]
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Invite As"
    }
  ],
  guide: [
    {
      element: "text",
      text: "What is an invite code?",
      large: true
    },
    {
      element: "text",
      text: "An invite code is the text after a discord.gg invite. Example: discord.gg/hello | Invite Code: hello"
    },
  ],
  subtitle: (data, constants) => {
    return `Find By ${data.method} (${data.value || "Blank"}) - Store As ${constants.variable(data.store)}`
  },
  async run(values, message, client, bridge) {
    let invites = await bridge.guild.getInvites();

    let matchValue;
    let toMatch = bridge.transf(values.value)

    if (values.method == 'Invite Code') {
      matchValue = 'code'
    } else {
      matchValue = 'channelID'
    }

    bridge.store(values.store, invites.filter(invite => invite[matchValue] == toMatch)[0])
  },
};
