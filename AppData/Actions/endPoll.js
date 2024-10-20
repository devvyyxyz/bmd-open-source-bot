module.exports = {
  data: {
    name: "End Poll",
  },
  category: "Polls",
  UI: [
    {
      element: "var",
      name: "Poll",
      storeAs: "poll"
    }
  ],
  subtitle: (values, constants) => {
    return `${constants.variable(values.poll)}`
  },
  async run(values, message, client, bridge) {
    let poll = bridge.get(values.poll);
    await poll.expire();
  },
};
