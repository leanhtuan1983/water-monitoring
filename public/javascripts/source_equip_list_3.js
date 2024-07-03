// sidebar and responsive
$(document).ready(function(){
  check_width_hide();
  $(window).resize(function(){
    check_width_hide();
  })
})

function check_width_hide(){
  var windowWidth = $("#general_info1").width();
  if (windowWidth < 960) {
      // console.log("Trình duyệt có độ rộng nhỏ hơn hoặc bằng 767px.");
      // Thực hiện các hành động tương ứng cho độ rộng nhỏ hơn hoặc bằng 767px ở đây
    $(".respon").css("display","none");
  } else {
    $(".respon").css("display","block");

      // console.log("Trình duyệt có độ rộng lớn hơn 767px.");
      // Thực hiện các hành động tương ứng cho độ rộng lớn hơn 767px ở đây
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  // const content = document.getElementsByClassName('page_');
  const sidebarListItems = document.querySelectorAll('.sidebar-list li');

  if (sidebar.style.width === '280px' || window.getComputedStyle(sidebar).width === '280px') {
  sidebar.style.width = '0';
  //   content.style.marginLeft = '0';
  $(".page_").css('margin-left','0px')
  sidebarListItems.forEach(item => item.style.display = 'none'); // Ẩn các thẻ list khi side bar ẩn
  sidebar.classList.remove('overlay'); // Gỡ bỏ lớp overlay khi side bar ẩn
  } else {
  sidebar.style.width = '280px';
  //   content.style.marginLeft = '280px';.
  $(".page_").css('margin-left','280px')

  sidebarListItems.forEach(item => item.style.display = 'block'); // Hiện các thẻ list khi side bar hiện
  sidebar.classList.add('overlay'); // Thêm lớp overlay khi side bar hiện
  }
  // check_width_hide()

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
        }else{
          alert("ErrorCode: "+xmlHttp.status + "\n" + "ErrorMess: " + xmlHttp.responseText);
          callback(null);
          return false;
        }
      }
    }
  }

var lost_color = "#f02222"
var remain_color = "#1584b0"
  


function return_null_if_empty(x){
  if(x == "") return null;
  return x;
}

function show_if_null(x){
  if(x === "" || x === null) 
    return "-";
  return x;
}

function return_num(st){   //nếu giá trị trả về quy đc ra số thì là số, còn ko là null
  if(Number.isNaN(Number(st)) || st == null ){
    return null;
  }else{
  return Number(st);
  }
}

function return_num_bar(st){   //nếu giá trị trả về quy đc ra số thì là số, còn ko là 0
  if(Number.isNaN(Number(st)) || st == null ){
    return 0;
  }else{
  return Number(st);
  }
}

function stringtonum(st){   //nếu giá trị trả về quy đc ra số thì là số, còn ko là null
  if(Number.isNaN(Number(st)) || st == null ){
    return null;
  }else{
  return Number(st);
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

function return_date_format_ddmmyyhhmmss_2(dateObj){
  if(dateObj == "" || dateObj == null) return "-";
  let date = new Date(dateObj);
  let x = pad(date.getDate())         + '/' +
  pad(date.getMonth() + 1)  + '/' + '20' +
  pad(date.getFullYear())       + ' ' +
  pad(date.getHours())      + ':' +
  pad(date.getMinutes())    + ':' +
  pad(date.getSeconds());
  return x;
}

function return_day_format_ddmmyyhhmmss(dateObj){
  if(dateObj == "" || dateObj == null) return "-";
  let date = new Date(dateObj);
  let x = pad(date.getDate())         + '/' +
  pad(date.getMonth() + 1)  + '/' + '20' +
  pad(date.getFullYear())       + ' '
  return x;
}

function return_max_time(arr){
  let index = 0;
  for(let i=0; i<arr.length; i++){
    if(arr[i].meter_time){
      if(new Date(arr[i].meter_time).getTime() > index){
        index = new Date(arr[i].meter_time).getTime()
      }
    }
  }
  if(index > 0)
  return new Date(index);
  return null;
}

function returnSQLDateFormat2Line(dateObj){
  if(dateObj == "" || dateObj == null) return "-";
  let date = new Date(dateObj);
  let x = date.getFullYear()         + '-' +
  pad(date.getMonth() + 1)  + '-' +
  pad(date.getDate())       + '\n' +
  pad(date.getHours())      + ':' +
  pad(date.getMinutes())    + ':' +
  pad(date.getSeconds());
  return x;
}


//Ngôn ngữ mặc định
let LANG ="vi";
let NODE_ID_fist_load = -1;
//Lấy ngôn ngữ
window.onload = function(){
  httpAsync(null, "/source/get/lang", "GET", function (result){
    let data = JSON.parse(result);
    LANG = data.lang;
  })
  //load màn 1
  load_level_1_data(NODE_ID_fist_load);
}

// Load jstree
$(document).ready(function(){
  $('#jstree_meter').jstree({"core":{
    //  "check_callback": true,
     'data':{
      'url': "/get/load_tree?lazy",
      "data": function(node){
        return {'id': node.id}
      },
     },
    "animation": 0
  }
  })
})

$(document).ready(function(){
  $("#jstree_meter").on("after_open.jstree", function (e, data) { $("#sidebar").css("overflow-x",'auto'); $("#sidebar").addClass("overlay") });
  $("#jstree_meter").on("after_close.jstree", function (e, data) { $("#sidebar").css("overflow-x",'auto') });
})


var DATA_LOST_OUTPUT_GROUP_ID = null;
var DATA_LOST_OUTPUT_NAME = null;
var DATA_LOST_OUTPUT_DEPTH = 0;
var CONTAIN_METER = 0;
$(document).ready(function(){
  $('#jstree_meter').on("changed.jstree", function (e, data) {
    if(data.action == "select_node"){
      let depth = null, have_child = null, node_id = null;
      let meter_id = null, serial_sensor = null, contain_meter = null;
      if(data.node.original.depth != null){
        depth = data.node.original.depth;
      }
      if(data.node.original.have_child != null){
        have_child = data.node.original.have_child;
      }
      if(data.node.original.contain_meter != null){
        contain_meter = data.node.original.contain_meter;
      }
      if(data.node.id){
        node_id = data.node.id;
      }
      if(data.node.original.meter_id){
        meter_id = data.node.original.meter_id;
      }
      if(data.node.original.serial_sensor){
        serial_sensor = data.node.original.serial_sensor;
      }
      if(depth == 0){
        NODE_ID_fist_load = node_id;
        DATA_LOST_OUTPUT_DEPTH = depth;
        show_level_1_screen(node_id)
      }else if(depth == 1 && have_child == 1){
        CONTAIN_METER = contain_meter;
        DATA_LOST_OUTPUT_DEPTH = depth;
        DATA_LOST_OUTPUT_GROUP_ID = node_id;
        DATA_LOST_OUTPUT_NAME = data.node.original.name;
        if(CONTAIN_METER == 0){
          load_level_5_data(node_id)
        }else{
          load_level_2_data(node_id);
        }
      }else if(depth == 2 && have_child == 1){
        CONTAIN_METER = contain_meter;
        DATA_LOST_OUTPUT_DEPTH = depth;
        DATA_LOST_OUTPUT_GROUP_ID = node_id;
        DATA_LOST_OUTPUT_NAME = data.node.original.name;
        if(CONTAIN_METER == 0){
          load_level_5_data(node_id)
        }else{
          load_level_3_data(node_id)
        }
      }else{
        // open_modal(meter_id,serial_sensor,node_id)
        CONTAIN_METER = contain_meter;
        DATA_LOST_OUTPUT_DEPTH = depth;
        DATA_LOST_OUTPUT_GROUP_ID = node_id;
        DATA_LOST_OUTPUT_NAME = data.node.original.name;
        if(CONTAIN_METER == 0){
          load_level_5_data(node_id)
        }else{
          load_level_4_data(node_id)
        }
      }  

    }
    // if(data.node.id == "VD"){
    //   let name = data.node.text;
    //   show_level_2_screen();
    //   render_main_pie_chart_lv_2(DATA,name);
    //   render_line_chart_lv_2(name);
    // }else if(data.node.id == "VD1"){
    //   show_level_3_screen();
    // }
  });
})

function refresh_level_3(){
  if(CONTAIN_METER == 0){
    load_level_5_data(DATA_LOST_OUTPUT_GROUP_ID)
  }else{
    load_level_3_data(DATA_LOST_OUTPUT_GROUP_ID)
  }
}

function refresh_level_2(){
  if(CONTAIN_METER == 0){
    load_level_5_data(DATA_LOST_OUTPUT_GROUP_ID)
  }else{
    load_level_2_data(DATA_LOST_OUTPUT_GROUP_ID)
  }
}
// biểu đồ đường thất thoát
var DATA_LOSTOUTPUT_CHART = null;
var DATA_LOSTOUTPUT_CHART_TO = new Date().getTime();
var DATA_LOSTOUTPUT_CHART_FROM = DATA_LOSTOUTPUT_CHART_TO - 24*60*60*1000;

$(function() {
  $('#pick_time_datalostoutput_chart_from').daterangepicker(
    {
      singleDatePicker: true,
       showDropdowns: true,
       showWeekNumbers: true,
       timePicker: true,
       timePickerIncrement: 1,
       timePicker24Hour: true,
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
           format: 'DD/MM/YYYY H:mm'
       }
    },
      function(start, end) {
        DATA_LOSTOUTPUT_CHART_FROM = new Date(end).getTime();   
    }
 );
//  $('#reportrange span').html(moment().subtract(29, 'day').format('D MMMM YYYY') + ' - ' + moment().format('D MMMM YYYY'));
});

$(function() {
  $('#pick_time_datalostoutput_chart_to').daterangepicker(
    {
      singleDatePicker: true,
       showDropdowns: true,
       showWeekNumbers: true,
       timePicker: true,
       timePickerIncrement: 1,
       timePicker24Hour: true,
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
           format: 'DD/MM/YYYY H:mm'
       }
    },
    function(start, end) {
      DATA_LOSTOUTPUT_CHART_TO = new Date(end).getTime();   
    }
 );
//  $('#reportrange span').html(moment().subtract(29, 'day').format('D MMMM YYYY') + ' - ' + moment().format('D MMMM YYYY'));
});


function data_lost_output_line_chart(){
  $("#pick_time_datalostoutput_chart_to").data("daterangepicker").setStartDate(moment().startOf('minute'));
  $("#pick_time_datalostoutput_chart_to").data("daterangepicker").setEndDate(moment().startOf('minute'));
  $("#pick_time_datalostoutput_chart_from").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
  $("#pick_time_datalostoutput_chart_from").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
  DATA_LOSTOUTPUT_CHART_TO = new Date().getTime();
  DATA_LOSTOUTPUT_CHART_FROM = DATA_LOSTOUTPUT_CHART_TO - 24*60*60*1000;
  if(DATA_LOSTOUTPUT_CHART){
    DATA_LOSTOUTPUT_CHART.dispose();
    delete DATA_LOSTOUTPUT_CHART;
  }
  $("#data_lost_output_name").html(DATA_LOST_OUTPUT_NAME);
  httpAsync(null,"/get/data_lost_output_chart_data?fr="+DATA_LOSTOUTPUT_CHART_FROM+"&to="+DATA_LOSTOUTPUT_CHART_TO+"&node_id="+DATA_LOST_OUTPUT_GROUP_ID,"GET",function(result){
    let parse_data = JSON.parse(result);
    let data = [];
    if(parse_data.err_code == 1){
      alert(parse_data.message)
    }else{
      data = parse_data.data;
      render_datalostoutput_chart(data)
    }
  })
  $("#data_lost_output_modal").modal("show");
}

function render_datalostoutput_chart(data){
  let data_chart = [];
  for(let i=0; i<data.length; i++){
    data_chart.push({
      meter_time: new Date(data[i].meter_time),
      loss: ((Number(data[i].sum_nhanh) > Number(data[i].sum_tong)) ? 0 : (Number(data[i].sum_tong)-Number(data[i].sum_nhanh))),
      total: Number(data[i].sum_tong) 
    })
  }
let thickness = 3;
am4core.useTheme(am4themes_animated);
if(DATA_LOSTOUTPUT_CHART){
  DATA_LOSTOUTPUT_CHART.dispose();
  delete DATA_LOSTOUTPUT_CHART;
}
DATA_LOSTOUTPUT_CHART = am4core.create("data_lost_output_line_chart", am4charts.XYChart);
DATA_LOSTOUTPUT_CHART.scrollbarX = new am4core.Scrollbar();
DATA_LOSTOUTPUT_CHART.data = data_chart;
DATA_LOSTOUTPUT_CHART.logo.disabled = true;
let dateAxis = DATA_LOSTOUTPUT_CHART.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 60;
dateAxis.startLocation = 0.5;
dateAxis.endLocation = 0.5;
dateAxis.renderer.grid.template.location = 0;
dateAxis.renderer.grid.template.disabled = true;
dateAxis.renderer.fullWidthTooltip = true;
// dateAxis.dateFormats.setKey("minutes", "HH:mm");

dateAxis.dateFormats.setKey("hour", "HH:mm");
dateAxis.dateFormats.setKey("day", "dd/MM");
dateAxis.periodChangeDateFormats.setKey("hour", "dd/MM"); 
dateAxis.dateFormats.setKey("month", "MM/yyyy");
dateAxis.periodChangeDateFormats.setKey("day", "MM/yyyy");

DATA_LOSTOUTPUT_CHART.cursor = new am4charts.XYCursor();
DATA_LOSTOUTPUT_CHART.cursor.fullWidthLineX = true;
DATA_LOSTOUTPUT_CHART.cursor.xAxis = dateAxis;
DATA_LOSTOUTPUT_CHART.cursor.lineX.strokeWidth = 0;
DATA_LOSTOUTPUT_CHART.cursor.lineX.fill = am4core.color("#000");
DATA_LOSTOUTPUT_CHART.cursor.lineX.fillOpacity = 0.1;
DATA_LOSTOUTPUT_CHART.legend = new am4charts.Legend();

let title = DATA_LOSTOUTPUT_CHART.titles.create();
title.text = "Biểu đồ thất thoát "+ DATA_LOST_OUTPUT_NAME;
title.fontSize = 20;
title.marginTop = 15;
title.marginBottom = 20;

var m3 = DATA_LOSTOUTPUT_CHART.yAxes.push(new am4charts.ValueAxis());
m3.tooltip.disabled = false;
m3.renderer.ticks.template.disabled = true;
m3.renderer.axisFills.template.disabled = true;
m3.renderer.line.strokeOpacity = 0.5;
m3.renderer.line.strokeWidth = 1;
m3.title.text ="m3"
m3.renderer.opposite = false;
m3.extraMin = 0.1;
m3.extraMax = 0.1; 

 
var series;
series = DATA_LOSTOUTPUT_CHART.series.push(new am4charts.LineSeries());
series.yAxis = m3;
series.dataFields.valueY = "total";
series.dataFields.dateX = "meter_time";
series.title = "Sản lượng";
series.strokeWidth = thickness;
series.tensionX = 1;
series.showOnInit = true;
series.legendSettings.labelText = "Sản lượng (m3)";
series.tooltipText = "Sản lượng" + ": {valueY} " + "(m3)";
series.name = "Sản lượng"
series.tooltip.pointerOrientation = "horizontal";
series.fill = am4core.color(remain_color);
series.stroke = am4core.color(remain_color);
series.fillOpacity = 0.8;

var series_2;
  series_2 = DATA_LOSTOUTPUT_CHART.series.push(new am4charts.LineSeries());
  series_2.yAxis = m3;
  series_2.dataFields.valueY = "loss";
  series_2.dataFields.dateX = "meter_time";
  series_2.title = "SL thất thoát";
  series_2.strokeWidth = thickness;
  series_2.tensionX = 1;
  series_2.showOnInit = true;
  series_2.legendSettings.labelText = "SL thất thoát (m3)";
  series_2.tooltipText = "SL thất thoát" + ": {valueY} " + "(m3)";
  series_2.name = "SL thất thoát"
  series_2.tooltip.pointerOrientation = "horizontal";
  series_2.fill = am4core.color(lost_color);
  series_2.stroke = am4core.color(lost_color);
  series_2.fillOpacity = 0.8;
}

function get_and_load_datalostoutput_chart_data(){
  httpAsync(null,"/get/data_lost_output_chart_data?fr="+DATA_LOSTOUTPUT_CHART_FROM+"&to="+DATA_LOSTOUTPUT_CHART_TO+"&node_id="+DATA_LOST_OUTPUT_GROUP_ID,"GET",function(result){
    let parse_data = JSON.parse(result);
    let data = [];
    if(parse_data.err_code == 1){
      alert(parse_data.message)
    }else{
      data = parse_data.data;
      render_datalostoutput_chart(data)
    }
  })
}

function load_genera_data(node_id,id_div){
  httpAsync(null,"/get/genera_data?node_id="+node_id,"GET",function(result){
    let parse_data = JSON.parse(result);
    let status_meter = parse_data.data.status_meter
    if(DATA_LOST_OUTPUT_DEPTH == 0){
      let arr = status_meter.split("/");
      let str = (Number(arr[0])-1) + "/" + (Number(arr[1])-1);
      $("#"+id_div).html(str)
    }else{
      $("#"+id_div).html(status_meter)
    }
  })
}

function load_mess_rate(node_id,id_div){
  $("#"+id_div).html("...")
  httpAsync(null,"/get/mess_rate?node_id="+node_id+"&depth="+DATA_LOST_OUTPUT_DEPTH,"GET",function(result){
    let parse_data = JSON.parse(result);
    let data = parse_data.data.mess_rate;
    let meter_rate_count = 0;
    let meter_rate_sum = 0;
    for(let i=0; i<data.length;i+=2){
      meter_rate_sum += Number(data[i][0].count_item_data);
      meter_rate_count += Number(data[i][0].sum_idkey);
    }
    if(meter_rate_count == 0 || meter_rate_sum == 0){
      $("#"+id_div).html("0 %")
    }else{
      $("#"+id_div).html(((meter_rate_count/meter_rate_sum)*100).toFixed(1) + " %")
    }
    // let mess_rate = parse_data.data.mess_rate

  })
}

//Loại biểu đồ hiển thị màn 1
var TYPE_LEVEL_1_children_CHART = "pie";
var DATA_LEVEL_1 = null;
var DATA_LEVEL_1_NAME = "";
// var LV1_MAIN_LINE_CHART_TO_DATA = 0;  // thời gian kết thúc
// var LV1_MAIN_LINE_CHART_FROM_DATA = 0 // thời gian bắt đầu
function load_level_1_data(node_id){
  $("#time_chart_level_1").val("");
  // $("#pick_lv1_main_pie_chart_time_data").data("daterangepicker").setStartDate(moment().startOf('hour'));
  // $("#pick_lv1_main_pie_chart_time_data").data("daterangepicker").setEndDate(moment().startOf('hour'));
  $("#pick_lv1_main_pie_chart_time_data").css("display","none");
  $("#pick_lv1_main_pie_chart_time_data_container").css("display","none");
  LV1_MAIN_PIE_CHART_TO_DATA = 0;
  LV1_MAIN_PIE_CHART_FROM_DATA = 0;
  $("#select_lv1_main_pie_chart_time_data").prop('selectedIndex',0);

  load_genera_data(node_id,"meter_status_lv_1");
  load_mess_rate(node_id,"mess_rate_lv_1")
  load_level_1_line_chart(node_id);
  load_level_1_pie_chart(node_id);
  get_level_1_main_map_data(node_id);
  // httpAsync(null,"/get/level_1_data?group_id="+node_id+"&fr="+LV1_MAIN_LINE_CHART_FROM_DATA+"&to="+LV1_MAIN_LINE_CHART_TO_DATA,"GET",function(result){
  //   let data = JSON.parse(result).data;
  //   let main_lost = data.main_lost;
  //   let child_lost = data.child_lost
  //   let name = data.name;
  //   DATA_LEVEL_1 = child_lost;
  //   DATA_LEVEL_1_NAME = name;
  //   if(main_lost.length > 0){
  //     //Biểu đồ tròn tổng thất thoát cả hệ thống
  //     render_level_1_main_pie_chart(main_lost,name);
  //     //Biểu đồ con thất thoát (Tròn hoặc cột)
  //     render_level_1_children_chart(TYPE_LEVEL_1_children_CHART,child_lost,name);
  //     //Biểu đồ đường sản lượng tổng
  //     get_level_1_main_line_chart_data(node_id);
  //     // show_level_2_screen();
  //     //render bản đồ
  //     get_level_1_main_map_data(node_id);
  //     if(LV1_MAIN_LINE_CHART_FROM_DATA == 0 && LV1_MAIN_LINE_CHART_TO_DATA == 0){
  //       $("#time_chart_level_1").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(return_max_time(main_lost)))
  //     }else{
  //       $("#time_chart_level_1").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(LV1_MAIN_LINE_CHART_FROM_DATA) + " - " + return_date_format_ddmmyyhhmmss_2(LV1_MAIN_LINE_CHART_TO_DATA))
  //     }
  //   }else{
  //     if(LEVEL_1_MAIN_PIE_CHART){
  //       LEVEL_1_MAIN_PIE_CHART.dispose();
  //       delete LEVEL_1_MAIN_PIE_CHART;
  //     }
  //     $("#main_pie_chart").empty();
  //     render_level_1_children_chart(TYPE_LEVEL_1_children_CHART,child_lost,name);
  //     get_level_1_main_line_chart_data(node_id);
  //     get_level_1_main_map_data(node_id);
  //   }
  // })
}

function load_level_1_pie_chart(node_id){
  httpAsync(null,"/get/level_1_data?group_id="+node_id+"&fr="+LV1_MAIN_PIE_CHART_FROM_DATA+"&to="+LV1_MAIN_PIE_CHART_TO_DATA,"GET",function(result){
    let data = JSON.parse(result).data;
    let main_lost = data.main_lost;
    let child_lost = data.child_lost
    let name = data.name;
    DATA_LEVEL_1 = child_lost;
    console.log(child_lost,LV1_MAIN_PIE_CHART_FROM_DATA)
    DATA_LEVEL_1_NAME = name;
    if(main_lost.length > 0){
      //Biểu đồ tròn tổng thất thoát cả hệ thống
      render_level_1_main_pie_chart(main_lost,name);
      //Biểu đồ con thất thoát (Tròn hoặc cột)
      render_level_1_children_chart(TYPE_LEVEL_1_children_CHART,child_lost,name);
      if(LV1_MAIN_PIE_CHART_FROM_DATA == 0 && LV1_MAIN_PIE_CHART_TO_DATA == 0){
        $("#time_chart_level_1").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(return_max_time(main_lost)))
      }else if(LV1_MAIN_PIE_CHART_FROM_DATA == -1 && LV1_MAIN_PIE_CHART_TO_DATA == -1){
        $("#time_chart_level_1").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(new Date().getTime() - 24*3600000) + " - " + return_date_format_ddmmyyhhmmss_2(new Date().getTime()))
      }else if(LV1_MAIN_PIE_CHART_FROM_DATA == -2 && LV1_MAIN_PIE_CHART_TO_DATA == -2){
        $("#time_chart_level_1").val("Thời điểm: "+return_day_format_ddmmyyhhmmss(new Date().getTime() - 7*24*3600000) + " - " + return_day_format_ddmmyyhhmmss(new Date().getTime()))
      }else if(LV1_MAIN_PIE_CHART_FROM_DATA == -3 && LV1_MAIN_PIE_CHART_TO_DATA == -3){
        $("#time_chart_level_1").val("Thời điểm: "+return_day_format_ddmmyyhhmmss(new Date().getTime() - 30*24*3600000) + " - " + return_day_format_ddmmyyhhmmss(new Date().getTime()))
      }else{
        $("#time_chart_level_1").val("Thời điểm: "+return_day_format_ddmmyyhhmmss(LV1_MAIN_PIE_CHART_FROM_DATA) + " - " + return_day_format_ddmmyyhhmmss(LV1_MAIN_PIE_CHART_TO_DATA))
      }
    }else{
      if(LEVEL_1_MAIN_PIE_CHART){
        LEVEL_1_MAIN_PIE_CHART.dispose();
        delete LEVEL_1_MAIN_PIE_CHART;
      }
      $("#main_pie_chart").empty();
      render_level_1_children_chart(TYPE_LEVEL_1_children_CHART,child_lost,name);
    }
  })
}

function load_level_1_line_chart(node_id){
  httpAsync(null,"/get/data_lost_output_level_1?fr="+LV1_MAIN_PIE_CHART_FROM_DATA+"&to="+LV1_MAIN_PIE_CHART_TO_DATA+"&group_id="+node_id,"GET",function(result){
    let parse_data = JSON.parse(result);
    let chart_data = parse_data.data;
    render_level_1_main_line_chart(chart_data)
  })
}


var LEVEL_1_MAIN_PIE_CHART = null;
function render_level_1_main_pie_chart(data, name){
  let title_name = name;
  let arr_data = data;
  let total = 0;
  let remain = 0;
  let no_data = 0;
  for(let i=0; i<arr_data.length; i++){
    if(arr_data[i].sum_nhanh > arr_data[i].sum_tong){
      arr_data[i].sum_nhanh = arr_data[i].sum_tong;
    }
    total += arr_data[i].sum_tong;
    remain += arr_data[i].sum_nhanh;
  }
  $("#general_total_lv_1").html(Number(total.toFixed(3)) + "(m³)")
  $("#general_lost_lv_1").html(Number(return_that_thoat(remain,total).toFixed(3)) + "(m³)")

  if(remain == 0 && total  == 0){
    remain = 100;
    total = 100;
    no_data = 1;
  }
  am4core.useTheme(am4themes_animated);
  if(LEVEL_1_MAIN_PIE_CHART){
    LEVEL_1_MAIN_PIE_CHART.dispose();
    delete LEVEL_1_MAIN_PIE_CHART;
  }
  LEVEL_1_MAIN_PIE_CHART = am4core.create("main_pie_chart", am4charts.PieChart3D);
  LEVEL_1_MAIN_PIE_CHART.hiddenState.properties.opacity = 0;
  LEVEL_1_MAIN_PIE_CHART.data = [
    {
      category: "SL thất thoát",
      value: return_that_thoat(remain,total) 
    },
    {
      category: "SL tiêu thụ",
      value: remain
    }
  ]
  LEVEL_1_MAIN_PIE_CHART.innerRadius = am4core.percent(0);
  LEVEL_1_MAIN_PIE_CHART.depth = 15;
  LEVEL_1_MAIN_PIE_CHART.legend = new am4charts.Legend();
  LEVEL_1_MAIN_PIE_CHART.legend.position = "bottom";
  LEVEL_1_MAIN_PIE_CHART.radius = am4core.percent(75);
  LEVEL_1_MAIN_PIE_CHART.logo.disabled = true;
  // responsivie biểu đồ theo container
  LEVEL_1_MAIN_PIE_CHART.responsive.enabled = true;
  // ẩn phần trăm ở chú thích
  LEVEL_1_MAIN_PIE_CHART.legend.valueLabels.template.disabled = true;

  let series = LEVEL_1_MAIN_PIE_CHART.series.push(new am4charts.PieSeries3D());
  series.dataFields.value = "value";
  series.dataFields.category = "category";
  series.labels.template.maxWidth = 150;
  series.labels.template.wrap = true;
  // series.alignLabels = false;
  series.labels.template.fontSize = 15;
  if(no_data == 1){
    series.slices.template.tooltipText = "{category}: {value} (%) (0)";
    // series.labels.template.text = "{category}: {value} (%)";
    // series.legendSettings.labelText = '{category}';
    // series.legendSettings.valueText = '{value}';
  }
  // series.slices.template.cornerRadius = 5;
  // series.colors.step = 3;
  series.colors.list = [
    am4core.color(lost_color),
    am4core.color(remain_color),
  ];
  let title = LEVEL_1_MAIN_PIE_CHART.titles.create();
  title.text = title_name;
  title.fontSize = 25;
  title.marginTop = 13;
  title.marginBottom = 7;
  title.fontWeight = "bold";
}

function render_level_1_children_chart(type,data,name){
  let arr_data = data;
  if(type == "pie"){
    $("#level_1_children_pie_chart_container").empty();
    $("#level_1_children_pie_chart_container").show();
    $("#level_1_children_pie_chart_container").prop("disabled",false);
    $("#level_1_children_bar_chart_container").empty();
    $("#level_1_children_bar_chart_container").hide();
    $("#level_1_children_bar_chart_container").prop("disabled",true);
    let string_append = "";
    for(let i=0; i<arr_data.length; i++){
      string_append += return_level_1_children_pie_chart_content(arr_data[i],i,arr_data.length)
    }
    // for(let i=0; i<9; i++){
    //   string_append += return_level_1_children_pie_chart_content(arr_data[0],0,arr_data.length)
    // }
    $("#level_1_children_pie_chart_container").append(string_append);
    for(let i=0; i<arr_son_pie_chart.length; i++){
      if(arr_son_pie_chart[i]){
        arr_son_pie_chart[i].dispose();
        delete arr_son_pie_chart[i];
      }
    }
    arr_son_pie_chart = [];
    for(let i=0; i<arr_data.length; i++){
      render_level_1_child_pie_chart(arr_data[i]);
    }
  }else{
    $("#level_1_children_bar_chart_container").empty();
    $("#level_1_children_bar_chart_container").show();
    $("#level_1_children_bar_chart_container").prop("disabled",false);
    $("#level_1_children_pie_chart_container").empty();
    $("#level_1_children_pie_chart_container").hide();
    $("#level_1_children_pie_chart_container").prop("disabled",true);
    let string_append = "";
    string_append += '<div id="main_bar_chart_percent" class="" style="height: 400px; width:100%"></div><div id="main_bar_chart_index_terminal" class="" style="height: 400px; width:100%"></div>'
    $("#level_1_children_bar_chart_container").append(string_append);
    render_level_1_child_bar_chart_percent(arr_data,name);
    render_level_1_child_bar_chart_index_terminal(arr_data,name)

  }
}

