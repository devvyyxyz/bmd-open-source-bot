module.exports = {
  category: "Data",
  data: { name: "Create Data Element" },
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
      name: "Element Name"
    },
    "-",
    {
      element: "var",
      storeAs: "value",
      name: "Element Value",
      also: {
        string: "Text",
      },
    },
  ],

  subtitle: (data, constants) => {
    if (data.value.type == 'string') {
      return `Data: ${constants.variable(data.data)} - Name: ${data.key} - Value: ${data.value.value}`
    } else {
      return `Data: ${constants.variable(data.data)} - Name: ${data.key} - Value: ${constants.variable(data.value)}`
    }
  },
  compatibility: ["Any"],

  run(values, message, client, bridge) {
    let data = bridge.get(values.data);

    let dataOverwrite;
    if (values.value.type == "string") {
      dataOverwrite = bridge.transf(values.value.value);
    } else {
      dataOverwrite = bridge.get(values.value);
    }

    data[bridge.transf(values.key)] = dataOverwrite;
  },
};
