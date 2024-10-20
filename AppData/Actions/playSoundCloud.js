module.exports = {
  data: {
    name: "Play SoundCloud Song",
  },
  category: "Music",
  UI: [
    {
      element: "input",
      name: "URL",
      placeholder: "SoundCloud Song URL",
      storeAs: "url",
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
    }
  ],
  subtitle: (values, constants) => {
    return `URL: ${values.url} - ${values.queuing}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const soundcloud = require('soundcloud-downloader').default;
    const { createAudioResource, StreamType } = require('@discordjs/voice');

    let url = bridge.transf(values.url);
    /**
     * @type {ReadableStream}
     */
    let stream = await soundcloud.download(url);
    const audio = createAudioResource(stream, { inputType: StreamType.Arbitrary });
    let search = await soundcloud.search(url);
    let songInfo = search.collection[0];

    let utilities = bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id,
    });


    switch (values.queuing) {
      case `Don't Queue, Just Play`:
        utilities.player.play(audio);
        utilities.nowPlaying = {
          file: null,
          name: songInfo.title,
          author: songInfo.username,
          url: bridge.transf(values.url),
          src: "SoundCloud",
          audio,
          playURL: url
        };
        client.emit('trackStart', bridge.guild, utilities.channel, utilities.nowPlaying);
        break;

      case `At End Of Queue`:
        utilities.addToQueue(utilities.queue.length, {
          file: null,
          name: songInfo.title,
          author: songInfo.username,
          url: bridge.transf(values.url),
          src: "SoundCloud",
          audio,
          playURL: url
        });
        break;

      case `At Start Of Queue`:
        utilities.addToQueue(0, {
          file: null,
          name: songInfo.title,
          author: songInfo.username,
          url: bridge.transf(values.url),
          src: "SoundCloud",
          audio,
          playURL: url
        });
        break;

      case `At Custom Position`:
        utilities.addToQueue(Number(bridge.transf(values.queuePosition)), {
          file: null,
          name: songInfo.title,
          author: songInfo.username,
          url: bridge.transf(values.url),
          src: "SoundCloud",
          audio,
          playURL: url
        });
        break;
    }
  },
};
