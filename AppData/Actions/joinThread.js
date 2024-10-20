module.exports = {
  data: { name: "Join Thread" },
  category: "Threads",
  UI: [
    {
      element: "channel",
      storeAs: "thread",
      excludeUsers: true,
      name: "Thread"
    }
  ],

  subtitle: (data) => {
    return `Thread Variable: ${data.thread.value}`
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    bridge.get(values.thread).join()
  },
};
