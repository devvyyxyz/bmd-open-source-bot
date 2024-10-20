module.exports = {
  data: {
    name: "Randomize HEX Color",
  },
  category: "Colors",
  UI: [
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: (data, constants) => {
    return `Store As: ${constants.variable(data.store)}`
  },
  compatibility: ["Any"],

  run(values, message, client, bridge) {
    bridge.store(values.store, Math.floor(Math.random()*16777215).toString(16))
  },
};
