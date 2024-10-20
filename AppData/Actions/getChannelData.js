module.exports = {
    data: { name: "Get Channel Data" },
    category: "Channel Data",
    UI: [
        {
            element: "channelInput",
            storeAs: "channel"
        },
        "-",
        {
            element: "input",
            name: "Data Name",
            storeAs: "dataName"
        },
        "-",
        {
            element: "input",
            name: "Default Value",
            storeAs: "defaultValue"
        },
        "-",
        {
            element: "store",
            storeAs: "store"
        }
    ],
    subtitle: (values, constants) => {
        return `Channel: ${constants.channel(values.channel)} - Data Name: ${values.dataName} - Store As: ${constants.variable(values.store)}`
    },
    compatibility: ["Any"],
   async run(values, message, client, bridge) { 
        var storedData = bridge.data.IO.get();

        let channel = await bridge.getChannel(values.channel)

        let channelData = '';
        if (values.defaultValue) {
            channelData = bridge.transf(values.defaultValue)
        }

        try {
            if (storedData.channels[channel.id][bridge.transf(values.dataName)]) channelData = storedData.channels[channel.id][bridge.transf(values.dataName)];
        } catch (error) {
            storedData.channels[channel.id] = {}
            bridge.data.IO.write(storedData)
        }

        bridge.store(values.store, channelData)
    }
}