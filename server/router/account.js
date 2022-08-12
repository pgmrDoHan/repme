//basic module
const express = require("express");
const dbConn = require('../modules/database');
const crypto = require('../modules/crypto');
const tokenModule = require('../modules/token');
const mailer = require('../modules/mailer');
require('dotenv').config();

//basic Setting
const router = express.Router();
const dataCrypto = new crypto();
const tokenUtils = new tokenModule();

//sign-up
router.post('/signUp', function (request, respond) {
    //get data
    const username = request.body['username'];
    const email = request.body['email'];
    //crypto pwd
    const pwdHash = dataCrypto.sha256(request.body['pwd']);
    //generate token
    const token = tokenUtils.generate(username, email, "temp");
    //sql insert
    dbConn.query(`INSERT INTO user(username,email,password,createdate,token,user_pfp,email_verify) VALUES("${username}","${email}","${pwdHash}",NOW(),"${token}","/asset/default_pfp.png",0)`, function (err) {
        if (!err) {
            //send email verify
            const message = {
                toEmail: email,
                subject: "Email Verify",
                html: `<h2>Email Verify</h2><a href=http://127.0.0.1:8080/account/email-verify?token=${token}>http://127.0.0.1/account/emai...</a>`
            };
            mailer.status(201).sendEmail(message)
            //okay
            respond.send({ code: 200, message: "SUCCESS For SIGN-UP" });
        } else {
            console.log("[ERROR]" + err);
            res.status(403).send(err);
        }
    });
});

//sign-in
router.post('/signIn', function (request, respond) {
    //get data
    email = request.body['email'];
    password = request.body['pwd'];
    //sql select
    dbConn.query(`SELECT * FROM user WHERE email="${email}"`, function (err, rows) {
        if (!err) {
            //comp password
            if (rows[0].password === dataCrypto.sha256(password) && rows[0].email === email) {
                //email_verify
                if (rows[0].email_verify === 1) {
                    //token check
                    var token = rows[0].token;
                    if (tokenUtils.isExpiration(token)) {
                        if (tokenUtils.updateED(token) == 0) {
                            respond.status(404).send({ code: 404, message: "ERROR" });
                        }
                    } else {
                        //okay
                        respond.send({ code: 200, token: rows[0].token });
                    }
                } else {
                    respond.status(404).send({ code: 404, message: "Email verify is required." });
                }
            } else {
                //pwd uncurrect
                respond.status(404).send({ code: 404, message: "email or pwd uncurrect" });
            }
        } else {
            console.log("[ERROR]" + err);
            res.status(403).send(err);
        }
    });
});

//update pwd
router.post('/chgPwd', function (request, respond) {
    //get data
    var current_pwd = request.body['current_pwd'];
    var change_pwd = request.body['change_pwd'];
    var token = request.get('Authorization');
    //sql select
    dbConn.query(`SELECT * FROM user WHERE token="${token}"`, function (err, rows) {
        if (!err) {
            //comp password
            if (rows[0].password === dataCrypto.sha256(current_pwd)) {
                if (rows[0].email_verify === 1) {
                    //token check
                    var token = rows[0].token;
                    if (tokenUtils.isExpiration(token)) {
                        if (tokenUtils.updateED(token) == 0) {
                            respond.status(404).send({ code: 404, message: "ERROR" });
                        }
                    } else {
                        //change pwd, sql update
                        var pwdHash = dataCrypto.sha256(change_pwd);
                        dbConn.query(`UPDATE user SET password='${pwdHash}' WHERE token = '${token}'`, function (err, rows, filelds) {
                            if (!err) {
                                respond.send({ code: 200, message: "Update Success" });
                            } else {
                                console.log("[ERROR]" + err);
                                res.status(403).send(err);
                            }
                        });
                    }
                } else {
                    respond.status(404).send({ code: 404, message: "Email verify is required." });
                }
            } else {
                respond.status(404).send({ code: 404, message: "pwd uncurrect" });
            }
        } else {
            console.log("[ERROR]" + err);
            res.status(403).send(err);
        }
    });
});

//update info
router.post('/updtInfo', function (request, respond) {
    //get data
    var username = request.body['username'];
    var email = request.body['email'];
    var token = request.get('Authorization');

    dbConn.query(`SELECT * FROM user WHERE token="${token}"`, function (err, rows) {
        if (!err) {
            if (rows[0].email_verify === 1) {
                //token check
                var token = rows[0].token;
                if (tokenUtils.isExpiration(token)) {
                    if (tokenUtils.updateED(token) == 0) {
                        respond.status(404).send({ code: 404, message: "ERROR" });
                    }
                } else {
                    //okay
                    var newToken = tokenUtils.generate(username, email, false, token);
                    //sql update
                    dbConn.query(`UPDATE user SET username='${username}', email= '${email}', token='${newToken}'  WHERE token = '${token}'`, function (err) {
                        if (!err) {
                            respond.send({ code: 200, message: "Update Success", token: newToken });
                        } else {
                            console.log("[ERROR]" + err);
                            res.status(403).send(err);
                        }
                    });
                }
            } else {
                respond.status(404).send({ code: 404, message: "Email verify is required." });
            }
        } else {
            console.log("[ERROR]" + err);
            res.status(403).send(err);
        }
    });
});

router.get('/confEmail', function (request, respond) {
    //get data
    var token = request.query.token;
    console.log(token)
    dbConn.query(`SELECT * FROM user WHERE token='${token}'`, function (err, rows, filelds) {
        if (!err) {
            if (rows.length === 0) {
                respond.status(404).send({ code: 404, message: "already verify" });
            } else {
                if (rows[0].email_verify === 0) {
                    var newToken = tokenUtils.generate(rows[0].username, rows[0].email);
                    dbConn.query(`UPDATE user SET email_verify=1, token='${newToken}' WHERE token = '${token}'`, function (err, rows, filelds) {
                        if (!err) {
                            respond.send({ code: 200, message: "email verify Success" });
                        } else {
                            console.log("[ERROR]" + err);
                            res.status(403).send(err);
                        }
                    });
                } else {
                    respond.status(404).send({ code: 404, message: "Unknown error" });
                }
            }
        } else {
            console.log("[ERROR]" + err);
            respond.status(404).send(err);
        }
    });
})

module.exports = router;