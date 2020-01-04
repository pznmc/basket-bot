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
        const buttons = [
            this.renderTextButton('Miesięcznie', util.commands.MOST_SHOOTS_MONTHLY),
            this.renderTextButton('Rocznie', util.commands.MOST_SHOOTS_MONTHLY)
        ];

        this.addButtonsSection(buttons);
    }

    handleBodyElement = (score, index) => {
        const { alias, shoots, created_at } = score;
        const place = ++index;

        const bottomLabelDateOptions = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };

        return {
            keyValue: {
                iconUrl: util.getPlaceIconUrl(place),
                topLabel: util.getPlace(place),
                content: `${alias} - ${util.getShootsDeclination(shoots)}`,
                bottomLabel: new Date(created_at).toLocaleString('pl-PL', bottomLabelDateOptions)
            }
        }
    };
};