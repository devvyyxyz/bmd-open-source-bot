module.exports = {
  data: {
    name: "Randomize Number",
  },
  category: "Numbers",
  UI: [
    {
      element: "inputGroup",
      nameSchemes: ["Minimum", "Maximum"],
      storeAs: ["firstNumber", "secondNumber"]
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: "Min Value: $[firstNumber]$ - Max Value: $[secondNumber]$",
  compatibility: ["Any"],

  run(values, message, client, bridge) {
    let first = parseFloat(
      bridge.transf(values.firstNumber),
    );
    let second = parseFloat(
      bridge.transf(values.secondNumber),
    ) + 1;

    let randomNumber = Math.floor(Math.random() * (second - first)) + first;

    bridge.store(values.store, randomNumber)
  },
};
