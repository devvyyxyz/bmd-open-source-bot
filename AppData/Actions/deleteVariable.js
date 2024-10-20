module.exports = {
  data: { name: "Delete Variable" },
  category: "Variables",
  UI: [
    {
      element: "variableInsertion",
      name: "Variable",
      storeAs: "variable",
    }
  ],

  subtitle: (values, constants) => {
    return `${constants.variable(values.variable)}`
  },

  run(values, interaction, client, bridge) {
    bridge.store(values.variable, undefined)
  },
};
