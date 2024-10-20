const { Interaction, InteractionTypes } = require("oceanic.js");

module.exports = {
  data: {name: "Get Interaction Info"},
  category: "Interactions",
  UI: [
    {
      element: "interaction",
      storeAs: "interaction",
    },
    "_",
    {
      element: "toggle",
      storeAs: "replyToInteraction",
      name: "If Possible, Use The Current Interaction"
    },
    "-",
    {
      element: "typedDropdown",
      name: "Get",
      storeAs: "get",
      choices: {
        name: { name: "Name" },
        user: { name: "Author" },
        id: { name: "ID" },
        message: { name: "Message" },
        createdAt: { name: "Creation Timestamp" },
        type: { name: "Type" }
      }
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  compatibility: ["Any"],

  subtitle: (values, constants, thisAction) => {
    if (values.replyToInteraction) {
      return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of Current Interaction - Store As: ${constants.variable(values.store)}`
    }
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.interaction(values.interaction)} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, message, client, bridge) {
    /**
     * @type {Interaction}
     */
    var interaction = await bridge.getInteraction(values.interaction)
    
    let replyInteraction = bridge.getTemporary({class: "interactionStuff", name: "current"});
    if (values.replyToInteraction && replyInteraction?.getOriginal) {
      interaction = replyInteraction;
    }

    let output;

    switch (values.get.type) {
      case 'createdAt':
        output = interaction.createdAt.getTime();
        break
      case 'name':
        output = (interaction.data.name || interaction.name);
        break
      case 'type':
        let typeMap = {
          [InteractionTypes.APPLICATION_COMMAND]: "Command",
          [InteractionTypes.MESSAGE_COMPONENT]: "Message Component",
          [InteractionTypes.MODAL_SUBMIT]: "Modal Submit",
          [InteractionTypes.PING]: "Ping",
        }
        output = typeMap[interaction.type];
        break
      default:
        output = interaction[values.get.type];
        break
      }
    
    bridge.store(values.store, output)
  },
};
