var open = require('open' ),
    path = require('path'),
    express = require('express');

var app = express();

var staticPath = path.resolve(__dirname, '');

console.log(staticPath);

app.use(express.static(staticPath));

app.listen(4040, function() {
    console.log('listening on 4040');
});

open('http://localhost:4040/app/');