module.exports = {
  data: {
    name: "Find Active Thread",
  },
  category: "Threads",
  UI: [
    {
      element: "dropdown",
      storeAs: "method",
      extraField: "value",
      name: "Find By",
      choices: [
        {
          name: "ID",
          field: true
        },
        {
          name: "Name",
          field: true
        },
        {
          name: "Position",
          field: true
        },
        {
          name: "Topic",
          field: true
        }
      ]
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: (data, constants) => {
    return `Find By ${data.method} (${data.value}) - Store As: ${constants.variable(data.store)}`
  },

  async run(values, interaction, client, bridge) {
    let threads = await bridge.guild.getActiveThreads();
    threads = threads.threads

    let toMatch = bridge.transf(values.value);
    bridge.store(values.store, threads.find(thread => thread[values.method.toLowerCase()] == toMatch));
  },
};
