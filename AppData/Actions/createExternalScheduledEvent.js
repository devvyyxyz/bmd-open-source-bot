module.exports = {
  data: {
    name: "Create External Scheduled Event",
    channel: {type: "none", value: ""},
    image: {type: "none", value: ""},
  },
  category: "Server Events",
  UI: [
    {
      element: "input",
      storeAs: "place",
      name: "Place",
      placeholder: "Link or in-person"
    },
    "-",
    {
      element: "input",
      name: "Name",
      storeAs: "title"
    },
    "_",
    {
      element: "largeInput",
      storeAs: "description",
      name: "Description",
      placeholder: "Optional"
    },
    "-",
    {
      element: "inputGroup",
      nameSchemes: ["Start ISO Date", "End ISO Date"],
      storeAs: ["startTime", "endTime"],
      placeholder: ["", "Optional"]
    },
    "-",
    {
      element: "image",
      name: "Event Image",
      also: {none: "None"},
      and: {none: false},
      storeAs: "image"
    },
    "-",
    {
      element: "input",
      storeAs: "reason",
      name: "Reason"
    }
  ],
  subtitle: (values, constants) => {
    return `${values.title} - Location: ${values.place}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let image = values.image.type == 'none' ? null : (await bridge.getImage(values.image));
    let scheduledStartTime = bridge.transf(values.startTime);
    let scheduledEndTime = bridge.transf(values.endTime);

    let name = bridge.transf(values.title);
    let description = bridge.transf(values.description);
    let reason = bridge.transf(values.reason);
    let place = bridge.transf(values.place);

    
    /**
     * @type {import("oceanic.js").CreateScheduledEventOptions}
     */
    let endEvent = {
      entityMetadata: {
        location: place,
      },
      description,
      reason,
      privacyLevel: 2,
      scheduledEndTime,
      scheduledStartTime,
      image,
      name,
      entityType: 3,
    }

    bridge.guild.createScheduledEvent(endEvent);
  },
};
