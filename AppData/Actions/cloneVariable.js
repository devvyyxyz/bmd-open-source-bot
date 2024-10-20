module.exports = {
  data: { name: "Clone Variable" },
  category: "Variables",
  UI: [
    {
      element: "var",
      storeAs: "value",
      name: "Value"
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store",
      name: "Store Variable As"
    },

  ],

  subtitle: (data, constants) => {
    return `Variable: ${constants.variable(data.value)} - Store As: ${constants.variable(data.store)}`
  },
  
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    bridge.store(values.store, bridge.get(values.value));
  },
};
