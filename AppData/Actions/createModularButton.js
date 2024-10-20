const { ComponentTypes, ButtonStyles } = require('oceanic.js');

module.exports = {
  category: "Modularity",
  data: { name: "Create Modular Button", stopAwaitingAfter: "60" },
  UI: [
    {
      element: "input",
      name: "Label",
      storeAs: "label",
      max: 32
    },
    "-",
    {
      element: "text",
      text: "Button Style"
    },
    {
      element: "dropdown",
      choices: [{ name: "Default" }, { name: "Success" }, { name: "Danger" }, { name: "Neutral" }],
      storeAs: "color",
    },
    { element: "toggle", name: "Disable This Button", storeAs: "disabled" },
    "-",
    {
      element: "dropdown",
      storeAs: "type",
      extraField: "stopAwaitingAfter",
      name: "Validity",
      choices: [
        { name: "Temporary (Seconds)", field: true },
        { name: "Persistent" }
      ]
    },
    "-",
    {
      element: "inputGroup",
      nameSchemes: ["Emoji Name <span style='opacity: 50%;'>Optional</span>", "Emoji ID <span style='opacity: 50%;'>Optional</span>"],
      storeAs: ["emojiName", "emojiID"],
      placeholder: ["Can Also Be An Emoji", ""]
    },
    {
      element: "toggle",
      name: "Make The Emoji Animated",
      storeAs: "isEmojiAnimated"
    },
    "-",
    {
      element: "dropdown",
      name: "Custom ID",
      choices: [
        {
          name: "Auto Generated"
        },
        {
          name: "Custom",
          field: true
        }
      ],
      storeAs: "customID",
      extraField: "id"
    },
    "-",
    {
      element: "store",
      storeAs: "storeInteractionAs",
      name: "Store This Button's Interaction As"
    },
    "-",
    {
      element: "actions",
      storeAs: "actions",
      name: "When Pressed, Run"
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: (data, constants) => {
    return `Store As: ${constants.variable(data.store)}`
  },

  init: (values, bridge) => {
    if (values.type == 'Persistent') {
      bridge.interactionHandlers[ComponentTypes.BUTTON][values.customID == 'Custom' ? values.id : `${thisID}`] = { actions: values.actions, interactionStorage: values.storeInteractionAs }
    }
  },

  run(values, message, client, bridge) {
    const thisID = `${bridge.data.id}`;
    let style;
    switch (values.color) {
      case "Default":
        style = ButtonStyles.PRIMARY;
        break;
      case "Success":
        style = ButtonStyles.SUCCESS;
        break;
      case "Danger":
        style = ButtonStyles.DANGER;
        break;
      case "Neutral":
        style = ButtonStyles.SECONDARY;
        break;
    }

    let emoji = {
      name: null,
      id: null
    }

    if (values.emojiName && values.emojiName.trim() != '') {
      emoji.name = bridge.transf(values.emojiName)

      if (values.emojiID.trim() != '') {
        emoji.id = bridge.transf(values.emojiID)
      }

      emoji.animated = values.isEmojiAnimated
    }

    bridge.store(values.store, {
      raw: {
        type: ComponentTypes.BUTTON,
        label: bridge.transf(values.label),
        style: style,
        disabled: values.disabled == true,
        emoji: emoji.name == null ? undefined : emoji,
        customID: values.customID == 'Custom' ? bridge.transf(values.id) : thisID
      },
      run: (message) => {
        if (values.type == 'Temporary (Seconds)') {
          bridge.data.interactionHandlers[`${message.id}`][values.customID == 'Custom' ? bridge.transf(values.id) : thisID] = {
            onInteract: values.actions,
            storeInteractionAs: values.storeInteractionAs,
            run: (interaction) => {
              bridge.createTemporary({ class: "interactionStuff", name: "current", value: interaction });
              bridge.store(values.storeInteractionAs, interaction);
              bridge.runner(values.actions);
            }
          }
        }
      }
    });
  },
};