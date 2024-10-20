module.exports = {
  category: "Control",
  data: { name: "Wait" },
  UI: [
    {
      element: "dropdown",
      storeAs: "timeUnit",
      extraField: "time",
      name: "Amount Of Time",
      choices: [
        {
          name: "Seconds",
          field: true
        },
        {
          name: "Minutes",
          field: true
        },
        {
          name: "Hours",
          field: true
        },
        {
          name: "Miliseconds",
          field: true
        }
      ]
    } 
  ],
  subtitle: "$[time]$ $[timeUnit]$",
  async run(values, message, client, bridge) {
    function wait(seconds) {
      return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
      });
    }
    var timeAmount = parseInt(bridge.transf(values.time));
    let time;
    switch (values.timeUnit) {
      case "Seconds":
        time = 1000 * timeAmount;
        break;
      case "Minutes":
        time = 1000 * 60 * timeAmount;
        break;
      case "Hours":
        time = 1000 * 60 * 60 * timeAmount;
        break;
      case "Miliseconds":
        time = timeAmount;
        break;
    }

    function wait() {
      return new Promise((resolve) => {
        setTimeout(resolve, time);
      });
    }

    await wait(time);
  },
};
