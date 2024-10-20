module.exports = {
  data: {
    name: "Play Track",
  },
  category: "Music",
  UI: [
    {
      element: "var",
      name: "Track",
      storeAs: "track"
    },
    "-",
    {
      element: "dropdown",
      name: "Queuing",
      storeAs: "queuing",
      extraField: "queuePosition",
      choices: [
        { name: "Don't Queue, Just Play" },
        { name: "At End Of Queue" },
        { name: "At Start Of Queue" },
        {
          name: "At Custom Position",
          field: true,
          placeholder: "Queue Starts At #0",
        },
      ],
    },
  ],

  subtitle: (values, constants) => {
    return `${constants.variable(values.track)} - ${values.queuing}`;
  },

  async run(values, message, client, bridge) {
    let track = bridge.get(values.track);

    let utilities = bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id,
    });

    switch (values.queuing) {
      case `Don't Queue, Just Play`:
        utilities.player.play(track.audio);
        utilities.nowPlaying = track;
        client.emit('trackStart', bridge.guild, utilities.channel, utilities.nowPlaying);
        break;

      case `At End Of Queue`:
        utilities.addToQueue(utilities.queue.length, track);
        break;

      case `At Start Of Queue`:
        utilities.addToQueue(0, track);
        break;

      case `At Custom Position`:
        utilities.addToQueue(Number(bridge.transf(values.queuePosition)), track);
        break;
    }
  },
};
