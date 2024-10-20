module.exports = {
  category: "Messages",
    data: { name: "Get Channel Messages List", afterMessage: {value: "", type: "none"}, beforeMessage: {value: "", type: "none"} },
    UI: [
        {
            element: "channelInput",
            storeAs: "channel"
        },
        "-",
        {
            element: "dropdown",
            storeAs: "maximum",
            extraField: "maximumMessages",
            name: "Maximum Messages",
            choices: [
                {
                    name: "Custom",
                    field: true
                },
                {
                    name: "Infinite"
                }
            ]
        },
        "_",
        {
            element: "var",
            name: "After Message",
            storeAs: "afterMessage",
            also: {
                none: "None"
            },
            and: {
                none: false
            }
        },
        "_",
        {
            element: "var",
            name: "Before Message",
            storeAs: "beforeMessage",
            also: {
                none: "None"
            },
            and: {
                none: false
            }
        },
        "-",
        {
            element: "store",
            storeAs: "store"
        }
    ],
    subtitle: (data) => {
        return `Store As: ${data.store.value} - Maximum Messages: ${data.maximum} ${data.maximum == 'Custom' ? "(" + data.maximumMessages + ")" : "" }`
    },
    compatibility: ["Any"],
  async run(values, message, client, bridge) { 
    let channel = await bridge.getChannel(values.channel);
    let after = {};
    let before = {};

    if (values.beforeMessage.type != 'none') {
        let message = await bridge.get(values.beforeMessage)
        before.before = message.id
    }
    if (values.beforeMessage.type != 'none') {
        let message = await bridge.get(values.beforeMessage)
        after.after = message.id
    }

    let messageList = await channel.getMessages({
        limit: values.maximum == 'Infinite' ? "Infinity" : parseInt(bridge.transf(values.maximumMessages)),
        ...after,
        ...before
    })

    bridge.store(values.store, messageList)
  }
}