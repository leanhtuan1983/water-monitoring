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
            case "Email cannot be empty!":
                return "Email không được để trống"
            case "Confirm password cannot be empty!":
                return "Xác nhận mật khẩu không được để trống"
        }
    }
}

window.onload = function(){
    httpAsync(null,"/login/get/lang","GET",function(result){
        LANG = result;
        console.log(LANG);
    })
}

// $(function(){
//     $('.selectpicker').selectpicker();
// });

$(document).ready(function(){
    $("#post_register").on("submit",function(){
        var check = true;
        $("#miss_val_err").css("display","none")  ;
        $("#miss_val_err").html("")
        if($("#email_").val() == ""){
            $("#miss_val_err").html(translate("Email cannot be empty!"))
            $("#miss_val_err").css("display","block")  ;
            check = false;
        }else if($("#user_name").val() == ""){
            $("#miss_val_err").html(translate("Username cannot be empty!"))
            $("#miss_val_err").css("display","block")  ;
            check = false;
        }else if($("#pass_word").val() == ""){
            $("#miss_val_err").html(translate("Password cannot be empty!"))
            $("#miss_val_err").css("display","block")  ;
            check = false;
        }else if($("#cf_pass_word").val() == ""){
            $("#miss_val_err").html(translate("Confirm password cannot be empty!"))
            $("#miss_val_err").css("display","block")  ;
            check = false;
        }
        return check;
    })
})

