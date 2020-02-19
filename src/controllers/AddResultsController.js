const db = require('../db');
const BaseController = require('./BaseController');
const ResultsRecentCardView = require('../views/ResultsRecentCardView');

module.exports = class MostLosesController extends BaseController {
    constructor(commandDef, command, body) {
        super(commandDef, command, body);
    }

    async getResults() {
        try {
            const playerScores = this.body.split('\n').map(line => {
                const positionToLine = line.split('. ');
                const aliasToLine = positionToLine[1].split(' - ');
                const playoffChunks = aliasToLine[1].split(' + ').slice(1);

                return {
                    'place': parseInt(positionToLine[0]),
                    'alias': aliasToLine[0],
                    'shoots': parseInt(aliasToLine[1].split(' + ')[0]),
                    'playoffShoots': playoffChunks.reduce((res, elem) => res + parseInt(elem), 0),
                    'playoffRounds': playoffChunks.length
                }
            });

            await db.createScores(playerScores);

            const headerTitle = this.commandDef.cardName;
            return new ResultsRecentCardView(this.commandDef, headerTitle, playerScores)
                .addCommands(this.commands)
                .enableButtonsSection()
                .getJson();
        } catch (e) {
            console.log('ERROR handleAddResults: ' + e);
            throw e;
        }
    }
};
