module.exports = {
  data: {
    name: "Get Embed Info",
  },
  category: "Embeds",
  UI: [
    {
      element: "var",
      storeAs: "embed",
      name: "Embed"
    },
    "-",
    {
      element: "dropdown",
      storeAs: "get",
      name: "Get",
      choices: [
        { name: "Title" },
        { name: "URL" },
        { name: "Footer Icon URL" },
        { name: "Footer Content" },
        { name: "Description" },
        { name: "Field Title List" },
        { name: "Field Value List " },
        { name: "Color" },
        { name: "Author Name" },
        { name: "Author Icon URL" },
        { name: "Thumbnail URL" },
        { name: "Image URL" },
      ]
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],
  subtitle: (values, constants) => {
    return `Get: ${values.get} of ${constants.variable(values.embed)} - Store As: ${constants.variable(values.store)}`
  },
  compatibility: ["Any"],
  run(values, message, client, bridge) {
    
    /**
     * @type {import("oceanic.js").Embed}
     */
    let embed = bridge.get(values.embed);
    let result;

    switch (values.get) {
      case 'Title':
        result = embed.title;
        break
      case 'URL':
        result = embed.url;
        break
      case 'Footer Icon URL':
        result = embed.footer.iconURL;
        break
      case 'Footer Content':
        result = embed.footer.text;
        break
      case 'Description':
        result = embed.description;
        break
      case 'Field Value List':
        result = embed.fields.map(field => field.value);
        break
      case 'Field Title List':
        result = embed.fields.map(field => field.title);
        break
      case 'Color':
        result = embed.color.toString(16);
        break
      case 'Author Name':
        result = embed.author.name;
        break
      case 'Author Icon URL':
        result = embed.author.iconURL;
        break
      case 'Thumbnail URL':
        result = embed.thumbnail.url;
        break
      case 'Image URL':
        result = embed.image.url;
        break
    }

    bridge.store(values.store, result)
  },
};
