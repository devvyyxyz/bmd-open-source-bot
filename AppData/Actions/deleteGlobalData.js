module.exports = {
  data: { name: "Delete Global Data", source: { type: "string", value: "" } },
  category: "Global Data",
  UI: [
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
    return `${values.deleteType}`
  },
  async run(values, message, client, bridge) {
    var storedData = bridge.data.IO.get();

    if (values.deleteType == 'All Data') {
      delete storedData.lists;
    } else {
      delete storedData.lists[bridge.transf(values.delete)];
    }

    bridge.data.IO.write(storedData);
  },
};