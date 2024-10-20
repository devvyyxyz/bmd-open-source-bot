module.exports = {
  data: { name: "Jump To Anchor" },
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
    await bridge.runner(bridge.getGlobal({ class: "anchors", name: values.id }));
    bridge.stopActionRun = true;
  },
};
