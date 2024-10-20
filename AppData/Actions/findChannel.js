const { Client } = require("oceanic.js");

module.exports = {
  category: "Channels",
  data: {
    name: "Find Channel",
  },
  UI: [
    {
      element: "dropdown",
      storeAs: "method",
      extraField: "value",
      name: "Find By",
      choices: [
        {
          name: "ID",
          field: true
        },
        {
          name: "Name",
          field: true
        },
        {
          name: "Position",
          field: true
        },
        {
          name: "Topic",
          field: true
        }
      ]
    },
    "-",
    {
      element: "storageInput",
      storeAs: "store"
    }
  ],

  subtitle: (values, constants) => {
    return `By ${values.method} (${values.value}) - Store As: ${constants.variable(values.store)}`
  },

  
  /**
   * Description placeholder
   *
   * @async
   * @param {*} values
   * @param {*} interaction
   * @param {Client} client
   * @param {*} bridge
   * @returns {*}
   */
  async run(values, interaction, client, bridge) {
    let channels = await bridge.guild.getChannels();

    let toMatch = bridge.transf(values.value);
    bridge.store(values.store, channels.find(channel => channel[values.method.toLowerCase()] == toMatch))
  },
};
