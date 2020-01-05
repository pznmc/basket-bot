const CardView = require('./CardView');
const util = require('../util');

module.exports = class MostWinsSeriesCardView extends CardView {
    constructor(title, scores) {
        super();

        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
        this.enableButtonsSection();
    }

    enableButtonsSection() {
        const commands = util.commands;

        const buttons = [
            this.renderTextButton(commands.SERIES_LOST.buttonName, commands.SERIES_LOST.command)
        ];

        this.addButtonsSection(buttons);
    }

    handleBodyElement = (score, index) => {
        const { alias, wins } = score;
        const place = ++index;

        return {
            keyValue: {
                iconUrl: util.getPlaceIconUrl(place),
                topLabel: util.getPlace(place),
                content: alias,
                bottomLabel: `${util.getWinsDeclination(wins)} pod rząd`
            }
        }
    };
};