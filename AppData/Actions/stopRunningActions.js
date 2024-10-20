module.exports = {
  category: "Actions",
  data: {
    name: "Stop Actions",
  },
  UI: [
    {
      element: "text",
      text: `
        This will prevent any action below this from running.
      `
    }
  ],
  subtitle: "Nothing Below This Will Run",
  compatibility: ["Any"],
  run(values, message, client, bridge) {
    bridge.stopActionRun = true;
  },
};
