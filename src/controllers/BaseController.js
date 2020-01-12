const utils = require('../utils');
const ValidationError = require('../ValidationError');

module.exports = class BaseController {
    constructor(commandDef, command, body) {
        this.commandDef = commandDef;
        this.command = command;
        this.body = body;
    }

    addSender(sender) {
        this.sender = sender;
        return this;
    }

    validateSpaceType(spaceType) {
        if (this.commandDef.spaceTypes && !this.commandDef.spaceTypes.includes(spaceType)) {
            throw new ValidationError(labels.CANNOT_ADD_PLAYER_THROUGH_DM);
        }

        return this;
    }

    addCommands(commands) {
        this.commands = commands;
        return this;
    }

    findSubCommand(baseCommand) {
        return Object.values(baseCommand.subCommands)
            .find(subCommand => this.command.includes(subCommand.command));
    }

    getDBPeriod(subCommand) {
        if (!utils.dbPeriods.hasOwnProperty(subCommand)) {
            throw new ValidationError(labels.NO_SUCH_PERIOD);
        }

        return utils.dbPeriods[subCommand];
    }
};