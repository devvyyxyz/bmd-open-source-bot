module.exports = {
  data: {
    name: "Get Shard Info",
  },
  category: "Bot",
  UI: [
    {
      element: "typedDropdown",
      storeAs: "shard",
      name: "Shard",
      choices: {
        first: { name: 'First Shard' },
        custom: { name: 'Custom Shard #', field: true },
      }
    },
    "-",
    {
      element: "typedDropdown",
      name: "Get",
      storeAs: "get",
      choices: {
        id: { name: "ID" },
        sessionID: { name: "Session ID" },
        latency: { name: "Latency" },
        status: { name: "Status" }
      },
    },
    "-",
    {
      element: "store",
      storeAs: "store",
    },
  ],

  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} - Store As: ${constants.variable(values.store)}`
  },
  
  /**
   * @param {oceanic.Client} client
   * @returns {*}
   */
  async run(values, message, client, bridge) {
    const botData = require("../data.json");
    const oceanic = require("oceanic.js");
    let output;
    let shard;

    if (values.shard.type == 'first') {
      shard = 0;
    } else {
      shard = bridge.transf(values.shard.value)
    }

    let specificShard = client.shards.get(shard);

    bridge.store(values.store, specificShard[values.get.type]);
  },
};
