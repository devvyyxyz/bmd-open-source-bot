module.exports = {
  category: "Actions",
  data: {
    name: "Jump To Action Out Of Container",
  },
  UI: [
    {
      element: "input",
      storeAs: "action",
      name: "Jump To Action #",
    }
  ],
  subtitle: "To Action #$[action]$",

  run(values, message, client, bridge) {
    bridge.data.invoker.bridge.call({
      type: 'jump',
      value: parseFloat(values.action)
    }, bridge.data.actions)
  },
};
