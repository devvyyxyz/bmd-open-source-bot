module.exports = {
  category: "Members",
  data: {
    name: "Move Member Voice Channel",
  },
  UI: [
    {
      element: "member",
      storeAs: "member",
      name: "Member"
    },
    "-",
    {
      name: "New Voice Channel",
      storeAs: "channel",
      element: "channel",
      excludeUsers: true
    }
  ],
  subtitle: (data, constants) => {
    return `Member: ${constants.user(data.member)} - New Voice Channel: ${constants.channel(data.channel)}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let member = await bridge.getUser(values.member);
    member = await member.member;

    let newChannel = await bridge.getChannel(values.channel);
    newChannel = newChannel.id;

    member.edit({
      channelID: newChannel
    })
  },
};
