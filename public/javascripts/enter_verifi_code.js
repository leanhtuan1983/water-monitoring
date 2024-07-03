window.onload = function(){
    let email = $("#email_recive").html();
    $("#email").val(email);
    console.log(email)
}

// function sendAgain(){
//     httpAsync(null,"/send_code_again","GET",function(result){
//         // alert(result);
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