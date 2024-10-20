module.exports = {
  data: {
    name: "Replace",
  },
  category: "Text",
  UI: [
    {
      element: "input",
      name: "Input Text",
      storeAs: "input"
    },
    "-",
    {
      element: "inputGroup",
      nameSchemes: ["Replace Text Matching", "With"],
      storeAs: ["replace", "with"],
      placeholder: ["What Will Get Replaced", "What It'll Get Replaced With"]
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Replaced Text As"
    }
  ],

  subtitle: (data) => {
    return `Replace "${data.replace}" with "${data.with}" in "${data.input}"`
  },
  
  async run(values, message, client, bridge) {
    let input = bridge.transf(values.input)
    let replace = bridge.transf(values.replace);
    let replaceWith = bridge.transf(values.with);

    let output;

    output = input.replaceAll(replace, replaceWith)

    bridge.store(values.store, output)
  },
};