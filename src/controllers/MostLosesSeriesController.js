const db = require('../db');
const BaseController = require('./BaseController');
const MostLostSeriesCardView = require('../views/MostLostSeriesCardView');

module.exports = class MostWinsSeriesController extends BaseController {
    constructor(commandDef, command) {
        super(commandDef, command);
    }

    async getResults() {
        try {
            const headerTitle = this.commandDef.cardName;
            const mostLostSeries = await db.getMostLostSeries();

            return new MostLostSeriesCardView(this.commandDef, headerTitle, mostLostSeries)
                .addCommands(this.commands)
                .getJson();
        } catch (e) {
            throw e;
        }
    }
};