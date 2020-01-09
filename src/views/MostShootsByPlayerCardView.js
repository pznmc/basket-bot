const CardView = require('./CardView');
const utils = require('../utils');

module.exports = class MostWinsByPeriodCardView extends CardView {
    constructor(title, scores) {
        super();

        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
        this.enableButtonsSection();
    }

    enableButtonsSection() {
        const subCommands = utils.commands.MOST_SHOOTS.subCommands;

        const buttons = [
            this.renderTextButton(subCommands.MONTHLY.buttonName, subCommands.MONTHLY.command),
            this.renderTextButton(subCommands.YEARLY.buttonName, subCommands.YEARLY.command)
        ];

        this.addButtonsSection(buttons);
    }

    handleBodyElement = (score, index) => {
        const { alias, shoots, created_at } = score;
        const place = ++index;

        const bottomLabelDateOptions = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };

        return {
            keyValue: {
                iconUrl: utils.getPlaceIconUrl(place),
                topLabel: utils.getPlace(place),
                content: `${alias} - ${utils.getShootsDeclination(shoots)}`,
                bottomLabel: new Date(created_at).toLocaleString('pl-PL', bottomLabelDateOptions)
            }
        }
    };
};