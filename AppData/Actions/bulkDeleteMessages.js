const { TextableChannel } = require("oceanic.js");

module.exports = {
  category: "Messages",
  data: {
    name: "Bulk Delete",
    user: {type: "any", value: ""}
  },
  UI: [
    {
      element: "channelInput",
      storeAs: "channel",
      name: "In Channel",
      excludeUsers: true
    },
    "-",
    {
      element: "halfDropdown",
      storeAs: "amount",
      extraField: "delete",
      name: "Amount Of Messages To Delete",
      choices: [
        {
          name: "Custom",
          field: "true"
        },
        {
          name: "Maximum (300)"
        }
      ]
    },
    "_",
    {
      element: "userInput",
      storeAs: "user",
      name: "From User",
      and: {
        any: false
      },
      also: {
        any: "Any",
      }
    },
    "-",
    {
      element: "halfDropdown",
      storeAs: "include",
      extraField: "keyword",
      name: "Must Include",
      choices: [
        {
          name: "Nothing"
        },
        {
          name: "Keyword",
          field: true
        }
      ]
    },
    "-",
    {
      element: "input",
      name: "Reason",
      storeAs: "reason"
    },
    "-",
    {
      element: "store",
      name: "Store Amount Of Deleted Messages As",
      storeAs: "deletedCountStorage"
    }
  ],

  subtitle: (values, constants) => {
    return `In Channel: ${constants.channel(values.channel)} - From User: ${values.user.type == "any" ? "Any" : constants.user(values.user)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    /**
     * @type {TextableChannel}
     */
    const channel = await bridge.getChannel(values.channel);

    const reason = values.reason || ""

    const lastWeeks = 1209600000 + new Date().getTime();

    let mustInclude = "";
    if (values.mustInclude == "Keyword") {
      mustInclude = bridge.transf(values.keyword);
    }

    let userFilter;
    if (values.user.type != "any") {
      userFilter = await bridge.getUser(values.user);
    }

    let amount = 300;
    if (values.amount == "Custom") {
      amount = parseFloat(bridge.transf(values.delete));
    }

    const bulk = [];

    let deletedMessages = 0;
    let realDeletedMessages = 0;
    const messages = (await channel.getMessages({ limit: amount * 5 })).filter((message) => {
      return (message.content.toLowerCase().includes(mustInclude.toLowerCase()) && !!(!!!userFilter || message.author.id == userFilter.id))
    });

    for (const msg of messages) {
      if (deletedMessages != amount) {
        if (msg.createdAt.getTime() < lastWeeks) {
          bulk.push(msg.id);
        } else {
          msg.delete();
        }
  
        deletedMessages++
      }
    }

    if (bulk.length != 0) {
      await client.rest.channels.deleteMessages(channel.id, bulk, reason).catch(err => console.log(err));
      realDeletedMessages = deletedMessages;
    }

    if (values.deletedCountStorage) {
      bridge.store(values.deletedCountStorage, realDeletedMessages);
    }
  }
};