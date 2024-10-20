module.exports = {
  category: "Modularity",
  data: { name: "Create Modular Poll" },
  UI: [
    {
      element: "input",
      storeAs: "title",
      name: "Question",
      placeholder: "Poll Header"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "duration",
      name: "Duration",
      choices: {
        "1h": { name: "1 Hour" },
        "4h": { name: "4 Hours" },
        "8h": { name: "8 Hours" },
        "24h": { name: "24 Hours" },
        "72h": { name: "3 Days" },
        "168h": { name: "1 Week" },
        "custom": { name: "Custom (Hours)", field: true },
      }
    },
    "-",
    {
      element: "variable",
      storeAs: "pollOptionList",
      name: "Options List"
    },
    {
      element: "toggle",
      storeAs: "multiSelect",
      name: "Allow Multiple Selections"
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: (data, constants) => {
    return `Store As: ${constants.variable(data.store)}`
  },

  run(values, message, client, bridge) {
    let poll = values;
    endPoll = {
      duration: poll.duration.type == 'custom' ? Number(bridge.transf(poll.duration.value)) : Number(poll.duration.type.replace('h', '')),
      allowMultiselect: poll.multiSelect,
      answers: bridge.get(values.pollOptionList),
      question: {
        text: bridge.transf(poll.title),
      },
    };

    bridge.store(values.store, endPoll);
  },
};