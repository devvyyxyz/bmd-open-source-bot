module.exports = {
  data: {
    name: "Edit Thread",
  },
  category: "Threads",
  UI: [
    {
      element: "channel",
      storeAs: "thread",
      name: "Thread"
    },
    "-",
    {
      element: "dropdown",
      storeAs: "threadName",
      extraField: "newName",
      name: "Thread Name",
      choices: [
        {
          name: "Don't Change"
        },
        {
          name: "Change",
          field: true,
          placeholder: "New Thread Name"
        }
      ]
    },
    "-",
    {
      element: "dropdown",
      storeAs: "invites",
      name: "Thread Invites <span style='opacity: 50%;'> - Private Thread Only - Non-Forum Thread Only</span>",
      choices: [
        {
          name: "Don't Change"
        },
        {
          name: "Allowed"
        },
        {
          name: "Disallowed"
        }
      ]
    },
    "-",
    {
      element: "dropdown",
      storeAs: "locked",
      name: "Thread Lock",
      choices: [
        {
          name: "Don't Change"
        },
        {
          name: "Lock Thread"
        },
        {
          name: "Unlock Thread"
        }
      ]
    },
    "-",
    {
      element: "dropdown",
      storeAs: "archived",
      name: "Thread Archive",
      choices: [
        {
          name: "Don't Change"
        },
        {
          name: "Archive"
        },
        {
          name: "Unarchive"
        }
      ]
    },
    "-",
    {
      element: "menu",
      storeAs: "tags",
      max: 5,
      name: "Thread Tags Modifiers <span style='opacity: 50%;'> - Forum Thread Only</span>",

      types: {
        tag: "Tag"
      },

      UItypes: {
        tag: {
          preview: "`${option.data.action}: ${option.data.tagID}`",
          name: "Thread Tag",
          data: {name: "", action: "Remove"},
          UI: [
            {
              element: "input",
              storeAs: "tagID",
              name: "Tag ID"
            },
            "-",
            {
              element: "dropdown",
              storeAs: "action",
              name: "Tag Action",
              choices: [
                {
                  name: "Remove"
                },
                {
                  name: "Add"
                }
              ]
            }
          ]
        }
      }
    }
  ],

  compatibility: ["Any"],
  subtitle: (data, constants) => {return `Thread: ${constants.channel(data.thread)}`},

  async run(values, message, client, bridge) {
    let thread = await bridge.get(values.thread);
    let threadTags = thread.appliedTags;

    let options = {}

    if (values.threadName == 'Change') {
      options.name = bridge.transf(values.newName)
    }

    if (values.locked != `Don't Change`) {
      if (values.locked == 'Lock Thread') {
        options.locked = true;
      } else {
        options.locked = false;
      }
    }
    
    if (values.invites != `Don't Change`) {
      if (values.invites == 'Allowed') {
        options.invitable = true;
      } else {
        options.invitable = false;
      }
    }

    if (values.archived != `Don't Change`) {
      if (values.archived == 'Archive') {
        options.archived = true;
      } else {
        options.archived = false;
      }
    }

    if (values.tags.length != 0) {
      for (let tagIndex in values.tags) {
        let tag = bridge.transf(values.tags[tagIndex].data.tagID);
        if (tag.action == 'Remove') {
          let position = null;
          for (let tIndex in threadTags) {
            let t = threadTags[tIndex];
            if (t == tag) {
              position = tIndex
            }
          }

          if (position != null) {
            threadTags.splice(position, 1);
          }
        } else {
          if (!threadTags.includes(tag)) {
            threadTags.push(tag)
          }
        }
      }
      options.appliedTags = threadTags;
    }

    thread.edit(options);
  },
};
