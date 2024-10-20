module.exports = {
  category: "Channels",
  data: {
    name: "Get Voice Channel Info",
  },
  UI: [
    {
      element: "channel",
      storeAs: "channel",
      excludeUsers: true
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "get",
      name: "Get",
      choices: {
        name: { name: "Name" },
        status: { name: "Status" },
        topic: { name: "Topic" },
        id: { name: "ID" },
        guild: { name: "Server" },
        parent: { name: "Category" },
        createdAt: { name: "Creation Timestamp" },
        nsfw: { name: "Is NSFW?" },
        slowmode: { name: "Slowmode (Seconds)" },
        position: { name: "Position" },
        webhooks: { name: "Webhooks" },
        members: { name: "Connected Members" }
      },
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],
  compatibility: ["Any"],
  
  subtitle: (values, constants, thisAction) => {
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.channel(values.channel)} - Store As: ${constants.variable(values.store)}`
  },
  
  async run(values, message, client, bridge) {
    let channel = await bridge.getChannel(values.channel)

    let output;
    let specificOutputs = ["createdAt", "webhooks", "members"];
    if (specificOutputs.includes(values.get.type)) {
      switch (values.get.type) {
        case 'createdAt':
          output = channel.createdAt.getTime();
          break
        case 'webhooks':
          output = await channel.getWebhooks();
          break
        case 'members':
          let ids = bridge.guild.voiceStates.filter(state => state.channelID == channel.id).map(state => state.userID);
          output = [];

          for (let i in ids) {
            let user = await bridge.getUser({ type: "id", value: ids[i] });
            output.push(user);
          }
        break
      }
    } else {
      output = channel[values.get.type]
    }

    bridge.store(values.store, output)
  },
};