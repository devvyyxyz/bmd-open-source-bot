module.exports = {
  category: "Text",
  data: {
    name: "Check If Text Ends With",
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
      name: "Must End With",
      storeAs: "endsWith"
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

  subtitle: "$[string]$ Must End With $[endsWith]$",
  compatibility: ["Any"],
  
  async run(values, message, client, bridge) {
    let string = bridge.transf(values.string);
    let endsWith = bridge.transf(values.endsWith);

    if (string.endsWith(endsWith)) {
      await bridge.call(values.true, values.trueActions)
    } else {
      await bridge.call(values.false, values.falseActions)
    }
  },
};
