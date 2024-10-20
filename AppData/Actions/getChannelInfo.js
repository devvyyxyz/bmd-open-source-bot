module.exports = {
  category: "Channels",
  data: {
    name: "Get Channel Info",
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
        topic: { name: "Topic" },
        id: { name: "ID" },
        url: { name: "URL" },
        guild: { name: "Server" },
        messages: { name: "Messages" },
        parent: { name: "Category" },
        createdAt: { name: "Creation Timestamp" },
        nsfw: { name: "Is NSFW?" },
        slowmode: { name: "Slowmode (Seconds)" },
        position: { name: "Position" },
        type: { name: "Type" },
        webhooks: { name: "Webhook List" },
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
    let specificOutputs = ["createdAt", "webhooks", "type"];
    if (specificOutputs.includes(values.get.type)) {
      switch (values.get.type) {
        case 'createdAt':
          output = channel.createdAt.getTime();
          break
        case 'webhooks':
          output = await channel.getWebhooks();
          break
        case 'type':
          let channelTypes = {
            0: "Text",
            1: "Private",
            10: "Announcement Thread",
            11: "Public Thread",
            12: "Private Thread",
            13: "Stage",
            14: "Directory",
            15: "Forum",
            16: "Media",
            2: "Voice",
            3: "Group",
            4: "Category",
            5: "Annoncement",
          }
          output = channelTypes[channel.type] || "Unknown"
          break
        case 'messages':
          output = await channel.getMessages({ limit: 1000 });
          break
        case 'url':
          if (channel.guildID) {
            output = `https://discord.com/channels/${channel.guildID}/${channel.id}`
          } else {
            output = `https://discord.com/channels/@me/${channel.id}`
          }
      }
    } else {
      output = channel[values.get.type]
    }

    bridge.store(values.store, output)
  },
};