const CardView = require('./CardView');
const util = require('../util');

module.exports = class MostLostSeriesCardView extends CardView {
    constructor(title, scores) {
        super();

        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
        this.enableButtonsSection();
    }

    enableButtonsSection() {
        const commands = util.commands;

        const buttons = [
            this.renderTextButton(commands.SERIES_WINS.buttonName, commands.SERIES_WINS.command)
        ];

        this.addButtonsSection(buttons);
    }

    handleBodyElement = (score, index) => {
        const { alias, lost } = score;
        const place = ++index;

        return {
            keyValue: {
                iconUrl: util.getPlaceIconUrl(place),
                topLabel: util.getPlace(place),
                content: alias,
                bottomLabel: `${util.getLostDeclination(lost)} pod rząd`
            }
        }
    };
};