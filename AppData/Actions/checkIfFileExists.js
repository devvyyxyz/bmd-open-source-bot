module.exports = {
  data: {
    name: "Check If File Exists",
  },
  category: "Files",
  UI: [
    {
      element: "input",
      name: "Path",
      storeAs: "path"
    },
    "-",
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If True"
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If False"
    }
  ],
  subtitle: (data) => {
    return `Path: ${data.path}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let fs = bridge.fs;

    if (fs.existsSync(bridge.file(values.path))) {
      await bridge.call(values.true, values.trueActions)
    } else {
      await bridge.call(values.false, values.falseActions)
    }
  },
};
