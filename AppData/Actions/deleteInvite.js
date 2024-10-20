module.exports = {
  category: "Invites",
  data: {
    name: "Delete Invite",
  },
  UI: [
    {
      element: "var",
      storeAs: "invite",
      name: "Invite"
    },
  ],
  subtitle: (data, constants) => {
    return `Invite: ${constants.variable(data.invite)}`
  },
  compatibility: ["Any"],
  async run(values, _message, client, bridge) {
    let invite = bridge.get(values.invite);
    await invite.deleteInvite();
  },
};
