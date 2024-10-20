const { Member } = require("oceanic.js");

module.exports = {
  category: "Members",
  data: {
    name: "Get Member Info",
  },
  UI: [
    {
      element: "member",
      storeAs: "member",
      name: "Member"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "get",
      name: "Get",
      choices: {
        name: { name: "Name" },
        nickname: { name: "Nickname" },
        username: { name: "Username" },
        guild: { name: "Server" },
        id: { name: "ID" },
        avatarURL: { name: "Avatar URL" },
        bannerURL: { name: "Banner URL" },
        highestRole: { name: "Highest Role" },
        roles: { name: "Role List" },
        communicationDisabledUntil: { name: "Timeout End Timestamp" },
        joinedAt: { name: "Join Timestamp" },
        premiumSince: { name: "Boosting Start Timestamp" },
        createdAt: { name: "Account Creation Timestamp" },
        accentColor: { name: "Accent Color" },
        voiceChannel: { name: "Voice Channel" },
        status: { name: "Status" },
        statusText: { name: "Status Text" },
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
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.user(values.member)} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, message, client, bridge) {
    var output;

    let user = await bridge.getUser(values.member);

    /**
     * @type {Member}
     */
    let member = await user.member;

    switch (values.get.type) {
      case "name":
        output = user.globalName || user.username;
        break;
      case "avatarURL":
        output = member.avatarURL() || user.avatarURL();
        break;
      case "createdAt":
        output = user.createdAt.getTime();
        break;
      case "joinedAt":
        output = member.joinedAt.getTime();
        break;
      case "accentColor":
        output = (await client.rest.users.get(user.id)).accentColor.toString(16);
        break
      case "bannerURL":
        let restUser = await client.rest.users.get(user.id);
        output = restUser.bannerURL();
        break
      case "communicationDisabledUntil":
      output = member.communicationDisabledUntil?.getTime();
        break;
      case "statusText":
        try {
          output = member.presence.activities.filter(activity => activity.type == 4 && activity.name == 'Custom Status')[0].state;
        } catch (err) {
          output = ''
        }
        break
      case "status":
        if (member.presence?.activities) {
          output = member.presence.status;
        } else {
          output = '';
        }
        break
      case "voiceChannel":
        if (member.voiceState.channelID) {
          output = await bridge.getChannel({ type: 'id', value: member.voiceState.channelID });
        }
        break
      case "highestRole":
        let highestRole;
        member.roles.forEach(roleID => {
          let rolePosition = member.guild.roles.get(roleID).position;
          let role = member.guild.roles.get(roleID);

          if (highestRole?.position < rolePosition || !highestRole) {
            highestRole = role
          }
        });

        output = highestRole;
        break
      case "roles":
        output = [];
        for (let r in member.roles) {
          let role = member.guild.roles.get(member.roles[r]);
          output.push(role)
        }
        break
      case "nickname":
        output = member.nick || member.displayName
        break
      default:
        output = member[values.get.type];
        break
    }


    bridge.store(values.store, output)
  },
};
