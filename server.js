const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const studentRouter = require('./routes/students');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/', studentRouter);

app.listen(3000, function() {
    console.log("App listening post 3000");
});