const { Poll } = require("oceanic.js");

module.exports = {
  data: {
    name: "Get Poll Info",
  },
  category: "Polls",
  UI: [
    {
      element: "var",
      storeAs: "poll",
      name: "Poll"
    },
    "-",
    {
      element: "typedDropdown",
      name: "Get",
      storeAs: "get",
      choices: {
        message: { name: "Message" },
        creator: { name: "Author" },
        question: { name: "Question" },
        answers: { name: "Answers List" },
        answerCount: { name: "Votes Count" },
        expiry: { name: "Expiry Timestamp" },
        isFinalized: { name: "Is Finalized?" },
        allowMultiselect: { name: "Allows Multiselection?" },
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
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.variable(values.poll)} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, message, client, bridge) {

    /**
     * @type {Poll}
     */
    let poll = bridge.get(values.poll);


    switch (values.get.type) {
      case 'message':
        output = poll.message;
        break
      case 'question':
        output = poll.question;
        break
      case 'expiry':
        output = poll.expiry.getTime();
        break
      case 'answers':
        output = poll.answers.map((a => {
          return ({
            id: a.answerID,
            poll,
            media: a.pollMedia,
            raw: a
          })
        }))
        break
      case 'answerCount':
        output = poll.results.answerCounts;
        break
      case 'isFinalized':
        output = poll.results.isFinalized
        break
      case 'allowMultiselect':
        output = poll.allowMultiselect
        break
      case 'creator':
        output = poll.creator;
        break;
    }

    bridge.store(values.store, output);
  },
};
