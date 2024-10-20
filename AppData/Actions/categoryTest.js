module.exports = {
  UI: [
    {
      element: "categories",
      categories: [
        {
          name: "Somecategory",
          end: 3
        },
        {
          name: "someothercategory",
          end: 5
        }
      ]
    },
    {
      element: "input"
    },
    {
      element: "memberInput"
    },
    {
      element: "input"
    },
    {
      element: "input"
    },
    {
      element: "memberInput"
    },
    {
      element: "input"
    }
  ],
  subtitle: "",
  category: "Work In Progress",
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
    }

    function wait() {
      return new Promise((resolve) => {
        setTimeout(resolve, time);
      });
    }

    await wait(time);
  },
};
