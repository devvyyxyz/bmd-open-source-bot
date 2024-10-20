module.exports = {
  data: {
    name: "Get Member Audit Log Info",
  },
  category: "Audit Logs",
  UI: [
    {
      element: "var",
      storeAs: "audit",
      name: "Audit Log",
    },
    "-",
    {
      name: "Get",
      element: "dropdown",
      storeAs: "get",
      choices: [
        {name: "Target"},
        {name: "Executor"},
        {name: "Reason"},
      ]
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    },
  ],
  subtitle: (values, constants) => {
    return `${values.get} of ${constants.variable(values.audit)} - Store As: ${constants.variable(values.store)}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    let auditLog = bridge.get(values.audit);
    let output;

    switch (values.get) {
      case "Target":
        output = client.users.get(auditLog.targetID) || (await client.rest.users.get(auditLog.targetID))
        break
      case "Executor":
        output = client.users.get(auditLog.userID) || (await client.rest.users.get(auditLog.userID))
        break
      case "Reason":
        output = auditLog.reason;
        break
    }

    bridge.store(values.store, output)
  },
};