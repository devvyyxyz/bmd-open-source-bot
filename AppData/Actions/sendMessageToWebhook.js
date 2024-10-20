const { Message, Webhook } = require("oceanic.js");

module.exports = {
  data: {
    name: "Send Message To Webhook",
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
      element: "var",
      storeAs: "message",
      name: "Message"
    },
    "-",
    {
      element: "inputGroup",
      nameSchemes: ["Webhook Name", "Webhook Avatar URL"],
      storeAs: ["webhookName", "webhookAvatarURL"],
      placeholder: ["Optional", "Optional"]
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],
  
  subtitle: (data, constants) => {
    return `Webhook: ${constants.variable(data.webhook)} - Message: ${constants.variable(data.message)} - Store As: ${constants.variable(data.store)}`
  },

  async run(values, msg, client, bridge) {
    /**
     * @type {Webhook}
     */
    let webhook = await bridge.get(values.webhook)
    
    /**
     * @type {Message}
     */
    let message = bridge.get(values.message);

    if (values.webhookName) {
      message.username = bridge.transf(values.webhookName)
    }
    if (values.webhookAvatarURL) {
      message.avatarURL = bridge.transf(values.webhookAvatarURL)
    }

    let executedMessage = webhook.execute(message);

    await message.prepare(executedMessage)

    bridge.store(values.store, executedMessage)
  },
};