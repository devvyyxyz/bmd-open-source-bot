module.exports = {
    data: { name: "Store Server Data", source: { type: "string", value: "" } },
    category: "Server Data",
    UI: [
      {
        element: "guild",
        storeAs: "guild"
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
      return `Guild: ${constants.guild(values.guild)} - Data Name: ${values.dataName} - New Value: ${newValue}`  
    },
    async run(values, message, client, bridge) {
      var storedData = bridge.data.IO.get();
    
      let guild = await bridge.getGuild(values.guild);

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
  
      if (!storedData.guilds[guild.id]) {
        storedData.guilds[guild.id] = {};
      }
  
      storedData.guilds[guild.id][bridge.transf(values.dataName)] = dataOverwrite
      bridge.data.IO.write(storedData);
    },
  };