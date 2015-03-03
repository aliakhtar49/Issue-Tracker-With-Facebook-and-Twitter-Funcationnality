var mongoose = require('mongoose');
var nodemailer = require("nodemailer");
var q    = require("q");
var connection = mongoose.connect("mongodb://localhost/Cache_Project", function(err)
 {
    if(err)
    {
        console.log("Err");
    } else
    {
        console.log("Connected To DB");
    }
 });
var Schema   =  mongoose.Schema;
var Schema2 = new Schema
({
    user_id:String,
    user_by:String,
    user_email:String,
    issue_name:'String',
    issue_content:'String',
    issue_description:'String',
    issue_profile:'String',
    Comments:
    {comment_id:'String',comment_by:String,comment_email:'String', comment_content:'String'},
   // tag_name:String,
    tag:
    {tag_name:'String',tag_email:'String'},


    likes:{liker_id:'String',liker_name:'String',no:{type:'Number',default:0}}


})



var Schema1 = new Schema
({

    first_name_in_database:String,
    last_name_in_database:String,
    password_in_database:String ,
    email_in_database:String,
    img: { data: Buffer, contentType: String },
    followers:{email:String},
    followers_no:Number,
    phone_no:Number,
    following:{name:String,__id:String,email:String},
    following_no:Number


})
var Schema3 = new Schema
({

    user_by:String,
    user_email:String,
    status_content:'String',
    status_description:'String',
    Comments:
   {comment_id:'String',comment_by:String,comment_email:'String', comment_content:'String'},
    createdAt: {type: Date, default: Date.now}
})
var Schema_of_SignUp = mongoose.model("Schema_of_SignUp",Schema1);
var Schema_of_Issues = mongoose.model("Schema_of_Issues",Schema2);
var Status = mongoose.model("Status",Schema3);

/* It Will Save User Account Infrmation  ,   Using Save Mongoose Method To Save the Data In Mongodb  -------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------*/
exports.Sign_Up_Data = function(req,res)
{
    var data_of_user_when_signup = new Schema_of_SignUp({first_name_in_database:req.body.first_name,last_name_in_database:req.body.last_name,password_in_database:req.body.password_of_user,email_in_database:req.body.email_of_user,phone_no:req.body.phone_no,followers_no:0,following_no:0});
    data_of_user_when_signup.save(function(err)
    {
        if(err)
        {
            res.send("Error in Saving");
        }
        else
        {
            res.cookie('email',req.body.email_of_user ,  {expires: 0} );            //Setting Cookie For Global Access

            if(req.url == '/Sign_Up_Data')
            {
                res.render('Image');
            }
        }
    });
};

/*  End Of Register ----------------------------------------------------------------------------------------------------------------
* -----------------------------------------------------------------------------------------------------------------------------------*/

/* It Will Save User Image  Information  ,   Using Save Mongoose Method To Save the Data In Mongodb  -------------------------------------
 ---------------------------------------------------------------------------------------------------------------------------------------
 --------------------------------------------------------------------------------------------------------------------------------*/
exports.image_upload = function(req,res)
{
    var fs = require('fs');                                              //File Manipulation Node.js Module
    var path = require('path');                                          //Module For Getting The Path Of A File
    var path_of_file = req.files.thumbnail.path;                         //Here Getting The Path The File
    var extension =  path.extname(path_of_file);                         ////Taking The Extension Of the File
    var tmp_path = req.files.thumbnail.path;
    var   imgpth =  tmp_path.replace('ForwardSlash', 'BackSlash');
    tmp_path=  tmp_path.replace('/', 'ForwardSlash')
    var target_path = '/public/img/' + req.files.thumbnail.name;

    if(extension == '.png' || extension == '.jpg' || extension == '.jpeg')//These Extension are Only Allowed
       {
                Schema_of_SignUp.findOne({ email_in_database:  req.cookies.email }, function (err, doc)
                {
                    if(doc== null)                                          //Above First Find The User Docs With Its ID
                    {


                    }
                    else
                    {
                        doc.img.data = fs.readFileSync(imgpth);              //Reading A File And Store in Doc
                        doc.img.contentType = 'image/png';                   //Save The COntent Type As PNG
                        doc.save(function (err, a)                           //Now Saving It Into DataBase
                        {
                            if (err) throw err;

                            console.error('saved img to mongo');


                            fs.unlink(imgpth, function()                    //Deleting Temporary File
                            {

                                console.log("File is deleted");

                            });

                        })
                        res.clearCookie('email');                             //Clearing The Cookie
                        res.render('login_page');                             //Render A Page
                    }


                });
        }

    else
    {
        fs.unlink(imgpth, function()
        {

            console.log("File is deleted");

        });

        res.redirect('/image');
    }


};
/*  End Of Image Upload ----------------------------------------------------------------------------------------------------------------
 * -----------------------------------------------------------------------------------------------------------------------------------*/



