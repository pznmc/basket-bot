const db = require('../db');
const utils = require('../utils');
const BaseController = require('./BaseController');
const MostLostSeriesCardView = require('../views/MostLostSeriesCardView');

module.exports = class MostWinsSeriesController extends BaseController {
    constructor(command) {
        super(command);
    }

    async getResults() {
        try {
            const headerTitle = utils.commands.SERIES_LOST.cardName;
            const mostLostSeries = await db.getMostLostSeries();

            return new MostLostSeriesCardView(headerTitle, mostLostSeries).getJson();
        } catch (e) {
            throw e;
        }
    }
};