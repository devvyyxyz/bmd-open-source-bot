module.exports = {
  category: "Modularity",
  data: { name: "Create Modular Embed Field", inline: true },
  UI: [
    {
      element: "input",
      name: "Title",
      storeAs: "title"
    },
    "-",
    {
      element: "largeInput",
      name: "Value",
      storeAs: "value"
    },
    "-",
    {
      element: "toggle",
      name: "Field Type",
      true: "Inline",
      false: "Not Inline",
      storeAs: "inline"
    },
    "-",
    {
      element: "store",
      storeAs: "store",
    }
  ],

  subtitle: (data, constants) => {
    return `Store As: ${constants.variable(data.store)}`
  },

  run(values, message, client, bridge) {
    let field = { };
    field.name = bridge.transf(values.title);
    field.value = bridge.transf(values.value);
    field.inline = values.inline;
    
    bridge.store(values.store, field);
  },
};