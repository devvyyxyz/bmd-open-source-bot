module.exports = {
    data: { name: "Get Global Data" },
    category: "Global Data",
    UI: [
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
        var storedData = bridge.data.IO.get();

        let listData = '';
        if (values.defaultValue) {
            listData = bridge.transf(values.defaultValue)
        }
        
        try {
            if (storedData.lists[bridge.transf(values.dataName)]) listData = storedData.lists[bridge.transf(values.dataName)];
        } catch (error) {
            storedData.lists = {}
            bridge.data.IO.write(storedData)
        }

        bridge.store(values.store, listData)
    }
}