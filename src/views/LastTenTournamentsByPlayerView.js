const labels = require('../labels');
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
            this.createBodyElement(labels.EFFICIENCY, `${((parseInt(shoots) / 120) * 100).toFixed(0)}%`),
            this.createBodyElement(labels.WON_OR_LOST_TOURNAMENTS, `${wins} / ${loses}`),
            this.createBodyElement(labels.MOST_OR_LEAST_SHOOTS_IN_TOURNAMENT, `${max_shoots} / ${min_shoots}`),
            this.createBodyElement(labels.SHOOTS_NUM, shoots),
            this.createBodyElement(labels.SHOOTS_MEAN, parseFloat(avg_shoots).toFixed(2))
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