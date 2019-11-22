const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./lib/db');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {      
    let sql = "SELECT * FROM students";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.render("index", {data: result});
    });
});

app.get('/home', function(req, res) { 
    let sql = "SELECT * FROM students";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.render("index", {data: result});
    });
});

app.get('/new', function(req, res) {
    res.render('new');
});

app.post('/new', function(req, res) {
    let registrationID = req.body.registrationID;
    let name = req.body.name;
    let phone = req.body.phone;
    let dateString = req.body.dob;

    var dateObject = new Date(dateString);

    dob = dateObject.getFullYear() +"-"+ (dateObject.getMonth()+1) +"-"+ dateObject.getDate();
    
    let sql = "INSERT INTO students (student_id, name, phone, dob) VALUES ('"+registrationID+"','"+name+"','"+phone+"','"+dob+"')";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });

    res.render('new');
});

app.get('/delete/(:id)', function(req, res) {
    let student_id = req.params.id;
    let sql = "DELETE FROM students WHERE student_id='"+student_id+"'";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record deleted");
        res.redirect('/home');
    });
});

app.listen(3000, function() {
    console.log("App listening post 3000");
});