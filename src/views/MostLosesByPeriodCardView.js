const CardView = require('./CardView');
const utils = require('../utils');

module.exports = class MostLosesByPeriodCardView extends CardView {
    constructor(title, scores, periodType) {
        super();

        this.periodType = periodType;
        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
    }

    enableButtonsSection(excludedButtonCommand) {
        const commands = utils.commands;

        const allButtons = {
            [commands.MOST_LOSES.command]: this.renderTextButton(commands.MOST_LOSES.buttonName, commands.MOST_LOSES.command),
            [commands.MOST_LOSES_MONTHLY.command]: this.renderTextButton(commands.MOST_LOSES_MONTHLY.buttonName, commands.MOST_LOSES_MONTHLY.command),
            [commands.MOST_LOSES_YEARLY.command]: this.renderTextButton(commands.MOST_LOSES_YEARLY.buttonName, commands.MOST_LOSES_YEARLY.command)
        };

        const chosenButtons = Object.entries(allButtons)
            .filter(button => button[0] !== excludedButtonCommand)
            .map(button => button[1]);

        this.addButtonsSection(chosenButtons);
        return this;
    }

    handleBodyElement = (score) => {
        const { alias, loses, period } = score;

        const topLabelDateOptions = this.periodType === 'year' ? { year: 'numeric' } : { month: 'long', year: 'numeric' };

        return {
            keyValue: {
                topLabel: new Date(period).toLocaleString('pl-PL', topLabelDateOptions),
                content: `${alias}`,
                bottomLabel: utils.getLostDeclination(loses)
            }
        }
    };
};