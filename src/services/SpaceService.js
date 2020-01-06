const labels = require('../labels');
const TextView = require('../views/TextView');

exports.response = (requestBody) => {
    switch (requestBody.space.type) {
        case 'DM':
            return new TextView(labels.WELCOME_SPACE_DM).getJson();
        case 'ROOM':
            return new TextView(labels.WELCOME_SPACE_ROOM).getJson();
        default:
            return new TextView(labels.SOMETHING_WENT_WRONG).getJson();
    }
};