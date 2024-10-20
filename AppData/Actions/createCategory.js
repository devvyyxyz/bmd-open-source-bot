module.exports = {
  data: {
    name: "Create Category",
  },
  category: "Channels",
  UI: [
    {
      name: "Category Name",
      storeAs: "categoryName",
      element: "input"
    },
    "-",
    {
      storeAs: "store",
      element: "store"
    }
  ],
  compatibility: ["Any"],
  subtitle: "Category Name: $[categoryName]$",
  async run(values, message, client, bridge) {
    let category = await bridge.guild.createChannel(4, {
      name: bridge.transf(values.categoryName)
    });

    await category;
    bridge.store(values.store, category)
  },
};