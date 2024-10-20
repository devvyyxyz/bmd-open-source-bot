module.exports = {
  data: {
    name: "Repeat",
  },
  category: "Control",
  UI: [
    {
      element: "input",
      name: "Repeat Count",
      storeAs: "repeat"
    },
    "-",
    {
      element: "store",
      name: "Store Iteration Index As",
      storeAs: "store"
    },
    "-",
    {
      element: "actions",
      name: "Actions To Repeat",
      storeAs: "actions"
    }
  ],
  subtitle: (values) => {
    return `Repeat ${values.actions.length} Actions ${values.repeat} Times`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let number = Number(bridge.transf(values.repeat));

    let iterations = 0;
    
    async function rerun() {
      iterations++

      bridge.store(values.store, iterations);
      
      await bridge.runner(values.actions)

      if (iterations != number) await rerun();
    }

    if (number == 0) return
      await rerun()
  },
};