function return_level_1_children_pie_chart_content(data,index,length){
  let content = "";
  content += ''                
          +'<div class="col-3" style="min-width: 400px">'
          +'<div class="card text-left border_radius">'
          +'<div class="card-body">'
          +'<h4 class="font-weight-bold">'+data.name+'</h4>'
          if(data.status == 1 || data.status == "1"){
            content += '<span style="font-weight: bold; color: green;">'+data.meter_id+'</span>'
            +'<div style="width: 100%" class="row"><div class="col col-md-auto"><i class="fas fa-tachometer-alt"></i>&nbsp; <span style="font-weight: bold; color: green;">'+data.last_ValOfNum+'</span></div><div class="col"></div></div>'
          }else{
            content += '<span style="font-weight: bold; color: red;">'+data.meter_id+'</span>'
            +'<div style="width: 100%" class="row"><div class="col col-md-auto"><i class="fas fa-tachometer-alt"></i>&nbsp; <span style="font-weight: bold; color: red;">'+data.last_ValOfNum+'</span></div><div class="col"></div></div>'
          }
          content += ""

          +'<div class="mt-2">'
          +'<div id="son_pie_chart_'+data.meter_id+'" style="height: 230px; width: 100%;" class=""></div>'
          +'</div>'
          +'<div style="width: 100%" class="row"><div class="col"></div><div class="col col-md-auto"><i class="fas fa-tint"></i>	&nbsp; <span style="font-weight: bold;">'+data.sum_tong+' (m3)</span></div><div class="col"></div></div>'
          +'</div>'
          +'<div class="card-footer text-right bg_gray_dd">'
          +'<button class="btn btn-outline-secondary mr-1" title="Phóng to" onclick="zooming_pie_chart(`'+data.meter_id+'`,`'+data.serial_sensor+'`)"><i class="fas fa-search-plus"></i></button>'
          +'<button class="btn btn-outline-secondary mr-1" title="Chỉ số từng thời điểm" onclick="data_modal(`'+data.name+'`,`'+data.meter_id+'`,`'+data.serial_sensor+'`)"><i class="fas fa-database"></i></button>'
          +'<button class="btn btn-outline-secondary mr-1" title="Biểu đồ" onclick="chart_modal(`'+data.name+'`,`'+data.meter_id+'`,`'+data.serial_sensor+'`)"><i class="fas fa-chart-line"></i></button>'
          +'<button class="btn btn-outline-secondary mr-1" title="Cảnh báo" onclick="alert_modal(`'+data.name+'`,`'+data.meter_id+'`,`'+data.serial_sensor+'`)"><i class="fas fa-exclamation-triangle"></i></button>'
          +'<button class="btn btn-outline-secondary mr-1" onclick="open_modal(`'+data.name+'`,`'+data.meter_id+'`,`'+data.serial_sensor+'`,null)"><i class="fa fa-cog" aria-hidden="true"></i> Chi tiết</button>'
          +'<button class="btn btn-outline-secondary " title="Log" onclick="log_modal(`'+data.name+'`,`'+data.meter_id+'`,`'+data.serial_sensor+'`)"><i class="fas fa-history"></i></button>'

          // if(data.have_child == 1){
  //   content  += '<button class="btn btn-outline-secondary branch-icon" style="width: 55px; height: 35px;" onclick="load_level_2_data(`'+data.group_id+'`)"></button>'
  // }
  content +='</div>'
          +'</div>'
          +'</div>'
  // if(index % 4 == 0 || index == 0){
  //   content = '<div class="mt-3 row" style="width: 100%;">' + content
  // }
  // if(index % 4 == 3 || index == length - 1){
  //   content = content + '</div>'
  // }
  return content;
}


var arr_son_pie_chart = []

function render_level_1_child_pie_chart(data){
  am4core.useTheme(am4themes_animated);
  // if(Number(data.sum_nhanh) > Number(data.sum_tong) ){
  //   data.sum_nhanh = Number(data.sum_tong)
  // }
  let remain = Number(data.sum_nhanh);
  let loss = return_that_thoat(data.sum_nhanh,data.sum_tong);
  let no_data = 0;
  if(remain == 0 && loss == 0){
    no_data = 1;
    remain = 100;
    loss = 0
  }

  let son_pie_chart = am4core.create("son_pie_chart_"+data.meter_id, am4charts.PieChart3D);
  arr_son_pie_chart.push(son_pie_chart)
  son_pie_chart.hiddenState.properties.opacity = 1;
  son_pie_chart.data = [
    {
      category: "SL thất thoát",
      value: loss
    },{
      category: "SL tiêu thụ",
      value: remain
    }
  ]
  son_pie_chart.innerRadius = am4core.percent(0);
  son_pie_chart.depth = 13;
  // son_pie_chart.legend = new am4charts.Legend();
  son_pie_chart.radius = am4core.percent(80);
  son_pie_chart.logo.disabled = true;
  son_pie_chart.responsive.enabled = true;
  // son_pie_chart.legend.valueLabels.template.disabled = true;
  let series = son_pie_chart.series.push(new am4charts.PieSeries3D());
  series.dataFields.value = "value";
  series.dataFields.category = "category";

  if(no_data == 1){
    series.slices.template.tooltipText = "{category}: {value} (%) (0)";
  }
  // series.colors.step = 3;
  series.colors.list = [
    am4core.color(lost_color),
    am4core.color(remain_color),
  ];
  
  series.ticks.template.disabled = true;
  series.alignLabels = false;
  series.labels.template.text = ""
  // series.tooltip.disabled = true;
  // series.slices.template.alwaysShowTooltip = false;
// series.slices.template.tooltipText = ""

  let container = new am4core.Container();
  container.parent = series;
  container.horizontalCenter = "middle";
  container.verticalCenter = "middle";
  container.width = am4core.percent(40) / Math.sqrt(2);
  container.fill = "white";

  // let label = new am4core.Label();
  // label.parent = container;
  // label.text = data.sum_tong +" (m³)";
  // label.horizontalCenter = "middle";
  // label.verticalCenter = "middle";
  // label.fontSize = 15;

  // son_pie_chart.events.on("sizechanged", function(ev) {
  //   let scale = (series.pixelInnerRadius * 2) / label.bbox.width;
  //   if (scale > 1) {
  //     scale = 1;
  //   }
  //   label.scale = scale;
  // })
}


function return_that_thoat(nhanh,tong){
  if(Number(nhanh) > Number(tong)){
    return 0
  }
  return Number(tong) - Number(nhanh);
}

function return_percent_that_thoat(nhanh, tong){
  if(Number(nhanh) > Number(tong)) return 0;
  return (Number((Number(tong)-Number(nhanh))/Number(tong)).toFixed(4)) * 100
}


var main_bar_chart_percent = null;

function render_level_1_child_bar_chart_percent(data, name){
  let chart_data = [];
  for(let i=0; i<data.length; i++){
    let x = {
      name: data[i].name,
      remain: Number(data[i].sum_nhanh),
      loss: return_that_thoat(data[i].sum_nhanh,data[i].sum_tong),
      remain_percent: 100 - return_percent_that_thoat(data[i].sum_nhanh,data[i].sum_tong),
      loss_percent: return_percent_that_thoat(data[i].sum_nhanh,data[i].sum_tong),
    }
    chart_data.push(x);
  }
  am4core.useTheme(am4themes_animated);
  if(main_bar_chart_percent){
    main_bar_chart_percent.dispose();
    delete main_bar_chart_percent
  }
  main_bar_chart_percent = am4core.create("main_bar_chart_percent", am4charts.XYChart);
  main_bar_chart_percent.scrollbarX = new am4core.Scrollbar();
  main_bar_chart_percent.data = chart_data;
  main_bar_chart_percent.logo.disabled = true;

  // main_bar_chart_percent.tooltip.background.fill = am4core.color("#67b7dc");

  let categoryAxis = main_bar_chart_percent.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = "name";
  categoryAxis.renderer.minGridDistance = 60;
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.grid.template.disabled = true;
  categoryAxis.renderer.fullWidthTooltip = true;
  // categoryAxis.renderer.labels.template.rotation = 320;
  var label = categoryAxis.renderer.labels.template;
  label.truncate = true;
  label.maxWidth = 200;
  label.tooltipText = "{category}";

// label.events.on("sizechanged", function(ev) {
//   var axis = ev.target;
//     var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
//     if (cellWidth < axis.renderer.labels.template.maxWidth) {
//       axis.renderer.labels.template.rotation = -45;
//       axis.renderer.labels.template.horizontalCenter = "right";
//       axis.renderer.labels.template.verticalCenter = "middle";
//     }
//     else {
//       axis.renderer.labels.template.rotation = 0;
//       axis.renderer.labels.template.horizontalCenter = "middle";
//       axis.renderer.labels.template.verticalCenter = "top";
//     }
//   });

// categoryAxis.dateFormats.setKey("hour", "HH:mm");
// categoryAxis.dateFormats.setKey("day", "dd/MM");
// categoryAxis.periodChangeDateFormats.setKey("hour", "dd/MM"); 
// categoryAxis.dateFormats.setKey("month", "MM/yyyy");
// categoryAxis.periodChangeDateFormats.setKey("day", "MM/yyyy");

// main_bar_chart.cursor = new am4charts.XYCursor();
// main_bar_chart.cursor.fullWidthLineX = true;
// main_bar_chart.cursor.xAxis = dateAxis;
// main_bar_chart.cursor.lineX.strokeWidth = 0;
// main_bar_chart.cursor.lineX.fill = am4core.color("#000");
// main_bar_chart.cursor.lineX.fillOpacity = 0.1;
// main_bar_chart.legend = new am4charts.Legend();
let title = main_bar_chart_percent.titles.create();
title.text = "Biểu đồ thất thoát "+ name + "(%)";
title.fontSize = 25;
title.marginTop = 10;
title.marginBottom = 7;
title.fontWeight = "bold";

let valueAxis  = main_bar_chart_percent.yAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.inside = true;
valueAxis.renderer.labels.template.disabled = true;
valueAxis.min = 0;
valueAxis.tooltip.disabled = false;
// valueAxis.renderer.ticks.template.disabled = true;
// valueAxis.renderer.axisFills.template.disabled = true;
var series_2;
series_2 = main_bar_chart_percent.series.push(new am4charts.ColumnSeries());
series_2.name = "SL tiêu thụ";
// series_1.columns.template.fillOpacity = 1;
// series_1.columns.template.strokeOpacity = 1;
series_2.dataFields.valueY = "remain_percent";
series_2.stacked = true;
series_2.dataFields.categoryX = "name";
series_2.sequencedInterpolation = true;
series_2.columns.template.width = am4core.percent(60);
series_2.columns.template.tooltipText = "SL tiêu thụ: {remain} (m3)";

series_2.tooltip.getFillFromObject = false;
series_2.tooltip.background.fill = am4core.color("#fcfcfc");
series_2.tooltip.autoTextColor = false;
series_2.tooltip.label.fill = am4core.color("black");

var labelBullet_2 = series_2.bullets.push(new am4charts.LabelBullet());
//chữ bên trong
labelBullet_2.label.text = "{valueY} (%)";
labelBullet_2.locationY = 0.5;
labelBullet_2.label.hideOversized = true;
// labelBullet_2.label.fill = am4core.color("#fcfcfc");
// series.title = shortToFullName(field);
// series.strokeWidth = 1;
series_2.tensionX = 1;
series_2.showOnInit = true;
// series.legendSettings.labelText = shortToFullName(field) + maxlegendChart +'('+returnUnit(field)+')'
// series.tooltipText =shortToFullName(field)+maxlegendChart+ ": {valueY} " + returnUnit(field);
// series.name = shortToFullName(field) + maxlegendChart;
series_2.tooltip.pointerOrientation = "horizontal";
series_2.fill = am4core.color(remain_color);
series_2.stroke = am4core.color(remain_color);

var series_1;
series_1 = main_bar_chart_percent.series.push(new am4charts.ColumnSeries());
series_1.name = "SL thất thoát";
// series_1.columns.template.fillOpacity = 1;
// series_1.columns.template.strokeOpacity = 1;
series_1.dataFields.valueY = "loss_percent";
series_1.stacked = true;
series_1.dataFields.categoryX = "name";
series_1.sequencedInterpolation = true;
series_1.columns.template.width = am4core.percent(60);
series_1.columns.template.tooltipText = "SL thất thoát: {loss} (m3)";

series_1.tooltip.getFillFromObject = false;
series_1.tooltip.background.fill = am4core.color("#fcfcfc");
series_1.tooltip.autoTextColor = false;
series_1.tooltip.label.fill = am4core.color("black");

var labelBullet = series_1.bullets.push(new am4charts.LabelBullet());
labelBullet.label.text = "{valueY} (%)";
labelBullet.locationY = 0.5;
labelBullet.label.hideOversized = true;
// labelBullet.label.fill = am4core.color("#fcfcfc");

// series.title = shortToFullName(field);
// series.strokeWidth = 1;
series_1.tensionX = 1;
series_1.showOnInit = true;
// series.legendSettings.labelText = shortToFullName(field) + maxlegendChart +'('+returnUnit(field)+')'
// series.tooltipText =shortToFullName(field)+maxlegendChart+ ": {valueY} " + returnUnit(field);
// series.name = shortToFullName(field) + maxlegendChart;
series_1.tooltip.pointerOrientation = "horizontal";
series_1.fill = am4core.color(lost_color);
series_1.stroke = am4core.color(lost_color);
// main_bar_chart_percent.main_bar_chart_percent = new am4charts.Legend();
}

var main_bar_chart_index_terminal = null
function render_level_1_child_bar_chart_index_terminal(data,name){
  let chart_data = [];
  for(let i=0; i<data.length; i++){
    let x = {
      name: data[i].name,
      remain: Number(data[i].sum_nhanh),
      loss: return_that_thoat(data[i].sum_nhanh,data[i].sum_tong),
      remain_percent: 100 - return_percent_that_thoat(data[i].sum_nhanh,data[i].sum_tong),
      loss_percent: return_percent_that_thoat(data[i].sum_nhanh,data[i].sum_tong),
    }
    chart_data.push(x);
  }
  am4core.useTheme(am4themes_animated);
  if(main_bar_chart_index_terminal){
    main_bar_chart_index_terminal.dispose();
    delete main_bar_chart_index_terminal
  }
  main_bar_chart_index_terminal = am4core.create("main_bar_chart_index_terminal", am4charts.XYChart);
  main_bar_chart_index_terminal.scrollbarX = new am4core.Scrollbar();
  main_bar_chart_index_terminal.data = chart_data;
  main_bar_chart_index_terminal.logo.disabled = true;
  let categoryAxis = main_bar_chart_index_terminal.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = "name";
  categoryAxis.renderer.minGridDistance = 30;
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.grid.template.disabled = true;
categoryAxis.renderer.fullWidthTooltip = true;
// categoryAxis.renderer.labels.template.rotation = 320;
var label = categoryAxis.renderer.labels.template;
label.truncate = true;
label.maxWidth = 200;
label.tooltipText = "{category}";

// label.events.on("sizechanged", function(ev) {
//   var axis = ev.target;
//     var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
//     if (cellWidth < axis.renderer.labels.template.maxWidth) {
//       axis.renderer.labels.template.rotation = -45;
//       axis.renderer.labels.template.horizontalCenter = "right";
//       axis.renderer.labels.template.verticalCenter = "middle";
//     }
//     else {
//       axis.renderer.labels.template.rotation = 0;
//       axis.renderer.labels.template.horizontalCenter = "middle";
//       axis.renderer.labels.template.verticalCenter = "top";
//     }
//   });

// categoryAxis.dateFormats.setKey("hour", "HH:mm");
// categoryAxis.dateFormats.setKey("day", "dd/MM");
// categoryAxis.periodChangeDateFormats.setKey("hour", "dd/MM"); 
// categoryAxis.dateFormats.setKey("month", "MM/yyyy");
// categoryAxis.periodChangeDateFormats.setKey("day", "MM/yyyy");

// main_bar_chart.cursor = new am4charts.XYCursor();
// main_bar_chart.cursor.fullWidthLineX = true;
// main_bar_chart.cursor.xAxis = dateAxis;
// main_bar_chart.cursor.lineX.strokeWidth = 0;
// main_bar_chart.cursor.lineX.fill = am4core.color("#000");
// main_bar_chart.cursor.lineX.fillOpacity = 0.1;
// main_bar_chart.legend = new am4charts.Legend();
let title = main_bar_chart_index_terminal.titles.create();
title.text = "BIỂU ĐỒ THẤT THOÁT "+ name + "(m3)";
title.fontSize = 25;
title.marginTop = 10;
title.marginBottom = 7;
title.fontWeight = "bold";

let valueAxis  = main_bar_chart_index_terminal.yAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.inside = true;
valueAxis.renderer.labels.template.disabled = true;
valueAxis.min = 0;
valueAxis.tooltip.disabled = false;
// valueAxis.renderer.ticks.template.disabled = true;
// valueAxis.renderer.axisFills.template.disabled = true;
var series_2;
series_2 = main_bar_chart_index_terminal.series.push(new am4charts.ColumnSeries());
series_2.name = "SL tiêu thụ";
// series_1.columns.template.fillOpacity = 1;
// series_1.columns.template.strokeOpacity = 1;
series_2.dataFields.valueY = "remain";
series_2.stacked = true;
series_2.dataFields.categoryX = "name";
series_2.sequencedInterpolation = true;
series_2.columns.template.width = am4core.percent(60);
series_2.columns.template.tooltipText = "SL tiêu thụ: {remain_percent} (%)";

series_2.tooltip.getFillFromObject = false;
series_2.tooltip.background.fill = am4core.color("#fcfcfc");
series_2.tooltip.autoTextColor = false;
series_2.tooltip.label.fill = am4core.color("black");

var labelBullet_2 = series_2.bullets.push(new am4charts.LabelBullet());
//chữ bên trong
labelBullet_2.label.text = "{valueY} (m3)";
labelBullet_2.locationY = 0.5;
labelBullet_2.label.hideOversized = true;
// series.title = shortToFullName(field);
// series.strokeWidth = 1;
series_2.tensionX = 1;
series_2.showOnInit = true;
// series.legendSettings.labelText = shortToFullName(field) + maxlegendChart +'('+returnUnit(field)+')'
// series.tooltipText =shortToFullName(field)+maxlegendChart+ ": {valueY} " + returnUnit(field);
// series.name = shortToFullName(field) + maxlegendChart;
series_2.tooltip.pointerOrientation = "horizontal";
series_2.fill = am4core.color(remain_color);
series_2.stroke = am4core.color(remain_color);

var series_1;
series_1 = main_bar_chart_index_terminal.series.push(new am4charts.ColumnSeries());
series_1.name = "SL thất thoát";
// series_1.columns.template.fillOpacity = 1;
// series_1.columns.template.strokeOpacity = 1;
series_1.dataFields.valueY = "loss";
series_1.stacked = true;
series_1.dataFields.categoryX = "name";
series_1.sequencedInterpolation = true;
series_1.columns.template.width = am4core.percent(60);
series_1.columns.template.tooltipText = "SL thất thoát: {loss_percent} (%)";

series_1.tooltip.getFillFromObject = false;
series_1.tooltip.background.fill = am4core.color("#fcfcfc");
series_1.tooltip.autoTextColor = false;
series_1.tooltip.label.fill = am4core.color("black");

var labelBullet = series_1.bullets.push(new am4charts.LabelBullet());
labelBullet.label.text = "{valueY} (m3)";
labelBullet.locationY = 0.5;
labelBullet.label.hideOversized = true;
// series.title = shortToFullName(field);
// series.strokeWidth = 1;
series_1.tensionX = 1;
series_1.showOnInit = true;
// series.legendSettings.labelText = shortToFullName(field) + maxlegendChart +'('+returnUnit(field)+')'
// series.tooltipText =shortToFullName(field)+maxlegendChart+ ": {valueY} " + returnUnit(field);
// series.name = shortToFullName(field) + maxlegendChart;
series_1.tooltip.pointerOrientation = "horizontal";
series_1.fill = am4core.color(lost_color);
series_1.stroke = am4core.color(lost_color);
// main_bar_chart_index_terminal.main_bar_chart_index_terminal = new am4charts.Legend();
}

function change_type_level_1_child_chart(type){
  if(type == "pie"){
    TYPE_LEVEL_1_children_CHART = "pie";
    render_level_1_children_chart(TYPE_LEVEL_1_children_CHART,DATA_LEVEL_1,DATA_LEVEL_1_NAME);
  }else{
    TYPE_LEVEL_1_children_CHART = "bar";
    render_level_1_children_chart(TYPE_LEVEL_1_children_CHART,DATA_LEVEL_1,DATA_LEVEL_1_NAME);
  }
}


// function get_level_1_main_line_chart_data(group_id){
//   let api = null;
//   api = "/get/total_level_1_terminal_index_data?fr="+LV1_MAIN_LINE_CHART_FROM_DATA+"&to="+LV1_MAIN_LINE_CHART_TO_DATA+"&group_id="+group_id;
//   httpAsync(null,api,"GET",function(result){
//     let parse_data = JSON.parse(result);
//     let chart_data = parse_data.data;
//     render_level_1_main_line_chart(chart_data)
//   })
// }

let LEVEL_1_MAIN_LINE_CHART = null;

function render_level_1_main_line_chart(data){
   let title_chart = data.name;
    let data_chart = [];
    for(let i=0; i<data.data.length; i++){
      data_chart.push({
        meter_time: new Date(data.data[i].meter_time),
        // loss: ((Number(data.data[i].sum_nhanh) > Number(data.data[i].sum_tong)) ? 0 : (Number(data.data[i].sum_tong)-Number(data.data[i].sum_nhanh))),
        loss: ((data.data[i].lost === null) ? null : ((Number(data.data[i].lost) >= 0) ? Number(data.data[i].lost) : 0) > Number(data.data[i].sum_tong)) ? Number(data.data[i].sum_tong) : (data.data[i].lost === null) ? null : ((Number(data.data[i].lost) >= 0) ? Number(data.data[i].lost) : 0),
        total: (data.data[i].sum_tong === null) ? null : Number(data.data[i].sum_tong)
      })
    }

    // for(let i=0; i<data.data.length; i++){
    //   data_chart.push({
    //     meterTime: new Date(data.data[i].metertime),
    //     value: data.data[i].SUM_NHANH
    //   })
    // }
    // console.log(data_chart)

  let thickness = 3;
  am4core.useTheme(am4themes_animated);
  if(LEVEL_1_MAIN_LINE_CHART){
    LEVEL_1_MAIN_LINE_CHART.dispose();
    delete LEVEL_1_MAIN_LINE_CHART;
  }
  LEVEL_1_MAIN_LINE_CHART = am4core.create("level_1_main_line_chart", am4charts.XYChart);
  LEVEL_1_MAIN_LINE_CHART.scrollbarX = new am4core.Scrollbar();
  LEVEL_1_MAIN_LINE_CHART.data = data_chart;
  LEVEL_1_MAIN_LINE_CHART.logo.disabled = true;
  let dateAxis = LEVEL_1_MAIN_LINE_CHART.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 60;
  dateAxis.startLocation = 0.5;
  dateAxis.endLocation = 0.5;
  dateAxis.renderer.grid.template.location = 0;
  dateAxis.renderer.grid.template.disabled = true;
  dateAxis.renderer.fullWidthTooltip = true;
  // dateAxis.dateFormats.setKey("minutes", "HH:mm");

  dateAxis.dateFormats.setKey("hour", "HH:mm");
  dateAxis.dateFormats.setKey("day", "dd/MM");
  dateAxis.periodChangeDateFormats.setKey("hour", "dd/MM"); 
  dateAxis.dateFormats.setKey("month", "MM/yyyy");
  dateAxis.periodChangeDateFormats.setKey("day", "MM/yyyy");

  LEVEL_1_MAIN_LINE_CHART.cursor = new am4charts.XYCursor();
  LEVEL_1_MAIN_LINE_CHART.cursor.fullWidthLineX = true;
  LEVEL_1_MAIN_LINE_CHART.cursor.xAxis = dateAxis;
  LEVEL_1_MAIN_LINE_CHART.cursor.lineX.strokeWidth = 0;
  LEVEL_1_MAIN_LINE_CHART.cursor.lineX.fill = am4core.color("#000");
  LEVEL_1_MAIN_LINE_CHART.cursor.lineX.fillOpacity = 0.1;
  LEVEL_1_MAIN_LINE_CHART.legend = new am4charts.Legend();

  let title = LEVEL_1_MAIN_LINE_CHART.titles.create();
  title.text = "Biểu đồ thất thoát "+title_chart;
  title.fontSize = 25;
  title.marginTop = 10;
  title.marginBottom = 7;
  title.fontWeight = "bold";

  var m3 = LEVEL_1_MAIN_LINE_CHART.yAxes.push(new am4charts.ValueAxis());
  m3.tooltip.disabled = false;
  m3.renderer.ticks.template.disabled = true;
  m3.renderer.axisFills.template.disabled = true;
  m3.renderer.line.strokeOpacity = 0.5;
  m3.renderer.line.strokeWidth = 1;
  m3.title.text ="m3"
  m3.renderer.opposite = false;
  m3.extraMin = 0.1;
  m3.extraMax = 0.1; 
  
   
    var series;
    series = LEVEL_1_MAIN_LINE_CHART.series.push(new am4charts.LineSeries());
    series.yAxis = m3;
    
    series.dataFields.valueY = "total";
    series.dataFields.dateX = "meter_time";
    series.title = "Sản lượng";
    series.strokeWidth = thickness;
    series.tensionX = 1;
    series.showOnInit = true;
    series.legendSettings.labelText = "Sản lượng (m3)";
    series.tooltipText = "Sản lượng" + ": {valueY} " + "(m3)";
    series.name = "Sản lượng"
    series.tooltip.pointerOrientation = "horizontal";
    series.fill = am4core.color(remain_color);
    series.stroke = am4core.color(remain_color);
    series.fillOpacity = 0.8;

    var series_2;
    series_2 = LEVEL_1_MAIN_LINE_CHART.series.push(new am4charts.LineSeries());
    series_2.yAxis = m3;
    series_2.dataFields.valueY = "loss";
    series_2.dataFields.dateX = "meter_time";
    series_2.title = "Thất thoát";
    series_2.strokeWidth = thickness;
    series_2.tensionX = 1;
    series_2.showOnInit = true;
    series_2.legendSettings.labelText = "Thất thoát (m3)";
    series_2.tooltipText = "Thất thoát" + ": {valueY} " + "(m3)";
    series_2.name = "Thất thoát"
    series_2.tooltip.pointerOrientation = "horizontal";
    series_2.fill = am4core.color(lost_color);
    series_2.stroke = am4core.color(lost_color);
    series_2.fillOpacity = 0.8;
}

var LV1_MAIN_PIE_CHART_TO_DATA = 0;  // thời gian kết thúc
var LV1_MAIN_PIE_CHART_FROM_DATA = 0 // thời gian bắt đầu
$(document).ready(function(){   // thay đổi khoảng thời gian hiển thị chỉ số theo thời điểm
    $("#select_lv1_main_pie_chart_time_data").change(function(){
        let x = new Date();
        let val = $(this).children("option:selected").val();
        if(val == "custom"){
            $("#pick_lv1_main_pie_chart_time_data").css("display","block");
            $("#pick_lv1_main_pie_chart_time_data_container").css("display","block");
        }else{
            $("#pick_lv1_main_pie_chart_time_data").css("display","none");
            $("#pick_lv1_main_pie_chart_time_data_container").css("display","none");
        }
        switch(val){
            case "now":
                LV1_MAIN_PIE_CHART_TO_DATA = 0;
                LV1_MAIN_PIE_CHART_FROM_DATA = 0;
                // load_level_1_data(NODE_ID_fist_load);
                load_level_1_pie_chart(NODE_ID_fist_load)
                load_level_1_line_chart(NODE_ID_fist_load)
                break;
            case "24hour":
                LV1_MAIN_PIE_CHART_TO_DATA = -1;
                LV1_MAIN_PIE_CHART_FROM_DATA = -1;
                load_level_1_pie_chart(NODE_ID_fist_load)
                load_level_1_line_chart(NODE_ID_fist_load)
                break;
            case "week":
                LV1_MAIN_PIE_CHART_TO_DATA = -2;
                LV1_MAIN_PIE_CHART_FROM_DATA = -2;
                load_level_1_pie_chart(NODE_ID_fist_load)
                load_level_1_line_chart(NODE_ID_fist_load)
                break;
            case "month":
                LV1_MAIN_PIE_CHART_TO_DATA = -3;
                LV1_MAIN_PIE_CHART_FROM_DATA = -3;
                load_level_1_pie_chart(NODE_ID_fist_load)
                load_level_1_line_chart(NODE_ID_fist_load)
                break;
        }
    })
  })
  $(function() {
    $('#pick_lv1_main_pie_chart_time_data').daterangepicker(  // pick khoảng thời gian cụ thể
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
        LV1_MAIN_PIE_CHART_FROM_DATA = new Date(start).getTime() ;
        LV1_MAIN_PIE_CHART_TO_DATA = new Date(end).getTime();
        load_level_1_pie_chart(NODE_ID_fist_load)  
        load_level_1_line_chart(NODE_ID_fist_load)
 
      }
   );
});


