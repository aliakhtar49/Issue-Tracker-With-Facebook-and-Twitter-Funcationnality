$(document).ready(function(){
            $('#login_btn').on("click",function()
            {
                var email_in_login = $('#email_in_login').val();
                var password_in_login = $('#password_in_login').val();
                var regrex_of_email = /^[A-Za-z0-9\.\^\-\_]{1,}[@]{1}((yahoo.com)||(gmail.com)||(hotmail.com))$/;
                if(email_in_login.match(regrex_of_email) && (email_in_login !=" ") && (password_in_login != " "))
                {
                    $.ajax
                        ({
                            url:'/See_Exist_User_When_Login',
                            type:'POST',
                            dataType:'html',
                            data:{email_in_login:email_in_login,password_in_login:password_in_login},
                            success:function(res)
                            {
                                if(res == "Email Not Exist")
                                {
                                    alert(res);
                                }
                                else if(res == "Password Is InCorrect")
                                {
                                    alert(res);
                                }
                                else
                                {
                                    $('body').css({"background":"black","border":"1px solid green"});
                                    $('body').html(res);

                                }
                            }
                        })
                }
                else
                {
                    alert("In Correct Information");
                }


            });
});