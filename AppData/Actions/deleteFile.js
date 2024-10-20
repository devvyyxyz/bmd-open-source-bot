module.exports = {
  data: {
    name: "Delete File",
  },
  category: "Files",
  UI: [
    {
      element: "input",
      name: "Path",
      storeAs: "path"
    },
  ],
  subtitle: (data) => {
    return `Path: ${data.path}`
  },
  compatibility: ["Any"],
  run(values, message, client, bridge) {
    let fs = bridge.fs;

    fs.unlinkSync(bridge.file(values.path));
  },
};
