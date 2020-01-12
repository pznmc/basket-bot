const db = require('../db');
const BaseController = require('./BaseController');
const MostLosesByPeriodCardView = require('../views/MostLosesByPeriodCardView');
const MostLosesByPlayerCardView = require('../views/MostLosesByPlayerCardView');

module.exports = class MostLosesController extends BaseController {
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
                scores = await db.getMostLosesByPlayer();

                return new MostLosesByPlayerCardView(this.commandDef, headerTitle, scores).getJson();
            } else {
                const subCommand = this.findSubCommand(baseCommand);
                const dbPeriod = this.getDBPeriod(subCommand.command);

                headerTitle = subCommand.cardName;
                scores = await db.getMostLosesByPeriod(dbPeriod);

                return new MostLosesByPeriodCardView(this.commandDef, headerTitle, scores, dbPeriod)
                    .enableButtonsSection(subCommand.command)
                    .getJson();
            }
        } catch (e) {
            throw e;
        }
    }
};