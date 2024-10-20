module.exports = {
  category: "Channels",
  data: {
    name: "Get Forum Channel Info",
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
        topic: { name: "Rules" },
        id: { name: "ID" },
        guild: { name: "Server" },
        category: { name: "Category" },
        createdAt: { name: "Creation Timestamp" },
        nsfw: { name: "Is NSFW?" },
        slowmode: { name: "Slowmode (Seconds)" },
        position: { name: "Position" },
        webhooks: { name: "Webhook List" },
        rateLimitPerUser: { name: "Default Thread Slowmode (Seconds)" },
        defaultThreadRateLimitPerUser: { name: "Post Slowmode (Seconds)" },
        availableTags: { name: "Forum Tags List" }
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
      }
    } else {
      output = channel[values.get.type]
    }

    bridge.store(values.store, output)
  },
};