module.exports = {
  data: {
    name: "Merge Lists",
  },
  category: "Lists",
  UI: [
    {
      element: "menu",
      types: {
        listInput: "List"
      },
      name: "Lists",
      storeAs: "lists",
      max: 999,
      UItypes: {
        listInput: {
          name: "List Input",
          data: {},
          preview: "`List Name: ${option.data.list.value}`",
          UI: [
            {
              element: "variable",
              storeAs: "list",
              name: "List"
            }
          ]
        }
      }
    },
    "-",
    {
      element: "store",
      name: "Store Merged Lists As",
      storeAs: "store"
    }
  ],
  subtitle: (values, constants) => {
    return `Merge ${values.lists.length} Lists - Store Them As: ${constants.variable(values.store)}`
  },
  compatibility: ["Any"],
  run(values, message, client, bridge) {
    let lists = [];
    values.lists.forEach(i => {
      let list = bridge.get(i.data.list);
      lists.concat(list)
    })

    bridge.store(values.store, lists)
  },
};
