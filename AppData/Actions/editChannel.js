module.exports = {
  category: "Channels",
  data: {
    name: "Edit Channel",
    category: { value: "", type: "unchanged" }
  },
  UI: [
    {
      element: "channelInput",
      storeAs: "channel",
      excludeUsers: true
    },
    "-",
    {
      element: "dropdown",
      storeAs: "nameChange",
      extraField: "name",
      name: "Name",
      choices: [
        { name: "Don't Change" },
        { name: "Change", field: true, placeholder: "New Name" }
      ]
    },
    "-",
    {
      element: "category",
      name: "Category",
      storeAs: "category",
      additionalOptions: {
        unchanged: { name: "Don't Change" },
        none: { name: "None" }
      },
      also: {
        unchanged: "Unchanged",
        none: "None"
      },
      and: {
        unchanged: false,
        none: false
      }
    },
    "-",
    {
      name: "Channel Topic",
      storeAs: "topicChange",
      element: "dropdown",
      choices: [
        { name: "Don't Change" },
        { name: "Change" }
      ]
    },
    {
      element: "largeInput",
      name: "Channel Topic",
      storeAs: "topic"
    },
    "-",
    {
      name: "Channel Position",
      element: "dropdown",
      storeAs: "positionChange",
      extraField: "position",
      choices: [
        { name: "Don't Change" },
        { name: "Change", field: true, placeholder: "New Position Number" }
      ]
    },
    "-",
    {
      element: "dropdown",
      name: "Age Restriction",
      storeAs: "ageRestriction",
      choices: [
        { name: "Don't Change" },
        { name: "Disabled" },
        { name: "Enabled" },
      ]
    },
    "-",
    {
      element: "dropdown",
      name: "Slowmode",
      storeAs: "slowmode",
      extraField: "rateLimit",
      choices: [
        { name: "Don't Change" },
        { name: "None" },
        { name: "Custom (Seconds)", field: true },
        { name: "5s" },
        { name: "10s" },
        { name: "15s" },
        { name: "30s" },
        { name: "60s" },
        { name: "2m" },
        { name: "5m" },
        { name: "10m" },
        { name: "15m" },
        { name: "30m" },
        { name: "1h" },
        { name: "2h" },
        { name: "6h" }
      ]
    }
  ],

  compatibility: ["Any"],
  subtitle: (data, constants) => {
    return `Channel: ${constants.channel(data.channel)}`
  },

  script: (util) => {
    util.events.on('change', () => {
      if (util.data.topicChange == 'Change') {
        util.UI[7].element = 'largeInput'
      } else {
        util.UI[7].element = ' '
      }

      util.updateUI()
    })
  },
  async run(values, message, client, bridge) {
    let channel = await bridge.getChannel(values.channel)

    let edits = {}

    if (values.nameChange == 'Change') {
      edits.name = bridge.transf(values.name);
    }

    if (values.category.type == 'none') {
      edits.parentID = null;
    } else if (values.category.type != 'unchanged') {
      edits.parentID = await bridge.get(values.category);
      edits.parentID = await edits.parentID.id;
    }

    if (values.topicChange == 'Change') {
      edits.topic = bridge.transf(values.topic)
    }

    if (values.positionChange == 'Change') {
      edits.position = bridge.transf(values.position)
    }

    if (values.ageRestriction != "Don't Change") {
      if (values.ageRestriction == 'Disabled') {
        edits.nsfw = false
      } else {
        edits.nsfw = true
      }
    }

    if (values.slowmode != "Don't Change") {
      let slowmodeTranslations = {
        "None": 0,
        "5s": 5,
        "10s": 10,
        "15s": 15,
        "30s": 30,
        "60s": 60,
        "2m": 120,
        "5m": 300,
        "10m": 600,
        "15m": 900,
        "30m": 1800,
        "1h": 3600,
        "2h": 7200,
        "6h": 21600
      }

      if (values.slowmode == 'Custom (Seconds)') {
        edits.rateLimitPerUser = Number(bridge.transf(values.rateLimit));
      } else {
        edits.rateLimitPerUser = slowmodeTranslations[values.slowmode]
      }

    }

    channel.edit(edits);
  },
};
