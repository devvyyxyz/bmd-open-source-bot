module.exports = {
  category: "Text",
  data: { name: "Translate" },
  UI: [
    {
      element: "largeInput",
      storeAs: "input",
      name: "Text To Translate"
    },
    {
      element: "typedDropdown",
      storeAs: "textType",
      choices: {
        auto: { name: "Auto Detect" },
        iso: { name: "ISO", field: true } 
      },
      name: "Language"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "translationType",
      choices: {
        auto: { name: "Auto Detect" },
        iso: { name: "ISO", field: true } 
      },
      name: "New Language"
    }
  ],
  subtitle: (values, constants) => {
    return `${values.input}`
  },
  async run(values, message, client, bridge) {
    const axios = require('axios').default;
    axios.post('https://translate.hirak.site/', {
      body: {

      }
    })
  },
};
