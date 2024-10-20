module.exports = {
  category: "Text",
  data: {
    name: "Text To Uppercase",
  },

  UI: [
    {
      element: "input",
      name: "Text",
      storeAs: "string"
    },
    {
      element: "store",
      storeAs: "store",
      name: "Store Uppercased Text As"
    }
  ],

  subtitle: "$[string]$",
  
  async run(values, message, client, bridge) {
    let string = bridge.transf(values.string);

    bridge.store(values.store, string.toUpperCase())
  },
};
