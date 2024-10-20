module.exports = {
  category: "Modularity",
  data: { name: "Create Modular Button Row" },
  UI: [
    {
      element: "var",
      storeAs: "buttons",
      name: "Buttons List"
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: (data, constants) => {
    return `Store As: ${constants.variable(data.store)}`
  },

  run(values, message, client, bridge) {
    const { ComponentTypes } = require('oceanic.js')
    bridge.store(values.store, { raw: { type: ComponentTypes.ACTION_ROW, components: bridge.get(values.buttons).map(c => c.raw)},
    run: (message) => {
      bridge.get(values.buttons).forEach(b => b.run(message));
    }
  })
  },
};