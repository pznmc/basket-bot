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
        const allButtons = {
            [util.commands.RESULTS]: this.renderTextButton('Wyniki (ogólne)', util.commands.RESULTS),
            [util.commands.RESULTS_LAST_DAY]: this.renderTextButton('Ostatni dzień', util.commands.RESULTS_LAST_DAY),
            [util.commands.RESULTS_LAST_WEEK]: this.renderTextButton('Ostatni tydzień', util.commands.RESULTS_LAST_WEEK),
            [util.commands.RESULTS_LAST_MONTH]: this.renderTextButton('Ostatni miesiąc', util.commands.RESULTS_LAST_MONTH),
            [util.commands.RESULTS_LAST_YEAR]: this.renderTextButton('Ostatni rok', util.commands.RESULTS_LAST_YEAR)
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