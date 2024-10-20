const { ComponentTypes } = require("oceanic.js");

module.exports = {
  data: {
    name: "Disable/Re-Enable Component(s)",
  },
  category: "Messaging",
  UI: [
    {
      element: "message",
      storeAs: "message"
    },
    {
      element: "toggle",
      storeAs: "replyToInteraction",
      name: "Message Is An Interaction Reply"
    },
    "-",
    {
      element: "typedDropdown",
      name: "Target",
      storeAs: "target",
      choices: {
        all: { name: "All Components" },
        all_buttons: { name: "All Buttons" },
        all_select_menus: { name: "All Select Menus" },
        all_role_select_menus: { name: "All Role Select Menus" },
        all_channel_select_menus: { name: "All Channel Select Menus" },
        all_member_select_menus: { name: "All Member Select Menus" },
        specific_row: { name: "Component Row #", field: true },
        specific_button: { name: "Button From Row #", field: true },
      }
    },
    "-",
    {
      element: "",
      storeAs: "button_index",
      name: "Button #"
    },
    "-",
    {
      element: "toggle",
      storeAs: "state",
      name: "State",
      true: "Re-Enable",
      false: "Disable"
    },
  ],

  script: (values) => {
    function refreshElements(skipAnimation) {
      if (values.data.target.type == 'specific_button') {
        values.UI[5].element = 'input'
        values.UI[4] = "-"
      } else {
        values.UI[4] = " "
        values.UI[5].element = ''
      }

      setTimeout(() => {
        values.updateUI()
      }, skipAnimation ? 1 : values.commonAnimation * 100);
    }
    
    refreshElements(true)

    values.events.on('change', () => {
      refreshElements();
    })
  },

  subtitle: "$[comment]$",
  compatibility: ["Any"],
  async run(values, msg, client, bridge) {
    let message = await bridge.getMessage(values.message);
    let messageComponents = message.components;
    values.state = !values.state;
    function disableRow(ri) {
      let index = ri - 1;
      let components = messageComponents[index].components;
      let componentType = components[0].type;
      console.log(componentType)

      if (componentType == ComponentTypes.BUTTON) {
        for (let i in components) {
          components[i].disabled = values.state;
        }
      } else if (componentType == ComponentTypes.STRING_SELECT || componentType == ComponentTypes.ROLE_SELECT || componentType == ComponentTypes.CHANNEL_SELECT || componentType == ComponentTypes.USER_SELECT) {
        components[0].disabled = values.state;
      }

      messageComponents[index].components = components;
      return components;
    }
    if (values.target.type == 'all') {
      for (let i in messageComponents) {
        disableRow(Number(i) + 1);
      }
    }
    if (values.target.type == 'all_buttons') {
      for (let i in messageComponents) {
        if (messageComponents[i].components[0].type == ComponentTypes.BUTTON) {
          disableRow(Number(i) + 1)
        }
      }
    }
    if (values.target.type == 'all_select_menus') {
      for (let i in messageComponents) {
        if (messageComponents[i].components[0].type == ComponentTypes.SELECT_MENU) {
          disableRow(Number(i) + 1)
        }
      }
    }
    if (values.target.type == 'all_role_select_menus') {
      for (let i in messageComponents) {
        if (messageComponents[i].components[0].type == ComponentTypes.ROLE_SELECT_MENU) {
          disableRow(Number(i) + 1)
        }
      }
    }
    if (values.target.type == 'all_channel_select_menus') {
      for (let i in messageComponents) {
        if (messageComponents[i].components[0].type == ComponentTypes.CHANNEL_SELECT_MENU) {
          disableRow(Number(i) + 1)
        }
      }
    }
    if (values.target.type == 'all_member_select_menus') {
      for (let i in messageComponents) {
        if (messageComponents[i].components[0].type == ComponentTypes.MEMBER_SELECT_MENU) {
          disableRow(Number(i) + 1)
        }
      }
    }
    if (values.target.type == 'specific_row') {
      disableRow(bridge.transf(values.button_index))
    }
    if (values.target.type == 'specific_button') {
      let button = messageComponents[bridge.transf(values.target.value) - 1].components[bridge.transf(values.target.value) - 1];
      button.disabled = values.state;
    }

    message.edit({ components: messageComponents });
  },
};
