module.exports = {
  data: {
    name: "Log To Console",
  },
  category: "Control",
  UI: [
    {
      element: "largeInput",
      name: "What To Log",
      storeAs: "comment"
    }
  ],
  guide: [
    {
      element: "text",
      text: "What is a console?",
      large: true
    },
    {
      element: "text",
      text: "A console is your bot's log. Anything you type in here will show up in the bot log."
    },
  ],
  subtitle: "$[comment]$",
  compatibility: ["Any"],
  run(values, message, client, bridge) {
    console.log(bridge.transf(values.comment))
  },
};
