module.exports = {
  data: {
    name: "Get Now Playing Track",
  },
  category: "Music",
  UI: [
    {
      element: "store",
      name: "Store Track As",
      storeAs: "store"
    }
  ],
  subtitle: (data, constants) => {
    return `To ${constants.variable(data.store)}`;
  },
  async run(values, message, client, bridge) {
    let utilities = bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id,
    });

    bridge.store(values.store, (utilities.nowPlaying?.src ? utilities.nowPlaying : undefined))
  },
};