/* It First Check The Whether The User Email And Password Is Stored In Our DataBase Or Not .  After That It WIll Render User Profile   -------------------------------------
 ---------------------------------------------------------------------------------------------------------------------------------------
 --------------------------------------------------------------------------------------------------------------------------------
 --------------------------------------------------------------------------------------------------------------------------------
 ---------------------------------------------------------------------------------------------------------------------------*/
exports.See_Exist_User_When_Login = function(req,res)
{
    Schema_of_SignUp.findOne({ email_in_database: req.body.email_in_login },{"email_in_database":1,"first_name_in_database":1,"password_in_database":1,"last_name_in_database":1}, function (err, doc)
        {
            if(doc== null)
            {
                res.send("Email Not Exist");
            }
            else
            {
                if(req.body.password_in_login == doc.password_in_database)
                {
                   // console.log(doc);
                    res.cookie('password_of_currently_login_user',doc.password_in_database ,  {expires: 0} );
                    res.cookie('name_of_currently_login_user',doc.first_name_in_database ,  {expires: 0} );
                    res.cookie('email',doc.email_in_database ,  {expires: 0} );
                    res.cookie('id',doc._id ,  {expires: 0} );
                    if(req.url == '/See_Exist_User_When_Login')
                    {
                        res.render('AddEvent',{doc: doc});
                    }
                }
                else
                {
                    res.send("Password Is InCorrect");
                }
            }
        });
}

/*  End Of Image Upload ----------------------------------------------------------------------------------------------------------------
 * -----------------------------------------------------------------------------------------------------------------------------------*/

/*This server Module Is Just Getting The Email Of The Particular User With Respect To Their Email
 * ------------------------------------------------------------------------------------------------------------------------
 * -----------------------------------------------------------------------------------------------------------------*/
exports.Get_User_Image = function(req,res)
{
    Schema_of_SignUp.find({"email_in_database" : req.body.email}, function (err, doc)
    {

        if(doc[0].img.data == null)                                             //If No Profile Image Of A User Is Found
        {
            res.send("yes");
        }
        else
        {
            var img = new Buffer(doc[0].img.data, 'binary').toString('base64');  //convert It Binary Data Of Image Into Base64
            res.contentType(doc[0].img.contentType);                             //Its Made In PNG
            res.send(img);                                                       //Respond Image Data To CLient
        }
    });
}
/*  End Of Image Getting ----------------------------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------------------------------------------*/

/* This Method Will Store All The Post Status thing and Content Of The File Also --------------------------------------------------
* --------------------------------------------------------------------------------------------------------------------------------
* ---------------------------------------------------------------------------------------------------------------------------------
* ------------------------------------------------------------------------------------------------------------------------------*/
exports.create_an_issue=function(req,res)
{
    var fs = require('fs');                                        //node module for filing
    var path_of_file = req.files.thumbnail.path;                   //It takes the temporay path of file Upload
    console.log(path_of_file);                                     //console it for testing
    var content_of_file =  fs.readFileSync(path_of_file,'binary'); // this line is taking the content of the file in a variable with binary encoding
    var data = new Schema_of_Issues
    ({
        user_id:req.cookies.id,user_by:req.cookies.name_of_currently_login_user,user_email:req.cookies.email,issue_content:content_of_file,issue_name:req.body.issue_name,issue_description:req.body.description, issue_profile:req.body.profile
    });
    data.save(function(err)
    {
        if(err)
        {
            res.send("error");
        }
        else
        {
            var doc  = {name:req.cookies.name_of_currently_login_user,content_of_file : content_of_file,issue_name:req.body.issue_name,issue_description:req.body.description, issue_profile:req.body.profile,email:req.cookies.email};
            res.render('User_Post',{doc:doc});
        }
    });
}
/**The End*---------------------------------------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------------------------------------------*/


