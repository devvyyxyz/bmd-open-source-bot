let colors = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",
  FgGray: "\x1b[90m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
  BgGray: "\x1b[100m",
};

const fs = require("fs");

  /* The Data, We Need It! */ let data = JSON.parse(
  fs.readFileSync("./AppData/data.json"),
);

let processPath = '.';
if (data.structureType != '1') {
  if (fs.existsSync('./Legacy')) {
    processPath = './Legacy/';

    fs.writeFileSync('./Legacy/AppData/data.json', JSON.stringify(data));
  }
}

let textCommands = {};
let messageCommands = {};

let interactionHandlers = {
  3: {},
  2: {},
  8: {},
  6: {},
  5: {}
};

let interactionTokenMap = {};

let specificInteractionHandlers = {};
let interactionVariables = {};

let customIDs = 0;

let bridgeGlobals = {};

let cachedActions = {};
fs.readdirSync(`${processPath}/AppData/Actions`).forEach(file => {
  try {
    let action = require(`${processPath}/AppData/Actions/${file}`);
    cachedActions[file] = action;
  } catch (e) { }
});

function runInits(action, data, surroundingActions, aind) {
  try {
    if (action?.init) {
      action.init(data, {
        interactionHandlers,
        actions: surroundingActions,
        atAction: aind,
        data: {
          id: surroundingActions[aind].id
        },
        transf: (string) => { return string },
        createGlobal: (blob) => {
          if (blob.class) {
            if (!bridgeGlobals[blob.class]) {
              bridgeGlobals[blob.class] = {}
            }
            bridgeGlobals[blob.class][blob.name] = blob.value
          } else {
            bridgeGlobals[blob.name] = blob.value
          }
        },
        file: (fn) => {
          let fileName = bridge.transf(fn);
          if (fs.existsSync(`${data.prjSrc}`)) {
            return `${data.prjSrc}\\${fileName}`
          } else if (fs.existsSync(`./${fileName}`) && !fs.existsSync(fileName)) {
            return `./${fileName}`
          } else {
            return fileName
          }
        },
        getGlobal: (blob) => {
          try {
            if (blob.class) {
              return bridgeGlobals[blob.class][blob.name]
            } else {
              return bridgeGlobals[blob.name]
            }
          } catch (e) { }
        },
        generateCustomID: () => {
          customIDs++
          return 'PERS-' + customIDs
        },
      })
    }
  } catch (e) { console.error(e) }

  try {
    action.UI.forEach(e => {
      try {
        let element = e?.element;

        if (element == 'menu') {
          data[e.storeAs].forEach(menuElement => {
            runInits(e.UItypes[menuElement.type], menuElement.data)
          })
        } else if (element == 'actions') {
          let actions = data[e.storeAs];
          actions.forEach((act, aind) => {
            runInits(cachedActions[act.file], act.data, actions, aind)
          })
        } else if (element == 'case' || element == 'condition') {
          if (data[e.storeAs].type == 'runActions') {
            let actions = data[e.storeActionsAs];
            actions.forEach((act, aind) => {
              runInits(cachedActions[act.file], act.data, actions, aind)
            })
          }
        }
      } catch (error) { }
    });
  } catch (e) { }
}
try {
  data.commands.map(command => command.actions).forEach((act, index) => {
    act.forEach((action, aind) => {
      try {
        runInits(cachedActions[action.file], action.data, act, aind)
      } catch (err) { }
    });
  })
} catch (error) { }


data.commands.forEach((command, index) => {
  if (command.type != 'event') {
    if (command.trigger == 'textCommand') {
      textCommands[command.name.toLowerCase()] = {
        name: command.name,
        trigger: command.trigger,
        boundary: command.boundary,
        rejectionScenario: command.rejectionScenario,
        parameters: command.parameters,
        description: command.description,
        index
      }
      if (command.aliases) {
        command.aliases.forEach(alias => {
          if (alias != '') {
            textCommands[alias.toLowerCase()] = { ...textCommands[command.name], name: alias };
          }
        })
      }
    } else if (command.trigger == 'messageContent') {
      messageCommands[command.name.toLowerCase()] = {
        name: command.name,
        trigger: command.trigger,
        boundary: command.boundary,
        rejectionScenario: command.rejectionScenario,
        parameters: command.parameters,
        description: command.description,
        index
      }
      if (command.aliases) {
        command.aliases.forEach(alias => {
          if (alias != '') {
            messageCommands[alias] = { ...messageCommands[command.name], name: alias };
          }
        })
      }
    }
  }
});

let globVars = {};
let serVars = {};

try {
  if (fs.existsSync('./vars.json')) {
    globVars = require('./vars.json').global
    serVars = require('./vars.json').server
  }
} catch (no) { }
let commandVars = {};

