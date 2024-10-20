module.exports = {
  data: { name: "Create Anchor", id: new Date().getTime() },
  category: "Anchors",
  UI: [
    {
      element: "input",
      storeAs: "id",
      name: "Anchor ID"
    }
  ],
  init: (data, bridge) => {
    bridge.createGlobal({class: "anchors", name: data.id, value: bridge.actions.slice(bridge.atAction + 1)});
  },
  subtitle: "ID: $[id]$",
  async run(values, message, client, bridge) {},
};
