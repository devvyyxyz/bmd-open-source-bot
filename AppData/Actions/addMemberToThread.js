module.exports = {
  category: "Threads",
  data: {
    name: "Add Member To Thread",
  },
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
      name: "Thread"
    }
  ],

  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `Add ${constants.user(values.member)} to ${constants.channel(values.thread)}`
  },

  async run(values, message, client, bridge) {
    let thread = await bridge.get(values.thread);
    let user = await bridge.getUser(values.member)

    thread.addMember(user.id)
  },
};