const CardView = require('./CardView');
const utils = require('../utils');
const labels = require('../labels');

module.exports = class ResultsCardView extends CardView {
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
        const commands = utils.commands;

        const buttons = [
            this.renderTextButton(commands.RESULTS_LAST_DAY.buttonName, commands.RESULTS_LAST_DAY.command),
            this.renderTextButton(commands.RESULTS_LAST_WEEK.buttonName, commands.RESULTS_LAST_WEEK.command),
            this.renderTextButton(commands.RESULTS_LAST_MONTH.buttonName, commands.RESULTS_LAST_MONTH.command),
            this.renderTextButton(commands.RESULTS_LAST_YEAR.buttonName, commands.RESULTS_LAST_YEAR.command)
        ];

        this.addButtonsSection(buttons);;
    }

    handleBodyElement = (playerScore) => {
        const {alias, place, shoots, shootsAvg, tournamentsNum} = playerScore;

        return {
            keyValue: {
                iconUrl: utils.getPlaceIconUrl(place),
                topLabel: utils.getPlace(place),
                content: alias + ' - średnia: ' + shootsAvg,
                bottomLabel: utils.getShootsDeclination(shoots) + labels.IN_SMTH.format(utils.getTournamentsDeclination(tournamentsNum))
            }
        }
    };
};