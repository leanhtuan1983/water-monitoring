window.onload = function(){
    var accName = document.getElementById('accountName').innerHTML;
    var data = {data: accName};
    USER = accName;
    // var x = JSON.stringify(data)
    // console.log(data);
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
    // setupfilter()
    checkAdmin()
}

var LANG = "en";

function checkAdmin(){
  httpAsync(null,"/source/get/checkAdmin","GET",function(result){
    let data = JSON.parse(result);
    if(data.lang != null || data.lang !=""){
      LANG = data.lang;
    }
    // set_filter();
    getReport();
    
    if(data.role == "admin"){
      $('#adminTab').show();
    }else if(data.role == "sub"){
      $('#adminTab').hide();
    }
    console.log(LANG)
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
// function checkAdmin(role){
//   if(role == 'true'){
//       $('#adminTab').show();
//   }else{
//       $('#adminTab').hide();
//   }
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

var USER;

function changeicon(i){
    if(i==1){
        i = '<i class="fa fa-circle"' +' style="font-size:10px;color:green"'+'></i>';
    } else if(i==2){
        i = '<i class="fa fa-circle"' +' style="font-size:10px;color:red"'+'></i>';
    } else if(i==3){
        i = '<i class="fa fa-circle"' +' style="font-size:10px;color:darkgray"'+'></i>';
    }
    return i;
}


var TO = (new Date()).getTime();
var FROM = TO - 7 * 24 * 3600000;
var SELECTSOURCETYPE = ["th","em","wt"];

$(document).ready(function(){
  $("#selectTimeReport").change(function(){
    let val = $(this).children("option:selected").val();
    switch(val){
      case "1week" :  
        $("#picktimeReport").css("display","none");
        TO = (new Date()).getTime();
        FROM = TO - 7 * 24 * 3600000;
        break;
      case "1month" :
        $("#picktimeReport").css("display","none");
        TO = (new Date()).getTime();
        FROM = TO - 30 * 24 * 3600000;
        break;
      case "custom" :
        $("#picktimeReport").css("display","block");
        break;
    }
  })
})

$(function() {
  $('#picktimeReport').daterangepicker(
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
      getReport();
    }
 );
});

$(".checkbox-menu").on("change", "input[type='checkbox']", function() {
  $(this).closest("li").toggleClass("active", this.checked);
});
$(document).on('click', '.allow-focus', function (e) {
  e.stopPropagation();
 })


function getReport(){
  httpAsync(null,"/get/report?fr="+FROM+"&to="+TO,"GET",function(result){
    if(result == "" || result == null){
      DATA = [];
      loadRP(DATA);
    }else{
      let data = JSON.parse(result);
      console.log(data);
      DATA = data;
      loadRP(data);
    }

  })
    // let xmlHttp = new XMLHttpRequest();
    // xmlHttp.open("GET", '/get/report', true);
    // xmlHttp.setRequestHeader("Content-type", "application/json");
    // xmlHttp.send();
    // xmlHttp.onload = function(){
    //     if(xmlHttp.readyState === xmlHttp.DONE){
    //         if(xmlHttp.status === 200){
    //             // console.log(xmlHttp.responseText);
    //             let data = JSON.parse(xmlHttp.responseText);
    //             DATA = data;
    //             loadRP(data);
    //         }
    //     }
    // }
}

var COLUMNS = [ 'idkey', 'name', 'exportTime', 'creatby',];
var DATA;
var EQ;
function changedata(x){
    let y=[];
    for(let i=0; i< x.length;i++){
      let z = {data : x[i]};
      y.push(z);
    }
    return y;
  }
  function modifi(data){
    var y=[];
    let checkedbox;
    for(let i=0; i<data.length; i++){
      // checkedbox = '<input type="checkbox" id=" ' + data[i].id + '">';
      let x ={ 
      // checkbox: checkedbox,
      idkey: data[i].idkey,
      name: data[i].name,
      exportTime: data[i].exportTime,
      creatby: data[i].creatby,
      }
      y.push(x);
    }
    return(y);
  }
function loadRP(data){
    $(document).ready(function() {
      if(LANG == "vi"){        document.getElementById("totalReport").innerHTML = "Tổng số báo cáo: "+ data.length;
    }else{
      document.getElementById("totalReport").innerHTML = "Total report: "+ data.length;
    }        $('#tableReport').DataTable().destroy();
        $('#tableReport').DataTable({
              "pageLength": 25,
                language : translate_data_table(LANG),
            //     "columnDefs": [
            //       { "orderable": false, "targets": [0, 2] },
            //       { "orderable": true, "targets": [1, 3, 4, 5, 6, 7] }
            //   ],
                data: modifi(data),
                columns: changedata(COLUMNS)
        });
    });
}

var ID;
$(document).ready(function(){
    $(document).on('click','.tableContain tbody td:not(td:has(input))',function() {
       let name = $(this).parent().children("td:nth-child(2)").html();
       let id = $(this).parent().children("td:nth-child(1)").html();     
        ID = Number(id);
        console.log(name,id)
        $("#reportName").val(name);
        setingreport(ID);
        $("#settingReport").modal("show");
     });
  });

function setingreport(ID){
  console.log(DATA[0].idkey,ID);
  for(let i=0; i< DATA.length; i++){
    if(ID == DATA[i].idkey){
      EQ = DATA[i].eq;
      let a = DATA[i].timeScale.split(",");
      MultiExportFROM = Number(a[0]);
      MultiExportTO = Number(a[1]);
      MultiExportMOMENT = DATA[i].moment;
      SELECTEDPARAMULTIEXPORT = DATA[i].para.split(",");
      EXPORTLIST = DATA[i].selecteq;
      $("#selectedExportMutilEQ").val(DATA[i].selecteq);
      $("#nameReport").val(DATA[i].name);
      checkEQ();
      for(let j=0; j<SELECTEDPARAMULTIEXPORT.length; j++){
        console.log("#selectParaMultiExport"+SELECTEDPARAMULTIEXPORT[j])
        $("#selectParaMultiExport"+SELECTEDPARAMULTIEXPORT[j]).prop("checked",true);
      }
      $("#selectTimeMultiExport").val("custom").trigger('change');
      $("#selectMomentMultiExport").val(MultiExportMOMENT).trigger('change');
      setPicktime();
      break;
    }
  }
};





  var MultiExportTO = new Date().getTime();
  var MultiExportFROM = MultiExportTO - 24*3600000;
 function selectTimeMultiExport(){
   let index = document.getElementById("selectTimeMultiExport").selectedIndex;
   let x = new Date();
   if(index != 3  ){
       document.getElementById("picktimeMultiExport").style.display = 'none';
   }
   else{
       document.getElementById("picktimeMultiExport").style.display = 'block';
   }
   switch(index){
     case 0:
       MultiExportTO = x.getTime();
       MultiExportFROM = MultiExportTO - 24*3600000;
       break;
     case 1:
       MultiExportTO = x.getTime();
       MultiExportFROM = MultiExportTO - 3600000 * 24 * 7;
       break;
     case 2:
       MultiExportTO = x.getTime();
       MultiExportFROM = MultiExportTO - 3600000 * 24 * 30;
       break;
   }
   console.log(MultiExportTO,MultiExportFROM)
 }



 function creatReportAndExportData(){
    let reportName = $("#nameReport").val();
    if(reportName == "" || reportName == null){
      alert("ERR!! You have not named report!")
    }else if(SELECTEDPARAMULTIEXPORT.length == 0){
      alert("ERR! you have not selected parameters!")
    }
    else{
      let postData = {
        name: reportName,
        from: MultiExportFROM,
        to: MultiExportTO,
        moment: MultiExportMOMENT,
        para: SELECTEDPARAMULTIEXPORT.join(),
        usr: USER,
        eq: EQ,
        selectedEQ: EXPORTLIST
      }
      console.log(postData);
      window.open('/get/exportMultiData?fr='+MultiExportFROM+'&to='+MultiExportTO+'&name='
      +reportName+'&eq='+EQ+'&para='+SELECTEDPARAMULTIEXPORT.join()+'&usr='+USER+'&moment='+MultiExportMOMENT+'&selectedEQ='+EXPORTLIST, '_blank');
    }
  }


  $(".checkbox-menu").on("change", "input[type='checkbox']", function() {
    $(this).closest("li").toggleClass("active", this.checked);
  });
  $(document).on('click', '.allow-focus', function (e) {
    e.stopPropagation();
   })

  var EXPORTLIST =[];
// function showBtnCreatReport(){
//   if(EXPORTLIST.length > 0){
//     $("#creatReportBtn").prop("disabled",false)
//   }else{
//     $("#creatReportBtn").prop("disabled",true)
//   }
// }

function setPicktime(){
$(function() {
    $('#picktimeMultiExport').daterangepicker(
      {
         startDate: new Date(MultiExportFROM),
         endDate: new Date(MultiExportTO),
         showDropdowns: true,
         showWeekNumbers: true,
         timePicker: true,
         timePickerIncrement: 1,
         timePicker12Hour: true,
         opens: 'left',
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
      MultiExportFROM = new Date(start).getTime();
       MultiExportTO = new Date(end).getTime();   
        console.log(MultiExportFROM,MultiExportTO)
      }
   );
  //  $('#reportrange span').html(moment().subtract(29, 'day').format('D MMMM YYYY') + ' - ' + moment().format('D MMMM YYYY'));
  });
}



  var MultiExportMOMENT = 'raw'
function selectTimeShowMultiExport(){
  let index = document.getElementById("selectMomentMultiExport").selectedIndex;
  switch (index){
    case 0:
      MultiExportMOMENT ='raw'; break; //raw
    case 1: 
      MultiExportMOMENT ='hour' ;break; //hour 
    case 2:
      MultiExportMOMENT = 'day'; break; //day
    case 3: 
      MultiExportMOMENT = 'week'; break; //week
    case 4:
      MultiExportMOMENT = 'month'; break; //month
    case 5:
      MultiExportMOMENT = 'year' ;break; //year
  }
}

var SELECTEDPARAMULTIEXPORT = [];
$(document).ready(function(){
  $(document).on("click",".selectParaMultiExport",function(){
    if($(this).is(":checked")){
      let para= $(this).val();
      SELECTEDPARAMULTIEXPORT.push(para);
    }else{
      let para= $(this).val();
      let index = SELECTEDPARAMULTIEXPORT.indexOf(para);
      SELECTEDPARAMULTIEXPORT.splice(index, 1);
    }
    console.log(SELECTEDPARAMULTIEXPORT);
  })
})

function checkEQ(){
    if(EQ == "th"){
      $(".th").css("display","block");
      $(".em").css("display","none");
      $(".wt").css("display","none");
      // $("#dataqualityEq").val("TEMP").trigger('change');
    }else if(EQ == "em"){
      $(".em").css("display","block");
      $(".th").css("display","none");
      $(".wt").css("display","none");
      // $("#dataqualityEq").val("ImRea").trigger('change');
    }else if(EQ == "wt"){ //water
      $(".wt").css("display","block");
      $(".th").css("display","none");
      $(".em").css("display","none");
      // $("#dataqualityEq").val("ImRea").trigger('change');
    }
  }

var MultiExportMOMENT = 'raw'
function selectTimeShowMultiExport(){
  let index = document.getElementById("selectMomentMultiExport").selectedIndex;
  switch (index){
    case 0:
      MultiExportMOMENT ='raw'; break; //raw
    case 1: 
      MultiExportMOMENT ='hour' ;break; //hour 
    case 2:
      MultiExportMOMENT = 'day'; break; //day
    case 3: 
      MultiExportMOMENT = 'week'; break; //week
    case 4:
      MultiExportMOMENT = 'month'; break; //month
    case 5:
      MultiExportMOMENT = 'year' ;break; //year
  }
}


function refreshTable(){
  // $("#tablerp").empty();
  // $("#tablerp").append('<div class="table-responsive mt-3 pr-5 pl-5 tableContain" style="min-height: 700px;">'
  // +'<table id="tableReport" class="table text-center " style="width:100%">'
  // +'  <thead>'
  // +'      <tr class="titleRow">'
  // +'      <th>ID&nbsp;</th>'
  // +'      <th>Name</th>'
  // +'      <th>Export time</th>'
  // +'      <th>Created by</th>'
  // +'      </tr>'
  // +'  </thead>'
  // +'</table> '
  // +'</div>');
  getReport();
}
