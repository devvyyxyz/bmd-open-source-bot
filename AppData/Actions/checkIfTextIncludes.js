module.exports = {
  category: "Text",
  data: {
    name: "Check If Text Includes",
  },
  UI: [
    {
      element: "input",
      name: "Text",
      storeAs: "string"
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

  subtitle: "$[string]$ Must Include $[includes]$",
  compatibility: ["Any"],
  
  async run(values, message, client, bridge) {
    let string = bridge.transf(values.string);
    let includes = bridge.transf(values.includes);

    if (string.includes(includes)) {
      await bridge.call(values.true, values.trueActions)
    } else {
      await bridge.call(values.false, values.falseActions)
    }
  },
};
