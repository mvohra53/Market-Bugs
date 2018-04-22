var express = require('express'),
http = require('http'),
functions = require('./includes/functions.js'),
session = require('express-session'),
bodyParser = require('body-parser'),
mysql = require('mysql');
var app = express();
global.con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testing_project"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/assets'));
app.use(session({secret: functions._gRs(30),resave: false,saveUninitialized: true,cookie: { secure: true }}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', function(request, response) {
  response.render('index',{
      title:'Home Page',
      message:'Message'
  });
})

app.get('/admin', function(req, res) {
    var sess = req.session;
    var Users = functions.Users;
    console.log(sess);
    if (sess) { // Check if session exists
    // lookup the user in the DB by pulling their email from the session
    Users.checkUserName(sess.user_login,function(u){
        console.log(u);
        if(u.length > 0){
            response.render('admin/index',{
                title:'Dashboard',
                message:'Welcome '+sess.display_name
            });
        }
        else{
            req.session.destroy(function(err) {
              if(err) {
                console.log(err);
              } else {
                res.redirect('/admin/login');
              }
             });
        }
    });
  } else {
    res.redirect('/admin/login');
  }
});
app.get('/admin/login',function(req,res){
    res.render('admin/login',{password:'',email:''});
})
/*Working For Admin Login Form Submit*/
app.post('/admin/login', function(req, res) {
    var Users = functions.Users;
    Users.checkUserName(req.body.email,function(u){
        if(u.length > 0){
            Users.checkUserPassword(req.body.email,req.body.password,function(p){
                console.log(p);
                if(p.length > 0){
                    sess = req.session;
                    sess.user_login = p.user_login;
                    sess.display_name = p.display_name;
                    res.redirect('/admin');
                    res.end('done');
                }
                else{
                    res.render('admin/login', { error: 'Invalid Password.' });
                }
            });
        }
        else{
            res.render('admin/login', { error: 'Invalid Username.' });
        }
    });
    /*if(typeof checkUser !='undefined'){
        var checkPass = Users.checkUserPassword(req.body.email,req.body.password);
        console.log(checkPass);
        if(checkPass){
            console.log(checkPass);
            sess = req.session;
            sess.email=req.body.email;
            res.redirect('/admin/index');
        }
        else{
            res.render('admin/login', { error: 'Invalid Password.' });
        }
    }*/
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
