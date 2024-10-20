module.exports = {
  data: {
    name: "Remove Member From Thread",
  },
  category: "Threads",
  UI: [
    {
      element: "memberInput",
      storeAs: "member",
      name: "Member"
    },
    "-",
    {
      element: "channel",
      excludeUsers: true,
      storeAs: "thread",
      name: "Thread Variable"
    }
  ],

  compatibility: ["Any"],

  subtitle: (values, constants) => {
    return `Remove ${constants.user(values.member)} from ${constants.channel(values.thread)}`
  },

  async run(values, message, client, bridge) {
    let thread = await bridge.get(values.thread);

    thread.removeMember(await bridge.getUser(values.member).id)
  },
};
