module.exports = {
  category: "Data",
  data: { name: "Delete Data Element" },
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
  ],

  subtitle: (data, constants) => {
    return `Data: ${constants.variable(data.data)} - Name: ${data.key}`
  },
  compatibility: ["Any"],

  run(values, message, client, bridge) {
    let data = bridge.get(values.data);

    delete data[bridge.transf(values.key)];
  },
};
