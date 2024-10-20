const p = {
  'VIEW_CHANNEL': "View Channel",
  'SEND_MESSAGES': "Send Messages",
  'MANAGE_MESSAGES': "Manage Messages",
  'SEND_POLLS': "Send Polls",
  'ATTACH_FILES': "Attach Files",
  'ADD_REACTIONS': "Add Reactions",
  'USE_EXTERNAL_EMOJIS': "Use External Expressions",
  'MANAGE_WEBHOOKS': "Manage Webhooks",
  'CREATE_PUBLIC_THREADS': "Create Threads",
  'CREATE_PRIVATE_THREADS': "Create Private Threads",
  'MANAGE_THREADS': "Manage Threads",
  'MANAGE_ROLES': "Manage Permissions",
  'MENTION_EVERYONE': "Mention Everyone",
  'SPEAK': "Speak",
  'CONNECT': "Connect",
  'MUTE_MEMBERS': "Mute Members",
  'DEAFEN_MEMBERS': "Deafen Members",
  'MOVE_MEMBERS': "Move Members",
  'USE_VAD': "Use VAD",
  'USE_SOUNDBOARD': "Use Soundboard",
  'USE_EXTERNAL_SOUNDS': "Use External Sounds",
  'MANAGE_CHANNELS': "Manage Channel",
  'USE_EXTERNAL_STICKERS': "Use External Stickers",
  'SEND_VOICE_MESSAGES': "Send Voice Messages",
  'EMBED_LINKS': "Embed Links",
  'SEND_MESSAGES_IN_THREADS': "Message In Threads",
  'READ_MESSAGE_HISTORY': "View Message History",
  'USE_EMBEDDED_ACTIVITIES': "Use Activities",
  'PRIORITY_SPEAKER': "Priority Speaker",
}
function swap(json) {
  var ret = {};
  for (var key in json) {
    ret[json[key]] = key;
  }
  return ret;
}

module.exports = {
  data: {
    name: "Set Member Channel Permissions",
    dontCopy: true
  },
  category: "Permissions",
  UI: [
    {
      element: "member",
      storeAs: "member",
      name: "Member"
    },
    "_",
    {
      element: "channel",
      storeAs: "channel",
      excludeUsers: true
    },
    "-",
    {
      element: "menu",
      name: "Permissions",
      storeAs: "permissions",
      max: 24,
      types: {
        memberPermission: "Permission"
      },
      UItypes: {
        memberPermission: {
          name: "Permission",
          preview: '`${option.data.action}: ${option.data.permission}`',
          data: { action: "Deny", permission: "View Channel" },
          UI: [
            {
              element: "dropdown",
              storeAs: "action",
              name: "Permission Action",
              choices: [
                { name: "Allow" },
                { name: "Neutralize" },
                { name: "Deny" }
              ]
            },
            "-",
            {
              element: "dropdown",
              storeAs: "permission",
              forcePush: true,
              name: "Permission",
              choices: Object.values(p).map(permission => { return { name: permission } })
            },
          ]
        }
      }
    }
  ],

  subtitle: (data, constants) => {
    return `Member: ${constants.member(data.member)} - Channel: ${constants.channel(data.channel)}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let permissions = swap(p)

    let channel = await bridge.getChannel(values.channel);
    let member = await bridge.getUser(values.member);
    member = member.member;
    const { Permissions } = require('oceanic.js');

    let memberPermissions = channel.permissionsOf(member).json;

    let allowedPermissions = {};

    for (let i in values.permissions) {
      let permission = values.permissions[i].data;
      if (permission.action == 'Allow') {
        memberPermissions[permissions[permission.permission]] = true;
        allowedPermissions[permissions[permission.permission]] = true;
      } else if (permission.action == 'Neutralize') {
        delete memberPermissions[permissions[permission.permission]]
      } else {
        memberPermissions[permissions[permission.permission]] = false;
      }
    }

    let endPermissions = BigInt(0);
    let deniedPermissions = BigInt(0);

    for (let permission in memberPermissions) {
      if (memberPermissions[permission] == true) {
        if (!member.permissions.has(permission) || allowedPermissions[permission]) {
          endPermissions = BigInt(Permissions[permission]) + BigInt(endPermissions)
        }
      } else {
        deniedPermissions = BigInt(Permissions[permission]) + BigInt(deniedPermissions)
      }
    }

    await channel.editPermission(member.id, {
      allow: endPermissions,
      deny: deniedPermissions,
      type: 1
    })
  },
};