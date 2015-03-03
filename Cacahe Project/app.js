
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var dataBase = require('./routes/DataBaseWork');
var http = require('http');
var path = require('path');
var io = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 3002);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.bodyParser({uploadDir:'./public/img'}));
app.use(express.bodyParser({}));
app.use(express.methodOverride());
app.use(express.cookieParser('S3CRE7'));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.get('/forget_your_password',function(req,res){
    res.render('forget_your_password');
});
/*
app.get('/',function(req,res){res.render('Status')});
*/
app.get('/', routes.index);
app.get('/home',function(req,res){
    res.render('User_Status');
});
app.get('/users', user.list);
app.get('/Sign_Up',routes.Sign_Up);
app.get('/image',function(req,res){
    res.render('Image');
});
app.get('/login_page',function(req,res){
    var cookie = req.cookies.email;

    if(cookie == undefined)
    {
        res.render('login_page');
    }
    else
    {
        var doc ={"email_in_database":req.cookies.email,"first_name_in_database": req.cookies.name_of_currently_login_user };
        res.render('AddEvent',{doc: doc});
    }
    //res.render('index', { title: 'Express' });
   // res.render('login_page');
});
app.get('/log_out',function(req,res)
{
    res.clearCookie('password_of_currently_login_user');
    res.clearCookie('name_of_currently_login_user');
    res.clearCookie('email');
    res.clearCookie('id');
    res.render('index');
});
app.get('/create_new_issue',function(req,res){
    res.render("Create_New_Issue");
});
app.get('/user',dataBase.user1);
app.get('/chatroom',function(req,res){
    res.render('public_chat');
});
app.get('/chatroom1',function(req,res){
    res.render('private_chat');
});
app.get('/rooms',function(req,res){
    res.render('rooms');
});
app.get("/acount_setting",function(req,res)
{
    res.render('Image_Change');
});

/*Here All Post Request -------------------------------------------------------------------------------------------------------
* ---------------------------------------------------------------------------------------------------------------------------
* --------------------------------------------------------------------------------------------------------------------*/
app.post('/Sign_Up_Data',dataBase.Sign_Up_Data);
app.post('/image_upload',dataBase.image_upload);
app.post('/See_Exist_User_When_Login',dataBase.See_Exist_User_When_Login);
app.post('/Get_User_Image',dataBase.Get_User_Image);
app.post('/Get_Current_User_Info',function(req,res){
    var email = req.cookies.email;
    var name = req.cookies.name_of_currently_login_user;
    var doc = {name:name,email:email};
    res.json(doc);
});
app.post('/comment',dataBase.comment);
app.post('/create_an_issue',dataBase.create_an_issue);
app.post('/show_all_issue',dataBase.show_all_issue);
app.post('/ShowAllAvailableUser',dataBase.ShowAllAvailableUser);
app.post('/getFollowers',dataBase.getFollowers);
app.post('/ButtonFollowOrNot',dataBase.ButtonFollowOrNot);
app.post('/follow_me',dataBase.follow_me);
app.post('/unfollow_me',dataBase.unfollow_me);
app.post('/FirstfindPassword',dataBase.FirstfindPassword);
app.post('/sendemailifuserfor',dataBase.sendemailifuserfor);
app.post('/delete_issue',dataBase.delete_issue);
app.post('/tag_email',dataBase.tag_email);
app.post('/get_tags',dataBase.get_tags);
app.post('/insert_status',dataBase.insert_status);
app.post('/get_followers_post',dataBase.get_followers_post);
app.post('/Get_Other_Status',dataBase.Get_Other_Status);
app.post('/image_change',dataBase.image_change);
app.post('/get_all_issues',dataBase.get_all_issues);


app.post('/save_status',dataBase.save_status);
app.post('/get_status',dataBase.get_status);
app.post('/delete_comment',dataBase.delete_comment);
app.post('/download_file',dataBase.download_file);
app.get('/deletefile',dataBase.deletefile);
/* This is Creating Server And Listen to Port Describe Above And Call Server Socket.js File To Open The Socket On The Same Server
* As Our Server Or Main Server  Is Listening--------------------------------------------------------------------------------------
* -----------------------------------------------------------------------------------------------------------------------------
* ---------------------------------------------------------------------------------------------------------------------------------*/
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
require('./routes/sockets.js').initialize(server);
