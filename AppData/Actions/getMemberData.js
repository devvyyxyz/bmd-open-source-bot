module.exports = {
    data: { name: "Get Member Data" },
    category: "Member Data",
    UI: [
        {
            element: "userInput",
            storeAs: "user",
            name: "Member"
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
        return `Member: ${constants.user(values.user)} - Data Name: ${values.dataName} - Store As: ${constants.variable(values.store)}`
    },    compatibility: ["Any"],
   async run(values, message, client, bridge) { 
        var storedData = bridge.data.IO.get();

        let user = await bridge.getUser(values.user);
        let id = `${user.member.guild.id}${user.id}`

        let userData = '';

        if (values.defaultValue) {
            userData = bridge.transf(values.defaultValue)
        }

        try {
            if (storedData.members[id][bridge.transf(values.dataName)]) userData = storedData.members[id][bridge.transf(values.dataName)];
        } catch (error) {
            storedData.members[id] = {}
            bridge.data.IO.write(storedData)
        }

        bridge.store(values.store, userData)
    }
}