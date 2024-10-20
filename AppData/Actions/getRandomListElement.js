module.exports = {
  data: { name: "Get Random List Element" },
  category: "Lists",
  UI: [
    {
      element: "variableInsertion",
      name: "List",
      storeAs: "list"
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
    return `List: ${constants.variable(values.list)} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, interaction, client, bridge) {
    let list = bridge.get(values.list);
    let chosenIndex = Math.floor(Math.random() * (list.length - 0));
    let element = list[chosenIndex];
    bridge.store(values.store, element)
  },
};
