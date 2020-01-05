const CardView = require('./CardView');
const util = require('../util');

module.exports = class MostShootsByPeriodCardView extends CardView {
    constructor(title, scores, periodType) {
        super();

        this.periodType = periodType;
        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
    }

    enableButtonsSection(excludedButtonCommand) {
        const commands = util.commands;

        const allButtons = {
            [commands.MOST_SHOOTS.command]: this.renderTextButton(commands.MOST_SHOOTS.buttonName, commands.MOST_SHOOTS.command),
            [commands.MOST_SHOOTS_MONTHLY.command]: this.renderTextButton(commands.MOST_SHOOTS_MONTHLY.buttonName, commands.MOST_SHOOTS_MONTHLY.command),
            [commands.MOST_SHOOTS_YEARLY.command]: this.renderTextButton(commands.MOST_SHOOTS_YEARLY.buttonName, commands.MOST_SHOOTS_YEARLY.command)
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
                content: `${alias} - ${util.getShootsDeclination(shoots)}`,
                bottomLabel: new Date(created_at).toLocaleString('pl-PL', bottomLabelDateOptions)
            }
        }
    };
};