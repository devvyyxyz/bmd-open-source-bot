module.exports = {
  data: {
    name: "Edit Server",
    rules: { type: "unmodified", value: "" }
  },
  category: "Servers",
  UI: [
    {
      element: "guild",
      storeAs: "guild"
    },
    "-",
    {
      element: "image",
      storeAs: "icon",
      name: "Icon",
      optional: true,
      additionalOptions: {
        unmodified: { name: "Don't Change" }
      }
    },
    "_",
    {
      element: "image",
      storeAs: "banner",
      name: "Banner",
      optional: true,
      additionalOptions: {
        unmodified: { name: "Don't Change" }
      }
    },
    "_",
    {
      element: "image",
      storeAs: "splash",
      name: "Splash",
      optional: true,
      additionalOptions: {
        unmodified: { name: "Don't Change" }
      }
    },
    "_",
    {
      element: "image",
      storeAs: "discoverySplash",
      name: "Discovery Splash",
      optional: true,
      additionalOptions: {
        unmodified: { name: "Don't Change" }
      }
    },
    "-",
    {
      name: "Name",
      element: "dropdown",
      storeAs: "guildName",
      extraField: "newName",
      choices: [
        {
          name: "Don't Change"
        },
        {
          name: "Change",
          field: true,
          placeholder: "New Name"
        }
      ]
    },
    "-",
    {
      name: "Rules Channel",
      element: "channel",
      storeAs: "rules",
      optional: true,
      additionalOptions: {
        unmodified: { name: "Don\'t Change", field: false },
      }
    },
    "_",
    {
      name: "Boost Level Progress Bar",
      element: "typedDropdown",
      storeAs: "premiumProgressBar",
      choices: {
        unchanged: { name: "Don\'t Change" },
        show: { name: "Show" },
        show_not: { name: "Don't Show" },
      }
    },
    "_",
    {
      name: "Explicit Content Filtering",
      element: "typedDropdown",
      storeAs: "filteringLevel",
      choices: {
        undefined: { name: "Don't Change" },
        null: { name: "Disable" },
        1: { name: "Members Without Roles" },
        2: { name: "All Members" },
      }
    },
    "-",
    {
      name: "Invites",
      element: "typedDropdown",
      storeAs: "invites",
      choices: {
        unchanged: { name: "Don't Change" },
        false: { name: "Disable" },
        true: { name: "Enable" },
      }
    },
    "-",
    {
      element: "input",
      name: "Reason",
      storeAs: "reason",
      placeholder: "Optional"
    }
  ],

  compatibility: ["Any"],
  subtitle: (values, constants) => {
    return `Server: ${constants.guild(values.guild)} - Reason: ${values.reason}`
  },

  async run(values, message, client, bridge) {
    let guild = await bridge.getGuild(values.guild);

    let editParameters = {};

    editParameters.explicitContentFilter = values.filteringLevel.type;

    switch (values.premiumProgressBar.type) {
      case 'show':
        editParameters.explicitContentFilter = true
        break
      case 'show_not':
        editParameters.explicitContentFilter = false
        break
    }

    if (values.rules.type != 'unmodified') {
      if (values.rules.type == 'none') {
        editParameters.rulesChannelID = null
      } else {
        let rules = await bridge.getChannel(values.rules)
        editParameters.rulesChannelID = rules.id;
      }
    }

    if (values.icon && values.icon.type != 'unmodified') {
      editParameters.icon = await bridge.getImage(values.icon)
    }
    if (values.splash && values.splash.type != 'unmodified') {
      editParameters.splash = await bridge.getImage(values.splash)
    }
    if (values.discoverySplash && values.discoverySplash.type != 'unmodified') {
      editParameters.discoverySplash = await bridge.getImage(values.discoverySplash)
    }
    if (values.banner && values.banner.type != 'unmodified') {
      editParameters.banner = await bridge.getImage(values.banner)
    }
    if (values.invites && values.invites.type != 'unmodified') {
      editParameters.invitesDisabled = values.invites.type == 'false' ? (await guild.disableInvites()) : (await guild.enableInvites());
    }


    if (values.guildName == 'Change') {
      editParameters.name = bridge.transf(values.newName)
    }

    if (values.reason.trim() != '') {
      editParameters.reason = bridge.transf(values.reason)
    }

    await guild.edit(editParameters)
  },
};
