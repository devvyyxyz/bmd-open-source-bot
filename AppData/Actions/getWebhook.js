module.exports = {
  data: {
    name: "Get Webhook",
  },
  category: "Webhooks",
  UI: [
    {
      element: "input",
      storeAs: "id",
      name: "Webhook ID"
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
    let webhook = await client.rest.webhooks.get(bridge.transf(values.id));
    bridge.store(values.store, webhook)
  },
};