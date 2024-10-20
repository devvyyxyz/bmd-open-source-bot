module.exports = {
  category: "Member Data",
  data: { name: "Delete Member Data", source: { type: "string", value: "" } },
  UI: [
    {
      element: "memberInput",
      storeAs: "member",
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
    return `Member: ${constants.member(values.member)} - ${values.deleteType}`
  },
  async run(values, message, client, bridge) {
    var storedData = bridge.data.IO.get();

    let member = await bridge.getUser(values.member);

    if (values.deleteType == 'All Data') {
      delete storedData.members[`${member.member.guild.id}${member.id}`];
    } else {
      delete storedData.members[`${member.member.guild.id}${member.id}`][bridge.transf(values.delete)];
    }

    bridge.data.IO.write(storedData);
  },
};