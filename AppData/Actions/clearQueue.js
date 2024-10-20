module.exports = {
  data: {
    name: "Clear Queue",
  },
  category: "Music",
  UI: [
    {
      element: "toggle",
      storeAs: "stop",
      name: "Also Stop Current Track?"
    }
  ],
  subtitle: (data, constants) => {
    return `Does${data.stop ?? "n't"} Stop Current Track`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let utilities = bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id,
    });

    utilities.player.stop(true);

    client.emit('queueEnd', bridge.guild, utilities.channel)
    client.emit('queueSongRemove', bridge.guild, utilities.channel)
  },
};
