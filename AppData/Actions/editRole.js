module.exports = {
  category: "Roles",
  data: {
    name: "Edit Role",
    category: { value: "", type: "unchanged" }
  },
  UI: [
    {
      element: "role",
      storeAs: "role",
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
      name: "Role Color",
      storeAs: "colorChange",
      element: "dropdown",
      extraField: "color",
      choices: [
        { name: "Don't Change" },
        { name: "Change", field: true, placeholder: "HEX Color" }
      ]
    },
    "-",
    {
      name: "Role Position",
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
      element: "image",
      optional: true,
      name: "Role Icon",
      storeAs: "icon",
      additionalOptions: {
        unchanged: { name: "Unchanged", field: false }
      }
    },
    "-",
    {
      element: "dropdown",
      name: "Display Role Separately",
      storeAs: "hoisted",
      choices: [
        { name: "Don't Change" },
        { name: "Disabled" },
        { name: "Enabled" },
      ]
    },
    "-",
    {
      element: "dropdown",
      name: "Mentionability",
      storeAs: "mentionability",
      choices: [
        { name: "Don't Change" },
        { name: "Disabled" },
        { name: "Enabled" },
      ]
    },
  ],

  compatibility: ["Any"],
  subtitle: (data, constants) => {
    return `Role: ${constants.role(data.role)}`
  },

  async run(values, message, client, bridge) {
    let role = await bridge.getRole(values.role)

    let edits = {}

    if (values.nameChange == 'Change') {
      edits.name = bridge.transf(values.name);
    }

    if (values.colorChange == 'Change') {
      edits.color = bridge.transf(parseInt(bridge.transf(values.color).replace("#", ""), 16))
    }

    if (values.hoisted == 'Enabled') {
      edits.hoisted = true;
    }
    if (values.hoisted == 'Disabled') {
      edits.hoisted = false;
    }

    if (values.mentionability == 'Enabled') {
      edits.mentionable = true;
    }
    if (values.mentionability == 'Disabled') {
      edits.mentionable = false;
    }

    if (values.positionChange == 'Change') {
      edits.position = Number(bridge.transf(values.position))
    }
    if (values.icon.type != 'unchanged') {
      edits.icon = (await bridge.getImage(values.icon))
    }

    role.edit(edits);
  },
};
