module.exports = {
  data: {
    name: "Get Attachment Info",
  },
  category: "Misc",
  UI: [
    {
      element: "var",
      storeAs: "attachment",
      name: "Attachment"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "get",
      name: "Get",
      choices: {
        url: {name: "URL"},
        proxyURL: {name: "Proxy URL"},
        filename: {name: "File Name"},
        content: {name: "Content"},
        contentType: {name: "Type"},
        width: {name: "Width"},
        height: {name: "Height"},
        size: {name: "Size"},
        id: {name: "ID"},
        ephemeral: {name: "Ephemeral?"},
      }
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],
  subtitle: (values, constants, thisAction) => {
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.variable(values.attachment)} - Store As: ${constants.variable(values.store)}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let attachment = bridge.get(values.attachment);
    let result = attachment[values.get.type];

    if (values.get.type == 'content') {
      result = await new Promise((resolve, reject) => require('https').get(attachment.proxyURL, (res) => {
        let chunks = [];
        res.on('data', (chunk) => {
          chunks.push(chunk);
        });
        res.on('end', () => {
          result = Buffer.concat(chunks).toString();
          resolve(result)
        });
      }))
    }

    bridge.store(values.store, result)
  },
};