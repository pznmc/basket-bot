const CardView = require('./CardView');
const utils = require('../utils');

module.exports = class MostWinsByPeriodCardView extends CardView {
    constructor(title, scores, periodType) {
        super();

        this.periodType = periodType;
        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
    }

    enableButtonsSection(excludedButtonCommand) {
        const commands = utils.commands;

        const allButtons = {
            [commands.MOST_WINS.command]: this.renderTextButton(commands.MOST_WINS.buttonName, commands.MOST_WINS.command),
            [commands.MOST_WINS_MONTHLY.command]: this.renderTextButton(commands.MOST_WINS_MONTHLY.buttonName, commands.MOST_WINS_MONTHLY.command),
            [commands.MOST_WINS_YEARLY.command]: this.renderTextButton(commands.MOST_WINS_YEARLY.buttonName, commands.MOST_WINS_YEARLY.command)
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
                bottomLabel: utils.getWinsDeclination(wins)
            }
        }
    };
};