const { PublicThreadChannel } = require("oceanic.js");

module.exports = {
  data: { name: "Start Thread", starterMessage: {type: "none", value: ""} },
  category: "Threads",
  UI: [
    {
      element: "message",
      storeAs: "message",
      name: "Start On Message"
    },
    "-",
    {
      element: "input",
      name: "Thread Name",
      storeAs: "threadName",
      max: 64
    },
    "-",
    {
      element: "variable",
      storeAs: "starterMessage",
      also: {
        none: "None"
      },
      and: {
        none: false
      },
      name: "Starting Message"
    },
    "-",
    {
      element: "dropdown",
      storeAs: "autoArchive",
      name: "Hide After",
      choices: [
        {
          name: "1 Hour"
        },
        {
          name: "24 Hours"
        },
        {
          name: "3 Days"
        },
        {
          name: "1 Week"
        }
      ]
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  compatibility: ["Any"],

  subtitle: "Name: $[threadName]$",

  async run(values, msg, client, bridge) {
    let message = await bridge.getMessage(values.message)

    let threadName = bridge.transf(values.threadName);

    let autoArchive;

    let starterMessage = null;
    
    if (!(!values.starterMessage || values.starterMessage?.type == 'none')) {
      starterMessage = await bridge.get(values.starterMessage)
    }

    switch(values.autoArchive) {
      case '1 Hour': 
        autoArchive = 60;
      break
      case '24 Hours':
        autoArchive = 1440
      break
      case '3 Days':
        autoArchive = 4320
      break
      case '1 Week':
        autoArchive = 10080
      break
    }

     let thread = await message.startThread({
      name: threadName,
      autoArchiveDuration: autoArchive
    });

    if (starterMessage) {
      thread.createMessage(starterMessage).then(msg => {
        starterMessage.prepare(msg)
      })
    }

    bridge.store(values.store, thread)
  },
};
