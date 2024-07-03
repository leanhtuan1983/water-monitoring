var USER;
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

  var pad = function(num) { return ('00'+num).slice(-2) };
function returnSQLDateFormat(dateObj){
  if(dateObj == "" || dateObj == null) return "-";
  let date = new Date(dateObj);
  let x = date.getFullYear()         + '-' +
  pad(date.getMonth() + 1)  + '-' +
  pad(date.getDate())       + ' ' +
  pad(date.getHours())      + ':' +
  pad(date.getMinutes())    + ':' +
  pad(date.getSeconds());
  return x;
}

function return_date_format_ddmmyyhhmmss(dateObj){
  if(dateObj == "" || dateObj == null) return "-";
  let date = new Date(dateObj);
  let x = pad(date.getDate())         + '-' +
  pad(date.getMonth() + 1)  + '-' + '20' +
  pad(date.getFullYear())       + ' ' +
  pad(date.getHours())      + ':' +
  pad(date.getMinutes())    + ':' +
  pad(date.getSeconds());
  return x;
}

window.onload = function(){
  checkAdmin()
  getAlertAndRenderTable();
  setupfilter();
}

var LANG = "en";

function checkAdmin(){
  httpAsync(null,"/source/get/checkAdmin","GET",function(result){
    let data = JSON.parse(result);
    if(data.lang != null || data.lang !=""){
      LANG = data.lang;
    }
    getAlertAndRenderTable();
  })
}

function translate_data_table(lang){
  if(lang == "vi"){
    return  {
      "aria": {
          "sortAscending": " - click / quay lại để sắp xếp tăng dần"
        },
      "info": "",
      "infoEmpty":      "Không có dữ liệu",
      "loadingRecords": "Đang tải...",
      "search": "Tìm kiếm: ",
      "zeroRecords":    "Không có giá trị nào",
      "lengthMenu": "  _MENU_  giá trị mỗi trang",
      "paginate": {
          "previous": "Trước",
          "next": "Sau",
        }
  }
  }
  return  {
    "aria": {
        "sortAscending": " - click/return to sort ascending"
      },
    "info": "",
    "infoEmpty":      "Data Empty!",
    "loadingRecords": "Loading...",
    "search": "Search: ",
    "zeroRecords":    "Zero records",
    "lengthMenu": "  _MENU_  items per page",
    "paginate": {
        "previous": "prev",
        "next": "next",
      }
}
}

function getAlertAndRenderTable(){
  httpAsync(null,"/get/alert?fr="+FROM+"&to="+TO+"&para="+SELECTPARAMETER.join(),'GET',function(result){
    if(result == "" || result == null){
      loadAL([]);
    }else{
      let data = JSON.parse(result);
      loadAL(data);
    }
})
}

// function checkAdmin(role){
//     if(role == 'true'){
//         $('#adminTab').show();
//     }else{
//         $('#adminTab').hide();
//     }
// }



// function changedata(x){
//     let y=[];
//     for(let i=0; i< x.length;i++){
//       let z = {data : x[i]};
//       y.push(z);
//     }
//     return y;
//   }

function loadAL(data){
  if(LANG == "vi"){        
    document.getElementById("totalAlert").innerHTML = "Tổng số cảnh báo: "+ data.length;
  }else{
    document.getElementById("totalAlert").innerHTML = "Total alert: "+ data.length;
  }
      $(document).ready(function() {
        $('#tableAlert').DataTable().destroy();
        $('#tableAlert').DataTable({
              "pageLength": 25,
              language : translate_data_table(LANG),
              "columnDefs": [
                { className: "dt-head-center", targets: [ 0, 1, 2, 3, 4, 5, 6, 7] },
              //   { "orderable": false, "targets": [0, 2, 3, 6, 7, 8, 9] },
                { "orderable": true, "targets": [0, 1, 2] }
            ],
              data: modifi(data),
              columns: [
                {data: "index", className: "text-center-data-table align-middle"},
                {data: "alert_time", className: "text-center-data-table align-middle"},
                {data: "meter_id", className: "text-center-data-table align-middle"},
                {data: "name", className: "text-center-data-table align-middle"},
                {data: "alert_type", className: "text-center-data-table align-middle"},
                {data: "threshold", className: "text-center-data-table align-middle"},
                {data: "value", className: "text-center-data-table align-middle"},
                {data: "serial_sensor", className: "text-center-data-table align-middle"},
              ],
              // stateSave: true
          });
      });
        // $('#tableAlert').DataTable().destroy();
        // $('#tableAlert').DataTable({
        //         "pageLength": 25,
        //         language : translate_data_table(LANG),
        //         data: modifi(data),
        //         columns: changedata(columns)
        // });
}

