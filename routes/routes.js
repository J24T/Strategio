var express = require('express');
const projekte = require('../models/projekte');
var router = express.Router();

let daten = require('../models/projekte');

router.get('/', function(req, res){
    projekte.refreshListe();
    res.render('mugIT', {projekte: daten});
});

router.get('/mugIT', function(req, res){
    projekte.refreshListe();
    res.render('mugIT', {projekte: daten});
});

router.get('/Highscore', function(req, res){
    res.render('Highscore', {projekt: "", error: ""});
});
/*
router.post("/projekte", function(req, res){
    var jetzt= new Date();
    let prf=new projekte.projekt(req.body.pname, jetzt, req.body.autor, req.body.server);
    var fs=require('fs');
    fs.readFile('../learninglab/data/data.json', 'utf8', function (err, data) {
        if (err) {
            console.log(err)
        } else {
            const file = JSON.parse(data);
            file.liste.push(prf);
            
            json_data=file.liste;
            projekte.projekte=[];
            for(var i in json_data)
                projekte.projekte.push(json_data [i]);
            console.log(projekte.projekte);
            const json = JSON.stringify(file);
     
            fs.writeFile('../learninglab/data/data.json', json, 'utf8', function(err){
                 if(err){ 
                       console.log(err); 
                 } else {
                       //Everything went OK!
                 }});
        }
     
     });
    projekte.refreshListe();
    res.render('Formular');	
});
router.post("/Detail", function(req, res){
    let gesucht=req.body.projektsNr-1;
    if(projekte.projekte[gesucht])
    {
        res.render('Detail', {projekt: projekte.projekte[gesucht], error:""});
    }
    else
    {
        res.render('Detail', {projekt: "", error: "Projekt nicht vorhanden"});
    }

});
*/
module.exports = router;
