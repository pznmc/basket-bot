const express = require('express');
const ValidationError = require('./ValidationError');
const SpaceRoutes = require('./routes/SpaceRoutes');
const MessageRoutes = require('./routes/MessageRoutes');
const TextView = require('./views/TextView');
const labels = require('./labels');

const PORT = process.env.PORT || 8888;

const app = express()
    .use(express.urlencoded({extended: false}))
    .use(express.json());

app.post('/', async (req, res) => {
    try {
        const { type, message, action } = req.body || {};
        switch (type) {
            case 'ADDED_TO_SPACE':
                return res.json(SpaceRoutes.response(req.body));
            case 'MESSAGE':
                return res.json(await MessageRoutes.response(message));
            case 'CARD_CLICKED':
                const messageCommand = { argumentText: action.actionMethodName };
                return res.json(await MessageRoutes.response(messageCommand));
            default:
                return res.json(new TextView(labels.SOMETHING_WENT_WRONG).getJson());
        }
    } catch (e) {
        if (e instanceof ValidationError) {
            return res.json({text: e.message});
        }

        return res.json(new TextView(`${labels.SOMETHING_WENT_WRONG} \n\`\`\`${e.stack}\`\`\``).getJson());
    }
});

app.listen(PORT, () => {
    console.log(`Server is running in port - ${PORT}`);
});