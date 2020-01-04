const CardView = require('./CardView');
const util = require('../util');

module.exports = class MostWinsByPeriodCardView extends CardView {
    constructor(title, scores, periodType) {
        super();

        this.periodType = periodType;
        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
    }

    enableButtonsSection(excludedButtonCommand) {
        const allButtons = {
            [util.commands.MOST_WINS]: this.renderTextButton('Ogólnie', util.commands.MOST_WINS),
            [util.commands.MOST_WINS_MONTHLY]: this.renderTextButton('Miesięcznie', util.commands.MOST_WINS_MONTHLY),
            [util.commands.MOST_WINS_YEARLY]: this.renderTextButton('Rocznie', util.commands.MOST_WINS_YEARLY)
        };

        const chosenButtons = Object.entries(allButtons)
            .filter(button => button[0] !== excludedButtonCommand)
            .map(button => button[1]);

        this.addButtonsSection(chosenButtons);
        return this;
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