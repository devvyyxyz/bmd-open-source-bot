module.exports = {
  data: { name: "Move List Item" },
  category: "Lists",
  UI: [
    {
      element: "var",
      storeAs: "list",
      name: "List"
    },
    "-",
    {
      element: "inputGroup",
      nameSchemes: ["Element Initial Position", "Element New Position"],
      storeAs: ["initialPosition", "newPosition"]
    }
  ],

  subtitle: "From Position #$[initialPosition]$ to #$[newPosition]$",
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let list = bridge.get(values.list)

    function array_move(arr, fromIndex, toIndex) {
      var element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
    };

    list = array_move(list, parseFloat(bridge.transf(values.initialPosition), bridge.transf(values.newPosition)));

    bridge.store(values.list, list)
  },
};
