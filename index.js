'use strict';

const clear = require('clear');
const chalk = require('chalk');
const figures = require('figures');
const inquirer = require('inquirer');
const shortid = require('shortid');
const jsonfile = require('jsonfile');

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
        'About',
        'Exit'
      ]
    }
  ).then ((answers) => {
    if (answers.mainMenu === 'New Note') {
      NewNote()
    } else if (answers.mainMenu === 'View Notes') {
      ViewNotes()
    } else if (answers.mainMenu === 'About') {
      About()
    } else {
      process.exit()
    }
  }).catch (function (err) {
    console.log(chalk.red('Sorry. An error has occurred: ', err))
    MainMenu()
  })
}

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


      jsonfile.readFile('./noteFile.json', function (err, obj) {
        if (err) {
          return err;
        }
        let id = shortid.generate()
        let newNote = { [id]: answers.note_text }
        
        let existingNotes = Object.assign({}, obj)

        let notes = Object.assign(newNote, existingNotes)

        jsonfile.writeFile('./noteFile.json', notes, {spaces: 2}, function (err) {
          if (err) {
            return err;
          }
          console.log(chalk.green('Note saved!'))
          MainMenu()
        })
      })


    }).catch( function(err) {
      console.log(chalk.red('Sorry. An error has occurred: ', err))
      MainMenu()
    });
}

const ViewNotes = () => {
  jsonfile.readFile('./noteFile.json', function (err, obj) {
    if (err) {
      console.log(chalk.red('Sorry. An error has occurred: ', err))
      MainMenu()
    }
    //console.log(JSON.parse(obj))

    let notes = []

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        notes.push(obj[key] + chalk.hidden('|' + key + '|'))
      }
    }

    if (notes.length == 0) {
      console.log(chalk.red('No notes found.'))
      MainMenu()
      return;
    }

    notes.push(new inquirer.Separator())
    notes.push(chalk.yellow('Back'))

    inquirer.prompt(
      {
        type: 'list',
        name: 'allnotes',
        message: 'All notes\n' + new inquirer.Separator() + '\nPress Enter to delete',
        choices: notes
      }).then((answers) => {
        if (answers.allnotes === '\u001b[33mBack\u001b[39m') {
          MainMenu()
        } else {
          let id = answers.allnotes.split('|')[1]
          inquirer.prompt(
            {
              type: 'confirm',
              name: 'toBeDeleted',
              message: 'Delete this note? ' + answers.allnotes,
              default: false
            }).then((answers) => {
              if (answers.toBeDeleted) {
                delete obj[id]
                jsonfile.writeFile('./noteFile.json', obj, {spaces: 2}, function (err) {
                  if (err) {
                    return err;
                  }
                  console.log(chalk.green('Note deleted!'))
                  ViewNotes()
                })
              } else {
                ViewNotes()
              }
            });
        }
      }).catch (function (err) {
        console.log(chalk.red('Sorry. An error has occurred: ', err))
        MainMenu()
      })
  });
}

const About = () => {
  console.log(chalk.green('CLINotes') + ' v0.1')
  console.log('CLINotes is a simple note application in the command line.')
  console.log('Select [New Note] to add a new note.')
  console.log('Select [View Notes] to view all the saved notes.')
  console.log('To delete a note, select it in the [View Notes] menu and press Enter.')
  console.log(chalk.dim(new Array(30).join(figures.line)))
  console.log('CLINotes is written in Javascript, using NodeJS, Inquirer.js,')
  console.log('jsonfile, chalk, and shortid.')
  console.log('TODO:')
  console.log('  Allow editing of notes')
  console.log('  Work on styling/display')
  console.log('  Possibly look into saving the files in an SQLite database')
  console.log(chalk.dim(new Array(30).join(figures.line)))
  MainMenu()
}

clear();
console.log(chalk.green('CLINotes'))
MainMenu()
