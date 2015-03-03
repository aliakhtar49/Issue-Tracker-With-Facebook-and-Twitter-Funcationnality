/*This js File Do AutoComplete Stuff And Do All Option To Go Other One Profile-----------------------------------------------------
* --------------------------------------------------------------------------------------------------------------------------------
* -------------------------------------------------------------------------------------------------------------------------------
* -----------------------------------------------------------------------------------------------------------------------------*/

    var first_name = [];
    var email_of_all_user=[];
    var profile_name;
    var profile_email;
    var profile_name_currently_log_person;
    var email_of_currently_log_person;

/*This Ajax Request Will Load All User In Our Website And Store Their Name , Email in Array and -------------------------------
* --------------------------------------------------========================================================================
* ========================================================================================================================*/
    $.ajax
    ({
        url:'/ShowAllAvailableUser',
        type:'POST',
        success:function(alluserinfodata)
        {
            if(alluserinfodata.length == 0 )
            {
                alert("No User Have Account");
            }
            else
            {

                for(var i=0;i<alluserinfodata.length;i++)
                {
                    first_name[i]=alluserinfodata[i].first_name_in_database;  //put All User Available Name I
                    email_of_all_user[i]=alluserinfodata[i].email_in_database;
                }

            }


        }
    })

/*This Method Put ALl AVailable User To Auto Complete Search Bar=================================================================
* ===========================================================================================================================
* ======================================================================================================================*/
$("#autocomplete").autocomplete({
    source: first_name
});

