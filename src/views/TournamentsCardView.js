const CardView = require('./CardView');
const utils = require('../utils');

module.exports = class TournamentsCardView extends CardView {
    constructor(commandDef, title, scores) {
        super(commandDef);

        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
    }

    enableButtonsSection(excludedButtonCommand) {
        const allButtons = {
            [this.commands.BEST_TOURNAMENTS.command]: this.renderTextButton(this.commands.BEST_TOURNAMENTS.buttonName, this.commands.BEST_TOURNAMENTS.command),
            [this.commands.WORST_TOURNAMENTS.command]: this.renderTextButton(this.commands.WORST_TOURNAMENTS.buttonName, this.commands.WORST_TOURNAMENTS.command),
        };

        const chosenButtons = Object.entries(allButtons)
            .filter(button => button[0] !== excludedButtonCommand)
            .map(button => button[1]);

        this.addButtonsSection(chosenButtons);
        return this;
    }

    handleBodyElement = (score) => {
        const { created_at, shoots, players, avg } = score;
        const topLabelDateOptions = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };

        return {
            keyValue: {
                topLabel: new Date(created_at).toLocaleString('pl-PL', topLabelDateOptions),
                content: `${utils.getShootsDeclination(shoots)} - ${utils.getPlayersDeclination(players)}`,
                bottomLabel: `${utils.getShootsDeclination(avg, true)} na zawodnika`
            }
        }
    };
};