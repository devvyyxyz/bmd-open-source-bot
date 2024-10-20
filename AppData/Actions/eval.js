module.exports = {
  data: { name: "Evaluate" },
  UI: [
    {
      element: "largeInput",
      storeAs: "code",
      name: "JavaScript Code",
      max: 50000000000000000000000000000000000000,
      large: true
    },
    "-",
    {
      element: "storage",
      storeAs: "result",
      name: "Store Result As"
    },
    "_",
    {
      element: "storage",
      storeAs: "type",
      name: "Store Result Type As"
    }
  ],
  category: "Control",
  subtitle: (values, constants) => {
    return `Store Result As: ${constants.variable(values.result)}`
  },
  compatibility: ["Any"],

  async run(values, command, client, bridge) {
    let evaluate = bridge.transf(values.code)
     
    let result = async () => {
      return eval(evaluate)
    };

    let evaluation = await result()

    bridge.store(values.result, evaluation)
    bridge.store(values.type, typeof evaluation)
  },
};