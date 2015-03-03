

var chatInfra = io.connect('/chat_infra1');

chatInfra.on("connect", function(){
    chatInfra.emit("get_rooms", {});
    chatInfra.on("rooms_list", function(rooms){
        for(var room in rooms){
            var roomDiv ='<div class="row-fluid"><p class="span3">' + room + ' </p><p class="span3 offset2">[ ' + rooms[room] + ' Users ]</p><a class="span2"  href="/chatroom1?room=' + room + '">Join</a></div><br/>';

            $('#rooms_list').append(roomDiv);
        }
    });
});

$(function(){

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

        }
    })
    $('#new_room_btn').click(function(){

        window.location = '/chatroom1?room=' + $('#new_room_name').val();
    });
});

