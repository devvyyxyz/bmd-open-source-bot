module.exports = {
  category: "Lists",
    data: {
      name: "Convert Text To List",
    },
    UI: [
      {
        element: "input",
        storeAs: "text",
        name: "Text"
      },
      "-",
      {
        element: "input",
        name: "Element Separator",
        storeAs: "separator"
      },
      "-",
      {
        element: "store",
        name: "Store Result List As",
        storeAs: "store"
      }
    ],
    
    subtitle: (data, constants) => {return `Text: ${data.text} - Separator: ${data.separator} - Store As: ${constants.variable(data.store)}`},
    compatibility: ["Any"],
  
    async run(values, message, client, bridge) {
      bridge.store(
        values.store,
        bridge.transf(values.text).split(bridge.transf(values.separator))
        )
    },
  };
  