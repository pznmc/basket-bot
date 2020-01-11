const db = require('../db');
const utils = require('../utils');
const BaseController = require('./BaseController');
const MostWinsByPeriodCardView = require('../views/MostWinsByPeriodCardView');
const MostWinsByPlayerCardView = require('../views/MostWinsByPlayerCardView');

module.exports = class MostWinsController extends BaseController {
    constructor(command) {
        super(command);
    }

    async getResults() {
        try {
            const baseCommand = commands.MOST_WINS;
            let headerTitle;
            let scores;

            if (this.command === baseCommand.command) {
                headerTitle = baseCommand.cardName;
                scores = await db.getMostWinsByPlayer();

                return new MostWinsByPlayerCardView(headerTitle, scores).getJson();
            } else {
                const subCommand = this.findSubCommand(baseCommand);
                const dbPeriod = this.getDBPeriod(subCommand.command);

                headerTitle = subCommand.cardName;
                scores = await db.getMostWinsByPeriod(dbPeriod);

                return new MostWinsByPeriodCardView(headerTitle, scores, dbPeriod)
                    .enableButtonsSection(subCommand.command)
                    .getJson();
            }
        } catch (e) {
            throw e;
        }
    }
};