const db = require('../db');
const utils = require('../utils');
const labels = require('../labels');
const ValidationError = require('../ValidationError');
const MostLostSeriesCardView = require('../views/MostLostSeriesCardView');
const MostShootsByPeriodCardView = require('../views/MostShootsByPeriodCardView');
const MostShootsByPlayerCardView = require('../views/MostShootsByPlayerCardView');
const MostWinsByPeriodCardView = require('../views/MostWinsByPeriodCardView');
const MostWinsByPlayerCardView = require('../views/MostWinsByPlayerCardView');
const MostWinsSeriesCardView = require('../views/MostWinsSeriesCardView');
const ResultsCardView = require('../views/ResultsCardView');
const TextView = require('../views/TextView');

exports.response = async (message) => {
    try {
        const { argumentText } = message || {};

        // Get command when text is multiline or not
        let messageCommand = argumentText.includes('\n') ? argumentText.trim().substring(0, argumentText.indexOf('\n')).trim() : argumentText.trim();

        // Remove diacritic characters
        messageCommand = messageCommand.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0142/g, 'l');

        // Get message body only when entire text is multiline
        const messageBody = argumentText.includes('\n') ? argumentText.substring(argumentText.indexOf('\n')).trim() : '';
        console.log('COMM:' + messageCommand + ':');
        console.log('BODY: ' + messageBody);
        console.log('UTILS: ' + JSON.stringify(utils.commands));

        if (messageCommand === 'dodaj wyniki') {
            return await handleAddResults(messageBody);
        } else if (messageCommand === 'dodaj zawodnika') {
            return await handleAddPlayer(messageBody);
        } else if (messageCommand.startsWith(utils.commands.RESULTS.command)) {
            return await handleGetResults(messageCommand);
        } else if (messageCommand.startsWith(utils.commands.MOST_SHOOTS.command)) {
            return await handleGetMostShoots(messageCommand);
        } else if (messageCommand.startsWith(utils.commands.MOST_WINS.command)) {
            return await handleGetMostWins(messageCommand);
        } else if (messageCommand.startsWith(utils.commands.SERIES_WINS.command)) {
            return await handleGetMostWinsSeries();
        } else if (messageCommand.startsWith(utils.commands.SERIES_LOST.command)) {
            return await handleGetMostLostSeries();
        } else if (messageCommand === utils.commands.HELP.command) {
            return handleHelpCommand();
        }

        return new TextView(labels.NO_COMMAND).getJson();
    } catch (e) {
        console.log('ERROR response: ' + e);
        throw e;
    }
};

const handleGetResults = async (msgCommand) => {
    let dateWhereClause = '';
    let headerTitle;
    let scores;

    if (msgCommand === utils.commands.RESULTS) {
        headerTitle = utils.commands.RESULTS.cardName;
        scores = await db.getScoresRecent();
    } else {
        if (msgCommand.includes('ostatni dzien')) {
            headerTitle = utils.commands.RESULTS_LAST_DAY.cardName;
            dateWhereClause = '> CURRENT_DATE - 1';
        } else if (msgCommand.includes('ostatni tydzien')) {
            headerTitle = utils.commands.RESULTS_LAST_WEEK.cardName;
            dateWhereClause = '> CURRENT_DATE - 7';
        } else if (msgCommand.includes('ostatni miesiac')) {
            headerTitle = utils.commands.RESULTS_LAST_MONTH.cardName;
            dateWhereClause = '> CURRENT_DATE - 30';
        } else if (msgCommand.includes('ostatni rok')) {
            headerTitle = utils.commands.RESULTS_LAST_YEAR.cardName;
            dateWhereClause = '> CURRENT_DATE - 365';
        } else if (msgCommand.includes('od') && msgCommand.includes('do')) {
            headerTitle = msgCommand.charAt(0).toUpperCase() + msgCommand.slice(1);

            const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
            const dateFromRegex = /od (.*) do/;
            const dateToRegex = /do (.*)/;

            const startDate = msgCommand.match(dateFromRegex)[1];
            const endDate = msgCommand.match(dateToRegex)[1];

            if (!dateFormatRegex.test(startDate) || !dateFormatRegex.test(endDate)) {
                throw new ValidationError(labels.RESULTS_WRONG_DATE_FORMAT);
            }

            dateWhereClause = 'BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'';
        } else {
            throw new ValidationError(labels.NO_COMMAND);
        }

        scores = await db.getScoresByPeriod(dateWhereClause);
    }

    return new ResultsCardView(headerTitle, scores)
        .enableButtonsSection(msgCommand)
        .getJson();
};

