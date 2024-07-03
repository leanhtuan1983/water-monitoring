
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


// function resetPass(){
//     let username = $("#username").val();
//     let email = $("#email").val();
//     if(username =="" || username == null || email == ""|| email == null){
//         alert("Err! you had not fill email or username!");
//         return false;
//     }
//     let possData = {
//         usr: username,
//         email: email
//     }
//     httpAsync(possData,"/forgot_pass","POST",function(result){
//         alert(result);
//     })
// }

// var input = document.getElementById("email");
// input.addEventListener("keyup", function(event) {
//   if (event.keyCode === 13) {
//    event.preventDefault();
//    document.getElementById("sendReset").click();
//   }
// });