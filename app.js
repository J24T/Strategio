const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", "views");

const router = require('./routes/routes');
app.use(express.static(path.join(__dirname, '/public')));
app.use(router);

app.use(function(req, res, next){
    console.log(req);
    res.render('404');
});

app.listen(8040, function() {
    console.log("listening to http://localhost:8040");
});