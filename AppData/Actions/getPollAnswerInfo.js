const { Poll } = require("oceanic.js");

module.exports = {
  data: {
    name: "Get Poll Answer Info",
  },
  category: "Polls",
  UI: [
    {
      element: "var",
      storeAs: "answer",
      name: "Poll Answer"
    },
    "-",
    {
      element: "typedDropdown",
      name: "Get",
      storeAs: "get",
      choices: {
        text: { name: "Label" },
        emoji: { name: "Emoji" },
        users: { name: "Users List" },
        poll: { name: "Poll" },
        id: { name: "ID" },
      },
    },
    "-",
    {
      element: "store",
      storeAs: "store",
    },
  ],

  compatibility: ["Any"],
  subtitle: (values, constants, thisAction) => {
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.variable(values.answer)} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, message, client, bridge) {

    /**
     * @type {Poll}
     */
    let answer = bridge.get(values.answer);

    // let a = poll.answers[0];
    // let output;
    // let answer = ({
    //     id: a.answerID,
    //     poll,
    //     answerMedia: a.pollMedia,
    //     raw: a
    //   })

    switch (values.get.type) {
      case 'users':
        output = await answer.poll.getAnswerUsers(answer.id);
        if (output.length < answer.poll.results.answerCounts.find(a => a.id == answer.id).users.length) {
          for (let userID in answer.poll.results.answerCounts.find(a => a.id == answer.id).users) {
            if (!output.find(a => a.id == userID)) {
              output.push((await bridge.getUser({ type: id, value: userID })))
            }
          }
        }
        break;
      case 'text':
        output = answer.media.text;
        break
      case 'emoji':
        output = answer.media.emoji;
        break
      case 'poll':
        output = answer.poll;
        break
      case 'id':
        output = answer.id;
        break
    }

    bridge.store(values.store, output);
  },
};
