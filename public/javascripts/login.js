var LANG = "en";

function httpAsync(postData, url, method, callback){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(JSON.stringify(postData));
    xmlHttp.onload = function(){
    if(xmlHttp.readyState === xmlHttp.DONE){
      if(xmlHttp.status === 200){
          callback(xmlHttp.responseText);
        }
      }
    }
  }


function translate(str){
    if(LANG == "en"){
        return str;
    }else{
        switch(str){
            case "Username cannot be empty!":
                return "Tên đăng nhập không được để trống";
            case "Password cannot be empty!":
                return "Mật khẩu không được để trống"
        }
    }
}

window.onload = function(){
    httpAsync(null,"/login/get/lang","GET",function(result){
        LANG = result;
        console.log(LANG);
    })
}
// $(document).ready(function(){
//     $(function(){
//         $('.selectpicker').selectpicker();
//     });
    
// })

$(document).ready(function(){
    $("#post_login").on("submit",function(){
        var check = true;
        $("#miss_val_err").css("display","none")  ;
        $("#miss_val_err").html("")
        if($("#user_name").val() == ""){
            $("#miss_val_err").html(translate("Username cannot be empty!"))
            $("#miss_val_err").css("display","block")  ;
            check = false;
        }else if($("#pass_word").val() == ""){
            $("#miss_val_err").html(translate("Password cannot be empty!"))
            $("#miss_val_err").css("display","block")  ;
            check = false;
        }
        return check;
    })
})


// $('[lang]').hide(); // hide all lang attributes on start.
// $('[lang="ko"]').show(); // show just Korean text (you can change it)
// $('#lang-switch').change(function () { // put onchange event when user select option from select
//     var lang = $(this).val(); // decide which language to display using switch case. The rest is obvious (i think)
//     switch (lang) {
//         case 'en':
//             $('[lang]').hide();
//             $('[lang="en"]').show();
//         break;
//         case 'ko':
//             $('[lang]').hide();
//             $('[lang="ko"]').show();
//         break;
//         default:
//             $('[lang]').hide();
//             $('[lang="ko"]').show();
//         }
// });