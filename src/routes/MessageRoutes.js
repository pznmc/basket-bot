require('string.prototype.format');
const commands = require('../commands');
const labels = require('../labels');

const TextView = require('../views/TextView');

const AddResultsController = require('../controllers/AddResultsController');
const AddPlayerController = require('../controllers/AddPlayerController');
const ResultsController = require('../controllers/ResultsController');
const MostShootsController = require('../controllers/MostShootsController');
const MostWinsController = require('../controllers/MostWinsController');
const MostLosesController = require('../controllers/MostLosesController');
const MostWinsSeriesController = require('../controllers/MostWinsSeriesController');
const MostLosesSeriesController = require('../controllers/MostLosesSeriesController');
const HelpController = require('../controllers/HelpController');
const TournamentsController = require('../controllers/TournamentsController');
const LastTenTournamentsController = require('../controllers/LastTenTournamentsController');

exports.response = async (message) => {
    try {
        const { argumentText, sender } = message || {};
        const senderEmail = sender && sender.email;
        console.log('MSG: ' + JSON.stringify(message));
        // Get command when text is multiline or not
        let messageCommand = argumentText.includes('\n') ? argumentText.trim().substring(0, argumentText.indexOf('\n')).trim() : argumentText.trim();

        // Remove diacritic characters
        messageCommand = messageCommand.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0142/g, 'l');

        // Get message body only when entire text is multiline
        const messageBody = argumentText.includes('\n') ? argumentText.substring(argumentText.indexOf('\n')).trim() : '';
        console.log('COMM: ' + messageCommand);
        console.log('BODY: ' + messageBody);

        if (messageCommand === commands.ADD_RESULTS.command) {
            return await new AddResultsController(messageCommand, messageBody).getResults();
        } else if (messageCommand === commands.ADD_PLAYER.command) {
            return await new AddPlayerController(messageCommand, messageBody).getResults();
        } else if (messageCommand.startsWith(commands.RESULTS.command)) {
            return await new ResultsController(messageCommand).getResults();
        } else if (messageCommand.startsWith(commands.MOST_SHOOTS.command)) {
            return await new MostShootsController(messageCommand).getResults();
        } else if (messageCommand.startsWith(commands.MOST_WINS.command)) {
            return await new MostWinsController(messageCommand).getResults();
        } else if (messageCommand.startsWith(commands.MOST_LOSES.command)) {
            return await new MostLosesController(messageCommand).getResults();
        } else if (messageCommand.startsWith(commands.SERIES_WINS.command)) {
            return await new MostWinsSeriesController(messageCommand).getResults();
        } else if (messageCommand.startsWith(commands.SERIES_LOST.command)) {
            return await new MostLosesSeriesController(messageCommand).getResults();
        } else if (messageCommand.startsWith(commands.BEST_TOURNAMENTS.command) || messageCommand.startsWith(commands.WORST_TOURNAMENTS.command)) {
            return await new TournamentsController(messageCommand).getResults();
        } else if (messageCommand.startsWith(commands.LAST_TEN_GAMES.command)) {
            return await new LastTenTournamentsController(senderEmail).getResults();
        } else if (messageCommand === commands.HELP.command) {
            return new HelpController().getResults();
        }

        return new TextView(labels.NO_COMMAND).getJson();
    } catch (e) {
        throw e;
    }
};