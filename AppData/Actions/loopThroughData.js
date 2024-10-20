module.exports = {
  data: {
    name: "Loop Through Data",
    await: true
  },
  category: "Data",
  UI: [
    {
      element: "var",
      storeAs: "data",
      name: "Data"
    },
    "-",
    {
      element: "store",
      name: "Store Iteration Name As",
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
    return `Data: ${constants.variable(values.data)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let data = bridge.get(values.data)

    for (let element in data) {
      bridge.store(values.storeIterationAs, element)
      bridge.store(values.storeValueAs, data[element])

      if (values.await == undefined || values.await == true) {
        await bridge.runner(values.actions, message, client, bridge.variables);
      } else {
        bridge.runner(values.actions, message, client, bridge.variables);
      }
    }
  },
};