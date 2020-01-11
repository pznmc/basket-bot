const CardView = require('./CardView');
const utils = require('../utils');
const commands = require('../commands');

module.exports = class TournamentsCardView extends CardView {
    constructor(title, scores) {
        super();

        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
    }

    enableButtonsSection(excludedButtonCommand) {
        const allButtons = {
            [commands.BEST_TOURNAMENTS.command]: this.renderTextButton(commands.BEST_TOURNAMENTS.buttonName, commands.BEST_TOURNAMENTS.command),
            [commands.WORST_TOURNAMENTS.command]: this.renderTextButton(commands.WORST_TOURNAMENTS.buttonName, commands.WORST_TOURNAMENTS.command),
        };

        const chosenButtons = Object.entries(allButtons)
            .filter(button => button[0] !== excludedButtonCommand)
            .map(button => button[1]);

        this.addButtonsSection(chosenButtons);
        return this;
    }

    handleBodyElement = (score) => {
        const { created_at, shoots } = score;
        const topLabelDateOptions = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };

        return {
            keyValue: {
                topLabel: new Date(created_at).toLocaleString('pl-PL', topLabelDateOptions),
                content: utils.getShootsDeclination(shoots)
            }
        }
    };
};