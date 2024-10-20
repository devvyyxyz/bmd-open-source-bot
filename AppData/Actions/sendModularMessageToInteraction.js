module.exports = {
  category: "Modularity",
  data: { name: "Send Modular Message To Interaction" },
  UI: [
    {
      element: "var",
      storeAs: "message",
      name: "Modular Message"
    },
    "-",
    {
      element: "interaction",
      storeAs: "interaction",
      name: "Send To"
    },
    "_",
    {
      element: "toggleGroup",
      storeAs: ["replyToInteraction", "mentions"],
      prefer: 0,
      nameSchemes: ["If Possible, Send As Interaction Reply", "Allow Mentions"]
    },
    "_",
    {
      element: "toggle",
      storeAs: "ephemeral",
      name: "If Possible, Make Message Ephemeral"
    },
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
    let channel = await bridge.getInteraction(values.interaction);
    let message = bridge.get(values.message);

    let replyInteraction = bridge.getTemporary({ class: "interactionStuff", name: "current" });
    if (values.replyToInteraction && replyInteraction) {
      channel = replyInteraction;
    }

    let flags = values.ephemeral == true ? 64 : 0;
    message.raw.flags = flags;
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

      if (values.replyToInteraction) {
        await replyInteraction[(replyInteraction.editParent ? 'editParent' : 'editOriginal')](parameters);
        finishOff(messageToUpdate)
        return
      } else if (messageToUpdate.interactionMetadata) {
        client.rest.interactions.editFollowupMessage(client.application.id, bridge.data.interactionTokenMap[messageToUpdate.interactionMetadata.id], messageToUpdate.id, parameters).then((msg) => {
          finishOff(msg);
        }).catch((e) => { console.log(e); resolve() });
        return
      }

      messageToUpdate.edit(parameters).then(msg => {
        finishOff(msg);
        if (!values.updateComponents) {
          message.components?.forEach(component => {
            component.run(msg);
          });
        }
      })
    } else {
      let msg = await channel.reply(message.raw);

      bridge.store(values.store, msg);

      bridge.data.interactionHandlers[msg.id] = {}

      message.components?.forEach(component => {
        component.run(msg);
      });
    }
  },
};