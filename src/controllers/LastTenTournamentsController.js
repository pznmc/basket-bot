const db = require('../db');
const BaseController = require('./BaseController');
const LastTenTournamentsByPlayerView = require('../views/LastTenTournamentsByPlayerView');

module.exports = class LastTenTournamentsController extends BaseController {
    constructor(command) {
        super(command);
    }

    async getResults(playerEmail) {
        try {
            const scores = await db.getLastTenTournamentsByPlayer(playerEmail);

            return new LastTenTournamentsByPlayerView(scores).getJson();
        } catch (e) {
            throw e;
        }
    }
};