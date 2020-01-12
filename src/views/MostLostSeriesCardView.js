const CardView = require('./CardView');
const utils = require('../utils');
const labels = require('../labels');

module.exports = class MostLostSeriesCardView extends CardView {
    constructor(commandDef, title, scores) {
        super(commandDef);

        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
    }

    enableButtonsSection() {
        const buttons = [
            this.renderTextButton(this.commands.SERIES_WINS.buttonName, this.commands.SERIES_WINS.command)
        ];

        this.addButtonsSection(buttons);
        return this;
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