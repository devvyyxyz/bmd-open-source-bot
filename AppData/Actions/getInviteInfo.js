module.exports = {
  category: "Invites",
  data: {
    name: "Get Invite Info",
  },
  UI: [
    {
      element: "var",
      storeAs: "invite",
      name: "Invite"
    },
    "-",
    {
      element: "dropdown",
      storeAs: "get",
      name: "Get",
      choices: [
        {name: "Channel"},
        {name: "Guild"},
        {name: "Author"},
        {name: "Uses"},
        {name: "Max Age (Seconds)"},
        {name: "Max Uses"},
        {name: "Is From An Event?"},
        {name: "Code"},
        {name: "URL"},
        {name: "Created At (Timestamp)"},
      ]
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: (values, constants) => {
    return `${values.get} of ${constants.variable(values.invite)} - Store As: ${constants.variable(values.store)}`
  },

  compatibility: ["Any"],
  async run(values, _message, client, bridge) {
    let invite = bridge.get(values.invite)
    let result;

    switch (values.get) {
      case 'Channel':
        result = await client.rest.channels.get(invite.channelID);
      break
      case 'Guild':
        result = invite.guild.completeGuild;
      break
      case 'Author':
        result = invite.inviter;
      break
      case 'Uses':
        result = invite.uses;
      break
      case 'Max Age (Seconds)':
        result = invite.maxAge;
      break
      case 'Max Uses':
        result = invite.maxUses;
      break
      case 'Is From An Event?':
        result = invite.guildScheduledEvent ? true : false
      break
      case 'Code':
        result = invite.code;
      break
      case 'URL':
        result = `https://discord.gg/${invite.code}`
      break
      case 'Created At (Timestamp)':
        result = invite.createdAt.getTime();
      break
    }

    bridge.store(values.store, result)
  },
};
