module.exports = {
  category: "Channels",
  data: { name: "Start Forum Thread" },
  category: "Threads",
  UI: [
    {
      element: "channelInput",
      storeAs: "channel",
      name: "Start In Forum Channel",
      excludeUsers: true
    },
    "-",
    {
      element: "input",
      name: "Thread Name",
      storeAs: "threadName",
      max: 64
    },
    "_",
    {
      element: "var",
      storeAs: "message",
      name: "Starter Message"
    },
    "-",
    {
      element: "menu",
      name: "Tags",
      types: {
        tag: "Tag"
      },
      storeAs: "tags",
      max: 5,
      UItypes: {
        tag: {
          preview: "`Tag ID: ${option.data.tagID || \"(Blank)\"}`",
          name: "Tag",
          data: {tagID: ""},
          UI: [
            {
              element: "input",
              name: "Tag ID",
              storeAs: "tagID"
            }
          ]
        }
      }
    },
    "-",
    {
      element: "store",
      storeAs: "store",
      name: "Store Thread As"
    },
  ],

  compatibility: ["Any"],

  subtitle: (values, constants) => {
    return `Name: ${values.threadName} - Channel: ${constants.channel(values.channel)} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, msg, client, bridge) {
    let channel = await bridge.getChannel(values.channel)

    let threadName = bridge.transf(values.threadName);

    let message = await bridge.get(values.message)

    let tags = [];

    if (values.tags) {
      values.tags.forEach(tagData => {
        let tag = tagData.data;
        tags.push(bridge.transf(tag.tagID));
      })
    }

    let thread = await channel.startThread({
      name: threadName,
      message,
      appliedTags: tags
    });

    if (message.prepare) {
      message.prepare(thread.messages.first())
    }

    bridge.store(values.store, thread)
  },
};
