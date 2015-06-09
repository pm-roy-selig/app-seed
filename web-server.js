var open = require('open' ),
    path = require('path'),
    express = require('express');

var app = express();

var staticPath = path.resolve(__dirname, '');

console.log(staticPath);

app.use(express.static(staticPath));

app.listen(9999, function() {
    console.log('listening on 9999');
});

open('http://localhost:9999/app/');