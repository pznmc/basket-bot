const BaseController = require('./BaseController');
const TextView = require('../views/TextView');

module.exports = class HelpController extends BaseController {
    constructor(commandDef, command) {
        super(commandDef, command);
    }

    getResults() {
        let helpMessage = '```';

        for (const commandEntry of Object.values(this.commands)) {
            helpMessage += '- ' + commandEntry.command;

            if (commandEntry.hasOwnProperty('subCommands')) {
                const subCommands = Object.values(commandEntry.subCommands).map(subCommandEntry => subCommandEntry.command);
                helpMessage += ` - [${subCommands.join(' | ')}]`;
            }

            helpMessage += '\n';
        }

        helpMessage += '```';

        return new TextView(helpMessage).getJson();
    }
};