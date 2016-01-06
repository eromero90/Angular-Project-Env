var express = require('express');
var app = express();

var dir = process.env.NODE_ENV === 'development'? 'dev' : 'prod'

//Static folder
app.use(express.static(dir+'/public'));

//Launch server
app.listen(8080);
console.log('Server started on port 8080');

exports.server = app;