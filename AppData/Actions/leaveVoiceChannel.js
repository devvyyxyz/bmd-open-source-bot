module.exports = {
  category: "Channels",
  data: {
    name: "Leave Voice Channel",
  },
  UI: [],
  async run(values, message, client, bridge) {
    let channel = bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id
    })
    await channel.channel.leave()
  },
};
