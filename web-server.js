var open = require('open' ),
    path = require('path'),
    express = require('express');

var app = express();

var staticPath = path.resolve(__dirname, '/public');
app.use(express.static(staticPath));

app.listen(4040, function() {
    console.log('listening');
});

open('http://localhost:4040/');