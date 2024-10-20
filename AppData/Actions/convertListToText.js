module.exports = {
  category: "Lists",
    data: {
      name: "Convert List To Text",
    },
    UI: [
      {
        element: "var",
        storeAs: "list",
        name: "List"
      },
      "-",
      {
        element: "input",
        name: "Join Each Element With",
        storeAs: "separator"
      },
      "-",
      {
        element: "store",
        name: "Store Result As",
        storeAs: "store"
      }
    ],
    
    subtitle: (data, constants) => {return `Join List [${constants.variable(data.list)}] with ${data.separator} - Store Result As ${constants.variable(data.store)}`},
    compatibility: ["Any"],
  
    async run(values, message, client, bridge) {
      let list = await bridge.get(values.list);
      bridge.store(values.store, list.join(bridge.transf(values.separator)))
    },
  };
  