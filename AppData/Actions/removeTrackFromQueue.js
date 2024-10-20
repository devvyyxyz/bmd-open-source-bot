module.exports = {
  data: {
    name: "Remove Track From Queue",
  },
  category: "Music",
  UI: [
    {
      element: "input",
      name: "Track Position In Queue",
      storeAs: "position",
      placeholder: "Queue Starts At #0"
    }
  ],
  subtitle: (data, constants) => {
    return `Position: ${data.position}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let utilities = bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id,
    });

    utilities.queue.splice(Number(bridge.transf(values.position)), 1);
    
    client.emit('queueSongRemove', bridge.guild, utilities.channel)
  },
};
