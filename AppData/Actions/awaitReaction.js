module.exports = {
  category: "Reactions",
  data: {
    name: "Await Reaction",
    stopAwaitingAfter: "60"
  },
  UI: [
    {
      element: "input",
      storeAs: "stopAwaitingAfter",
      name: "Stop Awaiting After (Seconds)",
      placeholder: "Min: 1",
    },
    "_",
    {
      element: "toggle",
      storeAs: "oneTime",
      name: "One-Time Only"
    },
    "-",
    {
      element: "variableInsertion",
      storeAs: "message",
      name: "Await On Message",
      also: {
        command: "Command Message",
        anyMsg: "Any Message In Command Channel"
      },
      and: {
        command: false,
        anyMsg: false
      }
    },
    "_",
    {
      element: "userInput",
      storeAs: "user",
      name: "From User",
      also: {
        any: "Any"
      },
      and: {
        any: false
      }
    },
    "-",
    {
      element: "store",
      storeAs: "reaction",
      name: "Store Reaction As"
    },
    "-",
    {
      element: "input",
      storeAs: "emojiName",
      placeholder: "Optional",
      name: "Must Match Emoji Name"
    },
    {
      element: "input",
      storeAs: "emojiID",
      placeholder: "Optional",
      name: "Must Match Emoji ID"
    },
    "-",
    {
      name: "Once Reacted, Run",
      element: "actions",
      storeAs: "actions"
    }
  ],

  compatibility: ["Text"],

  subtitle: (data, constants) => {
    let message;
    if (data.message.type == 'command') {
      message = 'Command Message'
    } else if (data.message.type == 'anyMsg') {
      message = 'Any Message In Command Channel'
    } else {
      message = constants.variable(data.message)
    }

    let user;
    if (data.user.type == 'any') {
      user = 'Anyone'
    } else {
      user = constants.user(data.user)
    }

    return `On Message: ${message} - Await From ${user}`
  },

  async run(values, msg, client, bridge) {
    let actionRunner = bridge.runner;
    let wasEverRan = false;

    const handleReaction = async (message, reactor, fullReaction) => {
      let reaction = fullReaction.emoji;
      let matchesEmoji = true;
      let matchesTarget = false;
      let matchesMessage = false;

      if (values.message.type == 'anyMsg') {
        matchesMessage = true;
      } else if (values.message.type == 'command') {
        matchesMessage = message.id == msg.id
      } else {
        matchesMessage = message.id == bridge.get(values.message).id
      }

      if (values.user.type == 'any') {
        matchesTarget = true;
      } else {
        let user = await bridge.getUser(values.user);
        matchesTarget = user.id == msg.author.id;
      }

      if (values.emojiName.trim() != '') {
        matchesEmoji = reaction.name == bridge.transf(values.emojiName);
        if (values.emojiID.trim() != '') {
          matchesEmoji = reaction.id == bridge.transf(values.emojiID) && matchesEmoji
        }
      }

      let Reaction = {
        emoji: reaction.name,
        emojiID: reaction.id,
        author: reactor,
        message
      }

      bridge.store(values.reaction, Reaction)

      if (matchesTarget && matchesEmoji && matchesMessage && !wasEverRan) {
        if (values.oneTime) {
          wasEverRan = true;
        }
        actionRunner(
          values.actions,
          message,
          client,
          bridge.variables
        );
      }
    };

    client.on("messageReactionAdd", handleReaction);

    if (values.stopAwaitingAfter != "") {
      setTimeout(
        () => {
          client.off(
            "messageReactionAdd",
            handleReaction,
          );
        },
        parseFloat(values.stopAwaitingAfter) * 1000,
      );
    }
  },
};
