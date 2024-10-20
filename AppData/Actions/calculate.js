module.exports = {
  data: {
    name: "Calculate",
  },
  category: "Numbers",
  UI: [
    {
      element: "input",
      name: "First Number",
      storeAs: "firstNumber"
    },
    "-",
    {
      element: "halfDropdown",
      name: "Operation",
      storeAs: "operation",
      choices: [
        {
          name: "Addition",
        },
        {
          name: "Subtraction"
        },
        {
          name: "Multiplication"
        },
        {
          name: "Division"
        },
        {
          name: "Percentage Of Number"
        },
        {
          name: "Number Increased By Percentage"
        },
        {
          name: "Number Decreased By Percentage"
        },
        {
          name: "Raised By (Exponents)"
        },
        {
          name: "Raised By (Roots)"
        },
      ]
    },
    "-",
    {
      element: "input",
      name: "Second Number",
      storeAs: "secondNumber"
    },
    "-",
    {
      element: "storageInput",
      name: "Store Result As",
      storeAs: "store"
    }
  ],
  subtitle: (data, constants) => {
    let operation = {
      "Addition": "+",
      "Subtraction": "-",
      "Multiplication": "*",
      "Division": "/",
      "Number Increased By Percentage": "Increased By %",
      "Number Decreased By Percentage": "Decreased By %",
      "Raised By (Exponents)": "Raised By (Exponents)",
      "Raised By (Roots)": "Raised By (Roots)",
      "Percentage Of Number": "%",
    }
    return `${data.firstNumber || "Blank"} ${operation[data.operation]} ${data.secondNumber || "Blank"} - Store Result As ${constants.variable(data.store)}`
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let firstNumber = Number(
      bridge.transf(values.firstNumber)
    );
    let secondNumber = Number(
      bridge.transf(values.secondNumber)
    );

    let result = 0;
    switch (values.operation) {
      case "Addition":
        result = firstNumber + secondNumber;
        break;
      case "Subtraction":
        result = firstNumber - secondNumber;
        break;
      case "Substraction":
        result = firstNumber - secondNumber;
        break;
      case "Multiplication":
        result = firstNumber * secondNumber;
        break;
      case "Division":
        result = firstNumber / secondNumber;
        break;
      case 'Number Increased By Percentage':
        result = (firstNumber * secondNumber) / 100 + firstNumber;
        break;
      case 'Number Decreased By Percentage':
        result = (firstNumber * (100 - secondNumber)) / 100;
        break;
      case 'Raised By (Exponents)':
        result = Math.pow(firstNumber, secondNumber);
        break;
      case 'Raised By (Roots)':
        result = Math.pow(firstNumber, 1 / secondNumber);
        break;
      case 'Percentage Of Number':
        result = (firstNumber * secondNumber) / 100;
        break;
      case 'Rounded':
        result = Math.round(firstNumber)
        break;
    }
    
    bridge.store(values.store, result)
  },
};
