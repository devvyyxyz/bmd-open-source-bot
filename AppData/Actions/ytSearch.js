module.exports = {
  data: {
    name: "YouTube Video Search",
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

    if (!result.videos[0]) {
      bridge.call(values.noResults, values.noResultsActions);
    }

    let video = result.videos[position];
    let output;

    switch (values.get) {
      case "Track":
        const { Innertube } = require('youtubei.js');
        const { createAudioResource } = require('@discordjs/voice');
        const youtube = await Innertube.create().catch();
    
        // Get detailed information about the first video
        const videoInfo = await youtube.getInfo(video.videoId);
    
        const format = videoInfo.chooseFormat({ type: 'audio', quality: 'best' });
        const url = format?.decipher(youtube.session.player);
    
        const audio = createAudioResource(url);
    
        output = {
          name: video.title,
          author: video.author.name,
          url: video.url,
          src: "YouTube",
          audio,
          file: null,
          raw: video
        };

        break;

      case "URL":
        output = video.url;
        break;

      case "Title":
        output = video.title;
        break;

      case "Author URL":
        output = video.author.url;
        break;

      case "Author Icon URL":
        let newSearch = await search(video.title + " by" + video.author.name + "(" + video.author.url + ")");

        output = newSearch.accounts[0].image;
        break;

      case "Author Name":
        output = video.author.name;
        break;

      case "Upload Timestamp":
        output = video.timestamp;
        break;

      case "Description":
        output = video.description;
        break;

      case "Thumbnail URL":
        output = video.thumbnail;
        break;

      case "Views":
        output = video.views;
        break;

      case "Duration (Seconds)":
        output = video.duration;
        break;

      case "ID":
        output = video.videoId;
        break;
    }

    bridge.store(values.store, output);
  },
};
