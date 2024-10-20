module.exports = {
  category: "Data",
  data: { name: "Create Data" },
  UI: [
    {
      element: "storageInput",
      storeAs: "data",
      name: "Store Data As"
    }
  ],

  subtitle: (data, constants) => {
    return `Store Data As: ${constants.variable(data.data)}`
  },

  run(values, message, client, bridge) {
    bridge.store(values.data, {});
  },
};