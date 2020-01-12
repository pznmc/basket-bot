const CardView = require('./CardView');
const utils = require('../utils');

module.exports = class MostLosesByPeriodCardView extends CardView {
    constructor(commandDef, title, scores, periodType) {
        super(commandDef);

        this.periodType = periodType;
        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
    }

    enableButtonsSection(excludedButtonCommand) {
        const baseCommand = this.commandDef;
        const subCommands = baseCommand.subCommands;

        const allButtons = {
            [baseCommand.command]: this.renderTextButton(baseCommand.buttonName, baseCommand.command),
            [subCommands.MONTHLY.command]: this.renderTextButton(baseCommand.subCommands.MONTHLY.buttonName, utils.buildCmd(baseCommand, subCommands.MONTHLY)),
            [subCommands.YEARLY.command]: this.renderTextButton(baseCommand.subCommands.YEARLY.buttonName, utils.buildCmd(baseCommand, subCommands.YEARLY))
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