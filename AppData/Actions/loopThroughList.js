module.exports = {
  data: {
    name: "Loop Through List",
    await: true
  },
  category: "Lists",
  UI: [
    {
      element: "var",
      storeAs: "list",
      name: "List"
    },
    "-",
    {
      element: "store",
      name: "Store Iteration Index As",
      storeAs: "storeIterationAs"
    },
    "_",
    {
      element: "store",
      name: "Store Iteration Value As",
      storeAs: "storeValueAs"
    },
    "-",
    {
      name: "For Each Iteration, Run",
      element: "actions",
      storeAs: "actions"
    },
    "-",
    {
      element: "toggle",
      name: "Await Each Iteration To Finish Execution",
      storeAs: "await"
    }
  ],

  subtitle: (values, constants) => {
    return `List: ${constants.variable(values.list)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let list = bridge.get(values.list)

    for (let element in list) {
      bridge.store(values.storeIterationAs, element)
      bridge.store(values.storeValueAs, list[element])

      if (values.await == undefined || values.await == true) {
        await bridge.runner(values.actions, message, client, bridge.variables);
      } else {
        bridge.runner(values.actions, message, client, bridge.variables);
      }
    }
  },
};