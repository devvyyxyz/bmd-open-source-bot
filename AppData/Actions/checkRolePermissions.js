const p = {
  'ADMINISTRATOR': "Administrator",
  'MODERATE_MEMBERS': "Moderate Members",
  'KICK_MEMBERS': "Kick Members",
  'BAN_MEMBERS': "Ban Members",
  'MANAGE_ROLES': "Manage Roles",
  'MANAGE_MESSAGES': "Manage Messages",
  'ADD_REACTIONS': "Add Reactions",
  'ATTACH_FILES': "Attach Files",
  'MANAGE_CHANNELS': "Manage Channels",
  'MANAGE_WEBHOOKS': "Manage Webhooks",
  'CHANGE_NICKNAME': "Change Nickname",
  'MANAGE_NICKNAMES': "Manage Nicknames",
  'CREATE_PUBLIC_THREADS': "Create Threads",
  'CREATE_PRIVATE_THREADS': "Create Private Threads",
  'MANAGE_THREADS': "Manage Threads",
  'CREATE_EVENTS': "Create Events",
  'MANAGE_EVENTS': "Manage Events",
  'MENTION_EVERYONE': "Mention Everyone",
  'VIEW_AUDIT_LOG': "View Audit",
  'MANAGE_GUILD': "Manage Server",
  'SPEAK': "Speak",
  'CONNECT': "Join Voice Channels",
  'MUTE_MEMBERS': "Mute Members",
  'DEAFEN_MEMBERS': "Deafen Members",
  'MOVE_MEMBERS': "Move Members",
  'USE_VAD': "Use VAD",
  'USE_SOUNDBOARD': "Use Soundboard",
  'USE_EXTERNAL_SOUNDS': "Use External Sounds",
  'USE_EXTERNAL_EMOJIS': "Use External Emojis",
  'USE_EXTERNAL_STICKERS': "Use External Stickers",
  'SEND_VOICE_MESSAGES': "Send Voice Messages",
  'EMBED_LINKS': "Embed Links",
  'SEND_POLLS': "Send Polls",
  'SEND_MESSAGES_IN_THREADS': "Message In Threads",
  'VIEW_GUILD_INSIGHTS': "View Insights",
  'CREATE_GUILD_EXPRESSIONS': "Create Expressions",
  'MANAGE_GUILD_EXPRESSIONS': "Manage Expressions",
  'READ_MESSAGE_HISTORY': "View Message History",
  'USE_EMBEDDED_ACTIVITIES': "Use Activities",
  'PRIORITY_SPEAKER': "Priority Speaker",
  'VIEW_CHANNEL': "View Channels",
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
    name: "Check Role Permission",
  },
  category: "Permissions",
  UI: [
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
      name: "If True"
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If False"
    }
  ],

  subtitle: (data, constants) => {
    return `Role: ${constants.role(data.role)} - Check: ${data.permission}`
  },

  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let permissions = swap(p);
    let permission = permissions[values.permission];
    let role = await bridge.getRole(values.role)

    if (role.permissions.has(permission)) {
      await bridge.call(values.true, values.trueActions)
    } else {
      await bridge.call(values.false, values.falseActions)
    }
  },
};
