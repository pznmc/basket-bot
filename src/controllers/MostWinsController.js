const db = require('../db');
const BaseController = require('./BaseController');
const MostWinsByPeriodCardView = require('../views/MostWinsByPeriodCardView');
const MostWinsByPlayerCardView = require('../views/MostWinsByPlayerCardView');

module.exports = class MostWinsController extends BaseController {
    constructor(commandDef, command) {
        super(commandDef, command);
    }

    async getResults() {
        try {
            const baseCommand = this.commandDef;
            let headerTitle;
            let scores;

            if (this.command === baseCommand.command) {
                headerTitle = baseCommand.cardName;
                scores = await db.getMostWinsByPlayer();

                return new MostWinsByPlayerCardView(this.commandDef, headerTitle, scores).getJson();
            } else {
                const subCommand = this.findSubCommand(baseCommand);
                const dbPeriod = this.getDBPeriod(subCommand.command);

                headerTitle = subCommand.cardName;
                scores = await db.getMostWinsByPeriod(dbPeriod);

                return new MostWinsByPeriodCardView(this.commandDef, headerTitle, scores, dbPeriod)
                    .enableButtonsSection(subCommand.command)
                    .getJson();
            }
        } catch (e) {
            throw e;
        }
    }
};