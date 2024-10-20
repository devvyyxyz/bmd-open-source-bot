module.exports = {
  data: {
    name: "Pause",
  },
  category: "Music",
  UI: [],
  subtitle: (data, constants) => {
    return ``;
  },
  async run(values, message, client, bridge) {
    let utilities = bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id,
    });

    utilities.player.pause();
  },
};
