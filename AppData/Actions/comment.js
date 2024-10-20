module.exports = {
  data: {
    name: "Comment",
  },
  category: "Text",
  UI: [
    {
      element: "largeInput",
      name: "Comment",
      storeAs: "comment"
    }
  ],
  guide: [
    {
      element: "text",
      text: "What is a comment?",
      large: true
    },
    {
      element: "text",
      text: "Comments don't have any functionality. You will see this comment's content inside the action list. It's a quick & easy way to create sticky notes"
    },
  ],
  subtitle: "$[comment]$",
  compatibility: ["Any"],
  run(values, message, client, bridge) {},
};
