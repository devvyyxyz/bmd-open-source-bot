const { Client } = require("oceanic.js");

module.exports = {
  category: "Channels",
  data: { name: "Start Thread On Channel", starterMessage: {type: "none", value: ""} },
  category: "Threads",
  UI: [
    {
      element: "channelInput",
      storeAs: "channel",
      name: "Start In Channel",
      excludeUsers: true
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
      element: "dropdown",
      storeAs: "type",
      name: "Thread Type",
      choices: [
        {
          name: "Public"
        },
        {
          name: "Private"
        },
        {
          name: "Announcement"
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
    let channel = await bridge.getChannel(values.channel)

    let threadName = bridge.transf(values.threadName)

    let starterMessage = null;
    
    if (!(!values.starterMessage || values.starterMessage?.type == 'none')) {
      starterMessage = await bridge.get(values.starterMessage)
    }
    
    let autoArchive;

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

    let threadType;

    switch (values.type) {
      case 'Public':
        threadType = 11;
        break
      case 'Private':
        threadType = 12;
        break
      case 'Announcement':
        threadType = 10;
        break
    }

    let thread = await channel.startThreadWithoutMessage({
        name: threadName,
        autoArchiveDuration: autoArchive,
        type: threadType
      });

    bridge.store(values.store, thread)
  },
};
