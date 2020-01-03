const CardView = require('./CardView');

module.exports = class ResultsCardView extends CardView {
    constructor(title, scores) {
        super();

        this.setTitle(title);
        this.handleBodySection(scores);
    }

    handleBodySection(scores) {
        this.addBodySection(scores, this.handleBodyElement);
    }

    handleButtonsSection() {
        let buttons = [];
        buttons.push(this.renderTextButton('Ostatni dzień', 'getResults', 'daily'));
        buttons.push(this.renderTextButton('Ostatni tydzień', 'getResults', 'weekly'));
        buttons.push(this.renderTextButton('Ostatni miesiąc', 'getResults', 'monthly'));
        this.addButtonsSection(buttons);
    }

    handleBodyElement = (score) => {
        const { alias, shoots, period, created_at } = score;

        return {
            keyValue: {
                topLabel: new Date(period).toLocaleString('pl-PL', { month: 'long', year: 'numeric' }),
                content: `${alias} - ${this.generateThrowsString(shoots)}`,
                bottomLabel: new Date(created_at).toLocaleString('pl-PL', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })
            }
        }
    };

    generateThrowsString(shootsNum) {
        if (shootsNum === 1) {
            return `${shootsNum} rzut`;
        } else if (2 <= shootsNum && shootsNum <= 4) {
            return `${shootsNum} rzuty`;
        } else {
            return `${shootsNum} rzutów`;
        }
    }
};