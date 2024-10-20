const { Message, Webhook } = require("oceanic.js");

module.exports = {
  data: {
    name: "Delete Webhook",
  },
  category: "Webhooks",
  UI: [
    {
      element: "var",
      name: "Webhook",
      storeAs: "webhook"
    }
  ],
  
  subtitle: (data, constants) => {
    return `Webhook: ${constants.variable(data.webhook)}`
  },

  async run(values, msg, client, bridge) {
    let webhook = await bridge.get(values.webhook);
    await webhook.delete();
  },
};