const CardView = require('./CardView');
const util = require('../util');

module.exports = class MostWinsByPeriodCardView extends CardView {
    constructor(title, scores, periodType) {
        super();

        this.periodType = periodType;
        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
    }

    handleBodyElement = (score) => {
        const { alias, wins, period } = score;

        const topLabelDateOptions = this.periodType === 'year' ? { year: 'numeric' } : { month: 'long', year: 'numeric' };

        return {
            keyValue: {
                topLabel: new Date(period).toLocaleString('pl-PL', topLabelDateOptions),
                content: `${alias}`,
                bottomLabel: util.getWinsDeclination(wins)
            }
        }
    };
};