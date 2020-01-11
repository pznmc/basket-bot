const CardView = require('./CardView');
const utils = require('../utils');
const labels = require('../labels');
const commands = require('../commands');

module.exports = class MostLostSeriesCardView extends CardView {
    constructor(title, scores) {
        super();

        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
        this.enableButtonsSection();
    }

    enableButtonsSection() {
        const commands = commands;

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
                iconUrl: utils.getPlaceIconUrl(place),
                topLabel: utils.getPlace(place),
                content: alias,
                bottomLabel: `${utils.getLostDeclination(lost)} ${labels.IN_A_ROW}`
            }
        }
    };
};