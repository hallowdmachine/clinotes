const inquirer = require('inquirer');
const chalk = require('chalk');

const NewNote = () => {
  var question = {
    type: 'input',
    name: 'note_text',
    message: 'Note'
  }

  inquirer.prompt(question)
    .then ((answers) => {
      if (answers.note_text === '') {
        console.log(chalk.red('You cannot add an empty note'))
        MainMenu()
        return;
      }
    })
}

module.exports = NewNote
