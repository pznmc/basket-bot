const CardView = require('./CardView');
const utils = require('../utils');

module.exports = class MostWinsSeriesCardView extends CardView {
    constructor(commandDef, title, scores) {
        super(commandDef);

        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
    }

    enableButtonsSection() {
        const buttons = [
            this.renderTextButton(this.commands.SERIES_LOST.buttonName, this.commands.SERIES_LOST.command)
        ];

        this.addButtonsSection(buttons);
        return this;
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