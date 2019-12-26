const express = require('express');
const SpaceService = require('./services/SpaceService');
const MessageService = require('./services/MessageService');

const PORT = process.env.PORT || 8888;

const app = express()
    .use(express.urlencoded({extended: false}))
    .use(express.json());

app.post('/', async (req, res) => {
    console.log('PAZNA: ' + JSON.stringify(req.body));
    try {
        const { type, message, action } = req.body || {};
        switch (type) {
            case 'ADDED_TO_SPACE':
                return res.json(SpaceService.response(req.body));
            case 'MESSAGE':
                return res.json(await MessageService.response(message));
            case 'CARD_CLICKED':
                return res.json({text: `You wanted to make an action ${action.actionMethodName} with parameters: ${action.parameters}`});
            default:
                return res.json({text: 'Unknown type'});
        }
    } catch (e) {
        console.log('PAZNA post: ' + e.message);

        if (e instanceof Error) {
            return res.json({text: e.message});
        }

        return res.json({text: `Coś poszło nie tak...\n\`${e.message}\``});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running in port - ${PORT}`);
});