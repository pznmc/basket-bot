const CardView = require('./CardView');
const utils = require('../utils');
const commands = require('../commands');

module.exports = class MostWinsSeriesCardView extends CardView {
    constructor(title, scores) {
        super();

        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
        this.enableButtonsSection();
    }

    enableButtonsSection() {
        const commands = commands;

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
                iconUrl: utils.getPlaceIconUrl(place),
                topLabel: utils.getPlace(place),
                content: alias,
                bottomLabel: `${utils.getWinsDeclination(wins)} pod rząd`
            }
        }
    };
};