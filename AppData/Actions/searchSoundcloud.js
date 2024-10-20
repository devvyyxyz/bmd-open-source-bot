module.exports = {
  data: {
    name: "SoundCloud Search",
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
        { name: "URL" },
        { name: "Title" },
        { name: "Track" },
        { name: "Tracks" },
        { name: "ID" },
        { name: "Thumbnail URL" },
        { name: "Upload Timestamp" },
        { name: "Description" },
        { name: "Duration (Seconds)" },
        { name: "Views" },
        { name: "Author Name" },
        { name: "Author URL" },
        { name: "Author Icon URL" },
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
    return `Search For ${values.query} - Get The ${values.get} - Store As ${constants.variable(values.store)}`;
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const scdl = require('soundcloud-downloader').default;
    let result;
    try {
      result = await scdl.search({ query: bridge.transf(values.query), limit: 10 });
    } catch (error) {
      return bridge.call(values.noResults, values.noResultsActions);
    }

    let position = 0;
    if (values.result === "Custom") {
      position = Number(bridge.transf(values.resultPosition));
    }

    if (!result || !result.collection || !result.collection[position]) {
      return bridge.call(values.noResults, values.noResultsActions);
    }

    const track = result.collection[position];
    let output;

    switch (values.get) {
      case "Track":
        output = {
          name: track.title,
          author: track.user.username,
          url: track.permalink_url,
          src: "SoundCloud",
          file: null,
          raw: track,
        };
        break;

      case "URL":
        output = track.permalink_url;
        break;

      case "Title":
        output = track.title;
        break;

      case "Author URL":
        output = track.user.permalink_url;
        break;

      case "Author Icon URL":
        output = track.user.avatar_url;
        break;

      case "Author Name":
        output = track.user.username;
        break;

      case "Upload Timestamp":
        output = track.created_at;
        break;

      case "Description":
        output = track.description;
        break;

      case "Thumbnail URL":
        output = track.artwork_url;
        break;

      case "Views":
        output = track.playback_count;
        break;

      case "Duration (Seconds)":
        output = track.duration / 1000;
        break;

      case "ID":
        output = track.id;
        break;
    }

    bridge.store(values.store, output);
  },
};
