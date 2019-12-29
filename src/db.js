const { Pool } = require('pg');
const ValidationError = require('./ValidationError');

const db = new Pool({
    connectionString: process.env.DATABASE_URL
});

const createPlayer = async (firstName, lastName, alias) => {
    await db.query('INSERT INTO players (first_name, last_name, alias) VALUES ($1, $2, $3)', [firstName, lastName, alias]);
};

const createScores = async (playerScores) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const tournamentResponse = await client.query('INSERT INTO tournaments DEFAULT VALUES RETURNING id');
        const tournamentId = tournamentResponse.rows[0].id;

        for (const playerScore of playerScores) {
            const playerResponse = await client.query('SELECT id FROM players WHERE alias = $1', [playerScore.alias]);

            if (playerResponse.rows.length === 0) {
                throw new ValidationError(`Zawodnik o pseudonimie *${playerScore.alias}* nie istnieje!`);
            }

            const playerId = playerResponse.rows[0].id;

            await client.query('INSERT INTO scores (player_id, tournament_id, position, shoots, playoff_shoots, playoff_rounds) VALUES ($1, $2, $3, $4, $5, $6)', [playerId, tournamentId, playerScore.place, playerScore.shoots, playerScore.playoffShoots, playerScore.playoffRounds]);
            await client.query('COMMIT');
        }
    } catch (e) {
        try {
            await client.query('ROLLBACK');
        } catch (rollbackError) {
            console.log('rollback error: ' + rollbackError);
            throw rollbackError;
        }

        console.log('ERROR createScores: ' + e);
        throw e;
    } finally {
        client.release();
    }
};

const getScores = async (dateWhereClause) => {
    const query = 'SELECT alias, sum(shoots) shoots_sum, sum(playoff_shoots) playoff_shoots_sum, sum(playoff_rounds) playoff_rounds_sum ' +
        'FROM scores JOIN players p on scores.player_id = p.id JOIN tournaments t on scores.tournament_id = t.id ' +
        'WHERE t.created_at = ' + dateWhereClause + ' ' +
        'GROUP BY alias ' +
        'ORDER BY shoots_sum DESC, playoff_shoots_sum DESC, playoff_rounds_sum DESC';

    const scoresResponse = await db.query(query);
    if (scoresResponse.rows.length === 0) {
        throw new ValidationError(`Brak danych w tym okresie!`);
    }

    console.log('SCORES ROWS: ' + JSON.stringify(scoresResponse.rows));

    return scoresResponse;
};

module.exports = {
    createPlayer,
    createScores,
    getScores
};