// var LV1_MAIN_LINE_CHART_TO_DATA = -2;  // thời gian kết thúc
// var LV1_MAIN_LINE_CHART_FROM_DATA = -2; // thời gian bắt đầu
// $(document).ready(function(){   // thay đổi khoảng thời gian hiển thị chỉ số theo thời điểm
//     $("#select_lv1_main_line_chart_time_data").change(function(){
//         let x = new Date();
//         let val = $(this).children("option:selected").val();
//         if(val == "custom"){
//             $("#pick_lv1_main_line_chart_time_data").css("display","block");
//             $("#pick_lv1_main_line_chart_time_data_container").css("display","block");
//         }else{
//             $("#pick_lv1_main_line_chart_time_data").css("display","none");
//             $("#pick_lv1_main_line_chart_time_data_container").css("display","none");
//         }
//         switch(val){
//             case "24hour":
//                 LV1_MAIN_LINE_CHART_TO_DATA = x.getTime();
//                 LV1_MAIN_LINE_CHART_FROM_DATA = LV1_MAIN_LINE_CHART_TO_DATA - 24*3600000;
//                 load_level_1_line_chart(NODE_ID_fist_load)
//                 break;
//             case "week":
//                 LV1_MAIN_LINE_CHART_TO_DATA = -2;
//                 LV1_MAIN_LINE_CHART_FROM_DATA = -2;
//                 load_level_1_line_chart(NODE_ID_fist_load)
//                 break;
//             case "month":
//                 LV1_MAIN_LINE_CHART_TO_DATA = -3;
//                 LV1_MAIN_LINE_CHART_FROM_DATA = -3;
//                 load_level_1_line_chart(NODE_ID_fist_load)
//                 break;
//         }
//     })
//   })
//   $(function() {
//     $('#pick_lv1_main_line_chart_time_data').daterangepicker(  // pick khoảng thời gian cụ thể
//       {
//          startDate: moment().startOf('hour'),
//          endDate: moment().startOf('hour'),
//          showDropdowns: true,
//          showWeekNumbers: true,
//          timePicker: true,
//          timePickerIncrement: 1,
//          timePicker12Hour: true,
//          opens: 'left',
//          buttonClasses: ['btn btn-default'],
//          applyClass: 'btn-small btn-primary',
//          cancelClass: 'btn-small',
//          format: 'DD/MM/YYYY',
//          separator: ' to ',
//          locale: {
//              applyLabel: 'Submit',
//              fromLabel: 'From',
//              toLabel: 'To',
//              customRangeLabel: 'Custom Range',
//              daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
//              monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
//              firstDay: 1,
//              format: 'M/DD hh:mm A'
//          }
//       },
//       function(start, end) {
//         LV1_MAIN_LINE_CHART_FROM_DATA = new Date(start).getTime() ;
//         LV1_MAIN_LINE_CHART_TO_DATA = new Date(end).getTime();
//         load_level_1_line_chart(NODE_ID_fist_load)   
//       }
//    );
// });








function get_level_1_main_map_data(group_id){
  httpAsync(null,"/get/level_1_main_map_data?group_id="+group_id,"GET",function(result){
    let parse_data = JSON.parse(result);
    let meter_location = parse_data.data.meter_location;
    let draw_map = parse_data.data.draw_map;
    render_level_1_main_map(meter_location,draw_map);
  })
}



var RED_MARKER = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
var GREEN_MARKER = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
var BLUE_MARKER = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
var YELLOW_MARKER = 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';

var LEVEL_1_MAIN__MAP = null;
var MAKER_MAP_LV1 = [];
var POLYLINE_MAP_LV1 = [];
var POLYGON_MAP_LV1 = [];
function render_level_1_main_map(meter_location,draw_map){
  MAKER_MAP_LV1 = [];
  POLYLINE_MAP_LV1 = [];
  POLYGON_MAP_LV1 = [];
  $('.layer_map_lv1').prop('checked', true);
  let uluru = {lat: 21.07373590613005, lng: 107.32095614446187};
  if(meter_location.length > 0){
    for(let i=0; i<meter_location.length; i++){
      if(meter_location[i].lat != null && meter_location[i].lng != null){
        uluru = {
          lat: Number(meter_location[i].lat),
          lng: Number(meter_location[i].lng)
        }
        break;
      }
    }
  }
  let options = {
    zoom : 15,
    center: uluru,
    // lickableIcons: false,
    styles: [
      {
          featureType: "transit",
          elementType: "labels",
          stylers: [
                { visibility: "off" }
          ]
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
              { visibility: "off" }
        ]
    }
    ]
  }
  LEVEL_1_MAIN__MAP = new google.maps.Map(document.getElementById("level_1_main_map"), options);
  let marker = null;
  for(let i=0; i<meter_location.length; i++){
      let coords = {lat: Number(meter_location[i].lat), lng:Number(meter_location[i].lng)};
      if(meter_location[i].level_icon == 1){
        if(meter_location[i].status_alert == 1){
          marker = new google.maps.Marker({
            opacity: 1,
            position: coords,
            map: LEVEL_1_MAIN__MAP,
            animation: google.maps.Animation.DROP,
            icon: {
              url: "/images/father-wt-meter-icon-red.png",
              scaledSize: new google.maps.Size(60, 46), // scaled size
              // origin: new google.maps.Point(0,0), // origin
              // anchor: new google.maps.Point(0, 0) // anchor
            },
            label: { className: "map_maker_laber_text", text: meter_location[i].name }
          })
        }else{
          marker = new google.maps.Marker({
            opacity: 1,
            position: coords,
            map: LEVEL_1_MAIN__MAP,
            animation: google.maps.Animation.DROP,
            icon: {
              url: "/images/father-wt-meter-icon.png",
              scaledSize: new google.maps.Size(60, 46), // scaled size
              // origin: new google.maps.Point(0,0), // origin
              // anchor: new google.maps.Point(0, 0) // anchor
            },
            label: { className: "map_maker_laber_text", text: meter_location[i].name }
          })
        }

      }else if(meter_location[i].level_icon == 2){
        if(meter_location[i].status_alert == 1){
          marker = new google.maps.Marker({
            opacity: 1,
            position: coords,
            map: LEVEL_1_MAIN__MAP,
            animation: google.maps.Animation.DROP,
            icon: {
              url: "/images/wt-meter-icon-level_2-red.png",
              scaledSize: new google.maps.Size(40, 32), // scaled size
              // origin: new google.maps.Point(0,0), // origin
              // anchor: new google.maps.Point(0, 0) // anchor
            },
            label: { className: "map_maker_laber_text", text: meter_location[i].name }

            // title: 'Uluru (Ayers Rock)'
          })
        }else{
          marker = new google.maps.Marker({
            opacity: 1,
            position: coords,
            map: LEVEL_1_MAIN__MAP,
            animation: google.maps.Animation.DROP,
            icon: {
              url: "/images/wt-meter-icon-level_2.png",
              scaledSize: new google.maps.Size(40, 32), // scaled size
              // origin: new google.maps.Point(0,0), // origin
              // anchor: new google.maps.Point(0, 0) // anchor
            },
            label: { className: "map_maker_laber_text", text: meter_location[i].name }

            // title: 'Uluru (Ayers Rock)'
          })
        }

      }else if(meter_location[i].level_icon == 3){
        if(meter_location[i].status_alert == 1){
          marker = new google.maps.Marker({
            opacity: 1,
            position: coords,
            map: LEVEL_1_MAIN__MAP,
            animation: google.maps.Animation.DROP,
            icon: {
              url: "/images/wt-meter-icon-red.png",
              scaledSize: new google.maps.Size(30, 27), // scaled size
              // origin: new google.maps.Point(0,0), // origin
              // anchor: new google.maps.Point(0, 0) // anchor
            },
            label: { className: "map_maker_laber_text", text: meter_location[i].name }

            // title: 'Uluru (Ayers Rock)'
          })
        }else{
          marker = new google.maps.Marker({
            opacity: 1,
            position: coords,
            map: LEVEL_1_MAIN__MAP,
            animation: google.maps.Animation.DROP,
            icon: {
              url: "/images/wt-meter-icon.png",
              scaledSize: new google.maps.Size(30, 27), // scaled size
              // origin: new google.maps.Point(0,0), // origin
              // anchor: new google.maps.Point(0, 0) // anchor
            },
            label: { className: "map_maker_laber_text", text: meter_location[i].name }

            // title: 'Uluru (Ayers Rock)'
          })
        }

      }else{
        marker = new google.maps.Marker({
          opacity: 1,
          position: coords,
          map: LEVEL_1_MAIN__MAP,
          animation: google.maps.Animation.DROP,
          icon: RED_MARKER,
          label: { className: "map_maker_laber_text", text: meter_location[i].name }

          // title: 'Uluru (Ayers Rock)'
        })
      }
      MAKER_MAP_LV1.push(marker);
      let content = meter_location[i].meter_id + return_alert_text(meter_location[i]);
      marker['infowindow'] = new google.maps.InfoWindow({
        content: content
      });
    //   google.maps.event.addListener(marker, 'click', function () {
    //     // this['infowindow'].open(map, this);
    //     open_modal();
    // });
    google.maps.event.addListener(marker, 'mouseover', function () {
      this['infowindow'].open(LEVEL_1_MAIN__MAP, this);
    });
    google.maps.event.addListener(marker, 'mouseout', function () {
      this['infowindow'].close(LEVEL_1_MAIN__MAP, this);
    });
    google.maps.event.addListener(marker, 'click', function () {
      // this['infowindow'].open(map, this);
      open_modal(meter_location[i].name,meter_location[i].meter_id,meter_location[i].serial_sensor,null);
      });

  }

  for(let i=0; i<draw_map.length; i++){
    // let line_map = JSON.parse(draw_map[i].line_map);
    // for(let j=0; j<line_map.length; j++){
    //   let flightPath = new google.maps.Polyline({
    //     path: line_map[j],
    //     geodesic: true,
    //     strokeColor: "#0074c2",
    //     strokeOpacity: 1.0,
    //     strokeWeight: 3,
    //     });
    //     flightPath.setMap(LEVEL_1_MAIN__MAP);

    //     var infowindow = new google.maps.InfoWindow();

    //     google.maps.event.addListener(flightPath, 'mouseover', function (event) {
    //       // this['infowindow'].open(LEVEL_1_MAIN__MAP, this);
    //       let point = event.latLng.toJSON();
    //       infowindow.setPosition(point);
    //       infowindow.setContent("test");

    //       infowindow.open(LEVEL_1_MAIN__MAP);
    //     });
    //     google.maps.event.addListener(flightPath, 'mouseout', function () {
    //       infowindow.close(LEVEL_1_MAIN__MAP);
    //     });

    // }
    let zone_map = JSON.parse(draw_map[i].zone_map);
    let color_zone_map = "#36aff5";
    if(draw_map[i].status){
      color_zone_map = "#f0434f"
    }
      let polygon = new google.maps.Polygon({
      paths: zone_map,
      strokeColor: color_zone_map,
      strokeOpacity: 0.6,
      strokeWeight: 1,
      fillColor: color_zone_map,
      fillOpacity: 0.35,
      draggable: false,
      geodesic: true,
      });
      polygon.setMap(LEVEL_1_MAIN__MAP)
      google.maps.event.addListener(polygon, 'click', function () {
        console.log("click tuyến: "+ draw_map[i].group_id);
        setting_datalostoutput(draw_map[i].group_id)
      });
      POLYGON_MAP_LV1.push(polygon)
  }

  for(let i=0; i<draw_map.length; i++){
    let line_map = JSON.parse(draw_map[i].line_map);
    for(let j=0; j<line_map.length; j++){
      let flightPath = new google.maps.Polyline({
        path: line_map[j],
        geodesic: true,
        strokeColor: "#0074c2",
        strokeOpacity: 1.0,
        strokeWeight: 3,
        });
        flightPath.setMap(LEVEL_1_MAIN__MAP);

        var infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(flightPath, 'mouseover', function (event) {
          // this['infowindow'].open(LEVEL_1_MAIN__MAP, this);
          let point = event.latLng.toJSON();
          infowindow.setPosition(point);
          infowindow.setContent("group_id: " + draw_map[i].group_id);

          infowindow.open(LEVEL_1_MAIN__MAP);
        });
        google.maps.event.addListener(flightPath, 'mouseout', function () {
          infowindow.close(LEVEL_1_MAIN__MAP);
        });
        // google.maps.event.addListener(flightPath, 'click', function () {
        //   console.log("click tuyến: "+ draw_map[i].group_id);
        // });
        POLYLINE_MAP_LV1.push(flightPath)

    }
    // let zone_map = JSON.parse(draw_map[i].zone_map);
    // let color_zone_map = "#36aff5";
    // if(draw_map[i].status){
    //   color_zone_map = "#f0434f"
    // }
    //   let polygon = new google.maps.Polygon({
    //   paths: zone_map,
    //   strokeColor: color_zone_map,
    //   strokeOpacity: 0.6,
    //   strokeWeight: 1,
    //   fillColor: color_zone_map,
    //   fillOpacity: 0.35,
    //   draggable: false,
    //   geodesic: true,
    //   });
    //   polygon.setMap(LEVEL_1_MAIN__MAP)
  }
  setting_seach_map(meter_location);
    // for(let i=0; i<data_draw_map.length; i++){
    //     let flightPath = new google.maps.Polyline({
    //     path: [data_draw_map[i].point_1, data_draw_map[i].point_2],
    //     geodesic: true,
    //     strokeColor: "#FF0000",
    //     strokeOpacity: 1.0,
    //     strokeWeight: 3,
    //     });
    //     flightPath.setMap(map);
    // }

    // for(let i=0; i<data_zone_map.length; i++){
    //     let polygon = new google.maps.Polygon({
    //     paths: data_zone_map[i],
    //     strokeColor: "#36aff5",
    //     strokeOpacity: 0.6,
    //     strokeWeight: 1,
    //     fillColor: "#36aff5",
    //     fillOpacity: 0.35,
    //     draggable: false,
    //     geodesic: true,
    //     });
    //     polygon.setMap(map)
    // }

  // LEVEL_1_MAIN__MAP.addListener("click", (mapsMouseEvent) => {
  //   let point = mapsMouseEvent.latLng.toJSON();
  //   // if(POINT_1 == null && POINT_2 == null){POINT_1 = point; return true;}
  //   // if(POINT_1 != null && POINT_2 == null){POINT_2 = point; creat_line(POINT_1,POINT_2); POINT_1 = null; POINT_2 = null;}
  // })
}

function setting_seach_map(meter_location){
  $("#map_meter_search").empty();
  for(let i=0; i<meter_location.length; i++){
    if(meter_location[i].lng != null && meter_location[i].lng != "" && meter_location[i].lat != null && meter_location[i].lat != ""){
      $("#map_meter_search").append('<option lat="'+Number(meter_location[i].lat)+'" lng="'+Number(meter_location[i].lng)+'" >'+meter_location[i].name+'-'+meter_location[i].meter_id+'</option>')
    }
  }
  $("#map_meter_search").selectpicker('refresh');
//   $('#map_meter_search').selectpicker({
//     dropupAuto: false
// });
}

$(document).ready(function(){
  $('#map_meter_search').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    console.log(Number($('option:selected', this).attr("lat")),Number($('option:selected', this).attr("lng")))
    LEVEL_1_MAIN__MAP.setCenter({
      lat: Number($('option:selected', this).attr("lat")),
      lng: Number($('option:selected', this).attr("lng"))
    })
    LEVEL_1_MAIN__MAP.setZoom(16)
  });
})


$(document).ready(function(){
  $(document).on("click",".layer_map_lv1",function(){
    if($(this).is(":checked")){
      let val = $(this).val();
      switch(val){
        case "meter":
          show_layer(LEVEL_1_MAIN__MAP,MAKER_MAP_LV1)
          break;
        case "polyline":
          show_layer(LEVEL_1_MAIN__MAP,POLYLINE_MAP_LV1)
          break;
        case "polygon":
          show_layer(LEVEL_1_MAIN__MAP,POLYGON_MAP_LV1)
          break;
      }
    }else{
      let val = $(this).val();
      switch(val){
        case "meter":
          hide_layer(LEVEL_1_MAIN__MAP,MAKER_MAP_LV1)
          break;
        case "polyline":
          hide_layer(LEVEL_1_MAIN__MAP,POLYLINE_MAP_LV1)
          break;
        case "polygon":
          hide_layer(LEVEL_1_MAIN__MAP,POLYGON_MAP_LV1)
          break;
      }
    }
  })
})


function hide_layer(map,arr){
  for (let i = 0; i < arr.length; i++) {
    arr[i].setMap(null);
  }
}

function show_layer(map,arr){
  for (let i = 0; i < arr.length; i++) {
    arr[i].setMap(map);
  }
}

// function show_polygon(map,polygon){
//   for (let i = 0; i < polygon.length; i++) {
//     polygon[i].setMap(map);
//   }
// }

// function hide_polygon(map,polygon){
//   for (let i = 0; i < polygon.length; i++) {
//     polygon[i].setMap(null);
//   }
// }


function return_alert_text(data){
  let x = "";
  if(data.status_alert_OP == 1){
    x += "<br> Cảnh báo lưu lượng"
  }
  if(data.status_alert_SL == 1){
    x += "<br> Cảnh báo sản lượng"
  }
  if(data.status_alert_PIN == 1){
    x += "<br> Cảnh báo PIN"
  }
  if(data.status_alert_APSUAT == 1){
    x += "<br> Cảnh báo áp suất"
  }
  if(data.status_alert_ACQUY == 1){
    x += "<br> Cảnh báo ác quy"
  }
  return x;
}

function export_meter_list(){
  window.open('/get/export_meter_list?group_id='+NODE_ID_fist_load, '_blank')
}

var LEVEL_2_LINE_CHART_TIME_TO = 0
var LEVEL_2_LINE_CHART_TIME_FROM = 0
$(document).ready(function(){   // thay đổi khoảng thời gian hiển thị chỉ số theo thời điểm
  $("#select_lv2_main_line_chart_time_data").change(function(){
      let x = new Date();
      let val = $(this).children("option:selected").val();
      if(val == "custom"){
          $("#pick_lv2_main_line_chart_time_data_container").css("display","block");
          $("#pick_lv2_main_line_chart_time_data").css("display","block");

      }else{
          $("#pick_lv2_main_line_chart_time_data_container").css("display","none");
          $("#pick_lv2_main_line_chart_time_data").css("display","none");

      }
      switch(val){
          case "now":
            LEVEL_2_LINE_CHART_TIME_TO = 0;
            LEVEL_2_LINE_CHART_TIME_FROM = 0;
            if(TYPE_LEVEL_2_DATA_LOST_OUPUT_CHART == "pie"){
              load_level_2_pie_chart(DATA_LOST_OUTPUT_GROUP_ID)
            }else{
              load_level_2_line_chart(DATA_LOST_OUTPUT_GROUP_ID)
            }
            // load_lv2_again(DATA_LOST_OUTPUT_GROUP_ID);
            break;
          case "24hour":
            LEVEL_2_LINE_CHART_TIME_TO = x.getTime();
            LEVEL_2_LINE_CHART_TIME_FROM = LEVEL_2_LINE_CHART_TIME_TO - 24*3600000;
            if(TYPE_LEVEL_2_DATA_LOST_OUPUT_CHART == "pie"){
              load_level_2_pie_chart(DATA_LOST_OUTPUT_GROUP_ID)
            }else{
              load_level_2_line_chart(DATA_LOST_OUTPUT_GROUP_ID)
            }
            // load_lv2_again(DATA_LOST_OUTPUT_GROUP_ID)
            break;
          case "week":
            LEVEL_2_LINE_CHART_TIME_TO = -2;
            LEVEL_2_LINE_CHART_TIME_FROM = -2;
            if(TYPE_LEVEL_2_DATA_LOST_OUPUT_CHART == "pie"){
              load_level_2_pie_chart(DATA_LOST_OUTPUT_GROUP_ID)
            }else{
              load_level_2_line_chart(DATA_LOST_OUTPUT_GROUP_ID)
            }
            // load_lv2_again(DATA_LOST_OUTPUT_GROUP_ID)
            break;
          case "month":
            LEVEL_2_LINE_CHART_TIME_TO = -3;
            LEVEL_2_LINE_CHART_TIME_FROM = -3;
            if(TYPE_LEVEL_2_DATA_LOST_OUPUT_CHART == "pie"){
              load_level_2_pie_chart(DATA_LOST_OUTPUT_GROUP_ID)
            }else{
              load_level_2_line_chart(DATA_LOST_OUTPUT_GROUP_ID)
            }
            // load_lv2_again(DATA_LOST_OUTPUT_GROUP_ID)
            break;
      }
  })
})
$(function() {
  $('#pick_lv2_main_line_chart_time_data').daterangepicker(  // pick khoảng thời gian cụ thể
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
      LEVEL_2_LINE_CHART_TIME_FROM = new Date(start).getTime() ;
      LEVEL_2_LINE_CHART_TIME_TO = new Date(end).getTime();
      if(TYPE_LEVEL_2_DATA_LOST_OUPUT_CHART == "pie"){
        load_level_2_pie_chart(DATA_LOST_OUTPUT_GROUP_ID)
      }else{
        load_level_2_line_chart(DATA_LOST_OUTPUT_GROUP_ID)
      }
      // load_lv2_again(DATA_LOST_OUTPUT_GROUP_ID)   
    }
 );
});

var NODE_ID_LV2 = null;
function load_level_2_data(node_id){
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  LEVEL_2_LINE_CHART_TIME_FROM = 0;
  LEVEL_2_LINE_CHART_TIME_TO = 0;
  // $("#pick_lv2_main_line_chart_time_data").data("daterangepicker").setStartDate(moment().startOf('hour'));
  // $("#pick_lv2_main_line_chart_time_data").data("daterangepicker").setEndDate(moment().startOf('hour'));
  $("#pick_lv2_main_line_chart_time_data_container").css("display","none");
  $("#pick_lv2_main_line_chart_time_data").css("display","none");
  $("#select_lv2_main_line_chart_time_data").prop('selectedIndex',0);

  // render_map(data_point)
  $(".page_").hide();
  $(".page_").prop("disabled",true);
  $("#page_2").show();
  $("#page_2").prop("disabled",false);
  load_genera_data(node_id,"meter_status_lv_2");
  load_mess_rate(node_id,"mess_rate_lv_2")  
  // get_lost_data_meter_data_info_data(node_id)
  if(TYPE_LEVEL_2_DATA_LOST_OUPUT_CHART == "pie"){
    load_level_2_pie_chart(node_id)
  }else{
    load_level_2_line_chart(node_id)
  }
  get_level_2_main_map_data(node_id);
  load_level_2_ins_data(node_id);
  // load_lv2_again(node_id)
}


function load_level_2_pie_chart(node_id){
  $("#loading_main_pie_chart_lv_2").css("display","block");
  $("#main_pie_chart_lv_2").css("display","none");
  httpAsync(null,"/get/pie_chart_data_level_2?node_id="+node_id+"&fr="+LEVEL_2_LINE_CHART_TIME_FROM+"&to="+LEVEL_2_LINE_CHART_TIME_TO,"GET",function(result){
    let parse_data = JSON.parse(result);
    let data = parse_data.data;
    if(parse_data.err_code == 0){
      render_level_2_main_pie_chart(data)
      if(LEVEL_2_LINE_CHART_TIME_FROM == 0 && LEVEL_2_LINE_CHART_TIME_TO == 0){
        $("#time_chart_level_2").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(return_max_time([data])))
      }else{
        if(LEVEL_2_LINE_CHART_TIME_FROM == -2 && LEVEL_2_LINE_CHART_TIME_TO == -2){
          $("#time_chart_level_2").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(new Date().getTime() - 7*24*3600000) + " - " + return_date_format_ddmmyyhhmmss_2(new Date().getTime()))
        }else if(LEVEL_2_LINE_CHART_TIME_FROM == -3 && LEVEL_2_LINE_CHART_TIME_TO == -3){
          $("#time_chart_level_2").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(new Date().getTime() - 30*24*3600000) + " - " + return_date_format_ddmmyyhhmmss_2(new Date().getTime()))
        }else{
          $("#time_chart_level_2").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(LEVEL_2_LINE_CHART_TIME_FROM) + " - " + return_date_format_ddmmyyhhmmss_2(LEVEL_2_LINE_CHART_TIME_TO))
        }
      }
    }else{
      if(LEVEL_2_MAIN_PIE_CHART){
        LEVEL_2_MAIN_PIE_CHART.dispose();
        delete LEVEL_2_MAIN_PIE_CHART;
      }
    }
  })
}

function load_level_2_line_chart(node_id){
  if(LEVEL_2_MAIN_LINE_CHART){
    LEVEL_2_MAIN_LINE_CHART.dispose();
    delete LEVEL_2_MAIN_LINE_CHART;
  }
  $("#loading_main_line_data_lost_output_lv_2").css("display","block");
  $("#main_line_data_lost_output_lv_2").css("display","none");
  httpAsync(null,"/get/line_chart_data_level_2?node_id="+node_id+"&fr="+LEVEL_2_LINE_CHART_TIME_FROM+"&to="+LEVEL_2_LINE_CHART_TIME_TO,"GET",function(result){
    let parse_data = JSON.parse(result);
    let data = parse_data.data.data;
    let meter_id_arr = parse_data.data.meter_id_arr;
    let chart_data = [];
    for(let i=0; i<data[0].length; i++){
      chart_data.push({
        meter_time: new Date(data[0][i].meter_time),
        loss: ((Number(data[0][i].sum_nhanh) > Number(data[0][i].sum_tong)) ? 0 : (Number(data[0][i].sum_tong)-Number(data[0][i].sum_nhanh))),
        total: Number(data[0][i].sum_tong)
      })
    }
    if((LEVEL_2_LINE_CHART_TIME_TO == -2 && LEVEL_2_LINE_CHART_TIME_FROM == -2) || (LEVEL_2_LINE_CHART_TIME_TO == -3 && LEVEL_2_LINE_CHART_TIME_FROM == -3)){
      let orther_data = [];
      for(let i=1; i<data.length; i++){
        orther_data.push(add_flow_rate(data[i]))
      }
      for(let i=0; i<orther_data.length; i++){
        for(let j=0; j<orther_data[i].length; j++){
          let x = {
            meter_time: new Date(orther_data[i][j].meterTime),
          }
          x[meter_id_arr[i]+"_pressure"] = stringtonum(orther_data[i][j].pressure)
          x[meter_id_arr[i]+"_flow_rate"] = stringtonum(orther_data[i][j].flow_rate)
          chart_data.push(x)
        }
      }
      render_level_2_main_line_data_lost_output(chart_data,meter_id_arr)
    }else{
      for(let i=1; i<data.length; i++){
        for(let j=0; j<data[i].length;j++){
          let x = {
            meter_time: new Date(data[i][j].meterTime),
          }
          x[meter_id_arr[i-1]+"_pressure"] = stringtonum(data[i][j].pressure)
          x[meter_id_arr[i-1]+"_flow_rate"] = stringtonum(data[i][j].flowRate)
          chart_data.push(x)
        }
      }
      render_level_2_main_line_data_lost_output(chart_data,meter_id_arr)
    }
  })
}

function load_level_2_ins_data(node_id){
  httpAsync(null,"/get/ins_data_level_2?node_id="+node_id,"GET",function(result){
    let parse_data = JSON.parse(result);
    let data = parse_data.data;
    render_info_meter_tong_lv_2(data);
    render_level_2_bar_chart(data);
  })
}

function load_lv2_again(node_id){
  get_lost_data_meter_data_info_data(node_id)
  // get_level_2_main_line_chart_data(node_id);
  get_level_2_main_map_data(node_id)
}

