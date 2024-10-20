module.exports = {
  data: { name: "Set List Element Value" },
  category: "Lists",
  UI: [
    {
      element: "variableInsertion",
      name: "List",
      storeAs: "list"
    },
    "-",
    {
      element: "input",
      name: "Element Position",
      storeAs: "index",
      placeholder: "List Element Indexes Start At 0"
    },
    "-",
    {
      element: "var",
      name: "New Value",
      storeAs: "newValue",
      also: {
        text: "Text"
      }
    }
  ],
  
  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `Index: ${values.index} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, interaction, client, bridge) {
    let list = bridge.get(values.list)
    
    let newValue;

    if (values.newValue.type == 'text') {
      newValue = bridge.transf(values.newValue.value)
    } else {
      newValue = bridge.get(values.newValue)
    }

    list[bridge.transf(values.index)] = newValue;

    bridge.store(values.list, list)
  },
};