/*When U Search Any User And Click On His NAme This Module STart Working=======================================================
* =============================================================================================================================
* ===========================================================================================================================*/
$('#SerachAllContent').on("click",function()
{
    profile_name=$('#autocomplete').val();                                  //get autocomplete value
    for(var i=0;i<first_name.length;i++)
    {
        if(profile_name==first_name[i])
        {
            profile_email = email_of_all_user[i];                           //get its email
            $.ajax
            ({
                url:'/Get_Current_User_Info',
                type:'POST',
                success:function(res)
                {
                    for(var i=0;i<email_of_all_user.length;i++)
                    {
                        if(email_of_all_user[i]==res.email)
                        {
                            profile_name_currently_log_person=first_name[i];
                            email_of_currently_log_person=res.email;
                        }
                    }
                    if(profile_email==res.email)
                    {
                        window.location.href="/";
                    }
                    else
                    {
                        $('body').empty();
                        $('body').css({"backgroundColor":'black'});
                        $('body').append("<div class='row-fluid'><div class='span2 offset1'></div><div class='span6 offset2'><ul class='nav '><li style='float: right' class='dropdown'><a class='dropdown-toggle' data-toggle='dropdown'      href='#'><div style='display: inline-block' id='ali'></div><b class='caret'></b></a><ul class='dropdown-menu'><li><a href='/'>Profile</a></li><li><a href='#'>Account Setting</a></li><li><a href='#'>Privace Setting</a></li><li class='divider'></li><li><a href='/log_out'>LogOut</a></li></ul></li></ul></div></div><div style='margin-top: 25px;' class='row-fluid '><div class='span4'><ul class='thumbnails'><li><div  style='background-color: #f5f5f5' class='thumbnail'><div class='get_user_image'></div><div id='follow_me'></div><div class='caption'><h2 >Profile Information</h2><form class='form-horizontal'><div class='control-group'><label class='control-label' for='inputEmail'>Name</label><div class='controls'><label class='control-label' >"+profile_name +" </label></div></div><div class='control-group'><label class='control-label' for='inputPassword'>Email </label><div class='controls'><label class='control-label' for='inputPassword'>"+ profile_email+"</label></div></div><div class='control-group'><label class='control-label' for='inputPassword'>PhoneNo  </label><div id='phone_no' class='controls'></div></div><div class='control-group'><label class='control-label' for='inputPassword'>Date Of Birth  </label><div class='controls'><label class='control-label' for='inputPassword'>03-07-1994 </label></div></div><div class='control-group'><label class='control-label' for='inputPassword'>Followers  </label><div id='followers_no' class='controls'></div></div><div class='control-group'><label class='control-label' for='inputPassword'>Following  </label><div id='following_no' class='controls'></div></div></form><p><a href='#' class='btn btn-primary'>Account Setting</a></p></div> </div></li></ul></div><div class='row-fluid'><div   class='span5'><ul class='nav nav-pills'><li><a href='#'>Followers</a></li><li><a href='#'>Following</a></li><li><a href='#'>Messages</a></li><li  class='dropdown'><a   href='#' id='ali'  class='dropdown-toggle'    data-toggle='dropdown'>Issue<b class='caret'></b></a><ul class='dropdown-menu'><li><a id='show_all_issue' href='#'>Show Issue</a></li><li class='divider'></li><li><a href='#'>Delete Issue</a></li></ul></li> </ul> </div><div id='view_your_repositry' class='span5'></div></div>   </div>");
                        $('#follow_me').append("<br/><button id='follow_btn' class='btn btn-primary'></button>");
                       // $('#follow_btn').html('ffff Me');

                        /* These Two Lines Just PopUp The DropDown Menue From Navigation Bar---------------------------------------------------------------------------------------------------------------------------
                         --------------------------------------------------------------------------------------------------------------------------
                         --------------------------------------------------------------------------------------------------------------------- */
                        $().dropdown('toggle');
                        $('.dropdown-toggle').dropdown();
                        /*-------------------------------------------------------------------------------------------------------------------------
                         * -------------------------------------------------------------------------------------------------------------------------
                         * -----------------------------------------------------------------------------------------------------------------------*/
                        /*This Ajax Request From The DataBase Check Whether To take Here Follow or Not It Will Give Two Email To
                        * Server Current User And The User In Which He Go to His Profile===========================================
                        * =======================================================================================================*/

                        $.ajax
                        ({
                            url:'/ButtonFollowOrNot',
                            type:'POST',
                            data:{profile_email:profile_email,email_of_currently_log_person:email_of_currently_log_person},
                            success:function(res)
                            {
                                if(res[0].followers == null)
                                {
                                    $('#follow_btn').html('Follow Me');
                                }
                                else
                                {
                                    $('#follow_btn').html('Following');
                                }

                            }

                        })

                        /*=======================The end Follow to get or following In a Button ====================*/



                        /*This Will Bring All F0llowers No and Following No==========================================================================
                         * ==============================================================================================================================
                         *
                         * */
                        $('#follow_btn').on("click",function()
                        {
                            var follow_btn_value = $(this).html();
                            if(follow_btn_value == 'Follow Me')
                            {
                                $.ajax
                                    ({
                                        url:'/follow_me',
                                        type:'POST',
                                        data:{profile_email:profile_email,email_of_currently_log_person:email_of_currently_log_person},
                                        success:function(res)
                                        {
                                         if(res == "works")
                                         {
                                             $('#follow_btn').html('Following');
                                         }
                                        }

                                    })
                            }
                            else
                            {
                                $.ajax
                                ({
                                url:'/unfollow_me',
                                type:'POST',
                                data:{profile_email:profile_email,email_of_currently_log_person:email_of_currently_log_person},
                                success:function(res)
                                {
                                    if(res == "works")
                                    {
                                        $('#follow_btn').html('Follow Me');
                                    }
                                }

                                })
                            }
                        });
                         $.ajax
                        ({
                            url:'/getFollowers',
                            type:'POST',
                            data:{email:profile_email},
                            success:function(getFollowers_details)
                            {
                                $('#followers_no').append("<label class='control-label' for='inputPassword'>"+ getFollowers_details.followers_no +"</label>");
                                $('#following_no').append("<label class='control-label' for='inputPassword'>"+ getFollowers_details.following_no +"</label>");
                                $('#phone_no').append("<label class='control-label' for='inputPassword'>"+ getFollowers_details.phone_no +"</label>");
                            }
                        })
                        /*The End  Bring All F0llowers No and Following No===========================================================*/
                        /*This Code Will Get Other User Image Profile Image and Current User Profile Image Also  ===========================================================================
                        * ===========================================================================================================================
                        * ===========================================================================================================================
                        * ====================================================================================================================*/
                        $.ajax
                        ({
                            url:'/Get_User_Image',
                            type:'POST',
                            data:{email:profile_email},
                            success:function(Image)
                            {

                                if(Image == "yes")
                                {

                                    $(".get_user_image").append("<img style='max-width: 50%;margin-left: 0px;' src='/img/SignUpBackGround.jpg'/>");
                                }
                                else
                                {
                                    var oImg = document.createElement("img");
                                    oImg.setAttribute('src', 'data:image/png;base64,' + Image);
                                    oImg.setAttribute('style','width:50%');
                                    oImg.setAttribute('margin-left','0px');
                                    oImg.setAttribute('alt','100x200');

                                    $(".get_user_image").append(oImg);
                                }
                            }
                        })
                        $.ajax
                        ({
                            url:'/Get_User_Image',
                            type:'POST',
                            data:{email:email_of_currently_log_person},
                            success:function(Image)
                            {

                                if(Image == "yes")
                                {
                                    $("#ali").append("<img style='max-width:20px;height:20px;' src='/img/SignUpBackGround.jpg'/>");
                                }
                                else
                                {

                                    var oImg1 = document.createElement("img");
                                    oImg1.setAttribute('src', 'data:image/png;base64,' + Image);
                                    oImg1.setAttribute('style','width:20px;height:20px');
                                    $("#ali").append(oImg1);
                                }
                            }
                        })
                        /*The End*/



                        /*Here When Current User Want To see Another User Whoes Profile They Want To Visit =======================
                        * ====================================================================================================
                        * =====================================================================================================*/
                        $('#show_all_issue').on("click",function()
                        {
                            $('#show_all_issue').hide();
                            $.ajax
                            ({
                                url:'/show_all_issue',
                                type:'post',
                                data:{email:profile_email},
                                success:function(res)
                                {
                                    for(var i =0; i<res.length;i++)
                                    {
                                        $('#view_your_repositry').append("<ul class='nav'><li style='border-bottom: 1px solid gray; padding-bottom: 15px;'><a class='my_all_repositry' href='#'>"+ res[i].issue_name + "</a><li class='divider'></li></ul>");

                                    }
                                    $('.my_all_repositry').on("click",function()
                                    {
                                        var issue_name = $(this).html();   //get the value of issue name that you click
                                        var comment_value = 0;
                                        var delete_value = 0;
                                        $('body').empty();
                                        for(var i =0; i<res.length;i++)
                                        {
                                            if(res[i].issue_name == issue_name)
                                            {
                                                var issue_content = res[i].issue_content;
                                                $('body').append("<div class='row-fluid'><div class='span2 offset1'> <input  id='autocomplete' title='type &quot;a&quot;'><Button class='btn-danger' id='SerachAllContent'>Search <i class='icon-search'></i></Button></div><div class='span6 offset2'><ul class='nav '><li style='float: right' class='dropdown'><a class='dropdown-toggle' data-toggle='dropdown'  href='#'><div style='display: inline-block' id='ali'></div><b class='caret'></b></a> <ul class='dropdown-menu'><li><a href='/'>Profile</a></li><li><a href='#'>Account Setting</a></li><li><a href='#'>Privace Setting</a></li><li class='divider'></li><li><a href='/log_out'>LogOut</a></li></ul></li></ul></div></div><div style='margin-top: 25px' class='row-fluid'><div style='border: 1px solid green;background-color: #f5f5f5' class='span8 offset2'><div class='media'><a class='pull-left' href='#'><div  id='issue_image'></div></a><div class='media-body'><h4 class='media-heading'>"+ res[i].issue_name +"</h4><blockquote><p class='well-large'>"+ res[i].issue_description+"</p></blockquote><pre><code class='codeIt'>"+res[i].issue_content +"</code></pre><small><cite>Posted By  <strong><a href='#'>"+ res[i].user_by+"</a></strong></cite></small><small class='pull-right'><cite><a href='#'>Like</a>&nbsp;&nbsp;&nbsp;<div style='color: blue;display: inline-block'>0 Likes</div></cite></small><br/><textarea  id='cmt_text' class='divider' placeholder='Enter Your Comment Over Herer'></textarea><button class='btn-large' id='cmt_button'>Comment</button></div></div></div></div><div style='margin-top: 25px' class='row-fluid'><div id='comment_area' class='span8 offset2'></div> </div><div id='main_download'><button class='btn-primary' id='download'>Download</button></div>");
                                                $('.codeIt').each(function(i)
                                                {
                                                    $(this).text($(this).html());
                                                });
                                                $('#download').on("click",function()
                                                {

                                                    $.ajax({
                                                        url:'/download_file',
                                                        type:'post',
                                                        data:{issue_content:issue_content},
                                                        success:function(res){
                                                            $('#main_download').empty();

                                                            $('#main_download').append("<a  id='some-id' href='/deletefile'  >Download<i class=' icon-download-alt' ></i></a>");

                                                              /*  $('#some-id').trigger('click',function(){alert("hh")});*/


                                                           /* $.ajax({
                                                                url:'/deletefile',
                                                                type:'post',
                                                                success: function(res)
                                                                {
                                                                    alert(res);
                                                                }
                                                            })*/
                                                        }
                                                    })
                                                });
                                                /*when User COmment On It This Module will Work Save The Comment And Real Time Display It also -------------------------
                                                 * ----------------------------------------------------------------------------------------------------------------
                                                 * ---------------------------------------------------------------------*/
                                                $('#cmt_button').on("click",function()
                                                {
                                                    var comment = $('#cmt_text').val();
                                                    $.ajax
                                                    ({
                                                        url:'/comment',
                                                        type:'post',
                                                        data:{comment:comment,issue_name:issue_name},
                                                        success:function(res)
                                                        {

                                                            $('#comment_area').append("<div style='border-bottom: 1px solid gray ;padding-bottom: 15px;' class='media'> <a class='pull-left' href='#'> <div  id=" + "comment_image" +comment_value + "></div></a><div class='media-body'><h4 class='media-heading'>"+ name + "</h4><a class='delete_comment_class' id=" + "delete_image" +delete_value + "  href='#'><i   style='float: right' class='icon-remove'></i></a><p>"+ comment+"</p><div class='media'> </div></div></div>");
                                                            $.ajax
                                                            ({
                                                                url:'/Get_Current_User_Info',
                                                                type:'POST',
                                                                success:function(res)
                                                                {
                                                                    $.ajax
                                                                    ({
                                                                        url:'/Get_User_Image',
                                                                        type:'POST',
                                                                        data:{email:res.email},
                                                                        success:function(Image)
                                                                        {

                                                                            if(Image == "yes")
                                                                            {


                                                                                $('#comment_image'+ comment_value+'').append("<img style='max-width:60px;height:64px;' class='media-object' src='/img/SignUpBackGround.jpg'/>");
                                                                                comment_value++;
                                                                            }
                                                                            else
                                                                            {

                                                                                var oImg1 = document.createElement("img");
                                                                                oImg1.setAttribute('src', 'data:image/png;base64,' + Image);
                                                                                oImg1.setAttribute('class', 'media-object');
                                                                                oImg1.setAttribute('style','width:60px;height:64px')
                                                                                //$(".comment_image").append(oImg1);
                                                                                $('#comment_image'+ comment_value+'').append(oImg1);
                                                                                comment_value++;

                                                                            }
                                                                            $('.delete_comment_class').on("click",function()
                                                                            {
                                                                                var id_of_comment_delete = $(this).attr("id");      //get the id of current click button that i generated dynamically
                                                                                alert(id_of_comment_delete);                        //alert it
                                                                                var no_of_comment_delete = id_of_comment_delete.charAt(13);
                                                                                alert(no_of_comment_delete);
                                                                            });


                                                                        }
                                                                    })

                                                                }
                                                            })
                                                        }
                                                    })
                                                });

                                                /*====================The End==========================================================================================*/

                                                /*This Loop Iterating ALl Commets Of The Current Issue And Ajax Will Send The email Of Who Comment In the Issue And Back Its
                                                 *Profile  Image Data And Also It WIll Display ALl Comment With User Name And Its IMage ----------------------------------------
                                                 * -------------------------------------------------------------------------------------------------------------------- */


                                                for(var total_comment=0;total_comment<res[i].Comments.length;total_comment++)
                                                {
                                                    $('#comment_area').append("<div style='border-bottom: 1px solid gray ;padding-bottom: 15px;' class='media'> <a class='pull-left' href='#'> <div  id=" + "comment_image" +
                                                        total_comment + "></div></a><div class='media-body'><h4 class='media-heading'>"
                                                        + res[i].Comments[total_comment].comment_by +
                                                        "</h4><a class='delete_comment_class' id=" + "delete_image" +delete_value +
                                                        "  href='#'><i   style='float: right' class='icon-remove'></i></a><p>"+
                                                        res[i].Comments[total_comment].comment_content+"</p><div class='media'> </div></div></div>");
                                                    comment_value++;
                                                    runAjax(total_comment,res,i);
                                                }
                                                function runAjax(num,res,i)
                                                {
                                                    $.ajax
                                                    ({
                                                        url:'/Get_User_Image',
                                                        type:'POST',
                                                        data:{email:res[i].Comments[num].comment_email},
                                                        success:function(Image)
                                                        {

                                                            if(Image == "yes")
                                                            {


                                                                $('#comment_image'+ num +'').append("<img style='max-width:60px;height:64px;' class='media-object' src='/img/SignUpBackGround.jpg'/>");

                                                            }
                                                            else
                                                            {

                                                                var oImg1 = document.createElement("img");
                                                                oImg1.setAttribute('src', 'data:image/png;base64,' + Image);
                                                                oImg1.setAttribute('class', 'media-object');
                                                                oImg1.setAttribute('style','width:60px;height:64px')
                                                                //$(".comment_image").append(oImg1);
                                                                $('#comment_image'+ num +'').append(oImg1);
                                                            }

                                                        }
                                                    })

                                                }
                                                /*The End ---------------------------------------------------------------------------------------------------------------
                                                 * -------------------------------------------------------------------------------------------------------------------------*/

                                                /* These Two Lines Just PopUp The DropDown Menue From Navigation Bar---------------------------------------------------------------------------------------------------------------------------
                                                 --------------------------------------------------------------------------------------------------------------------------
                                                 --------------------------------------------------------------------------------------------------------------------- */
                                                $().dropdown('toggle');
                                                $('.dropdown-toggle').dropdown();
                                                /*-------------------------------------------------------------------------------------------------------------------------
                                                 * -------------------------------------------------------------------------------------------------------------------------
                                                 * -----------------------------------------------------------------------------------------------------------------------*/



                                                /*The Person We Want To see Whose Profile Image========================================================================
                                                * ====================================================================================================================
                                                * =================================================================================================================*/
                                                $.ajax
                                                ({
                                                    url:'/Get_User_Image',
                                                    type:'POST',
                                                    data:{email:res[i].user_email},
                                                    success:function(Image)
                                                    {

                                                        if(Image == "yes")
                                                        {

                                                            $("#issue_image").append("<img style='max-width:60px;height:64px;' class='media-object' src='/img/SignUpBackGround.jpg'/>");
                                                        }
                                                        else
                                                        {

                                                            var oImg = document.createElement("img");

                                                            oImg.setAttribute('src', 'data:image/png;base64,' + Image);

                                                            oImg.setAttribute('class', 'media-object');

                                                            oImg.setAttribute('style','width:60px;height:64px')

                                                            $("#issue_image").append(oImg);
                                                        }
                                                    }
                                                })
                                                /*The Current Person  Profile Image========================================================================
                                                 * ====================================================================================================================
                                                 * =================================================================================================================*/
                                                $.ajax
                                                ({
                                                    url:'/Get_User_Image',
                                                    type:'POST',
                                                    data:{email:email_of_currently_log_person},
                                                    success:function(Image)
                                                    {

                                                        if(Image == "yes")
                                                        {
                                                            $("#ali").append("<img style='max-width:20px;height:20px;' src='/img/SignUpBackGround.jpg'/>");

                                                        }
                                                        else
                                                        {
                                                            var oImg1 = document.createElement("img");

                                                            oImg1.setAttribute('src', 'data:image/png;base64,' + Image);

                                                            oImg1.setAttribute('id', 'image');

                                                            oImg1.setAttribute('style','width:20px;height:20px');

                                                            $("#ali").append(oImg1);

                                                        }
                                                    }
                                                })
                                            }
                                        }

                                    });

                                }
                            })
                        });

                          /*The End Of When Current User Want To See ANother Useer Issues ANd Comment=======================
                          * ===============================================================================================
                          * ===============================================================================================
                          * ==========================================================================================*/
                     }
                }
            })
        }
    }
});
