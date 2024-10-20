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
function swap(json){
  var ret = {};
  for(var key in json){
    ret[json[key]] = key;
  }
  return ret;
}

module.exports = {
  data: {
    name: "Check Role Permission In Channel",
  },
  category: "Permissions",
  UI: [
    {
      element: "channel",
      storeAs: "channel",
      excludeUsers: true
    },
    "_",
    {
      element: "role",
      storeAs: "role"
    },
    "-",
    {
      element: "halfDropdown",
      storeAs: "permission",
      forcePush: true,
      name: "Check If Role Has Permission",
      choices: Object.values(p).map(permission => {return {name: permission}})
    },
    "-",
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If Permission Is Allowed"
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If Permission Is Not Allowed"
    }
  ],

  subtitle: (data, constants) => {
    return `Role: ${constants.role(data.role)} - Channel: ${constants.channel(data.channel)} - Check: ${data.permission}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let permissions = swap(p)

    let permission = permissions[values.permission];
    let role = await bridge.getRole(values.role)
    let channel = await bridge.getChannel(values.channel)

    let rolePermissionsInChannel = channel.permissionOverwrites.find(permissionOverwrite => permissionOverwrite.type == 0 && permissionOverwrite.id == role.id);

    if (rolePermissionsInChannel.has(permission)) {
      await bridge.call(values.true, values.trueActions)
    } else {
      await bridge.call(values.false, values.falseActions)
    }
  },
};
