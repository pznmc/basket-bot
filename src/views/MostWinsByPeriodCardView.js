const CardView = require('./CardView');
const util = require('../util');

module.exports = class MostWinsByPeriodCardView extends CardView {
    constructor(title, scores, periodType) {
        super();

        this.periodType = periodType;
        this.setTitle(title);
        this.handleBodySection(scores);
    }

    handleBodySection(scores) {
        this.addBodySection(scores, this.handleBodyElement);
    }

    handleButtonsSection() {
        let buttons = [];
        buttons.push(this.renderTextButton('Ostatni dzień', 'getResults', 'daily'));
        buttons.push(this.renderTextButton('Ostatni tydzień', 'getResults', 'weekly'));
        buttons.push(this.renderTextButton('Ostatni miesiąc', 'getResults', 'monthly'));
        this.addButtonsSection(buttons);
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