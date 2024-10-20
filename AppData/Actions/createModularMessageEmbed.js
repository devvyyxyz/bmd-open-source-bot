module.exports = {
  category: "Modularity",
  data: { name: "Create Modular Embed", color: "#000000" },
  UI: [
    {
      element: "input",
      name: "Title",
      storeAs: "title"
    },
    "-",
    {
      element: "input",
      name: "URL",
      storeAs: "url"
    },
    "-",
    {
      element: "input",
      name: "Color",
      storeAs: "embedColor"
    },
    "-",
    {
      element: "inputGroup",
      nameSchemes: ["Footer Content", "Footer Icon URL"],
      storeAs: ["footerContent", "footerIconURL"]
    },
    {
      element: "inputGroup",
      nameSchemes: ["Author Name", "Author Icon URL"],
      storeAs: ["authorName", "authorIcon"]
    },
    {
      element: "inputGroup",
      nameSchemes: ["Embed Thumbnail URL", "Embed Image URL"],
      storeAs: ["thumbnailURL", "imageURL"]
    },
    "-",
    {
      element: "largeInput",
      name: "Description",
      storeAs: "description"
    },
    "-",
    {
      element: "dropdown",
      name: "Timestamp",
      storeAs: "timestamp",
      extraField: "customTimestamp",
      choices: [
        {
          name: "None"
        },
        {
          name: "Current"
        },
        {
          name: "ISO Date",
          field: true
        }
      ]
    },
    "-",
    {
      element: "var",
      storeAs: "fields",
      name: "Fields List",
      optional: true
    },
    "-",
    {
      element: "store",
      storeAs: "store",
    }
  ],

  subtitle: (data, constants) => {
    return `Store As: ${constants.variable(data.store)}`
  },

  run(values, message, client, bridge) {
    let endEmbed = { author: {}, footer: {}, fields: bridge.get(values.fields) };
    if (values.title != "") {
      endEmbed.title = bridge.transf(`${values.title}`);
    }
    if (values.authorName != "") {
      endEmbed.author.name = bridge.transf(`${values.authorName}`);
    }
    if (values.authorIcon != "") {
      endEmbed.author.iconURL = bridge.transf(`${values.authorIcon}`);
    }
    if (values.embedColor != "") {
      endEmbed.color = parseInt(
        bridge.transf(values.embedColor).replace("#", ""),
        16
      );
    } else {
      endEmbed.color = 0;
    }
    if (values.footerContent != "") {
      endEmbed.footer.text = bridge.transf(`${values.footerContent}`);
    }
    if (values.footerIconURL != "") {
      endEmbed.footer.iconURL = bridge.transf(`${values.footerIconURL}`);
    }
    if (values.description != "") {
      endEmbed.description = bridge.transf(`${values.description}`);
    }
    if (values.imageURL != "") {
      endEmbed.image = {
        url: bridge.transf(values.imageURL),
      };
    }
    if (values.thumbnailURL != "") {
      endEmbed.thumbnail = {
        url: bridge.transf(values.thumbnailURL),
      };
    }
    if (values.timestamp == "Current") {
      endEmbed.timestamp = new Date().toISOString();
    } else if (values.timestamp == "ISO Date") {
      endEmbed.timestamp = bridge.transf(values.customTimestamp);
    }
    let url = {};

    if (values.url?.trim()) {
      url = { url: bridge.transf(values.url) };
    }
    bridge.store(values.store, endEmbed);
  },
};