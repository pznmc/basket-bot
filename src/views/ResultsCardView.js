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
                iconUrl: this.getPlaceIconUrl(place),
                topLabel: this.generateTopLabel(place),
                content: alias,
                bottomLabel: this.generateBottomLabel(shoots, playoffShoots, playoffRounds, tournamentsNum)
            }
        }
    };

    getPlaceIconUrl(placeNum) {
        let url = 'https://ssl.gstatic.com/dynamite/emoji/png/128/';
        placeNum = parseInt(placeNum);

        switch (placeNum) {
            case 1:
                return url + 'emoji_u1f947.png';
            case 2:
                return url + 'emoji_u1f948.png';
            case 3:
                return url + 'emoji_u1f949.png';
            default:
                return url + 'emoji_u1f636.png';
        }
    }

    generateTopLabel(placeNum) {
        let text = `${placeNum} miejsce`;
        if (placeNum === 1) {
            text += ' - Zwycięzca';
        }

        return text;
    }

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