/*This Module Is Just Inserting Comment To The DataBase -----------------------------------------------------------------------------
* -----------------------------------------------------------------------------------------------------------------------------------
* ------------------------------------------------------------------------------------------------------------------------------------
* ---------------------------------------------------------------------------------------------------------------------------------*/
exports.comment = function(req,res)
{
    Schema_of_Issues.update({"issue_name" : req.body.issue_name}, {$addToSet : {"Comments":{"comment_id":req.cookies.id,"comment_by":req.cookies.name_of_currently_login_user,"comment_email":req.cookies.email,"comment_content":req.body.comment}}},function(err)
    {
        if(err){console.log("error");}
else
        {res.send("g");}/*  res.send({success:true});*/

    });
}
/**The End*---------------------------------------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------------------------------------------*/


/*Here Find The Issue Related Stuff It Search The Current User ALl Issues And Return All Related Stuffs----------------------
* --------------------------------------------------------------------------------------------------------------------------
* -------------------------------------------------------------------------------------------------------------------------*/
exports.show_all_issue=function(req,res)
{
    Schema_of_Issues.find({'user_email':req.body.email},{},function(err,doc)
    {
        if(err)
        {
            res.send("Error In Fetching ");
        }
        else
        {
        console.log(doc);
            res.send(doc);
        }
    });
}
exports.ShowAllAvailableUser = function(req,res){
    Schema_of_SignUp.find({}/*,{'email_in_database':1,'first_name_in_database':1}*/, function(err, docs){
        if(err)
        {
            console.log('error');
        } else
        {
           // console.log(docs);
             res.send(docs);
        }
    });


}


/*This Will Bring All Followers and Following Of A user email In the Data===========================================
* ==================================================================================================================*/

exports.getFollowers=function(req,res)
{
    Schema_of_SignUp.find({},{'followers_no':1,'following_no':1,'email_in_database':1,'phone_no':1},function(err,doc)
{
    if(err)
    {
        res.send("Error In Fetching ");
    }
    else
    {
       // console.log(doc);
      //  console.log(doc.length);
        for(var i=0;i<doc.length;i++)
        {
            if(doc[i].email_in_database == req.body.email )
            {
               // console.log(doc[i].followers_no);
              //  console.log(doc[i].following_no);
                var getFollowers_details = {followers_no:doc[i].followers_no,following_no:doc[i].following_no,phone_no:doc[i].phone_no};
                res.send(getFollowers_details);
            }
        }

    }
});
}

/*This Ajax Request From The DataBase Check Whether To take Here Follow or Not It Will Give Two Email To
 * Server Current User And The User In Which He Go to His Profile===========================================
 * =======================================================================================================*/
exports.ButtonFollowOrNot = function(req,res)
{
    var profile_email = req.body.profile_email;
    var email_of_currently_log_person = req.body.email_of_currently_log_person;
   Schema_of_SignUp.find({"email_in_database" : profile_email},{ followers: { $elemMatch: { email: email_of_currently_log_person } } },function(err,doc){if(err){}
   else
   {
       console.log(doc);
       res.send(doc);

   }
   });
   // console.log(a);

}
exports.follow_me = function(req,res)
{
    var profile_email = req.body.profile_email;
    var email_of_currently_log_person = req.body.email_of_currently_log_person;
    Schema_of_SignUp.update({"email_in_database" : profile_email}, {$push : {"followers":{"email":email_of_currently_log_person}},$inc: {followers_no:1}},function(err)
    {
        if(err)
        {
            console.log("Error In Saving");
        }
        else
        {

        }

    });

    Schema_of_SignUp.update({"email_in_database" :email_of_currently_log_person }, {$push : {"following":{"email":profile_email}},$inc: {'following_no': 1}},function(err)
    {
        if(err)
        {
            console.log("Error In Saving");
        }
        else
        {
res.send("works");
        }

    });

}
exports.unfollow_me = function(req,res)
{
    var profile_email = req.body.profile_email;
    var email_of_currently_log_person = req.body.email_of_currently_log_person;
    Schema_of_SignUp.update({"email_in_database" :profile_email},{$pull:{'followers':{'email':email_of_currently_log_person}},$inc: {'followers_no': -1}},function(err){
        if(err)
        {
            console.log("Error");
        }
        else
        {

        }
    });
    Schema_of_SignUp.update({"email_in_database" :email_of_currently_log_person},{$pull:{'following':{'email':profile_email}},$inc: {'following_no': -1}},function(err){
        if(err)
        {
            console.log("Error");
        }
        else
        {
res.send("works");
        }
    });

}

