module.exports = {
  data: {
    name: "Edit Emoji",
    allowedRoles: { type: "unmodified", value: "" }
  },
  category: "Emoji",
  UI: [
    {
      element: "variable",
      name: "Emoji",
      storeAs: "emoji"
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
      element: "var",
      name: "Allowed Roles",
      storeAs: "allowedRoles",
      additionalOptions: {
        unmodified: { name: "Don't Change" },
        disable: { name: "Disable" },
      }
    }
  ],
  subtitle: "$[comment]$",
  compatibility: ["Any"],
  run(values, message, client, bridge) {
    let emoji = bridge.get(values.emoji);
    let edits = {}

    if (values.nameChange == 'Change') {
      edits.name = bridge.transf(values.name);
    }

    if (values.allowedRoles.type != 'unmodified') {
      if (values.allowedRoles.type == 'disabled') {
        edits.roles = null;
      } else {
        edits.roles = bridge.get(values.allowedRoles).map(r => r.id);
      }
    }

    bridge.guild.editEmoji(emoji.id, edits)
  },
};
