module.exports = {
  category: "Emoji",
  data: {
    name: "Create Emoji",
  },
  UI: [
    {
      element: "imageInput",
      storeAs: "image"
    },
    "-",
    {
      element: "input",
      storeAs: "emojiName",
      name: "Emoji Name"
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],
  subtitle: (data, constants) => {
    return `Emoji Image: ${constants.image(data.image)} - Emoji Name: ${data.emojiName} - Store As: ${constants.variable(data.store)}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let emojiImage = await bridge.getImage(values.image);
    let emojiName = bridge.transf(values.emojiName);

    let newEmoji = await bridge.guild.createEmoji({
      name: emojiName,
      image: emojiImage
    });
    
    bridge.store(values.store, newEmoji)
  },
};
