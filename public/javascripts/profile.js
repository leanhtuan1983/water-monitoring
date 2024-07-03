var USER;
window.onload = function(){
  var accName = document.getElementById('accountName').innerHTML;
  USER = accName;
  var data = {data: accName};
  // let xmlHttp = new XMLHttpRequest();
  // xmlHttp.open("POST", '/checkAccount' , true);
  // xmlHttp.setRequestHeader("Content-type", "application/json");
  // xmlHttp.send(JSON.stringify(data));
  // xmlHttp.onload = function(){
  //     if(xmlHttp.readyState === xmlHttp.DONE){
  //         if(xmlHttp.status === 200){
  //             console.log((xmlHttp.responseText));
  //             checkAdmin(xmlHttp.responseText);
  //         }
  //     }
  // }
  checkAdmin();
}

var LANG = "en";

// function checkAdmin(role){
//     if(role == 'true'){
//         $('#adminTab').show();
//     }else{
//         $('#adminTab').hide();
//     }
// }


function checkAdmin(){
  httpAsync(null,"/source/get/checkAdmin","GET",function(result){
    let data = JSON.parse(result);
    if(data.lang != null || data.lang !=""){
      LANG = data.lang;
    }
    // set_filter();
    
    if(data.role == "admin"){
      $('#adminTab').show();
      // showDataAccount();
    }else if(data.role == "sub"){
      $('#adminTab').hide();
    }
    console.log(LANG)
  })
}

// function profileShowTab(){
//     httpAsync(null,"/get/profile?usr="+USER,"GET",function(result){
//         console.log(result);
//     })
// }


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


  function resetPass(){
    let postData = {
      usr: USER
    }
    httpAsync(postData,"/set/resetPassword","POST",function(result){
      alert(result);
    })
  }


  function changePass(){
    let curpass = $("#currentPass").val();
    let newpass = $("#newPass").val();
    let cfpass = $("#cfNewPass").val();
    if(curpass == "" || newpass =="" || cfpass ==""){
      if(LANG == "en"){
        alert("ERR! ALL input must be filled out!");
      }else{
        alert("Lỗi! Thiếu thông tin đổi mật khẩu");
      }
      return false;
    }else if( newpass.length < 8){
      if(LANG == "vi"){
        alert("Mật khẩu mới phải có độ dài ít nhất 8 ký tự!");
      }else{
        alert("New password must have at least 8 character!")
      }
      return false;
    }else if( newpass != cfpass){
      if(LANG =="en"){
        alert("ERR! Confirm pass wrong!");
      }else{
        alert("Xác nhận mật khẩu không khớp!")
      }
      return false;
    }else{
      let postData = {
        usr: USER,
        curPass: curpass,
        newPass: newpass
      }
      httpAsync(postData,"/get/changePassword","POST",function(result){
        alert(result);
        return 0;
      })
    }
  }