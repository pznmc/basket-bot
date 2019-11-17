const express = require('express');
const PORT = process.env.PORT || 8888;

const app = express()
    .use(express.urlencoded({extended: false}))
    .use(express.json());

app.post('/', (req, res) => {
    console.log(JSON.stringify(req.body));
    const { space, user, type, message, action } = req.body || {};

    switch (type) {
        case 'ADDED_TO_SPACE':
            let text = '';

            if (space.type === 'ROOM') {
                text = `Thanks for adding me to ${space.displayName}`;
            } else if (space.type === 'DM') {
                text = `Thanks for adding me to ${user.displayName}`;
            }

            return res.json({text});
        case 'MESSAGE':
            return res.json({text: `You have wrote: ${message.text}`});
        case 'CARD_CLICKED':
            return res.json({text: `You wanted to make an action ${action.actionMethodName} with parameters: ${action.parameters}`});
        default:
            return res.json({text: 'Unknown type'});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running in port - ${PORT}`);
});