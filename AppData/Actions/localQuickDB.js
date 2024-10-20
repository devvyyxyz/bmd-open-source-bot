module.exports = {
  data: {
    name: "Local QuickDB",
  },
  category: "Global Data",
  UI: [
    {
      element: "dropdown",
      name: "Operation",
      storeAs: "operation",
      choices: [
        {
          name: "Get",
        },
        {
          name: "Set",
        },
        {
          name: "Delete",
        },
        {
          name: "Has",
        },
        {
          name: "Add",
        },
        {
          name: "Subtract",
        },
        {
          name: "Push",
        },
        {
          name: "Get Entire Database",
        },
      ],
    },
    "-",
    {
      element: "input",
      name: "Path",
      storeAs: "path",
      placeholder: "Separated By Periods"
    },
    "-",
    {
      element: "largeInput",
      name: "Value",
      storeAs: "value",
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result As",
      storeAs: "store",
    },
  ],
  subtitle: (data, constants) => {
    return `Operation: ${data.operation} - Path: ${data.operation == 'Get Entire Database' ? "Root" : data.path} - Store As: ${constants.variable(data.store)}`
  },
  compatibility: ["Any"],

  script: (data) => {
    function refreshElements() {
      if (data.data.operation == 'Get Entire Database') {
        data.UI[5] = ' '
        data.UI[3] = ' '
        data.UI[2].element = ' '
        data.UI[4].element = ' '
      } else {
        data.UI[2].element = 'input'
        data.UI[4].element = 'largeInput'
        data.UI[3] = '-'
        data.UI[5] = '-'
      }

      let disabledValueOptions = ['Get', 'Delete', 'Has', 'Get Entire Database'];
      if (disabledValueOptions.includes(data.data.operation)) {
        data.UI[4].element = ''
        data.UI[5] = ' '
      } else {
        data.UI[4].element = 'largeInput'
        data.UI[5] = '-'
        data.UI[4].placeholder = `What to ${data.data.operation}`
      }
      setTimeout(() => {
        data.updateUI()
      }, data.commonAnimation * 100);
    }
    refreshElements()
    data.events.on('change', () => {
      refreshElements()
    })
  },

  async run(values, message, client, bridge) {
    const value = bridge.transf(values.value);
    const path = bridge.transf(values.path);

    const bsql = require('better-sqlite3')
    const { QuickDB, JSONDriver } = require("quick.db");
    const jsonDriver = new JSONDriver()
    const db = new QuickDB({driver: jsonDriver});

    let result = 0;
    switch (values.operation) {
      case "Get":
        result = await db.get(path);
        break;
      case "Set":
        result = await db.set(path, value);
        break;
      case "Delete":
        result = await db.delete(path);
        break;
      case "Has":
        result = await db.has(path);
        break;
      case "Add":
        result = await db.add(path, value);
        break;
      case "Subtract":
        result = await db.sub(path, value);
        break;
      case "Push":
        result = await db.push(path, value);
        break;
      case "Get Entire Database":
        result = await db.all();
        break;
    }

    bridge.store(values.store, result);
  },
};