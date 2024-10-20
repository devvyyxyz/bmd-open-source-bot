module.exports = {
  data: { name: "Get All Members Data Data" },
  category: "Member Data",
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

    bridge.store(values.store, storedData.members)
  }
}