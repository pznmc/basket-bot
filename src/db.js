const Pool = require('pg').Pool;

const db = new Pool({
    user: 'pdsyxtszaefztw',
    host: 'ec2-54-217-225-16.eu-west-1.compute.amazonaws.com',
    database: 'dfn2234ll8u8cf',
    password: '1eb35ea4c0c595a04efead2a38adf6c4818dd3f97d69b5e2503a2d1c4e639d34',
    port: 5432,
});



const createPlayer = (firstName, lastName, alias) => {
    db.query('INSERT INTO players (first_name, last_name, alias) VALUES ($1, $2, $3)', [firstName, lastName, alias], (error) => {
        if (error) {
            throw error
        }
    })
};

module.exports = {
    createPlayer
};