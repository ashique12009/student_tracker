var express = require('express');
var routes = express.Router();
var connection = require('../lib/db');

/*Get home page*/
routes.get('/', function(req, res) {      
    let sql = "SELECT * FROM students";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        var request = require("request");

        var options = { 
            method: 'POST',
            url: 'https://fpsvr101.cloudabis.com/v1/token',
            headers: 
            { 
                'postman-token': '758e5039-4879-bf49-e4a0-480f6cdd3508',
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded' 
            },
            form: 
            { 
                username: '09e2125a15144daf87f0ebf12f3e8614',
                password: 'p0+zhutsWwpfADBZN4HT6yF4Uu8=',
                grant_type: 'password' 
            } 
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
        });

        res.render("index", {data: result});
    });
});

routes.get('/home', function(req, res) { 
    let sql = "SELECT * FROM students";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.render("index", {data: result});
    });
});

routes.get('/new', function(req, res) {
    res.render('new');
});

routes.post('/new', function(req, res) {
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

routes.get('/delete/(:id)', function(req, res) {
    let student_id = req.params.id;
    let sql = "DELETE FROM students WHERE student_id='"+student_id+"'";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record deleted");
        res.redirect('/home');
    });
});

module.exports = routes;