const express = require('express');
const PORT = process.env.PORT || 8888;

const app = express()
    .use(express.urlencoded({extended: false}))
    .use(express.json());

app.post('/', (req, res) => {
    console.log('HELLO - POST');
    console.log(JSON.stringify(req));

    let text = '';
    // Case 1: When BOT was added to the ROOM
    if (req.body.type === 'ADDED_TO_SPACE' && req.body.space.type === 'ROOM') {
        text = `Thanks for adding me to ${req.body.space.displayName}`;
        // Case 2: When BOT was added to a DM
    } else if (req.body.type === 'ADDED_TO_SPACE' &&
        req.body.space.type === 'DM') {
        text = `Thanks for adding me to a DM, ${req.body.user.displayName}`;
        // Case 3: Texting the BOT
    } else if (req.body.type === 'MESSAGE') {
        text = `Your message : ${req.body.message.text}`;
    } else {
        return res.json({"errorMsg": "No type detected"});
    }

    return res.json({text});
});

app.listen(PORT, () => {
    console.log(`Server is running in port - ${PORT}`);
});