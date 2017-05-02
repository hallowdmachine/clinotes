const inquirer = require('inquirer');
const NewNote = require('./newnote');

const MainMenu = () => {
  inquirer.prompt(
    {
      type: 'list',
      name: 'mainMenu',
      message: 'Main Menu',
      choices: [
        'New Note',
        'View Notes',
        new inquirer.Separator(),
        'Exit'
      ]
    }
  ).then ((answers) => {
    if (answers.mainMenu === 'New Note') {
      NewNote()
    } else if (answers.mainMenu === 'View Notes') {
      ViewNotes()
    } else {
      process.exit()
    }
  }).catch (function (error) {
    console.log('Sorry. An error has occurred: ', error)
  })
}

module.exports = MainMenu
