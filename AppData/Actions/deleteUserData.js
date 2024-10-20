module.exports = {
  data: { name: "Delete User Data", source: { type: "string", value: "" } },
  category: "User Data",
  UI: [
    {
      element: "userInput",
      storeAs: "user",
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
    return `User: ${constants.user(values.user)} - ${values.deleteType}`
  },
  async run(values, message, client, bridge) {
    var storedData = bridge.data.IO.get();

    let user = await bridge.getUser(values.user);

    if (values.deleteType == 'All Data') {
      delete storedData.users[user.id];
    } else {
      delete storedData.users[user.id][bridge.transf(values.delete)];
    }

    bridge.data.IO.write(storedData);
  },
};