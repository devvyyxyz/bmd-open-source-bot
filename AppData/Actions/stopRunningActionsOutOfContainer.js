module.exports = {
  category: "Actions",
  data: {
    name: "Stop Actions Out Of Container",
  },
  UI: [],
  subtitle: "Nothing Below This Action Container Will Run",
  compatibility: ["Any"],
  run(values, message, client, bridge) {
    bridge.data.invoker.bridge.stopActionRun = true;
  },
};
