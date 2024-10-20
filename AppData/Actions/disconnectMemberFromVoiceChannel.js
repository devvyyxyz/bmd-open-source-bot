module.exports = {
  category: "Members",
  data: {
    name: "Disconnect Member From Voice Channel",
  },
  UI: [
    {
      element: "member",
      storeAs: "member",
      name: "Member"
    }
  ],
  subtitle: (data, constants) => {
    return `Member: ${constants.user(data.member)} - New Voice Channel: ${constants.channel(data.channel)}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let member = await bridge.getUser(values.member);
    member = await member.member;

    member.edit({
      channelID: null
    });
  },
};
