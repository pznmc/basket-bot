const db = require('../db');
const commands = require('../commands');
const BaseController = require('./BaseController');
const TournamentsCardView = require('../views/TournamentsCardView');

module.exports = class BestTournamentsController extends BaseController {
    constructor(command) {
        super(command);
    }

    async getResults() {
        try {
            let headerTitle;
            let tournaments;

            if (this.command.includes(commands.BEST_TOURNAMENTS.command)) {
                headerTitle = commands.BEST_TOURNAMENTS.cardName;
                tournaments = await db.getBestTournaments();
            } else {
                headerTitle = commands.WORST_TOURNAMENTS.cardName;
                tournaments = await db.getWorstTournaments();
            }

            return new TournamentsCardView(headerTitle, tournaments)
                .enableButtonsSection(this.command)
                .getJson();
        } catch (e) {
            throw e;
        }
    }
};