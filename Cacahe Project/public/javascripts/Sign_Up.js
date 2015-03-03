$(document).ready(function()
    {
       $('#sign_up').on("click",function()
           {
                var first_name = $('#first_name').val();
                var last_name = $('#last_name').val();
                var password_of_user = $('#password').val();
                var phone_no = $('#phone_no').val();
                var email_of_user =$('#email').val();
                var confirm_password = $('#confirm_password').val();
                var regex_of_phone = /^[0-9]{11,11}$/;
                var regrex_of_name =  /^[A-Za-z]{1,15}$/;
                var regrex_of_password = /^([a-z0-9]){4,15}/;
                var regrex_of_email = /^[A-Za-z0-9\.\^\-\_]{1,}[@]{1}((yahoo.com)||(gmail.com)||(hotmail.com))$/;
                if(((first_name.match(regrex_of_name)) && (first_name!=" ")) && ((phone_no.match(regex_of_phone)) && (phone_no!=" ")) && ((last_name.match(regrex_of_name))&& (last_name!=" ") ) && ((password_of_user.match(regrex_of_password )) && (password_of_user!=" ")) && (confirm_password==password_of_user) && (email_of_user.match(regrex_of_email) ))
                   {
                       $.ajax
                       ({
                               url:'/Sign_Up_Data',
                               type:'post',
                               data:{first_name:first_name,last_name:last_name,password_of_user:password_of_user,email_of_user:email_of_user,phone_no:phone_no},
                               success:function(res)
                                  {
                                      $('body').html(res);
                                  }

                       })
                   }
                else
                   {
                     alert("Plz Enter The Correct Information");
                   }


           });
    });