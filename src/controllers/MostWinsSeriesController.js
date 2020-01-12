const db = require('../db');
const BaseController = require('./BaseController');
const MostWinsSeriesCardView = require('../views/MostWinsSeriesCardView');

module.exports = class MostWinsSeriesController extends BaseController {
    constructor(commandDef, command) {
        super(commandDef, command);
    }

    async getResults() {
        try {
            const headerTitle = this.commandDef.cardName;
            const mostWinsSeries = await db.getMostWinsSeries();

            return new MostWinsSeriesCardView(headerTitle, mostWinsSeries).getJson();
        } catch (e) {
            throw e;
        }
    }
};