const db = require('../db');
const commands = require('../commands');
const BaseController = require('./BaseController');
const MostWinsSeriesCardView = require('../views/MostWinsSeriesCardView');

module.exports = class MostWinsSeriesController extends BaseController {
    constructor(command) {
        super(command);
    }

    async getResults() {
        try {
            const headerTitle = commands.SERIES_WINS.cardName;
            const mostWinsSeries = await db.getMostWinsSeries();

            return new MostWinsSeriesCardView(headerTitle, mostWinsSeries).getJson();
        } catch (e) {
            throw e;
        }
    }
};