function get_lost_data_meter_data_info_data(node_id){
  httpAsync(null,"/get/level_2_data?node_id="+node_id+"&fr="+LEVEL_2_LINE_CHART_TIME_FROM+"&to="+LEVEL_2_LINE_CHART_TIME_TO+"&type="+TYPE_LEVEL_2_DATA_LOST_OUPUT_CHART,"GET",function(result){
    let parse_data = JSON.parse(result);
    let lost_output_data = parse_data.data.lost_output_data;
    let instant_data_tong = parse_data.data.instant_data_tong;
    let other_data = parse_data.data.other_data;
    if(TYPE_LEVEL_2_DATA_LOST_OUPUT_CHART == "pie"){
      if(lost_output_data.length > 0){
        render_level_2_main_pie_chart(lost_output_data[0]);
        if(LEVEL_2_LINE_CHART_TIME_FROM == 0 && LEVEL_2_LINE_CHART_TIME_TO == 0){
          $("#time_chart_level_2").val("Thời điểm: "+ return_date_format_ddmmyyhhmmss_2(return_max_time(lost_output_data)))
        }else{
          $("#time_chart_level_2").val("Thời điểm: "+ return_date_format_ddmmyyhhmmss_2(LEVEL_2_LINE_CHART_TIME_FROM) + " - " + return_date_format_ddmmyyhhmmss_2(LEVEL_2_LINE_CHART_TIME_TO))
        }
        // $("#select_lv2_main_line_chart_time_data option[value=now]").empty();
        // $("#select_lv2_main_line_chart_time_data option[value=now]").append("Tức thời: " + return_date_format_ddmmyyhhmmss(lost_output_data[0].meter_time));

      }
    }else{
      render_level_2_main_line_data_lost_output(lost_output_data,other_data)
      // if(LEVEL_2_LINE_CHART_TIME_FROM == 0 && LEVEL_2_LINE_CHART_TIME_TO == 0){
      //   $("#time_chart_level_2").val("Thời điểm: "+ return_date_format_ddmmyyhhmmss_2(new Date().getTime() - 24*60*60*1000) + " - " + return_date_format_ddmmyyhhmmss_2(new Date()))
      // }else{
      //   $("#time_chart_level_2").val("Thời điểm: "+ return_date_format_ddmmyyhhmmss_2(LEVEL_2_LINE_CHART_TIME_FROM) + " - " + return_date_format_ddmmyyhhmmss_2(LEVEL_2_LINE_CHART_TIME_TO))
      // }
      if(lost_output_data.length > 0){
        // $("#select_lv2_main_line_chart_time_data option[value=now]").empty();
        // $("#select_lv2_main_line_chart_time_data option[value=now]").append("Tức thời: " + return_date_format_ddmmyyhhmmss(lost_output_data[lost_output_data.length - 1].meter_time));
      }
    }

    render_info_meter_tong_lv_2(instant_data_tong);
    render_level_2_bar_chart(instant_data_tong);
  })
}

function get_level_2_main_map_data(node_id){
  httpAsync(null,"/get/level_2_main_map_data?node_id="+node_id,"GET",function(result){
    let parse_data = JSON.parse(result);
    let meter_location = parse_data.data.meter_location;
    let draw_map = parse_data.data.draw_map;
    render_level_2_main_map(meter_location,draw_map);
  })
}

function get_level_2_main_line_chart_data(node_id){
  NODE_ID_LV2 = node_id;
  httpAsync(null,"/get/level_2_line_chart_data?node_id="+node_id+"&fr="+LEVEL_2_LINE_CHART_TIME_FROM+"&to="+LEVEL_2_LINE_CHART_TIME_TO,"GET",function(result){
    let parse_data = JSON.parse(result);
    let name = "-";
    if(parse_data.data.name[0].name){
      name = parse_data.data.name[0].name;
    }
    render_level_2_line_chart(parse_data.data.data,name);
  })
}
var LEVEL_2_MAIN_PIE_CHART = null;
function render_level_2_main_pie_chart(lost_out_put_data){

  let name = lost_out_put_data.name
  let remain = Number(lost_out_put_data.sum_nhanh);
  let loss = return_that_thoat (lost_out_put_data.sum_nhanh,lost_out_put_data.sum_tong);
  let no_data = 0;
  $("#general_total_lv_2").html(Number((remain + loss).toFixed(3)) +"(m³)")
  $("#general_lost_lv_2").html(Number(loss.toFixed(3)) + "(m³)")
  if(remain ==0 && loss == 0){
    no_data = 1;
    remain = 100;
    loss = 0;
  }
  am4core.useTheme(am4themes_animated);
  if(LEVEL_2_MAIN_PIE_CHART){
    LEVEL_2_MAIN_PIE_CHART.dispose();
    delete LEVEL_2_MAIN_PIE_CHART;
  }
  LEVEL_2_MAIN_PIE_CHART = am4core.create("main_pie_chart_lv_2", am4charts.PieChart3D);
  LEVEL_2_MAIN_PIE_CHART.hiddenState.properties.opacity = 0;
  LEVEL_2_MAIN_PIE_CHART.data = [
    {
      category: "SL thất thoát",
      value: loss
    },
    {
      category: "SL tiêu thụ",
      value: remain
    }
  ]
  LEVEL_2_MAIN_PIE_CHART.innerRadius = am4core.percent(0);
  LEVEL_2_MAIN_PIE_CHART.depth = 15;
  LEVEL_2_MAIN_PIE_CHART.legend = new am4charts.Legend();
  LEVEL_2_MAIN_PIE_CHART.legend.position = "bottom";
  LEVEL_2_MAIN_PIE_CHART.radius = am4core.percent(75);
  LEVEL_2_MAIN_PIE_CHART.logo.disabled = true;
  // resoivie biểu đồ theo container
  LEVEL_2_MAIN_PIE_CHART.responsive.enabled = true;
  // ẩn phần trăm ở chú thích
  LEVEL_2_MAIN_PIE_CHART.legend.valueLabels.template.disabled = true;

  let series = LEVEL_2_MAIN_PIE_CHART.series.push(new am4charts.PieSeries3D());
  series.dataFields.value = "value";
  series.dataFields.category = "category";
  series.labels.template.maxWidth = 150;
  series.labels.template.wrap = true;
  series.labels.template.fontSize = 15;
  if(no_data == 1){
    series.slices.template.tooltipText = "{category}: {value} (%) (0)";
  }
  // series.slices.template.cornerRadius = 5;
  // series.colors.step = 3;
  series.colors.list = [
    am4core.color(lost_color),
    am4core.color(remain_color),
  ];

  // let container = new am4core.Container();
  // container.parent = series;
  // container.horizontalCenter = "middle";
  // container.verticalCenter = "middle";
  // container.width = am4core.percent(40) / Math.sqrt(2);
  // container.fill = "white";

  // let label = new am4core.Label();
  // label.parent = container;
  // label.text = returnSQLDateFormat2Line(lost_out_put_data.meter_time);
  // label.horizontalCenter = "middle";
  // label.verticalCenter = "middle";
  // label.fontSize = 15;

  // LEVEL_2_MAIN_PIE_CHART.events.on("sizechanged", function(ev) {
  //   let scale = (series.pixelInnerRadius * 2) / label.bbox.width;
  //   if (scale > 1) {
  //     scale = 1;
  //   }
  //   label.scale = scale;
  // })

  let title = LEVEL_2_MAIN_PIE_CHART.titles.create();
  title.text = name;
  title.fontSize = 25;
  title.marginTop = 13;
  title.marginBottom = 5;
  title.fontWeight = "bold";
  $("#loading_main_pie_chart_lv_2").css("display","none");
  $("#main_pie_chart_lv_2").css("display","block");
}

var TYPE_LEVEL_2_DATA_LOST_OUPUT_CHART = "pie";
function change_type_level_2_child_chart(type){
  if(type == "pie"){
    TYPE_LEVEL_2_DATA_LOST_OUPUT_CHART = "pie"
    if(MAIN_LINE__DATA_LOST_OUTPUT_LV_2){
      MAIN_LINE__DATA_LOST_OUTPUT_LV_2.dispose();
      delete MAIN_LINE__DATA_LOST_OUTPUT_LV_2;
    }
    if(LEVEL_2_MAIN_PIE_CHART){
      LEVEL_2_MAIN_PIE_CHART.dispose();
      delete LEVEL_2_MAIN_PIE_CHART;
    }
    $("#level_2_main_chart_container").empty();
    let str = '<div class="text-center" id="loading_main_pie_chart_lv_2" style="width: 100%; height: 500px; min-width: 570px; margin: auto; display: block;"><div class="spinner-border m-5" role="status" style="width: 250px; height: 250px;"><span class="sr-only">Loading...</span></div></div><div class="row" style="width: 100%;"><div id="main_pie_chart_lv_2" style="height: 450px; min-width: 600px; margin: auto; display: none"></div></div><div class="row" style="width: 100%;"><input type="text" readonly="true" class="form-control" value="" style="width: 400px; margin: auto; text-align: center;" id="time_chart_level_2"></div>'
    $("#level_2_main_chart_container").append(str);
    load_level_2_pie_chart(DATA_LOST_OUTPUT_GROUP_ID)

    // load_lv2_again(DATA_LOST_OUTPUT_GROUP_ID);
  }else{
    TYPE_LEVEL_2_DATA_LOST_OUPUT_CHART = "line"
    if(MAIN_LINE__DATA_LOST_OUTPUT_LV_2){
      MAIN_LINE__DATA_LOST_OUTPUT_LV_2.dispose();
      delete MAIN_LINE__DATA_LOST_OUTPUT_LV_2;
    }
    if(LEVEL_2_MAIN_PIE_CHART){
      LEVEL_2_MAIN_PIE_CHART.dispose();
      delete LEVEL_2_MAIN_PIE_CHART;
    }
    let str = '<div class="text-center" id="loading_main_line_data_lost_output_lv_2" style="width: 100%; height: 500px; min-width: 570px; margin: auto; display: block;"><div class="spinner-border m-5" role="status" style="width: 250px; height: 250px;"><span class="sr-only">Loading...</span></div></div><div class="row" style="width: 100%;"><div id="main_line_data_lost_output_lv_2" class="" style="height: 500px; width: 100%; margin: auto; display: none"></div></div>'
    $("#level_2_main_chart_container").empty();
    $("#level_2_main_chart_container").append(str);
    load_level_2_line_chart(DATA_LOST_OUTPUT_GROUP_ID)
    // load_lv2_again(DATA_LOST_OUTPUT_GROUP_ID);
  }
}


var MAIN_LINE__DATA_LOST_OUTPUT_LV_2 = null;
function render_level_2_main_line_data_lost_output(data_chart,meter_id_arr){
  // let data_chart = [];
  // for(let i=0; i<data.length; i++){
  //   data_chart.push({
  //     meter_time: new Date(data[i].meter_time),
  //     loss: ((Number(data[i].sum_nhanh) > Number(data[i].sum_tong)) ? 0 : (Number(data[i].sum_tong)-Number(data[i].sum_nhanh))),
  //     total: Number(data[i].sum_tong),
  //     pressure: null,
  //     flow_rate: null
  //   })
  // }
  // for(let i=0; i<other_data.length; i++){
  //   data_chart.push({
  //     meter_time: new Date((other_data[i].meterTime)),
  //     pressure: stringtonum(other_data[i].pressure),
  //     flow_rate: stringtonum(other_data[i].flowRate),
  //     loss: null,
  //     total: null
  //   })
  // }
  // data_chart.sort(function(a,b){
  //   // Turn your strings into dates, and then subtract them
  //   // to get a value that is either negative, positive, or zero.
  //   return new Date(a.meter_time).getTime() - new Date(b.meter_time).getTime();
  // });

  data_chart.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a.meter_time).getTime() - new Date(b.meter_time).getTime();
  });
  let merge_data = mergeObjectsByA(data_chart);
    
let thickness = 3;
am4core.useTheme(am4themes_animated);
if(MAIN_LINE__DATA_LOST_OUTPUT_LV_2){
  MAIN_LINE__DATA_LOST_OUTPUT_LV_2.dispose();
  delete MAIN_LINE__DATA_LOST_OUTPUT_LV_2;
}
MAIN_LINE__DATA_LOST_OUTPUT_LV_2 = am4core.create("main_line_data_lost_output_lv_2", am4charts.XYChart);
MAIN_LINE__DATA_LOST_OUTPUT_LV_2.scrollbarX = new am4core.Scrollbar();
MAIN_LINE__DATA_LOST_OUTPUT_LV_2.data = merge_data;
MAIN_LINE__DATA_LOST_OUTPUT_LV_2.logo.disabled = true;
let dateAxis = MAIN_LINE__DATA_LOST_OUTPUT_LV_2.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 60;
dateAxis.startLocation = 0.5;
dateAxis.endLocation = 0.5;
dateAxis.renderer.grid.template.location = 0;
dateAxis.renderer.grid.template.disabled = true;
dateAxis.renderer.fullWidthTooltip = true;
// dateAxis.dateFormats.setKey("minutes", "HH:mm");

dateAxis.dateFormats.setKey("hour", "HH:mm");
dateAxis.dateFormats.setKey("day", "dd/MM");
dateAxis.periodChangeDateFormats.setKey("hour", "dd/MM"); 
dateAxis.dateFormats.setKey("month", "MM/yyyy");
dateAxis.periodChangeDateFormats.setKey("day", "MM/yyyy");

MAIN_LINE__DATA_LOST_OUTPUT_LV_2.cursor = new am4charts.XYCursor();
MAIN_LINE__DATA_LOST_OUTPUT_LV_2.cursor.fullWidthLineX = true;
MAIN_LINE__DATA_LOST_OUTPUT_LV_2.cursor.xAxis = dateAxis;
MAIN_LINE__DATA_LOST_OUTPUT_LV_2.cursor.lineX.strokeWidth = 0;
MAIN_LINE__DATA_LOST_OUTPUT_LV_2.cursor.lineX.fill = am4core.color("#000");
MAIN_LINE__DATA_LOST_OUTPUT_LV_2.cursor.lineX.fillOpacity = 0.1;
MAIN_LINE__DATA_LOST_OUTPUT_LV_2.legend = new am4charts.Legend();

let title = MAIN_LINE__DATA_LOST_OUTPUT_LV_2.titles.create();
title.text = "Biểu đồ thất thoát "+ DATA_LOST_OUTPUT_NAME;
title.fontSize = 25;
title.marginTop = 10;
title.marginBottom = 7;
title.fontWeight = "bold";

var m3 = MAIN_LINE__DATA_LOST_OUTPUT_LV_2.yAxes.push(new am4charts.ValueAxis());
m3.tooltip.disabled = false;
m3.renderer.ticks.template.disabled = true;
m3.renderer.axisFills.template.disabled = true;
m3.renderer.line.strokeOpacity = 0.5;
m3.renderer.line.strokeWidth = 1;
m3.title.text ="m3"
m3.renderer.opposite = false;
m3.extraMin = 0.1;
m3.extraMax = 0.1; 

var pressure = MAIN_LINE__DATA_LOST_OUTPUT_LV_2.yAxes.push(new am4charts.ValueAxis());
pressure.tooltip.disabled = false;
pressure.renderer.ticks.template.disabled = true;
pressure.renderer.axisFills.template.disabled = true;
pressure.renderer.line.strokeOpacity = 0.5;
pressure.renderer.line.strokeWidth = 1;
pressure.title.text ="bar"
pressure.renderer.opposite = true;
pressure.extraMin = 0.1;
pressure.extraMax = 0.1; 

var m3h = MAIN_LINE__DATA_LOST_OUTPUT_LV_2.yAxes.push(new am4charts.ValueAxis());
m3h.tooltip.disabled = false;
m3h.renderer.ticks.template.disabled = true;
m3h.renderer.axisFills.template.disabled = true;
m3h.renderer.line.strokeOpacity = 0.5;
m3h.renderer.line.strokeWidth = 1;
m3h.title.text ="m3/h"
m3h.renderer.opposite = false;
m3h.extraMin = 0.1;
m3h.extraMax = 0.1; 

var series;
series = MAIN_LINE__DATA_LOST_OUTPUT_LV_2.series.push(new am4charts.LineSeries());
series.yAxis = m3;
series.dataFields.valueY = "total";
series.dataFields.dateX = "meter_time";
series.title = "Sản lượng";
series.strokeWidth = thickness;
series.tensionX = 1;
series.showOnInit = true;
series.legendSettings.labelText = "Sản lượng (m3)";
series.tooltipText = "Sản lượng" + ": {valueY} " + "(m3)";
series.name = "Sản lượng"
series.tooltip.pointerOrientation = "horizontal";
series.fill = am4core.color(remain_color);
series.stroke = am4core.color(remain_color);
series.fillOpacity = 0.9;

var series_2;
  series_2 = MAIN_LINE__DATA_LOST_OUTPUT_LV_2.series.push(new am4charts.LineSeries());
  series_2.yAxis = m3;
  series_2.dataFields.valueY = "loss";
  series_2.dataFields.dateX = "meter_time";
  series_2.title = "SL thất thoát";
  series_2.strokeWidth = thickness;
  series_2.tensionX = 1;
  series_2.showOnInit = true;
  series_2.legendSettings.labelText = "SL thất thoát (m3)";
  series_2.tooltipText = "SL thất thoát" + ": {valueY} " + "(m3)";
  series_2.name = "SL thất thoát"
  series_2.tooltip.pointerOrientation = "horizontal";
  series_2.fill = am4core.color(lost_color);
  series_2.stroke = am4core.color(lost_color);
  series_2.fillOpacity = 0.8;

  if(meter_id_arr.length == 1){
    var series_3;
    series_3 = MAIN_LINE__DATA_LOST_OUTPUT_LV_2.series.push(new am4charts.LineSeries());
    series_3.yAxis = pressure;
    series_3.dataFields.valueY = meter_id_arr[0]+"_pressure";
    series_3.dataFields.dateX = "meter_time";
    series_3.title = "Áp suất";
    series_3.strokeWidth = thickness;
    series_3.tensionX = 1;
    series_3.showOnInit = true;
    series_3.legendSettings.labelText = "Áp suất (bar)";
    series_3.tooltipText = "Áp suất" + ": {valueY} " + "(bar)";
    series_3.name = "Áp suất "
    series_3.tooltip.pointerOrientation = "horizontal";
    series_3.fill = am4core.color("#ff9900");
    series_3.stroke = am4core.color("#ff9900");

    var series_4;
    series_4 = MAIN_LINE__DATA_LOST_OUTPUT_LV_2.series.push(new am4charts.LineSeries());
    series_4.yAxis = m3h;
    series_4.dataFields.valueY = meter_id_arr[0]+"_flow_rate";
    series_4.dataFields.dateX = "meter_time";
    series_4.title = "Lưu lượng";
    series_4.strokeWidth = thickness;
    series_4.tensionX = 1;
    series_4.showOnInit = true;
    series_4.legendSettings.labelText = "Lưu lượng (m3/h)";
    series_4.tooltipText = "Lưu lượng" + ": {valueY} " + "(m3/h)";
    series_4.name = "Lưu lượng"
    series_4.tooltip.pointerOrientation = "horizontal";
    series_4.fill = am4core.color("#50a605");
    series_4.stroke = am4core.color("#50a605");
  }else{
    for(let i=0; i<meter_id_arr.length; i++){
      var series_3;
      series_3 = MAIN_LINE__DATA_LOST_OUTPUT_LV_2.series.push(new am4charts.LineSeries());
      series_3.yAxis = pressure;
      series_3.dataFields.valueY = meter_id_arr[i]+"_pressure";
      series_3.dataFields.dateX = "meter_time";
      series_3.title = "Áp suất "+meter_id_arr[i];
      series_3.strokeWidth = thickness;
      series_3.tensionX = 1;
      series_3.showOnInit = true;
      series_3.legendSettings.labelText = "Áp suất "+meter_id_arr[i]+" (bar)";
      series_3.tooltipText = "Áp suất " +meter_id_arr[i]+ ": {valueY} " + "(bar)";
      series_3.name = "Áp suất "+ meter_id_arr[i]
      series_3.tooltip.pointerOrientation = "horizontal";
      series_3.fill = am4core.color("#ff9900");
      series_3.stroke = am4core.color("#ff9900");
  
      var series_4;
      series_4 = MAIN_LINE__DATA_LOST_OUTPUT_LV_2.series.push(new am4charts.LineSeries());
      series_4.yAxis = m3h;
      series_4.dataFields.valueY = meter_id_arr[i]+"_flow_rate";
      series_4.dataFields.dateX = "meter_time";
      series_4.title = "Lưu lượng "+meter_id_arr[i];
      series_4.strokeWidth = thickness;
      series_4.tensionX = 1;
      series_4.showOnInit = true;
      series_4.legendSettings.labelText = "Lưu lượng "+meter_id_arr[i]+" (m3/h)";
      series_4.tooltipText = "Lưu lượng " +meter_id_arr[i]+ ": {valueY} " + "(m3/h)";
      series_4.name = "Lưu lượng "+meter_id_arr[i]
      series_4.tooltip.pointerOrientation = "horizontal";
      series_4.fill = am4core.color("#50a605");
      series_4.stroke = am4core.color("#50a605");
    }
  }

  $("#loading_main_line_data_lost_output_lv_2").css("display","none");
  $("#main_line_data_lost_output_lv_2").css("display","block");
}


function export_datalostoutput_level_2(){
  window.open('/get/export_lostdataoutput?fr='+LEVEL_2_LINE_CHART_TIME_FROM+'&to='+LEVEL_2_LINE_CHART_TIME_TO+'&group_id='+DATA_LOST_OUTPUT_GROUP_ID, '_blank');
}

function export_datalostoutput_level_3(){
  window.open('/get/export_lostdataoutput?fr='+LEVEL_3_PIE_CHART_TIME_FROM+'&to='+LEVEL_3_PIE_CHART_TIME_TO+'&group_id='+DATA_LOST_OUTPUT_GROUP_ID, '_blank');
}



function render_info_meter_tong_lv_2(data){
  $("#main_instant_meter_tong_container").empty();
  let string_append = "";
  for(let i=0; i<data.length; i++){
    if(data[i].nhanh_tong == 1){
      string_append += ''                        
      +'<div class="col" style="min-width: 380px; max-width: 400px;">'
      +'<div class="card text-left border_radius">'
      +'<div class="card-body">'
      +'<h3 class="font-weight-bold">'+show_if_null(data[i].name)+'</h3>'
      if(data[i].status == 1){
        string_append += '<span style="font-weight: bold; color: green">'+show_if_null(data[i].meter_id)+'</span>'
        +'<div class="row mt-2 mt-2">'
        +'<i class="fa fa-clock-o display-7 mt-1" aria-hidden="true" style="color: green"></i> <span class="text-uppercase display-7" style="color: green">'+show_if_null(data[i].last_ValOfNum)+'</span>'
        +'</div>'
      }else{
        string_append += '<span style="font-weight: bold; color: red">'+show_if_null(data[i].meter_id)+'</span>'
        +'<div class="row mt-2 mt-2">'
        +'<i class="fa fa-clock-o display-7 mt-1" aria-hidden="true" style="color: red"></i> <span class="text-uppercase display-7" style="color: red">'+show_if_null(data[i].last_ValOfNum)+'</span>'
        +'</div>'
      }
      string_append += ''

      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Sản lượng: </span>'
      +'<span class="ml-auto"><span class="font-weight-bold"></span>'+show_if_null(data[i].last_terminal_index)+' (m3)</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2 mt-2 mb-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Lưu lượng: </span>'
      +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data[i].last_flow_rate)+'</span> (m3/h)</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Áp suất: </span>'
      +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data[i].last_pressure)+'</span> (Bar)</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Sản lượng thuận: </span>'
      +'<span class="ml-auto"><span class="font-weight-bold">'+'-'+'</span> (m3)</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Sản lượng ngược: </span>'
      +'<span class="ml-auto"><span class="font-weight-bold">'+'-'+'</span> (m3</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Mực nước bể: </span>'
      +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data[i].last_measure_cacul)+'</span> (m)</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Tần suất dữ liệu (Phút): </span>'
      +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data[i].frequency)+'</span> (Phút)</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Điện áp pin dự phòng: </span>'
      +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data[i].last_voltage_pin)+'</span> (V)</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Điện áp ác quy: </span> '
      +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data[i].last_voltage_ac_quy)+'</span> (V)</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Thời điểm: </span>'
      +'<span class="ml-auto"><span class="font-weight-bold">'+return_date_format_ddmmyyhhmmss(data[i].last_meter_time)+'</span></span>'
      +'</div>'
      +'</div>'
      +'<div class="card-footer text-right">'
      +'<button class="btn btn-outline-secondary mr-1" title="Gửi bản tin tức thời" onclick="send_instant_mess(`'+data[i].name+'`,`'+data[i].meter_id+'`,`'+data[i].serial_sensor+'`)"><i class="fas fa-eye"></i></button>'
      +'<button class="btn btn-outline-secondary mr-1" title="Chỉ số từng thời điểm" onclick="data_modal(`'+data[i].name+'`,`'+data[i].meter_id+'`,`'+data[i].serial_sensor+'`)"><i class="fas fa-database"></i></button>'
      +'<button class="btn btn-outline-secondary mr-1" title="Biểu đồ" onclick="chart_modal(`'+data[i].name+'`,`'+data[i].meter_id+'`,`'+data[i].serial_sensor+'`)"><i class="fas fa-chart-line"></i></button>'
      +'<button class="btn btn-outline-secondary mr-1" title="Cảnh báo" onclick="alert_modal(`'+data[i].name+'`,`'+data[i].meter_id+'`,`'+data[i].serial_sensor+'`)"><i class="fas fa-exclamation-triangle"></i></button>'
      +'<button class="btn btn-outline-secondary mr-1" onclick="open_modal(`'+data[i].name+'`,`'+data[i].meter_id+'`,`'+data[i].serial_sensor+'`,null)"><i class="fa fa-cog" aria-hidden="true"></i> Chi tiết</button>'
      +'<button class="btn btn-outline-secondary " title="Log" onclick="log_modal(`'+data[i].name+'`,`'+data[i].meter_id+'`,`'+data[i].serial_sensor+'`)"><i class="fas fa-history"></i></button>'
      +'</div>'
      +'</div>'
      +'</div>'
    }
  }
  $("#main_instant_meter_tong_container").append(string_append);
}



var LEVEL_2_MAIN_LINE_CHART = null; 
function render_level_2_line_chart(chart_data, name){
  let data = [];
  for(let i=0; i<chart_data.length; i++){
    data.push({
      meterTime: new Date(chart_data[i].meterTime),
      terminal_index: return_num(chart_data[i].terminal_index),
      flowRate: return_num(chart_data[i].flowRate),
      pressure: return_num(chart_data[i].pressure)
    })
  } 
 let thickness = 3;
  thickness = 3;
  am4core.useTheme(am4themes_animated);
  if(LEVEL_2_MAIN_LINE_CHART != null){
    LEVEL_2_MAIN_LINE_CHART.dispose();
    delete LEVEL_2_MAIN_LINE_CHART;
  }
  LEVEL_2_MAIN_LINE_CHART = am4core.create("main_line_chart_lv_2", am4charts.XYChart);
  LEVEL_2_MAIN_LINE_CHART.scrollbarX = new am4core.Scrollbar();
  LEVEL_2_MAIN_LINE_CHART.data = data;
  LEVEL_2_MAIN_LINE_CHART.logo.disabled = true;

  let dateAxis = LEVEL_2_MAIN_LINE_CHART.xAxes.push(new am4charts.DateAxis());
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

  LEVEL_2_MAIN_LINE_CHART.cursor = new am4charts.XYCursor();
  LEVEL_2_MAIN_LINE_CHART.cursor.fullWidthLineX = true;
  LEVEL_2_MAIN_LINE_CHART.cursor.xAxis = dateAxis;
  LEVEL_2_MAIN_LINE_CHART.cursor.lineX.strokeWidth = 0;
  LEVEL_2_MAIN_LINE_CHART.cursor.lineX.fill = am4core.color("#000");
  LEVEL_2_MAIN_LINE_CHART.cursor.lineX.fillOpacity = 0.1;
  LEVEL_2_MAIN_LINE_CHART.legend = new am4charts.Legend();

  let title = LEVEL_2_MAIN_LINE_CHART.titles.create();
  title.text = "Biểu đồ lưu lượng, áp suất, sản lượng " + name;
  title.fontSize = 25;
  title.marginTop = 10;
  title.marginBottom = 7;
  title.fontWeight = "bold";

  let Pa = LEVEL_2_MAIN_LINE_CHART.yAxes.push(new am4charts.ValueAxis());
  Pa.tooltip.disabled = false;
  Pa.renderer.ticks.template.disabled = true;
  Pa.renderer.axisFills.template.disabled = true;
  Pa.renderer.line.strokeOpacity = 0.5;
  Pa.renderer.line.strokeWidth = 1;
  Pa.title.text ="Pa"
  Pa.renderer.opposite = true;
  Pa.extraMin = 0.1;
  Pa.extraMax = 0.1; 

  var m3h = LEVEL_2_MAIN_LINE_CHART.yAxes.push(new am4charts.ValueAxis());
  m3h.tooltip.disabled = false;
  m3h.renderer.ticks.template.disabled = true;
  m3h.renderer.axisFills.template.disabled = true;
  m3h.renderer.line.strokeOpacity = 0.5;
  m3h.renderer.line.strokeWidth = 1;
  m3h.title.text ="m3/h"
  m3h.renderer.opposite = false;
  m3h.extraMin = 0.1;
  m3h.extraMax = 0.1; 

  var m3 = LEVEL_2_MAIN_LINE_CHART.yAxes.push(new am4charts.ValueAxis());
  m3.tooltip.disabled = false;
  m3.renderer.ticks.template.disabled = true;
  m3.renderer.axisFills.template.disabled = true;
  m3.renderer.line.strokeOpacity = 0.5;
  m3.renderer.line.strokeWidth = 1;
  m3.title.text ="m3"
  m3.renderer.opposite = true;
  m3.extraMin = 0.1;
  m3.extraMax = 0.1; 
  
  function creatAxisAndSeries(i){
   
    var series;
    series = LEVEL_2_MAIN_LINE_CHART.series.push(new am4charts.LineSeries());
    switch (i){     // water
      case 0: series.yAxis = Pa;
      series.dataFields.valueY = "pressure";
      series.title = "Áp suất";
      series.legendSettings.labelText = "Áp suất (Pa)";
      series.tooltipText ="Áp suất" + ": {valueY} " + "(Pa)";
      series.name = "Áp suất";
      series.fill = am4core.color("#ff9900");
      series.stroke = am4core.color("#ff9900");
      series.dataFields.dateX = "meterTime";
      series.strokeWidth = thickness;
      series.tensionX = 1;
      series.showOnInit = true;
      series.tooltip.pointerOrientation = "horizontal";
      break;
      case 1: series.yAxis = m3h;
      series.dataFields.valueY = "flowRate";
      series.title = "Lưu lượng";
      series.legendSettings.labelText = "Lưu lượng (m3/h)";
      series.tooltipText ="Lưu lượng" + ": {valueY} " + "(m3/h)";
      series.name = "Lưu lượng";
      series.fill = am4core.color("#50a605");
      series.stroke = am4core.color("#50a605");
      series.dataFields.dateX = "meterTime";
      series.strokeWidth = thickness;
      series.tensionX = 1;
      series.showOnInit = true;
      series.tooltip.pointerOrientation = "horizontal";
      break;
      case 2: series.yAxis = m3;
      series.dataFields.valueY = "terminal_index";
      series.title = "Sản lượng";
      series.legendSettings.labelText = "Sản lượng (m3)";
      series.tooltipText ="Sản lượng" + ": {valueY} " + "(m3)";
      series.name = "Sản lượng lượng";
      series.fill = am4core.color(remain_color);
      series.stroke = am4core.color(remain_color);
      series.dataFields.dateX = "meterTime";
      series.strokeWidth = thickness;
      series.tensionX = 1;
      series.showOnInit = true;
      series.tooltip.pointerOrientation = "horizontal";
      break;
    }


  }

  for(let i=0; i<3; i++){
    creatAxisAndSeries(i);
  }
}

