module.exports = {
  category: "Messages",
  data: {
    name: "Get Mentioned Channel",
    message: {type: "commandMessage", value: ""}
  },
  UI: [
    {
      element: "message",
      name: "Message",
      storeAs: "message"
    },
    "-",
    {
      element: "halfDropdown",
      name: "Mention #",
      storeAs: "mention",
      extraField: "position",
      choices: [
        {
          name: "First"
        },
        {
          name: "Second"
        },
        {
          name: "Third"
        },
        {
          name: "Custom",
          field: true
        }
      ]
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `Message: ${constants.message(values.message)} - ${values.mention} Mention - Store As: ${constants.variable(values.store)}`
  },
  async run(values, message, client, bridge) {
    let msg = await bridge.getMessage(values.message);
    
    let mentions = msg.mentions.channels;
    let mention;
    switch (values.mention) {
      case "First":
        mention = mentions[0];
        break;
      case "Second":
        mention = mentions[1];
        break;
      case "Third":
        mention = mentions[2];
        break;
      case "Custom":
        mention =
          mentions[
            parseFloat(
              varTools.transf(values.position, bridge.variables),
            )
          ];
        break;
    }

    mention = client.getChannel(mention);

    bridge.store(values.store, mention)
  },
};
