module.exports = {
  data: { name: "Leave Thread" },
  category: "Threads",
  UI: [
    {
      element: "var",
      storeAs: "thread",
      name: "Thread"
    }
  ],

  subtitle: "",
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    bridge.get(values.thread).leave()
  },
};
