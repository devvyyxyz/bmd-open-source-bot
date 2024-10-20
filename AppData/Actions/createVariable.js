module.exports = {
  data: { name: "Create Variable" },
  category: "Variables",
  UI: [
    {
      element: "storageInput",
      storeAs: "variable",
      name: "Store Variable As"
    },
    "-",
    {
      element: "largeInput",
      storeAs: "value",
      name: "Value"
    }
  ],

  subtitle: (data) => {
    return `Store As: ${data.variable.value} - Value: ${data.value}`
  },
  
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    bridge.store(values.variable, bridge.transf(values.value))
  },
};
