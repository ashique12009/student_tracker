var express = require('express');
var connection = require('../lib/db');
var config = require('../web.config');
var CloudABISapi = require('ashique-js-sdk');
var router = express.Router();

var sess;

/*Get home page*/
router.get('/', function(req, res) {
    //SDK Call
    CloudABISapi.apiManager.GetToken(config).then((result) => {
        var response = JSON.parse(result);
        if ( !req.session.access_token ) {
            req.session.access_token = response.access_token;
            sess = req.session;
            console.log(sess);
        }
    }).catch((err) => {
        console.log(err);
    });

    let sql = "SELECT * FROM students";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.render("index", {data: result});
    });
});

router.post('/', function(req, res){
    console.log(sess);
    //Input for identify
    let templateXML = req.body.templateXML;
    let CloudABISBiometricRequest = {
        config: config,
        token: sess.access_token,
        templateXML: JSON.parse(JSON.stringify(templateXML))
    };
    
    //SDK Call
    CloudABISapi.apiManager.Identify(CloudABISBiometricRequest).then((result) => {
        let msg = '';
        if ( result.OperationName == CloudABISapi.enumOperationName.EnumOperationName.Identify
        && result.OperationResult == CloudABISapi.cloudABISConstant.MATCH_FOUND) {
            msg = CloudABISapi.cloudABISResponseParser.CloudABISResponseParser.GetResponseMessage(result.OperationResult) + ": " + result.BestResult.ID;
        } else {
            msg = CloudABISapi.cloudABISResponseParser.CloudABISResponseParser.GetResponseMessage(result.OperationResult);
        }
        req.flash('info', msg);
        res.redirect('/');
    }).catch((err) => {
        console.log(err);
    });
});

router.get('/new', function(req, res) {
    if ( typeof sess == "undefined" ) {
        //SDK Call
        CloudABISapi.apiManager.getToken(config).then((result) => {
            var response = JSON.parse(result);
            if ( !req.session.access_token ) {
                req.session.access_token = response.access_token;
                sess = req.session;
                console.log(sess);
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    res.render('new');
});

router.post('/new', function(req, res) {
    let registrationID = req.body.registrationID;
    let name = req.body.name;
    let phone = req.body.phone;
    let dateString = req.body.dob;
    var dateObject = new Date(dateString);
    dob = dateObject.getFullYear() +"-"+ (dateObject.getMonth()+1) +"-"+ dateObject.getDate();
    
    //Input for register
    let templateXML = req.body.templateXML;
    let CloudABISBiometricRequest = {
        config: config,
        registrationID: registrationID,
        token: sess.access_token,
        templateXML: JSON.stringify(templateXML)
    };

    //SDK Call
    CloudABISapi.apiManager.Register(CloudABISBiometricRequest).then((result) => {
        console.log(result);
        result = JSON.parse(result);
        let msg = '';
        if (result.OperationName == CloudABISapi.enumOperationName.Register && result.OperationResult == CloudABISapi.cloudABISConstant.SUCCESS) {
            msg = 'Registration Success!';
            let sql = "INSERT INTO students (student_id, name, phone, dob) VALUES ('"+registrationID+"','"+name+"','"+phone+"','"+dob+"')";
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        } else if (result.OperationName == CloudABISapi.enumOperationName.IsRegistered && result.OperationResult == CloudABISapi.cloudABISConstant.YES) {
            msg = CloudABISapi.cloudABISConstant.YES_MESSAGE;
        } else {
            msg = CloudABISapi.cloudABISResponseParser.CloudABISResponseParser.GetResponseMessage(result.OperationResult);
        }
        req.flash('info', msg);
        res.redirect('/');
    }).catch((err) => {
        console.log(err);
        req.flash('info', err);
        res.redirect('/');
    });
});

router.get('/delete/(:id)', function(req, res) {
    let student_id = req.params.id;

    //Input for delete
    let CloudABISBiometricRequest = {
        config: config,
        registrationID: student_id,
        token: sess.access_token
    };

    //SDK Call
    CloudABISapi.apiManager.RemoveID(CloudABISBiometricRequest).then((result) => {
        let msg = '';
        if ( result.OperationResult == CloudABISapi.cloudABISConstant.DS ) {
            msg = CloudABISapi.cloudABISConstant.DS_MESSAGE;
            let sql = "DELETE FROM students WHERE student_id='"+student_id+"'";
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record deleted!");
            });
        }
        req.flash('info', msg);
        res.redirect('/');
    }).catch((err) => {
        console.log(err);
        req.flash('info', err);
        res.redirect('/');
    });
});

module.exports = router;