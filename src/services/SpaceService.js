exports.response = (requestBody) => {
    switch (requestBody.space.type) {
        case 'DM':
            return {text: 'DM'};
        case 'ROOM':
            return {text: 'ROOM'};
        default:
            return {text: 'Not found'};
    }
};