var LEVEL_2_MAIN_BAR_CHART = null;

function render_level_2_bar_chart(data){
  let chart_data = [];
  for(let i=0; i<data.length; i++){
    if(data[i].nhanh_tong == 0){
      chart_data.push({
        name: data[i].name,
        flow_rate: return_num_bar(data[i].last_flow_rate),
        pressure: return_num_bar(data[i].last_pressure),
        terminal_index: return_num_bar(data[i].last_terminal_index)
      })
    }
  }
  
  am4core.useTheme(am4themes_animated);
  if(LEVEL_2_MAIN_BAR_CHART != null){
    LEVEL_2_MAIN_BAR_CHART.dispose();
    delete LEVEL_2_MAIN_BAR_CHART;
  }
  LEVEL_2_MAIN_BAR_CHART = am4core.create('main_bar_chart_lv_2', am4charts.XYChart)
  LEVEL_2_MAIN_BAR_CHART.data = chart_data;
  LEVEL_2_MAIN_BAR_CHART.logo.disabled = true;
  LEVEL_2_MAIN_BAR_CHART.scrollbarX = new am4core.Scrollbar();

  var xAxis = LEVEL_2_MAIN_BAR_CHART.xAxes.push(new am4charts.CategoryAxis())
  xAxis.dataFields.category = 'name'
  xAxis.renderer.cellStartLocation = 0.1
  xAxis.renderer.cellEndLocation = 0.9
  xAxis.renderer.grid.template.location = 0;
  xAxis.renderer.grid.template.location = 0;
  xAxis.renderer.grid.template.disabled = true;
  xAxis.renderer.fullWidthTooltip = true;

// var label = xAxis.renderer.labels.template;
// label.truncate = true;
// label.maxWidth = 100;
// label.tooltipText = "{category}";



LEVEL_2_MAIN_BAR_CHART.cursor = new am4charts.XYCursor();
LEVEL_2_MAIN_BAR_CHART.cursor.fullWidthLineX = true;
LEVEL_2_MAIN_BAR_CHART.cursor.xAxis = xAxis;
LEVEL_2_MAIN_BAR_CHART.cursor.lineX.strokeWidth = 0;
LEVEL_2_MAIN_BAR_CHART.cursor.lineX.fill = am4core.color("#000");
LEVEL_2_MAIN_BAR_CHART.cursor.lineX.fillOpacity = 0.1;
LEVEL_2_MAIN_BAR_CHART.legend = new am4charts.Legend()
  
LEVEL_2_MAIN_BAR_CHART.legend.position = 'bottom'
LEVEL_2_MAIN_BAR_CHART.legend.paddingBottom = 20
LEVEL_2_MAIN_BAR_CHART.legend.labels.template.maxWidth = 95
  // chart.legend.labels.template.text = "{name}";
  
  var m3h = LEVEL_2_MAIN_BAR_CHART.yAxes.push(new am4charts.ValueAxis());
  m3h.min = 0;
  m3h.tooltip.disabled = false;
  m3h.renderer.ticks.template.disabled = true;
  m3h.renderer.axisFills.template.disabled = true;
  m3h.renderer.line.strokeOpacity = 0.5;
  m3h.renderer.line.strokeWidth = 1;
  m3h.title.text ="m3h"
  m3h.renderer.opposite = false;

  m3h.renderer.labels.template.disabled = true;
  m3h.tooltip.disabled = false;

  var m3 = LEVEL_2_MAIN_BAR_CHART.yAxes.push(new am4charts.ValueAxis());
  m3.min = 0;
  m3.tooltip.disabled = false;
  m3.renderer.ticks.template.disabled = true;
  m3.renderer.axisFills.template.disabled = true;
  m3.renderer.line.strokeOpacity = 0.5;
  m3.renderer.line.strokeWidth = 1;
  m3.title.text ="m3"
  m3.renderer.opposite = false;

  m3.renderer.labels.template.disabled = true;
  m3.tooltip.disabled = true;

  var pa = LEVEL_2_MAIN_BAR_CHART.yAxes.push(new am4charts.ValueAxis());
  pa.min = 0;
  pa.tooltip.disabled = false;
  pa.renderer.ticks.template.disabled = true;
  pa.renderer.axisFills.template.disabled = true;
  pa.renderer.line.strokeOpacity = 0.5;
  pa.renderer.line.strokeWidth = 1;
  pa.title.text ="Pa"
  pa.renderer.opposite = true;

  pa.renderer.labels.template.disabled = true;
  pa.tooltip.disabled = false;



  function createSeries(value, name) {
    var series = LEVEL_2_MAIN_BAR_CHART.series.push(new am4charts.ColumnSeries())
    series.columns.template.fillOpacity = 1;
    series.columns.template.strokeOpacity = 1;
    switch(value){
      case "flow_rate":
        series.yAxis = m3h;
        series.fill = am4core.color("#50a605");
        series.stroke = am4core.color("#50a605");
        series.tooltipText = "Lưu lượng: {valueY} (m3/h)"
        break;
      case "pressure":
        series.yAxis = pa;
        series.fill = am4core.color("#ff9900");
        series.stroke = am4core.color("#ff9900");
        series.tooltipText = "Áp suất: {valueY} (Pa)"

        break;
      case "terminal_index":
        series.yAxis = m3;
        series.fill = am4core.color(remain_color);
        series.stroke = am4core.color(remain_color);
        series.tooltipText = "Sản lượng: {valueY} (m3)"
        break;
    }
    series.dataFields.valueY = value;
    series.dataFields.categoryX = "name";
    series.title = name;
    series.tensionX = 0.9;
    series.showOnInit = true;
    series.legendSettings.labelText = name
    series.name = name;
    series.tooltip.pointerOrientation = "horizontal";

    // series.dataFields.valueY = value
    // series.dataFields.categoryX = 'name'
    // series.strokeWidth = 3;
    // series.showOnInit = true;
    // series.tooltip.pointerOrientation = "horizontal";

    // series.events.on("hidden", arrangeColumns);
    // series.events.on("shown", arrangeColumns);

    // var bullet = series.bullets.push(new am4charts.LabelBullet())
    // bullet.interactionsEnabled = false
    // bullet.dy = 30;
    // bullet.label.text = '{valueY}'
    // bullet.label.fill = am4core.color('#ffffff')
    // return series;
  }
  // chart.data = chart_data;

  createSeries('flow_rate', 'Lưu lượng');
  createSeries('pressure', 'Áp suất');
  createSeries('terminal_index', 'Sản lượng');

  function arrangeColumns() {

    var series = chart.series.getIndex(0);

    var w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
    if (series.dataItems.length > 1) {
        var x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        var x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        var delta = ((x1 - x0) / chart.series.length) * w;
        if (am4core.isNumber(delta)) {
            var middle = chart.series.length / 2;

            var newIndex = 0;
            chart.series.each(function(series) {
                if (!series.isHidden && !series.isHiding) {
                    series.dummyData = newIndex;
                    newIndex++;
                }
                else {
                    series.dummyData = chart.series.indexOf(series);
                }
            })
            var visibleCount = newIndex;
            var newMiddle = visibleCount / 2;

            chart.series.each(function(series) {
                var trueIndex = chart.series.indexOf(series);
                var newIndex = series.dummyData;

                var dx = (newIndex - trueIndex + middle - newMiddle) * delta

                series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            })
        }
    }
  }
}

var LEVEL_2_MAIN__MAP = null;
function render_level_2_main_map(meter_location,draw_map){
  let uluru = {lat: 21.07373590613005, lng: 107.32095614446187};
  if(meter_location.length > 0){
    for(let i=0; i<meter_location.length; i++){
      if(meter_location[i].location_lat != null && meter_location[i].location_long != null){
        uluru = {
          lat: Number(meter_location[i].location_lat),
          lng: Number(meter_location[i].location_long)
        }
        break;
      }
    }
  }
  let options = {
    zoom : 15,
    center: uluru,
    // lickableIcons: false,
    styles: [
      {
        featureType: "transit",
        elementType: "labels",
        stylers: [
              { visibility: "off" }
        ]
    },
      {
          featureType: "poi",
          elementType: "labels",
          stylers: [
                { visibility: "off" }
          ]
      }
    ]
  }
  LEVEL_2_MAIN__MAP = new google.maps.Map(document.getElementById("main_map_lv_2"), options);
  let marker = null;
  for(let i=0; i<meter_location.length; i++){
      let coords = {lat: Number(meter_location[i].location_lat), lng:Number(meter_location[i].location_long)};
      if(meter_location[i].level_icon == 1){
        if(meter_location[i].status_alert == 1){
          marker = new google.maps.Marker({
            opacity: 1,
            position: coords,
            map: LEVEL_2_MAIN__MAP,
            animation: google.maps.Animation.DROP,
            icon: {
              url: "/images/father-wt-meter-icon-red.png",
              scaledSize: new google.maps.Size(60, 46), // scaled size
              // origin: new google.maps.Point(0,0), // origin
              // anchor: new google.maps.Point(0, 0) // anchor
            },
            // title: 'Uluru (Ayers Rock)'
          })
        }else{
          marker = new google.maps.Marker({
            opacity: 1,
            position: coords,
            map: LEVEL_2_MAIN__MAP,
            animation: google.maps.Animation.DROP,
            icon: {
              url: "/images/father-wt-meter-icon.png",
              scaledSize: new google.maps.Size(60, 46), // scaled size
              // origin: new google.maps.Point(0,0), // origin
              // anchor: new google.maps.Point(0, 0) // anchor
            },
            // title: 'Uluru (Ayers Rock)'
          })
        }

      }else if(meter_location[i].level_icon == 2){
        if(meter_location[i].status_alert == 1){
          marker = new google.maps.Marker({
            opacity: 1,
            position: coords,
            map: LEVEL_2_MAIN__MAP,
            animation: google.maps.Animation.DROP,
            icon: {
              url: "/images/wt-meter-icon-level_2-red.png",
              scaledSize: new google.maps.Size(40, 32), // scaled size
              // origin: new google.maps.Point(0,0), // origin
              // anchor: new google.maps.Point(0, 0) // anchor
            },
            // title: 'Uluru (Ayers Rock)'
          })
        }else{
          marker = new google.maps.Marker({
            opacity: 1,
            position: coords,
            map: LEVEL_2_MAIN__MAP,
            animation: google.maps.Animation.DROP,
            icon: {
              url: "/images/wt-meter-icon-level_2.png",
              scaledSize: new google.maps.Size(40, 32), // scaled size
              // origin: new google.maps.Point(0,0), // origin
              // anchor: new google.maps.Point(0, 0) // anchor
            },
            // title: 'Uluru (Ayers Rock)'
          })
        }

      }else if(meter_location[i].level_icon == 3){
        if(meter_location[i].status_alert == 1){
          marker = new google.maps.Marker({
            opacity: 1,
            position: coords,
            map: LEVEL_2_MAIN__MAP,
            animation: google.maps.Animation.DROP,
            icon: {
              url: "/images/wt-meter-icon-red.png",
              scaledSize: new google.maps.Size(30, 27), // scaled size
              // origin: new google.maps.Point(0,0), // origin
              // anchor: new google.maps.Point(0, 0) // anchor
            },
            // title: 'Uluru (Ayers Rock)'
          })
        }else{
          marker = new google.maps.Marker({
            opacity: 1,
            position: coords,
            map: LEVEL_2_MAIN__MAP,
            animation: google.maps.Animation.DROP,
            icon: {
              url: "/images/wt-meter-icon.png",
              scaledSize: new google.maps.Size(30, 27), // scaled size
              // origin: new google.maps.Point(0,0), // origin
              // anchor: new google.maps.Point(0, 0) // anchor
            },
            // title: 'Uluru (Ayers Rock)'
          })
        }

      }else{
        marker = new google.maps.Marker({
          opacity: 1,
          position: coords,
          map: LEVEL_2_MAIN__MAP,
          animation: google.maps.Animation.DROP,
          icon: RED_MARKER
          // title: 'Uluru (Ayers Rock)'
        })
      }
      let content = meter_location[i].name + return_alert_text(meter_location[i]);                  
      marker['infowindow'] = new google.maps.InfoWindow({
        content: content
      });
    //   google.maps.event.addListener(marker, 'click', function () {
    //     // this['infowindow'].open(map, this);
    //     open_modal();
    // });
    google.maps.event.addListener(marker, 'mouseover', function () {
      this['infowindow'].open(LEVEL_2_MAIN__MAP, this);
    });
    google.maps.event.addListener(marker, 'mouseout', function () {
      this['infowindow'].close(LEVEL_2_MAIN__MAP, this);
    });
    google.maps.event.addListener(marker, 'click', function () {
    // this['infowindow'].open(map, this);
    open_modal(meter_location[i].name,meter_location[i].id,meter_location[i].serial_sensor,null);
    });

  }

  for(let i=0; i<draw_map.length; i++){
    let zone_map = JSON.parse(draw_map[i].zone_map);
    let color_zone_map = "#36aff5";
    if(draw_map[i].status){
      color_zone_map = "#f0434f"
    }
      let polygon = new google.maps.Polygon({
      paths: zone_map,
      strokeColor: color_zone_map,
      strokeOpacity: 0.6,
      strokeWeight: 1,
      fillColor: color_zone_map,
      fillOpacity: 0.35,
      draggable: false,
      geodesic: true,
      });
      polygon.setMap(LEVEL_2_MAIN__MAP)
  
  }

  for(let i=0; i<draw_map.length; i++){
    let line_map = JSON.parse(draw_map[i].line_map);
    for(let j=0; j<line_map.length; j++){
      let flightPath = new google.maps.Polyline({
        path: line_map[j],
        geodesic: true,
        strokeColor: "#0074c2",
        strokeOpacity: 1.0,
        strokeWeight: 3,
        });
        flightPath.setMap(LEVEL_2_MAIN__MAP);

        var infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(flightPath, 'mouseover', function (event) {
          let point = event.latLng.toJSON();
          infowindow.setPosition(point);
          infowindow.setContent("group_id: " + draw_map[i].group_id);

          infowindow.open(LEVEL_2_MAIN__MAP);
        });
        google.maps.event.addListener(flightPath, 'mouseout', function () {
          infowindow.close(LEVEL_2_MAIN__MAP);
        });

    }
  }

  // for(let i=0; i<draw_map.length; i++){
  //   let line_map = JSON.parse(draw_map[i].line_map);
  //   for(let j=0; j<line_map.length; j++){
  //     let flightPath = new google.maps.Polyline({
  //       path: line_map[j],
  //       geodesic: true,
  //       strokeColor: "#0074c2",
  //       strokeOpacity: 1.0,
  //       strokeWeight: 3,
  //       });
  //       flightPath.setMap(LEVEL_2_MAIN__MAP);
  //   }
  //   let color_zone_map = "#36aff5";
  //   if(draw_map[i].status){
  //     color_zone_map = "#f0434f"
  //   }
  //   let zone_map = JSON.parse(draw_map[i].zone_map);
  //     let polygon = new google.maps.Polygon({
  //     paths: zone_map,
  //     strokeColor: color_zone_map,
  //     strokeOpacity: 0.6,
  //     strokeWeight: 1,
  //     fillColor: color_zone_map,
  //     fillOpacity: 0.35,
  //     draggable: false,
  //     geodesic: true,
  //     });
  //     polygon.setMap(LEVEL_2_MAIN__MAP)
  // }
}



// màn 3
var LEVEL_3_LINE_CHART_TIME_TO = -2
var LEVEL_3_LINE_CHART_TIME_FROM = -2
// $(document).ready(function(){   // thay đổi khoảng thời gian hiển thị chỉ số theo thời điểm
//   $("#select_lv_3_main_line_chart_time_data").change(function(){
//       let x = new Date();
//       let val = $(this).children("option:selected").val();
//       if(val == "custom"){
//           $("#pick_lv_3_main_line_chart_time_data").css("display","block");
//           $("#pick_lv3_main_line_chart_time_data_container").css("display","block");
//       }else{
//           $("#pick_lv_3_main_line_chart_time_data").css("display","none");
//           $("#pick_lv3_main_line_chart_time_data_container").css("display","none");
//       }
//       switch(val){
//           case "24hour":
//             LEVEL_3_LINE_CHART_TIME_TO = x.getTime();
//             LEVEL_3_LINE_CHART_TIME_FROM = LEVEL_3_LINE_CHART_TIME_TO - 24*3600000;
//             load_level_3_line_chart(DATA_LOST_OUTPUT_GROUP_ID);
//             break;
//           case "week":
//             LEVEL_3_LINE_CHART_TIME_TO = -2;
//             LEVEL_3_LINE_CHART_TIME_FROM = -2;
//             load_level_3_line_chart(DATA_LOST_OUTPUT_GROUP_ID);
//             break;
//           case "month":
//             LEVEL_3_LINE_CHART_TIME_TO = -3;
//             LEVEL_3_LINE_CHART_TIME_FROM = -3;
//             load_level_3_line_chart(DATA_LOST_OUTPUT_GROUP_ID);
//             break;
//       }
//   })
// })
// $(function() {
//   $('#pick_lv_3_main_line_chart_time_data').daterangepicker(  // pick khoảng thời gian cụ thể
//     {
//        startDate: moment().startOf('hour'),
//        endDate: moment().startOf('hour'),
//        showDropdowns: true,
//        showWeekNumbers: true,
//        timePicker: true,
//        timePickerIncrement: 1,
//        timePicker12Hour: true,
//        opens: 'left',
//        buttonClasses: ['btn btn-default'],
//        applyClass: 'btn-small btn-primary',
//        cancelClass: 'btn-small',
//        format: 'DD/MM/YYYY',
//        separator: ' to ',
//        locale: {
//            applyLabel: 'Submit',
//            fromLabel: 'From',
//            toLabel: 'To',
//            customRangeLabel: 'Custom Range',
//            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
//            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
//            firstDay: 1,
//            format: 'M/DD hh:mm A'
//        }
//     },
//     function(start, end) {
//       LEVEL_3_LINE_CHART_TIME_FROM = new Date(start).getTime() ;
//       LEVEL_3_LINE_CHART_TIME_TO = new Date(end).getTime();
//       // get_level_2_main_line_chart_data(NODE_ID_LV2)   
//       load_level_3_line_chart(DATA_LOST_OUTPUT_GROUP_ID);
//     }
//  );
// });



var LEVEL_3_PIE_CHART_TIME_TO = 0
var LEVEL_3_PIE_CHART_TIME_FROM = 0
$(document).ready(function(){   // thay đổi khoảng thời gian hiển thị chỉ số theo thời điểm
  $("#select_lv_3_main_pie_chart_time_data").change(function(){
      let x = new Date();
      let val = $(this).children("option:selected").val();
      if(val == "custom"){
          $("#pick_lv_3_main_pie_chart_time_data").css("display","block");
          $("#pick_lv3_main_pie_chart_time_data_container").css("display","block");
      }else{
          $("#pick_lv_3_main_pie_chart_time_data").css("display","none");
          $("#pick_lv3_main_pie_chart_time_data_container").css("display","none");
      }
      switch(val){
          case "now":
            LEVEL_3_PIE_CHART_TIME_TO = 0;
            LEVEL_3_PIE_CHART_TIME_FROM = 0;
            load_level_3_pie_chart(DATA_LOST_OUTPUT_GROUP_ID);
            load_level_3_line_chart(DATA_LOST_OUTPUT_GROUP_ID);
            break;
          case "24hour":
            LEVEL_3_PIE_CHART_TIME_TO = -1;
            LEVEL_3_PIE_CHART_TIME_FROM = -1;
            load_level_3_pie_chart(DATA_LOST_OUTPUT_GROUP_ID);
            load_level_3_line_chart(DATA_LOST_OUTPUT_GROUP_ID);
            break;
          case "week":
            LEVEL_3_PIE_CHART_TIME_TO = -2;
            LEVEL_3_PIE_CHART_TIME_FROM = -2;
            load_level_3_pie_chart(DATA_LOST_OUTPUT_GROUP_ID);
            load_level_3_line_chart(DATA_LOST_OUTPUT_GROUP_ID);
            break;
          case "month":
            LEVEL_3_PIE_CHART_TIME_TO = -3;
            LEVEL_3_PIE_CHART_TIME_FROM = -3;
            load_level_3_pie_chart(DATA_LOST_OUTPUT_GROUP_ID);
            load_level_3_line_chart(DATA_LOST_OUTPUT_GROUP_ID);
            break;
      }
  })
})
$(function() {
  $('#pick_lv_3_main_pie_chart_time_data').daterangepicker(  // pick khoảng thời gian cụ thể
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
      LEVEL_3_PIE_CHART_TIME_FROM = new Date(start).getTime() ;
      LEVEL_3_PIE_CHART_TIME_TO = new Date(end).getTime();
      // get_level_2_main_line_chart_data(NODE_ID_LV2)   
      load_level_3_pie_chart(DATA_LOST_OUTPUT_GROUP_ID);
      load_level_3_line_chart(DATA_LOST_OUTPUT_GROUP_ID);
    }
 );
});





function load_level_3_data(node_id){
  previous_screen = screen;
  screen = 3;
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  $(".page_").hide();
  $(".page_").prop("disabled",true);
  $("#page_3").show();
  $("#page_3").prop("disabled",false);
  $(".lv5_hide").prop("disabled",false);
  $(".lv5_hide").css("display","block");
  // LEVEL_3_LINE_CHART_TIME_FROM = -2;
  // LEVEL_3_LINE_CHART_TIME_TO = -2;
  LEVEL_3_PIE_CHART_TIME_TO = 0;
  LEVEL_3_PIE_CHART_TIME_FROM = 0;
  // $("#pick_lv_3_main_line_chart_time_data").data("daterangepicker").setStartDate(moment().startOf('hour'));
  // $("#pick_lv_3_main_line_chart_time_data").data("daterangepicker").setEndDate(moment().startOf('hour'));
  // $("#select_lv_3_main_line_chart_time_data").find('select').prop('selectedIndex',1);
  // $("#pick_lv_3_main_pie_chart_time_data").data("daterangepicker").setStartDate(moment().startOf('hour'));
  // $("#pick_lv_3_main_pie_chart_time_data").data("daterangepicker").setEndDate(moment().startOf('hour'));
  $("#pick_lv_3_main_pie_chart_time_data").css("display","none");
  $("#pick_lv3_main_pie_chart_time_data_container").css("display","none");
  $("#select_lv_3_main_pie_chart_time_data").prop('selectedIndex',0);
  load_genera_data(node_id,"meter_status_lv_3");
  load_mess_rate(node_id,"mess_rate_lv_3")

  load_level_3_ins_data(node_id);
  load_level_3_line_chart(node_id);
  load_level_3_pie_chart(node_id);
}

let INS_DATA_LV_3 = [];
function load_level_3_ins_data(node_id){
  httpAsync(null,"/get/ins_data_level_3?node_id="+node_id,"GET",function(result){
    let parse_data = JSON.parse(result);
    let data = parse_data.data;
    render_info_meter_tong_lv_3(data);
    render_info_meter_nhanh_lv_3(data);
    INS_DATA_LV_3 = data;
    
  })
}


function load_level_3_pie_chart(node_id){
  httpAsync(null,"/get/pie_chart_data_level_3?node_id="+node_id+"&fr="+LEVEL_3_PIE_CHART_TIME_FROM+"&to="+LEVEL_3_PIE_CHART_TIME_TO,"GET",function(result){
    let parse_data = JSON.parse(result);
    let data = parse_data.data;
    if(parse_data.err_code == 0){
      $("#lv_3_setting").show();
      $("#lv_3_setting").prop("disabled",false);
      render_level_3_main_pie_chart(data[0])
      if(LEVEL_3_PIE_CHART_TIME_FROM == 0 && LEVEL_3_PIE_CHART_TIME_TO == 0){
        $("#time_chart_level_3").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(return_max_time(data)))
      }else{
        if((LEVEL_3_PIE_CHART_TIME_FROM == -2 && LEVEL_3_PIE_CHART_TIME_TO == -2) || (LEVEL_3_PIE_CHART_TIME_FROM == -3 && LEVEL_3_PIE_CHART_TIME_TO == -3)){
          $("#time_chart_level_3").val("Thời điểm: "+return_day_format_ddmmyyhhmmss(LEVEL_3_PIE_CHART_TIME_FROM) + " - " + return_day_format_ddmmyyhhmmss(LEVEL_3_PIE_CHART_TIME_TO))
        }else if(LEVEL_3_PIE_CHART_TIME_FROM == -1 && LEVEL_3_PIE_CHART_TIME_TO == -1){
          $("#time_chart_level_3").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(new Date().getTime() - 24*3600000) + " - " + return_date_format_ddmmyyhhmmss_2(new Date().getTime()))
        }else{
          $("#time_chart_level_3").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(LEVEL_3_PIE_CHART_TIME_FROM) + " - " + return_date_format_ddmmyyhhmmss_2(LEVEL_3_PIE_CHART_TIME_TO))
        }
      }
    }else{
      if(LEVEL_3_MAIN_PIE_CHART){
        LEVEL_3_MAIN_PIE_CHART.dispose();
        delete LEVEL_3_MAIN_PIE_CHART;
      }
    }
  })
}

function add_flow_rate(data){
  for(let i=0; i<data.length-1; i++){
    data[i].flow_rate = ((data[i+1].ValOfNum - data[i].ValOfNum)/((new Date(data[i+1].minMeterTime).getTime() - new Date(data[i].minMeterTime).getTime())/3600000)).toFixed(3)
  }
  return data;
}


