module.exports = {
  data: {
    name: "Show Modal"
  },
  category: "Interactions",
  UI: [
    {
      element: "interaction",
      storeAs: "interaction"
    },
    "_",
    {
      element: "toggle",
      storeAs: "replyToInteraction",
      name: "If Possible, Show To The Current Interaction"
    },
    "-",
    {
      element: "input",
      storeAs: "title",
      name: "Title"
    },
    "-",
    {
      element: "menu",
      max: 5,
      name: "Modal Elements",
      storeAs: "modalComponents",
      types: {
        input: "Input"
      },
      UItypes: {
        input: {
          pullVariables: true,
          data: {label: ""},
          name: "Modal Input",
          preview: "`Label: ${option.data.label}`",
          UI: [
            {
              element: "dropdown",
              storeAs: "style",
              name: "Style",
              choices: [
                {
                  name: "Input"
                },
                {
                  name: "Paragraph"
                }
              ]
            },
            "-",
            {
              element: "input",
              name: "Label",
              storeAs: "label"
            },
            "_",
            {
              element: "input",
              storeAs: "value",
              name: "Pre-Defined Value",
              placeholder: "Optional"
            },
            "_",
            {
              element: "input",
              name: "Placeholder",
              storeAs: "placeholder",
              placeholder: "Optional"
            },
            "-",
            {
              element: "input",
              type: "number",
              name: "Minimum Length",
              storeAs: "min",
              placeholder: "Optional"
            },
            "_",
            {
              element: "input",
              type: "number",
              name: "Maximum Length",
              storeAs: "max",
              placeholder: "Optional"
            },
            "-",
            {
              element: "toggle",
              name: "Required?",
              storeAs: "required"
            },
            "-",
            {
              element: "store",
              storeAs: "store",
              name: "Store Value As"
            },
          ]
        }
      }
    },
    "-",
    {
      name: "Once Submit, Run",
      element: "actions",
      storeAs: "actions"
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Modal Interaction As"
    }
  ],


  compatibility: ["Any"],
  subtitle: (data, constants) => {
    return `${data.modalComponents.length} Inputs`
  },

  async run(values, message, client, bridge) {
    var inter;

    let storageLinks = {};

    let components = [];

    for (let inputIndex in values.modalComponents) {
      let input = values.modalComponents[inputIndex].data;

      storageLinks[inputIndex] = input.store

      let componentData = {
        type: 1,
        components: [{
          customID: inputIndex,
          label: bridge.transf(input.label),
          placeholder: bridge.transf(input.placeholder),
          minLength: `${input.min}`.trim() != '' ? parseFloat(bridge.transf(input.min)) : 0,
          maxLength: `${input.max}`.trim() != '' ? parseFloat(bridge.transf(input.max)) : 4000,
          required: input.required,
          style: input.style == 'Input' ? 1 : 2,
          type: 4,
        }]
      }

      if (input.value.trim() != '') {
        componentData.components[0].value = bridge.transf(input.value.trim())
      }

      components.push(componentData);
    }

    let replyInteraction = bridge.getTemporary({class: "interactionStuff", name: "current"});
    if (values.replyToInteraction && replyInteraction?.getOriginal) {
      inter = replyInteraction
    } else {
      inter = await bridge.getInteraction(values.interaction)
    }

    var modal = {
      title: bridge.transf(values.title),
      customID: inter.id,
      components
    }

    inter.createModal(modal);

    let handleModalSubmit = (interaction) => {
      if (interaction.type == 5 && interaction.data.customID == inter.id) {
        let rows = interaction.data.components.raw;

        for (let row in rows) {
          let input = rows[row].components[0];

          bridge.store(storageLinks[input.customID], input.value)
        }

        bridge.store(values.store, interaction);
        bridge.createTemporary({class: "interactionStuff", name: "current", value: interaction})


        bridge.runner(values.actions);

        client.off('interactionCreate', handleModalSubmit)
      }
    }

    client.on('interactionCreate', handleModalSubmit);

    setTimeout(() => {
      client.off('interactionCreate', handleModalSubmit)
    }, 3600000);
  },
};
