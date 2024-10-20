module.exports = {
    data: {name: "Defer Interaction"},
    category: "Interactions",
    UI: [
        {
            element: "interaction",
            storeAs: "interaction",
        },
        "_",
        {
          element: "toggle",
          storeAs: "replyToInteraction",
          name: "If Possible, Defer The Current Interaction"
        },
        "-",
        {
            element: "toggle",
            name: "Make Interaction Ephemeral?",
            storeAs: "ephemeral"
        }
    ],
    compatibility: ["Any"],
    subtitle: (data, constants) => {
        return `Ephemeral: ${data.ephemeral ? "Yes" : "No"}`
    },

    async run(values, inter, client, bridge) {
        let interaction;

        let replyInteraction = bridge.getTemporary({class: "interactionStuff", name: "current"});
        if (values.replyToInteraction && replyInteraction?.getOriginal) {
          interaction = replyInteraction;
        } else {
          interaction = await bridge.getInteraction(values.interaction)
        }

        interaction.defer(values.ephemeral ? 64 : undefined)
    }
}