module.exports = {
  data: { name: "Delete Server Data", source: { type: "string", value: "" } },
  category: "Server Data",
  UI: [
    {
      element: "guild",
      storeAs: "guild"
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
    return `${values.deleteType}`
  },
  async run(values, message, client, bridge) {
    let guild = await bridge.getGuild(values.guild);

    var storedData = bridge.data.IO.get();

    if (values.deleteType == 'All Data') {
      delete storedData.guilds[guild.id];
    } else {
      delete storedData.guilds[guild.id][bridge.transf(values.delete)];
    }

    bridge.data.IO.write(storedData);
  },
};