module.exports = {
  data: {
    name: "Delete Thread",
  },
  category: "Threads",
  UI: [
    {
      element: "channel",
      excludeUsers: true,
      storeAs: "thread",
      name: "Thread"
    }
  ],

  compatibility: ["Any"],
  subtitle: (values, constants) => {return constants.channel(values.thread)},

  async run(values, message, client, bridge) {
    let thread = await bridge.get(values.thread);

    await thread.delete()
  },
};