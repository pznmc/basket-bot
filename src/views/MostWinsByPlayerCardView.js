const CardView = require('./CardView');
const util = require('../util');

module.exports = class MostWinsByPeriodCardView extends CardView {
    constructor(title, scores) {
        super();

        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
        this.enableButtonsSection();
    }

    enableButtonsSection() {
        const commands = util.commands;

        const buttons = [
            this.renderTextButton(commands.MOST_WINS_MONTHLY.buttonName, commands.MOST_WINS_MONTHLY.command),
            this.renderTextButton(commands.MOST_WINS_YEARLY.buttonName, commands.MOST_WINS_YEARLY.command)
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
                bottomLabel: util.getWinsDeclination(wins)
            }
        }
    };
};