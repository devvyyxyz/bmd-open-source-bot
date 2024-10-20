module.exports = {
  data: { name: "Delete List Element" },
  category: "Lists",
  UI: [
    {
      element: "variableInsertion",
      storeAs: "list",
      name: "List"
    },
    "-",
    {
      element: "input",
      storeAs: "index",
      name: "List Element Position",
      placeholder: "Positions Start At 0"
    },
  ],

  compatibility: ["Any"],
  subtitle: "Element Position: $[index]$",

  async run(values, interaction, client, bridge) {
    let list = bridge.get(values.list);

    list.splice(parseFloat(bridge.transf(values.index)), 1)
  },
};