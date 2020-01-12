const db = require('../db');
const commands = require('../commands');
const BaseController = require('./BaseController');
const LastTenTournamentsByPlayerView = require('../views/LastTenTournamentsByPlayerView');

module.exports = class LastTenTournamentsController extends BaseController {
    constructor(command) {
        super(command);
    }

    async getResults(playerEmail) {
        try {
            const headerTitle = commands.LAST_TEN_TOURNAMENTS.cardName;
            const scores = await db.getLastTenTournamentsByPlayer(playerEmail);

            return new LastTenTournamentsByPlayerView(headerTitle, scores).getJson();
        } catch (e) {
            throw e;
        }
    }
};