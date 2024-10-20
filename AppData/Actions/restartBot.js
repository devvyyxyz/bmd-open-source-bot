module.exports = {
  data: {
    name: "Restart Bot",
  },
  category: "Bot",
  UI: [],
  subtitle: "Nothing Below This Will Run",
  compatibility: ["Any"],
  run(values, message, client, bridge) {
    client.disconnect(true);
  },
};
