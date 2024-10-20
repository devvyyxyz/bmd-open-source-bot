module.exports = {
  data: {
    name: "Split Text",
  },

  category: "Text",

  UI: [
    {
      element: "input",
      name: "Text",
      storeAs: "text",
    },
    "-",
    {
      element: "typedDropdown",
      name: "Split",
      storeAs: "split",
      choices: {
        position: { name: "At Position", field: true },
        text_before: { name: "Before Text", field: true },
        text_after: { name: "After Text", field: true },
      }
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result List As",
      storeAs: "store",
    },
  ],
  subtitle: "Split Text: $[text]$",
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    const text = bridge.transf(values.text);
    let result;

    if (values.split.type == 'position') {
      result = text.split('').splice(0, Number(bridge.transf(values.split.value))).join('');
    } else if (values.split.type == 'text_before') {
      result = text.split(bridge.transf(values.split.value))[0];
    } else {
      result = text.split(bridge.transf(values.split.value))[1];
    }

    bridge.store(values.store, result);
  },
};
