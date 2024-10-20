module.exports = {
  category: "Lists",
  data: { name: "Create List" },
  UI: [
    {
      element: "storageInput",
      storeAs: "list",
      name: "Store List As"
    }
  ],

  subtitle: (data, constants) => {
    return `Store List As: ${constants.variable(data.list)}`
  },
  compatibility: ["Any"],

  run(values, message, client, bridge) {
    bridge.store(values.list, []);
  },
};