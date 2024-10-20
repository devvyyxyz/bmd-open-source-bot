module.exports = {
  data: { name: "Control Server Data", source: { type: "string", value: "" } },
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
      element: "dropdown",
      name: "Control",
      storeAs: "control",
      extraField: "controlValue",
      choices: [
        {name: "Add To Value", placeholder: "Value To Add", field: true},
        {name: "Overwrite", placeholder: "New Value", field: true},
      ]
    }
  ],
  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `Data Name: ${values.dataName} - ${values.control} (${values.controlValue})`
  },
  async run(values, message, client, bridge) {
    var storedData = bridge.data.IO.get();

    let type = 'guilds'

    let guild = await bridge.getGuild(values.guild);
    let id = guild.id;

    let currentData = '';

    if (!storedData[type][id]) {
      storedData[type][id] = {};
    }

    let dataName = bridge.transf(values.dataName);

    if (storedData[type][id][dataName]) {
      currentData = storedData[type][id][dataName]
    }
    
    if (values.control == 'Add To Value') {
      if (parseFloat(currentData) != NaN && parseFloat(bridge.transf(values.controlValue)) != NaN && currentData && values.controlValue) {
        currentData = Number(currentData) + Number(bridge.transf(values.controlValue))
      } else {
        currentData = `${currentData}${bridge.transf(values.controlValue)}`
      }
    } else {
      currentData = bridge.transf(values.controlValue)
    }

    storedData[type][id][dataName] = currentData;
    bridge.data.IO.write(storedData);
  },
};