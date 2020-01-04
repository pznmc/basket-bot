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
    const query = 'SELECT alias, SUM(shoots) shoots, COUNT(t.id) "tournamentsNum", ' +
            'ROW_NUMBER() OVER (ORDER BY SUM(shoots) DESC, COUNT(t.id) ASC, SUM(playoff_shoots) DESC, SUM(playoff_rounds) DESC) place ' +
        'FROM scores JOIN players p on scores.player_id = p.id JOIN tournaments t on scores.tournament_id = t.id ' +
        'WHERE t.created_at ' + dateWhereClause + ' ' +
        'GROUP BY alias ' +
        'ORDER BY SUM(shoots) DESC, COUNT(t.id) ASC, SUM(playoff_shoots) DESC, SUM(playoff_rounds) DESC';

    const scoresResponse = await db.query(query);
    if (scoresResponse.rows.length === 0) {
        throw new ValidationError(`Brak danych w tym okresie!`);
    }

    return scoresResponse.rows;
};

const getMostShootsByPlayer = async () => {
    const query = `
        SELECT alias, shoots, created_at
        FROM (
            SELECT alias, MAX(shoots) shoots, t.created_at, RANK() OVER (PARTITION BY alias ORDER BY MAX(shoots) DESC, MIN(t.created_at) ASC, MAX(playoff_shoots) DESC) rank
            FROM scores JOIN players p on scores.player_id = p.id JOIN tournaments t on scores.tournament_id = t.id
            GROUP BY alias, t.created_at
        ) AS most_shoots
        WHERE rank = 1
        ORDER BY shoots DESC, created_at ASC, alias ASC
    `;

    const mostShootsResponse = await db.query(query);
    if (mostShootsResponse.rows.length === 0) {
        throw new ValidationError(`Brak danych!`);
    }

    return mostShootsResponse.rows;
};

const getMostShootsByPeriod = async (periodType) => {
    const query = 'SELECT alias, created_at, shoots, period ' +
        'FROM ' +
            '(SELECT alias, t.created_at, max(shoots) shoots, DATE_TRUNC(\'' + periodType + '\', t.created_at) period, RANK() OVER (PARTITION BY DATE_TRUNC(\'' + periodType + '\', t.created_at) ORDER BY MAX(shoots) DESC, MIN(t.created_at) ASC, MAX(playoff_shoots)) rank ' +
            'FROM scores JOIN players p on scores.player_id = p.id JOIN tournaments t on scores.tournament_id = t.id ' +
            'GROUP BY alias, t.created_at' +
        ') AS period_shoots ' +
        'WHERE rank = 1 ' +
        'ORDER BY period ASC';

    const mostShootsResponse = await db.query(query);
    if (mostShootsResponse.rows.length === 0) {
        throw new ValidationError(`Brak danych!`);
    }

    return mostShootsResponse.rows;
};

const getMostWinsByPlayer = async () => {
    const query = `
        SELECT alias, wins
        FROM (
            SELECT alias, COUNT(position) wins, RANK() OVER (PARTITION BY alias ORDER BY COUNT(position) DESC, MAX(shoots) DESC, MAX(playoff_shoots) DESC) rank
            FROM scores JOIN players p on scores.player_id = p.id JOIN tournaments t on scores.tournament_id = t.id
            WHERE position = 1
            GROUP BY alias
        ) AS most_shoots
        WHERE rank = 1
        ORDER BY wins DESC, alias ASC
    `;

    const mostWinsResponse = await db.query(query);
    if (mostWinsResponse.rows.length === 0) {
        throw new ValidationError(`Brak danych!`);
    }

    return mostWinsResponse.rows;
};

const getMostWinsByPeriod = async (periodType) => {
    const query = `
        SELECT alias, wins, period
        FROM (
            SELECT alias, COUNT(position) wins, DATE_TRUNC('${periodType}', t.created_at) period, RANK() OVER (PARTITION BY DATE_TRUNC('${periodType}', t.created_at) ORDER BY COUNT(position) DESC, MAX(shoots) DESC, MAX(playoff_shoots) DESC) rank
            FROM scores JOIN players p on scores.player_id = p.id JOIN tournaments t on scores.tournament_id = t.id
            WHERE position = 1
            GROUP BY alias, DATE_TRUNC('${periodType}', t.created_at)
        ) AS period_wins
        WHERE rank = 1
        ORDER BY period ASC
    `;

    const mostWinsResponse = await db.query(query);
    if (mostWinsResponse.rows.length === 0) {
        throw new ValidationError(`Brak danych!`);
    }

    return mostWinsResponse.rows;
};

module.exports = {
    createPlayer,
    createScores,
    getScores,
    getMostShootsByPlayer,
    getMostShootsByPeriod,
    getMostWinsByPlayer,
    getMostWinsByPeriod
};