const { TextableChannel } = require("oceanic.js");

module.exports = {
  data: {
    name: "Create Webhook",
    avatar: {type: "none", value: ""}
  },
  category: "Webhooks",
  UI: [
    {
      element: "channel",
      excludeUsers: true,
      storeAs: "channel"
    },
    "-",
    {
      element: "input",
      storeAs: "webhookName",
      name: "Name"
    },
    "_",
    {
      element: "image",
      name: "Avatar Image",
      also: {none: "None"},
      and: {none: false},
      storeAs: "avatar"
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],
  subtitle: (data, constants) => {
    return `Channel: ${constants.channel(data.channel)} - Name: ${data.name} - Store As: ${constants.variable(data.store)}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    /**
     * @type {TextableChannel}
     */
    let channel = await bridge.getChannel(values.channel);
    let avatar = null;

    if (values.avatar.type != 'none') {
      avatar = await bridge.getImage(values.avatar)
    }

    let webhook = await channel.createWebhook({
      avatar,
      name: bridge.transf(values.webhookName)
    });

    bridge.store(values.store, webhook)
  },
};
