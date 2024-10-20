module.exports = {
  category: "Data",
  data: { name: "Get Data Element" },
  UI: [
    {
      element: "variableInsertion",
      storeAs: "data",
      name: "Data",
    },
    "-",
    {
      element: "input",
      storeAs: "key",
      name: "Name"
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Value As"
    },
  ],

  subtitle: (data, constants) => {
    return `Data: ${constants.variable(data.data)} - Name: ${data.key} - Store As: ${constants.variable(data.store)}`
  },
  compatibility: ["Any"],

  run(values, message, client, bridge) {
    let data = bridge.get(values.data);

    bridge.store(values.store, data[bridge.transf(values.key)]);
  },
};