function load_level_3_line_chart(node_id){
  if(LEVEL_3_MAIN_LINE_CHART){
    LEVEL_3_MAIN_LINE_CHART.dispose();
    delete LEVEL_3_MAIN_LINE_CHART;
  }
  $("#loading_main_line_chart_lv_3").css("display","block");
  $("#main_line_chart_lv_3").css("display","none");
  httpAsync(null,"/get/line_chart_data_level_3?node_id="+node_id+"&fr="+LEVEL_3_PIE_CHART_TIME_FROM+"&to="+LEVEL_3_PIE_CHART_TIME_TO,"GET",function(result){
    let parse_data = JSON.parse(result);
    let data = parse_data.data.data;
    let meter_id_arr = parse_data.data.meter_id_arr;
    let chart_data = [];
    for(let i=0; i<data[0].length; i++){
      chart_data.push({
        meter_time: new Date(data[0][i].meter_time),
        loss: ((Number(data[0][i].sum_nhanh) > Number(data[0][i].sum_tong)) ? 0 : (Number(data[0][i].sum_tong)-Number(data[0][i].sum_nhanh))),
        total: Number(data[0][i].sum_tong)
      })
    }
    if((LEVEL_3_PIE_CHART_TIME_TO == -2 && LEVEL_3_PIE_CHART_TIME_FROM == -2) || (LEVEL_3_PIE_CHART_TIME_TO == -3 && LEVEL_3_PIE_CHART_TIME_FROM == -3)){
      let orther_data = [];
      for(let i=1; i<data.length; i++){
        orther_data.push(add_flow_rate(data[i]))
      }
      for(let i=0; i<orther_data.length; i++){
        for(let j=0; j<orther_data[i].length; j++){
          let x = {
            meter_time: new Date(orther_data[i][j].meterTime),
          }
          x[meter_id_arr[i]+"_pressure"] = stringtonum(orther_data[i][j].pressure)
          x[meter_id_arr[i]+"_flow_rate"] = stringtonum(orther_data[i][j].flow_rate)
          chart_data.push(x)
        }
      }
      render_level_3_main_line_data_lost_output(chart_data,meter_id_arr)
    }else{
      for(let i=1; i<data.length; i++){
        for(let j=0; j<data[i].length;j++){
          let x = {
            meter_time: new Date(data[i][j].meterTime),
          }
          x[meter_id_arr[i-1]+"_pressure"] = stringtonum(data[i][j].pressure)
          x[meter_id_arr[i-1]+"_flow_rate"] = stringtonum(data[i][j].flowRate)
          chart_data.push(x)
        }
      }
      render_level_3_main_line_data_lost_output(chart_data,meter_id_arr)
    }


   
    // if(have_child){
    //   $("#lv_3_setting").show();
    //   $("#lv_3_setting").prop("disabled",false);
    //   render_level_3_main_line_data_lost_output(lost_data,other_data);
    // }else{
    //   if(LEVEL_3_MAIN_LINE_CHART){
    //     LEVEL_3_MAIN_LINE_CHART.dispose();
    //     delete LEVEL_3_MAIN_LINE_CHART;
    //   }
    // }
  })
}



function render_info_meter_nhanh_lv_3(ins_data){
  let string_append = "";
  $("#level_3_data_container").empty();
  let data_nhanh = [];
  for(let i=0; i<ins_data.length; i++){
      data_nhanh.push(ins_data[i])
  }
  for(let i=0; i<data_nhanh.length; i++){
      string_append += return_content_level_3(data_nhanh[i],i,data_nhanh.length)
  }
  $("#level_3_data_container").append(string_append);
}


// function get_render_chart_and_info_tong_lv_3(node_id){
//   httpAsync(null,"/get/data_level_3?node_id="+node_id+"&fr="+LEVEL_3_LINE_CHART_TIME_FROM+"&to="+LEVEL_3_LINE_CHART_TIME_TO+"&type="+TYPE_LEVEL_3_DATA_LOST_OUPUT_CHART,"GET",function(result){
//     let parse_data = JSON.parse(result);
//     let data = parse_data.data;
//     let ins_data = data.ins_data;
//     let lost_data = data.lost_data;
//     let other_data = data.other_data;
//     let have_child = data.have_child;   
//     if(TYPE_LEVEL_3_DATA_LOST_OUPUT_CHART == "pie"){
//       if(have_child){
//         $("#lv_3_setting").show();
//         $("#lv_3_setting").prop("disabled",false);
//         // $("#level_3_main_chart_container").empty();
//         // let str = '<div id="main_pie_chart_lv_3" class="" style="height: 450px; min-width: 600px; margin: auto;"></div>'
//         // $("#level_3_main_chart_container").append(str);
//         if(lost_data.length > 0){
//           render_level_3_main_pie_chart(lost_data[0])
//           if(LEVEL_3_LINE_CHART_TIME_FROM == 0 && LEVEL_3_LINE_CHART_TIME_TO == 0){
//             $("#time_chart_level_3").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(return_max_time(lost_data)))
//           }else{
//             $("#time_chart_level_3").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(LEVEL_3_LINE_CHART_TIME_FROM) + " - " + return_date_format_ddmmyyhhmmss_2(LEVEL_3_LINE_CHART_TIME_TO))
//           }
//           // $("#select_lv_3_main_line_chart_time_data option[value=now]").empty();
//           // $("#select_lv_3_main_line_chart_time_data option[value=now]").append("Tức thời: " + return_date_format_ddmmyyhhmmss(lost_data[0].meter_time));
//         }
//       }else{
//         if(LEVEL_3_MAIN_LINE_CHART){
//           LEVEL_3_MAIN_LINE_CHART.dispose();
//           delete LEVEL_3_MAIN_LINE_CHART;
//         }
//         if(LEVEL_3_MAIN_PIE_CHART){
//           LEVEL_3_MAIN_PIE_CHART.dispose();
//           delete LEVEL_3_MAIN_PIE_CHART;
//         }
//         // $("#level_3_main_chart_container").empty();
//         // $("#lv_3_setting").hide();
//         // $("#lv_3_setting").prop("disabled",true);
//       }
//     }else{
//       if(have_child){
//         $("#lv_3_setting").show();
//         $("#lv_3_setting").prop("disabled",false);
//         $("#level_3_main_chart_container").empty();
//         let str = '<div class="row" style="width: 100%;"><div id="main_line_chart_lv_3" class="" style="height: 650px; width: 100%; margin: auto;"></div></div><div class="row" style="width: 100%;"><input type="text" readonly="true" class="form-control" value="" style="width: 400px; margin: auto; text-align: center;" id="time_chart_level_3"></div>'
//         $("#level_3_main_chart_container").append(str);
//         // $("#level_3_main_chart_container").append('<div id="main_line_chart_lv_3" class="" style="height: 650px; min-width: 700px; margin: auto;"></div>');
//         render_level_3_main_line_data_lost_output(lost_data,other_data)
//         if(lost_data.length>0){
//           if(LEVEL_3_LINE_CHART_TIME_FROM == 0 && LEVEL_3_LINE_CHART_TIME_TO == 0){
//             $("#time_chart_level_3").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(new Date().getTime() - 24*60*60*1000) + " - " + return_date_format_ddmmyyhhmmss_2(new Date()))
//           }else{
//             $("#time_chart_level_3").val("Thời điểm: "+return_date_format_ddmmyyhhmmss_2(LEVEL_3_LINE_CHART_TIME_FROM) + " - " + return_date_format_ddmmyyhhmmss_2(LEVEL_3_LINE_CHART_TIME_TO))
//           }
//           // $("#select_lv_3_main_line_chart_time_data option[value=now]").empty();
//           // $("#select_lv_3_main_line_chart_time_data option[value=now]").append("Tức thời: " + return_date_format_ddmmyyhhmmss(lost_data[lost_data.length-1].meter_time));
//         }
//       }else{
//         if(LEVEL_3_MAIN_LINE_CHART){
//           LEVEL_3_MAIN_LINE_CHART.dispose();
//           delete LEVEL_3_MAIN_LINE_CHART;
//         }
//         if(LEVEL_3_MAIN_PIE_CHART){
//           LEVEL_3_MAIN_PIE_CHART.dispose();
//           delete LEVEL_3_MAIN_PIE_CHART;
//         }
//         // $("#level_3_main_chart_container").empty();
//         // $("#lv_3_setting").hide();
//         // $("#lv_3_setting").prop("disabled",true);
//       }
//     }
//     render_info_meter_tong_lv_3(ins_data);
//   })
// }

function mergeObjectsByA(array) {
  const mergedObjects = {};
  array.forEach((obj) => {
    const key = obj.meter_time;
    if (!mergedObjects[key]) {
      // Nếu chưa có key trong đối tượng mergedObjects, thêm mới và gán giá trị là đối tượng đó
      mergedObjects[key] = obj;
    } else {
      // Nếu đã có key, merge đối tượng mới vào đối tượng đã tồn tại
      mergedObjects[key] = { ...mergedObjects[key], ...obj };
    }
  });

  // Chuyển đối tượng thành mảng
  const resultArray = Object.values(mergedObjects);
  return resultArray;
}


var LEVEL_3_MAIN_LINE_CHART = null;
function render_level_3_main_line_data_lost_output(data_chart,meter_id_arr){
  // let data_chart = [];
  // for(let i=0; i<data.length; i++){
  //   data_chart.push({
  //     meter_time: new Date(data[i].meter_time),
  //     loss: ((Number(data[i].sum_nhanh) > Number(data[i].sum_tong)) ? 0 : (Number(data[i].sum_tong)-Number(data[i].sum_nhanh))),
  //     total: Number(data[i].sum_tong),
  //     pressure: null,
  //     flow_rate: null,
  //   })
  // }
  // for(let i=0; i<other_data.length; i++){
  //   data_chart.push({
  //     meter_time: new Date((other_data[i].meterTime)),
  //     pressure: stringtonum(other_data[i].pressure),
  //     flow_rate: stringtonum(other_data[i].flowRate),
  //     loss: null,
  //     total: null
  //   })
  // }
  data_chart.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a.meter_time).getTime() - new Date(b.meter_time).getTime();
  });
  let merge_data = mergeObjectsByA(data_chart);

let thickness = 3;
am4core.useTheme(am4themes_animated);
if(LEVEL_3_MAIN_LINE_CHART){
  LEVEL_3_MAIN_LINE_CHART.dispose();
  delete LEVEL_3_MAIN_LINE_CHART;
}
LEVEL_3_MAIN_LINE_CHART = am4core.create("main_line_chart_lv_3", am4charts.XYChart);
LEVEL_3_MAIN_LINE_CHART.scrollbarX = new am4core.Scrollbar();
LEVEL_3_MAIN_LINE_CHART.data = merge_data;
LEVEL_3_MAIN_LINE_CHART.logo.disabled = true;
let dateAxis = LEVEL_3_MAIN_LINE_CHART.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 60;
dateAxis.startLocation = 0.5;
dateAxis.endLocation = 0.5;
dateAxis.renderer.grid.template.location = 0;
dateAxis.renderer.grid.template.disabled = true;
dateAxis.renderer.fullWidthTooltip = true;
// dateAxis.dateFormats.setKey("minutes", "HH:mm");

dateAxis.dateFormats.setKey("hour", "HH:mm");
dateAxis.dateFormats.setKey("day", "dd/MM");
dateAxis.periodChangeDateFormats.setKey("hour", "dd/MM"); 
dateAxis.dateFormats.setKey("month", "MM/yyyy");
dateAxis.periodChangeDateFormats.setKey("day", "MM/yyyy");

LEVEL_3_MAIN_LINE_CHART.cursor = new am4charts.XYCursor();
LEVEL_3_MAIN_LINE_CHART.cursor.fullWidthLineX = true;
LEVEL_3_MAIN_LINE_CHART.cursor.xAxis = dateAxis;
LEVEL_3_MAIN_LINE_CHART.cursor.lineX.strokeWidth = 0;
LEVEL_3_MAIN_LINE_CHART.cursor.lineX.fill = am4core.color("#000");
LEVEL_3_MAIN_LINE_CHART.cursor.lineX.fillOpacity = 0.1;
LEVEL_3_MAIN_LINE_CHART.legend = new am4charts.Legend();

let title = LEVEL_3_MAIN_LINE_CHART.titles.create();
title.text = "Biểu đồ thất thoát "+ DATA_LOST_OUTPUT_NAME;
title.fontSize = 25;
title.marginTop = 10;
title.marginBottom = 7;
title.fontWeight = "bold";

var m3 = LEVEL_3_MAIN_LINE_CHART.yAxes.push(new am4charts.ValueAxis());
m3.tooltip.disabled = false;
m3.renderer.ticks.template.disabled = true;
m3.renderer.axisFills.template.disabled = true;
m3.renderer.line.strokeOpacity = 0.5;
m3.renderer.line.strokeWidth = 1;
m3.title.text ="m3"
m3.renderer.opposite = false;
m3.extraMin = 0.1;
m3.extraMax = 0.1; 

var pressure = LEVEL_3_MAIN_LINE_CHART.yAxes.push(new am4charts.ValueAxis());
pressure.tooltip.disabled = false;
pressure.renderer.ticks.template.disabled = true;
pressure.renderer.axisFills.template.disabled = true;
pressure.renderer.line.strokeOpacity = 0.5;
pressure.renderer.line.strokeWidth = 1;
pressure.title.text ="bar"
pressure.renderer.opposite = true;
pressure.extraMin = 0.1;
pressure.extraMax = 0.1; 

var m3h = LEVEL_3_MAIN_LINE_CHART.yAxes.push(new am4charts.ValueAxis());
m3h.tooltip.disabled = false;
m3h.renderer.ticks.template.disabled = true;
m3h.renderer.axisFills.template.disabled = true;
m3h.renderer.line.strokeOpacity = 0.5;
m3h.renderer.line.strokeWidth = 1;
m3h.title.text ="m3/h"
m3h.renderer.opposite = false;
m3h.extraMin = 0.1;
m3h.extraMax = 0.1; 

var series;
series = LEVEL_3_MAIN_LINE_CHART.series.push(new am4charts.LineSeries());
series.yAxis = m3;
series.dataFields.valueY = "total";
series.dataFields.dateX = "meter_time";
series.title = "Sản lượng";
series.strokeWidth = thickness;
series.tensionX = 1;
series.showOnInit = true;
series.legendSettings.labelText = "Sản lượng (m3)";
series.tooltipText = "Sản lượng" + ": {valueY} " + "(m3)";
series.name = "Sản lượng"
series.tooltip.pointerOrientation = "horizontal";
series.fill = am4core.color(remain_color);
series.stroke = am4core.color(remain_color);
series.fillOpacity = 0.9;

var series_2;
  series_2 = LEVEL_3_MAIN_LINE_CHART.series.push(new am4charts.LineSeries());
  series_2.yAxis = m3;
  series_2.dataFields.valueY = "loss";
  series_2.dataFields.dateX = "meter_time";
  series_2.title = "SL thất thoát";
  series_2.strokeWidth = thickness;
  series_2.tensionX = 1;
  series_2.showOnInit = true;
  series_2.legendSettings.labelText = "SL thất thoát (m3)";
  series_2.tooltipText = "SL thất thoát" + ": {valueY} " + "(m3)";
  series_2.name = "SL thất thoát"
  series_2.tooltip.pointerOrientation = "horizontal";
  series_2.fill = am4core.color(lost_color);
  series_2.stroke = am4core.color(lost_color);
  series_2.fillOpacity = 0.8;

  if(meter_id_arr.length == 1){
    var series_3;
    series_3 = LEVEL_3_MAIN_LINE_CHART.series.push(new am4charts.LineSeries());
    series_3.yAxis = pressure;
    series_3.dataFields.valueY = meter_id_arr[0]+"_pressure";
    series_3.dataFields.dateX = "meter_time";
    series_3.title = "Áp suất";
    series_3.strokeWidth = thickness;
    series_3.tensionX = 1;
    series_3.showOnInit = true;
    series_3.legendSettings.labelText = "Áp suất (bar)";
    series_3.tooltipText = "Áp suất" + ": {valueY} " + "(bar)";
    series_3.name = "Áp suất "
    series_3.tooltip.pointerOrientation = "horizontal";
    series_3.fill = am4core.color("#ff9900");
    series_3.stroke = am4core.color("#ff9900");

    var series_4;
    series_4 = LEVEL_3_MAIN_LINE_CHART.series.push(new am4charts.LineSeries());
    series_4.yAxis = m3h;
    series_4.dataFields.valueY = meter_id_arr[0]+"_flow_rate";
    series_4.dataFields.dateX = "meter_time";
    series_4.title = "Lưu lượng";
    series_4.strokeWidth = thickness;
    series_4.tensionX = 1;
    series_4.showOnInit = true;
    series_4.legendSettings.labelText = "Lưu lượng (m3/h)";
    series_4.tooltipText = "Lưu lượng" + ": {valueY} " + "(m3/h)";
    series_4.name = "Lưu lượng"
    series_4.tooltip.pointerOrientation = "horizontal";
    series_4.fill = am4core.color("#50a605");
    series_4.stroke = am4core.color("#50a605");
  }else{
    for(let i=0; i<meter_id_arr.length; i++){
      var series_3;
      series_3 = LEVEL_3_MAIN_LINE_CHART.series.push(new am4charts.LineSeries());
      series_3.yAxis = pressure;
      series_3.dataFields.valueY = meter_id_arr[i]+"_pressure";
      series_3.dataFields.dateX = "meter_time";
      series_3.title = "Áp suất "+meter_id_arr[i];
      series_3.strokeWidth = thickness;
      series_3.tensionX = 1;
      series_3.showOnInit = true;
      series_3.legendSettings.labelText = "Áp suất "+meter_id_arr[i]+" (bar)";
      series_3.tooltipText = "Áp suất " +meter_id_arr[i]+ ": {valueY} " + "(bar)";
      series_3.name = "Áp suất "+ meter_id_arr[i]
      series_3.tooltip.pointerOrientation = "horizontal";
      series_3.fill = am4core.color("#ff9900");
      series_3.stroke = am4core.color("#ff9900");
  
      var series_4;
      series_4 = LEVEL_3_MAIN_LINE_CHART.series.push(new am4charts.LineSeries());
      series_4.yAxis = m3h;
      series_4.dataFields.valueY = meter_id_arr[i]+"_flow_rate";
      series_4.dataFields.dateX = "meter_time";
      series_4.title = "Lưu lượng "+meter_id_arr[i];
      series_4.strokeWidth = thickness;
      series_4.tensionX = 1;
      series_4.showOnInit = true;
      series_4.legendSettings.labelText = "Lưu lượng "+meter_id_arr[i]+" (m3/h)";
      series_4.tooltipText = "Lưu lượng " +meter_id_arr[i]+ ": {valueY} " + "(m3/h)";
      series_4.name = "Lưu lượng "+meter_id_arr[i]
      series_4.tooltip.pointerOrientation = "horizontal";
      series_4.fill = am4core.color("#50a605");
      series_4.stroke = am4core.color("#50a605");
    }

  }
  $("#loading_main_line_chart_lv_3").css("display","none");
  $("#main_line_chart_lv_3").css("display","block");

  // var series_4;
  // series_4 = LEVEL_3_MAIN_LINE_CHART.series.push(new am4charts.LineSeries());
  // series_4.yAxis = m3;
  // series_4.dataFields.valueY = "flow_rate";
  // series_4.dataFields.dateX = "meter_time";
  // series_4.title = "Lưu lượng";
  // series_4.strokeWidth = thickness;
  // series_4.tensionX = 1;
  // series_4.showOnInit = true;
  // series_4.legendSettings.labelText = "Lưu lượng (m3/h)";
  // series_4.tooltipText = "Lưu lượng" + ": {valueY} " + "(m3/h)";
  // series_4.name = "Lưu lượng"
  // series_4.tooltip.pointerOrientation = "horizontal";
  // series_4.fill = am4core.color("#50a605");
  // series_4.stroke = am4core.color("#50a605");
}


function return_content_level_3(data, i, length){
  let content;
    content = '<div class="col" style="min-width: 380px; max-width: 450px">'
    // content = '<div class="col ins_val_width">'
              +  '<div class="card text-left border_radius">'
              +  '<div class="card-body">'
              +  '<h4 class="font-weight-bold">'+show_if_null(data.name)+'</h4>'
              if(data.status == 1){
                content += '<span style="font-weight: bold; color: green">'+show_if_null(data.meter_id)+'</span>'
                +  '<div class="row mt-2 mt-2">'
                +  '<i class="fa fa-clock-o display-7 mt-1" aria-hidden="true" style="color: green"></i> <span class="text-uppercase display-7" style="color: green">'+show_if_null(data.last_ValOfNum)+'</span>'
                +  '</div>'
              }else{
                content += '<span style="font-weight: bold; color: red">'+show_if_null(data.meter_id)+'</span>'
                +  '<div class="row mt-2 mt-2">'
                +  '<i class="fa fa-clock-o display-7 mt-1" aria-hidden="true" style="color: red"></i> <span class="text-uppercase display-7" style="color: red">'+show_if_null(data.last_ValOfNum)+'</span>'
                +  '</div>'
              }
              content += ''

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
              +  '<span class="text-left">Sản lượng thuận: </span>'
              +  '<span class="ml-auto"><span class="font-weight-bold">'+'-'+'</span> (m3)</span>'
              +  '</div>'
              +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
              +  '<span class="text-left">Sản lượng ngược: </span>'
              +  '<span class="ml-auto"><span class="font-weight-bold">'+'-'+'</span> (m3</span>'
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
              if(data.nhanh_tong != null){
                content += '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
                +  '<span class="text-left">Đặt làm nguồn: </span> '
                if(data.nhanh_tong == 1){
                  content += '<span class="ml-auto"><span class="font-weight-bold">'+'Tổng'+'</span></span>'
                }else{
                  content +=  '<span class="ml-auto"><span class="font-weight-bold">'+'Nhánh'+'</span></span>'
                }
                content += '</div>'
              }

              content += ''
              +  '</div>'
              +  '<div class="card-footer text-right">'
              +'<button class="btn btn-outline-secondary mr-1" title="Gửi bản tin tức thời" onclick="send_instant_mess(`'+data.name+'`,`'+data.meter_id+'`,`'+data.serial_sensor+'`)"><i class="fas fa-eye"></i></button>'
              +'<button class="btn btn-outline-secondary mr-1" title="Chỉ số từng thời điểm" onclick="data_modal(`'+data.name+'`,`'+data.meter_id+'`,`'+data.serial_sensor+'`)"><i class="fas fa-database"></i></button>'
              +'<button class="btn btn-outline-secondary mr-1" title="Biểu đồ" onclick="chart_modal(`'+data.name+'`,`'+data.meter_id+'`,`'+data.serial_sensor+'`)"><i class="fas fa-chart-line"></i></button>'
              +'<button class="btn btn-outline-secondary mr-1" title="Cảnh báo" onclick="alert_modal(`'+data.name+'`,`'+data.meter_id+'`,`'+data.serial_sensor+'`)"><i class="fas fa-exclamation-triangle"></i></button>'
              +  '<button class="btn btn-outline-secondary mr-1" onclick="open_modal(`'+data.name+'`,`'+data.meter_id+'`,`'+data.serial_sensor+'`,null)"><i class="fa fa-cog" aria-hidden="true"></i> Chi tiết</button>'
              +'<button class="btn btn-outline-secondary" title="Log" onclick="log_modal(`'+data.name+'`,`'+data.meter_id+'`,`'+data.serial_sensor+'`)"><i class="fas fa-history"></i></button>'
              +  '</div>'
              +  '</div>'
              +  '</div>'
              
              
  // if(i % 4 == 0 || i == 0){
  //   content = '<div class="row">' + content
  // }
  // if(i % 4 == 3 || i == length - 1){
  //   content = content + '</div>'
  // }
  return content;
}

var LEVEL_3_MAIN_PIE_CHART = null;
function render_level_3_main_pie_chart(lost_data){
  let name = lost_data.name;
  let remain = Number(lost_data.sum_nhanh);
  let loss = return_that_thoat(lost_data.sum_nhanh,lost_data.sum_tong);
  let no_data = 0;
  $("#general_total_lv_3").html(Number((remain + loss).toFixed(3)) + "(m³)")
  $("#general_lost_lv_3").html(Number(loss.toFixed(3)) + "(m³)")
  if(remain == 0 && loss == 0){
    no_data = 1;
    remain = 100;
    loss = 0;
  }
  am4core.useTheme(am4themes_animated);
  if(LEVEL_3_MAIN_PIE_CHART){
    LEVEL_3_MAIN_PIE_CHART.dispose();
    delete LEVEL_3_MAIN_PIE_CHART;
  }
  LEVEL_3_MAIN_PIE_CHART = am4core.create("main_pie_chart_lv_3", am4charts.PieChart3D);
  LEVEL_3_MAIN_PIE_CHART.hiddenState.properties.opacity = 0;
  LEVEL_3_MAIN_PIE_CHART.data = [
    {
      category: "SL thất thoát",
      value: loss
    },
    {
      category: "SL tiêu thụ",
      value: remain
    }
  ]
  LEVEL_3_MAIN_PIE_CHART.innerRadius = am4core.percent(0);
  LEVEL_3_MAIN_PIE_CHART.depth = 15;
  LEVEL_3_MAIN_PIE_CHART.legend = new am4charts.Legend();
  LEVEL_3_MAIN_PIE_CHART.legend.position = "bottom";
  LEVEL_3_MAIN_PIE_CHART.radius = am4core.percent(75);
  LEVEL_3_MAIN_PIE_CHART.logo.disabled = true;
  // resoivie biểu đồ theo container
  LEVEL_3_MAIN_PIE_CHART.responsive.enabled = true;
  // ẩn phần trăm ở chú thích
  LEVEL_3_MAIN_PIE_CHART.legend.valueLabels.template.disabled = true;

  let series = LEVEL_3_MAIN_PIE_CHART.series.push(new am4charts.PieSeries3D());
  series.dataFields.value = "value";
  series.dataFields.category = "category";

  series.labels.template.maxWidth = 150;
  series.labels.template.wrap = true;
  series.labels.template.fontSize = 15;
  if(no_data == 1){
    series.slices.template.tooltipText = "{category}: {value} (%) (0)";
  }
  // series.labels.template.padding(1, 1, 1, 1);
  // series.labels.template.fontSize = 13;
  // series.labels.template.text = "{category}";
  // series.alignLabels = false;
  // series.slices.template.cornerRadius = 5;
  // series.colors.step = 3;
  series.colors.list = [
    am4core.color(lost_color),
    am4core.color(remain_color),
  ];
  // let container = new am4core.Container();
  // container.parent = series;
  // container.horizontalCenter = "middle";
  // container.verticalCenter = "middle";
  // container.width = am4core.percent(40) / Math.sqrt(2);
  // container.fill = "white";

  // let label = new am4core.Label();
  // label.parent = container;
  // label.text = returnSQLDateFormat2Line(lost_data.meter_time);
  // label.horizontalCenter = "middle";
  // label.verticalCenter = "middle";
  // label.fontSize = 15;

  // LEVEL_3_MAIN_PIE_CHART.events.on("sizechanged", function(ev) {
  //   let scale = (series.pixelInnerRadius * 2) / label.bbox.width;
  //   if (scale > 1) {
  //     scale = 1;
  //   }
  //   label.scale = scale;
  // })

  let title = LEVEL_3_MAIN_PIE_CHART.titles.create();
  title.text = name;
  title.fontSize = 25;
  title.marginTop = 13;
  title.marginBottom = 7;
  title.fontWeight = "bold";
}

var TYPE_LEVEL_3_DATA_LOST_OUPUT_CHART ="pie";

// function change_type_level_3_child_chart(type){
//   if(type == "pie"){
//     TYPE_LEVEL_3_DATA_LOST_OUPUT_CHART = "pie"
//     if(LEVEL_3_MAIN_LINE_CHART){
//       LEVEL_3_MAIN_LINE_CHART.dispose();
//       delete LEVEL_3_MAIN_LINE_CHART;
//     }
//     if(LEVEL_3_MAIN_PIE_CHART){
//       LEVEL_3_MAIN_PIE_CHART.dispose();
//       delete LEVEL_3_MAIN_PIE_CHART;
//     }
//     $("#level_3_main_chart_container").empty();
//     $("#level_3_main_chart_container").append('<div id="main_pie_chart_lv_3" class="" style="height: 450px; min-width: 600px; margin: auto;"></div>');
//     get_render_chart_and_info_tong_lv_3(DATA_LOST_OUTPUT_GROUP_ID);
//   }else{
//     TYPE_LEVEL_3_DATA_LOST_OUPUT_CHART = "line"
//     if(LEVEL_3_MAIN_LINE_CHART){
//       LEVEL_3_MAIN_LINE_CHART.dispose();
//       delete LEVEL_3_MAIN_LINE_CHART;
//     }
//     if(LEVEL_3_MAIN_PIE_CHART){
//       LEVEL_3_MAIN_PIE_CHART.dispose();
//       delete LEVEL_3_MAIN_PIE_CHART;
//     }
//     $("#level_3_main_chart_container").empty();
//     let str = '<div class="row" style="width: 100%;"><div id="main_line_chart_lv_3" class="" style="height: 650px; width: 100%; margin: auto;"></div></div><div class="row" style="width: 100%;"><input type="text" readonly="true" class="form-control" value="" style="width: 400px; margin: auto; text-align: center;" id="time_chart_level_3"></div>'
//     $("#level_3_main_chart_container").append(str);
//     get_render_chart_and_info_tong_lv_3(DATA_LOST_OUTPUT_GROUP_ID);
//   }
// }





