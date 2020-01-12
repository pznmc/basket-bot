const CardView = require('./CardView');
const utils = require('../utils');
const labels = require('../labels');

module.exports = class ResultsRecentCardView extends CardView {
    constructor(commandDef, title, playerScores) {
        super(commandDef);

        this.setTitle(title);
        this.handleBodySection(playerScores);
    }

    handleBodySection(playerScores) {
        this.addBodySection(playerScores, this.handleBodyElement);
    }

    enableButtonsSection() {
        const baseCommand = this.commands.RESULTS;
        const subCommands = baseCommand.subCommands;

        const buttons = [
            this.renderTextButton(subCommands.LAST_DAY.buttonName, utils.buildCmd(baseCommand, subCommands.LAST_DAY)),
            this.renderTextButton(subCommands.LAST_WEEK.buttonName, utils.buildCmd(baseCommand, subCommands.LAST_WEEK)),
            this.renderTextButton(subCommands.LAST_MONTH.buttonName, utils.buildCmd(baseCommand, subCommands.LAST_MONTH)),
            this.renderTextButton(subCommands.LAST_YEAR.buttonName, utils.buildCmd(baseCommand, subCommands.LAST_YEAR))
        ];

        this.addButtonsSection(buttons);
        return this;
    }

    handleBodyElement = (playerScore) => {
        const {alias, place, shoots, playoffShoots, playoffRounds} = playerScore;

        return {
            keyValue: {
                iconUrl: utils.getPlaceIconUrl(place),
                topLabel: utils.getPlace(place),
                content: alias,
                bottomLabel: this.generateBottomLabel(shoots, playoffShoots, playoffRounds)
            }
        }
    };

    generateBottomLabel(shootsNum, playoffShoots, playoffRounds) {
        let bottomLabel = utils.getShootsDeclination(shootsNum);

        if (playoffRounds > 0) {
            bottomLabel += ` ${labels.PLAYOFF_RESULTS.format(utils.getShootsDeclination(playoffShoots), utils.getRoundsDeclination(playoffRounds))}`;
        }

        return bottomLabel;
    }
};