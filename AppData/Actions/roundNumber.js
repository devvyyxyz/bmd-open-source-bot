module.exports = {
  data: {
    name: "Round",
  },
  category: "Numbers",
  UI: [
    {
      element: "input",
      name: "Number",
      storeAs: "number"
    },
    "-",
    {
      element: "typedDropdown",
      name: "Round Type",
      storeAs: "roundType",
      choices: {
        normal: { name: "Normal" },
        ceil: { name: "Round To Higher" },
        floor: { name: "Round To Lower" },
      }
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],
  subtitle: (data, constants) => {
    let operation = {
      normal: "Round",
      ceil: "Round Higher",
      floor: "Round Lower",
    }
    return `${data.number || "Blank"} ${operation[data.roundType]} - Store As ${constants.variable(data.store)}`
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let number = Number(
      bridge.transf(values.number)
    );

    let result;

    switch (values.roundType.type) {
      case 'normal':
        result = Math.round(number);
        break
      case 'ceil':
        result = Math.ceil(number);
        break
      case 'floor':
        result = Math.floor(number);
        break
    }
   
    bridge.store(values.store, result)
  },
};
