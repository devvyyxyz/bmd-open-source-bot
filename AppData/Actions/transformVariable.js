module.exports = {
    data: { name: "Transform Variable" },
    category: "Variables",
    UI: [
        {
            element: "var",
            storeAs: "from"
        },
        "-",
        {
            element: "store",
            storeAs: "to",
            name: "Transform Into"
        }
    ],
    subtitle: (data) => {
        return `-`
    },
    compatibility: ["Any"],
  async run(values, message, client, bridge) { 
    bridge.store(values.to, bridge.get(values.from))
  }
}