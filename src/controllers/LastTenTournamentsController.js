const db = require('../db');
const BaseController = require('./BaseController');
const LastTenTournamentsByPlayerView = require('../views/LastTenTournamentsByPlayerView');

module.exports = class LastTenTournamentsController extends BaseController {
    constructor(commandDef, command) {
        super(commandDef, command);
    }

    async getResults() {
        try {
            const headerTitle = this.commandDef.cardName;
            const scores = await db.getLastTenTournamentsByPlayer(this.sender.email);

            return new LastTenTournamentsByPlayerView(this.commandDef, headerTitle, scores).getJson();
        } catch (e) {
            throw e;
        }
    }
};