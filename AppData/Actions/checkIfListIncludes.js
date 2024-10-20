module.exports = {
  category: "Lists",
  data: {
    name: "Check If List Includes",
  },
  UI: [
    {
      element: "var",
      name: "List",
      storeAs: "list"
    },
    "_",
    {
      element: "input",
      name: "Must Include",
      storeAs: "includes"
    },
    "-",
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If True"
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If False"
    }
  ],

  subtitle: (data, constants) => {
    return `List: ${constants.variable(data.list)} - Must Include: ${data.includes || "(Blank)"}`
  },
  compatibility: ["Any"],
  
  async run(values, message, client, bridge) {
    let actionRunner = bridge.runner

    let list = bridge.get(values.list);
    let includes = bridge.transf(values.includes);

    if (list.includes(includes)) {
      await bridge.call(values.true, values.trueActions)
    } else {
      await bridge.call(values.false, values.falseActions)
    }
  },
};
