module.exports = {
  data: { name: "Get List Element" },
  category: "Lists",
  UI: [
    {
      element: "variableInsertion",
      name: "List",
      storeAs: "list"
    },
    "-",
    {
      element: "dropdown",
      storeAs: "elementPosition",
      extraField: "index",
      name: "Position",
      choices: [
        { name: "Custom", field: true, placeholder: "Positions Start At 0" },
        { name: "Random" },
        { name: "Last" },
        { name: "First" },
      ],
    },
    "-",
    {
      element: "store",
      name: "Store As",
      storeAs: "store"
    }
  ],
  
  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `List: ${constants.variable(values.list)} - Position: ${values.index} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, interaction, client, bridge) {
    let list = bridge.get(values.list);
    let index = 0;

    if (values.elementPosition == 'Random') {
      index = Math.floor(Math.random() * (list.length - 0));
    } else if (values.elementPosition == 'First') {
      index = 0;
    } else if (values.elementPosition == 'Last') {
      index = list.length - 1
    } else {
      index = Number(bridge.transf(values.index))
    }
    
    let element = list[index];
    bridge.store(values.store, element)
  },
};
