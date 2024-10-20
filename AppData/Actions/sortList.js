module.exports = {
  data: {
    name: "Sort List",
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
      element: "dropdown",
      storeAs: "sortType",
      name: "Sort Type",
      choices: [
        { name: "Increasing Numerically" },
        { name: "Decreasing Numerically" },
      ]
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
    "_",
    {
      element: "var",
      storeAs: "sortValue",
      name: "Sort Value Of Iteration"
    },
    "-",
    {
      element: "store",
      name: "Store Sorted List As",
      storeAs: "store"
    }
  ],

  subtitle: (values, constants) => {
    return `List: ${constants.variable(values.list)} - Store Ordered List As: ${constants.variable(values.store)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let list = bridge.get(values.list);

    let sortResults = [];

    for (let element in list) {
      bridge.store(values.storeIterationAs, element)
      bridge.store(values.storeValueAs, list[element])

      await bridge.runner(values.actions, message, client, bridge.variables);

      let value = bridge.get(values.sortValue);
      
      sortResults.push({element: list[element], value});
    }

    if (values.sortType == 'Increasing Numerically') {
      sortResults = sortResults.sort((a, b) => {return Number(a.value) - Number(b.value)})
    } else {
      sortResults = sortResults.sort((b, a) => {return Number(a.value) - Number(b.value)})
    }


    bridge.store(values.store, sortResults.map(a => a.element));
  },
};