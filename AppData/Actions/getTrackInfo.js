module.exports = {
  data: {
    name: "Get Track Info",
  },
  category: "Music",
  UI: [
    {
      element: "var",
      storeAs: "track",
      name: "Track",
    },
    "-",
    {
      element: "dropdown",
      storeAs: "get",
      name: "Get",
      choices: [
        { name: "Name" },
        // { name: "Duration" },
        { name: "URL" },
        { name: "File" },
        { name: "Author" },
        { name: "Source" },
        { name: "Started?" },
        { name: "Position (Seconds)" }
      ],
    },
    "-",
    {
      element: "store",
      storeAs: "store",
    },
  ],
  subtitle: (values, constants) => {
    return `${values.get} of ${constants.variable(values.track)} - Store As: ${constants.variable(values.store)}`
  },
  async run(values, message, client, bridge) {
    let track = bridge.get(values.track);

    let output;
    switch (values.get) {
      case "Name":
        output = track.name;
        break;
      case "Position (Seconds)":
        output = track.audio.playbackDuration;
        break;
      case "URL":
        output = track.url;
        break;
      case "File":
        output = track.file;
        break;
      case "Author":
        output = track.author;
        break;
      case "Source":
        output = track.src;
        break;
      case "Started?":
        output = track.audio.started;
        break;
    }

    bridge.store(values.store, output)
  },
};
