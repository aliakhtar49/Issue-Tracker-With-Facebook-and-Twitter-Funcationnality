
/*
 * GET home page.
 */

exports.index = function(req, res)
{
    var cookie = req.cookies.email;

    if(cookie == undefined)
    {
        res.render('index');
    }
    else
    {
        var doc ={"email_in_database":req.cookies.email,"first_name_in_database": req.cookies.name_of_currently_login_user };
        res.render('AddEvent',{doc: doc});
    }
  //res.render('index', { title: 'Express' });
};
exports.Sign_Up = function(req,res)
{
    res.render('Sign_Up',{title:'Issue Tracker'})
}