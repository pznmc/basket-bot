const db = require('../db');
const labels = require('../labels');
const BaseController = require('./BaseController');
const ValidationError = require('../ValidationError');
const ResultsCardView = require('../views/ResultsCardView');
const ResultsRecentCardView = require('../views/ResultsRecentCardView');

module.exports = class ResultsController extends BaseController {
    constructor(commandDef, command) {
        super(commandDef, command);
    }
    
    async getResults() {
        const baseCommand = this.commandDef;
        let dateWhereClause = '';
        let headerTitle;
        let scores;

        if (this.command === baseCommand.command) {
            headerTitle = baseCommand.cardName;
            scores = await db.getScoresRecent();

            return new ResultsRecentCardView(headerTitle, scores).getJson();
        } else {
            if (this.command.includes(baseCommand.LAST_DAY.command)) {
                headerTitle = baseCommand.LAST_DAY.cardName;
                dateWhereClause = '> CURRENT_DATE - 1';
            } else if (this.command.includes(baseCommand.subCommands.LAST_WEEK.command)) {
                headerTitle = baseCommand.LAST_WEEK.cardName;
                dateWhereClause = '> CURRENT_DATE - 7';
            } else if (this.command.includes(baseCommand.subCommands.LAST_MONTH.command)) {
                headerTitle = baseCommand.LAST_MONTH.cardName;
                dateWhereClause = '> CURRENT_DATE - 30';
            } else if (this.command.includes(baseCommand.subCommands.LAST_YEAR.command)) {
                headerTitle = baseCommand.LAST_YEAR.cardName;
                dateWhereClause = '> CURRENT_DATE - 365';
            } else if (this.command.includes('od') && this.command.includes('do')) {
                headerTitle = this.command.charAt(0).toUpperCase() + this.command.slice(1);

                const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
                const dateFromRegex = /od (.*) do/;
                const dateToRegex = /do (.*)/;

                const startDate = this.command.match(dateFromRegex)[1];
                const endDate = this.command.match(dateToRegex)[1];

                if (!dateFormatRegex.test(startDate) || !dateFormatRegex.test(endDate)) {
                    throw new ValidationError(labels.RESULTS_WRONG_DATE_FORMAT);
                }

                dateWhereClause = 'BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'';
            } else {
                throw new ValidationError(labels.NO_COMMAND);
            }

            scores = await db.getScoresByPeriod(dateWhereClause);

            return new ResultsCardView(headerTitle, scores)
                .enableButtonsSection(this.command)
                .getJson();
        }
    }
};