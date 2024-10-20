module.exports = {
  category: "Channels",
  data: {
    name: "Join Voice Channel",
  },
  UI: [
    {
      element: "channel",
      storeAs: "channel",
      excludeUsers: true
    },
  ],
  subtitle: (values, constants) => {
    return `${constants.channel(values.channel)}`
  },
  async run(values, message, client, bridge) {
    let channel = await bridge.getChannel(values.channel);

    try {
      let member = bridge.guild.members.get(client.application.id) || (await client.rest.users.get(client.application.id));
      const res = member.voiceState;
      if (res?.channelID == channel.id && bridge.getGlobal({ class: "voice", name: bridge.guild.id })) {
        return
      }
    } catch (err) {
      console.log(err)
    }

    let connection = client.joinVoiceChannel({
      channelID: channel.id,
      guildID: channel.guild.id,
      voiceAdapterCreator: channel.guild.voiceAdapterCreator
    });


    const { VoiceConnectionStatus, AudioPlayerStatus, createAudioPlayer, createAudioResource } = require("@discordjs/voice");

    const player = createAudioPlayer();
    connection.subscribe(player);


    bridge.createGlobal({
      class: "voice",
      name: bridge.guild.id,
      value: {
        connection,
        player,
        channel,
        queue: [],
        nowPlaying: {},
        startedAt: new Date().getTime(),
        addToQueue: (at, track) => {
          voiceStuff.queue.splice(at === undefined ? 0 : Number(at), 0, track);

          if (player.state.status == 'idle') {
            client.emit('queueSongAdd', bridge.guild, channel, track);

            player.play(track.audio);
              voiceStuff.nowPlaying = track;
              voiceStuff.queue.splice(0, 1);
              client.emit('trackStart', bridge.guild, channel, voiceStuff.queue[0]);
          }
        }
      }
    });

    let voiceStuff = bridge.getGlobal({ name: bridge.guild.id, class: "voice" });

    let errorHandler = (error) => {
      console.log('Error occurred while playing music, skipping forwards.', error);
      if (voiceStuff.queue.length != 0) {
        player.play(voiceStuff.queue[0].audio);
        
        voiceStuff.queue[0]
        voiceStuff.nowPlaying = voiceStuff.queue[0];
        voiceStuff.queue.splice(0, 1);
        client.emit('trackStart', bridge.guild, channel, voiceStuff.queue[0]);
      } else {
        client.emit('queueEnd', bridge.guild, channel)
      }
    }

    player.on('stateChange', (oldStatus, newStatus) => {
      if (newStatus.status == 'idle' && !voiceStuff.forgiveIdling) {
        client.emit('trackEnd', bridge.guild, channel);
        if (voiceStuff.queue.length != 0) {
          voiceStuff.nowPlaying = {}
          player.play(voiceStuff.queue[0].audio);
          client.emit('trackStart', bridge.guild, channel, voiceStuff.queue[0]);
          voiceStuff.nowPlaying = voiceStuff.queue[0];
          voiceStuff.queue.splice(0, 1);
        } else {
          client.emit('trackEnd', bridge.guild, channel);
          client.emit('queueEnd', bridge.guild, channel);
          voiceStuff.nowPlaying = {}
        }
      } else {
        voiceStuff.forgiveIdling = false;
      }
    });

    player.on('error', errorHandler)
  },
};
