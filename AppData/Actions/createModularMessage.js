module.exports = {
  category: "Modularity",
  data: { name: "Create Modular Message" },
  UI: [
    {
      element: "largeInput",
      storeAs: "messageContent",
      name: "Message Content"
    },
    "-",
    {
      element: "var",
      storeAs: "components",
      name: "Component List",
      optional: true
    },
    "-",
    {
      element: "var",
      storeAs: "embeds",
      name: "Embed List",
      optional: true
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    },
  ],

  subtitle: (data, constants) => {
    return `Store As: ${constants.variable(data.store)}`
  },

  run(values, message, client, bridge) {
    bridge.store(values.store, {
      raw: {
      content: bridge.transf(values.messageContent),
      embeds: bridge.get(values.embeds),
      components: bridge.get(values.components)? bridge.get(values.components).map(c => c.raw) : undefined
    },
    components: bridge.get(values.components)
  });
  },
};