module.exports = {
  category: "Modularity",
  data: { name: "Send Modular Message To Channel" },
  UI: [
    {
      element: "var",
      storeAs: "message",
      name: "Modular Message"
    },
    "-",
    {
      element: "channel",
      storeAs: "channel",
      name: "Send To"
    },
    "-",
    {
      element: "toggle",
      storeAs: "mentions",
      name: "Allow Mentions"
    },
    "-",
    {
      element: "menu",
      max: 1,
      required: true,
      storeAs: "options",
      types: {
        options: "Options"
      },
      UItypes: {
        options: {
          name: "Options",
          inheritData: true,
          UI: [
            {
              element: "message",
              optional: true,
              storeAs: "updateMessage",
              name: "Message To Update"
            },
            "_",
            {
              element: "toggleGroup",
              storeAs: ["updateContent", "updateComponents"],
              nameSchemes: ["Don't Update Content", "Don't Update Components"]
            },
            "_",
            {
              element: "toggleGroup",
              storeAs: ["updateEmbeds", "updateAttachments"],
              nameSchemes: ["Don't Update Embeds", "Don't Update Attachments"]
            }
          ]
        }
      }
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    },
  ],

  subtitle: (data, constants) => {
    return `Store As: ${constants.variable(data.store)}`
  },

  async run(values, _msg, client, bridge) {
    let channel = await bridge.getChannel(values.channel);
    let message = bridge.get(values.message);
    
    message.raw.allowedMentions = {
      everyone: values.mentions || false,
      repliedUser: values.mentions || false,
      roles: values.mentions || false,
      users: values.mentions || false
    }

    let messageToUpdate = values.updateMessage ? await bridge.getMessage(values.updateMessage) : undefined;
    if (messageToUpdate) {
      async function finishOff(msg) {
        bridge.store(values.storeAs, msg);
  
        if (values.updateComponents) return
        bridge.data.interactionHandlers[msg.id] = {}
        message.components?.forEach(component => {
          component.run(msg);
        });
      }

      let parameters = {};

      if (!values.updateContent) {
        parameters.content = message.raw.content;
      }
      if (!values.updateEmbeds) {
        parameters.embeds = message.raw.embeds;
      }
      if (!values.updateComponents) {
        parameters.components = message.raw.components;
      }
      if (!values.updateAttachments) {
        parameters.attachments = message.raw.attachments;
      }

      messageToUpdate.edit(parameters).then(msg => {
        finishOff(msg);
      })
    } else {
      let msg = await channel.createMessage(message.raw);
      bridge.store(values.store, msg);
  
      bridge.data.interactionHandlers[msg.id] = {}
  
      message.components.forEach(component => {
        component.run(msg);
      });
    }

    
  },
};