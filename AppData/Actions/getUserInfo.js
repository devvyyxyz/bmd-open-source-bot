module.exports = {
  data: {
    name: "Get User Info",
  },
  category: "Users",
  UI: [
    {
      element: "userInput",
      storeAs: "user"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "get",
      name: "Get",
      choices: {
        name: { name: "Name" },
        username: { name: "Username" },
        id: { name: "ID" },
        avatarURL: { name: "Avatar URL" },
        bannerURL: { name: "Banner URL" },
        bot: { name: "Is Bot?" },
        createdAt: { name: "Creation Timestamp" },
        accentColor: { name: "Accent Color" },
        flags: { name: "Flags" },
      },
    },
    "-",
    {
      element: "store",
      name: "Store As",
      storeAs: "store"
    }
  ],

  compatibility: ["Any"],

  subtitle: (values, constants, thisAction) => {
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.user(values.user)} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, message, client, bridge) {
    var user = await bridge.getUser(values.user);

    let output;
      switch (values.get.type) {
        case "name":
          output = user.globalName || user.username;
          break;  
        case "avatarURL":
          output = await user.avatarURL();
          break;
        case "createdAt":
          output = user.createdAt.getTime();
          break;
        case "accentColor":
          output = (await client.rest.users.get(user.id)).accentColor.toString(16);
          break
        case "bannerURL":
          let restUser = await client.rest.users.get(user.id);
          output = restUser.bannerURL();
          break
        default:
          output = user[values.get.type];
          break
      }  
  

    bridge.store(values.store, output)
  },
};
