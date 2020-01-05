const CardView = require('./CardView');
const utils = require('../utils');
const labels = require('../labels');

module.exports = class ResultsRecentCardView extends CardView {
    constructor(title, playerScores) {
        super();

        this.setTitle(title);
        this.handleBodySection(playerScores);
    }

    handleBodySection(playerScores) {
        this.addBodySection(playerScores, this.handleBodyElement);
    }

    enableButtonsSection(excludedButtonCommand) {
        const commands = utils.commands;

        const allButtons = {
            [commands.RESULTS.command]: this.renderTextButton(commands.RESULTS.buttonName, commands.RESULTS.command),
            [commands.RESULTS_LAST_DAY.command]: this.renderTextButton(commands.RESULTS_LAST_DAY.buttonName, commands.RESULTS_LAST_DAY.command),
            [commands.RESULTS_LAST_WEEK.command]: this.renderTextButton(commands.RESULTS_LAST_WEEK.buttonName, commands.RESULTS_LAST_WEEK.command),
            [commands.RESULTS_LAST_MONTH.command]: this.renderTextButton(commands.RESULTS_LAST_MONTH.buttonName, commands.RESULTS_LAST_MONTH.command),
            [commands.RESULTS_LAST_YEAR.command]: this.renderTextButton(commands.RESULTS_LAST_YEAR.buttonName, commands.RESULTS_LAST_YEAR.command)
        };

        const chosenButtons = Object.entries(allButtons)
            .filter(button => button[0] !== excludedButtonCommand)
            .map(button => button[1]);

        this.addButtonsSection(chosenButtons);
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