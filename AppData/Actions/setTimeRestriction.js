module.exports = {
  data: { name: "Set Time Restriction", user: {type: "any", value: ""} },
  category: "Control",
  UI: [
    {
      element: "dropdown",
      storeAs: "timeUnit",
      extraField: "time",
      name: "Restriction Cooldown",
      choices: [
        {
          name: "Seconds",
          field: true
        },
        {
          name: "Minutes",
          field: true
        },
        {
          name: "Hours",
          field: true
        },
      ]
    },
    "-",
    {
      element: "user",
      storeAs: "user",
      name: "Restricted User",
      also: {
        any: "Any"
      },
      and: {
        any: false
      }
    },
    "-",
    {
      element: "store",
      name: "If Ongoing, Store Remaining Seconds Until Restriction Lift As",
      storeAs: "store"
    },
    "-",
    {
      element: "case",
      name: "If The Time Restriction Is Ongoing",
      storeAs: "ifOngoing",
      storeActionsAs: "ifOngoingActions"
    }
  ],

  guide: [
    {
      element: "text",
      text: "What is a time restriction?",
      large: true
    },
    {
      element: "text",
      text: "A time restriction is a way to limit a command (or event). It will not affect actions placed behind it."
    },
    "-",
    {
      element: "text",
      text: "What is a restricted user?",
      large: true
    },
    {
      element: "text",
      text: "The restricted user is the target of the time restriction. If set to \"Any\", one user running the command will trigger the restriction for everybody else."
    },
  ],

  subtitle: "Restriction: $[time]$ $[timeUnit]$",
  async run(values, message, client, bridge) {
    var timeAmount = parseInt(bridge.transf(values.time));
    let time;
    switch (values.timeUnit) {
      case "Seconds":
        time = 1000 * timeAmount;
        break;
      case "Minutes":
        time = 1000 * 60 * timeAmount;
        break;
      case "Hours":
        time = 1000 * 60 * 60 * timeAmount;
        break;
    }


    let user;
    if (values.user.type != 'any') {
      user = await bridge.getUser(values.user)
    }

    function storeRemainingTime(cooldownEnd) {
      if (values.store) {
        bridge.store(values.store, Math.round((new Date().getTime() - Number(cooldownEnd)) / 1000).toString().replaceAll('-', "")) // i forgot how to remove the -
      }
    }

    async function runRestriction() {
      await bridge.call(values.ifOngoing, values.ifOngoingActions)
    }
    if (user) {
      let userCooldown = bridge.getGlobal({class: `${bridge.data.commandID}${user.id}`, name: "restriction"});
      if (userCooldown <= new Date().getTime() || !userCooldown) {
        bridge.createGlobal({class: `${bridge.data.commandID}${user.id}`, name: "restriction", value: Number(time) + new Date().getTime()})
      } else {
        storeRemainingTime(userCooldown)
        await runRestriction()
      }
    } else {
      let globalCooldown = bridge.getGlobal({class: `${bridge.data.commandID}`, name: "restriction"});
      if (globalCooldown <= new Date().getTime() || !globalCooldown) {
        bridge.createGlobal({class: `${bridge.data.commandID}`, name: "restriction", value: Number(time) + new Date().getTime()})
      } else {
        storeRemainingTime(globalCooldown)
        await runRestriction()
      }
    }
  },
};
