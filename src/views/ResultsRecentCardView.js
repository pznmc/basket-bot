const CardView = require('./CardView');
const utils = require('../utils');
const labels = require('../labels');

module.exports = class ResultsRecentCardView extends CardView {
    constructor(title, playerScores) {
        super();

        this.setTitle(title);
        this.handleBodySection(playerScores);
        this.enableButtonsSection();
    }

    handleBodySection(playerScores) {
        this.addBodySection(playerScores, this.handleBodyElement);
    }

    enableButtonsSection() {
        const subCommands = utils.commands.RESULTS.subCommands;

        const buttons = [
            this.renderTextButton(subCommands.LAST_DAY.buttonName, subCommands.LAST_DAY.command),
            this.renderTextButton(subCommands.LAST_WEEK.buttonName, subCommands.LAST_WEEK.command),
            this.renderTextButton(subCommands.LAST_MONTH.buttonName, subCommands.LAST_MONTH.command),
            this.renderTextButton(subCommands.LAST_YEAR.buttonName, subCommands.LAST_YEAR.command)
        ];

        this.addButtonsSection(buttons);
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