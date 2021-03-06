const CardView = require('./CardView');
const utils = require('../utils');

module.exports = class MostLosesByPeriodCardView extends CardView {
    constructor(commandDef, title, scores) {
        super(commandDef);

        this.setTitle(title);
        this.addBodySection(scores, this.handleBodyElement);
        this.enableButtonsSection();
    }

    enableButtonsSection() {
        const baseCommand = this.commandDef;
        const subCommands = baseCommand.subCommands;

        const buttons = [
            this.renderTextButton(subCommands.MONTHLY.buttonName, utils.buildCmd(baseCommand, subCommands.MONTHLY)),
            this.renderTextButton(subCommands.YEARLY.buttonName, utils.buildCmd(baseCommand, subCommands.YEARLY))
        ];

        this.addButtonsSection(buttons);
    }

    handleBodyElement = (score, index) => {
        const { alias, loses } = score;
        const place = ++index;

        return {
            keyValue: {
                iconUrl: utils.getPlaceIconUrl(place),
                topLabel: utils.getPlace(place),
                content: alias,
                bottomLabel: utils.getLostDeclination(loses)
            }
        }
    };
};