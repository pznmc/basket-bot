const db = require('../db');
const BaseController = require('./BaseController');
const ResultsRecentCardView = require('../views/ResultsRecentCardView');

module.exports = class MostLosesController extends BaseController {
    constructor(commandDef, command, body) {
        super(commandDef, command, body);
    }

    async getResults() {
        try {
            const results = this.body.split('\n').map(result => result.split('. ').pop());

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

            const headerTitle = this.commandDef.cardName;
            return new ResultsRecentCardView(this.commandDef, headerTitle, playerScores).getJson();
        } catch (e) {
            console.log('ERROR handleAddResults: ' + e);
            throw e;
        }
    }
};