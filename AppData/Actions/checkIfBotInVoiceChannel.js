module.exports = {
  category: "Bot",
  data: {
    name: "Check If Bot In Voice Channel",
  },
  UI: [
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If Bot Is In Voice Channel"
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If Isn't In Voice Channel"
    }
  ],
  subtitle: "",
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let member = bridge.guild.members.get(client.application.id) || (await client.rest.users.get(client.application.id));
    let output = false;

    const res = member.voiceState;
    try {
      if (res?.channelID && bridge.getGlobal({ class: "voice", name: bridge.guild.id })) {
        output = true;
      }
    } catch (err) {}

    if (output) {
      await bridge.call(values.true, values.trueActions)
    } else {
      await bridge.call(values.false, values.falseActions)
    }
  },
};
