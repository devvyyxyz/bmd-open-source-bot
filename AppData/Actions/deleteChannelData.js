module.exports = {
  data: { name: "Delete Channel Data", source: { type: "string", value: "" } },
  category: "Channel Data",
  UI: [
    {
      element: "channelInput",
      storeAs: "channel",
    },
    "-",
    {
      element: "dropdown",
      storeAs: "deleteType",
      extraField: "delete",
      name: "Delete Type",
      choices: [
        { name: "All Data" },
        { name: "Specific Data", placeholder: "Data Name", field: true },
      ]
    },
  ],
  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `Channel: ${constants.channel(values.channel)} - ${values.deleteType}`
  },
  async run(values, message, client, bridge) {
    var storedData = bridge.data.IO.get();

    let channel = await bridge.getChannel(values.channel);

    if (values.deleteType == 'All Data') {
      delete storedData.channels[channel.id];
    } else {
      delete storedData.channels[channel.id][bridge.transf(values.delete)];
    }

    bridge.data.IO.write(storedData);
  },
};