const { PublicThreadChannel, Message, Base } = require("oceanic.js");

module.exports = {
  data: { name: "Get Thread Info" },
  category: "Threads",
  UI: [
    {
      element: "channel",
      storeAs: "thread",
      excludeUsers: true,
      name: "Thread"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "get",
      name: "Get",
      choices: {
        memberCount: { name: "Member Count" },
        messageCount: { name: "Message Count" },
        members: { name: "Members" },
        owner: { name: "Owner" },
        parent: { name: "Parent" },
        parentMessage: { name: "Starter Message" },
        messages: { name: "Messages" },
        appliedTags: { name: "Applied Tags" },
        type: { name: "Type" }
      }
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: (values, constants, thisAction) => {
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.channel(values.thread)} - Store As: ${constants.variable(values.store)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    /**
     * @type {PublicThreadChannel}
     */
    let thread = await bridge.getChannel(values.thread)

    let output;
    let specificOutputs = ["type", "owner", "parentMessage", "messages"];

    if (specificOutputs.includes(values.get.type)) {
      switch (values.get.type) {
        case 'type':
          let threadTypes = {
            10: "Announcement Thread",
            12: "Private Thread",
            11: "Public Thread"
          }
          output = threadTypes[thread.type];
          break
        case 'owner':
          output = bridge.getUser({ type: 'id', value: thread.ownerID });
          break
        case 'parentMessage':
          output = await thread.getMessage(thread.id);
          break
        case 'messages':
          output = await thread.getMessages({ limit: Infinity })
          break
        case 'members':
          output = await thread.getThreadMembers();
          break
      }
    } else {
      output = thread[values.get.type];
    }

    bridge.store(values.store, output)
  },
};
