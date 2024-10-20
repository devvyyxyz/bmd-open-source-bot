module.exports = {
  data: {
    name: "Overwrite File",
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
      element: "largeInput",
      placeholder: "New Text Content",
      storeAs: "content",
      name: "Content"
    }
  ],
  subtitle: (data) => {
    return `Path: ${data.path} - Content: ${data.content}`
  },
  compatibility: ["Any"],
  run(values, message, client, bridge) {
    let fs = bridge.fs;

    fs.writeFileSync(bridge.file(values.path), bridge.transf(values.content))
  },
};
