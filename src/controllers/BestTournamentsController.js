const db = require('../db');
const BaseController = require('./BaseController');
const TournamentsCardView = require('../views/TournamentsCardView');

module.exports = class BestTournamentsController extends BaseController {
    constructor(commandDef, command) {
        super(commandDef, command);
    }

    async getResults() {
        try {
            const headerTitle = this.commandDef.cardName;
            const tournaments = await db.getBestTournaments();

            return new TournamentsCardView(this.commandDef, headerTitle, tournaments)
                .addCommands(this.commands)
                .enableButtonsSection(this.command)
                .getJson();
        } catch (e) {
            throw e;
        }
    }
};