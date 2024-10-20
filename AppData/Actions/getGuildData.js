module.exports = {
    data: { name: "Get Server Data" },
    category: "Server Data",
    UI: [
        {
          element: "guild",
          storeAs: "guild"
        },
        "-",
        {
            element: "input",
            storeAs: "dataName",
            name: "Data Name"
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
    compatibility: ["Any"],
    subtitle: (values, constants) => {
        return `Data Name: ${values.dataName} - Store As: ${constants.variable(values.store)}`
    },
   async run(values, message, client, bridge) {
        let guild = await bridge.getGuild(values.guild);
        var storedData = bridge.data.IO.get();

        let guildData = '';

        if (values.defaultValue) {
            guildData = bridge.transf(values.defaultValue)
        }

        try {
            if (storedData.guilds[guild.id][bridge.transf(values.dataName)]) guildData = storedData.guilds[guild.id][bridge.transf(values.dataName)];
        } catch (error) {
            storedData.guilds[guild.id] = {}
            bridge.data.IO.write(storedData)
        }

        bridge.store(values.store, guildData)
    }
}