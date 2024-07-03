function httpAsync(postData, url, method, callback){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(JSON.stringify(postData));
    xmlHttp.onload = function(){
    if(xmlHttp.readyState === xmlHttp.DONE){
      if(xmlHttp.status === 200){
          callback(xmlHttp.responseText);
        }else{
          alert("ErrorCode: "+xmlHttp.status + "\n" + "ErrorMess: " + xmlHttp.responseText);
          callback(null);
          return false;
        }
      }
    }
  }


function return_null_if_empty(x){
  if(x == "") return null;
  return x;
}
//màn danh sách các thiết bị
var FILTER_EQ_LIST = "all";
var LANG ="vi";
var FILTER_SUB_GROUP = "all";

window.onload = function(){
    httpAsync(null, "/source/get/lang", "GET", function (result){
      let data = JSON.parse(result);
      LANG = data.lang;
      set_filter();
  })
}

// function checkAdmin(){
//   httpAsync(null,"/source/get/checkAdmin","GET",function(result){
//     let data = JSON.parse(result);
//     if(data.lang != null || data.lang !=""){
//       LANG = data.lang;
//     }
//     set_filter();
//     if(data.role == "admin"){
//       $('#adminTab').show();
//     }else if(data.role == "sub"){
//       $('#adminTab').hide();
//     }
//   })
// }

function set_filter(){
  httpAsync(null,"/source/get/group_eq","GET",function(result){
    if(result =="" || result == null){
      getEQ(FILTER_EQ_LIST, FILTER_SUB_GROUP);
      return false;
    }else{
      let parse_data = JSON.parse(result);
      console.log(parse_data)
      let data = parse_data.data;
      SHOW_LIST_METER_TYPE = parse_data.display_meter_list;
      for(let i=0; i<data.length; i++){
        $("#filter_group").append('<option value="'+data[i].id+'" >'+data[i].group_name+'</option>')
      }
      change_type_show_meter_list(SHOW_LIST_METER_TYPE);
    }
  })
}



$(document).ready(function(){   
  $("#filter_group").change(function(){
    FILTER_EQ_LIST = $(this).children("option:selected").val();
    FILTER_SUB_GROUP = "all";
    get_and_set_group_filter()
    getEQ(FILTER_EQ_LIST, FILTER_SUB_GROUP);
  })
})

function get_and_set_group_filter(){
  $("#filter_sub_group").empty();
  $("#filter_sub_group").append('<option value="all" selected>TẤT CẢ</option><i class="fas fa-sort-down"></i>')
  if(FILTER_EQ_LIST != "all"){
    httpAsync(null,"/source/get/sub_group?group_eq="+FILTER_EQ_LIST,"GET",function(result){
      let data = JSON.parse(result);
      for(let i=0; i<data.length; i++){
        $("#filter_sub_group").append('<option value="'+data[i].id+'" >'+data[i].name_sub_group+'</option>')
      }
    })
  }
}

$(document).ready(function(){   
  $("#filter_sub_group").change(function(){
    FILTER_SUB_GROUP = $(this).children("option:selected").val();
    getEQ(FILTER_EQ_LIST,FILTER_SUB_GROUP);
  })
})

var METER_LIST = null;
function getEQ(group,sub_group){
    httpAsync(null,"/source/get/EQ?group="+group+"&sub_group="+sub_group,"GET",function(result){
      let data;
      if(result == null || result == ""){
        data = [];
      }else{
        // var  parse_data = JSON.parse(result);
        // data = parse_data.data;
        // SHOW_LIST_METER_TYPE = parse_data.display
        data = JSON.parse(result)
      }
      // console.log(parse_data.display)
      METER_LIST = data;
      TOTALEQGET = [];
      for(let i =0; i<data.length; i++){
        TOTALEQGET.push(data[i].meter_id)
      }
        if(SHOW_LIST_METER_TYPE == 1){
          loadEQ(data);
        }else if(SHOW_LIST_METER_TYPE == 3){
          load_map_meter_list(data);
        }else{
          $("#search_meter_list").val("")
          load_map_meter_grid(data);
        }
    })
}


//render dữ liệu ra table
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

var oTable;
function loadEQ(data){
    $(document).ready(function() {
      $("#totalSource").html(data.length);
        $('#tableSource').DataTable().destroy();
        oTable =  $('#tableSource').DataTable({
              language : translate_data_table(LANG),
              "pageLength": 50,
              "createdRow": function( row, data, dataIndex ) {
                $(row).attr("meter_id",data.meter_id);
                $(row).attr("serial_sensor",data.serial_sensor);
                $(row).attr("meter_type",data.meter_type)
                $(row).attr("meter_name",data.name)

              },
              "columnDefs": [
                { type: 'date', 'targets': [10] },
                { className: "dt-head-center", targets: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ] },
                { "orderable": false, "targets": [0, 2, 3, 6, 7, 8, 9] },
                { "orderable": true, "targets": [1 , 4, 5, 10] },
            ],
              order: [[ 10, 'asc' ]],

              data: addCheckBox(data),
              // columns: changedata(columns),
              columns: [
                {data: "checkbox", className: "align-middle"},
                {data: "id", className: "text-center-data-table align-middle"},
                {data: "name", className: "text-left-data-table align-middle"},
                {data: "ValOfNum", className: "text-right-data-table align-middle"},
                {data: "pressure", className: "text-right-data-table align-middle"},
                {data: "fre", className: "text-right-data-table align-middle"},
                {data: "pin_vol", className: "text-right-data-table align-middle"},
                {data: "batter_vol", className: "text-right-data-table align-middle"},
                {data: "measure_value_level", className: "text-right-data-table align-middle"},
                {data: "status", className: "text-left-data-table align-middle"},
                {data: "last_data_time", className: "text-center-data-table align-middle"},
              ],
              // stateSave: true
          });

          var allPages = oTable.cells( ).nodes( );
      });
    }

// cấu hình dữ liệu
function change_time(x){
    if(x == null || x == ""){
        return "";
    } else if(Number.isNaN(Number(x))){
      var y = new Date(x);
      return y.toLocaleString('en-GB', { timeZone: 'GMT' });
    }else{
    var y = new Date(Number(x));
    return y.toLocaleString('en-GB', { timeZone: 'GMT' });
    }
  }

function changeicon(i){            // hiển thị status
    if(i=="1" || i == 1){
        i = '<i class="fa fa-circle"' +' style="font-size:10px;color:green"'+'></i>' + ' - ' + 'Kết nối';
    } else if(i=="0" || i == 1){
        i = '<i class="fa fa-circle"' +' style="font-size:10px;color:red"'+'></i>' + ' - ' + 'Mất kết nối';
    }
    return i;
}

function addCheckBox(data){
    var y=[];
    let checkedbox;
    for(let i=0; i<data.length; i++){
      checkedbox = '<input type="checkbox" class="checkboxEQ" id="'+data[i].id+'">';
      let x ={
      checkbox: checkedbox,
      id: data[i].serial_sensor,
      name: data[i].name,
      ValOfNum: data[i].last_ValOfNum,
      pressure: data[i].last_pressure,
      fre: data[i].frequency,
      pin_vol: data[i].last_voltage_pin,
      batter_vol: data[i].last_voltage_ac_quy,
      measure_value_level: data[i].last_measure_cacul + ((data[i].compen_value == null || data[i].compen_value == "") ? 0 : data[i].compen_value),
      status: changeicon(data[i].status),
      last_data_time: change_time(data[i].last_data_time),
      serial_sensor: data[i].serial_sensor,
      meter_id: data[i].meter_id,
      meter_type:data[i].meter_type
      }
      y.push(x);
    }
    return(y);
  }

  // function changedata(x){
  //   let y=[];
  //   for(let i=0; i< x.length;i++){
  //     let z = {data : x[i]};
  //     y.push(z);
  //   }
  //   console.log(y);
  //   return y;
  // }
// xuất dữ liệu, refresh dữ liêu
var MultiExportTO = new Date().getTime(); // thời gian export dữ liệu nhiều thiết bị
var MultiExportFROM = MultiExportTO - 24*3600000;
var MultiExportMOMENT = 'raw' // moment export data
var SELECTEDPARAMULTIEXPORT = []; // các trường dữ liệu cho export nhiều thiết bị
var TOTALEQGET =[];

function refresh_eqlist_table(){
  $("#checkAllEQ").prop("checked",false);
  $("#tableSource").empty();
  $("#tableSource").append('<thead>'+
  '<tr class="titleRow">'+
  '<th><input type="checkbox" id="checkAllEQ"></th>'+
  '<th>ID	&nbsp;</th>'+
  '<th>Name</th>'+
  '<th>Indicator</th>'+
  '<th>Pressure</th>'+
  '<th>Frequency</th>'+
  '<th>Pin voltage</th>'+
  '<th>Battery voltage</th>'+
  '<th>Measure value level</th>'+
  '<th>Status</th>'+
  '<th>Last data date</th>'+
  '</tr>'+
  '</thead>'); 
  EXPORTLIST = [];
  showBtnCreatReport();
  getEQ(FILTER_EQ_LIST, FILTER_SUB_GROUP);
}

$(document).ready(function(){
  $("#selectTimeMultiExportinfo").change(function(){
      let x = new Date();
      let val = $(this).children("option:selected").val();
      if(val == "custom"){
          $("#picktimeMultiExportinfo").css("display","block");
      }else{
          $("#picktimeMultiExportinfo").css("display","none");
      }
      switch(val){
          case "24hour":
              MultiExportTOinfo = x.getTime();
              MultiExportFROMinfo = MultiExportTOinfo - 24*3600000;
              break;
          case "week":
              MultiExportTOinfo = x.getTime();
              MultiExportFROMinfo = MultiExportTOinfo - 3600000 * 24 * 7;
              break;
          case "month":
              MultiExportTOinfo = x.getTime();
              MultiExportFROMinfo = MultiExportTOinfo - 3600000 * 24 * 30;
              break;
      }
  })
})

function exportEQInfo(){
  $("#selectedExportMutilEQinfo").val(EXPORTLIST.join());
  $("#exportMultiEqinfo").modal('show');
}