function modifi(data){
  // console.log(data)
  var y=[];
  for(let i=0; i<data.length; i++){
    let x ={ 
      index: i+1,
      alert_time: return_date_format_ddmmyyhhmmss(data[i].alert_time),
      meter_id: (data[i].para == "LOST") ? "-" : data[i].meter_id,
      name: (data[i].para == "LOST") ? data[i].group_name : data[i].name,
      alert_type: data[i].alert_type,
      threshold: (data[i].para == "LOST") ? data[i].group_threshold : data[i].threshold,
      value: (data[i].para == "LOST") ? data[i].alert_value + " (" + (Number(data[i].threshold)).toFixed(1) + " %)" :data[i].alert_value,
      serial_sensor: (data[i].para == "LOST") ? "-" : data[i].serial_sensor
    }
    y.push(x);
  }
  return(y);
}

// function shortToFullName(name){
//   switch(name){
//     case "ImRea":
//       name = "Import reactive (Q1 + Q2)";
//       break;
//     case "ExRea":
//       name = "Export reactive (Q3 + Q4)";
//       break;
//     case "ImAct1":
//       name = "Import Active Wh Tariff 1 (Q1 + Q4)";
//       break;
//     case "ImAct2":
//       name = "Import Active Wh Tariff 2 (Q1 + Q4)";
//       break;
//     case "ImAct3":
//       name = "Import Active Wh Tariff 3 (Q1 + Q4)";
//       break;
//     case "ValAct":
//       name = "Value_Active Power";
//       break;
//     case "ValRea":
//       name = "Value_Active Power";
//     case "ValApp":
//       name = "Value_Apparent Power";
//       break;
//     case "A_RMS":
//       name = "A_RMS Voltage";
//       break;
//     case "B_RMS":
//       name = "B_RMS Voltage";
//       break;
//     case "C_RMS":
//       name = "C_RMS Voltage";
//       break;
//     case "TEMP":
//       name = "Temper";
//       break;
//     case "HUMI":
//       name = "Humidity";
//       break;
//     case "PIN_STATUS":
//       name = "Pin status";
//       break;
//     case "quanity":
//       name = "Quanity";
//       break;
//     case "flowRate":
//       name = "Flow rate";
//       break;
//     case "pressure":
//       name = "Pressure";
//       break;
//   }
//   return name;
// }

//cài đặt thời gian gửi mail
// $(document).ready(function(){
//   $("#settingSendAlert").on("click",function(){
//     $("#setSendTime").modal("show");
//   })
// })


// $(".checkbox-menu").on("change", "input[type='checkbox']", function() {
//   $(this).closest("li").toggleClass("active", this.checked);
// });

// $(document).on('click', '.allow-focus', function (e) {
//  e.stopPropagation();
// });

// var ARR_DAYOFWEEK =[]; 
// $(document).on("click", ".DOW","input[type=checkbox]", function(){
//   if($(this).is(":checked")){
//     let x = $(this).attr("id");
//     ARR_DAYOFWEEK.push(Number(x));
//     ARR_DAYOFWEEK.sort(function(a, b){return a - b});
//     console.log(ARR_DAYOFWEEK)
//     updateDayOfWeek(ARR_DAYOFWEEK);
//   }else{
//     let x = $(this).attr("id");
//     let index = ARR_DAYOFWEEK.indexOf(Number(x));
//     console.log(index);
//     ARR_DAYOFWEEK.splice(index, 1);
//     console.log(ARR_DAYOFWEEK)
//     updateDayOfWeek(ARR_DAYOFWEEK);
//   }
// })

// function updateDayOfWeek(arrDOW){
//   let x=[];
//   for(let i=0; i<arrDOW.length; i++){
//     x.push(numToDOW(arrDOW[i]));
//   }
//   $("#setDayOfWeek").val(x.join());
// }


function numToDOW(num){
  switch(num){
    case 2:
      return " Mon";
    case 3:
      return " Tue";
    case 4:
      return " Wed";
    case 5:
      return " Thu";
    case 6: 
      return " Fri";
    case 7:
      return " Sat";
    case 8:
      return " Sun";
  }
}

var TIME;

// function SetTimeSend(){
//   httpAsync(null,"/get/alertTimeSend?usr=" + USER,"GET",function(data){
//     console.log(data)
//     if(data!=""){
//       let x = JSON.parse(data);
//       console.log(x);
//       STATUSSEND = Number(x.status);
//       setActiveBtn(STATUSSEND);
//       ARR_DAYOFWEEK = (x.dayOfWeek).split(",");
//       TIME = (x.time).slice(0,8);
//       for(let i=0; i<ARR_DAYOFWEEK.length; i++){
//         ARR_DAYOFWEEK[i] = Number(ARR_DAYOFWEEK[i]);
//         $("#"+ARR_DAYOFWEEK[i]).prop("checked",true);
//       }
//       updateDayOfWeek(ARR_DAYOFWEEK);
//       console.log(TIME);
//       $("#timeInput").val(TIME);
//     }
//   })
// }

