module.exports = {
  data: { name: "Store Channel Data", source: { type: "string", value: "" } },
  category: "Channel Data",
  UI: [
    {
      element: "channelInput",
      storeAs: "channel",
    },
    "-",
    {
      element: "input",
      storeAs: "dataName",
      name: "Data Name",
      placeholder: "Key",
    },
    "_",
    {
      element: "var",
      storeAs: "source",
      name: "New Value",
      also: {
        string: "Text",
      },
    },
  ],
  compatibility: ["Any"],
  subtitle: (values, constants) => {
    let newValue = values.source;
    if (newValue.type == 'string') {
      newValue = newValue.value;
    } else {
      newValue = constants.variable(newValue);
    }
    return `Channel: ${constants.channel(values.channel)} - Data Name: ${values.dataName} - New Value: ${newValue}`
  },
  async run(values, message, client, bridge) {
    var storedData = bridge.data.IO.get();

    let channel = await bridge.getChannel(values.channel);

    let dataOverwrite;

    if (!values.source) {
      dataOverwrite = bridge.transf(values.dataValue);
    } else {
      if (values.source.type == "string") {
        dataOverwrite = bridge.transf(values.source.value);
      } else {
        dataOverwrite = bridge.get(values.source);
      }
    }

    if (!storedData.channels[channel.id]) {
      storedData.channels[channel.id] = {};
    }

    storedData.channels[channel.id][bridge.transf(values.dataName)] = dataOverwrite;
    bridge.data.IO.write(storedData);
  },
};
