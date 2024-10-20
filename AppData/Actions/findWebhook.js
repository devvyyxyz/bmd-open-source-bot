const { Message, Webhook, Guild } = require("oceanic.js");

module.exports = {
  data: {
    name: "Find Webhook",
  },
  category: "Webhooks",
  UI: [
    {
      element: "dropdown",
      storeAs: "searchType",
      extraField: "query",
      name: "Find By",
      choices: [
        { name: "ID", field: true },
        { name: "Name", field: true },
        { name: "Token", field: true },
        { name: "URL", field: true },
      ]
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],
  
  subtitle: (data, constants) => {
    return `Store As: ${constants.variable(data.store)}`
  },

  async run(values, msg, client, bridge) {
    /**
     * @type {Guild}
     */
    let guild = bridge.guild;
    let webhooks = await guild.getWebhooks();
    let query = bridge.transf(values.query);
    
    webhooks.forEach(webhook => {
      if (webhook[values.searchType.toLowerCase()] == query) {
        bridge.store(values.store, webhook)
      }
    })
  },
};