function setActiveBtn(x){
  if(x == 1){
    $("#settingSendAlertStatus").bootstrapToggle('on')
  }else if(x==0){
    $("#settingSendAlertStatus").bootstrapToggle('off')
  }
}

$(document).ready(function(){
$(function() {
  $('#settingSendAlertStatus').change(function() {
    if($(this).is(":checked")){
      STATUSSEND = 1;
    }else{
      STATUSSEND = 0;
    }
    console.log(STATUSSEND)
  })
})
})


// $(document).ready(function(){
//   $("#setSendTime").on('hidden.bs.modal', function () {
//     for(let i=2; i<=8; i++){
//       $("#"+i).prop("checked",false);
//     }
//     SetTimeSend();
//   });
// })



var STATUSSEND = 1;
// function postTimeSendSetting(){
//     let postData = {
//       usr : USER,
//       dayOfWeek: ARR_DAYOFWEEK.join(),
//       time: $("#timeInput").val(),
//       status: STATUSSEND
//     }
//     console.log(postData)
//   httpAsync(postData,"/post/alertTimeSend", "POST",function(data){
//     alert(data);
//   })
// }

function refreshTable(){
  getAlertAndRenderTable();
}

var TO = (new Date()).getTime();
var FROM = TO - 7 * 24 * 3600000
$(document).ready(function(){
  $("#selectTimeAlert").change(function(){
    let val = $(this).children("option:selected").val();
    switch(val){
      case "week" :  
        $("#picktimeAlert").css("display","none");
        TO = (new Date()).getTime();
        FROM = TO - 7 * 24 * 3600000;
        // getAlertAndRenderTable();
        break;
      case "month" :
        $("#picktimeAlert").css("display","none");
        TO = (new Date()).getTime();
        FROM = TO - 30 * 24 * 3600000;
        // getAlertAndRenderTable();
        break;
      case "custom" :
        $("#picktimeAlert").css("display","block");
        break;
    }
  })
})


$(function() {
  $('#picktimeAlert').daterangepicker(
    {
       startDate: new Date(),
       endDate: new Date(),
       showDropdowns: true,
       showWeekNumbers: true,
       timePicker: true,
       timePickerIncrement: 1,
       timePicker12Hour: true,
       opens: 'right',
       buttonClasses: ['btn btn-default'],
       applyClass: 'btn-small btn-primary',
       cancelClass: 'btn-small',
       format: 'DD/MM/YYYY',
       separator: ' to ',
       locale: {
           applyLabel: 'Submit',
           fromLabel: 'From',
           toLabel: 'To',
           customRangeLabel: 'Custom Range',
           daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
           monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
           firstDay: 1,
           format: 'M/DD hh:mm A'
       }
    },
    function(start, end) {
    
      FROM = new Date(start).getTime();
      TO = new Date(end).getTime();   
      // getAlertAndRenderTable();
    }
 );
//  $('#reportrange span').html(moment().subtract(29, 'day').format('D MMMM YYYY') + ' - ' + moment().format('D MMMM YYYY'));
});

var SELECTSOURCETYPE = ["wt"];
var SELECTPARAMETER = ["APSUAT","ACQUY","SL","LOST","PIN","OP"];

$(".checkbox-menu").on("change", "input[type='checkbox']", function() {
  $(this).closest("li").toggleClass("active", this.checked);
});

$(document).on('click', '.allow-focus', function (e) {
  e.stopPropagation();
 })



 function deleteItemByVal(ARR,val,type){
    var index = ARR.indexOf(val);
    if (index > -1) {
       ARR.splice(index, 1);
    }
 }



 $(document).ready(function(){
  $(document).on("click", ".selectParaAlert",function(){
   if($(this).is(":checked")){
     let sourceType= $(this).val();
     SELECTPARAMETER.push(sourceType);
    //  console.log(SELECTPARAMETER,SELECTSOURCETYPE)
   }else{
     let para= $(this).val();
     let index = SELECTPARAMETER.indexOf(para);
     SELECTPARAMETER.splice(index, 1);
    //  console.log(SELECTPARAMETER,SELECTSOURCETYPE)
   }
  })
})

function setupfilter(){
  // for(let i=0; i<SELECTSOURCETYPE.length;i++){
  //   $("#selectSourceType"+SELECTSOURCETYPE[i]).prop("checked",true);
  // }
  for(let i=0; i<SELECTPARAMETER.length;i++){
    $("[value="+SELECTPARAMETER[i]+"].selectParaAlert").prop("checked",true);
  }
}

function filter(){
  getAlertAndRenderTable();
}

function export_alert(){
  window.open("/get/export_alert?fr="+FROM+"&to="+TO+"&para="+SELECTPARAMETER.join(), '_blank')
}