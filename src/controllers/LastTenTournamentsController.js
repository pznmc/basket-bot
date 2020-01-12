const db = require('../db');
const BaseController = require('./BaseController');
const LastTenTournamentsByPlayerView = require('../views/LastTenTournamentsByPlayerView');

module.exports = class LastTenTournamentsController extends BaseController {
    constructor(commandDef, command) {
        super(commandDef, command);
    }

    async getResults(playerEmail) {
        try {
            const headerTitle = this.commandDef.cardName;
            const scores = await db.getLastTenTournamentsByPlayer(playerEmail);

            return new LastTenTournamentsByPlayerView(this.commandDef, headerTitle, scores).getJson();
        } catch (e) {
            throw e;
        }
    }
};