try {
  const discord = require("oceanic.js");
  const {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
    InteractionTypes,
    CommandInteraction,
    UncachedEventMessage,
    PermissionNames,
  } = require("oceanic.js");

  const client = new discord.Client({
    auth: `Bot ${data.btk}`,
    gateway: {
      intents: data.intents ? Object.keys(data.intents).filter(i => data.intents[i] == true) : ["ALL"],
      getAllUsers: true
    },
    collectionLimits: {
      auditLogEntries: 500,
      groupChannels: 5000,
      messages: 10000,
      privateChannels: 3500
    }
  });

  client.getPossiblyUncachedMessage = (message) => {
    if (message instanceof UncachedEventMessage) {
      if (client.getChannel(message.channelID)) {

      }
    } else {
      return message;
    }
  }

  client.connect().catch(err => {
    if (`${err}`.includes('Failed to get gateway information')) {
      console.log(
        colors.FgWhite,
        colors.BgRed,
        `Cannot Log Into Your Bot - Invalid Token`,
        colors.Reset,
        colors.BgYellow,
        colors.FgBlack,
        `
        In order to fix this, paste in your bot's token in Settings > Bot & Project > Bot Token`,
        colors.Reset
      )
    } else {
      console.log(
        colors.FgWhite,
        colors.BgRed,
        `Cannot Log Into Your Bot - Unexpected Error`,
        colors.Reset,
        colors.BgYellow,
        colors.FgBlack,
        `
        This might be because you have disallowed some intents in the developer portal. Please Google "disallowed intents in portal discord"`,
        colors.Reset
      )
    }

  });
  process.on('unhandledRejection', (err) => {
    console.log(
      colors.FgWhite,
      colors.BgRed,
      `Unhandled Rejection`,
      colors.Reset,
      colors.BgRed,
      colors.FgWhite,
      err,
      colors.Reset
    )
  });
  process.on('uncaughtException', (err) => {
    console.log(
      colors.FgWhite,
      colors.BgRed,
      `Unhandled Rejection`,
      colors.Reset,
      colors.BgRed,
      colors.FgWhite,
      err,
      colors.Reset
    )
  });

  client.on('error', (err) => {
    console.log(
      colors.FgWhite,
      colors.BgRed,
      `Cannot Log Into Your Bot - Unexpected Error`,
      colors.Reset,
      colors.BgYellow,
      colors.FgBlack,
      `
      This might be because you have disallowed some intents in the developer portal. Please Google "disallowed intents in portal discord"`,
      colors.Reset,
      colors.Reset,
      "\n",
      `
      `,
      colors.BgRed,
      colors.FgWhite,
      err,
      colors.Reset
    )
  })
  let eventStorage = {};

  /* Project Startup */ console.log(
    `${colors.BgWhite}${colors.FgBlue}${data.name}${colors.Reset}${colors.FgGray} is starting up...${colors.Reset}`,
  );
  let wasEverStarted = false;
  let IOqueue = [];
  let cachedIO;
  let IO /* In / Out */ = {
    write: (newIO) => {
      cachedIO = newIO;
      try {
        let dir = data.prjSrc;
        fs.writeFileSync(`${dir}/AppData/Toolkit/storedData.json`, JSON.stringify(newIO));
      } catch (err) {
        fs.writeFileSync(`./AppData/Toolkit/storedData.json`, JSON.stringify(newIO));
      }
    },
    get: () => {
      if (cachedIO) return cachedIO;
      try {
        let dir = data.prjSrc;
        let endData = JSON.parse(fs.readFileSync(`${dir}/AppData/Toolkit/storedData.json`, 'utf8'));
        return endData;
      } catch (err) {
        console.log(err)
        let endData = JSON.parse(fs.readFileSync(`./AppData/Toolkit/storedData.json`, 'utf8'));
        cachedIO = endData;
        return endData;
      }
    }
  }

  client.on("ready", async () => {
    if (wasEverStarted) return;
    wasEverStarted = true;
    /* Project Start */ console.log(
      `${colors.FgGreen}${data.name} started successfully!${colors.Reset}`,
    );

    registerCommands();

    for (let i in data.commands) {
      if (data.commands[i].type == "event") {
        try {
          let eventData = data.commands[i].eventData;
          let event = require(`${processPath}/AppData/Events/${data.commands[i].eventFile}`);
          const run = (eventOptions, interaction) => {
            let endData = {}
            eventOptions.forEach((storageOption, option) => {
              endData[eventData[option]] = storageOption;
            })

            runActionArray(i, interaction, endData)
          }
          event.initialize(client, eventData, run);
        } catch (err) { console.log(err) }
      }
    };

    let guilds = client.guilds.toArray();
    let limit = 20;
    let fetchingLimit = 40;
    for (let i in guilds) {
      let guild = guilds[i];
      let channels = guild.channels.toArray()

      for (let iteration in channels) {

        /**
         * @type {discord.TextableChannel}
         */
        let channel = channels[iteration];
        let types = discord.ChannelTypes;
        let acceptedChannelTypes = [types.GUILD_TEXT, types.GUILD_VOICE, types.PUBLIC_THREAD];
        if (channel.messages < limit && acceptedChannelTypes.includes(channel.type)) {
          channel.getMessages({ limit: fetchingLimit }).then(messages => {
            for (let msg in messages) {
              channel.messages.add(messages[msg]);
            }
          })
        }
      }
    }

    let actions = fs.readdirSync(`${processPath}/AppData/Actions/`);

    for (let fileIndex in actions) {
      let fileName = actions[fileIndex];
      let action = require(`${processPath}/AppData/Actions/${fileName}`);
      if (action.startup) {
        action.startup({
          data: {
            IO,
            globalVars: globVars,
            serverVars: serVars,
          },
          fs,
          createGlobal: (blob) => {
            if (blob.class) {
              if (!bridgeGlobals[blob.class]) {
                bridgeGlobals[blob.class] = {}
              }
              bridgeGlobals[blob.class][blob.name] = blob.value
            } else {
              bridgeGlobals[blob.name] = blob.value
            }
          },
          file: (fileName) => {
            if (fs.existsSync(`${data.prjSrc}`) && !fs.existsSync(`./${fileName}`) && !fs.existsSync(fileName)) {
              return `${data.prjSrc}\\${fileName}`
            } else if (fs.existsSync(`./${fileName}`) && !fs.existsSync(fileName)) {
              return `./${fileName}`
            } else {
              return fileName
            }
          },
          getGlobal: (blob) => {
            try {
              if (blob.class) {
                return bridgeGlobals[blob.class][blob.name]
              } else {
                return bridgeGlobals[blob.name]
              }
            } catch (e) { }
          },
        }, client)
      }
    }
  });



  /* Used For Running Action Arrays - Universal Action Array Runner */
  const runActionArray = /**
   * @async
   * @param {Number | Array} at
   * @param {discord.Interaction | discord.Message} interaction
   * @param {Object | null} actionBridge
   * @param {Object | null} options
   * @returns {unknown}
   */
    async (at, interaction, actionBridge, options) => {
      return new Promise(async (resolve) => {
        let cmdActions;
        let cmdName = "Inbuilt";
        let cmdAt = "Inbuilt";
        let cmdId;
        if (typeof at == "string") {
          cmdActions = data.commands[at].actions;
          cmdName = data.commands[at].name;
          cmdAt = at;
          cmdId = data.commands[at].customId;
        } else {
          cmdActions = at;
        }

        if (options?.actionsOverwrite) {
          cmdActions = options.actionsOverwrite;
        }

        if (options?.data?.at != undefined) {
          cmdAt = options?.data?.at
        }
        if (options?.data?.name != undefined) {
          cmdName = options?.data?.name
        }

        let guild;
        if (options?.guild) {
          guild = options.guild;
        } else if (interaction?.guildID || Object.keys(interaction).includes('guild')) {
          guild = interaction.guild || interaction.guildID;
        } else {
          guild = client.guilds.first();
        }

        let temporaries = {};

        if (options?.temporaries) {
          temporaries = options.temporaries;
        }

        let finalVariables = { globalActionCache: {} };
        if (typeof actionBridge == 'object') {
          finalVariables = actionBridge
          if (!finalVariables?.globalActionCache) {
            finalVariables.globalActionCache = {};
          }
        }

        let bridge = {
          temporaries,
          guild,
          stopActionRun: false,
          variables: finalVariables,
          createGlobal: (blob) => {
            if (blob.class) {
              if (!bridgeGlobals[blob.class]) {
                bridgeGlobals[blob.class] = {}
              }
              bridgeGlobals[blob.class][blob.name] = blob.value
            } else {
              bridgeGlobals[blob.name] = blob.value
            }
          },
          file: (fn) => {
            let fileName = bridge.transf(fn.replaceAll('\\\\', '/'));
            const transfPrjSrcPath = data.prjSrc.replaceAll('\\\\', '/') + '/' + fileName;
            const transfCurrentPath = `./${fileName}`;
            const transfFileName = fileName;

            if (!fs.existsSync(transfCurrentPath) && !fs.existsSync(transfFileName)) {
              return transfPrjSrcPath;
            } else if (fs.existsSync(transfCurrentPath) && !fs.existsSync(transfFileName)) {
              return transfCurrentPath;
            } else {
              return transfFileName;
            }
          },
          getGlobal: (blob) => {
            try {
              if (blob.class) {
                return bridgeGlobals[blob.class][blob.name]
              } else {
                return bridgeGlobals[blob.name]
              }
            } catch (e) { }
          },

          createTemporary: (blob) => {
            if (blob.class) {
              if (!bridge.temporaries[blob.class]) {
                bridge.temporaries[blob.class] = {}
              }
              bridge.temporaries[blob.class][blob.name] = blob.value
            } else {
              bridge.temporaries[blob.name] = blob.value
            }
          },
          getTemporary: (blob) => {
            try {
              if (blob.class) {
                return bridge.temporaries[blob.class][blob.name]
              } else {
                return bridge.temporaries[blob.name]
              }
            } catch (e) { }
          },

          globals: {},
          data: {
            ranAt: cmdAt,
            nodeName: cmdName,
            actions: cmdActions,
            globals: bridgeGlobals,
            IO,
            interactionTokenMap,
            globalVars: globVars,
            serverVars: serVars,
            commandID: options?.commandID || cmdId,
            interactionHandlers: specificInteractionHandlers,
            invoker: {
              bridge: options?.sourceBridge,
              id: options?.sourceBridge?.data.commandID ? `${options?.sourceBridge?.data.commandID}` : undefined
            }
          },
          runner: async (source) => {
            await runActionArray(source, interaction, bridge.variables, { temporaries: bridge.temporaries, guild: bridge.guild, commandID: options?.commandID || cmdId, sourceBridge: bridge });
          },
          fs: fs,
          callActions: async (blob) => {
            let atAction = 0;
            bridge.stopActionRun = true;

            if (blob.jump) {
              atAction = Number(blob.jump) - Number(1);
            } else if (blob.skip) {
              atAction = Number(blob.skip) + Number(bridge.atAction) + Number(1)
            } else if (blob.stop) {
              bridge.stopActionRun = blob.stop;
              return;
            }

            await runActionArray(blob.actions || bridge.data.actions, interaction, bridge.variables, { startAt: atAction, guild: bridge.guild, temporaries: bridge.temporaries, commandID: options?.commandID || cmdId, sourceBridge: bridge });
          },
          call: async (blob, actions) => {
            if (blob.type == 'continue') { bridge.stopActionRun = false; return } else if (blob.type == 'stop') {
              bridge.stopActionRun = true;
            } else if (blob.type == 'skip') {
              await bridge.callActions({
                skip: parseFloat(blob.value)
              })
              bridge.stopActionRun = true;
            } else if (blob.type == 'jump') {
              await bridge.callActions({
                jump: parseFloat(blob.value)
              })
              bridge.stopActionRun = true;
            } else if (blob.type == 'runActions') {
              await bridge.runner(actions);
            } else if (blob.type == 'anchorJump') {
              bridge.stopActionRun = true;
              await bridge.runner(bridge.getGlobal({ class: "anchors", name: bridge.transf(blob.value) }));
            } else if (blob.type == 'callAnchor') {
              await bridge.runner(bridge.getGlobal({ class: "anchors", name: bridge.transf(blob.value) }));
            }

            return;
          },
          getGuild: async (blob) => {
            if (!blob || blob.type == 'current') {
              return bridge.guild;
            } else if (blob.type == 'id') {
              return (client.guilds.get(bridge.transf(blob.value)) || await client.rest.guilds.get(bridge.transf(blob.value)))
            } else {
              return (await bridge.get({ value: blob.value, type: blob.type }));
            }
          },
          toMember: async (user, guild) => {
            if (user.guild) return user
            return await bridge.guild.getMember(user.id)
          },
          toUser: async (member) => {
            if (member.createDM) return member
            return client.users.get(member.id) || await client.rest.users.get(member.id)
          },
          getUser: async (blob) => {
            let user = {};
            let member = {};

            if (blob.type == 'id') {
              user = client.users.get(bridge.transf(blob.value))
              if (!user?.createDM) {
                user = await client.rest.users.get(bridge.transf(blob.value))
              }
            } else
              if (blob.type == 'mentioned') {
                user = (interaction.message || interaction).mentions.users[0];
              } else
                if (blob.type == 'author') {
                  user = interaction.author;
                } else if (blob.type == 'messageAuthor') {
                  user = interaction.message.author;
                } else if (blob.type == 'user') {
                  user = interaction.data.author;
                } else {
                  user = await bridge.get({ value: blob.value, type: blob.type });

                  if (!user.user) {
                    if (!user?.createDM) {
                      user = await client.rest.users.get(user.id)
                    }
                  } else {
                    member = user;
                    user = user.user;
                  }
                }

            if (!user.member || Object.keys(member).length == 0) {
              try {
                member = bridge.guild.members.get(user.id);
                if (!member?.edit) {
                  member = await bridge.guild.getMember(user.id).catch((err) => { });
                }
              } catch (err) { }
            }

            user.member = member || user;

            if (!user?.id) {
              console.log(`${colors.Reset}${colors.BgRed}${colors.FgWhite}Invalid User. Next error(s) will probably be about it!${colors.Reset}`)
            }

            return user;
          },
          getRole: async (blob) => {
            let role = {};

            if (blob.type == 'id' || blob.type == 'roleID') {
              role = await bridge.guild.roles.get(bridge.transf(blob.value))
            } else if (blob.type == 'mentioned') {
              role = (interaction.message || interaction).mentions.roles[0]
              role = await bridge.guild.roles.get(role);
            } else {
              role = await bridge.get({ value: blob.value, type: blob.type })
            }

            if (!role) {
              console.log(`${colors.Reset}${colors.BgRed}${colors.FgWhite}Invalid Role. Next error(s) will probably be about it!${colors.Reset}`)
            }

            return role;
          },

          getImage: async (blob) => {
            if (blob.type == 'none') return;
            if (blob.type == 'url') {
              const undici = require('undici');
              let fetchedResult = await undici.fetch(bridge.transf(blob.value));
              let result = Buffer.from(await fetchedResult.arrayBuffer());
              return result;
            } else if (blob.type == 'file') {
              let image = fs.readFileSync(bridge.file(blob.value));
              return image
            } else {
              let image = await bridge.get({ value: blob.value, type: blob.type })
              return image
            }
          },

          getMessage: async (blob) => {
            let message = {};

            if (blob.type == 'none') return;

            if (blob.type == 'commandMessage') {
              message = (interaction.message || interaction)
            } else if (blob.type == 'interactionReply') {
              if (interaction.deffered) {
                message = await interaction.getFollowup()
              } else {
                message = await interaction.getOriginal()
              }
            } else {
              message = bridge.get({ value: blob.value, type: blob.type })
            }

            return message;
          },

          getInteraction: async (blob) => {
            let interactionResult = {};

            if (blob.type == 'commandInteraction') {
              interactionResult = interaction;
            } else {
              interactionResult = bridge.get({ value: blob.value, type: blob.type });
            }

            return interactionResult;
          },

          getChannel: async (blob) => {
            let channel;

            if (blob.type == 'id') {
              channel = client.getChannel(bridge.transf(blob.value));
              if (!channel.createMessage) {
                channel = await client.rest.channels.get(bridge.transf(blob.value));
              }
            } else
              if (blob.type == 'userID') {
                channel = (client.users.get(bridge.transf(blob.value)) || await client.rest.users.get(bridge.transf(blob.value)))
              } else
                if (blob.type == 'user') {
                  channel = interaction.data.author;
                } else
                  if (blob.type == 'mentionedChannel') {
                    channel = client.getChannel(interaction.mentions.channels[0])
                    if (!channel.createMessage) {
                      channel = await client.rest.channels.get(interaction.mentions.channels[0]);
                    }
                  } else
                    if (blob.type == 'mentionedUser') {
                      channel = interaction.mentions.users[0];
                      if (!channel.createDM) {
                        channel = await client.rest.users.get(interaction.mentions.users[0])
                      }
                    } else
                      if (blob.type == 'commandAuthor') {
                        channel = interaction.author;
                      } else
                        if (blob.type == 'command') {
                          channel = interaction.channel;
                        } else {
                          channel = await bridge.get({ value: blob.value, type: blob.type })
                        }

            try {
              if (channel.createDM) {
                channel = await channel.createDM()
              }
            } catch (err) { }

            if (!channel) {
              console.log(`${colors.Reset}${colors.BgRed}${colors.FgWhite}Invalid Channel. Next error(s) will probably be about it!${colors.Reset}`)
            }

            return channel
          },

          get: (blob) => {
            let result;

            if (blob.type == 'tempVar' || blob.type == 'temporary') {
              result = bridge.variables[blob.value]
            } else
              if (blob.type == 'serverVar' || blob.type == 'server') {
                try {
                  result = serVars[bridge.guild.id][blob.value];
                } catch (error) { }
              } else
                if (blob.type == 'globVar' || blob.type == 'global') {
                  result = globVars[blob.value]
                }

            return result
          },

          store: (blob, value) => {
            try {
              if (blob.type == 'temporary' || blob.type == 'tempVar') {
                bridge.variables[blob.value] = value
                return;
              }
              if (blob.type == 'server' || blob.type == 'serverVar') {
                if (!serVars[bridge.guild.id]) {
                  serVars[bridge.guild.id] = {}
                }
                serVars[bridge.guild.id][blob.value] = value
                return
              }
              if (blob.type == 'global' || blob.type == 'globVar') {
                if (!globVars) {
                  globVars = {}
                }
                globVars[blob.value] = value
                return
              }
            } catch (err) { console.log(err) }
          },

          generateCustomID: () => {
            customIDs++
            return `${cmdName}${bridge.atAction}` + customIDs
          },

          transf: (txt) => {
            let command = {};
            if (interaction?.author) {
              command.author = interaction.author;
              command.author.name = interaction.author.globalName || interaction.author.username;
              command.channel = interaction.channel;
              command.message = interaction;
            }

            let text = `${txt}`
            try {
              let toDiscord = (variable) => {
                if (typeof variable == 'string' || variable == undefined || typeof variable == 'number') {
                  return variable;
                } else {
                  if (variable.roles && variable.guild) {
                    return `<@${variable.id}>`
                  } else if (variable.sendTyping != undefined || variable.messages) {
                    return `<#${variable.id}>`
                  } else if (variable.avatarURL) {
                    return `<@${variable.id}>`
                  } else if (typeof variable.hoist == "boolean") {
                    return variable.mention
                  } else {
                    return variable
                  }
                }
              }

              const tempVars = (variable) => {
                return toDiscord(bridge.variables[variable])
              };
              const serverVars = (variable) => {
                try {
                  return toDiscord(serVars[bridge.guild.id][variable])
                } catch (error) {
                  return variable
                }
              };
              const globalVars = (variable) => {
                return toDiscord(globVars[variable])
              };

              let formattedText = text;
              formattedText = formattedText.replace(/`/g, '\\`');   // Escape backticks

              const evaluatedText = eval("`" + formattedText + "`");
              return evaluatedText;
            } catch (err) { console.error(err); return text }
          },
        };

        for (let action in cmdActions) {
          if (!!cmdActions[action]) {
            /* See If The Thing Is Meant To Keep Going! */
            if (bridge.stopActionRun == false) {
              let skipUntil = 0;
              if (typeof options?.startAt != 'boolean' && options?.startAt != 'NaN' && typeof options?.startAt == 'number') {
                skipUntil = options.startAt;
              } else {
                skipUntil = 0;
              }
              if (action >= skipUntil) {
                bridge.atAction = action;
                bridge.data.id = bridge.data.actions[bridge.atAction].id;
                try {
                  /* Run The Action, Make It Happen! */
                  if (!cmdActions[action].file) {
                    cmdActions[action].run(cmdActions[action].data, interaction, client, bridge)
                  } else {
                    await require(`${processPath}/AppData/Actions/${cmdActions[action].file}`).run(
                      cmdActions[action].data,
                      interaction,
                      client,
                      bridge,
                    );
                  }
                } catch (err) {
                  /* Alert The User Of The Error */
                  console.log(
                    `${colors.BgRed}${colors.FgBlack}${cmdName} ${colors.FgBlack + colors.BgWhite
                    }(@#${cmdAt})${colors.Reset + colors.BgRed + colors.FgBlack
                    } >>> ${cmdActions[action].name
                    } ${colors.FgBlack + colors.BgWhite}(@#${action})${colors.Reset + colors.BgRed + colors.FgBlack
                    } >>> Error: ${err}${colors.Reset}`,
                  );
                  console.log(err);
                }
              }
            } else {
              resolve();
              return;
            }
          }
        }
        resolve();
      });
    };

  function runRejectionScenario(commandIndex, target, scenarioType, bridge, options) {
    let command = data.commands[commandIndex];
    if (command?.rejectionScenario) {
      let scenarioTypeMap = ["notWithin", "missingPermissions"];
      let scenario = command.rejectionScenario[scenarioTypeMap[scenarioType]];
      runActionArray(commandIndex, target, (bridge || {}),
        {
          ...(options || {}),
          actionsOverwrite: scenario
        });
    }
  }

  client.on("messageCreate", async (msg) => {
    if (msg.author.id == client.application.id) return;

    if (`${msg.content}`.startsWith(data.prefix)) {
      let command = textCommands[msg.content.replace(data.prefix, '').split(' ')[0].toLowerCase()];
      if (!command) return
      let commandName = command.name;
      if (command.trigger == "textCommand") {
        if (`${data.prefix.toLowerCase()}${commandName.toLowerCase()}`.toLowerCase() == msg.content.split(" ")[0].toLowerCase()) {
          let matchesPermissions = true;
          if (command.boundary) {
            if (command.boundary.worksIn == "guild") {
              if (!msg.guildID) {
                matchesPermissions = false;
                runRejectionScenario(`${command.index}`, msg, 0);
              }
            }
            if (command.boundary.worksIn == "dms") {
              if (msg.guildID) {
                matchesPermissions = false
                runRejectionScenario(`${command.index}`, msg, 0);
              }
            }

            for (let permission in command.boundary.limits) {
              if (msg.member.permissions.has(command.boundary.limits[permission]) == false && matchesPermissions != false) {
                matchesPermissions = false;
                runRejectionScenario(`${command.index}`, msg, 1);
              }
            }
          }
          if (matchesPermissions == true) {
            runActionArray(`${command.index}`, msg);
          }
        }
      }
    }

    for (let cmd in messageCommands) {
      let command = messageCommands[cmd];

      let messageContent = `${msg.content}`;
      if (messageContent.toLowerCase().includes(command.name.toLowerCase())) {
        let matchesPermissions = true;
        if (command.boundary) {
          if (command.boundary.worksIn == "guild") {
            if (!msg.guild) {
              matchesPermissions = false;
              runRejectionScenario(`${command.index}`, msg, 0)
            }
          }
          if (command.boundary.worksIn == "dms") {
            if (msg.guild) {
              matchesPermissions = false
              runRejectionScenario(`${command.index}`, msg, 0)
            }
          }

          for (let permission in command.boundary.limits) {
            if (msg.member.permissions.has(command.boundary.limits[permission]) == false && matchesPermissions != false) {
              matchesPermissions = false;
              runRejectionScenario(`${command.index}`, msg, 1)
            }
          }
        }

        if (matchesPermissions == true) {
          runActionArray(`${command.index}`, msg);
        }
      }
    }
  });

  let commands = [];
  let commandIndexes = {};
  for (let i in data.commands) {
    let command = data.commands[i]
    if (command.trigger == 'slashCommand') {
      if (command.name.includes(' ')) {
        let supposedName = command.name.split(' ')[0].toLowerCase();
        if (commandIndexes[supposedName] == undefined) {
          commands.push({
            name: supposedName,
            description: command.description || "No Description!",
            options: [],
            type: "slash",
            trigger: command.trigger,
            command: command
          });

          commandIndexes[supposedName] = commands.length - 1;
        }
      }
    }
  }

  for (let i in data.commands) {
    if (data.commands[i].trigger == "slashCommand") {
      let description = data.commands[i].description || "No Description";
      let commandParameters = [];

      for (let parameter of data.commands[i].parameters) {
        let parameterType;
        let isRequired;
        let types = {
          role: ApplicationCommandOptionTypes.ROLE,
          channel: ApplicationCommandOptionTypes.CHANNEL,
          user: ApplicationCommandOptionTypes.USER,
          integer: ApplicationCommandOptionTypes.INTEGER,
          boolean: ApplicationCommandOptionTypes.BOOLEAN,
          string: ApplicationCommandOptionTypes.STRING,
          attachment: ApplicationCommandOptionTypes.ATTACHMENT,
        }

        /* Create & Push The Parameter */
        let additionalOptions = {};
        if (parameter.type == 'string' && parameter.completion && parameter.choices.length > 0) {
          additionalOptions.choices = parameter.choices
        }

        let endParameter = {
          name: parameter.name.toLowerCase(),
          type: types[parameter.type.toLowerCase()],
          required: parameter.required,
          description: parameter.description || "No Description",
          ...additionalOptions,
          autocomplete: parameter.autocompletion || false
        };
        commandParameters.push(endParameter);
      }

      /* Moving On To The Command In Itself */
      let commandName = data.commands[i].name.trim().toLowerCase();
      if (commandName.includes(' ')) {
        commandName = commandName.split(' ')[1]
      }

      const command = {
        name: commandName,
        description: description,
        options: commandParameters,
        boundary: data.commands[i].boundary,
        rejectionScenario: data.commands[i].rejectionScenario,
        trigger: data.commands[i].trigger,
        command: data.commands[i]
      };

      if (!data.commands[i].name.includes(' ')) {
        commands.push(command)
      } else {
        command.type = ApplicationCommandTypes.CHAT_INPUT;
        command.command = data.commands[i];
        commands[commandIndexes[data.commands[i].name.split(' ')[0].toLowerCase()]].options.push(command)
      }

    } else if (data.commands[i].trigger == 'user') {
      let commandName = data.commands[i].name.trim();
      const command = {
        name: commandName,
        boundary: data.commands[i].boundary,
        rejectionScenario: data.commands[i].rejectionScenario,
        type: "user",
      };
      commands.push(command);
    } else if (data.commands[i].trigger == 'message') {
      let commandName = data.commands[i].name.trim();
      const command = {
        name: commandName,
        boundary: data.commands[i].boundary,
        rejectionScenario: data.commands[i].rejectionScenario,
        type: "message",
        trigger: data.commands[i].trigger
      };
      commands.push(command);
    }
  }

  let lastKnownValues = {};

  client.on("interactionCreate", async (interaction) => {
    const defineGuildBasedOnContext = () => {
      if (interaction.context == 0) {
        Object.defineProperty(interaction, 'guild', { value: undefined })
        Object.defineProperty(interaction.data, 'guildID', { value: undefined })
      }
    }


    /* Check If The Interaction Was A Slash Command Or Not */
    if (interaction.type == InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE) {
      let foundCommand = commands.find((c) => c.name == interaction.data.name);
      let foundApplicationCommand = interaction;
      let subCommand = interaction.data.options.getSubCommand(false);
      foundApplicationCommand.data.options = foundApplicationCommand.data.options.raw;
      foundApplicationCommand.options = foundApplicationCommand.data.options;
      let foundCommandName = `${foundCommand.name}`;
      if (subCommand) {
        subCommand = subCommand[0]
        foundApplicationCommand = foundApplicationCommand.data.options[0];
        foundCommand = foundCommand.options.find(o => o.name == subCommand);
        foundCommandName += ` ${foundCommand.name}`;
      }

      let updated = foundApplicationCommand.options.find(option => {
        return option.focused == true;
      });
      let data = foundCommand.command.parameters.find(o => o.name == updated.name).bound;
      runActionArray([
        {
          name: `Autocompletion (@parameter ${updated.name})`,
          data,
          run: async (values, message, client, bridge) => {
            bridge.store(values.storeInputAs, updated.value);
            bridge.store(values.storeInteractionAs, interaction);
            await bridge.runner(values.actions);
            let results = bridge.get(values.result);
            if (results?.length != 0 && !!results) {
              interaction.result(results.map(r => {
                if (!r.value) {
                  return {
                    value: r,
                    name: r
                  }
                } else {
                  return r
                }
              }))
            }
          }
        }
      ], interaction, undefined, {
        executeDirectly: true,
      })

    } else if (interaction.data.type == ApplicationCommandTypes.CHAT_INPUT) {
      /* Storage For Parameters */
      let commandParametersStorage = {};

      for (let i in data.commands) {
        let command = data.commands[i];
        if (
          command.trigger == "slashCommand" &&
          interaction.data.name == (command.name.includes(' ') ? command.name.split(' ')[0].toLowerCase() : command.name.toLowerCase())
          && (() => {
            if (interaction.data.options.getSubCommand(false)) {
              let cmd = commands[commandIndexes[interaction.data.name]].options.find(option => option.name.toLowerCase() == interaction.data.options.getSubCommand(false)[0]).command;
              return cmd.name.split(' ')[1].toLowerCase() == interaction.data.options.getSubCommand(false)[0]
            } else {
              return true
            }
          })()
        ) {
          if (interaction.data.options.getSubCommand(false)) {
            command = commands[commandIndexes[interaction.data.name]].options.find(option => option.name == interaction.data.options.getSubCommand(false)[0]).command;
          }

          if (
            command.parameters != undefined &&
            command.parameters[0] != undefined
          ) {
            for (let e in command.parameters) {
              let parameterType = command.parameters[e].type;
              let values = command.parameters[e].name;
              let option;

              switch (parameterType) {
                case "string":
                  option =
                    interaction.data.options.getString(values, false)
                  break;
                case "boolean":
                  option =
                    interaction.data.options.getBoolean(values, false)
                  break;
                case "user":
                  if (interaction.data.options.getUser(values, false)) {
                    option = await client.rest.users.get(interaction.data.options.getUser(values, false).id);
                  }
                  break;
                case "role":
                  option =
                    interaction.data.options.getRole(values, false)
                  break;
                case "channel":
                  if (interaction.data.options.getChannel(values, false)) {
                    option = client.getChannel(interaction.data.options.getChannel(values, false).id);
                  }
                  break;
                case "integer":
                  option =
                    interaction.data.options.getInteger(values, false)
                  break;
                case "attachment":
                  option = interaction.data.options.getAttachment(values, false);
                  break
              }
              commandParametersStorage[command.parameters[e].storeAs] = option;
            }
          }
          let bridge = {
            temporaries: {
              interactionStuff: {
                current: interaction
              }
            },
            data: {
              at: `${i}`,
              name: command.name
            },
          }
          let matchesPermissions = true;
          if (command.boundary) {
            if (command.boundary.installable) {
              defineGuildBasedOnContext()
            }
            if (command.boundary.worksIn == "guild") {
              if (!interaction.guildID) {
                matchesPermissions = false;
                runRejectionScenario(`${command.index}`, interaction, 0, bridge)
              }
            }

            if (command.boundary.worksIn == "dms") {
              if (interaction.guildID) {
                matchesPermissions = false;
                runRejectionScenario(`${command.index}`, interaction, 0, bridge)
              }
            }

            if (interaction.guild && matchesPermissions) {
              for (let permission in command.boundary.limits) {
                if (matchesPermissions) {
                  matchesPermissions = (interaction.member.permissions.has(command.boundary.limits[permission]));
                  runRejectionScenario(`${command.index}`, interaction, 1, bridge)
                }
              }
            }
          }

          if (matchesPermissions) {
            interaction.author = interaction.user;


            runActionArray(command.actions, interaction, commandParametersStorage, bridge);
            return
          }
        }
      }
    } else if (interaction.data.type == ApplicationCommandTypes.MESSAGE) {
      for (let i in data.commands) {
        let bridge = {
          temporaries: {
            interactionStuff: {
              current: interaction
            }
          },
        }
        let command = data.commands[i];

        if (command.name == interaction.data.name && command.trigger == 'message') {
          let matchesPermissions = true;
          if (command.boundary) {
            if (command.boundary.installable) {
              defineGuildBasedOnContext()
            } else {
              if (command.boundary.worksIn == "guild") {
                if (!interaction.guildID) {
                  matchesPermissions = false;
                  runRejectionScenario(`${command.index}`, interaction, 0, bridge);
                }
              }

              if (command.boundary.worksIn == "dms") {
                if (interaction.guildID) {
                  matchesPermissions = false;
                  runRejectionScenario(`${command.index}`, interaction, 0, bridge);
                }
              }

              if (interaction.guild && matchesPermissions) {
                for (let permission in command.boundary.limits) {
                  if (matchesPermissions) {
                    matchesPermissions = (interaction.member.permissions.has(command.boundary.limits[permission]));
                    runRejectionScenario(`${command.index}`, interaction, 1, bridge);
                  }
                }
              }
            }
          }

          if (matchesPermissions) {
            interaction.author = interaction.user;
            interaction.data.author = interaction.data.target.author;
            interaction.message = interaction.data.target;
            runActionArray(`${i}`, interaction, {}, bridge);
          }
        }
      }
    } else if (interaction.data.type == ApplicationCommandTypes.USER) {
      for (let i in data.commands) {
        let command = data.commands[i];

        if (command.name.trim() == interaction.data.name && command.trigger == 'user') {
          let matchesPermissions = true;
          if (command.boundary) {
            if (command.boundary.installable) {
              defineGuildBasedOnContext()
            } else {
              if (command.boundary.worksIn == "guild") {
                if (!interaction.guildID) {
                  matchesPermissions = false;
                  runRejectionScenario(`${command.index}`, interaction, 0, bridge)
                }
              }

              if (command.boundary.worksIn == "dms") {
                if (interaction.guildID) {
                  matchesPermissions = false;
                  runRejectionScenario(`${command.index}`, interaction, 0, bridge)
                }
              }

              let bridge = {
                temporaries: {
                  interactionStuff: {
                    current: interaction
                  }
                },
              }
              
              if (interaction.guild && matchesPermissions) {
                for (let permission in command.boundary.limits) {
                  if (matchesPermissions) {
                    matchesPermissions = (interaction.member.permissions.has(command.boundary.limits[permission]));
                    runRejectionScenario(`${command.index}`, interaction, 1, bridge);
                  }
                }
              }
            }
          }

          if (matchesPermissions) {
            interaction.author = interaction.user;
            interaction.data.author = interaction.data.target;

            runActionArray(`${i}`, interaction, {}, {
              temporaries: {
                interactionStuff: {
                  current: interaction
                }
              },
            });
          }
        }
      }
    }
  });

  client.on('interactionCreate', async (interaction) => {
    interactionTokenMap[interaction.id] = interaction.token;

    setTimeout(() => {
      delete interactionTokenMap[interaction.data.id];
    }, 90000);

    if ((interaction.isButtonComponentInteraction && interaction.isSelectMenuComponentInteraction && interaction.data.type != ApplicationCommandTypes.CHAT_INPUT) && (interaction.isButtonComponentInteraction() || interaction.isSelectMenuComponentInteraction())) {
      let variables = {};
      let store = (blob, value) => {
        try {
          if (blob.type == 'temporary' || blob.type == 'tempVar') {
            variables[blob.value] = value
            return;
          }
          if (blob.type == 'server' || blob.type == 'serverVar') {
            if (!serVars[interaction.guildID]) {
              serVars[interaction.guildID] = {}
            }
            serVars[interaction.guildID][blob.value] = value
            return
          }
          if (blob.type == 'global' || blob.type == 'globVar') {
            globVars[blob.value] = value
            return
          }
        } catch (err) { console.log(err) }
      }

      let temporaries = {};

      let createTemporary = (blob) => {
        if (blob.class) {
          if (!temporaries[blob.class]) {
            temporaries[blob.class] = {}
          }
          temporaries[blob.class][blob.name] = blob.value
        } else {
          temporaries[blob.name] = blob.value
        }
      }

      createTemporary({ class: 'interactionStuff', name: 'current', value: interaction })

      if (specificInteractionHandlers[interaction.message.id] && specificInteractionHandlers[interaction.message.id][interaction.data.customID]) {
        let componentConnections = specificInteractionHandlers[interaction.message.id];
        let connection = componentConnections[interaction.data.customID];
        const { ComponentTypes } = require('oceanic.js');

        if (interaction.data.componentType == ComponentTypes.STRING_SELECT) {
          let selectionList = [];
          await interaction.data.values.raw.forEach(async (value) => {
            selectionList.push(connection.options[value].pushValue)
            await connection.options[value].run(interaction);
          });

          connection.run(interaction, selectionList);
        } else if (interaction.data.componentType == ComponentTypes.BUTTON) {
          connection.run(interaction);
        } else {
          let selectionList = [];

          let type = connection.type;
          await interaction.data.values.raw.forEach(async (value) => {
            if (type == 'channels') {
              let channel = client.getChannel(value) || await client.rest.channels.get(value);

              selectionList.push(channel);
            } else if (type == 'roles') {
              let role = interaction.guild.roles.get(value);

              selectionList.push(role);
            } else if (type == 'users') {
              let user = client.users.get(value) || await client.rest.users.get(value);

              selectionList.push(user);
            }
          });

          connection.run(interaction, selectionList);
        }
      }

      if (interactionHandlers[interaction.data.componentType] && interactionHandlers[interaction.data.componentType][interaction.data.customID]) {
        if (interactionHandlers[interaction.data.componentType][interaction.data.customID].variables) variables = interactionHandlers[interaction.data.componentType][interaction.data.customID].variables;
        let component = interactionHandlers[interaction.data.componentType][interaction.data.customID];
        if (component.interactionStorage) {
          store(component.interactionStorage, interaction)
        }
        if (component.storeInteractionAuthorAs) {
          store(component.storeInteractionAuthorAs, interaction.user)
        }


        if (component.optionsStorage && component.raw) {
          let pushValues = [];
          interaction.data.values.raw.forEach(value => {
            pushValues.push(component.options[value].pushValue)
            runActionArray(component.options[value].actions, interaction.message, variables, { temporaries })
          });
          store(component.optionsStorage, pushValues);

        } else if (component.optionsStorage) {
          const { ComponentTypes } = require('oceanic.js')

          let selectionList = interaction.data.values.raw;
          let endList = [];

          switch (interaction.data.componentType) {
            case ComponentTypes.CHANNEL_SELECT:
              selectionList.forEach(async channelID => {
                let channel = client.getChannel(channelID);
                if (!channel.edit) {
                  channel = await client.rest.channels.get(channelID)
                }
                endList.push(channel)
              })
              break;

            case ComponentTypes.ROLE_SELECT:
              selectionList.forEach(roleID => {
                let role = interaction.message.guild.roles.get(roleID);
                endList.push(role);
              })
              break;

            case ComponentTypes.USER_SELECT:
              selectionList.forEach(async userID => {
                let user = client.users.get(userID)
                if (!user.createDM) {
                  user = await client.rest.users.get(userID)
                }

                endList.push(user)
              })
              break;
          }

          store(component.optionsStorage, endList);
        }

        let guild;
        if (interaction.guildID) {
          guild = (client.guilds.get(interaction.guildID) || await client.rest.guilds.get(interaction.guildID));
        } else {
          guild = client.guilds.first()
        }


        runActionArray(interactionHandlers[interaction.data.componentType][interaction.data.customID].actions, interaction.message, variables, { temporaries, guild });
      }
    }
  })

  async function registerCommands() {
    let endCommands = [];
    for (let command of commands) {
      let contextConstants = discord.InteractionContextTypes;
      let integrationConstants = discord.ApplicationIntegrationTypes;
      let integrationTypes = [integrationConstants.GUILD_INSTALL];
      let contexts = [contextConstants.GUILD];

      if (command.boundary?.installable) {
        if (command.boundary.worksIn == 'dms') {
          integrationTypes = [integrationConstants.USER_INSTALL];
        }
        if (command.boundary.worksIn == 'any') {
          integrationTypes = [integrationConstants.USER_INSTALL, integrationConstants.GUILD_INSTALL];
        }
      }

      if (command.boundary?.worksIn == 'dms') {
        contexts = [contextConstants.BOT_DM, contextConstants.PRIVATE_CHANNEL];
      }

      if (command.boundary?.worksIn == 'any') {
        contexts = [0, 1, 2]
      }

      if (command.type == 'message') {
        endCommands.push({
          type: ApplicationCommandTypes.MESSAGE,
          name: command.name,
          integrationTypes,
          contexts,
          nsfw: command.boundary?.nsfw || false
        })
      } else if (command.type == 'user') {
        endCommands.push({
          type: ApplicationCommandTypes.USER,
          name: command.name,
          integrationTypes,
          contexts,
          nsfw: command.boundary?.nsfw || false
        });
      } else {
        endCommands.push({
          type: ApplicationCommandTypes.CHAT_INPUT,
          name: command.name,
          description: command.description || 'No Description',
          options: command.options,
          integrationTypes,
          contexts,
          nsfw: command.boundary?.nsfw || false
        });
      }
    }

    let cachedCommands = [];
    let cmds = await client.application.getGlobalCommands();
    if (cmds == undefined || cmds.length == 0) {
      await client.application.bulkEditGlobalCommands(endCommands);
      cachedCommands = 'return'
    } else {
      cmds.forEach(command => {
        let cmd = endCommands.filter(c => command.name == c.name)[0];

        if (cmd) {
          client.application.editGlobalCommand(command.id, cmd)
          cachedCommands.push(cmd.name)
        } else {
          client.application.deleteGlobalCommand(command.id)
        }
      })
    }

    if (cachedCommands != 'return') {
      endCommands.forEach(command => {
        if (!cachedCommands.includes(command.name)) {
          client.application.createGlobalCommand(command);
        }
      });
    }

    console.log(
      `${colors.FgGreen}All Slash Commands Have Been Registered!${colors.Reset}`,
    );
  }
} catch (err) {
  console.log(
    colors.Reset,
    colors.FgRed,
    colors.Underscore,
    `Oops! An error has occured!`,
    err,
    colors.Reset,
  );
}
