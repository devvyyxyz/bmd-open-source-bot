module.exports = {
  category: "Emoji",
  data: {
    name: "Delete Emoji",
  },
  UI: [
    {
      element: "variable",
      name: "Emoji",
      storeAs: "emoji"
    }
  ],
  subtitle: (data, constants) => {
    return `Emoji: ${constants.variable(data.emoji)}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let emoji = bridge.get(values.emoji);
    await bridge.deleteEmoji(emoji.id)
  },
};