function render_info_meter_tong_lv_3(data){
  $("#main_instant_meter_tong_container_lv_3").empty();
  let string_append = "";
  for(let i=0; i<data.length; i++){
    if(data[i].nhanh_tong == 1){
      string_append += ''                        
      +'<div class="col-3" style="min-width: 380px; max-width: 400px;">'
      +'<div class="card text-left border_radius">'
      +'<div class="card-body">'
      +'<h4 class="font-weight-bold">'+show_if_null(data[i].name)+'</h4>'
      if(data[i].status == 1){
        string_append += '<span style="font-weight: bold; color: green">'+show_if_null(data[i].meter_id)+'</span>'
        +'<div class="row mt-2 mt-2">'
        +'<i class="fa fa-clock-o display-7 mt-1" aria-hidden="true" style="color: green"></i> <span class="text-uppercase display-7" style="color: green">'+show_if_null(data[i].last_ValOfNum)+'</span>'
        +'</div>'
      }else{
        string_append += '<span style="font-weight: bold; color: red">'+show_if_null(data[i].meter_id)+'</span>'
        +'<div class="row mt-2 mt-2">'
        +'<i class="fa fa-clock-o display-7 mt-1" aria-hidden="true" style="color: red"></i> <span class="text-uppercase display-7" style="color: red">'+show_if_null(data[i].last_ValOfNum)+'</span>'
        +'</div>'
      }
      string_append += ''

      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Sản lượng: </span>'
      +'<span class="ml-auto"><span class="font-weight-bold"></span>'+show_if_null(data[i].last_terminal_index)+' (m3)</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2 mt-2 mb-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Lưu lượng: </span>'
      +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data[i].last_flow_rate)+'</span> (m3/h)</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Áp suất: </span>'
      +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data[i].last_pressure)+'</span> (Bar)</span>'
      +'</div>'
      +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +  '<span class="text-left">Sản lượng thuận: </span>'
      +  '<span class="ml-auto"><span class="font-weight-bold">'+'-'+'</span> (m3)</span>'
      +  '</div>'
      +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +  '<span class="text-left">Sản lượng ngược: </span>'
      +  '<span class="ml-auto"><span class="font-weight-bold">'+'-'+'</span> (m3</span>'
      +  '</div>'
      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Mực nước bể: </span>'
      +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data[i].last_measure_cacul)+'</span> (m)</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Tần suất dữ liệu (Phút): </span>'
      +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data[i].frequency)+'</span> (Phút)</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Điện áp pin dự phòng: </span>'
      +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data[i].last_voltage_pin)+'</span> (V)</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Điện áp ác quy: </span> '
      +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(data[i].last_voltage_ac_quy)+'</span> (V)</span>'
      +'</div>'
      +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
      +'<span class="text-left">Thời điểm: </span>'
      +'<span class="ml-auto"><span class="font-weight-bold">'+return_date_format_ddmmyyhhmmss(data[i].last_meter_time)+'</span></span>'
      +'</div>'
      if(data[i].nhanh_tong != null){
        string_append += '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
        +  '<span class="text-left">Đặt làm nguồn: </span> '
        if(data[i].nhanh_tong == 1){
          string_append += '<span class="ml-auto"><span class="font-weight-bold">'+'Tổng'+'</span></span>'
        }else{
          string_append +=  '<span class="ml-auto"><span class="font-weight-bold">'+'Nhánh'+'</span></span>'
        }
        string_append += '</div>'
      }
      string_append += ""
      +'</div>'
      +'<div class="card-footer text-right">'
      +'<button class="btn btn-outline-secondary mr-1" title="Gửi bản tin tức thời" onclick="send_instant_mess(`'+data[i].name+'`,`'+data[i].meter_id+'`,`'+data[i].serial_sensor+'`)"><i class="fas fa-eye"></i></button>'
      +'<button class="btn btn-outline-secondary mr-1" title="Chỉ số từng thời điểm" onclick="data_modal(`'+data[i].name+'`,`'+data[i].meter_id+'`,`'+data[i].serial_sensor+'`)"><i class="fas fa-database"></i></button>'
      +'<button class="btn btn-outline-secondary mr-1" title="Biểu đồ" onclick="chart_modal(`'+data[i].name+'`,`'+data[i].meter_id+'`,`'+data[i].serial_sensor+'`)"><i class="fas fa-chart-line"></i></button>'
      +'<button class="btn btn-outline-secondary mr-1" title="Cảnh báo" onclick="alert_modal(`'+data[i].name+'`,`'+data[i].meter_id+'`,`'+data[i].serial_sensor+'`)"><i class="fas fa-exclamation-triangle"></i></button>'
      +'<button class="btn btn-outline-secondary mr-1" onclick="open_modal(`'+data[i].name+'`,`'+data[i].meter_id+'`,`'+data[i].serial_sensor+'`,null)"><i class="fa fa-cog" aria-hidden="true"></i> Chi tiết</button>'
      +'<button class="btn btn-outline-secondary" title="Log" onclick="log_modal(`'+data[i].name+'`,`'+data[i].meter_id+'`,`'+data[i].serial_sensor+'`)"><i class="fas fa-history"></i></button>'
      +'</div>'
      +'</div>'
      +'</div>'
    }
  }
  $("#main_instant_meter_tong_container_lv_3").append(string_append);
}

function load_level_5_data(node_id){
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  $(".page_").hide();
  $(".page_").prop("disabled",true);
  $("#page_3").show();
  $("#page_3").prop("disabled",false);
  LEVEL_3_PIE_CHART_TIME_TO = 0;
  LEVEL_3_PIE_CHART_TIME_FROM = 0;
  $("#pick_lv_3_main_pie_chart_time_data").css("display","none");
  $("#pick_lv3_main_pie_chart_time_data_container").css("display","none");
  $("#select_lv_3_main_pie_chart_time_data").prop('selectedIndex',0);
  $(".lv5_hide").prop("disabled",true);
  $(".lv5_hide").css("display","none");
  httpAsync(null,"/get/ins_data_level_5?node_id="+node_id,"GET",function(result){
    let parse_data = JSON.parse(result);
    let data = parse_data.data;
    render_info_meter_nhanh_lv_3(data);
    INS_DATA_LV_3 = data;
    
  })
}




let screen = 1;
let previous_screen = 0;
function back_screen(){
  if(previous_screen == 0 || previous_screen == 1){
    show_level_1_screen()
  }
  if(previous_screen == 2){
    show_level_2_screen()
  }
}


// jstree cấp 1
// let DEPTH_TREE = 1;
// $(document).ready(function(){
//   // $(window).on('load',(function(){ 
//   //   $('#jstree_meter').jstree({"core":{
//   //     "data":data_level_1_tree,
//   //     "animation": 0
//   //   }
//   //   });
//   // }));
//   load_tree_meter()
// })




// function load_tree_meter(){
//   httpAsync(null,"/get/meter_tree?depth="+DEPTH_TREE,"GET",function(result){

//     let parse_data = JSON.parse(result);
//     let data = parse_data.data;
//     let jstree_data = [];
//     let lowest_depth
//     if(data.length > 0){
//       lowest_depth = data[0].depth;
//     }
//     for(let i=0; i<data.length; i++){
//       let x = {
//         text: data[i].name,
//         "state":{
//           opened: true,
//           selected: false
//         },
//         icon: "wt-icon",
//         id: data[i].id,
//         parent_id: data[i].parent_id
//       }
//       if(data[i].name_totaleq){
//         x.text = data[i].name_totaleq
//       }
//       if(data[i].have_child == 1){
//         x.children = true;
//       }
//       // if(data[i].depth > lowest_depth){
//       //   x.state.opened = false;
//       // }
//       jstree_data.push(x)
//     }
//     $(document).ready(function(){
//       $('#jstree_meter').jstree({"core":{
//          "check_callback": true,
//          'data':{
//           'url': "/get/load_tree?lazy",
//           "data": function(node){
//             return {'id': node.id}
//           },
//          },

//         "animation": 0
//       }
//       })
//     })
//     $(document).ready(function(){
//       $('#jstree_meter').on("click.jstree", ".jstree-ocl", function (e, data) {
//         //do something

//         if ((this).parentElement.classList.contains('jstree-closed')){
//           selectedNode = ($(this).nextAll(".jstree-anchor").attr("id"))
//           var node = $('#jstree_meter').jstree("get_node", selectedNode);

//           load_child(node.id);
//         }
//         //  load_child
//     });
//     })

//   })
// }

// function load_child(id){
//   httpAsync(null,"/get/node_child?node_id="+id,"GET",function(result){
//     let parse_data = JSON.parse(result);
//     let data = parse_data.data; 
//     let jstree_child_node = []
//     for(let i=0; i<data.length; i++){
//       let x = {
//         "text": data[i].name,
//         "state":{
//           opened: true,
//           selected: false
//         },
//         icon: "wt-icon",
//         id: data[i].id
//       }
//       if(data[i].have_child == 1){
//         x.children = true;
//       }
//       jstree_child_node.push(x)
//         // $('#jstree_meter').jstree().create_node(id,x,"last",function(){})
//     }
//     return jstree_child_node;
//     // $(document).ready(function(){
//     //   $('#jstree_meter').jstree("create",$("#"+id),"inside", jstree_child_node,function(){},true);
//     // })
//   })
// }


// function convert_array_to_father_child_json(array){
//   var map = {};
//   for(var i = 0; i < array.length; i++){
//       var obj = array[i];
//       obj.children= [];

//       map[obj.id] = obj;

//       var parent = obj.parent_id || '-';
//       if(!map[parent]){
//           map[parent] = {
//             children: []
//           };
//       }
//       map[parent].children.push(obj);
//   }

//   return map['-'].children;

// }

function convert_array_to_father_child_json(data){
 let buildTree = (parent_id) => (item) => {
    const children = data.filter((child) => child.parent_id === item.id);
    return {
      ...item,
      ...(children.length > 0 && { children: children.map(buildTree(item.id)) }),
    };
  };

  let nestedData = data.filter((item) => !item.parent_id).map(buildTree(undefined));
  return nestedData;
}


var DATA = {
  loss: 35,
  remain: 65
}
$(document).ready(function(){
    // render_pie_chart(DATA);
    // render_main_bar_chart(data_main_bar_chart)
    // for(let i=1; i<9; i++){
    //   render_son_pie_chart("son_pie_chart_"+i,DATA)
    // }
    // render_line_chart_lv_1()
})
var pie_chart;
// function render_pie_chart(data){
//   am4core.useTheme(am4themes_animated);
//   if(pie_chart){
//     pie_chart.dispose();
//     delete pie_chart;
//   }
//   pie_chart = am4core.create("main_pie_chart", am4charts.PieChart3D);
//   pie_chart.hiddenState.properties.opacity = 0;
//   pie_chart.data = [
//     {
//       category: "Thất thoát",
//       value: data.loss
//     },{
//       category: "Còn lại",
//       value: data.remain
//     }
//   ]
//   pie_chart.innerRadius = am4core.percent(0);
//   pie_chart.depth = 25;
//   pie_chart.legend = new am4charts.Legend();
//   // pie_chart.legend.position = "right";
//   pie_chart.radius = am4core.percent(100);
//   pie_chart.logo.disabled = true;
//   // resoivie biểu đồ theo container
//   pie_chart.responsive.enabled = true;
//   // ẩn phần trăm ở chú thích
//   pie_chart.legend.valueLabels.template.disabled = true;
//   let series = pie_chart.series.push(new am4charts.PieSeries3D());
//   series.dataFields.value = "value";
//   series.dataFields.category = "category";
//   // series.slices.template.cornerRadius = 5;
//   series.colors.step = 3;
//   let title = pie_chart.titles.create();
//   title.text = "NƯỚC SẠCH QUẢNG NINH";
//   title.fontSize = 20;
//   title.marginTop = 15;
//   title.marginBottom = 20;
// }

// function render_son_pie_chart(id_div, data){
//   am4core.useTheme(am4themes_animated);
//   let son_pie_chart = am4core.create(id_div, am4charts.PieChart3D);
//   son_pie_chart.hiddenState.properties.opacity = 1;
//   son_pie_chart.data = [
//     {
//       category: "Thất thoát",
//       value: data.loss
//     },{
//       category: "Còn lại",
//       value: data.remain
//     }
//   ]
//   son_pie_chart.innerRadius = am4core.percent(50);
//   son_pie_chart.depth = 20;
//   son_pie_chart.legend = new am4charts.Legend();
//   son_pie_chart.radius = am4core.percent(100);
//   son_pie_chart.logo.disabled = true;
//   // son_pie_chart.responsive.enabled = true;
//   son_pie_chart.legend.valueLabels.template.disabled = true;
//   let series = son_pie_chart.series.push(new am4charts.PieSeries3D());
//   series.dataFields.value = "value";
//   series.dataFields.category = "category";
//   series.colors.step = 3;
  
//   series.ticks.template.disabled = true;
//   series.alignLabels = false;
//   series.labels.template.text = ""
//   // series.tooltip.disabled = true;
//   // series.slices.template.alwaysShowTooltip = false;
// // series.slices.template.tooltipText = ""

//   let container = new am4core.Container();
//   container.parent = series;
//   container.horizontalCenter = "middle";
//   container.verticalCenter = "middle";
//   container.width = am4core.percent(40) / Math.sqrt(2);
//   container.fill = "white";

//   let label = new am4core.Label();
//   label.parent = container;
//   label.text = "123456789";
//   label.horizontalCenter = "middle";
//   label.verticalCenter = "middle";
//   label.fontSize = 15;

//   son_pie_chart.events.on("sizechanged", function(ev) {
//     let scale = (series.pixelInnerRadius * 2) / label.bbox.width;
//     if (scale > 1) {
//       scale = 1;
//     }
//     label.scale = scale;
//   })
// }



// function render_main_bar_chart(data){

// am4core.useTheme(am4themes_animated);

// var main_bar_chart = am4core.create("main_bar_chart", am4charts.XYChart);
// main_bar_chart.scrollbarX = new am4core.Scrollbar();
// main_bar_chart.data = data;
// main_bar_chart.logo.disabled = true;
// let categoryAxis = main_bar_chart.xAxes.push(new am4charts.CategoryAxis());
// categoryAxis.dataFields.category = "name";
// categoryAxis.renderer.minGridDistance = 30;
// // categoryAxis.startLocation = 0.5;
// // categoryAxis.endLocation = 0.5;
// categoryAxis.renderer.grid.template.location = 0;
// categoryAxis.renderer.grid.template.disabled = true;
// categoryAxis.renderer.fullWidthTooltip = true;
// // categoryAxis.renderer.labels.template.rotation = 320;
// var label = categoryAxis.renderer.labels.template;
// label.truncate = true;
// label.maxWidth = 100;
// label.tooltipText = "{category}";

// // label.events.on("sizechanged", function(ev) {
// //   var axis = ev.target;
// //     var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
// //     if (cellWidth < axis.renderer.labels.template.maxWidth) {
// //       axis.renderer.labels.template.rotation = -45;
// //       axis.renderer.labels.template.horizontalCenter = "right";
// //       axis.renderer.labels.template.verticalCenter = "middle";
// //     }
// //     else {
// //       axis.renderer.labels.template.rotation = 0;
// //       axis.renderer.labels.template.horizontalCenter = "middle";
// //       axis.renderer.labels.template.verticalCenter = "top";
// //     }
// //   });

// // categoryAxis.dateFormats.setKey("hour", "HH:mm");
// // categoryAxis.dateFormats.setKey("day", "dd/MM");
// // categoryAxis.periodChangeDateFormats.setKey("hour", "dd/MM"); 
// // categoryAxis.dateFormats.setKey("month", "MM/yyyy");
// // categoryAxis.periodChangeDateFormats.setKey("day", "MM/yyyy");

// // main_bar_chart.cursor = new am4charts.XYCursor();
// // main_bar_chart.cursor.fullWidthLineX = true;
// // main_bar_chart.cursor.xAxis = dateAxis;
// // main_bar_chart.cursor.lineX.strokeWidth = 0;
// // main_bar_chart.cursor.lineX.fill = am4core.color("#000");
// // main_bar_chart.cursor.lineX.fillOpacity = 0.1;
// // main_bar_chart.legend = new am4charts.Legend();


// let valueAxis  = main_bar_chart.yAxes.push(new am4charts.ValueAxis());
// valueAxis.renderer.inside = true;
// valueAxis.renderer.labels.template.disabled = true;
// valueAxis.min = 0;
// valueAxis.tooltip.disabled = false;
// // valueAxis.renderer.ticks.template.disabled = true;
// // valueAxis.renderer.axisFills.template.disabled = true;
// var series_2;
// series_2 = main_bar_chart.series.push(new am4charts.ColumnSeries());
// series_2.name = "Còn lại";
// // series_1.columns.template.fillOpacity = 1;
// // series_1.columns.template.strokeOpacity = 1;
// series_2.dataFields.valueY = "remain";
// series_2.stacked = true;
// series_2.dataFields.categoryX = "name";
// series_2.sequencedInterpolation = true;
// series_2.columns.template.width = am4core.percent(60);
// series_2.columns.template.tooltipText = "Còn lại";
// var labelBullet_2 = series_2.bullets.push(new am4charts.LabelBullet());
// labelBullet_2.label.text = "{valueY}";
// labelBullet_2.locationY = 0.5;
// labelBullet_2.label.hideOversized = true;
// // series.title = shortToFullName(field);
// // series.strokeWidth = 1;
// series_2.tensionX = 0.9;
// series_2.showOnInit = true;
// // series.legendSettings.labelText = shortToFullName(field) + maxlegendChart +'('+returnUnit(field)+')'
// // series.tooltipText =shortToFullName(field)+maxlegendChart+ ": {valueY} " + returnUnit(field);
// // series.name = shortToFullName(field) + maxlegendChart;
// series_2.tooltip.pointerOrientation = "horizontal";
// series_2.fill = am4core.color("#FF6F91");
// series_2.stroke = am4core.color("#FF6F91");

// var series_1;
// series_1 = main_bar_chart.series.push(new am4charts.ColumnSeries());
// series_1.name = "Thất thoát";
// // series_1.columns.template.fillOpacity = 1;
// // series_1.columns.template.strokeOpacity = 1;
// series_1.dataFields.valueY = "loss";
// series_1.stacked = true;
// series_1.dataFields.categoryX = "name";
// series_1.sequencedInterpolation = true;
// series_1.columns.template.width = am4core.percent(60);
// series_1.columns.template.tooltipText = "Thất thoát";
// var labelBullet = series_1.bullets.push(new am4charts.LabelBullet());
// labelBullet.label.text = "{valueY}";
// labelBullet.locationY = 0.5;
// labelBullet.label.hideOversized = true;
// // series.title = shortToFullName(field);
// // series.strokeWidth = 1;
// series_1.tensionX = 0.9;
// series_1.showOnInit = true;
// // series.legendSettings.labelText = shortToFullName(field) + maxlegendChart +'('+returnUnit(field)+')'
// // series.tooltipText =shortToFullName(field)+maxlegendChart+ ": {valueY} " + returnUnit(field);
// // series.name = shortToFullName(field) + maxlegendChart;
// series_1.tooltip.pointerOrientation = "horizontal";
// series_1.fill = am4core.color("#F9F871");
// series_1.stroke = am4core.color("#F9F871");



// main_bar_chart.main_bar_chart = new am4charts.Legend();
// }


// function show_level_2_screen(){
//   previous_screen = screen;
//   screen = 2;
//   document.body.scrollTop = 0; // For Safari
//   document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
//   // render_map(data_point)
//   $(".page_").hide();
//   $(".page_").prop("disabled",true);
//   $("#page_2").show();
//   $("#page_2").prop("disabled",false);

//   // $('#jstree_meter').jstree("destroy");
//   // $('#jstree_meter').empty();
//   // $('#jstree_meter').jstree({"core":{
//   //   "data": data_level_2_tree
//   // }
//   // })
//   // $(document).ready(function(){
//   //   $('#jstree_meter').on("changed.jstree", function (e, data) {
//   //     if(data.node.id == "VD"){
//   //       let name = data.node.text;
//   //       show_level_2_screen();
//   //       render_main_pie_chart_lv_2(DATA,name);
//   //       render_line_chart_lv_2(name);
//   //     }else if(data.node.id == "VD1"){
//   //       show_level_3_screen();
//   //     }
//   //   });
//   // })
// }




function show_level_1_screen(node_id){
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  $(".page_").hide();
  $(".page_").prop("disabled",true);
  $("#page_1").show();
  $("#page_1").prop("disabled",false);
  load_level_1_data(node_id)
}

// $(document).ready(function(){
//   $('#jstree_meter').on("changed.jstree", function (e, data) {
//     if(data.node.id == "VD"){
//       let name = data.node.text;
//       show_level_2_screen();
//       render_main_pie_chart_lv_2(DATA,name);
//       render_line_chart_lv_2(name);
//     }else if(data.node.id == "VD1"){
//       show_level_3_screen();
//     }
//   });
// })  

// function render_main_pie_chart_lv_2(data, name){
//     am4core.useTheme(am4themes_animated);
//     let main_pie_chart_lv_2 = am4core.create("main_pie_chart_lv_2", am4charts.PieChart3D);
//     main_pie_chart_lv_2.hiddenState.properties.opacity = 0;
//     main_pie_chart_lv_2.data = [
//       {
//         category: "Thất thoát",
//         value: data.loss
//       },{
//         category: "Còn lại",
//         value: data.remain
//       }
//     ]
//     main_pie_chart_lv_2.innerRadius = am4core.percent(50);
//     main_pie_chart_lv_2.depth = 25;
//     main_pie_chart_lv_2.legend = new am4charts.Legend();
//     // pie_chart.legend.position = "right";
//     main_pie_chart_lv_2.radius = am4core.percent(90);
//     main_pie_chart_lv_2.logo.disabled = true;
//     // resoivie biểu đồ theo container
//     main_pie_chart_lv_2.responsive.enabled = true;
//     // ẩn phần trăm ở chú thích
//     main_pie_chart_lv_2.legend.valueLabels.template.disabled = true;
//     let series = main_pie_chart_lv_2.series.push(new am4charts.PieSeries3D());
//     series.dataFields.value = "value";
//     series.dataFields.category = "category";
//     // series.slices.template.cornerRadius = 5;
//     series.colors.step = 3;
//     let title = main_pie_chart_lv_2.titles.create();
//     title.text = name;
//     title.fontSize = 20;
//     title.marginTop = 15;
//     title.marginBottom = 20;
// }


// function open_modal(){
//   $("#DetalEQ").modal('show');
// }

var map;

// function render_map(data){
//   let uluru = {lat:data_point[0].lat, lng:data_point[0].lng};
//   let options = {
//     zoom : 14,
//     center: uluru,
//     // lickableIcons: false,
//     styles: [
//       {
//           featureType: "poi",
//           elementType: "labels",
//           stylers: [
//                 { visibility: "off" }
//           ]
//       }
//     ]
//   }
//   map = new google.maps.Map(document.getElementById("map"), options);
//   let marker = null;
//   for(let i=0; i<data.length; i++){
//       let coords = {lat: data[i].lat, lng:data[i].lng};
//       // if(data[i].branch_total == 1){
//         marker = new google.maps.Marker({
//           opacity: 1,
//           position: coords,
//           map: map,
//           animation: google.maps.Animation.DROP,
//           icon: {
//             url: "/images/wt-meter-icon.png",
//             scaledSize: new google.maps.Size(30, 27), // scaled size
//             // origin: new google.maps.Point(0,0), // origin
//             // anchor: new google.maps.Point(0, 0) // anchor
//           },
//           title: 'Uluru (Ayers Rock)'
//         })
//       let content = data[i].name;                  
//       marker['infowindow'] = new google.maps.InfoWindow({
//         content: content
//       });
//       google.maps.event.addListener(marker, 'click', function () {
//         // this['infowindow'].open(map, this);
//         open_modal();
//     });
//     google.maps.event.addListener(marker, 'mouseover', function () {
//       this['infowindow'].open(map, this);
//     });
//     google.maps.event.addListener(marker, 'mouseout', function () {
//       this['infowindow'].close(map, this);
//     });
//   }

//   for(let i=0; i<data_draw_map.length; i++){
//       let flightPath = new google.maps.Polyline({
//       path: [data_draw_map[i].point_1, data_draw_map[i].point_2],
//       geodesic: true,
//       strokeColor: "#FF0000",
//       strokeOpacity: 1.0,
//       strokeWeight: 3,
//       });
//       flightPath.setMap(map);
//   }
//   for(let i=0; i<data_zone_map.length; i++){
//       let polygon = new google.maps.Polygon({
//       paths: data_zone_map[i],
//       strokeColor: "#36aff5",
//       strokeOpacity: 0.6,
//       strokeWeight: 1,
//       fillColor: "#36aff5",
//       fillOpacity: 0.35,
//       draggable: false,
//       geodesic: true,
//       });
//       polygon.setMap(map)
//   }


//   // map.addListener("click", (mapsMouseEvent) => {
//   //   let point = mapsMouseEvent.latLng.toJSON();
//   //   if(POINT_1 == null && POINT_2 == null){POINT_1 = point; return true;}
//   //   if(POINT_1 != null && POINT_2 == null){POINT_2 = point; creat_line(POINT_1,POINT_2); POINT_1 = null; POINT_2 = null;}
//   // })
// }
// $(document).ready(function(){
//   $(".gm-style-iw").next("div").hide();

// })

var POINT_1 = null, POINT_2 = null;
var SAVE_SETMAP = [];

function creat_line(point_1, point_2){
  var flightPath_son = new google.maps.Polyline({
  path: [point_1,point_2],
  geodesic: true,
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
});
  // flightPath.push(flightPath_son);
  flightPath_son.setMap(map);
  SAVE_SETMAP.push({point_1:point_1, point_2: point_2})
}

//line_chart_lv_1
// let line_chart_lv_1 = null;
// function render_line_chart_lv_1(){
//   let data =[];
//   let thickness = 3;
//   let TYPE = "line";
//   am4core.useTheme(am4themes_animated);
//   if(line_chart_lv_1){
//     line_chart_lv_1.dispose();
//     delete line_chart_lv_1;
//   }
//   line_chart_lv_1 = am4core.create("line_chart_lv_1", am4charts.XYChart);
//   line_chart_lv_1.scrollbarX = new am4core.Scrollbar();
//   line_chart_lv_1.data = data;
//   line_chart_lv_1.logo.disabled = true;
//   let dateAxis = line_chart_lv_1.xAxes.push(new am4charts.DateAxis());
//   dateAxis.renderer.minGridDistance = 60;
//   dateAxis.startLocation = 0.5;
//   dateAxis.endLocation = 0.5;
//   dateAxis.renderer.grid.template.location = 0;
//   dateAxis.renderer.grid.template.disabled = true;
//   dateAxis.renderer.fullWidthTooltip = true;
//   dateAxis.dateFormats.setKey("hour", "HH:mm");
//   dateAxis.dateFormats.setKey("day", "dd/MM");
//   dateAxis.periodChangeDateFormats.setKey("hour", "dd/MM"); 
//   dateAxis.dateFormats.setKey("month", "MM/yyyy");
//   dateAxis.periodChangeDateFormats.setKey("day", "MM/yyyy");

//   line_chart_lv_1.cursor = new am4charts.XYCursor();
//   line_chart_lv_1.cursor.fullWidthLineX = true;
//   line_chart_lv_1.cursor.xAxis = dateAxis;
//   line_chart_lv_1.cursor.lineX.strokeWidth = 0;
//   line_chart_lv_1.cursor.lineX.fill = am4core.color("#000");
//   line_chart_lv_1.cursor.lineX.fillOpacity = 0.1;
//   line_chart_lv_1.legend = new am4charts.Legend();

//   let title = line_chart_lv_1.titles.create();
//   title.text = "BIỂU ĐỒ SẢN LƯỢNG NƯỚC SẠCH QUẢNG NINH";
//   title.fontSize = 20;
//   title.marginTop = 15;
//   title.marginBottom = 20;

//   var m3 = line_chart_lv_1.yAxes.push(new am4charts.ValueAxis());
//   m3.tooltip.disabled = false;
//   m3.renderer.ticks.template.disabled = true;
//   m3.renderer.axisFills.template.disabled = true;
//   m3.renderer.line.strokeOpacity = 0.5;
//   m3.renderer.line.strokeWidth = 1;
//   m3.title.text ="m3"
//   m3.renderer.opposite = false;
//   m3.extraMin = 0.1;
//   m3.extraMax = 0.1; 
  
   
//     var series;
//     series = line_chart_lv_1.series.push(new am4charts.LineSeries());
//     series.yAxis = m3;
    
//     series.dataFields.valueY = "sanluong";
//     series.dataFields.dateX = "time";
//     series.title = "Sản lượng";
//     series.strokeWidth = thickness;
//     series.tensionX = 0.9;
//     series.showOnInit = true;
//     series.legendSettings.labelText = "Sản lượng (m3)";
//     series.tooltipText = "Sản lượng" + ": {valueY} " + "(m3)";
//     series.name = "Sản lượng"
//     series.tooltip.pointerOrientation = "horizontal";
//     series.fill = am4core.color("#ff0000");
//     series.stroke = am4core.color("#ff0000");
// }

// let line_chart_lv_2 = null;

