const db = require('../db');
const labels = require('../labels');
const ValidationError = require('../ValidationError');
const BaseController = require('./BaseController');
const TextView = require('../views/TextView');

module.exports = class MostLosesController extends BaseController {
    constructor(command, body) {
        super(command, body);
    }

    async getResults() {
        try {
            const playerChunks = this.body.split(' ');

            if (playerChunks.length !== 3) {
                throw new ValidationError(labels.ADD_PLAYER_WRONG_FORMAT);
            }

            await db.createPlayer(playerChunks[0], playerChunks[1], playerChunks[2]);

            return new TextView(labels.ADD_PLAYER_SUCCESS.format(playerChunks[0], playerChunks[2], playerChunks[1])).getJson();
        } catch (e) {
            throw e;
        }
    }
};