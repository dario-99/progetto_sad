/*
    Authors: Dario Di Meo, Leonardo Anania
    GitHub: https://github.com/dario-99/progetto_sad
    Version: 1.0
    Description: Entry point del web server, inizializza il web server connettendosi al DB,
                 impostando le route per le richieste HTTP.
*/

// Imports
const express = require('express');// modulo per web server 
const mongoose = require('mongoose');// modulo per comunicare con mongo DB
const cookieParser = require('cookie-parser'); //Per impostare i cookie
require('dotenv').config();

// Utility functions

// Porta di default 3000, altrimenti si richiede dal file di configurazione .env
const port = process.env.PORT | 3000;
// URI per server mongoDB, usato per connettersi al server
const dbURI = process.env.DBURI;

// Creazione web server express
const app = express();

// Imposto web engine embedded java script
app.set('view engine', 'ejs');

// Imposto le directory degli assets come statiche
app.use('/assets', express.static('assets'));

//Utilizzo cookie parser per impostare i cookie
app.use(cookieParser());

// Connect al DB mongoDB attraverso l'URI presente nel file .env
mongoose.connect(dbURI, {useNewUrlParser:true, useUnifiedTopology: true})
    .then((result)=>{
        console.log("connected to DB");
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        })
    })
    .catch((err)=> console.log(err));

// Middleware utilizzati
app.use(express.json()) // Middleware per gestire richieste http con body formato da JSON

// ----------------ROUTES---------------------
// Le route permettono di gestire in maniera modulare le richieste http al server

// route legate al cliente
const cliente = require('./route/cliente');

// route legate alla cameriera
const cameriera = require('./route/cameriera');

// utilizzo le route importate
app.use('/cliente', cliente);
app.use('/cameriera', cameriera);