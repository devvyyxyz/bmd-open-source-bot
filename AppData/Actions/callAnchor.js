module.exports = {
  data: { name: "Call Anchor" },
  category: "Anchors",
  UI: [
    {
      element: "input",
      storeAs: "id",
      name: "Anchor ID"
    }
  ],
  subtitle: "ID: $[id]$",
  async run(values, message, client, bridge) {
    await bridge.runner(bridge.getGlobal({ class: "anchors", name: bridge.transf(values.id) }))
  },
};
