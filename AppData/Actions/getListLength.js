module.exports = {
  data: { name: "Get List Length" },
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
      storeAs: "store"
    }
  ],
  
  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `List: ${constants.variable(values.list)} Store As ${constants.variable(values.store)}`
  },

  async run(values, interaction, client, bridge) {
    let list = bridge.get(values.list)
    let length = list.length
    bridge.store(values.store, length)
  },
};
