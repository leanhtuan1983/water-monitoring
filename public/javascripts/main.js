
// function httpGetAsync(theUrl, callback) {
//     let xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function () {
//         if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
//             callback(JSON.parse(xmlHttp.responseText));
//     }
//     xmlHttp.open("GET", theUrl, true);
//     xmlHttp.send(null);
// }
// function httpPostAsync(theUrl, data, callback) {
//     let xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function () {
//         if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
//             // callback(JSON.parse(xmlHttp.responseText));
//             callback(xmlHttp.responseText);
//     }
//     xmlHttp.open("POST", theUrl, true);
//     xmlHttp.send(JSON.stringify(data));
// }

function checkAdmin(role){
    if(role == 'true'){
        $('#adminTab').show();
    }else{
        $('#adminTab').hide();
    }
}

window.onload = function(){
    var accName = document.getElementById('accountName').innerHTML;
    var data = {data: accName};
    // console.log(data);
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", '/checkAccount' , true);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(JSON.stringify(data));
    xmlHttp.onload = function(){
        if(xmlHttp.readyState === xmlHttp.DONE){
            if(xmlHttp.status === 200){
                // console.log((xmlHttp.responseText));
                checkAdmin(xmlHttp.responseText);
            }
        }
    }

    httpAsync(null,"/get/countEQ-em","GET",function(result){
        // console.log(JSON.parse(result));
        let data=JSON.parse(result);
        $("#Numberem").html(data[0].num)
    })
    httpAsync(null,"/get/countEQ-wt","GET",function(result){
        // console.log(JSON.parse(result));
        let data=JSON.parse(result);
        $("#Numberwt").html(data[0].num)
    })
    httpAsync(null,"/get/countEQ-th","GET",function(result){
        // console.log(JSON.parse(result));
        let data=JSON.parse(result);
        $("#Numberth").html(data[0].num)
    })
    
}


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


  $(document).on("click",".notWorking",function(){
      alert("This function is not available. It will be working in the future!")
  })