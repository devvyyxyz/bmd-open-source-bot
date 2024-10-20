const generatePoToken = require('./generatePoToken');

module.exports = {
  data: {
    name: "Play YouTube Song",
  },
  category: "Music",
  UI: [
    {
      element: "input",
      name: "URL",
      placeholder: "YouTube Video URL",
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
    "-",
    {
      element: "toggle",
      storeAs: "tokenGeneration",
      name: "Token Generation (Slower, Fewer Cutoffs)"
    }
  ],
  subtitle: (values, constants) => {
    return `URL: ${values.url} - ${values.queuing}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const { Innertube, ClientType } = require('youtubei.js');
    const search = require('yt-search');
    const { createAudioResource } = require('@discordjs/voice');

    let additionalOptions = {};
    if (values.tokenGeneration) {
      let clientData = await bridge.getGlobal({
        class: "music",
        name: "data"
      });
      if (!clientData || clientData.uses > 3) {
        clientData = await generatePoToken.run({
          store: { value: "", type: "temporary" }
        }, message, client, bridge);
        bridge.createGlobal({
          class: "music",
          name: "data",
          value: {
            uses: 1,
            ...clientData
          }
        });


      } else {
        clientData.uses++
      }
      additionalOptions = {
        po_token: clientData.po,
        visitor_id: clientData.vd
      }
    }
    const youtube = await Innertube.create({
      generate_session_locally: true,
      ...additionalOptions
    });

    const result = await search(bridge.transf(values.url));

    let clientType = values.tokenGeneration ? "IOS" : "WEB";
    const videoInfo = await youtube.getInfo(result.videos[0].videoId, clientType);

    const format = videoInfo.chooseFormat({ type: 'audio' });
    const url = format?.decipher(youtube.session.player);

    const audio = createAudioResource(url);

    let utilities = bridge.getGlobal({
      class: "voice",
      name: bridge.guild.id,
    });


    switch (values.queuing) {
      case `Don't Queue, Just Play`:
        utilities.player.play(audio);
        utilities.nowPlaying = {
          file: null,
          name: result.videos[0].title,
          author: result.videos[0].author.name,
          url: bridge.transf(values.url),
          src: "YouTube",
          audio,
          raw: result.videos[0],
          playURL: url
        };
        client.emit('trackStart', bridge.guild, utilities.channel, utilities.nowPlaying);
        break;

      case `At End Of Queue`:
        utilities.addToQueue(utilities.queue.length, {
          file: null,
          name: result.videos[0].title,
          author: result.videos[0].author.name,
          url: bridge.transf(values.url),
          src: "YouTube",
          audio: audio,
          raw: result.videos[0]
        });
        break;

      case `At Start Of Queue`:
        utilities.addToQueue(0, {
          file: null,
          name: result.videos[0].title,
          author: result.videos[0].author.name,
          url: bridge.transf(values.url),
          src: "YouTube",
          audio: audio,
          raw: result.videos[0]
        });
        break;

      case `At Custom Position`:
        utilities.addToQueue(Number(bridge.transf(values.queuePosition)), {
          file: null,
          name: result.videos[0].title,
          author: result.videos[0].author.name,
          url: bridge.transf(values.url),
          src: "YouTube",
          audio: audio,
          raw: result.videos[0]
        });
        break;
    }
  },
};
