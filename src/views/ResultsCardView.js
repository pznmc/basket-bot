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

    handleButtonsSection() {
        let buttons = [];
        buttons.push(this.renderTextButton('Ostatni dzień', 'getResults', 'daily'));
        buttons.push(this.renderTextButton('Ostatni tydzień', 'getResults', 'weekly'));
        buttons.push(this.renderTextButton('Ostatni miesiąc', 'getResults', 'monthly'));
        this.addButtonsSection(buttons);
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