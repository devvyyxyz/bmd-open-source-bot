module.exports = {
  category: "Members",
  data: {
    name: "Check If Member",
  },
  UI: [
    {
      element: "memberInput",
      storeAs: "member",
      name: "Member",
    },
    "-",
    {
      element: "halfDropdown",
      name: "Check",
      storeAs: "check",
      choices: [
        {
          name: "Is Bot?",
        },
        {
          name: "Is In Voice Channel?",
        },
        {
          name: "Is Muted?",
        },
        {
          name: "Is Deafened?",
        },
        {
          name: "Is Current Server Owner?",
        },
        {
          name: "Is Boosting Current Server?",
        },
        {
          name: "Is Timed Out?",
        },
        {
          name: "Is Streaming?"
        },
        {
          name: "Is Camera On?"
        },
        {
          name: "Is Command Author",
        },
      ],
    },
    "-",
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If True",
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If False",
    },
  ],

  subtitle: (data, constants) => {
    return `Check If Member: ${constants.user(data.member)} ${data.check}`;
  },

  compatibility: ["Any"],

  async run(values, command, client, bridge) {
    const user = await bridge.getUser(values.member);
    const member = await bridge.guild.getMember(user.id);

    let output = false;

    switch (values.check) {
      case "Is Bot?":
        output = member.bot;
        break;
      case "Is In Voice Channel?":
        if (member.id != client.application.id) {
          try {
            const state = member.voiceState;
            if (state && state.channel) output = true;
          } catch (_) {}
        } else {
          const state = member.voiceState;
          try {
            if (state && state.channelID && bridge.getGlobal({ class: "voice", name: bridge.guild.id }))
              output = true;
          } catch (err) { }
        }
        break;
      case "Is Muted?":
        output = member.voiceState?.selfMute || false;
        break;
      case "Is Deafened?":
        output = member.voiceState?.selfDeaf || false;
        break;
      case "Is Current Server Owner?":
        output = member.id == member.guild.ownerID;
        break;
      case "Is Boosting Current Server?":
        output = Boolean(member.premiumSince);
        break;
      case "Is Timed Out?":
        output = Boolean(member.communicationDisabledUntil);
        break;
      case "Is Command Author":
        output = member.id == command.author.id;
        break;
      case "Is Streaming?":
        output = member.voiceState?.selfStream || false;
        break;
      case "Is Camera On?":
        output = member.voiceState?.selfVideo || false;
        break;
    }

    if (output == true) {
      await bridge.call(values.true, values.trueActions);
    } else {
      await bridge.call(values.false, values.falseActions);
    }
  },
};