// function render_line_chart_lv_2(NAME){
//     let data =[];
//     let thickness = 3;
//     thickness = 3;
//     am4core.useTheme(am4themes_animated);
//     if(line_chart_lv_2 != null){
//       line_chart_lv_2.dispose();
//     }
//     line_chart_lv_2 = am4core.create("line_chart_lv_2", am4charts.XYChart);
//     line_chart_lv_2.scrollbarX = new am4core.Scrollbar();
//     line_chart_lv_2.data = data;
//     line_chart_lv_2.logo.disabled = true;
//     let dateAxis = line_chart_lv_2.xAxes.push(new am4charts.DateAxis());
//     dateAxis.renderer.minGridDistance = 60;
//     dateAxis.startLocation = 0.5;
//     dateAxis.endLocation = 0.5;
//     dateAxis.renderer.grid.template.location = 0;
//     dateAxis.renderer.grid.template.disabled = true;
//     dateAxis.renderer.fullWidthTooltip = true;
//     dateAxis.dateFormats.setKey("hour", "HH:mm");
//     dateAxis.dateFormats.setKey("day", "dd/MM");
//     dateAxis.periodChangeDateFormats.setKey("hour", "dd/MM"); 
//     dateAxis.dateFormats.setKey("month", "MM/yyyy");
//     dateAxis.periodChangeDateFormats.setKey("day", "MM/yyyy");
  
//     line_chart_lv_2.cursor = new am4charts.XYCursor();
//     line_chart_lv_2.cursor.fullWidthLineX = true;
//     line_chart_lv_2.cursor.xAxis = dateAxis;
//     line_chart_lv_2.cursor.lineX.strokeWidth = 0;
//     line_chart_lv_2.cursor.lineX.fill = am4core.color("#000");
//     line_chart_lv_2.cursor.lineX.fillOpacity = 0.1;
//     line_chart_lv_2.legend = new am4charts.Legend();
  
//     let title = line_chart_lv_2.titles.create();
//     title.text = "Biểu đồ lưu lượng áp suất " + NAME;
//     title.fontSize = 25;
//     title.marginTop = 10;
//     title.marginBottom = 7;
//     title.fontWeight = "bold";
  
//     let Pa = line_chart_lv_2.yAxes.push(new am4charts.ValueAxis());
//     Pa.tooltip.disabled = false;
//     Pa.renderer.ticks.template.disabled = true;
//     Pa.renderer.axisFills.template.disabled = true;
//     Pa.renderer.line.strokeOpacity = 0.5;
//     Pa.renderer.line.strokeWidth = 1;
//     Pa.title.text ="Pa"
//     Pa.renderer.opposite = true;
//     Pa.extraMin = 0.1;
//     Pa.extraMax = 0.1; 
  
//     var m3h = line_chart_lv_2.yAxes.push(new am4charts.ValueAxis());
//     m3h.tooltip.disabled = false;
//     m3h.renderer.ticks.template.disabled = true;
//     m3h.renderer.axisFills.template.disabled = true;
//     m3h.renderer.line.strokeOpacity = 0.5;
//     m3h.renderer.line.strokeWidth = 1;
//     m3h.title.text ="m3/h"
//     m3h.renderer.opposite = false;
//     m3h.extraMin = 0.1;
//     m3h.extraMax = 0.1; 
  
//     // var m3 = chart2.yAxes.push(new am4charts.ValueAxis());
//     // m3.tooltip.disabled = false;
//     // m3.renderer.ticks.template.disabled = true;
//     // m3.renderer.axisFills.template.disabled = true;
//     // if(unit.indexOf("m3") != -1){
//     // m3.renderer.line.strokeOpacity = 0.5;
//     // m3.renderer.line.strokeWidth = 1;
//     // m3.title.text ="m3"
//     // }
//     // m3.renderer.opposite = true;
//     // m3.extraMin = 0.1;
//     // m3.extraMax = 0.1; 
    

//       var series;
//       series = line_chart_lv_2.series.push(new am4charts.LineSeries());
//       series.yAxis = Pa;
//       series.dataFields.valueY = "apsuat";
//       series.dataFields.dateX = "time";
//       series.title = "Áp suất";
//       series.strokeWidth = thickness;
//       series.tensionX = 1;
//       series.showOnInit = true;
//       series.legendSettings.labelText = "Áp suất (Pa)";
//       series.tooltipText ="Áp suất"+ ": {valueY} " + "(Pa)";
//       series.name = "Áp suất";
//       series.tooltip.pointerOrientation = "horizontal";
//       series.fill = am4core.color("#07cc04");
//       series.stroke = am4core.color("#07cc04");
    
//       var series_2;
//       series_2 = line_chart_lv_2.series.push(new am4charts.LineSeries());
//       series_2.yAxis = m3h;
//       series_2.dataFields.valueY = "luuluong";
//       series_2.dataFields.dateX = "time";
//       series_2.title = "Lưu lượng";
//       series_2.strokeWidth = thickness;
//       series_2.tensionX = 1;
//       series_2.showOnInit = true;
//       series_2.legendSettings.labelText = "Lưu lượng (m3h)";
//       series_2.tooltipText ="Lưu lượng"+ ": {valueY} " + "(m3h)";
//       series_2.name = "Lưu lượng";
//       series_2.tooltip.pointerOrientation = "horizontal";
//       series_2.fill = am4core.color("#040ecc");
//       series_2.stroke = am4core.color("#040ecc");
// }

// function show_level_3_screen(){
//   previous_screen = screen;
//   screen = 3;
//   document.body.scrollTop = 0; // For Safari
//   document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
//   $(".page_").hide();
//   $(".page_").prop("disabled",true);
//   $("#page_3").show();
//   $("#page_3").prop("disabled",false);
// }

var zoom_chart = null
function zooming_pie_chart(meter_id,serial_sensor){
  httpAsync(null,"/get/data_zooming_chart?meter_id="+meter_id+"&serial_sensor="+serial_sensor+"&fr="+LV1_MAIN_PIE_CHART_FROM_DATA+"&to="+LV1_MAIN_PIE_CHART_TO_DATA,"GET",function(result){
    console.log(LV1_MAIN_PIE_CHART_FROM_DATA,LV1_MAIN_PIE_CHART_TO_DATA)
    let parse_data = JSON.parse(result);
    let loss = null, remain = null, name = "-";
    if(parse_data.err_code == 1){
      alert(parse_data.message)
      return false;
    }else{
      let data = parse_data.data;
      console.log(data)
      let no_data = 0;
      loss = return_that_thoat(data.sum_nhanh,data.sum_tong);
      remain = Number(data.sum_nhanh);
      if(loss == 0 && remain == 0){
        no_data = 1;
        remain = 100;
        loss = 0;
      }

      name = data.name;
      am4core.useTheme(am4themes_animated);
      $("#zoom_modal").modal("show");
      if(zoom_chart != null){
        zoom_chart.dispose();
        delete(zoom_chart)
      }
      zoom_chart = am4core.create("zoom_pie_chart", am4charts.PieChart3D);
      zoom_chart.hiddenState.properties.opacity = 0;
      zoom_chart.data = [
        {
          category: "SL thất thoát",
          value: loss
        },{
          category: "SL tiêu thụ",
          value: remain
        }
      ]
      zoom_chart.innerRadius = am4core.percent(0);
      zoom_chart.depth = 20;

      zoom_chart.legend = new am4charts.Legend();
      zoom_chart.radius = am4core.percent(90);
      zoom_chart.logo.disabled = true;
      zoom_chart.responsive.enabled = true;
      zoom_chart.legend.valueLabels.template.disabled = true;
      zoom_chart.legend.position = "bottom";

      let series = zoom_chart.series.push(new am4charts.PieSeries3D());
      series.dataFields.value = "value";
      series.dataFields.category = "category";
      // series.colors.step = 3;
      if(no_data == 1){
        series.slices.template.tooltipText = "{category}: {value} (%) (0)";
      }
      series.colors.list = [
        am4core.color(lost_color),
        am4core.color(remain_color),
      ];
      series.ticks.template.disabled = true;
      series.alignLabels = false;
      series.labels.template.text = ""
      // series.tooltip.disabled = true;
      // series.slices.template.alwaysShowTooltip = false;
    // series.slices.template.tooltipText = ""

      // let container = new am4core.Container();
      // container.parent = series;
      // container.horizontalCenter = "middle";
      // container.verticalCenter = "middle";
      // container.width = am4core.percent(40) / Math.sqrt(2);
      // container.fill = "white";
      // zoom_chart = am4core.create("zoom_pie_chart", am4charts.PieChart3D);
      // zoom_chart.hiddenState.properties.opacity = 0;
      // zoom_chart.data = [
      //   {
      //     category: "Thất thoát",
      //     value: DATA.loss
      //   },{
      //     category: "Còn lại",
      //     value: DATA.remain
      //   }
      // ]
      // zoom_chart.innerRadius = am4core.percent(50);
      // zoom_chart.depth = 25;
      // zoom_chart.legend = new am4charts.Legend();
      // zoom_chart.legend.position = "right";
      // zoom_chart.radius = am4core.percent(100);
      // zoom_chart.logo.disabled = true;
      // // resoivie biểu đồ theo container
      // zoom_chart.responsive.enabled = true;
      // // ẩn phần trăm ở chú thích
      // zoom_chart.legend.valueLabels.template.disabled = true;
      // let series = zoom_chart.series.push(new am4charts.PieSeries3D());
      // series.dataFields.value = "value";
      // series.dataFields.category = "category";
      // // series.slices.template.cornerRadius = 5;
      // series.colors.step = 3;
      let title = zoom_chart.titles.create();
      title.text = name + " - " + meter_id;
      title.fontSize = 20;
      title.marginTop = 15;
      title.marginBottom = 20;
      }
  })
}

function load_level_4_data(node_id){
  previous_screen = screen;
  screen = 4;
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  $(".page_").hide();
  $(".page_").prop("disabled",true);
  $("#page_4").show();
  $("#page_4").prop("disabled",false);
  load_mess_rate(node_id,"mess_rate_lv_4")
  get_data_level_4(node_id);

}

function get_data_level_4(node_id){
  if(LEVEL_4_MAIN_LINE_CHART){
    LEVEL_4_MAIN_LINE_CHART.dispose();
    delete LEVEL_4_MAIN_LINE_CHART;
  }
  $("#main_instant_meter_tong_container_lv_4").empty();
  $("#main_instant_meter_tong_container_lv_4").append('<div class="text-center" id="" style="width: 100%; height: 500px; margin: auto; display: block;"><div class="spinner-border m-5" role="status" style="width: 250px; height: 250px;"> <span class="sr-only">Loading...</span> </div></div>');
  httpAsync(null,"/get/data_level_4?node_id="+node_id,"GET",function(result){
    let parse_data = JSON.parse(result);
    let ins_data = parse_data.data.ins_data;
    let chart_data = parse_data.data.chart_data;
    $("#meter_pressure_lv_4").html(show_if_null(ins_data.last_pressure)+' (Bar)')
    $("#general_flow_rate_lv_4").html(show_if_null(ins_data.last_flow_rate)+' (m3/h)')
    $("#general_terminal_index_lv_4").html(show_if_null(ins_data.last_terminal_index)+' (m3)')
    let string_append = ""
    +'<div class="col-3" style="min-width: 400px; max-width: 400px;">'
    +'<div class="card text-left border_radius">'
    +'<div class="card-body">'
    +'<h4 class="font-weight-bold">'+show_if_null(ins_data.name)+'</h4>'
    if(ins_data.status == 1){
      string_append += '<span style="font-weight: bold; color: green">'+show_if_null(ins_data.meter_id)+'</span>'
      +'<div class="row mt-2 mt-2">'
      +'<i class="fa fa-clock-o display-7 mt-1" aria-hidden="true" style="color: green"></i> <span class="text-uppercase display-7" style="color: green">'+show_if_null(ins_data.last_ValOfNum)+'</span>'
      +'</div>'
    }else{
      string_append += '<span style="font-weight: bold; color: red">'+show_if_null(ins_data.meter_id)+'</span>'
      +'<div class="row mt-2 mt-2">'
      +'<i class="fa fa-clock-o display-7 mt-1" aria-hidden="true" style="color: red"></i> <span class="text-uppercase display-7" style="color: red">'+show_if_null(ins_data.last_ValOfNum)+'</span>'
      +'</div>'
    }
    string_append += ''
    +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
    +'<span class="text-left">Sản lượng: </span>'
    +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(ins_data.last_terminal_index)+'</span> (m3)</span>'
    +'</div>'
    +'<div class="row mt-2 mt-2 mt-2 mb-2" style="border-bottom: solid 1px gray; width: 100%;">'
    +'<span class="text-left">Lưu lượng: </span>'
    +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(ins_data.last_flow_rate)+'</span> (m3/h)</span>'
    +'</div>'
    +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
    +'<span class="text-left">Áp suất: </span>'
    +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(ins_data.last_pressure)+'</span> (Bar)</span>'
    +'</div>'
    +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
    +  '<span class="text-left">Sản lượng thuận: </span>'
    +  '<span class="ml-auto"><span class="font-weight-bold">'+'-'+'</span> (m3)</span>'
    +  '</div>'
    +  '<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
    +  '<span class="text-left">Sản lượng ngược: </span>'
    +  '<span class="ml-auto"><span class="font-weight-bold">'+'-'+'</span> (m3</span>'
    +  '</div>'
    +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
    +'<span class="text-left">Mực nước bể: </span>'
    +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(ins_data.last_measure_cacul)+'</span> (m)</span>'
    +'</div>'
    +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
    +'<span class="text-left">Tần suất dữ liệu (Phút): </span>'
    +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(ins_data.frequency)+'</span> (Phút)</span>'
    +'</div>'
    +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
    +'<span class="text-left">Điện áp pin dự phòng: </span>'
    +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(ins_data.last_voltage_pin)+'</span> (V)</span>'
    +'</div>'
    +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
    +'<span class="text-left">Điện áp ác quy: </span> '
    +'<span class="ml-auto"><span class="font-weight-bold">'+show_if_null(ins_data.last_voltage_ac_quy)+'</span> (V)</span>'
    +'</div>'
    +'<div class="row mt-2 mt-2" style="border-bottom: solid 1px gray; width: 100%;">'
    +'<span class="text-left">Thời điểm: </span>'
    +'<span class="ml-auto"><span class="font-weight-bold">'+return_date_format_ddmmyyhhmmss(ins_data.last_meter_time)+'</span></span>'
    +'</div>'
    +'</div>'
    +'<div class="card-footer text-right">'
    +'<button class="btn btn-outline-secondary mr-1" title="Gửi bản tin tức thời" onclick="send_instant_mess(`'+ins_data.name+'`,`'+ins_data.meter_id+'`,`'+ins_data.serial_sensor+'`)"><i class="fas fa-eye"></i></button>'
    +'<button class="btn btn-outline-secondary mr-1" title="Chỉ số từng thời điểm" onclick="data_modal(`'+ins_data.name+'`,`'+ins_data.meter_id+'`,`'+ins_data.serial_sensor+'`)"><i class="fas fa-database"></i></button>'
    +'<button class="btn btn-outline-secondary mr-1" title="Biểu đồ" onclick="chart_modal(`'+ins_data.name+'`,`'+ins_data.meter_id+'`,`'+ins_data.serial_sensor+'`)"><i class="fas fa-chart-line"></i></button>'
    +'<button class="btn btn-outline-secondary mr-1" title="Cảnh báo" onclick="alert_modal(`'+ins_data.name+'`,`'+ins_data.meter_id+'`,`'+ins_data.serial_sensor+'`)"><i class="fas fa-exclamation-triangle"></i></button>'
    +'<button class="btn btn-outline-secondary mr-1" onclick="open_modal(`'+ins_data.name+'`,`'+ins_data.meter_id+'`,`'+ins_data.serial_sensor+'`,null)"><i class="fa fa-cog" aria-hidden="true"></i> Chi tiết</button>'
    +'<button class="btn btn-outline-secondary" title="Log" onclick="log_modal(`'+ins_data.name+'`,`'+ins_data.meter_id+'`,`'+ins_data.serial_sensor+'`)"><i class="fas fa-history"></i></button>'
    +'</div>'
    +'</div>'
    +'</div>'
    $("#main_instant_meter_tong_container_lv_4").empty();
    $("#main_instant_meter_tong_container_lv_4").append(string_append);
    $("#main_instant_meter_tong_container_lv_4").append('<div id="main_line_chart_lv_4" class="col" style="width: 100%; height: 500px; margin: auto"></div>');
    render_level_4_main_line_chart(chart_data);

  })
}

var LEVEL_4_MAIN_LINE_CHART = null;

function render_level_4_main_line_chart(data){
  let chart_data = [];
  for(let i=0; i<data.length; i++){
    chart_data.push({
      meterTime: new Date(data[i].meterTime),
      terminal_index: stringtonum(data[i].terminal_index),
      flowRate: stringtonum(data[i].flowRate),
      pressure: stringtonum(data[i].pressure)
    })
  }
  let thickness = 3;
  am4core.useTheme(am4themes_animated);
  if(LEVEL_4_MAIN_LINE_CHART){
    LEVEL_4_MAIN_LINE_CHART.dispose();
    delete LEVEL_4_MAIN_LINE_CHART;
  }
  LEVEL_4_MAIN_LINE_CHART = am4core.create("main_line_chart_lv_4", am4charts.XYChart);
  LEVEL_4_MAIN_LINE_CHART.scrollbarX = new am4core.Scrollbar();
  LEVEL_4_MAIN_LINE_CHART.data = chart_data;
  LEVEL_4_MAIN_LINE_CHART.logo.disabled = true;
  let dateAxis = LEVEL_4_MAIN_LINE_CHART.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 60;
  dateAxis.startLocation = 0.5;
  dateAxis.endLocation = 0.5;
  dateAxis.renderer.grid.template.location = 0;
  dateAxis.renderer.grid.template.disabled = true;
  dateAxis.renderer.fullWidthTooltip = true;
  // dateAxis.dateFormats.setKey("minutes", "HH:mm");

  dateAxis.dateFormats.setKey("hour", "HH:mm");
  dateAxis.dateFormats.setKey("day", "dd/MM");
  dateAxis.periodChangeDateFormats.setKey("hour", "dd/MM"); 
  dateAxis.dateFormats.setKey("month", "MM/yyyy");
  dateAxis.periodChangeDateFormats.setKey("day", "MM/yyyy");

  LEVEL_4_MAIN_LINE_CHART.cursor = new am4charts.XYCursor();
  LEVEL_4_MAIN_LINE_CHART.cursor.fullWidthLineX = true;
  LEVEL_4_MAIN_LINE_CHART.cursor.xAxis = dateAxis;
  LEVEL_4_MAIN_LINE_CHART.cursor.lineX.strokeWidth = 0;
  LEVEL_4_MAIN_LINE_CHART.cursor.lineX.fill = am4core.color("#000");
  LEVEL_4_MAIN_LINE_CHART.cursor.lineX.fillOpacity = 0.1;
  LEVEL_4_MAIN_LINE_CHART.legend = new am4charts.Legend();

  // let title = LEVEL_1_MAIN_LINE_CHART.titles.create();
  // title.text = "Biểu đồ  "+title_chart;
  // title.fontSize = 25;
  // title.marginTop = 10;
  // title.marginBottom = 7;
  // title.fontWeight = "bold";

  var m3 = LEVEL_4_MAIN_LINE_CHART.yAxes.push(new am4charts.ValueAxis());
  m3.tooltip.disabled = false;
  m3.renderer.ticks.template.disabled = true;
  m3.renderer.axisFills.template.disabled = true;
  m3.renderer.line.strokeOpacity = 0.5;
  m3.renderer.line.strokeWidth = 1;
  m3.title.text ="m3"
  m3.renderer.opposite = false;
  m3.extraMin = 0.1;
  m3.extraMax = 0.1; 

  var bar = LEVEL_4_MAIN_LINE_CHART.yAxes.push(new am4charts.ValueAxis());
  bar.tooltip.disabled = false;
  bar.renderer.ticks.template.disabled = true;
  bar.renderer.axisFills.template.disabled = true;
  bar.renderer.line.strokeOpacity = 0.5;
  bar.renderer.line.strokeWidth = 1;
  bar.title.text ="bar"
  bar.renderer.opposite = false;
  bar.extraMin = 0.1;
  bar.extraMax = 0.1; 

  var m3h = LEVEL_4_MAIN_LINE_CHART.yAxes.push(new am4charts.ValueAxis());
  m3h.tooltip.disabled = false;
  m3h.renderer.ticks.template.disabled = true;
  m3h.renderer.axisFills.template.disabled = true;
  m3h.renderer.line.strokeOpacity = 0.5;
  m3h.renderer.line.strokeWidth = 1;
  m3h.title.text ="m3/h"
  m3h.renderer.opposite = true;
  m3h.extraMin = 0.1;
  m3h.extraMax = 0.1; 
  
   
    var series;
    series = LEVEL_1_MAIN_LINE_CHART.series.push(new am4charts.LineSeries());
    series.yAxis = m3;
    
    series.dataFields.valueY = "terminal_index";
    series.dataFields.dateX = "meterTime";
    series.title = "Sản lượng";
    series.strokeWidth = thickness;
    series.tensionX = 1;
    series.showOnInit = true;
    series.legendSettings.labelText = "Sản lượng (m3)";
    series.tooltipText = "Sản lượng" + ": {valueY} " + "(m3)";
    series.name = "Sản lượng"
    series.tooltip.pointerOrientation = "horizontal";
    // series.fill = am4core.color(remain_color);
    series.stroke = am4core.color(remain_color);
    // series.fillOpacity = 0.8;

    var series_2;
    series_2 = LEVEL_4_MAIN_LINE_CHART.series.push(new am4charts.LineSeries());
    series_2.yAxis = bar;
    series_2.dataFields.valueY = "pressure";
    series_2.dataFields.dateX = "meterTime";
    series_2.title = "Áp suất";
    series_2.strokeWidth = thickness;
    series_2.tensionX = 1;
    series_2.showOnInit = true;
    series_2.legendSettings.labelText = "Áp suất (bar)";
    series_2.tooltipText = "Áp suất" + ": {valueY} " + "(m3)";
    series_2.name = "Áp suất"
    series_2.tooltip.pointerOrientation = "horizontal";
    // series_2.fill = am4core.color(lost_color);
    series_2.stroke = am4core.color(lost_color);
    // series_2.fillOpacity = 0.8;

    var series_3;
    series_3 = LEVEL_4_MAIN_LINE_CHART.series.push(new am4charts.LineSeries());
    series_3.yAxis = m3h;
    series_3.dataFields.valueY = "flowRate";
    series_3.dataFields.dateX = "meterTime";
    series_3.title = "Lưu lượng";
    series_3.strokeWidth = thickness;
    series_3.tensionX = 1;
    series_3.showOnInit = true;
    series_3.legendSettings.labelText = "Lưu lượng (m3/h)";
    series_3.tooltipText = "Lưu lượng" + ": {valueY} " + "(m3/h)";
    series_3.name = "Lưu lượng"
    series_3.tooltip.pointerOrientation = "horizontal";
    // series_2.fill = am4core.color(lost_color);
    series_3.stroke = am4core.color("#50a605");
    // series_2.fillOpacity = 0.8;
}



var AL_TO_GROUP_ALERT = (new Date()).getTime();
var AL_FROM_GROUP_ALERT = AL_TO_GROUP_ALERT - 7 * 24 * 3600000;
$(function() {
  $('#time_group_alert_from').daterangepicker(
    {
      singleDatePicker: true,
       showDropdowns: true,
       showWeekNumbers: true,
      //  timePicker: true,
      //  timePickerIncrement: 1,
      //  timePicker24Hour: true,
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
           format: 'DD/MM/YYYY'
       }
    },
      function(start, end) {
        AL_FROM_GROUP_ALERT = new Date(end).getTime();   
    }
 );
});

$(function() {
  $('#time_group_alert_to').daterangepicker(
    {
      singleDatePicker: true,
       showDropdowns: true,
       showWeekNumbers: true,
      //  timePicker: true,
      //  timePickerIncrement: 1,
      //  timePicker24Hour: true,
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
           format: 'DD/MM/YYYY'
       }
    },
    function(start, end) {
      AL_TO_GROUP_ALERT = new Date(end).getTime();   
    }
 );
});

function group_alert(){
  AL_TO_GROUP_ALERT = new Date().getTime();  // thời gian kết thúc
  AL_FROM_GROUP_ALERT = AL_TO_GROUP_ALERT -  7*3600000*24 // thời gian bắt đầu
  $("#time_group_alert_to").data("daterangepicker").setStartDate(moment());
  $("#time_group_alert_to").data("daterangepicker").setEndDate(moment());
  $("#time_group_alert_from").data("daterangepicker").setStartDate(moment().subtract(moment.duration(7,"days")));
  $("#time_group_alert_from").data("daterangepicker").setEndDate(moment().subtract(moment.duration(7,"days")));
  SELECTPARAMETER = ["APSUAT","ACQUY","SL","LOST","PIN","OP"]
  setup_alert_filter();
  $("#al_group_modal_title").html(DATA_LOST_OUTPUT_NAME);
  $("#al_group_modal").modal('show');
    // Lấy dữ liệu và hiển thị
    get_group_alert_render_table();
}

function get_group_alert_render_table(){
  httpAsync(null,"/get/group_alert?fr="+AL_FROM_GROUP_ALERT+"&to="+AL_TO_GROUP_ALERT+"&group_id="+DATA_LOST_OUTPUT_GROUP_ID+"&para="+SELECTPARAMETER.join(),"GET",function(result){
    if(result == "" || result == null){
      al_group_loadAL([]);
    }else{
      let data = JSON.parse(result);
      al_group_loadAL(data);
    }
  })
}

function al_group_loadAL(data){
  $(document).ready(function() {
    $("#al_group_totalAlert").val(data.length);
    $('#al_group_tableAlert').DataTable().destroy();
    $('#al_group_tableAlert').DataTable({
          "pageLength": 25,
          language : translate_data_table(LANG),
          "columnDefs": [
            { className: "dt-head-center", targets: [ 0, 1, 2, 3, 4, 5, 6, 7] },
          //   { "orderable": false, "targets": [0, 2, 3, 6, 7, 8, 9] },
            { "orderable": true, "targets": [0, 1, 2] }
        ],
          data: modifi_group_alert(data),
          columns: [
            {data: "index", className: "text-center-data-table align-middle"},
            {data: "alert_time", className: "text-center-data-table align-middle"},
            {data: "meter_id", className: "text-center-data-table align-middle"},
            {data: "name", className: "text-center-data-table align-middle"},
            {data: "alert_type", className: "text-center-data-table align-middle"},
            {data: "threshold", className: "text-center-data-table align-middle"},
            {data: "value", className: "text-center-data-table align-middle"},
            {data: "serial_sensor", className: "text-center-data-table align-middle"},
          ]
      });
  });
}

function modifi_group_alert(data){
  var y=[];
  for(let i=0; i<data.length; i++){
    let x ={ 
      index: i+1,
      alert_time: return_date_format_ddmmyyhhmmss(data[i].alert_time),
      meter_id: (data[i].para == "LOST") ? "-" : data[i].meter_id,
      name: data[i].name,
      alert_type: data[i].alert_type,
      threshold: (data[i].para == "LOST") ? data[i].group_threshold : data[i].threshold,
      value: (data[i].para == "LOST") ? data[i].alert_value + " (" + (Number(data[i].threshold)).toFixed(1) + " %)" :data[i].alert_value,
      serial_sensor: (data[i].para == "LOST") ? "-" : data[i].serial_sensor
    }
    y.push(x);
  }
  return(y);
}

function al_group_filter(){
  get_group_alert_render_table()
}

var SELECTPARAMETER = ["APSUAT","ACQUY","SL","LOST","PIN","OP"];

$(".checkbox-menu").on("change", "input[type='checkbox']", function() {
  $(this).closest("li").toggleClass("active", this.checked);
});

$(document).on('click', '.allow-focus', function (e) {
  e.stopPropagation();
 })

 $(document).ready(function(){
  $(document).on("click", ".selectParaAlert",function(){
   if($(this).is(":checked")){
     let sourceType= $(this).val();
     SELECTPARAMETER.push(sourceType);
   }else{
     let para= $(this).val();
     let index = SELECTPARAMETER.indexOf(para);
     SELECTPARAMETER.splice(index, 1);
   }
  })
})

function setup_alert_filter(){
  for(let i=0; i<SELECTPARAMETER.length;i++){
    $("[value="+SELECTPARAMETER[i]+"].selectParaAlert").prop("checked",true);
  }
}

// Tìm kiếm thiết bị 
$(document).ready(function(){
  $(document).on("keyup","#search_meter_list", function() {
    // console.log($("#search_meter_list").val());
    let search_key = $("#search_meter_list").val();
    let data_after_search = []
    for(let i=0; i<INS_DATA_LV_3.length; i++){
      if(INS_DATA_LV_3[i].meter_id.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().includes(search_key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()) || INS_DATA_LV_3[i].name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().includes(search_key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase())){
        data_after_search.push(INS_DATA_LV_3[i]);
      }
    }
    render_info_meter_nhanh_lv_3(data_after_search)
  });
})
