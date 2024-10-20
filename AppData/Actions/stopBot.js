module.exports = {
  category: "Control",
  data: {
    name: "Stop Bot",
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
    client.disconnect(false);
  },
};
