require('string.prototype.format');
const { Pool } = require('pg');
const ValidationError = require('./ValidationError');
const labels = require('./labels');

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
                throw new ValidationError(labels.ADD_PLAYER_ALIAS_NO_EXISTS.format(playerScore.alias));
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

const getScoresRecent = async () => {
    const query = `
        SELECT alias, shoots, position place
        FROM scores JOIN players p on scores.player_id = p.id JOIN tournaments t on scores.tournament_id = t.id
        WHERE t.created_at = (SELECT MAX(created_at) FROM tournaments)
        ORDER BY position ASC, playoff_shoots DESC, playoff_rounds ASC
    `;

    const scoresResponse = await db.query(query);
    if (scoresResponse.rows.length === 0) {
        throw new ValidationError(labels.NO_DATA);
    }

    return scoresResponse.rows;
};

const getScoresByPeriod = async (dateWhereClause) => {
    const query = `
        SELECT alias, SUM(shoots) shoots, AVG(shoots) "shootsAvg", COUNT(t.id) "tournamentsNum" 
            ROW_NUMBER() OVER (ORDER BY AVG(shoots) DESC, COUNT(t.id) ASC, AVG(playoff_shoots) DESC, SUM(playoff_rounds) DESC) place 
        FROM scores JOIN players p on scores.player_id = p.id JOIN tournaments t on scores.tournament_id = t.id 
        WHERE t.created_at ${dateWhereClause}
        GROUP BY alias 
        ORDER BY AVG(shoots) DESC, COUNT(t.id) ASC, AVG(playoff_shoots) DESC, SUM(playoff_rounds) ASC
    `;

    const scoresResponse = await db.query(query);
    if (scoresResponse.rows.length === 0) {
        throw new ValidationError(labels.NO_DATA_IN_SUCH_PERIOD);
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
        throw new ValidationError(labels.NO_DATA);
    }

    return mostShootsResponse.rows;
};

const getMostShootsByPeriod = async (periodType) => {
    const query = `
        SELECT alias, created_at, shoots, period
        FROM ( 
            SELECT alias, t.created_at, max(shoots) shoots, DATE_TRUNC('${periodType}', t.created_at) period, RANK() OVER (PARTITION BY DATE_TRUNC('${periodType}', t.created_at) ORDER BY MAX(shoots) DESC, MIN(t.created_at) ASC, MAX(playoff_shoots)) rank
            FROM scores JOIN players p on scores.player_id = p.id JOIN tournaments t on scores.tournament_id = t.id 
            GROUP BY alias, t.created_at
        ) AS period_shoots
        WHERE rank = 1
        ORDER BY period ASC
    `;

    const mostShootsResponse = await db.query(query);
    if (mostShootsResponse.rows.length === 0) {
        throw new ValidationError(labels.NO_DATA);
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
        throw new ValidationError(labels.NO_DATA);
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
        throw new ValidationError(labels.NO_DATA);
    }

    return mostWinsResponse.rows;
};

const getMostWinsSeries = async () => {
    const query = `
        SELECT alias
        FROM scores JOIN players p ON scores.player_id = p.id JOIN tournaments t ON scores.tournament_id = t.id
        WHERE position = 1
        ORDER BY t.created_at ASC
    `;

    const winsResponse = await db.query(query);
    if (winsResponse.rows.length === 0) {
        throw new ValidationError(labels.NO_DATA);
    }

    return handleSeriesData(winsResponse, 'wins');
};

const getMostLostSeries = async () => {
    const query = `
        SELECT alias
        FROM scores JOIN players p ON scores.player_id = p.id JOIN tournaments t ON scores.tournament_id = t.id
        WHERE position = (
            SELECT max(position)
            FROM scores JOIN tournaments t2 ON scores.tournament_id = t2.id 
            WHERE t2.id = t.id)
        ORDER BY t.created_at ASC
    `;

    const lostResponse = await db.query(query);
    if (lostResponse.rows.length === 0) {
        throw new ValidationError(labels.NO_DATA);
    }

    return handleSeriesData(lostResponse, 'lost');
};

const handleSeriesData = (data, eventName) => {
    let prevAlias;
    return Object.entries(data.rows
        .reduce((obj, elem) => {
            if (elem.alias === prevAlias) {
                obj[elem.alias]++;
            } else {
                obj[elem.alias] = 1;
            }

            prevAlias = elem.alias;

            return obj;
        }, {}))
        .map(elem => { return { alias: elem[0], [eventName]: elem[1] }})
        .sort((a, b) => b[eventName] - a[eventName]);
};

module.exports = {
    createPlayer,
    createScores,
    getScoresRecent,
    getScoresByPeriod,
    getMostShootsByPlayer,
    getMostShootsByPeriod,
    getMostWinsByPlayer,
    getMostWinsByPeriod,
    getMostWinsSeries,
    getMostLostSeries
};