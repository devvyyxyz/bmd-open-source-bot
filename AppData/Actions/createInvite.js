const { Guild, TextableChannel } = require("oceanic.js");

module.exports = {
  category: "Invites",
  data: {
    name: "Create Invite",
    targetChannel: {type: "", value: ""}
  },
  UI: [
    {
      element: "channel",
      storeAs: "channel",
      name: "Invite Channel",
    },
    "-",
    {
      element: "dropdown",
      storeAs: "expiration",
      name: "Invite Expiration Date",
      choices: [
        {name: "30 Minutes"},
        {name: "1 Hour"},
        {name: "6 Hours"},
        {name: "12 Hours"},
        {name: "1 Day"},
        {name: "7 Days"},
        {name: "Never"},
      ]
    },
    "-",
    {
      element: "dropdown",
      storeAs: "maxUses",
      extraField: "max",
      name: "Max Number Of Uses",
      choices: [
        {name: "Infinite"},
        {name: "Custom", field: true, placeholder: "1 To 100"},
      ]
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],
  subtitle: (data, constants) => {
    return `Channel: ${constants.channel(data.channel)} - Store As: ${constants.variable(data.store)}`
  },
  compatibility: ["Any"],
  async run(values, _message, client, bridge) {
    let invite = {}

    let expirationTimes = {
      "30 Minutes": 1800,
      "1 Hour": 3600,
      "6 Hours": 21600,
      "12 Hours": 43200,
      "1 Day": 86400,
      "7 Days": 604800
    }

    if (values.expiration != "Never") {
      invite.maxAge = expirationTimes[values.expiration]
    } else {
      invite.maxAge = 0;
    }

    if (values.maxUses == 'Custom') {
      let maxUses = bridge.transf(values.max);
      invite.maxUses = Number(maxUses);
    }

    
    /**
     * @type {TextableChannel}
     */
    let channel = await bridge.getChannel(values.channel);
    let endInvite = await channel.createInvite(invite);

    bridge.store(values.store, endInvite)
  },
};
