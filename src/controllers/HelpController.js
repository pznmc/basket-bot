const commands = require('../commands');
const TextView = require('../views/TextView');

module.exports = class HelpController {
    constructor() {}

    getResults() {
        let helpMessage = '```';

        for (const commandEntry of Object.values(commands)) {
            helpMessage += ' - ' + commandEntry.command;

            if (commandEntry.hasOwnProperty('subCommands')) {
                const subCommands = Object.values(commandEntry.subCommands).map(subCommandEntry => subCommandEntry.command);
                helpMessage += `[${subCommands.join(' | ')}]`;
            }
            helpMessage += '\n';
        }

        helpMessage += '```';

        return new TextView(helpMessage).getJson();
    }
};