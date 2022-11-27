const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
app.use(cors());

app.use(bodyParser.json({limit: '100mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'})); // for parsing

const db = 'mongodb+srv://pi:Guyava100@whats-on.892yv.mongodb.net/?retryWrites=true&w=majority&retryWrites=false';

connectDbAndRunServer();

// require('./socket/socket-manager');
//init

app.get('/', (req, res) => {
    res.send('Hey from shelf server');
})

/*app.get('/logs', (req, res) => {
    res.json({success: true, logs: logUtils.get()});
})*/

// const utils = require('./util/util');
// require('./ai/ai-util').test();

async function connectDbAndRunServer() {
    console.log('connecting db...');
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('mongodb connected')
        // utils.test();
        // ai.predict();
        // require('./data/data-provider');
        // require('./real-time/tcp-client');

        app.listen(port, function () {
            console.log(`Listening on port ${port}`);
        });

    } catch (e) {
        console.error(e);
    }
}


// const io = require('socket.io-client');
// const shelfSocket = io('http://35.184.202.111:8000', {query: {cartManager: true}});
// const socket = io('http://localhost:4000');

/*socket = io.connect('http://localhost', {
    port: 4000,
    reconnect: true
});*/


/*//send the user to 500 page without shutting down the server
process.on('uncaughtException', function (err) {
    logUtils.add('-------------------------- Caught exception: ' + err);
    console.log('-------------------------- Caught exception: ' + err);
});

// production error handler
app.use(function (err, req, res, next) {
    logUtils.add(err);
    next();
});*/


// require('./logic/shelf-logic').handleShelfAction('A15', [], 'add3.txt');
// require('./logic/shelf-logic').handleShelfActionPlanogram('A15', [], 'add3.txt');

/*setTimeout(() => {
    require('./logic/shelf-logic').handleShelfAction('A6', [], 'rem3.txt');
}, 2000);*/





