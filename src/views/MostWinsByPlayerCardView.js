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
        const subCommands = utils.commands.MOST_WINS.subCommands;

        const buttons = [
            this.renderTextButton(subCommands.MONTHLY.buttonName, subCommands.MONTHLY.command),
            this.renderTextButton(subCommands.YEARLY.buttonName, subCommands.YEARLY.command)
        ];

        this.addButtonsSection(buttons);
    }

    handleBodyElement = (score, index) => {
        const { alias, wins } = score;
        const place = ++index;

        return {
            keyValue: {
                iconUrl: utils.getPlaceIconUrl(place),
                topLabel: utils.getPlace(place),
                content: alias,
                bottomLabel: utils.getWinsDeclination(wins)
            }
        }
    };
};