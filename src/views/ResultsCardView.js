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
        const baseCommand = utils.commands.RESULTS;
        const subCommands = baseCommand.subCommands;

        const allButtons = {
            [baseCommand.command]: this.renderTextButton(baseCommand.buttonName, baseCommand.command),
            [subCommands.LAST_DAY.command]: this.renderTextButton(subCommands.LAST_DAY.buttonName, utils.buildCmd(baseCommand, subCommands.LAST_DAY)),
            [subCommands.LAST_WEEK.command]: this.renderTextButton(subCommands.LAST_WEEK.buttonName, utils.buildCmd(baseCommand, subCommands.LAST_WEEK)),
            [subCommands.LAST_MONTH.command]: this.renderTextButton(subCommands.LAST_MONTH.buttonName, utils.buildCmd(baseCommand, subCommands.LAST_MONTH)),
            [subCommands.LAST_YEAR.command]: this.renderTextButton(subCommands.LAST_YEAR.buttonName, utils.buildCmd(baseCommand, subCommands.LAST_YEAR))
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