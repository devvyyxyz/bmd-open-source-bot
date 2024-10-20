module.exports = {
  data: {
    name: "Timeout Member",
  },
  category: "Members",
  UI: [
    {
      element: "userInput",
      name: "Member",
      storeAs: "member"
    },

    "-",

    {
      element: "dropdown",
      storeAs: "unitsOfTime",
      extraField: "timeoutDuration",
      name: "Timeout For",
      choices: [
        {
          name: "Second(s)",
          field: true
        },
        {
          name: "Minute(s)",
          field: true
        },
        {
          name: "Hour(s)",
          field: true
        },
        {
          name: "Day(s)",
          field: true
        }
      ]
    },
    "-",
    {
      element: "input",
      max: 256,
      name: "Reason",
      placeholder: "Leave Blank For None",
      storeAs: "reason"
    }
  ],

  subtitle: "Amount Of Time: $[timeoutDuration]$ $[unitsOfTime]$ - Reason: $[reason]$",
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let member = await bridge.getUser(values.member)
    member = await member.member;

    let timeoutDuration = parseFloat(bridge.transf(values.timeoutDuration));
    let translations = {
      "Second(s)": 1000,
      "Minute(s)": 60 * 1000,
      "Hour(s)": 60 * 60 * 1000,
      "Day(s)": 60 * 60 * 24 * 1000
    }
    let date = new Date();
    date.setTime(parseFloat(new Date().getTime()) + Number(translations[values.unitsOfTime] * timeoutDuration));
    date = date.toISOString();

    member.edit({
      communicationDisabledUntil: date,
      reason: bridge.transf(values.reason) || undefined,
    })
  },
};
