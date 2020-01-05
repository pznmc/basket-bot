const CardView = require('./CardView');
const util = require('../util');

module.exports = class ResultsCardView extends CardView {
    constructor(title, playerScores) {
        super();

        this.setTitle(title);
        this.handleBodySection(playerScores);
    }

    handleBodySection(playerScores) {
        this.addBodySection(playerScores, this.handleBodyElement);
    }

    enableButtonsSection(excludedButtonCommand) {
        const commands = util.commands;

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
        const {alias, place, shoots, playoffShoots, playoffRounds, tournamentsNum} = playerScore;

        return {
            keyValue: {
                iconUrl: util.getPlaceIconUrl(place),
                topLabel: util.getPlace(place),
                content: alias,
                bottomLabel: this.generateBottomLabel(shoots, playoffShoots, playoffRounds, tournamentsNum)
            }
        }
    };

    generateBottomLabel(shootsNum, playoffShoots, playoffRounds, tournamentsNum) {
        let bottomLabel = util.getShootsDeclination(shootsNum);

        if (playoffRounds > 0) {
            bottomLabel += ` (dogrywka: ${util.getShootsDeclination(playoffShoots)} w ${util.getRoundsDeclination(playoffRounds)})`;
        } else if (tournamentsNum) {
            bottomLabel += ` w ${util.getTournamentsDeclination(tournamentsNum)}`;
        }

        return bottomLabel;
    }
};