exports.sendemailifuserfor = function(req,res)
{
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "smartali.7778@gmail.com",
            pass: "alimeldon"
        }
    });
    smtpTransport.sendMail({
        from: "Issue Tracking Website  <smartali.7778@gmail.com>", // sender address
        to:  req.body.email, // comma separated list of receivers
        subject: "Password", // Subject line
        text: "Your Password  \n" + req.body.password + "\n" // plaintext body
    }, function(error){
        if(error){
            console.log(error);
            res.send("error");
        }else{
            //console.log("Message sent: " + res.message);
            res.send("Sent");
        }
    });

}
exports.FirstfindPassword = function(req,res)
{
    Schema_of_SignUp.find({email_in_database:req.body.email}, function(err, docs){

        if(err){
            console.log('error');

        } else {
            // console.log(docs);
            res.send(docs);
        }
    });
}


/*It WIll Delete Issues Take Email From Session And Get Data of Issues Name From Request ====================================
* =========================================================================================================================
* =======================================================================================================================*/
exports.delete_issue  = function(req,res)
{
    Schema_of_Issues.remove({ issue_name: req.body.issue_name }, function(err) {
        if (err) {
            console.log("Error");
        }
        else {
            res.send('delete');
        }

});
}
/**/
exports.tag_email = function(req,res)
{
    Schema_of_Issues.update({"issue_name" : req.body.issue_name}, {$push : {"tag":{"tag_name":req.body.tag_name,"tag_email":req.body.tag_email}}},function(err)
    {
        if(err)
        {
            console.log("Error In Saving");
        }
        else
        {
            var smtpTransport = nodemailer.createTransport("SMTP",{
                service: "Gmail",
                auth: {
                    user: "smartali.7778@gmail.com",
                    pass: "alimeldon"
                }
            });
            smtpTransport.sendMail({
                from: "Issue Tracking Website  <smartali.7778@gmail.com>", // sender address
                to:  req.body.tag_email, // comma separated list of receivers
                subject: "Review Issues", // Subject line
                text: "Issues Name is    \n" + req.body.issue_name + "\n" + "Posted by "  + req.cookies.email + "\n"// plaintext body
            }, function(error){
                if(error){

                    res.send("error in Sending ");
                }else{
                    //console.log("Message sent: " + res.message);
                    res.send("Sent");
                }
            });

        }

    });
    /*console.log(req.body.issue_name);
    console.log(req.body.tag_email);
    console.log(req.body.tag_name);*/
}
exports.get_tags=function(req,res)
{
    Schema_of_Issues.find({"issue_name" : req.body.issue_name},{tag:1},function(err,doc)
    {
        if(err)
        {}
        else
        {
           // console.log(doc);
            res.send(doc);
        }

    });
}

