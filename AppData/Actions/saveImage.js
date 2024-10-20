module.exports = {
  data: {
    name: "Save Image",
  },
  category: "Images",
  UI: [
    {
      element: "image",
      storeAs: "image"
    },
    "-",
    {
      element: "input",
      name: "Path",
      storeAs: "path"
    }
  ],
  subtitle: "Path: $[path]$",
  async run(values, message, client, bridge) {
    /**
     * @type {Buffer}
     */
    let image = await bridge.getImage(values.image);

    const fs = bridge.fs;
    fs.createWriteStream(bridge.file(values.path), image)
  },
};