const handleGetMostShoots = async (msgCommand) => {
    try {
        let headerTitle;
        let scores;

        if (msgCommand === utils.commands.MOST_SHOOTS) {
            headerTitle = utils.commands.MOST_SHOOTS.cardName;
            scores = await db.getMostShootsByPlayer();
            return new MostShootsByPlayerCardView(headerTitle, scores).getJson();
        } else {
            const periodType = utils.getPeriodType(msgCommand);
            headerTitle = utils.commands.MOST_SHOOTS.cardName;
            scores = await db.getMostShootsByPeriod(periodType);

            return new MostShootsByPeriodCardView(headerTitle, scores, periodType)
                .enableButtonsSection(msgCommand)
                .getJson();
        }
    } catch (e) {
        throw e;
    }
};

const handleGetMostWins = async (msgCommand) => {
    try {
        let headerTitle;
        let scores;

        if (msgCommand === utils.commands.MOST_WINS) {
            headerTitle = utils.commands.MOST_WINS.cardName;
            scores = await db.getMostWinsByPlayer();

            return new MostWinsByPlayerCardView(headerTitle, scores).getJson();
        } else {
            const periodType = utils.getPeriodType(msgCommand);
            headerTitle = utils.commands.MOST_WINS.cardName;
            scores = await db.getMostWinsByPeriod(periodType);

            return new MostWinsByPeriodCardView(headerTitle, scores, periodType)
                .enableButtonsSection(msgCommand)
                .getJson();
        }
    } catch (e) {
        throw e;
    }
};

const handleGetMostWinsSeries = async () => {
    try {
        const headerTitle = utils.commands.SERIES_WINS.cardName;
        const mostWinsSeries = await db.getMostWinsSeries();

        return new MostWinsSeriesCardView(headerTitle, mostWinsSeries).getJson();
    } catch (e) {
        throw e;
    }
};

const handleGetMostLostSeries = async () => {
    try {
        const headerTitle = utils.commands.SERIES_LOST.cardName;
        const mostLostSeries = await db.getMostLostSeries();

        return new MostLostSeriesCardView(headerTitle, mostLostSeries).getJson();
    } catch (e) {
        throw e;
    }
};

const handleAddPlayer = async (msgBody) => {
    try {
        const playerChunks = msgBody.split(' ');

        if (playerChunks.length !== 3) {
            throw new ValidationError(labels.ADD_PLAYER_WRONG_FORMAT);
        }

        await db.createPlayer(playerChunks[0], playerChunks[1], playerChunks[2]);

        return new TextView(labels.ADD_PLAYER_SUCCESS.format(playerChunks[0], playerChunks[2], playerChunks[1])).getJson();
    } catch (e) {
        console.log('ERROR handleAddPlayer: ' + e);
        throw e;
    }
};

const handleAddResults = async (msgBody) => {
    try {
        const results = msgBody.split('\n').map(result => result.split('. ').pop());

        const playerScores = results.map((result, index) => {
            const resultChunks = result.split(' - ');
            const playoffChunks = resultChunks[1].split(' + ').slice(1);

            return {
                'place': ++index,
                'alias': resultChunks[0],
                'shoots': parseInt(resultChunks[1].split(' + ').shift()),
                'playoffShoots': playoffChunks.reduce((res, elem) => res + parseInt(elem), 0),
                'playoffRounds': playoffChunks.length
            }
        });

        await db.createScores(playerScores);

        const headerTitle = utils.commands.RESULTS.cardName;
        return new ResultsCardView(headerTitle, playerScores).getJson();
    } catch (e) {
        console.log('ERROR handleAddResults: ' + e);
        throw e;
    }
};

const handleHelpCommand = () => {
    const helpMessage = `Dostępne komendy:\`\`\`
- wyniki - [ostatni dzień | ostatni tydzień | ostatni miesiąc | ostatni rok | od YYYY-MM-DD do YYYY-MM-DD]
- najwięcej rzutów - [miesiąc | rok]
- najwięcej wygranych - [miesiąc | rok]
- seria wygranych
- seria przegranych
    
- dodaj zawodnika IMIĘ NAZWISKO ALIAS
- dodaj wyniki\`\`\``;

    return new TextView(helpMessage).getJson();
};