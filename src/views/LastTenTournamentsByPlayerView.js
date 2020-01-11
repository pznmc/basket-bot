const CardView = require('./CardView');

module.exports = class LastTenTournamentsByPlayerView extends CardView {
    constructor(title, scores) {
        super();

        this.setTitle(title);
        this.handleBodyElements(scores);
    }

    handleBodyElements(scores) {
        const { shoots, avg_shoots, max_shoots, min_shoots, wins, loses } = scores;

        const bodyElements = [
            this.createBodyElement('Skuteczność', ((parseInt(shoots) / 120) * 100).toFixed(0)),
            this.createBodyElement('Wygranych / przegranych turniejów', wins + ' / ' + loses),
            this.createBodyElement('Najwięcej / najmniej rzutów w jednym turnieju', max_shoots + ' / ' + min_shoots),
            this.createBodyElement('Ilość rzutów', shoots),
            this.createBodyElement('Średnia ilość rzutów na turniej', parseFloat(avg_shoots).toFixed(2))
        ];

        this.addBodySection(bodyElements);
    };

    createBodyElement(label, value) {
        return {
            keyValue: {
                topLabel: label,
                content: value
            }
        }
    }
};