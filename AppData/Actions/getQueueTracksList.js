module.exports = {
  data: {
    name: "Get Queue Tracks List",
  },
  category: "Music",
  UI: [
    {
      element: "store",
      storeAs: "store"
    }
  ],
  subtitle: (values, constants) => {
    return `Store As ${constants.variable(values.store)}`
  },
  async run(values, message, client, bridge) {
    bridge.store(values.store, bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id,
    }).queue)
  },
};
