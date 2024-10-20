module.exports = {
  data: {
    name: "Play URL",
  },
  category: "Music",
  UI: [
    {
      element: "input",
      name: "MP3 File URL",
      placeholder: "On The Internet",
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
    },
  ],
  subtitle: (data, constants) => {
    return `File: ${data.url} - ${data.queuing}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const { createAudioResource, createAudioPlayer, joinVoiceChannel, AudioPlayerStatus, NoSubscriberBehavior, StreamType } = require("@discordjs/voice");
    const axios = require("axios");
    const prism = require("prism-media");

    const url = bridge.transf(values.url);

    async function playStream(url) {
      try {
        const response = await axios({
          url,
          method: 'GET',
          responseType: 'stream'
        });

        const stream = new prism.FFmpeg({
          args: [
            '-analyzeduration', '0',
            '-loglevel', '0',
            '-i', 'pipe:0',
            '-f', 's16le',
            '-ar', '48000',
            '-ac', '2',
          ],
        });

        const piped = response.data.pipe(stream);

        return createAudioResource(piped, {
          inputType: StreamType.Raw
        });
        console.log(piped)
      } catch (error) {
        throw new Error(`Error fetching audio stream: ${error.message}`);
      }
    }

    let audioResource;
    try {
      audioResource = await playStream(url);
    } catch (error) {
      console.error("Error streaming audio:", error);
      return;
    }

    let utilities = bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id,
    });

    switch (values.queuing) {
      case `Don't Queue, Just Play`:
        utilities.player.play(audioResource);
        utilities.nowPlaying = {
          file: url,
          name: url,
          author: "",
          url: "",
          src: "Internet",
          audio: audioResource,
        };
        client.emit('trackStart', bridge.guild, utilities.channel, utilities.nowPlaying);
        break;

      case `At End Of Queue`:
        utilities.addToQueue(utilities.queue.length, {
          file: url,
          name: url,
          author: "",
          url: "",
          src: "Internet",
          audio: audioResource,
        });
        break;

      case `At Start Of Queue`:
        utilities.addToQueue(0, {
          file: url,
          name: url,
          author: "",
          url: "",
          src: "Internet",
          audio: audioResource,
        });
        break;

      case `At Custom Position`:
        utilities.addToQueue(Number(bridge.transf(values.queuePosition)), {
          file: url,
          name: url,
          author: "",
          url: "",
          src: "Internet",
          audio: audioResource,
        });
        break;
    }
  },
};
