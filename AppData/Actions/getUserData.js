module.exports = {
    data: { name: "Get User Data" },
    category: "User Data",  
    UI: [
        {
            element: "userInput",
            storeAs: "user"
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
        return `User: ${constants.user(values.user)} - Data Name: ${values.dataName} - Store As: ${constants.variable(values.store)}`
    },
    compatibility: ["Any"],
   async run(values, message, client, bridge) { 
        var storedData = bridge.data.IO.get();

        let user = await bridge.getUser(values.user)

        let userData = '';

        if (values.defaultValue) {
            userData = bridge.transf(values.defaultValue)
        }

        try {
          if (storedData.users[user.id][bridge.transf(values.dataName)]) userData = storedData.users[user.id][bridge.transf(values.dataName)];
        } catch (error) {
            storedData.users[user.id] = {}
            bridge.data.IO.write(storedData)
        }

        bridge.store(values.store, userData)
    }
}