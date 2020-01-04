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
        const buttons = [
            this.renderTextButton('Najdłuższa seria przegranych', util.commands.SERIES_LOST)
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