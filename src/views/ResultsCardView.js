const CardView = require('./CardView');
const utils = require('../utils');
const labels = require('../labels');

module.exports = class ResultsCardView extends CardView {
    constructor(title, playerScores) {
        super();

        this.setTitle(title);
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
        const {alias, place, shoots, shootsAvg, tournamentsNum} = playerScore;

        return {
            keyValue: {
                iconUrl: utils.getPlaceIconUrl(place),
                topLabel: utils.getPlace(place),
                content: alias + ' - ' + parseFloat(shootsAvg).toFixed(2),
                bottomLabel: utils.getShootsDeclination(shoots) + labels.IN_SMTH.format(utils.getTournamentsDeclination(tournamentsNum))
            }
        }
    };
};