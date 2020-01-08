const CardView = require('./CardView');
const utils = require('../utils');

module.exports = class MostLosesByPeriodCardView extends CardView {
    constructor(title, scores) {
        super();

        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
        this.enableButtonsSection();
    }

    enableButtonsSection() {
        const commands = utils.commands;

        const buttons = [
            this.renderTextButton(commands.MOST_LOSES_MONTHLY.buttonName, commands.MOST_LOSES_MONTHLY.command),
            this.renderTextButton(commands.MOST_LOSES_YEARLY.buttonName, commands.MOST_LOSES_YEARLY.command)
        ];

        this.addButtonsSection(buttons);
    }

    handleBodyElement = (score, index) => {
        const { alias, loses } = score;
        const place = ++index;

        return {
            keyValue: {
                iconUrl: utils.getPlaceIconUrl(place),
                topLabel: utils.getPlace(place),
                content: alias,
                bottomLabel: utils.getLostDeclination(loses)
            }
        }
    };
};