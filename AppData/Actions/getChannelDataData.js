module.exports = {
  data: { name: "Get All Channels Data Data" },
  category: "Channel Data",
  UI: [
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: (values, constants) => {
    return `Store As: ${constants.variable(values.store)}`
  },

  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    var storedData = bridge.data.IO.get();

    bridge.store(values.store, storedData.channels)
  }
}