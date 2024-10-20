module.exports = {
  data: { name: "Control Global Data", source: { type: "string", value: "" } },
  category: "Global Data",
  UI: [
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

    let type = 'lists'

    let currentData = '';

    if (!storedData[type]) {
      storedData[type] = {};
    }

    let dataName = bridge.transf(values.dataName);

    if (storedData[type][dataName]) {
      currentData = storedData[type][dataName]
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

    storedData[type][dataName] = currentData;
    bridge.data.IO.write(storedData);
  },
};