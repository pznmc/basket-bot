const CardView = require('./CardView');
const utils = require('../utils');

module.exports = class MostShootsByPeriodCardView extends CardView {
    constructor(title, scores, periodType) {
        super();

        this.periodType = periodType;
        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
    }

    enableButtonsSection(excludedButtonCommand) {
        const baseCommand = utils.commands.MOST_SHOOTS;

        const allButtons = {
            [baseCommand.command]: this.renderTextButton(baseCommand.buttonName, baseCommand.command),
            [baseCommand.subCommands.MONTHLY.command]: this.renderTextButton(baseCommand.subCommands.MONTHLY.buttonName, baseCommand.subCommands.MONTHLY.command),
            [baseCommand.subCommands.YEARLY.command]: this.renderTextButton(baseCommand.subCommands.YEARLY.buttonName, baseCommand.subCommands.YEARLY.command)
        };

        const chosenButtons = Object.entries(allButtons)
            .filter(button => button[0] !== excludedButtonCommand)
            .map(button => button[1]);

        this.addButtonsSection(chosenButtons);
        return this;
    }

    handleBodyElement = (score) => {
        const { alias, shoots, period, created_at } = score;

        const topLabelDateOptions = this.periodType === 'year' ? { year: 'numeric' } : { month: 'long', year: 'numeric' };
        const bottomLabelDateOptions = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };

        return {
            keyValue: {
                topLabel: new Date(period).toLocaleString('pl-PL', topLabelDateOptions),
                content: `${alias} - ${utils.getShootsDeclination(shoots)}`,
                bottomLabel: new Date(created_at).toLocaleString('pl-PL', bottomLabelDateOptions)
            }
        }
    };
};