function creatReportAndExportDatainfo(){
  let reportName = $("#nameReportinfo").val();
  if(reportName == "" || reportName == null){
    if(LANG == "en"){
      alert("ERR!! You have not named report!")

    }else{
      alert("Bạn chưa nhập tên báo cáo")
    }
  }
  else{
    let postData = {
      name: reportName,
      from: MultiExportFROMinfo,
      to: MultiExportTOinfo,
      selectedEQ: EXPORTLIST
    }
    window.open('/get/exportMultiDatainfo?fr='+MultiExportFROMinfo+'&to='+MultiExportTOinfo+'&name='
    +reportName+'&selectedEQ='+EXPORTLIST, '_blank');
    }
  }

  $(function() {
    $('#picktimeMultiExportinfo').daterangepicker(
      {
         startDate: moment().startOf('hour'),
         endDate: moment().startOf('hour'),
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
      MultiExportFROMinfo = new Date(start).getTime();
       MultiExportTOinfo = new Date(end).getTime();   
      }
   );
});

var MultiExportTOinfo = new Date().getTime();
var MultiExportFROMinfo = MultiExportTO - 24*3600000;

$(document).ready(function(){
  $("#selectMomentMultiExport").change(function(){
    let val = $(this).children("option:selected").val();
    MultiExportMOMENT = val;
  })
})

$(document).ready(function(){
  $("#exportMultiEqinfo").on('hidden.bs.modal', function(){
    $("#nameReportinfo").val("");
    $("#selectTimeMultiExportinfo").val("24hour").trigger("change");
    MultiExportTOinfo = new Date().getTime(); 
    MultiExportFROMinfo = MultiExportTO - 24*3600000;
    MultiExportMOMENTinfo = 'raw'

    $("#picktimeMultiExportinfo").data("daterangepicker").setStartDate(moment().startOf('hour'));
    $("#picktimeMultiExportinfo").data("daterangepicker").setEndDate(moment().startOf('hour'));
  })
})

var EXPORTLIST = [];
function showBtnCreatReport(){
  if(EXPORTLIST.length > 0){
    $("#creatReportBtn").prop("disabled",false)
    $("#exportEQInfoBtn").prop("disabled",false)
  }else{
    $("#creatReportBtn").prop("disabled",true)
    $("#exportEQInfoBtn").prop("disabled",true)
  }
}

$(document).ready(function(){
  $(document).on("click",".checkboxEQ",function(){
    if($(this).is(":checked")){
      let x = $(this).attr("id");
      EXPORTLIST.push(x);
      showBtnCreatReport();
    }else {
      let x = $(this).attr("id");
      let index = EXPORTLIST.indexOf(x);
      EXPORTLIST.splice(index, 1);
      showBtnCreatReport();
    }
  })
})

$(document).ready(function(){
  // $(document).on("click","#checkAllEQ",function(){

  // })
  $(document).on("click","#checkAllEQ",function(){
    if($(this).is(":checked")){
      oTable.$("input[type='checkbox']").prop("checked",true);
      EXPORTLIST = TOTALEQGET;
      showBtnCreatReport();
    }else{
      oTable.$("input[type='checkbox']").prop("checked",false);
      EXPORTLIST = [];
      showBtnCreatReport();
    }
  })
})

function createReport(){
  $("#selectedExportMutilEQ").val(EXPORTLIST.join());
  $("#exportMultiEq").modal('show');
}

function creatReportAndExportData(){
  let reportName = $("#nameReport").val();
  if(reportName == "" || reportName == null){
    if(LANG == "en"){
      alert("ERR!! You have not named report!")

    }else{
      alert("Bạn chưa đặt tên báo cáo")

    }
  }else if(SELECTEDPARAMULTIEXPORT.length == 0){
    if(LANG == "en"){
      alert("ERR! you have not selected parameters!")

    }else{
      alert("Bạn chưa chọn trường dữ liệu nào")

    }
  }
  else{
    let postData = {
      name: reportName,
      from: MultiExportFROM,
      to: MultiExportTO,
      moment: MultiExportMOMENT,
      para: SELECTEDPARAMULTIEXPORT.join(),
      // eq: EQ,
      selectedEQ: EXPORTLIST
    }
    window.open('/get/exportMultiData?fr='+MultiExportFROM+'&to='+MultiExportTO+'&name='
    +reportName+'&eq=wt'+'&para='+SELECTEDPARAMULTIEXPORT.join()+'&moment='+MultiExportMOMENT+'&selectedEQ='+EXPORTLIST, '_blank');
    }
  }

  $(document).ready(function(){
    $("#exportMultiEq").on('hidden.bs.modal', function(){
      $("#nameReport").val("");
      $("#selectTimeMultiExport").val("24hour").trigger("change");
      $("#selectMomentMultiExport").val("raw").trigger("change");
      $(".selectParaMultiExport").prop("checked",false);
      SELECTEDPARAMULTIEXPORT = [];
      MultiExportTO = new Date().getTime(); // thời gian export dữ liệu nhiều thiết bị
      MultiExportFROM = MultiExportTO - 24*3600000;
      MultiExportMOMENT = 'raw' // moment export data

      $("#picktimeMultiExport").data("daterangepicker").setStartDate(moment().startOf('hour'));
      $("#picktimeMultiExport").data("daterangepicker").setEndDate(moment().startOf('hour'));
    })
  })

  $(document).ready(function(){
    $("#selectTimeMultiExport").change(function(){
        let x = new Date();
        let val = $(this).children("option:selected").val();
        if(val == "custom"){
            $("#picktimeMultiExport").css("display","block");
        }else{
            $("#picktimeMultiExport").css("display","none");
        }
        switch(val){
            case "24hour":
                MultiExportTO = x.getTime();
                MultiExportFROM = MultiExportTO - 24*3600000;
                break;
            case "week":
                MultiExportTO = x.getTime();
                MultiExportFROM = MultiExportTO - 3600000 * 24 * 7;
                break;
            case "month":
                MultiExportTO = x.getTime();
                MultiExportFROM = MultiExportTO - 3600000 * 24 * 30;
                break;
        }
    })
})

$(function() {
  $('#picktimeMultiExport').daterangepicker(
    {
       startDate: moment().startOf('hour'),
       endDate: moment().startOf('hour'),
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
    }
 );
});

$(document).ready(function(){
  $("#selectMomentMultiExport").change(function(){
    let val = $(this).children("option:selected").val();
    MultiExportMOMENT = val;
  })
})

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
  })
})

$(document).ready(function(){
  $("#map_meter_list").hide();
  $("#map_meter_list").prop("disabled",false);
  $("#grid_meter_list").hide();
  $("#grid_meter_list").prop("disabled",false);
})
// Hiển thị danh sách thiết bị theo bản đồ, grid
var SHOW_LIST_METER_TYPE = 1;
function change_type_show_meter_list(type){
  SHOW_LIST_METER_TYPE = Number(type);
  save_filter_eq_list(SHOW_LIST_METER_TYPE);
  if(SHOW_LIST_METER_TYPE == 1){ // dạng danh sách bảng
    $("#map_meter_list").hide();
    $("#map_meter_list").prop("disabled",true);
    $("#grid_meter_list").hide();
    $("#grid_meter_list").prop("disabled",true);
    $("#search_grid_meter_container").empty();

    $("#table_meter_list").show();
    $("#table_meter_list").prop("disabled",false);
    getEQ(FILTER_EQ_LIST, FILTER_SUB_GROUP);
  }else if(SHOW_LIST_METER_TYPE == 3){ // dạng bản đồ
    $("#table_meter_list").hide();
    $("#table_meter_list").prop("disabled",true);
    $("#grid_meter_list").hide();
    $("#grid_meter_list").prop("disabled",true);
    $("#search_grid_meter_container").empty();

    $("#map_meter_list").show();
    $("#map_meter_list").prop("disabled",false);
    getEQ(FILTER_EQ_LIST, FILTER_SUB_GROUP);
  }else{            // dạng lưới
    $("#map_meter_list").hide();
    $("#map_meter_list").prop("disabled",true);
    $("#table_meter_list").hide();
    $("#table_meter_list").prop("disabled",true);
    $("#grid_meter_list").show();
    $("#grid_meter_list").prop("disabled",false);
    $("#search_grid_meter_container").append('<div class="input-group rounded">'
    +'<input type="text" class="form-control rounded" placeholder="Tìm kiếm" aria-label="Search" aria-describedby="search-addon" id="search_meter_list" />'
    +'<span class="input-group-text border-0" id="search-addon">'
    +'<i class="fas fa-search"></i>'
    +'</span>'
    +'</div>');
    getEQ(FILTER_EQ_LIST, FILTER_SUB_GROUP);
  }
}

function save_filter_eq_list(SHOW_LIST_METER_TYPE){
  console.log(SHOW_LIST_METER_TYPE);
  httpAsync({data: SHOW_LIST_METER_TYPE},"/source/post/save_filter_eq_list","POST",function(result){})
}

function load_map_meter_list(data){
  $("#totalSource").html(data.length);
  let uluru = {
    lat: 21.02968240219856,
    lng: 105.78508077717274
  }
  for(let i=0; i<data.length; i++){
    if(data[i].location_lat != null && data[i].location_lat != "" && data[i].location_long != null && data[i].location_long != ""){
      uluru.lat = Number(data[i].location_lat);
      uluru.lng = Number(data[i].location_long);
      break;
    }
  }
  let options = {
    zoom : 12,
    center: uluru
  }
  let map_2 = new google.maps.Map(document.getElementById("map_meter_list"), options);
  let marker_2 = null;
  for(let i=0; i<data.length; i++){
    if(data[i].location_lat != null && data[i].location_lat != "" && data[i].location_long != null && data[i].location_long != ""){
      let coords = {
        lat: Number(data[i].location_lat),
        lng: Number(data[i].location_long)
      }
      marker_2 = new google.maps.Marker({
        opacity: 1,
        position: coords,
        map: map_2,
        animation: google.maps.Animation.DROP,
        icon: {
          url: return_icon_map(data[i].status),
          // scaledSize: new google.maps.Size(30, 50), // scaled size
          // origin: new google.maps.Point(0,0), // origin
          // anchor: new google.maps.Point(0, 0) // anchor
        }
      })
      let content = '<div class="col-12">'
                  +'<div class="row">'+'Mã thiết bị: '+data[i].meter_id+'</div>'
                  + '<div class="row">'+'Tên: '+data[i].name+'</div>'
                  +'<div class="row">'+'Chỉ số: '+data[i].last_ValOfNum+'</div>'
                  +'<div class="row">'+'Áp suất: '+data[i].last_pressure+'</div>'
                  +'<div class="row">'+'Thời gian: '+return_date_format_ddmmyyhhmmss(data[i].last_meter_time)+'</div>'
                  +'</div>'                  
        marker_2['infowindow'] = new google.maps.InfoWindow({
        content: content
      });
      marker_2['infowindow'].open(map_2, marker_2);
      google.maps.event.addListener(marker_2, 'click', function () {
        this['infowindow'].open(map_2, this);
    });
    }
  }
}



