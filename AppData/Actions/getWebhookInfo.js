const { Message, Webhook, Client } = require("oceanic.js");

module.exports = {
  data: {
    name: "Get Webhook Info",
  },
  category: "Webhooks",
  UI: [
    {
      element: "var",
      name: "Webhook",
      storeAs: "webhook"
    },
    "-",
    {
      element: "dropdown",
      name: "Get",
      storeAs: "get",
      choices: [
        { name: "Name" },
        { name: "URL" },
        { name: "Avatar URL" },
        { name: "ID" },
        { name: "Channel" },
        { name: "Guild" },
        { name: "Token" },
        { name: "Author" },
        { name: "Created At Timestamp" },
      ]
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: (values, constants) => {
    return `${values.get} of ${constants.variable(values.webhook)} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, msg, client, bridge) {
    /**
 * @type {Webhook}
 */
    let webhook = await bridge.get(values.webhook);
    let result;
    switch (values.get) {
      case 'Name':
        result = webhook.name;
        break
      case 'URL':
        result = webhook.url;
        break
      case 'Avatar URL':
        result = webhook.avatarURL();
        break
      case 'ID':
        result = webhook.id;
        break
      case 'Channel':
        result = webhook.channel;
        break
      case 'Guild':
        try {
        result = webhook.guild;
          if (!result) {
            result = await client.rest.guilds.get(webhook.guildID)
          }
        } catch (err) {
          result = await client.rest.guilds.get(webhook.guildID)
        }
        break
      case 'Token':
        result = webhook.token;
        break
      case 'Author':
        result = webhook.user;
        break
      case 'Created At Timestamp':
        result = webhook.createdAt.getTime();
        break
    }

    bridge.store(values.store, result)
  },
};