module.exports = {
  data: {
    name: "Save Variables",
  },
  category: "Variables",
  UI: [
    {
      element: "text",
      text: `
        This will save Global & Server Actions.
      `
    }
  ],
  subtitle: "",

  run(values, message, client, bridge) {
    let endVars = {
      global: bridge.data.globalVars,
      server: bridge.data.serverVars
    }
    
    bridge.fs.writeFileSync('./vars.json', JSON.stringify(endVars))
  },
};
