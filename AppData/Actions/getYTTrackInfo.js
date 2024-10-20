module.exports = {
  data: {
    name: "Get YouTube Track Info",
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
        { name: "Description" },
        { name: "Thumbnail URL" },
        { name: "Upload Timestamp" },
        { name: "Duration (Seconds)" },
        { name: "URL" },
        { name: "File" },
        { name: "Author" },
        { name: "Author Icon URL" },
        { name: "Source" },
        { name: "Started?" },
        { name: "Position (Seconds)" },
        { name: "Video ID" },
        { name: "Views" }
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
    /**
     * @type {import("yt-search").VideoSearchResult}
     */
    let track = bridge.get(values.track);

    let output;
    switch (values.get) {
      case "Name":
        output = track.name;
        break;
      case "Duration (Seconds)":
        output = track.raw.duration;
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
      case "Author Icon URL":
        const search = require("ytdl-core").getBasicInfo;
        let newSearch = await search(track.raw.url);
        output = newSearch.videoDetails.author.avatar;
        break;
      case "Author URL":
        output = track.raw.author.url;
        break;
      case "Source":
        output = track.src;
        break;
      case "Started?":
        output = track.audio.started;
        break;
      case "Description":
        output = track.raw.description;
        break;
      case "Views":
        output = track.raw.views;
        break;
      case "Upload Timestamp":
        output = track.raw.timestamp;
        break;
      case "ID":
        output = track.raw.videoId;
        break;
      case "Thumbnail URL":
        output = track.raw.thumbnail;
        break;
    }

    bridge.store(values.store, output)
  },
};
