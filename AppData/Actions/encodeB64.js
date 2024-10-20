module.exports = {
  data: {
    name: "Encode In Base 64",
  },
  category: "Base 64",
  UI: [
    {
      element: "largeInput",
      name: "To Encode",
      storeAs: "toEncode"
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],
  subtitle: (data, constants) => {
    return `Encode ${data.toEncode} - Store As: ${constants.variable(data.store)}`
  },
  compatibility: ["Any"],
  run(values, message, client, bridge) {
    bridge.store(values.store, btoa(bridge.transf(values.toEncode)))
  },
};
