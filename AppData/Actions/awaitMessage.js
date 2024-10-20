module.exports = {
  category: "Messages",
  data: {
    name: "Await Message",
    stopAwaitingAfter: 60
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
      element: "channelInput",
      storeAs: "channel",
      name: "Await In Channel"
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
        element: "storageInput",
        storeAs: "messageStorage",
        name: "Store Message As"
      },
      "_",
      {
        element: "storageInput",
        storeAs: "authorStorage",
        name: "Store Message Author As"
      },
    "-",
    {
      name: "Once Sent, Run",
      element: "actions",
      storeAs: "actions"
    }
  ],

  compatibility: ["Any"],

  subtitle: (values, constants) => {
    return `In Channel: ${constants.channel(values.channel)} - Stop Awaiting After: ${values.stopAwaitingAfter}s`
  },


  async run(values, message, client, bridge) {
    let wasEverRan = false;
    let actionRunner = bridge.runner;

    let channel = await bridge.getChannel(values.channel)

    const handleMessage = async (msg) => {
      let matchesTarget = false;
      let matchesChannel = channel.id == msg.channel.id;

      if (values.user.type == 'any') {
        matchesTarget = true
      } else {
        let user = await bridge.getUser(values.user);
        matchesTarget = user.id == msg.author.id
      }

      if (matchesTarget && matchesChannel && !wasEverRan) {
        if (values.oneTime) {
          wasEverRan = true;
        }
      msg.author.member = msg.member
      bridge.store(values.authorStorage, msg.author)
      bridge.store(values.messageStorage, msg)

        actionRunner(
          values.actions,
          message,
          client,
          bridge.variables
        );
      }
    };

    client.on(
      "messageCreate",
      handleMessage,
    );

    if (values.stopAwaitingAfter != "") {
      setTimeout(
        () => {
          client.off("messageCreate", handleMessage);
        },
        parseFloat(values.stopAwaitingAfter) * 1000,
      );
    }
  },
};