/**/
exports.insert_status = function(req,res)
{
    var Status_data = new Status({user_by:req.cookies.name_of_currently_login_user,user_email:req.cookies.email,status_content:req.body.status,status_description:req.body.status_description});
    Status_data.save(function(err)
    {
         if(err)
            {
                res.send("Error in Saving");
            }
            else
            {
                Status.find({status_description:req.body.status_description},{createdAt:1},function(err,doc)
                {
                    if(err)
                    {console.log("Eoor");}
                    else
                    {
                        doc = {name:req.cookies.name_of_currently_login_user,data:doc}
                        console.log(doc);

                        res.send(doc);
                    }
                });
            }
     });


}
/**/
/**/
exports.get_followers_post = function(req,res)
{

    Schema_of_SignUp.findOne({"email_in_database" : req.cookies.email},{following:1,'user_by':1},function(err,doc)
    {
        if(err)
        {
            console.log("Error In Saving");
        }
        else
        {

doc ={email:req.cookies.email ,data:doc}
            res.send(doc);


        }
    });

}
/**/
exports.Get_Other_Status = function(req,res)
{
    Status.find({'user_email':req.body.email},function(err,doc){
        if(err)
        {}
        else
        {//console.log(doc);
        res.send(doc);}
    });
}
exports.get_status = function(req,res)
{
    Status.find({'status_content':'one'},function(err,doc)
    {
        if(err)
        {console.log("Eoor");}
        else
        {
            console.log(doc);
         res.send(doc);
        }
    });
}
exports.save_status  = function(req,res)
{
    var a = new Status({user_email:req.body.email1,status_content:req.body.status});
    a.save(function(err)
    {
        if(err)
        {
            res.send("Error in Saving");
        }
        else
        {
           res.send("Save");
        }
    });

}


exports.image_change = function(req,res)
{
    var fs = require('fs');                                              //File Manipulation Node.js Module
    var path = require('path');                                          //Module For Getting The Path Of A File
    var path_of_file = req.files.thumbnail.path;                         //Here Getting The Path The File
    var extension =  path.extname(path_of_file);                         ////Taking The Extension Of the File
    var tmp_path = req.files.thumbnail.path;
    var   imgpth =  tmp_path.replace('ForwardSlash', 'BackSlash');
    tmp_path=  tmp_path.replace('/', 'ForwardSlash')
    var target_path = '/public/img/' + req.files.thumbnail.name;

    if(extension == '.png' || extension == '.jpg' || extension == '.jpeg')//These Extension are Only Allowed
    {
        Schema_of_SignUp.findOne({ email_in_database:  req.cookies.email }, function (err, doc)
        {
            if(doc== null)                                          //Above First Find The User Docs With Its ID
            {


            }
            else
            {
                doc.img.data = fs.readFileSync(imgpth);              //Reading A File And Store in Doc
                doc.img.contentType = 'image/png';                   //Save The COntent Type As PNG
                doc.save(function (err, a)                           //Now Saving It Into DataBase
                {
                    if (err) throw err;

                    console.error('saved img to mongo');


                    fs.unlink(imgpth, function()                    //Deleting Temporary File
                    {

                        console.log("File is deleted");

                    });

                })
                                         //Clearing The Cookie
                res.redirect('/');                             //Render A Page
            }


        });
    }

    else
    {
        fs.unlink(imgpth, function()
        {

            console.log("File is deleted");

        });

        res.redirect('/image');
    }



}

exports.get_all_issues = function(req,res)
{
    Schema_of_Issues.find({},{issue_name:1},function(err,doc)
    {
        if(err)
        {}
        else
        {//console.log(doc);
            res.send(doc);
        }
    });
}
exports.delete_comment = function(req,res)
{
    Schema_of_Issues.update({'issue_name':req.body.issue_name },{$pull : {"Comments":{comment_content: req.body.comment_value}}},function(err){
        if(err)
        {
            console.log("fff");
        }
        else
        {
            res.send("Delted");
        }
    });

}
exports.download_file = function(req,res)
{
    console.log(req.body.issue_content);
    var fs = require('fs');
    var wstream = fs.createWriteStream('myOutput.txt');
    wstream.write(req.body.issue_content);

    wstream.end();
    res.download('myOutput.txt');
}
exports.deletefile = function(req,res)
{
    var fs = require('fs');
    res.download('myOutput.txt');
   /* fs.unlink('myOutput.txt', function()
    {

        console.log("File is deleted");

    });*/
}
  exports.user1=function(req,res)
{
    Schema_of_Issues.findOne({user_id:req.cookies.id},{issue_content:1,issue_name:1,issue_description:1,user_by:1},function(err,doc){
        console.log(doc);
        var doc  = {name:req.cookies.name_of_currently_login_user,content_of_file : doc.issue_content,issue_name:doc.issue_name,issue_description:doc.issue_description,email:req.cookies.email};
        res.render('User_Post',{doc:doc});

    });
}