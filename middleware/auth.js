/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/dario-99/progetto_sad
    Version: 1.0
    Description: Middleware di autenticazione
*/
require('dotenv').config();

const camerieraModel = require('../model/Cameriera');
const jwt = require('jsonwebtoken');

function generateAccessTokenTavolo(tavolo) {
    return jwt.sign(tavolo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

async function authCamerieraLogin(req, res, next) {
    var query = await camerieraModel.findOne({username: req.body.username});
    if(query == null){
        res.sendStatus(403);
    }
    else if(query.validPassword(req.body.psw)){
        res.cookie('token', jwt.sign(req.body.username, `${process.env.ACCESS_TOKEN_SECRET}`), {maxAge:7200000, httpOnly: true});
        next();
    }
    else{
        res.sendStatus(401);
    }
}

function authenticateTokenTavolo(req, res, next) {
    const token = req.cookies['token'];
    if (token == null) 
        return res.sendStatus(401);
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    })
}

function authenticateTokenCameriera(req, res, next) {
    const token = req.cookies['token'];
    if (token == null) {
        return res.redirect('/cameriera/loginPage');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    })
}

module.exports = {
    authCamerieraLogin,
    authenticateTokenCameriera,
    authenticateTokenTavolo,
    generateAccessTokenTavolo
};