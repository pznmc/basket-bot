const utils = require('../utils');
const ValidationError = require('../ValidationError');

module.exports = class BaseController {
    constructor(command, body) {
        this.command = command;
        this.body = body;
    }

    findSubCommand(baseCommand) {
        return Object.values(baseCommand.subCommands)
            .find(subCommand => this.command.includes(subCommand.command));
    }

    getDBPeriod(subCommand) {
        if (!utils.dbPeriods.hasOwnProperty(subCommand)) {
            throw new ValidationError(labels.NO_SUCH_PERIOD);
        }
    }
};