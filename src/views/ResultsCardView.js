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

    enableButtons(excludedButtonCommand) {
        const allButtons = {
            'wyniki': this.renderTextButton('Wyniki (ogólne)', 'wyniki'),
            'wyniki - ostatni dzien': this.renderTextButton('Ostatni dzień', 'wyniki - ostatni dzień'),
            'wyniki - ostatni tydzien': this.renderTextButton('Ostatni tydzień', 'wyniki - ostatni tydzień'),
            'wyniki - ostatni miesiac': this.renderTextButton('Ostatni miesiąc', 'wyniki - ostatni miesiąc'),
            'wyniki - ostatni rok': this.renderTextButton('Ostatni rok', 'wyniki - ostatni rok')
        };

        const chosenButtons = Object.entries(allButtons)
            .filter(button => button[0] !== excludedButtonCommand)
            .map(button => button[1]);

        this.addButtonsSection(chosenButtons);
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