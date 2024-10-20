module.exports = {
  category: "Actions",
  data: {
    name: "Skip Actions Out Of Container",
  },
  UI: [
    {
      element: "input",
      storeAs: "action",
      name: "Skip # Actions",
    }
  ],
  
  subtitle: "$[action]$ Actions Ahead",
  
  run(values, message, client, bridge) {
    bridge.data.invoker.bridge.call({
      type: 'skip',
      value: parseFloat(values.action)
    }, bridge.data.actions);
  },
};
