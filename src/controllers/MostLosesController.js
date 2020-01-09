const db = require('../db');
const utils = require('../utils');
const BaseController = require('./BaseController');
const MostLosesByPeriodCardView = require('../views/MostLosesByPeriodCardView');
const MostLosesByPlayerCardView = require('../views/MostLosesByPlayerCardView');

module.exports = class MostLosesController extends BaseController {
    constructor(command) {
        super(command);
    }

    async getResults() {
        try {
            const baseCommand = utils.commands.MOST_LOSES;
            let headerTitle;
            let scores;

            if (this.command === baseCommand.command) {
                headerTitle = utils.commands.MOST_LOSES.cardName;
                scores = await db.getMostLosesByPlayer();

                return new MostLosesByPlayerCardView(headerTitle, scores).getJson();
            } else {
                const subCommand = this.findSubCommand(baseCommand);
                const dbPeriod = this.getDBPeriod(subCommand.command);

                headerTitle = subCommand.cardName;
                scores = await db.getMostLosesByPeriod(dbPeriod);

                return new MostLosesByPeriodCardView(headerTitle, scores, dbPeriod)
                    .enableButtonsSection(subCommand.command)
                    .getJson();
            }
        } catch (e) {
            throw e;
        }
    }
};