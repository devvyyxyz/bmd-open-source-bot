module.exports = {
  data: {
    name: "Get Argument",
  },
  category: "Text",
  UI: [
    {
      element: "dropdown",
      storeAs: "source",
      name: "Text Source",
      extraField: "text",
      choices: [
        {
          name: "Command Message"
        },
        {
          name: "Text",
          field: true
        }
      ]
    },
    "-",
    {
      element: "input",
      storeAs: "startAt",
      name: "Start At Argument #",
    },
    "-",
    {
      element: "halfDropdown",
      storeAs: "endAt",
      extraField: "at",
      name: "End At",
      choices: [
        {
          name: "None"
        },
        {
          name: "End"
        },
        {
          name: "Argument #",
          field: true
        }
      ]
    },
    "-",
    {
      element: "storageInput",
      name: "Store As",
      storeAs: "store"
    }
  ],
  
  script: (data) => {
    if (data.type != 'text') {
      data.UI[0] = {
        element: "input",
        storeAs: "text",
        name: "Text"
      }
      data.data.source = 'Text'
    }

    data.updateUI()
  },

  subtitle: (data, constants) => {
    if (data.endAt == 'Argument #') {
      return `Starting At: ${data.startAt} to Argument #${data.at} - Store As: ${constants.variable(data.store)}`
    } else {
      return `Starting At: ${data.startAt} to ${data.endAt} - Store As: ${constants.variable(data.store)}`
    }
  },

    async run(values, message, client, bridge) {
    var output = "";

    let text;

    if (values.source == 'Command Message') {
      text = message.content
    } else {
      text = bridge.transf(values.text)
    }

    if (values.endAt == "None") {
      output = text.split(" ")[bridge.transf(values.startAt)];
    }

    if (values.endAt == "Argument #") {
      let argumentList = text.split(" ");
      var argumentsParsed = 0;
      for (let argument in argumentList) {
        if (argument >= bridge.transf(values.startAt)) {
          argumentsParsed++;

          if (argumentsParsed <= parseFloat(bridge.transf(values.at))) {
            output = `${output} ${argumentList[argument]}`;
          }
        }
      }
    }

    if (values.endAt == "End") {
      let firstIndex = parseFloat(bridge.transf(values.startAt))
      output = text.split(" ").splice(firstIndex).join(" ");
    }


    bridge.store(values.store, output)
  },
};