function load_map_meter_grid(data){
  $("#totalSource").html(data.length);
  $("#grid_meter_list").empty();
  let x = "";
  for(let i=0; i<data.length; i++){
    x += return_content(data[i],i,data.length)
  }
  $("#grid_meter_list").append(x);
}

function return_color_status(x){
  if(x == 1)
    return "green";
  return "red";
}


function return_content(data, i, length){
  console.log(data)
  let content;
  if(FILTER_EQ_LIST != "all" && FILTER_SUB_GROUP != "all"){
    content = '<div class="col-3">'
              +  '<div class="card text-left">'
              +  '<div class="card-body">'
              +  '<h4 class="font-weight-bold">'+show_if_null(data.name)+'</h4>'
              +  '<span style="font-weight: bold; color: '+return_color_status(data.status)+';">'+show_if_null(data.meter_id)+'</span>'
              +  '<div class="row mt-2 mt-2">'
              +  '<i class="fa fa-clock-o display-7 mt-1" aria-hidden="true"></i> <span class="text-uppercase display-7" >'+show_if_null(data.last_ValOfNum)+'</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Sản lượng: </span>'
              +  '<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data.last_terminal_index)+'</span> (m3)</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2 mt-2 mb-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Lưu lượng: </span>'
              +  '<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data.last_flow_rate)+'</span> (m3/h)</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Áp suất: </span>'
              +  '<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data.last_pressure)+'</span> (Bar)</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Mực nước bể: </span>'
              +  '<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data.last_measure_sensor)+'</span> (m)</span>'
              +  '</div>'
              + '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              + '<span class="text-left">Tần suất dữ liệu (Phút): </span>'
              +  '<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data.frequency)+'</span> (Phút)</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Điện áp pin dự phòng: </span> '
              +  '<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data.last_voltage_pin)+'</span> (V)</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Điện áp ác quy: </span> '
              +  '<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data.last_voltage_ac_quy)+'</span> (V)</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Thời điểm: </span>'
              +  '<span class="ml-auto"><span class="font-weight-bold">'+return_date_format_ddmmyyhhmmss(data.last_meter_time)+'</span></span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Đặt làm nguồn: </span> '
              +  '<span class="ml-auto"><span class="font-weight-bold">'+return_status_branch_total(data.branch_total)+'</span></span>'
              +  '</div>'
              +  '</div>'
              +  '<div class="card-footer text-right">'
              +  '<button class="btn btn-outline-secondary" onclick="open_modal_detail(`'+data.meter_id+'`,`'+data.serial_sensor+'`,`'+data.meter_type+'`,`'+data.name+'`)"><i class="fa fa-cog" aria-hidden="true"></i> Chi tiết</button>'
              +  '</div>'
              +  '</div>'
              +  '</div>'
  }else{
    content = '<div class="col-3">'
              +  '<div class="card text-left">'
              +  '<div class="card-body">'
              +  '<h4 class="font-weight-bold">'+show_if_null(data.name)+'</h4>'
              +  '<span style="font-weight: bold; color: '+return_color_status(data.status)+';">'+show_if_null(data.meter_id)+'</span>'
              +  '<div class="row mt-2 mt-2">'
              +  '<i class="fa fa-clock-o display-7 mt-1" aria-hidden="true"></i> <span class="text-uppercase display-7" >'+show_if_null(data.last_ValOfNum)+'</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Sản lượng: </span>'
              +  '<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data.last_terminal_index)+'</span> (m3)</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2 mt-2 mb-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Lưu lượng: </span>'
              +  '<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data.last_flow_rate)+'</span> (m3/h)</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Áp suất: </span>'
              +  '<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data.last_pressure)+'</span> (Bar)</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Mực nước bể: </span>'
              +  '<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data.last_measure_sensor)+'</span> (m)</span>'
              +  '</div>'
              + '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              + '<span class="text-left">Tần suất dữ liệu (Phút): </span>'
              +  '<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data.frequency)+'</span> (Phút)</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Điện áp pin dự phòng: </span> '
              +  '<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data.last_voltage_pin)+'</span> (V)</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Điện áp ác quy: </span> '
              +  '<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data.last_voltage_ac_quy)+'</span> (V)</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Thời điểm: </span>'
              +  '<span class="ml-auto"><span class="font-weight-bold">'+return_date_format_ddmmyyhhmmss(data.last_meter_time)+'</span></span>'
              +  '</div>'
              +  '</div>'
              +  '<div class="card-footer text-right">'
              +  '<button class="btn btn-outline-secondary" onclick="open_modal_detail(`'+data.meter_id+'`,`'+data.serial_sensor+'`,`'+data.meter_type+'`,`'+data.name+'`)"><i class="fa fa-cog" aria-hidden="true"></i> Chi tiết</button>'
              +  '</div>'
              +  '</div>'
              +  '</div>'
  
            }
              
  if(i % 4 == 0 || i == 0){
    content = '<div class="row">' + content
  }
  if(i % 4 == 3 || i == length - 1){
    content = content + '</div>'
  }
  return content;
}

function return_status_branch_total(x){
  switch(x){
    case 0:
    case "0":
      return "Chưa cài đặt"
    case 1:
    case "1":
      return "Nhánh"
    case 2:
    case "2":
      return "Tổng"
  }
}

// Tìm kiếm thiết bị 
$(document).ready(function(){
  $(document).on("keyup","#search_meter_list", function() {
    // console.log($("#search_meter_list").val());
    let search_key = $("#search_meter_list").val();
    let data_after_search = []
    for(let i=0; i<METER_LIST.length; i++){
      if(METER_LIST[i].meter_id.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().includes(search_key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()) || METER_LIST[i].name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().includes(search_key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase())){
        data_after_search.push(METER_LIST[i]);
      }
    }
    load_map_meter_grid(data_after_search)
  });
})

// back to top btn
$(document).ready(function(){
	$(window).scroll(function () {
			if ($(this).scrollTop() > 50) {
				$('#back-to-top').fadeIn();
			} else {
				$('#back-to-top').fadeOut();
			}
		});
		// scroll body to 0px on click
		$('#back-to-top').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 400);
			return false;
		});
});








  //click vào 1 thiết bị
  var ID;
  var SERIAL_SENSOR;
  var METER_TYPE;
  $(document).ready(function(){
    $(document).on('click','.tableContain tbody td:not(td:has(input))',function() {
      //  let id = $(this).parent().children("td:nth-child(2)").html();
       let id = $(this).parent().attr("meter_id");
       let name = $(this).parent().attr("meter_name");
       SERIAL_SENSOR = $(this).parent().attr("serial_sensor");
       METER_TYPE = $(this).parent().attr("meter_type");
       if(METER_TYPE == "wt"){
        fill_instant_value(id,SERIAL_SENSOR);
        showmodal(name);
       }else{
        fill_instant_value_inverter(id,SERIAL_SENSOR);
        showmodal_inverter(name);
       }
       ID = id;
     });
  });

  function open_modal_detail(id,serial_sensor,meter_type,name){
    SERIAL_SENSOR = serial_sensor;
    METER_TYPE = meter_type;
    if(METER_TYPE == "wt"){
     fill_instant_value(id,SERIAL_SENSOR);
     showmodal(name);
    }else{
     fill_instant_value_inverter(id,SERIAL_SENSOR);
     showmodal_inverter(name);
    }
    ID = id;
  }


  // hiển thị modal
  function showmodal(name){
    $('#DetalEQ').modal('show');
      document.getElementById("titleNameEQ").innerHTML = name;
        // CHANGELOADQUALYTI = false;
        // $("#dataqualityEq").val("pressure").trigger('change');
        // CHANGELOADQUALYTI =  true    
        //   checkEQ();
}

// điền chỉ số tức thời
function fill_instant_value(id){
    httpAsync(null,"/source/get/instant_value?id="+id+"&serial_sensor="+SERIAL_SENSOR,"GET",function(result){
      console.log(id, SERIAL_SENSOR);
        let data;
        if(result =="" || result == null){
            return false;
        }else{
            data = JSON.parse(result);
            $("#ins_val_idEQ").val(data.id);  // mã thiết bị
            $("#ins_val_nameEQ").val(data.name); // tên thiết bị
            $("#ins_val_LDD").val(returnSQLDateFormat(data.last_meter_time)); // thời gian
            $("#ins_val_ValOfnum").val(data.last_ValOfNum); //chỉ số đồng hồ
            $("#ins_val_pin_vol").val(data.last_voltage_pin); // điện áp pin
            $("#ins_val_vol_ac_quy").val(data.last_voltage_ac_quy); // điện áp ác quy
            $("#ins_val_pressure").val(data.last_pressure); // áp suất
            $("#ins_val_flow_rate").val(data.last_flow_rate); // lưu lượng
            $("#ins_val_quanity").val(data.last_terminal_index); // sản lượng
            $("#ins_val_frequency").val(data.frequency); // tần suất
            $("#ins_measure_sensor").val(data.last_measure_sensor); // mực nước cảm biến đo
            $("#ins_wave_current").val(data.last_wave_current_1); // cường độ sóng
        }
    })
}

function refresh_instam_val(){  //refresh chỉ số tức thời
    fill_instant_value(ID);
}

//Tab chỉ số từng thời điểm 

var TO_DATA = new Date().getTime();  // thời gian kết thúc
var FROM_DATA = TO_DATA -  3600000*24 // thời gian bắt đầu
var MOMENT_DATA = "raw"                // thời điểm

