module.exports = {
  data: {
    name: "YouTube Channel Search",
  },
  category: "Music",
  UI: [
    {
      element: "input",
      name: "Query",
      storeAs: "query",
    },
    "-",
    {
      element: "dropdown",
      name: "Result #",
      storeAs: "result",
      extraField: "resultPosition",
      choices: [
        { name: "First" },
        { name: "Custom", field: true, placeholder: "Results Start At #0" },
      ],
    },
    "-",
    {
      element: "dropdown",
      name: "Store",
      storeAs: "get",
      choices: [
        { name: "Name" },
        { name: "URL" },
        { name: "ID" },
        { name: "Icon URL" },
        { name: "Video Count" },
      ],
    },
    "-",
    {
      element: "store",
      storeAs: "store",
    },
    "-",
    {
      element: "case",
      name: "If Nothing Was Found",
      storeAs: "noResults",
      storeActionsAs: "noResultsActions",
    }
  ],
  subtitle: (values, constants) => {
    return `Search For ${values.query} - Get The ${values.get} - Store As ${constants.variable(values.store)}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let search = require("yt-search");
    let result = await search(bridge.transf(values.query));
    let position = 0;

    if (values.result == "Custom") {
      position = Number(bridge.transf(values.resultPosition));
    }

    if (!result.accounts[0]) {
      bridge.call(values.noResults, values.noResultsActions);
    }

    let account = result.accounts[position];
    let output;


    switch (values.get) {
      case "URL":
        output = account.url;
        break;

      case "Name":
        output = account.title;
        break;

      case "Icon URL":
        output = account.image;
        break;

      case "Video Count":
        output = account.videoCount;
        break;
    }

    bridge.store(values.store, output);
  },
};
