
var chatInfra = io.connect('/chat_infra'),
    chatCom = io.connect('/chat_com');



chatInfra.on('name_set', function (data)
{
    console.log("fff");
    chatInfra.on("user_entered", function(user)
    {
      /*  $('#messag').append('<div class="systemMessage">' +
            user.name + ' has joined the room.' + '</ div>');*/
        $('#messag').append('<blockquote style="border-bottom: 1px solid rgb(228, 228, 228);padding-bottom: 10px;"><strong>'+ user.name+'  </strong>' +
            data.name + ' has Joined the room </blockquote> ');
    });

    chatInfra.on('message', function (message)
    {
        var message = JSON.parse(message);
       /* $('body').append('<div class="' + message.type + '">'
            + message.message + '</div>');*/
        $('#welcome').append('<h3 class="' + message.type + '">'
            +  message.message + '</h3>');
    });
    chatCom.on('message', function (message)
    {
        var message = JSON.parse(message);
       /* $('#messag').append('<div class="' +
            message.type + '"><span class="name">' +
            message.username + ':</span> ' +
            message.message + '</div>');*/
        $('#messag').append('<blockquote style="border-bottom: 1px solid rgb(228, 228, 228);padding-bottom: 10px;" class="'+
            message.type+ '"><strong>'+ message.username+': </strong>' +
            message.message+'</blockquote>');
    });

   /* $('#messag').append('<div class="systemMessage">Hello ' +
        data.name + '</div>');*/
    $('#messag').append('<blockquote style="border-bottom: 1px solid rgb(228, 228, 228);padding-bottom: 10px;"><strong>Hello  :  </strong>' +
        data.name + '</blockquote> ');
    $('#send').click(function ()
    {
        var data = {
            message:$('#message').val(),
            type:'userMessage'
        };
        chatCom.send(JSON.stringify(data));
        $('#message').val('');
    });
});

$(function() {
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
                        $(".get_user_image").append("<img style='max-width: 50%;margin-left: 0px;' src='/img/SignUpBackGround.jpg'/>");

                        $("#ali").append("<img style='max-width:20px;height:20px;' src='/img/SignUpBackGround.jpg'/>");
                    }
                    else
                    {

                        var oImg = document.createElement("img");
                        var oImg1 = document.createElement("img");
                        oImg1.setAttribute('src', 'data:image/png;base64,' + Image);
                        oImg1.setAttribute('style','width:20px;height:20px');
                        // oImg1.setAttribute('style','height:20px');

                        oImg.setAttribute('src', 'data:image/png;base64,' + Image);
                        oImg.setAttribute('style','width:30%');
                        oImg.setAttribute('margin-left','0px');
                        oImg.setAttribute('alt','100x200');

                        $(".get_user_image").append(oImg);
                        $("#ali").append(oImg1);
                    }


                }
            })
            chatInfra.emit("set_name", {'name':res.name});

        }
    })



});





