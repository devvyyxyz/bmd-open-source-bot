module.exports = {
  data: { name: "Control Variable" },
  category: "Variables",
  UI: [
    {
      element: "variableInsertion",
      name: "Variable",
      storeAs: "variable",
    },
    "-",
    {
      element: "dropdown",
      storeAs: "control",
      extraField: "value",
      name: "Action",
      choices: [
        {
          name: "Add To Value",
          field: true,
          placeholder: "Value To Add"
        },
        {
          name: "Set Value",
          field: true,
          placeholder: "New Value"
        }
      ]
    }
  ],

  subtitle: (data, constants) => {
    return `${data.control} (${data.value || "Blank"}) of ${constants.variable(data.variable)}`
  },

  async run(values, interaction, client, bridge) {
    let variable = bridge.get(values.variable);
    let originalVariable = bridge.get(values.variable);

    if (values.control == 'Add To Value') {
      if (Number(variable) != NaN && Number(bridge.transf(values.value)) != NaN && (Number(variable) + Number(bridge.transf(values.value))) != NaN) {
        variable = Number(variable) + Number(bridge.transf(values.value));
      } else {
        variable = `${variable}${bridge.transf(values.value)}`
      }
    } else {
      variable = bridge.transf(values.value)
    }

    if (variable == NaN) {
      originalVariable = `${originalVariable}${bridge.transf(values.value)}`
    }

    bridge.store(values.variable, variable)
  },
};