$(document).ready(function(){   // thay đổi khoảng thời gian hiển thị chỉ số theo thời điểm
    $("#select_time_data").change(function(){
        let x = new Date();
        let val = $(this).children("option:selected").val();
        if(val == "custom"){
            $("#pick_time_data").css("display","block");
        }else{
            $("#pick_time_data").css("display","none");
        }
        switch(val){
            case "24hour":
                TO_DATA = x.getTime();
                FROM_DATA = TO_DATA - 24*3600000;
                break;
            case "week":
                TO_DATA = x.getTime();
                FROM_DATA = TO_DATA - 3600000 * 24 * 7;
                break;
            case "month":
                TO_DATA = x.getTime();
                FROM_DATA = TO_DATA - 3600000 * 24 * 30;
                break;
        }
    })
  })

  $(function() {
    $('#pick_time_data').daterangepicker(  // pick khoảng thời gian cụ thể
      {
         startDate: moment().startOf('hour'),
         endDate: moment().startOf('hour'),
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
        FROM_DATA = new Date(start).getTime() ;
        TO_DATA = new Date(end).getTime();   
      }
   );
});

var COMPEN_VALUE = 0;
function get_data(id){              // lấy dữ liệu và hiển thị
    MOMENT_DATA = $("#select_moment_data").val();
    httpAsync(null,"/source/get/compen_value","GET",function(value){
      if(value == null || value == ""){
        COMPEN_VALUE = 0
      }else{
        let data = JSON.parse(value)
        COMPEN_VALUE = data[0].compen_value;
      }
      httpAsync(null,"/source/get/dataEQ?id="+id+"&moment="+MOMENT_DATA+"&to="+TO_DATA+"&fr="+FROM_DATA,"GET",function(result){
        let data = []
        if(result == null || result == ""){
            fill_data(data);
            return false;
        }else{
            data = JSON.parse(result);
            fill_data(data);
        }
      })
    })

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


function show_if_null(x){
  if(x === "" || x === null) 
    return "-";
  return x;
}


function config_data(data){ 
  // cấu hình dữ liệu hiển thị
    var y=[];
    let a = 0
    for(let i= data.length-1; i>=0; i--){
      let x ={
      index: a+1,
      time: returnSQLDateFormat(data[i].meterTime),
      ValOfNum: data[i].ValOfNum,
      pressure: data[i].pressure,
      flowRate: data[i].flowRate,
      measure_value_level: data[i].measure_cacul + + ((COMPEN_VALUE == null || COMPEN_VALUE == "") ? 0 : COMPEN_VALUE),
      pin_vol: data[i].Voltage,
      batter_vol: data[i].voltage_ac_quy,
      quanity: data[i].terminal_index,
      }
      a++;
      y.push(x);
    }
    return(y);
}

// var columns_data_source = ["index", "time", "ValOfNum", "pressure", "flowRate", "pin_vol", "batter_vol", "quanity"]; 


function fill_data(data){       //hiển thị dữ liệu ra datatable
    $(document).ready(function() {
          $('#table_data').DataTable().destroy();
          $('#table_data').DataTable({
                "pageLength": 50,
                language : translate_data_table(LANG),
                "columnDefs": [
                  { className: "dt-head-center", targets: [ 0, 1, 2, 3, 4, 5, 6, 7, 8] },
                //   { "orderable": false, "targets": [0, 2, 3, 6, 7, 8, 9] },
                  { "orderable": true, "targets": [0,1,2,3,4,5,6,7,8] }
              ],
                data: config_data(data),
                columns: [
                  {data: "index", className: "text-center-data-table align-middle"},
                  {data: "time", className: "text-center-data-table align-middle"},
                  {data: "ValOfNum", className: "text-right-data-table align-middle"},
                  {data: "pressure", className: "text-right-data-table align-middle"},
                  {data: "flowRate", className: "text-right-data-table align-middle"},
                  {data: "measure_value_level", className: "text-right-data-table align-middle"},
                  {data: "pin_vol", className: "text-right-data-table align-middle"},
                  {data: "batter_vol", className: "text-right-data-table align-middle"},
                  {data: "quanity", className: "text-right-data-table align-middle"},
                ],
                // columns: changedata(columns_data_source),
                // stateSave: true
            });
        });
}

function submit_getDataEQ(){ //load và hiển thị lại data khi thay đổi thời gian, moment và ấn submit
    get_data(ID);
}

function export_data(){     // xuất dữ liệu
    window.open('/source/get/exportdata?fr='+FROM_DATA+'&to='+TO_DATA+'&id='+ID+'&moment='+MOMENT_DATA, '_blank');
}

// tab biểu đồ
var DATA; // dữ liệu của parameter từng thiết bị hiển thị trên biểu đồ tại visual tab
var CONFIG; // cấu hình số trường hiển thị biểu đồ visual tab
var COLOR_CONFIG; // cấu hình màu từng trường dữ liệu
var TYPE ="line"; // loại biểu đồ tab visual
var TOVISUAL = (new Date()).getTime();//thời gian bắt đầu của biểu đồ tab visual
var FROMVISUAL = TOVISUAL - 3600000*24;//thời gian kết thúc của biểu đồ tab visual
var maxlegendChart = ""; // thêm vào chú thích biểu đồ tab visual
var ARR = []; // lưu các cấu hình : các para đang hiển thị 
var chart2; // biểu đồ tab visual
var MOMENT = "raw";

function showChart(id, from, to, type, ft, moment){       //lấy dữ liệu, cấu hình và render biểu đồ
  httpAsync(null,"/source/get/data_chart?id="+id+"&fr="+from+"&to="+to+"&moment="+moment,"GET",function(result){
    let a = JSON.parse(result);
    let b = a["config"];
        let data = a["data"];
        DATA = data;
        if(ft == true){
            CONFIG = JSON.parse(b.config);
            COLOR_CONFIG = JSON.parse(b.color_config);
            loadConfig(CONFIG,COLOR_CONFIG);
        }
        renderChart(CONFIG, DATA, type,COLOR_CONFIG);      
  })
}

function configtoarr(x){      // config lấy từ db về sẽ có dạng json {pressure: 0, quanity:1, flowRate:1} => chuyển thành dạng array: [pressure]
  let arr=[];
  if(x.pressure == 0) arr.push("pressure");
  if(x.quanity == 0) arr.push("quanity");
  if(x.flowRate == 0) arr.push("flowRate");
  ARR = arr;
  return ARR;
}

function stringtonum(st){   //nếu giá trị trả về quy đc ra số thì là số, còn ko là null
  if(Number.isNaN(Number(st)) || st == null ){
    return null;
  }else{
  return Number(st);
  }
}

function toISO(x){    // đổi từ số miligiay sang date
  if(Number.isNaN(Number(x))){
    let y = new Date(x);
    return y;
  }else{
  let y = new Date(Number(x));
  return y;
  }
}

function returnUnit(field){  //trả về đơn bị vs đầu vào là biến 
  switch(field){
    case "pressure":
      return "Pa";
    case "quanity":
      return "m3";
    case "flowRate":
      return "m3/h";
  }
}

function shortToFullName(name){     // Trả về tên đầy đủ
  if(LANG == "en"){
    switch(name){
      case "pressure":
        name = "Pressure";
        break;
      case "quanity":
        name = "Quanity";
        break;
      case "flowRate":
        name = "Flow rate";
        break;
    }
  }else{
    switch(name){
      case "pressure":
        name = "Áp suất";
        break;
      case "quanity":
        name = "Sản lượng";
        break;
      case "flowRate":
        name = "Lưu lượng";
        break;
    }
  }

  return name;
}

function renderChart(config, Data, type, color_config){ //render biểu đồ, đầu vào có data, cấu hình: các trường hiển thị, loại biều đồ và màu
  let data =[];
        for(let i=0;i<Data.length;i++){
          let x={
            "time":new Date(Data[i].meterTime),
            "pressure":stringtonum(Data[i].pressure),
            "flowRate":stringtonum(Data[i].flowRate),
            "quanity":stringtonum(Data[i].terminal_index),
          }
          data.push(x);
        }
      
  let thickness;
  let arr = configtoarr(config);
  let x = []
  for(let i=0; i< arr.length; i++){
    x.push(returnUnit(arr[i]));
  }
  let unit = Array.from(new Set(x));
  switch(type){
    case "line":
      thickness = 3;
      TYPE = "line";
      break;
    case "point":
      thickness = 0;
      TYPE = "point"
      break;
    case "bar":
      TYPE = "bar";
      break;
  }
  am4core.useTheme(am4themes_animated);
  if(chart2 != null){
    chart2.dispose();
  }
  chart2 = am4core.create("chartMain", am4charts.XYChart);
  chart2.scrollbarX = new am4core.Scrollbar();
  chart2.data = data;
  chart2.logo.disabled = true;
  let dateAxis = chart2.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 60;
  dateAxis.startLocation = 0.5;
  dateAxis.endLocation = 0.5;
  dateAxis.renderer.grid.template.location = 0;
  dateAxis.renderer.grid.template.disabled = true;
  dateAxis.renderer.fullWidthTooltip = true;
  dateAxis.dateFormats.setKey("hour", "HH:mm");
  dateAxis.dateFormats.setKey("day", "dd/MM");
  dateAxis.periodChangeDateFormats.setKey("hour", "dd/MM"); 
  dateAxis.dateFormats.setKey("month", "MM/yyyy");
  dateAxis.periodChangeDateFormats.setKey("day", "MM/yyyy");

  chart2.cursor = new am4charts.XYCursor();
  chart2.cursor.fullWidthLineX = true;
  chart2.cursor.xAxis = dateAxis;
  chart2.cursor.lineX.strokeWidth = 0;
  chart2.cursor.lineX.fill = am4core.color("#000");
  chart2.cursor.lineX.fillOpacity = 0.1;
  chart2.legend = new am4charts.Legend();


  let Pa = chart2.yAxes.push(new am4charts.ValueAxis());
  Pa.tooltip.disabled = false;
  Pa.renderer.ticks.template.disabled = true;
  Pa.renderer.axisFills.template.disabled = true;
  if(unit.indexOf("Pa") != -1){
  Pa.renderer.line.strokeOpacity = 0.5;
  Pa.renderer.line.strokeWidth = 1;
  Pa.title.text ="Pa"
  }
  Pa.renderer.opposite = true;
  Pa.extraMin = 0.1;
  Pa.extraMax = 0.1; 

  var m3h = chart2.yAxes.push(new am4charts.ValueAxis());
  m3h.tooltip.disabled = false;
  m3h.renderer.ticks.template.disabled = true;
  m3h.renderer.axisFills.template.disabled = true;
  if(unit.indexOf("m3/h") != -1){
  m3h.renderer.line.strokeOpacity = 0.5;
  m3h.renderer.line.strokeWidth = 1;
  m3h.title.text ="m3/h"
  }
  m3h.renderer.opposite = false;
  m3h.extraMin = 0.1;
  m3h.extraMax = 0.1; 

  var m3 = chart2.yAxes.push(new am4charts.ValueAxis());
  m3.tooltip.disabled = false;
  m3.renderer.ticks.template.disabled = true;
  m3.renderer.axisFills.template.disabled = true;
  if(unit.indexOf("m3") != -1){
  m3.renderer.line.strokeOpacity = 0.5;
  m3.renderer.line.strokeWidth = 1;
  m3.title.text ="m3"
  }
  m3.renderer.opposite = true;
  m3.extraMin = 0.1;
  m3.extraMax = 0.1; 
  
  function creatAxisAndSeries(field){
   
    var series;
    if(type == "bar"){
    series = chart2.series.push(new am4charts.ColumnSeries());
    series.columns.template.fillOpacity = 1;
    series.columns.template.strokeOpacity = 1;
    }else{
      series = chart2.series.push(new am4charts.LineSeries());
     
    }
    if(type == "point"){
      series.bullets.push(new am4charts.CircleBullet());
    }
    switch (returnUnit(field)){     // water
      case "Pa": series.yAxis = Pa;break;
      case "m3/h": series.yAxis = m3h;break;
      case "m3": series.yAxis = m3;break;
    }
    series.dataFields.valueY = field;
    series.dataFields.dateX = "time";
    series.title = shortToFullName(field);
    series.strokeWidth = thickness;
    series.tensionX = 0.9;
    series.showOnInit = true;
    series.legendSettings.labelText = shortToFullName(field) + maxlegendChart +'('+returnUnit(field)+')'
    series.tooltipText =shortToFullName(field)+maxlegendChart+ ": {valueY} " + returnUnit(field);
    series.name = shortToFullName(field) + maxlegendChart;
    series.tooltip.pointerOrientation = "horizontal";
    series.fill = am4core.color(color_config[field]);
    series.stroke = am4core.color(color_config[field]);
  }

  for(let i=0; i< arr.length; i++){
    creatAxisAndSeries(arr[i]);
  }
  maxlegendChart ="";
}

function arrtoconfig(arr){
  let key = Object.keys(CONFIG);
  for(let i=0; i<key.length; i++){
      CONFIG[key[i]] = 1;
  }
  for(let i=0; i<arr.length; i++){
      CONFIG[arr[i]] = 0;
  }; 
  return CONFIG;
}

$(document).ready(function(){
  $(document).on("click",".selectParaExport",function(){
    if($(this).is(":checked")){
      let val=$(this).val();
      ARR.push(val);
      renderChart(arrtoconfig(ARR), DATA, TYPE, COLOR_CONFIG)
    }else{
      let x = $(this).val();
      let index = ARR.indexOf(x);
      ARR.splice(index,1);
      renderChart(arrtoconfig(ARR), DATA, TYPE, COLOR_CONFIG);
    }
  })
})

function loadConfig(config,color_config){
  configtoarr(config);
  $(".selectParaExport").prop("checked",false);
  for(let i=0; i<ARR.length; i++){
    $("#selectParaExport"+ARR[i]).prop("checked",true);
  }
  let x = ["quanity","flowRate","pressure"];
  for(let i=0; i< x.length; i++){
    $("#color" + x[i]).val(color_config[x[i]]);
  }
}

function submitColor(){ // thay đổi màu các trường trong biểu đồ
  let x;
    x = ["quanity","flowRate","pressure"];
  
  for(let i=0;i<x.length; i++){
    COLOR_CONFIG[x[i]] = $("#color"+x[i]).val();
  }
  renderChart(arrtoconfig(ARR), DATA, TYPE, COLOR_CONFIG);
}

$(document).ready(function(){
  $("#select_moment_chart").change(function(){
    let val = $(this).children("option:selected").val();
    if(val == "raw"){
        maxlegendChart = "  ";
        showChart(ID, FROMVISUAL, TOVISUAL, TYPE, false, 'raw'); MOMENT ='raw';
    }else{
        maxlegendChart = " max ";
        showChart(ID, FROMVISUAL, TOVISUAL, TYPE, false, val); MOMENT = val; //year
    }
  })
})

$(document).ready(function(){
  $("#select_time_chart").change(function(){
    let x = new Date();
    let val = $(this).children("option:selected").val();
    if(val == "custom"){
        $("#pick_time_chart").css("display","block");
    }else{
        $("#pick_time_chart").css("display","none");                
    }
    switch(val){
        case "24hour":
            TOVISUAL = x.getTime();
            FROMVISUAL = TOVISUAL - 24*3600000;
            showChart(ID, FROMVISUAL, TOVISUAL, TYPE, false, MOMENT);
            break;
        case "week" :
            TOVISUAL = x.getTime();
            FROMVISUAL = TOVISUAL - 3600000 * 24 * 7;
            showChart(ID, FROMVISUAL, TOVISUAL, TYPE, false, MOMENT);
            break;
        case "month":
            TOVISUAL = x.getTime();
            FROMVISUAL = TOVISUAL - 3600000 * 24 * 30;
            showChart(ID, FROMVISUAL, TOVISUAL, TYPE, false, MOMENT);
            break;
    }
  })
})

$(function() {
  $('#pick_time_chart').daterangepicker(
    {
       startDate: moment().startOf('hour'),
       endDate: moment().startOf('hour'),
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
     startDate = start;
      endDate = end;   
      customDate(startDate, endDate); 
    }
 );
//    $('#reportrange span').html(moment().subtract(29, 'day').format('D MMMM YYYY') + ' - ' + moment().format('D MMMM YYYY'));
});

function customDate(startDate, endDate){
  let from = (new Date(startDate)).getTime();
  let to = (new Date(endDate)).getTime();
  TOVISUAL = to; FROMVISUAL = from;
  showChart(ID, from, to, TYPE, false, MOMENT);
}

$(document).ready(function(){   //thay đổi laoij biểu đồ
  $("#typeChart").change(function(){
    let val = $(this).children("option:selected").val();
    renderChart(CONFIG, DATA, val, COLOR_CONFIG);
  })
})

function saveConfig(){  // lưu cấu hình
  let postData = {
  id: ID,
  config: CONFIG,
  color_config: COLOR_CONFIG
  }
  httpAsync(postData,"/source/post/config","POST",function(result){
      alert(result);
  })
};

// tab danh sách các cảnh báo
// var PARA_LIST = ["pressure", "flowRate", "quanity"]
var TO_ALERT_LIST = (new Date()).getTime();
var FROM_ALERT_LIST = TO_ALERT_LIST - 7 * 24 * 3600000;

function getAlertAndRenderTable(){
  httpAsync(null,"/source/get/alert?fr="+FROM_ALERT_LIST+"&to="+TO_ALERT_LIST,'GET',function(result){
    if(result == "" || result == null){
      loadAL([]);
    }else{
      let data = JSON.parse(result);
      loadAL(data);
    }
})
}

function loadAL(data){
  $(document).ready(function() {
    $("#totalAlert").val(data.length);
      $('#tableAlert').DataTable().destroy();
      $('#tableAlert').DataTable({
              "pageLength": 50,
              language : translate_data_table(LANG),
              "columnDefs": [
                { className: "dt-head-center", targets: [ 0, 1, 2, 3, 4, 5] },
              ],
              data: modifi_alert(data),
              columns: [
                {data: "id", className: "text-center-data-table align-middle"},
                {data: "alert_type", className: "text-left-data-table align-middle"},
                {data: "threshold", className: "text-right-data-table align-middle"},
                {data: "alert_value", className: "text-right-data-table align-middle"},
                {data: "comparative_value", className: "text-right-data-table align-middle"},
                {data: "alert_time", className: "text-center-data-table align-middle"},
              ]
      });
  });
}

function config_alert_type(x){
  if(LANG == "en"){
    switch(x){
      case "OVER_APSUAT": return "Over pressure";
      case "LOWER_APSUAT": return "Lower pressure";
      case "OVER_OP": return "Over flowrate";
      case "LOWER_OP": return "Lower flowrate";
      case "OVER_MN": return "Over water level";
      case "LOWER_MN": return "Lower water level";
      case "LOWER_PIN": return "Lower pin";
      case "LOWER_ACQUY": return "Lower battery";
      case "REVERSE_PULSE": return "Reverse pulse";
    }
  }else{
    switch(x){
      case "OVER_APSUAT": return "Áp suất vượt ngưỡng";
      case "LOWER_APSUAT": return "Áp suất dưới ngưỡng";
      case "OVER_OP": return "Lưu lượng vượt ngưỡng";
      case "LOWER_OP": return "Lưu lượng dưới ngưỡng";
      case "OVER_MN": return "Mực nước vượt ngưỡng";
      case "LOWER_MN": return "Mực nước dưới ngưỡng";
      case "LOWER_PIN": return "Pin yếu";
      case "LOWER_ACQUY": return "Ác quy yếu";
      case "REVERSE_PULSE": return "Ngược xung";
      default: return x;
    }
  }
  return x;
}

function modifi_alert(data){
  var y=[];
  for(let i=0; i<data.length; i++){
    let x ={ 
    id: i+1,
    alert_type: config_alert_type(data[i].alert_type),
    threshold: data[i].threshold,
    alert_value: data[i].alert_value,
    comparative_value: data[i].comparative_value,
    alert_time: new Date(data[i].alert_time).toLocaleString(),
    }
    y.push(x);
  }
  return(y);
}




$(document).ready(function(){
  $("#selectTimeAlert").change(function(){
    let val = $(this).children("option:selected").val();
    switch(val){
      case "week" :  
        $("#picktimeAlert").css("display","none");
        TO_ALERT_LIST = (new Date()).getTime();
        FROM_ALERT_LIST = TO_ALERT_LIST - 7 * 24 * 3600000;
        break;
      case "month" :
        $("#picktimeAlert").css("display","none");
        TO_ALERT_LIST = (new Date()).getTime();
        FROM_ALERT_LIST = TO_ALERT_LIST - 30 * 24 * 3600000;
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
    
      FROM_ALERT_LIST = new Date(start).getTime();
      TO_ALERT_LIST = new Date(end).getTime();
      // getAlertAndRenderTable();
    }
 );
//  $('#reportrange span').html(moment().subtract(29, 'day').format('D MMMM YYYY') + ' - ' + moment().format('D MMMM YYYY'));
});

// $(document).ready(function(){
//   $(document).on("click", ".selectParaAlert",function(){
//    if($(this).is(":checked")){
//      let sourceType= $(this).val();
//      PARA_LIST.push(sourceType);
//    }else{
//      let para= $(this).val();
//      let index = PARA_LIST.indexOf(para);
//      PARA_LIST.splice(index, 1);
//    }
//   })
// })

// function setupfilter(){
//   for(let i=0; i<PARA_LIST.length;i++){
//     $("#selectParaAlert"+PARA_LIST[i]).prop("checked",true);
//   }
// }



function filter(){ // bấm nút filter
  getAlertAndRenderTable();
}

function refreshTable(){    // refresh data
  getAlertAndRenderTable();
}

// tab bản đồ

function not_null(x){
  if(x == null || x =="null"){
    return "";
  }else{
    return x;
  }
}


function return_icon_map(status){
  if(status == "1" || status == 1){
    return("/images/small-connect.png")
  }else{
    return("/images/small-disconnect.png")
  }
}

function get_location(){
    httpAsync(null,"/source/get/info?id="+ID,"GET",function(result){
      $("#contain_map").empty();
      $("#contain_map").append('    <div id="map_single_eq" class="m-3" style="width:100%; min-height:400px"></div>')
      let long = null, lat = null;
      if(result != "" || result != null){
        let data = JSON.parse(result);
        long = data.location_long;
        lat = data.location_lat;
        $("#map_location_lat").val(lat);
        $("#map_location_long").val(long);
        if(long == "" || long == null || lat =="" || lat == null){
          $("#contain_map").empty();
          $("#contain_map").append('    <div id="map_single_eq" class="m-3">No location data</div>')
        }else{
          // The location of Uluru
     const uluru = { lat: Number(lat), lng: Number(long) };
     // The map, centered at Uluru
     const map = new google.maps.Map(document.getElementById("map_single_eq"), {
       zoom: 15,
       center: uluru,
     });
     // The marker, positioned at Uluru
     const marker = new google.maps.Marker({
       position: uluru,
       map: map,
       animation: google.maps.Animation.DROP,
       icon: return_icon_map(data.status)
     });

     let content_ = "";
     if(LANG == "en"){
      content_ = '<p>ID: '+not_null(data.id)+'</p>'
      +'<p>Name: '+not_null(data.name)+'</p>'
      +'<p>Time: '+not_null(change_time(data.last_data_time))+'</p>'
      +'<p>Value of num: '+not_null(data.last_ValOfNum)+'</p>'
      +'<p>Address: '+not_null(data.address)+'</p>' ;
     }else{
      content_ = '<p>ID: '+not_null(data.id)+'</p>'
      +'<p>Tên: '+not_null(data.name)+'</p>'
      +'<p>Thời điểm: '+not_null(change_time(data.last_data_time))+'</p>'
      +'<p>Chỉ số: '+not_null(data.last_ValOfNum)+'</p>'
      +'<p>Địa chỉ: '+not_null(data.address)+'</p>' ;
     }
      marker['infowindow'] = new google.maps.InfoWindow({
        content: content_
      });

      google.maps.event.addListener(marker, 'click', function () {
          this['infowindow'].open(map, this);
      });

        }

      }else{
        $("#contain_map").empty();
        $("#contain_map").append('<div id="map_single_eq" class="m-3">No location data</div>')
        $("#map_location_lat").val("");
        $("#map_location_long").val("");
      }
    })
}

function save_map_location(){
  let postData = {
    id: ID,
    lat: return_null_if_empty($("#map_location_lat").val()),
    long: return_null_if_empty($("#map_location_long").val())
  }

  httpAsync(postData,"/source/post/save_map_location","POST",function(result){
    if(result == "true"){
      if(LANG == "en"){
        alert("Save success!");

      }else{
        alert("Lưu thành công!");

      }
      get_location();
      LOADED_INFO = false;

    }else{
      if(LANG == "en"){
        alert("Save unsuccess!");

      }else{
        alert("Lưu không thành công!");

      }
          }
  })
}


// tab thông tin thiết bị

// multiple select option
// $(document).ready(function(){
//   $(".chosen-select").chosen({
//     no_results_text: "Oops, nothing found!"
//   })
// })
var SAVE_GROUP = [];
function set_select_group_option(){
  httpAsync(null,"/source/get/group_eq","GET",function(result){
    if(result =="" || result == null){
      return false;
    }else{
      let parse_data = JSON.parse(result);
      let data = parse_data.data;
      $("#group_eq").empty();
      for(let i=0; i<data.length; i++){
        $("#group_eq").append('<li><label><input class="info_group_select" type="checkbox" id="group_id_'+data[i].id+'" value="'+data[i].id+'">'+data[i].group_name+'</label></li>')
        // $("#group_eq").append('<option value="'+data[i].id+'" >'+data[i].group_name+'</option>')
      }
    }
    get_info();
  })
}


function get_info(){ // lấy thông tin và điền vào các trường
  httpAsync(null,"/source/get/info?id="+ID,"GET",function(result){
    if(result == "" || result == null){
      return false;
    }else{
      let data = JSON.parse(result);
      // $("#group_eq").val(data.group_id);
      // console.log(data.group_id)
      let x = data.group_id.split(",");
      $(".info_group_select").prop("checked",false);
      SAVE_GROUP = [];
     if(x != "" && x != null){
      for(let i=0; i<x.length;i++){
        $("#group_id_"+x[i]).prop("checked",true);
        SAVE_GROUP.push(x[i]);
      }
     }
      $("#name_eq").val(data.name);
      $("#location_lat").val(data.location_lat);
      $("#location_long").val(data.location_long);
      $("#address_info").val(data.address);
      $("#phone_number").val(data.phone_alert);
      $("#install_date").val( return_date_input_format(data.install_date));
      $("#inspection_date").val( return_date_input_format(data.inspection_date));
      $("#loger_install_date").val( return_date_input_format(data.loger_install_date));
      if(data.total_branch_setting =="" || data.total_branch_setting == null || data.total_branch_setting == "not_setting"){
        $("#total_branch_setting").val("not_setting");
      }else{
        $("#total_branch_setting").val(data.total_branch_setting);
      }
    }
  })
}

function return_date_input_format(x){
  if(x == null || x ==""){
    return "";
  }
  return new Date(x).toISOString().substring(0,10)
}


$(document).on("click", ".info_group_select","input[type=checkbox]", function(){
  if($(this).is(":checked")){
    let x = $(this).attr("id").slice(9);
    SAVE_GROUP.push(x);
  }else{
    let x = $(this).attr("id").slice(9);
    let index = SAVE_GROUP.indexOf(x);
    SAVE_GROUP.splice(index, 1);
  }
  // console.log(SAVE_GROUP);
})

function save_info(){
  let post_data = {
    group_id: SAVE_GROUP,
    name:$("#name_eq").val(),
    location_lat:$("#location_lat").val(),
    location_long:$("#location_long").val(),
    address:$("#address_info").val(),
    phone_alert:$("#phone_number").val(),
    install_date:$("#install_date").val(),
    inspection_date:$("#inspection_date").val(),
    loger_install_date:$("#loger_install_date").val(),
    total_branch_setting: $("#total_branch_setting").val()
  }
  if(post_data.name == null || post_data.name == ""){
    if(LANG == "en"){
      alert("Name value must not be empty!");

    }else{
      alert("Tên không được để trống");
    }
    return false;
  } 
  // console.log(post_data.group_id, post_data.total_branch_setting)
  if(post_data.group_id.length == 0 && post_data.total_branch_setting != "not_setting"){
    if(LANG == "en"){
      alert("Group cannot be empty when select branch");

    }else{
      alert("Phải chọn nhóm quản lý khi chọn nhánh/tổng");
    }
    return false;
  } 
    httpAsync(post_data,"/source/post/edit_info","POST",function(result){
      alert(result);
      LOADED_LOCATION = false;
      getEQ(FILTER_EQ_LIST, FILTER_SUB_GROUP);
      return true;
    })

}

// tab cài đặt điểm đo 
function get_setting(){ // lấy thông tin và điền vào các trường
  httpAsync(null,"/source/get/setting_info","GET",function(result){
    if(result == "" || result == null){
      return false;
    }else{
      let data = JSON.parse(result);
      let info = data[0];
      let threshold = data[1];
      if(info.length > 0){
        $("#multiplier").val(info[0].multiplier);
        $("#first_index").val(info[0].first_index);
      }
      if(threshold.length > 0){
        // console.log(threshold)
        for(let i=0; i<threshold.length; i++){
          if(threshold[i].config_type == "ACQUY"){
            $("#threshold_battery").val(threshold[i].min_value);
          }
          if(threshold[i].config_type == "PIN"){
            $("#threshold_pin").val(threshold[i].min_value);
          }
        }
      }else{
        $("#threshold_pin").val("");
        $("#threshold_battery").val("");
      }
    }
  })
}

function save_setting(){
  let post_data = {
    multiplier:return_null_if_empty($("#multiplier").val()),
    first_index:return_null_if_empty($("#first_index").val()),
    threshold_pin: return_null_if_empty($("#threshold_pin").val()),
    threshold_battery: return_null_if_empty($("#threshold_battery").val()),
  }
  httpAsync(post_data,"/source/post/edit_setting","POST",function(result){
    alert(result);
    return true;
  })
}

// tab cài đặt vượt sản lượng

let quanity_DAY_OF_WEEK = [];
function get_setting_alert(){ // lấy thông tin và điền vào các trường
  httpAsync(null,"/source/get/quanity_alert_config","GET",function(result){
    quanity_DAY_OF_WEEK = [];
    console.log(result)
    $(".quanity_checkbox").prop("checked",false);
    if(result == "" || result == null){
      return false;
    }else{
      let data = JSON.parse(result);
      $("#quanity_str_time").val(data.start_time);
      $("#quanity_end_time").val(data.end_time);
      $("#estimate_quanity").val(data.min_value);
      $("#repeat_alert").val(data.repeat_alert);
      if(data.length > 0){
        quanity_DAY_OF_WEEK = data.day_of_week.split(",");
        for(let i=0; i < quanity_DAY_OF_WEEK.length; i++){
          $("#quanity_"+quanity_DAY_OF_WEEK[i]).prop("checked",true);
        }
      }
    }
  })
}

$(document).on("click", ".quanity_checkbox","input[type=checkbox]", function(){
  if($(this).is(":checked")){
    let x = $(this).attr("id").slice(8);
    quanity_DAY_OF_WEEK.push(x);
    quanity_DAY_OF_WEEK.sort(function(a, b){return a - b});
  }else{
    let x = $(this).attr("id").slice(8);
    let index = quanity_DAY_OF_WEEK.indexOf(x);
    quanity_DAY_OF_WEEK.splice(index, 1);
  }
})

function save_setting_alert(){
  let postData = {
    start_time:return_null_if_empty($("#quanity_str_time").val()),
    end_time:return_null_if_empty($("#quanity_end_time").val()),
    estimate_quanity:return_null_if_empty($("#estimate_quanity").val()),
    repeat_alert:return_null_if_empty($("#repeat_alert").val()),
    day_of_week: return_null_if_empty(quanity_DAY_OF_WEEK.join())
  }
  httpAsync(postData,"/source/post/save_alert_setting","POST",function(result){
    alert(result);
  })
}
// tab cài đặt vượt lưu lượng và áp suất
let fl_pr_DAY_OF_WEEK = [];
function modify_time(x){
  if(x == null || x == ""){
    return "";
  }
  return 'value="'+x+'"';
}

// lấy dữ liệu cài đặt và hiển thị

function get_alert_config_pressure(){
  httpAsync(null,"/source/get/pressure_flowrate_alert_config","GET",function(result){
    $(".fl_pr_checkbox").prop("checked",false);
    fl_pr_DAY_OF_WEEK =[];
    if(result == null || result == ""){
      return false;
    }else{
      let data = JSON.parse(result);
      console.log(data)
      for(let i=1; i<7; i++){
        $("#press_alcf_id_"+i).attr("index",null);
        $("#plr_alcf_id_"+i).attr("index",null);
      }

      for(let i=0; i<data.length; i++){
        if(data[i].config_type == "APSUAT"){
          $("#press_alcf_str_"+data[i].index).val(data[i].start_time);
          $("#press_alcf_end_"+data[i].index).val(data[i].end_time);
          $("#press_alcf_low_"+data[i].index).val(data[i].min_value);
          $("#press_alcf_high_"+data[i].index).val(data[i].max_value);

          $("#press_alcf_id_"+data[i].index).attr("index",data[i].id);
        }else if(data[i].config_type == "OP"){
          $("#plr_alcf_str_"+data[i].index).val(data[i].start_time);
          $("#plr_alcf_end_"+data[i].index).val(data[i].end_time);
          $("#plr_alcf_low_"+data[i].index).val(data[i].min_value);
          $("#plr_alcf_high_"+data[i].index).val(data[i].max_value);

          $("#plr_alcf_id_"+data[i].index).attr("index",data[i].id);
        }
      }
      if(data.length > 0){
        fl_pr_DAY_OF_WEEK = data[0].day_of_week.split(",");
        for(let i=0; i < fl_pr_DAY_OF_WEEK.length; i++){
          $("#__"+fl_pr_DAY_OF_WEEK[i]).prop("checked",true);
        }
      }
    }
  })
}


// function get_setting_flowrate_pressure(){                   
//   httpAsync(null,"/source/get/setting_flowrate_pressure_setting","GET",function(result){
//     if(result == null || result ==""){
//       return false;
//     }else{
//       let data = JSON.parse(result);
//       let flowRate_setting = JSON.parse(data.flowrate_setting);
//       let pressure_setting = JSON.parse(data.pressure_setting);
//       $("#pressure_table_data").empty();
//       for(let i=0; i<pressure_setting.length; i++){
//         let x = '<tr>'
//                 + '<td>'+pressure_setting[i].index+'</td>'
//                 + '<td><input type="time" class="form-control" placeholder="HH:mm (Giờ:phút)" '+modify_time(pressure_setting[i].start)+'></td>'
//                 + '<td><input type="time" class="form-control" placeholder="HH:mm (Giờ:phút)" '+modify_time(pressure_setting[i].end)+'></td>'
//                 + '<td><input type="number" class="form-control" '+modify_time(pressure_setting[i].low_threshold_pressure)+'></td>'
//                 + '<td><input type="number" class="form-control" '+modify_time(pressure_setting[i].high_threshold_pressure)+'></td>'
//                 +'</tr>'
//         $("#pressure_table_data").append(x);
//       }
//       $("#flowRate_table_data").empty();
//       for(let i=0; i<flowRate_setting.length; i++){
//         let x = '<tr>'
//                 + '<td>'+flowRate_setting[i].index+'</td>'
//                 + '<td><input type="time" class="form-control" placeholder="HH:mm (Giờ:phút)" '+modify_time(flowRate_setting[i].start)+'></td>'
//                 + '<td><input type="time" class="form-control" placeholder="HH:mm (Giờ:phút)" '+modify_time(flowRate_setting[i].end)+'></td>'
//                 + '<td><input type="number" class="form-control" '+modify_time(flowRate_setting[i].low_threshold_flowRate)+'></td>'
//                 + '<td><input type="number" class="form-control" '+modify_time(flowRate_setting[i].high_threshold_flowRate)+'"></td>'
//                 +'</tr>'
//         $("#flowRate_table_data").append(x);
//       }

//       fl_pr_DAY_OF_WEEK = data.day_of_week.split(",");
//       $(".fl_pr_checkbox").prop("checked",false);
//       for(let i=0; i < fl_pr_DAY_OF_WEEK.length; i++){
//         $("#__"+fl_pr_DAY_OF_WEEK[i]).prop("checked",true);
//       }
//     }
//   })
// }

$(document).on("click", ".fl_pr_checkbox","input[type=checkbox]", function(){
  if($(this).is(":checked")){
    let x = $(this).attr("id").slice(2);
    fl_pr_DAY_OF_WEEK.push(x);
    fl_pr_DAY_OF_WEEK.sort(function(a, b){return a - b});
    console.log(fl_pr_DAY_OF_WEEK);
  }else{
    let x = $(this).attr("id").slice(2);
    let index = fl_pr_DAY_OF_WEEK.indexOf(x);
    fl_pr_DAY_OF_WEEK.splice(index, 1);
    // console.log(fl_pr_DAY_OF_WEEK);
  }
})

function save_setting_flowrate_pressure(){
  let plr_config = [];
  let press_config = [];
  for(let i=1; i<7; i++){
    plr_config.push({
      index: i,
      day_of_week: fl_pr_DAY_OF_WEEK.join(),
      config_type: "OP",
      if_exist: $("#plr_alcf_id_"+i).attr("index"),
      start_time: $("#plr_alcf_str_"+i).val(),
      end_time: $("#plr_alcf_end_"+i).val(),
      min_value: $("#plr_alcf_low_"+i).val(),
      max_value: $("#plr_alcf_high_"+i).val()
    });
    press_config.push({
      index: i,
      day_of_week: fl_pr_DAY_OF_WEEK.join(),
      config_type: "APSUAT",
      if_exist: $("#press_alcf_id_"+i).attr("index"),
      start_time: $("#press_alcf_str_"+i).val(),
      end_time: $("#press_alcf_end_"+i).val(),
      min_value: $("#press_alcf_low_"+i).val(),
      max_value: $("#press_alcf_high_"+i).val()
    });
  }
  let post_data = {
    plr_config: plr_config,
    press_config: press_config
  }
  console.log(post_data);
  httpAsync(post_data,"/source/save_pr_fl_setting","POST",function(result){
    alert(result);
    get_alert_config_pressure();
  })
}

// function save_setting_flowrate_pressure(){
//   let flowRate_setting = [];
//   let pressure_setting = [];
//   $("#flowRate_table_data").find("tr").each(function(){
//     let index = $(this).find("td:eq(0)").html();
//     let start = $(this).find("td:eq(1) input[type='time']").val();
//     let end = $(this).find("td:eq(2) input[type='time']").val();
//     let fl_low = $(this).find("td:eq(3) input[type='number']").val();
//     let fl_high = $(this).find("td:eq(4) input[type='number']").val();
//     flowRate_setting.push({
//       index: index,
//       start: start,
//       end: end,
//       low_threshold_flowRate: fl_low,
//       high_threshold_flowRate: fl_high
//     })
//   })
//   $("#pressure_table_data").find("tr").each(function(){
//     let index = $(this).find("td:eq(0)").html();
//     let start = $(this).find("td:eq(1) input[type='time']").val();
//     let end = $(this).find("td:eq(2) input[type='time']").val();
//     let pr_low = $(this).find("td:eq(3) input[type='number']").val();
//     let pr_high = $(this).find("td:eq(4) input[type='number']").val();
//     pressure_setting.push({
//       index: index,
//       start: start,
//       end: end,
//       low_threshold_pressure: pr_low,
//       high_threshold_pressure: pr_high
//     })
//   })
//   let post_data = {
//     pr: JSON.stringify(pressure_setting),
//     fl: JSON.stringify(flowRate_setting),
//     day_of_week: return_null_if_empty(fl_pr_DAY_OF_WEEK.join())
//   }
//   httpAsync(post_data,"/source/save_pr_fl_setting","POST",function(result){
//     alert(result);
//   })
// }


// tab cài đặt cảnh báo mực nước

let ms_DAY_OF_WEEK = [];

function get_compen_value(){
  httpAsync(null,"/source/get/compen_value","GET",function(result){
    if(result == null || result ==""){
      $("#compen_value").val(0);
    }else{
      let data = JSON.parse(result)
      $("#compen_value").val(data[0].compen_value);
    }
  })
}

function save_compensation(){
  httpAsync({compen_value: ($("#compen_value").val() == "") ? null : $("#compen_value").val()},"/source/save_compen_value","POST",function(result){
    alert(result);
  })
}

// function get_setting_measure_level(){                   // lấy dữ liệu cài đặt và hiển thị
//   httpAsync(null,"/source/get/measure_setting","GET",function(result){
//     if(result == null || result ==""){
//       return false;
//     }else{
//       let data = JSON.parse(result);
//       let measure_setting = JSON.parse(data.measure_setting);
//       $("#measure_level_table_data").empty();
//       for(let i=0; i<measure_setting.length; i++){
//         let x = '<tr>'
//                 + '<td>'+measure_setting[i].index+'</td>'
//                 + '<td><input type="time" class="form-control" placeholder="HH:mm (Giờ:phút)" '+modify_time(measure_setting[i].start)+'></td>'
//                 + '<td><input type="time" class="form-control" placeholder="HH:mm (Giờ:phút)" '+modify_time(measure_setting[i].end)+'></td>'
//                 + '<td><input type="number" class="form-control" '+modify_time(measure_setting[i].low_threshold_measure_level)+'></td>'
//                 + '<td><input type="number" class="form-control" '+modify_time(measure_setting[i].high_threshold_measure_level)+'></td>'
//                 +'</tr>'
//         $("#measure_level_table_data").append(x);
//       }
//       ms_DAY_OF_WEEK = data.day_of_week.split(",");
//       $(".measure_level_checkbox").prop("checked",false);
//       for(let i=0; i < ms_DAY_OF_WEEK.length; i++){
//         $("#ms__"+ms_DAY_OF_WEEK[i]).prop("checked",true);
//       }
//     }
//   })
// }

function get_setting_measure_level(){
  httpAsync(null,"/source/get/measure_setting","GET",function(result){
    $(".measure_level_checkbox").prop("checked",false);
    ms_DAY_OF_WEEK =[];
    if(result == null || result == ""){
      return false;
    }else{
      let data = JSON.parse(result);
      console.log(data)
      for(let i=1; i<7; i++){
        $("#ms_id_"+i).attr("index",null);
      }

      for(let i=0; i<data.length; i++){
          $("#ms_str_"+data[i].index).val(data[i].start_time);
          $("#ms_end_"+data[i].index).val(data[i].end_time);
          $("#ms_low_"+data[i].index).val(data[i].min_value);
          $("#ms_high_"+data[i].index).val(data[i].max_value);

          $("#ms_id_"+data[i].index).attr("index",data[i].id);
      }
      if(data.length > 0){
        ms_DAY_OF_WEEK = data[0].day_of_week.split(",");
        for(let i=0; i < ms_DAY_OF_WEEK.length; i++){
          $("#ms__"+ms_DAY_OF_WEEK[i]).prop("checked",true);
        }
      }
    }
  })
}

$(document).on("click", ".measure_level_checkbox","input[type=checkbox]", function(){
  if($(this).is(":checked")){
    let x = $(this).attr("id").slice(4);
    ms_DAY_OF_WEEK.push(x);
    ms_DAY_OF_WEEK.sort(function(a, b){return a - b});
  }else{
    let x = $(this).attr("id").slice(4);
    let index = ms_DAY_OF_WEEK.indexOf(x);
    ms_DAY_OF_WEEK.splice(index, 1);
  }
})



// function save_setting_measure_level(){
//   let measure_level_setting = [];
//   $("#measure_level_table_data").find("tr").each(function(){
//     let index = $(this).find("td:eq(0)").html();
//     let start = $(this).find("td:eq(1) input[type='time']").val();
//     let end = $(this).find("td:eq(2) input[type='time']").val();
//     let measure_level_low = $(this).find("td:eq(3) input[type='number']").val();
//     let measure_level_high = $(this).find("td:eq(4) input[type='number']").val();
//     measure_level_setting.push({
//       index: index,
//       start: start,
//       end: end,
//       low_threshold_measure_level: measure_level_low,
//       high_threshold_measure_level: measure_level_high
//     })
//   })
//   let post_data = {
//     measure_level: JSON.stringify(measure_level_setting),
//     day_of_week: ms_DAY_OF_WEEK.join()
//   }
//   httpAsync(post_data,"/source/save_measure_level_setting","POST",function(result){
//     alert(result);
//   })
// }
function save_setting_measure_level(){
  let ms_config = [];
  for(let i=1; i<7; i++){
    ms_config.push({
      index: i,
      day_of_week: ms_DAY_OF_WEEK.join(),
      config_type: "MN",
      if_exist: $("#ms_id_"+i).attr("index"),
      start_time: $("#ms_str_"+i).val(),
      end_time: $("#ms_end_"+i).val(),
      min_value: $("#ms_low_"+i).val(),
      max_value: $("#ms_high_"+i).val()
    });
  }
  let post_data = {
    ms_config: ms_config,
  }
  console.log(post_data);
  httpAsync(post_data,"/source/save_measure_level_setting","POST",function(result){
    alert(result);
    get_setting_measure_level();
  })
}

// cài đặt áp suất
function get_setting_pressure(){
  httpAsync(null,"/source/get/pressure_setting","GET",function(result){
    if(result !="" || result != null){
      let data = JSON.parse(result);
      if(data.bar_to_met == 1){
        $("#show_bar_to_m").prop("checked",true)
      }else{
        $("#show_bar_to_m").prop("checked",false)

      }
      $("#conver_factor").val(data.conver_factor);
      $("#compen_factor").val(data.compen_factor);
    }
  })
}

function save_setting_conversion(){
  let post_data = {
    bar_to_met: ($('#show_bar_to_m').is(":checked")) ? 1 : 0,
    conver_factor: ($("#conver_factor").val() == '' || $("#conver_factor").val() == null) ? 1 : $("#conver_factor").val(),
    compen_factor: ($("#compen_factor").val() == '' || $("#compen_factor").val() == null) ? 0 : $("#compen_factor").val(),
  }
  httpAsync(post_data,"/source/post/pressure_setting","POST",function(result){
    alert(result);
  })
}


//reset khi đóng modal
$(document).ready(function(){
  $('#DetalEQ').on('hidden.bs.modal', function () {

      $(this).find('form').trigger('reset');
      $(this).find('select').prop('selectedIndex',0);
      $(this).find('input').not("#static_group").val("");
      if(chart2 != null){
          chart2.dispose();
      }
      $('a[data-target="#instant_value_tab"]').tab('show');
      LOADED_DATA =false; LOADED_INFO = false; LOADED_INS = false; LOADED_LOCATION = false; 
      LOADED_SET_ALERT = false; LOADED_SET= false; LOADED_VIS = false; LOADED_WARN = false;
      LOADED_SET_FLOWRATE_PRESSURE = false; LOADED_SET_MEASURE_LEVEL = false; LOADED_SET_PRESSURE = false;

      TOVISUAL = (new Date()).getTime();//thời gian bắt đầu của biểu đồ tab visual
      FROMVISUAL = TOVISUAL - 3600000*24 ;//thời gian kết thúc của biểu đồ tab visual
      TO_DATA = new Date().getTime();  // thời gian kết thúc
      FROM_DATA = TO_DATA -  3600000*24 // thời gian bắt đầu
      PARA_LIST = ["pressure", "flowRate", "quanity"]
      TO_ALERT_LIST = (new Date()).getTime();
      FROM_ALERT_LIST = TO_ALERT_LIST - 7 * 24 * 3600000;
      $("#picktimeAlert").css("display","none");
      $("#pick_time_data").css("display","none");
      $("#pick_time_chart").css("display","none");
      MOMENT = "raw";TYPE ="line";maxlegendChart = "";
      $("#picktimeAlert").data("daterangepicker").setStartDate(moment().startOf('hour'));
      $("#picktimeAlert").data("daterangepicker").setEndDate(moment().startOf('hour'));
      $("#pick_time_data").data("daterangepicker").setStartDate(moment().startOf('hour'));
      $("#pick_time_data").data("daterangepicker").setEndDate(moment().startOf('hour'));
      $("#pick_time_chart").data("daterangepicker").setStartDate(moment().startOf('hour'));
      $("#pick_time_chart").data("daterangepicker").setEndDate(moment().startOf('hour'));
      // ARR_DAYOFWEEK = [];
      $(".DOW").prop("checked",false);
      $(".info_group_select").prop("checked",false);
      SAVE_GROUP = [];
  })
})

// xử lý event khi chuyển tab mới bắt đầu load dữ liệu, quay lại tab đã load thì ko load nữa
var LOADED_DATA =false, LOADED_INFO = false, LOADED_INS = false, LOADED_LOCATION = false, LOADED_SET_MEASURE_LEVEL = false,
LOADED_SET_ALERT = false, LOADED_SET= false, LOADED_VIS = false, LOADED_WARN = false, LOADED_SET_PRESSURE = false, LOADED_SET_FLOWRATE_PRESSURE = false;
$(document).ready(function(){
    $('a[data-target="#instant_value_tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('a[data-target="#detail_data_tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        if(!LOADED_DATA){
            get_data(ID)
            LOADED_DATA=true;
        }
    });
    $('a[data-target="#visualize_tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        if(!LOADED_VIS){
          showChart(ID,FROMVISUAL,TOVISUAL,TYPE,true,MOMENT)
            LOADED_VIS=true;
        }
    });
    $('a[data-target="#warning_tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        if(!LOADED_WARN){
          // setupfilter()
          getAlertAndRenderTable();
          LOADED_WARN = true;
        }
    });
    $('a[data-target="#location_tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        if(!LOADED_LOCATION){
          get_location();
            LOADED_LOCATION = true;
        }
    });
    $('a[data-target="#information_tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        if(!LOADED_INFO){
          set_select_group_option();
            LOADED_INFO = true;
        }
    });
    $('a[data-target="#setting_tab"]').click(function (e) {
        e.preventDefault();
        if(!LOADED_SET){
          get_setting();
            LOADED_SET = true;
        }
    });
    $('a[data-target="#setting_alert_tab"]').click(function (e) {
        e.preventDefault();
        if(!LOADED_SET_ALERT){
          get_setting_alert()
            LOADED_SET_ALERT = true;
        }
    });
    $('a[data-target="#setting_flowrate_pressure_tab"]').click(function (e) {
      e.preventDefault();
      if(!LOADED_SET_FLOWRATE_PRESSURE){
        // get_setting_flowrate_pressure()
        get_alert_config_pressure()
        LOADED_SET_FLOWRATE_PRESSURE = true;
      }
  });
  $('a[data-target="#setting_pressure_level_tab"]').click(function (e) {
    e.preventDefault();
    if(!LOADED_SET_PRESSURE){
      get_setting_pressure()
      LOADED_SET_PRESSURE = true;
    }
});
    $('a[data-target="#setting_measure_level_tab"]').click(function (e) {
      e.preventDefault();
      if(!LOADED_SET_MEASURE_LEVEL){
        get_setting_measure_level();
        get_compen_value();
        LOADED_SET_MEASURE_LEVEL = true;
      }
  });
})

// set giao dien dropdow checkbox
$(".checkbox-menu").on("change", "input[type='checkbox']", function() {
  $(this).closest("li").toggleClass("active", this.checked);
});

$(document).on('click', '.allow-focus', function (e) {
 e.stopPropagation();
});





// inverter tab

