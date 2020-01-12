const db = require('../db');
const BaseController = require('./BaseController');
const MostShootsByPeriodCardView = require('../views/MostShootsByPeriodCardView');
const MostShootsByPlayerCardView = require('../views/MostShootsByPlayerCardView');

module.exports = class MostShootsController extends BaseController {
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
                scores = await db.getMostShootsByPlayer();
                return new MostShootsByPlayerCardView(this.commandDef, headerTitle, scores).getJson();
            } else {
                const subCommand = this.findSubCommand(baseCommand);
                const dbPeriod = this.getDBPeriod(subCommand.command);

                headerTitle = subCommand.cardName;
                scores = await db.getMostShootsByPeriod(dbPeriod);

                return new MostShootsByPeriodCardView(this.commandDef, headerTitle, scores, dbPeriod)
                    .enableButtonsSection(subCommand.command)
                    .getJson();
            }
        } catch (e) {
            throw e;
        }
    }
};