module.exports = {
  data: {
    name: "Decode Base 64",
  },
  category: "Base 64",
  UI: [
    {
      element: "largeInput",
      name: "To Decode",
      storeAs: "toDecode"
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],
  subtitle: (data, constants) => {
    return `Decode ${data.toDecode} - Store As: ${constants.variable(data.store)}`
  },
  compatibility: ["Any"],
  run(values, message, client, bridge) {
    bridge.store(values.store, atob(bridge.transf(values.toDecode)))
  },
};
