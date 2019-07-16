var express= require ('express');
var app= express();
var bodyParser= require ('body-parser');
var request= require('request');
var port= process.env.PORT||3000;
var flash = require("connect-flash");
var sessions= require ('express-session');

app.use(flash());
app.use(sessions({
    secret:"Search",
    resave: false,
    saveUninitialized: false
 }));
app.use( function (req, res, next){
  res.locals.error =req.flash("error");
  next();
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded ({extended:true}));
app.use(express.static(__dirname+'/public'));

app.get("/search", function(req, res){
  var search="http://omdbapi.com/?s="+req.query.search+"&page="+req.query.page+"&apikey=thewdb";
    request (search, function(error, response, body){
     if (!error && response.statusCode==200){
           
          var results= JSON.parse(body);
          console.log(results);
          res.render("results", {data:results, page:req.query.page, search:req.query.search});       
      }else{

         req.flash ("error", message);
         res.redirect("/");
      }
        
    });
     
});

app.get("/", function (req,res){
    
    res.render("search");
});

app.listen (port, process.env.IP, function(){
    
    console.log("SERVER RUNNING!");
});