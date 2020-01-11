const db = require('../db');
const labels = require('../labels');
const ValidationError = require('../ValidationError');
const BaseController = require('./BaseController');
const TextView = require('../views/TextView');

module.exports = class MostLosesController extends BaseController {
    constructor(command, body, sender, spaceType) {
        super(command, body);
        this.sender = sender;

        if (spaceType == 'DM') {
            throw new ValidationError(labels.CANNOT_ADD_PLAYER_THROUGH_DM);
        }
    }

    async getResults() {
        try {
            console.log(this.command);
            console.log(JSON.stringify(this.sender));
            const email = this.sender.email;
            const alias = this.command.split(' ')[1];
            console.log(JSON.stringify(this.command.split(' ')));
            const playerNames = this.sender.displayName.split(' ');

            if (!alias) {
                throw new ValidationError(labels.ADD_PLAYER_WRONG_FORMAT);
            }

            console.log('PAZNA: ' + JSON.stringify(playerNames) + ' ' + alias + ' - ' + email);
            await db.createPlayer(playerNames[0], playerNames[1], alias, email);

            return new TextView(labels.ADD_PLAYER_SUCCESS.format(playerNames[0], alias, playerNames[1])).getJson();
        } catch (e) {
            throw e;
        }
    }
};