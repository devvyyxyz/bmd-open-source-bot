module.exports = {
  data: {
    name: "Get Text Length",
  },
  category: "Text",
  UI: [
    {
      element: "input",
      name: "Text",
      storeAs: "string"
    },
    {
      element: "store",
      storeAs: "store",
      name: "Store Text Length As"
    }
  ],

  subtitle: "$[string]$",
  
  async run(values, message, client, bridge) {
    let string = bridge.transf(values.string);

    bridge.store(values.store, string.length)
  },
};
