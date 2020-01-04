const CardView = require('./CardView');
const util = require('../util');

module.exports = class MostWinsByPeriodCardView extends CardView {
    constructor(title, scores) {
        super();

        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
    }

    handleBodyElement = (score, index) => {
        const { alias, wins } = score;

        return {
            keyValue: {
                topLabel: util.getPlace(++index),
                content: alias,
                bottomLabel: util.getWinsDeclination(wins)
            }
        }
    };
};