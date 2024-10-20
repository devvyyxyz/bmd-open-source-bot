module.exports = {
  data: {
    name: "Delete Category",
  },
  category: "Channels",
  UI: [
    {
      element: "var",
      storeAs: "category",
      also: {
        categoryID: "Category ID"
      },
      name: "Category"
    },
  ],
  compatibility: ["Any"],
  subtitle: "",
  async run(values, message, client, bridge) {
    let category;
    if (values.category.type == 'categoryID') {
      category = await client.getChannel(bridge.transf(values.category.value))
    } else {
      category = bridge.get(category)
    }

    await category.delete()
  },
};
