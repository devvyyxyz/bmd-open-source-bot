module.exports = {
  data: {
    name: "Delete Interaction Reply",
  },
  category: "Interactions",
  UI: [
    {
      element: "interaction",
      storeAs: "interaction",
      name: "Interaction",
    }
  ],

  compatibility: ["Any"],
  subtitle: "-",

  async run(values, message, client, bridge) {
    var interaction;
    interaction = await bridge.getInteraction(values.interaction)

    interaction.deleteOriginal()
  },
};
