let auditLogTypes = {
  INVITE_CREATE: "Invite Create",
  INVITE_DELETE: "Invite Delete",
  INVITE_UPDATE: "Invite Update",
  EMOJI_CREATE: "Emoji Create",
  EMOJI_DELETE: "Emoji Delete",
  EMOJI_UPDATE: "Emoji Update",
  MESSAGE_DELETE: "Message Delete",
  MESSAGE_BULK_DELETE: "Message Bulk Delete",
  MESSAGE_PIN: "Message Pin",
  MESSAGE_UNPIN: "Message Unpin",
  ROLE_CREATE: "Role Create",
  ROLE_DELETE: "Role Delete",
  ROLE_UPDATE: "Role Update",
  MEMBER_KICK: "Member Kick",
  MEMBER_BAN: "Member Ban",
  MEMBER_BAN_REMOVE: "Member Unban",
  MEMBER_UPDATE: "Member Update",
  MEMBER_PRUNE: "Member Prune",
  MEMBER_DISCONNECT: "Member Disconnect",
  MEMBER_MOVE: "Member Move",
  MEMBER_ROLE_UPDATE: "Member Role Update",
  CHANNEL_CREATE: "Channel Create",
  CHANNEL_DELETE: "Channel Delete",
  CHANNEL_UPDATE: "Channel Update",
  CHANNEL_OVERWRITE_CREATE: "Channel Permission Overwrite Create",
  CHANNEL_OVERWRITE_DELETE: "Channel Permission Overwrite Delete",
  CHANNEL_OVERWRITE_UPDATE: "Channel Permission Overwrite Update",
  BOT_ADD: "Bot Add",
  WEBHOOK_CREATE: "Webhook Create",
  WEBHOOK_DELETE: "Webhook Delete",
  WEBHOOK_UPDATE: "Webhook Update",
  GUILD_UPDATE: "Guild Update",
}
function swap(json){
  var ret = {};
  for(var key in json){
    ret[json[key]] = key;
  }
  return ret;
}
module.exports = {
  category: "Audit Logs",
  data: {
    name: "Get Audit Log List",
    user: {type: "any", value: ""}
  },
  UI: [
    {
      element: "dropdown",
      name: "Type",
      storeAs: "type",
      choices: Object.values(auditLogTypes).map(option => {return {name: option}})
    },
    "-",
    {
      element: "dropdown",
      storeAs: "limit",
      name: "Limit",
      choices: [{name: "Default"}, {name: "Max"}]
    },
    "-",
    {
      element: "userInput",
      storeAs: "user",
      also: {any: "Any"},
      and: {any: false},
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    },
  ],
  subtitle: (values, constants) => {
    return `Type: ${values.type} - Store As: ${constants.variable(values.store)}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let guild = bridge.guild;
    let user = null;
    const { AuditLogActionTypes } = require('oceanic.js')

    if (values.user.type != 'any') {
      user = await bridge.getUser(values.user)
    }

    let audit = await guild.getAuditLog({userID: user?.id || undefined, actionType: AuditLogActionTypes[swap(auditLogTypes)[values.type]], limit: values.limit == 'Default' ? 5 : 100 });
    bridge.store(values.store, audit.entries);
  },
};
