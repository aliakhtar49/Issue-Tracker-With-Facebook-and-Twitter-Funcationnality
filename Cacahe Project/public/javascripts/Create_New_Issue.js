$(document).ready(function()
{
    var all_issues = [];
    var count = 0 ;
    $.ajax({
        url:'/get_all_issues',
        type:'post',
        success:function(res)
        {
            for(var i=0;i<res.length;i++)
            {
                all_issues[count]=res[i].issue_name;
                count++;
            }

        }
    })

    $('#signup').submit(function() {
        var issue_name =$('#name_of_issue').val();
        if(issue_name == '')
        {
            alert("Empty Issue Name");
            return false;
        }
        else
        {
            var fileName = $("#file").val();


            if(!fileName)
            {
                alert("no file selected");
                return false;
            }
            else
            {
                for(var i =0;i<count;i++)
                {
                    if(issue_name == all_issues[i] )
                    {
                       alert("Already Issue Created");
                        return false;

                    }
                }
                return true;

            }

        }
         }); // e


        function checkform()
        {

        }


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


                        $("#ali").append("<img style='max-width:20px;height:20px;' src='/img/SignUpBackGround.jpg'/>");
                    }
                    else
                    {

                        var oImg1 = document.createElement("img");
                        oImg1.setAttribute('src', 'data:image/png;base64,' + Image);
                        oImg1.setAttribute('id', 'image');
                        oImg1.setAttribute('style','width:20px;height:20px')
                        $("#ali").append(oImg1);

                    }


                }
            })

        }
    })
});
