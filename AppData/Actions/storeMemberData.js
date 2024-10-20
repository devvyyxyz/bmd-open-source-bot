module.exports = {
  data: { name: "Store Member Data", source: { type: "string", value: "" } },
  category: "Member Data",
  UI: [
    {
      element: "userInput",
      storeAs: "user",
      name: "Member"
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
    return `Member: ${constants.user(values.user)} - Data Name: ${values.dataName} - New Value: ${newValue}`
  },
  async run(values, message, client, bridge) {
    var storedData = bridge.data.IO.get();

    let user = await bridge.getUser(values.user);
    let member = await user.member;
    let id = `${member.guild.id}${member.id}`
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

    if (!storedData.members[id]) {
      storedData.members[id] = {};
    }

    storedData.members[id][bridge.transf(values.dataName)] = dataOverwrite
    bridge.data.IO.write(storedData);
  },
};