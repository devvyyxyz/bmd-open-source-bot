module.exports = {
  category: "Members",
  data: {
    name: "Set Member Nickname",
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
      name: "Set Nickname To",
      placeholder: "Leave Blank To Reset",
      storeAs: "newNickname"
    }
  ],

  subtitle: "New Nickname: $[newNickname]$",
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let user = await bridge.getUser(values.member);
    let member = await user.member;

    member.edit({
      nick: bridge.transf(values.newNickname),
    }).catch(error => console.log(error));;
  },
};
