const db = require('../db');
const labels = require('../labels');
const ValidationError = require('../ValidationError');
const BaseController = require('./BaseController');
const TextView = require('../views/TextView');

module.exports = class MostLosesController extends BaseController {
    constructor(commandDef, command, body) {
        super(commandDef, command, body);
    }

    async getResults() {
        try {
            const email = this.sender.email;
            const alias = this.command.split(' ')[1];
            const playerNames = this.sender.displayName.split(' ');

            if (!alias) {
                throw new ValidationError(labels.JOIN_TO_GAME_NO_ALIAS);
            }

            await db.createPlayer(playerNames[0], playerNames[1], alias, email);

            return new TextView(labels.JOIN_TO_GAME_SUCCESS.format(alias)).getJson();
        } catch (e) {
            throw e;
        }
    }
};