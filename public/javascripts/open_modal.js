var NODE_ID = null;
var METER_ID = null;
var SERIAL_SENSOR = null;
var ID = null;

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

function open_modal(name,meter_id,serial_sensor,node_id){
   
    METER_ID = meter_id;
    SERIAL_SENSOR = serial_sensor;
    ID = METER_ID;
    $("#titleNameEQ").html(name + "<br>" + METER_ID);
    fill_instant_value(METER_ID,SERIAL_SENSOR)
    $("#DetalEQ").modal('show');
    // httpAsync(null,"/get/meter_id_node_id?meter_id="+meter_id+"&serial_sensor="+serial_sensor+"&node_id="+node_id,"GET",function(result){
    //     let data = JSON.parse(result);
    //     if(data.err_code == 1){
    //         alert(data.message);
    //     }else{
    //         NODE_ID = data.data.node_id;
    //         METER_ID = data.data.meter_id;
    //         ID = METER_ID;
    //         SERIAL_SENSOR =  data.data.serial_sensor;
    //         document.getElementById("titleNameEQ").innerHTML = METER_ID;
    //         fill_instant_value(METER_ID,SERIAL_SENSOR)
    //     }
    // })
}


function fill_instant_value(meter_id, serial_sensor){
    httpAsync(null,"/source/get/instant_value?id="+meter_id+"&serial_sensor="+serial_sensor,"GET",function(result){
        let data;
        if(result =="" || result == null){
            return false;
        }else{
            data = JSON.parse(result);
            $("#ins_val_idEQ").val(data.meter_id);  // mã thiết bị
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
    fill_instant_value(METER_ID, SERIAL_SENSOR);
}

//Tab chỉ số từng thời điểm 
var TO_DATA = new Date().getTime();  // thời gian kết thúc
var FROM_DATA = TO_DATA -  3600000*24 // thời gian bắt đầu
var MOMENT_DATA = "raw"                // thời điểm
$(function() {
    $('#pick_time_data_from').daterangepicker(
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
          FROM_DATA = new Date(end).getTime();   
      }
   );
  //  $('#reportrange span').html(moment().subtract(29, 'day').format('D MMMM YYYY') + ' - ' + moment().format('D MMMM YYYY'));
  });

  $(function() {
    $('#pick_time_data_to').daterangepicker(
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
        TO_DATA = new Date(end).getTime();   
      }
   );
  //  $('#reportrange span').html(moment().subtract(29, 'day').format('D MMMM YYYY') + ' - ' + moment().format('D MMMM YYYY'));
  });


// $(document).ready(function(){   // thay đổi khoảng thời gian hiển thị chỉ số theo thời điểm
//     $("#select_time_data").change(function(){
//         let x = new Date();
//         let val = $(this).children("option:selected").val();
//         if(val == "custom"){
//             $("#pick_time_data").css("display","block");
//         }else{
//             $("#pick_time_data").css("display","none");
//         }
//         switch(val){
//             case "24hour":
//                 TO_DATA = x.getTime();
//                 FROM_DATA = TO_DATA - 24*3600000;
//                 break;
//             case "week":
//                 TO_DATA = x.getTime();
//                 FROM_DATA = TO_DATA - 3600000 * 24 * 7;
//                 break;
//             case "month":
//                 TO_DATA = x.getTime();
//                 FROM_DATA = TO_DATA - 3600000 * 24 * 30;
//                 break;
//         }
//     })
//   })
//   $(function() {
//     $('#pick_time_data').daterangepicker(  // pick khoảng thời gian cụ thể
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
//         FROM_DATA = new Date(start).getTime() ;
//         TO_DATA = new Date(end).getTime();   
//       }
//    );
// });
var COMPEN_VALUE = 0;
function get_data(meter_id,serial_sensor){              // lấy dữ liệu và hiển thị
    // MOMENT_DATA = $("#select_moment_data").val();
    httpAsync(null,"/source/get/compen_value","GET",function(value){
      if(value == null || value == ""){
        COMPEN_VALUE = 0
      }else{
        let data = JSON.parse(value)
        COMPEN_VALUE = data[0].compen_value;
      }
      httpAsync(null,"/source/get/dataEQ?id="+meter_id+"&to="+TO_DATA+"&fr="+FROM_DATA,"GET",function(result){
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

function config_data(data,compen_value){ 
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
        measure_value_level: data[i].measure_cacul + + ((compen_value == null || compen_value == "") ? 0 : compen_value),
        pin_vol: data[i].Voltage,
        batter_vol: data[i].voltage_ac_quy,
        quanity: data[i].terminal_index,
        }
        a++;
        y.push(x);
      }
      return(y);
  }

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
                data: config_data(data,COMPEN_VALUE),
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
    get_data(METER_ID,SERIAL_SENSOR);
}
// xuất dữ liệu
function export_data(){
    if(Number(TO_DATA) - Number(FROM_DATA) > 31*24*60*60*1000){
        alert("Chỉ được phép xuất dữ liệu trong khoảng thời gian nhỏ hơn 30 ngày!")
        return false;
    }else{     
        window.open('/source/get/exportdata?fr='+FROM_DATA+'&to='+TO_DATA+'&id='+METER_ID, '_blank');
    }
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

function showChart(id, from, to, type, ft){       //lấy dữ liệu, cấu hình và render biểu đồ
    httpAsync(null,"/source/get/data_chart?id="+id+"&fr="+from+"&to="+to,"GET",function(result){
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
  
    // var m3h = chart2.yAxes.push(new am4charts.ValueAxis());
    // m3h.tooltip.disabled = false;
    // m3h.renderer.ticks.template.disabled = true;
    // m3h.renderer.axisFills.template.disabled = true;
    // if(unit.indexOf("m3/h") != -1){
    // m3h.renderer.line.strokeOpacity = 0.5;
    // m3h.renderer.line.strokeWidth = 1;
    // m3h.title.text ="m3/h"
    // }
    // m3h.renderer.opposite = false;
    // m3h.extraMin = 0.1;
    // m3h.extraMax = 0.1; 
  
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
        case "m3/h": series.yAxis = m3;break;
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
        arrtoconfig(ARR)
        // renderChart(arrtoconfig(ARR), DATA, TYPE, COLOR_CONFIG)
      }else{
        let x = $(this).val();
        let index = ARR.indexOf(x);
        ARR.splice(index,1);
        arrtoconfig(ARR)
        // renderChart(arrtoconfig(ARR), DATA, TYPE, COLOR_CONFIG);
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
    arrtoconfig(ARR)
    submit_get_chart()
    // renderChart(arrtoconfig(ARR), DATA, TYPE, COLOR_CONFIG);
  }

//   $(document).ready(function(){
//     $("#select_moment_chart").change(function(){
//       let val = $(this).children("option:selected").val();
//       if(val == "raw"){
//           maxlegendChart = "  ";
//           showChart(METER_ID, FROMVISUAL, TOVISUAL, TYPE, false, 'raw'); MOMENT ='raw';
//       }else{
//           maxlegendChart = " max ";
//           showChart(METER_ID, FROMVISUAL, TOVISUAL, TYPE, false, val); MOMENT = val; //year
//       }
//     })
//   })

//   $(document).ready(function(){
//     $("#select_time_chart").change(function(){
//       let x = new Date();
//       let val = $(this).children("option:selected").val();
//       if(val == "custom"){
//           $("#pick_time_chart").css("display","block");
//       }else{
//           $("#pick_time_chart").css("display","none");                
//       }
//       switch(val){
//           case "24hour":
//               TOVISUAL = x.getTime();
//               FROMVISUAL = TOVISUAL - 24*3600000;
//               showChart(METER_ID, FROMVISUAL, TOVISUAL, TYPE, false, MOMENT);
//               break;
//           case "week" :
//               TOVISUAL = x.getTime();
//               FROMVISUAL = TOVISUAL - 3600000 * 24 * 7;
//               showChart(METER_ID, FROMVISUAL, TOVISUAL, TYPE, false, MOMENT);
//               break;
//           case "month":
//               TOVISUAL = x.getTime();
//               FROMVISUAL = TOVISUAL - 3600000 * 24 * 30;
//               showChart(METER_ID, FROMVISUAL, TOVISUAL, TYPE, false, MOMENT);
//               break;
//       }
//     })
//   })

//   $(function() {
//     $('#pick_time_chart').daterangepicker(
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
//        startDate = start;
//         endDate = end;   
//         customDate(startDate, endDate); 
//       }
//    );
//   //    $('#reportrange span').html(moment().subtract(29, 'day').format('D MMMM YYYY') + ' - ' + moment().format('D MMMM YYYY'));
//   });
$(function() {
    $('#pick_time_chart_from').daterangepicker(
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
          FROMVISUAL = new Date(end).getTime();   
      }
   );
  //  $('#reportrange span').html(moment().subtract(29, 'day').format('D MMMM YYYY') + ' - ' + moment().format('D MMMM YYYY'));
  });

  $(function() {
    $('#pick_time_chart_to').daterangepicker(
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
        TOVISUAL = new Date(end).getTime();   
      }
   );
  //  $('#reportrange span').html(moment().subtract(29, 'day').format('D MMMM YYYY') + ' - ' + moment().format('D MMMM YYYY'));
  });
//   function customDate(startDate, endDate){
//     let from = (new Date(startDate)).getTime();
//     let to = (new Date(endDate)).getTime();
//     TOVISUAL = to; FROMVISUAL = from;
//     showChart(METER_ID, from, to, TYPE, false, MOMENT);
//   }
  
  $(document).ready(function(){   //thay đổi laoij biểu đồ
    $("#typeChart").change(function(){
      let val = $(this).children("option:selected").val();
      TYPE = val;
    //   renderChart(CONFIG, DATA, val, COLOR_CONFIG);
    })
  })

  function saveConfig(){  // lưu cấu hình
    let postData = {
    id: METER_ID,
    config: CONFIG,
    color_config: COLOR_CONFIG
    }
    httpAsync(postData,"/source/post/config","POST",function(result){
        alert(result);
    })
  };

  function submit_get_chart(){
    showChart(ID,FROMVISUAL,TOVISUAL,TYPE,true)
  }

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
                  { className: "dt-head-center", targets: [ 0, 1, 2, 3, 4] },
                ],
                data: modifi_alert(data),
                columns: [
                  {data: "id", className: "text-center-data-table align-middle"},
                  {data: "alert_type", className: "text-left-data-table align-middle"},
                  {data: "threshold", className: "text-right-data-table align-middle"},
                  {data: "alert_value", className: "text-right-data-table align-middle"},
                  // {data: "comparative_value", className: "text-right-data-table align-middle"},
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
      alert_type: data[i].alert_type,
      threshold: data[i].threshold,
      alert_value: data[i].alert_value,
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
    httpAsync(null,"/source/get/info?id="+METER_ID,"GET",function(result){
      $("#contain_map").empty();
      $("#contain_map").append('    <div id="map_single_eq" class="m-3" style="width:100%; min-height:600px"></div>')
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
      content_ = '<p>METER ID: '+not_null(data.meter_id)+'</p>'
      +'<p>Name: '+not_null(data.name)+'</p>'
      +'<p>Time: '+not_null(returnSQLDateFormat(data.last_meter_time))+'</p>'
      +'<p>Value of num: '+not_null(data.last_ValOfNum)+'</p>'
      +'<p>Address: '+not_null(data.address)+'</p>' ;
     }else{
      content_ = '<p>METER ID: '+not_null(data.meter_id)+'</p>'
      +'<p>Tên: '+not_null(data.name)+'</p>'
      +'<p>Thời điểm: '+not_null(returnSQLDateFormat(data.last_meter_time))+'</p>'
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
      id: METER_ID,
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
//   httpAsync(null,"/source/get/group_eq","GET",function(result){
//     if(result =="" || result == null){
//       return false;
//     }else{
//       let parse_data = JSON.parse(result);
//       let data = parse_data.data;
//       $("#group_eq").empty();
//       for(let i=0; i<data.length; i++){
//         $("#group_eq").append('<li><label><input class="info_group_select" type="checkbox" id="group_id_'+data[i].meter_id+'" value="'+data[i].meter_id+'">'+data[i].group_name+'</label></li>')
//         // $("#group_eq").append('<option value="'+data[i].id+'" >'+data[i].group_name+'</option>')
//       }
//     }
    get_info();
//   })
}
function get_info(){ // lấy thông tin và điền vào các trường
    httpAsync(null,"/source/get/info?id="+METER_ID,"GET",function(result){
      if(result == "" || result == null){
        return false;
      }else{
        let data = JSON.parse(result);
        // $("#group_eq").val(data.group_id);
        // let x = data.group_id.split(",");
        // $(".info_group_select").prop("checked",false);
        // SAVE_GROUP = [];
    //    if(x != "" && x != null){
    //     for(let i=0; i<x.length;i++){
    //       $("#group_id_"+x[i]).prop("checked",true);
    //       SAVE_GROUP.push(x[i]);
    //     }
    //    }
        $("#name_eq").val(data.name);
        $("#location_lat").val(data.location_lat);
        $("#location_long").val(data.location_long);
        $("#address_info").val(data.address);
        $("#phone_number").val(data.phone_alert);
        $("#install_date").val( return_date_input_format(data.install_date));
        $("#inspection_date").val( return_date_input_format(data.inspection_date));
        $("#loger_install_date").val( return_date_input_format(data.loger_install_date));
        $("#serial_sim").val(data.serial_sim);
        $("#group_eq").val(data.group_eq);
        $("#level_icon").val(data.level_icon);

        // if(data.total_branch_setting =="" || data.total_branch_setting == null || data.total_branch_setting == "not_setting"){
        //   $("#total_branch_setting").val("not_setting");
        // }else{
        //   $("#total_branch_setting").val(data.total_branch_setting);
        // }
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
  })

  function save_info(){
    let post_data = {
      // group_id: SAVE_GROUP,
      name:$("#name_eq").val(),
      location_lat:$("#location_lat").val(),
      location_long:$("#location_long").val(),
      address:$("#address_info").val(),
      phone_alert:$("#phone_number").val(),
      install_date:$("#install_date").val(),
      inspection_date:$("#inspection_date").val(),
      loger_install_date:$("#loger_install_date").val(),
    //   total_branch_setting: $("#total_branch_setting").val(),
      level_icon: $("#level_icon").find(":selected").val()
    }
    if(post_data.name == null || post_data.name == ""){
      if(LANG == "en"){
        alert("Name value must not be empty!");
  
      }else{
        alert("Tên không được để trống");
      }
      return false;
    } 
    // if(post_data.group_id.length == 0 && post_data.total_branch_setting != "not_setting"){
    //   if(LANG == "en"){
    //     alert("Group cannot be empty when select branch");
  
    //   }else{
    //     alert("Phải chọn nhóm quản lý khi chọn nhánh/tổng");
    //   }
    //   return false;
    // } 
      httpAsync(post_data,"/source/post/edit_info","POST",function(result){
        alert(result);
        LOADED_LOCATION = false;
        // getEQ(FILTER_EQ_LIST, FILTER_SUB_GROUP);
        return true;
      })
  
  }


  
function get_setting(){ // lấy thông tin và điền vào các trường
  httpAsync(null,"/source/get/setting_info","GET",function(result){
    let parse_data = JSON.parse(result);
    if(parse_data.err_code == 1){
        alert(parse_data.message)
    }else{
        let multiplier_first_index = parse_data.data.multiplier_first_index;
        let alert_v_config = parse_data.data.alert_v_config;
        let group_setting = parse_data.data.group_setting;
        if(multiplier_first_index.length > 0){
            $("#multiplier").val(multiplier_first_index[0].multiplier);
            $("#first_index").val(multiplier_first_index[0].first_index);
        }else{
            $("#multiplier").val("");
            $("#first_index").val("");
        }
        if(alert_v_config.length > 0){
            for(let i=0; i<alert_v_config.length; i++){
                if(alert_v_config[i].config_type == "ACQUY"){
                  $("#threshold_battery").val(alert_v_config[i].min_value);
                }
                if(alert_v_config[i].config_type == "PIN"){
                  $("#threshold_pin").val(alert_v_config[i].min_value);
                }
              }
        }else{
            $("#threshold_pin").val("");
            $("#threshold_battery").val("");
        }
        // if(group_setting.length > 0){
        //     $("#name_group").prop("disabled",false);
        //     $("#setting_group_note").prop("disabled",false);
        //     $("#lost_data_threshold").prop("disabled",false);
        //     $("#fre_check_lost_data").prop("disabled",false);
        //     $("#offset_group").prop("disabled",false);
        //     $("#name_group").val(group_setting[0].name);
        //     $("#setting_group_note").val(group_setting[0].note);
        //     $("#lost_data_threshold").val(group_setting[0].lost_threshold);
        //     $("#fre_check_lost_data").val(group_setting[0].fre_lost_alert);
        //     $("#offset_group").val(group_setting[0].offset);
        // }else{
        //     $("#name_group").val("");
        //     $("#setting_group_note").val("");
        //     $("#lost_data_threshold").val("");
        //     $("#fre_check_lost_data").val("");
        //     $("#offset_group").val("");
        //     $("#name_group").prop("disabled",true);
        //     $("#setting_group_note").prop("disabled",true);
        //     $("#lost_data_threshold").prop("disabled",true);
        //     $("#fre_check_lost_data").prop("disabled",true);
        //     $("#offset_group").prop("disabled",true);
        // }
    }



    // if(result == "" || result == null){
    //   return false;
    // }else{
    //   let data = JSON.parse(result);
    //   let info = data[0];
    //   let threshold = data[1];
    //   if(info.length > 0){
    //     $("#multiplier").val(info[0].multiplier);
    //     $("#first_index").val(info[0].first_index);
    //   }
    //   if(threshold.length > 0){
    //     for(let i=0; i<threshold.length; i++){
    //       if(threshold[i].config_type == "ACQUY"){
    //         $("#threshold_battery").val(threshold[i].min_value);
    //       }
    //       if(threshold[i].config_type == "PIN"){
    //         $("#threshold_pin").val(threshold[i].min_value);
    //       }
    //     }
    //   }else{
    //     $("#threshold_pin").val("");
    //     $("#threshold_battery").val("");
    //   }
    // }
  })
}

function save_setting(){
    let post_data = {
      multiplier:return_null_if_empty($("#multiplier").val()),
      first_index:return_null_if_empty($("#first_index").val()),
      threshold_pin: return_null_if_empty($("#threshold_pin").val()),
      threshold_battery: return_null_if_empty($("#threshold_battery").val()),
      // name_group:$("#name_group").val(),
      // setting_group_note:$("#setting_group_note").val(),
      // lost_data_threshold:$("#lost_data_threshold").val(),
      // fre_check_lost_data:$("#fre_check_lost_data").val(),
      // offset_group:$("#offset_group").val()

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
  // lấy dữ liệu cài đặt và hiển thị

function get_alert_config_pressure(){
    httpAsync(null,"/source/get/pressure_flowrate_alert_config","GET",function(result){
      $(".fl_pr_checkbox").prop("checked",false);
      fl_pr_DAY_OF_WEEK =[];
      if(result == null || result == ""){
        return false;
      }else{
        let data = JSON.parse(result);
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
  
            $("#press_alcf_id_"+data[i].index).attr("index",data[i].meter_id);
          }else if(data[i].config_type == "OP"){
            $("#plr_alcf_str_"+data[i].index).val(data[i].start_time);
            $("#plr_alcf_end_"+data[i].index).val(data[i].end_time);
            $("#plr_alcf_low_"+data[i].index).val(data[i].min_value);
            $("#plr_alcf_high_"+data[i].index).val(data[i].max_value);
  
            $("#plr_alcf_id_"+data[i].index).attr("index",data[i].meter_id);
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
  $(document).on("click", ".fl_pr_checkbox","input[type=checkbox]", function(){
    if($(this).is(":checked")){
      let x = $(this).attr("id").slice(2);
      fl_pr_DAY_OF_WEEK.push(x);
      fl_pr_DAY_OF_WEEK.sort(function(a, b){return a - b});
    }else{
      let x = $(this).attr("id").slice(2);
      let index = fl_pr_DAY_OF_WEEK.indexOf(x);
      fl_pr_DAY_OF_WEEK.splice(index, 1);
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
    httpAsync(post_data,"/source/save_pr_fl_setting","POST",function(result){
      alert(result);
      get_alert_config_pressure();
    })
  }

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
  

  function get_setting_measure_level(){
    httpAsync(null,"/source/get/measure_setting","GET",function(result){
      $(".measure_level_checkbox").prop("checked",false);
      ms_DAY_OF_WEEK =[];
      if(result == null || result == ""){
        return false;
      }else{
        let data = JSON.parse(result);
        for(let i=1; i<7; i++){
          $("#ms_id_"+i).attr("index",null);
        }
  
        for(let i=0; i<data.length; i++){
            $("#ms_str_"+data[i].index).val(data[i].start_time);
            $("#ms_end_"+data[i].index).val(data[i].end_time);
            $("#ms_low_"+data[i].index).val(data[i].min_value);
            $("#ms_high_"+data[i].index).val(data[i].max_value);
  
            $("#ms_id_"+data[i].index).attr("index",data[i].meter_id);
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
        // $("#pick_time_data").css("display","none");
        $("#pick_time_chart").css("display","none");
        MOMENT = "raw";TYPE ="line";maxlegendChart = "";
        $("#picktimeAlert").data("daterangepicker").setStartDate(moment().startOf('hour'));
        $("#picktimeAlert").data("daterangepicker").setEndDate(moment().startOf('hour'));
        // $("#pick_time_data").data("daterangepicker").setStartDate(moment().startOf('hour'));
        // $("#pick_time_data").data("daterangepicker").setEndDate(moment().startOf('hour'));
        $("#pick_time_data_to").data("daterangepicker").setStartDate(moment().startOf('minute'));
        $("#pick_time_data_to").data("daterangepicker").setEndDate(moment().startOf('minute'));
        $("#pick_time_data_from").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
        $("#pick_time_data_from").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
        $("#pick_time_chart_to").data("daterangepicker").setStartDate(moment().startOf('minute'));
        $("#pick_time_chart_to").data("daterangepicker").setEndDate(moment().startOf('minute'));
        $("#pick_time_chart_from").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
        $("#pick_time_chart_from").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
        // $("#pick_time_chart").data("daterangepicker").setStartDate(moment().startOf('hour'));
        // $("#pick_time_chart").data("daterangepicker").setEndDate(moment().startOf('hour'));
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
            get_data(METER_ID,SERIAL_SENSOR)
            LOADED_DATA=true;
            $("#pick_time_data_to").data("daterangepicker").setStartDate(moment().startOf('minute'));
            $("#pick_time_data_to").data("daterangepicker").setEndDate(moment().startOf('minute'));
            $("#pick_time_data_from").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
            $("#pick_time_data_from").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
        }
    });
    $('a[data-target="#visualize_tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        if(!LOADED_VIS){
          showChart(ID,FROMVISUAL,TOVISUAL,TYPE,true)
            LOADED_VIS=true;
            $("#pick_time_chart_to").data("daterangepicker").setStartDate(moment().startOf('minute'));
            $("#pick_time_chart_to").data("daterangepicker").setEndDate(moment().startOf('minute'));
            $("#pick_time_chart_from").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
            $("#pick_time_chart_from").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
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
  



// modal riêng lẻ

// modal chỉ số từng thời điểm
var DT_M_METER_ID = null;
var DT_M_SERIAL_SENSOR = null;

function data_modal(name, meter_id,serial_sensor){
  $("#dt_m_pick_time_data_to").data("daterangepicker").setStartDate(moment().startOf('minute'));
  $("#dt_m_pick_time_data_to").data("daterangepicker").setEndDate(moment().startOf('minute'));
  $("#dt_m_pick_time_data_from").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
  $("#dt_m_pick_time_data_from").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
  $("#data_modal_title").html(name + "<br>" + meter_id);
  $("#dt_modal").modal('show');
    // Lấy dữ liệu và hiển thị
    DT_M_METER_ID = meter_id;
    DT_M_SERIAL_SENSOR = serial_sensor;
    dt_m_get_data(meter_id,serial_sensor)
}

$(document).ready(function(){
  $('#dt_modal').on('hidden.bs.modal', function () {

      $(this).find('form').trigger('reset');
      $(this).find('select').prop('selectedIndex',0);
      $(this).find('input').not("#static_group").val("");
      DT_M_TO_DATA = new Date().getTime();  // thời gian kết thúc
      DT_M_FROM_DATA = DT_M_TO_DATA -  3600000*24 // thời gian bắt đầu
      $("#dt_m_pick_time_data_to").data("daterangepicker").setStartDate(moment().startOf('minute'));
      $("#dt_m_pick_time_data_to").data("daterangepicker").setEndDate(moment().startOf('minute'));
      $("#dt_m_pick_time_data_from").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
      $("#dt_m_pick_time_data_from").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
  })
})

function dt_m_get_data(meter_id,serial_sensor){
  httpAsync(null,"/source/get/dt_m_compen_value?meter_id="+meter_id+"&serial_sensor="+serial_sensor,"GET",function(value){
    let dt_m_compen_value = null;
    if(value == null || value == ""){
      dt_m_compen_value = 0
    }else{
      let data = JSON.parse(value)
      dt_m_compen_value = data[0].compen_value;
    }
    httpAsync(null,"/source/get/dt_m_dataEQ?meter_id="+meter_id+"&serial_sensor="+serial_sensor+"&to="+DT_M_TO_DATA+"&fr="+DT_M_FROM_DATA,"GET",function(result){
      let data = []
      if(result == null || result == ""){
          data = []
      }else{
          data = JSON.parse(result);
      }
      $(document).ready(function() {
        $('#dt_m_table_data').DataTable().destroy();
        $('#dt_m_table_data').DataTable({
              "pageLength": 50,
              language : translate_data_table(LANG),
              "columnDefs": [
                { className: "dt-head-center", targets: [ 0, 1, 2, 3, 4, 5, 6, 7, 8] },
                { "orderable": true, "targets": [0,1,2,3,4,5,6,7,8] }
            ],
              data: config_data(data,dt_m_compen_value),
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
          });
      });
    })
  })
}


var DT_M_TO_DATA = new Date().getTime();  // thời gian kết thúc
var DT_M_FROM_DATA = DT_M_TO_DATA -  3600000*24 // thời gian bắt đầu
$(function() {
    $('#dt_m_pick_time_data_from').daterangepicker(
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
          DT_M_FROM_DATA = new Date(end).getTime();   
      }
   );
});

  $(function() {
    $('#dt_m_pick_time_data_to').daterangepicker(
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
        DT_M_TO_DATA = new Date(end).getTime();   
      }
   );
  });

  function dt_m_submit_getDataEQ(){ //load và hiển thị lại data khi thay đổi thời gian, moment và ấn submit
    dt_m_get_data(DT_M_METER_ID,DT_M_SERIAL_SENSOR);
}
// xuất dữ liệu
function dt_m_export_data(){
    if(Number(DT_M_TO_DATA) - Number(DT_M_FROM_DATA) > 31*24*60*60*1000){
        alert("Chỉ được phép xuất dữ liệu trong khoảng thời gian nhỏ hơn 30 ngày!")
        return false;
    }else{     
        window.open('/source/get/dt_m_exportdata?fr='+DT_M_FROM_DATA+'&to='+DT_M_TO_DATA+'&meter_id='+DT_M_METER_ID+'&serial_sensor='+DT_M_SERIAL_SENSOR, '_blank');
    }
}

// biểu đồ

var VS_METER_ID = null;
var VS_SERIAL_SENSOR = null;
function chart_modal(name, meter_id,serial_sensor){
  $("#vs_pick_time_chart_to").data("daterangepicker").setStartDate(moment().startOf('minute'));
  $("#vs_pick_time_chart_to").data("daterangepicker").setEndDate(moment().startOf('minute'));
  $("#vs_pick_time_chart_from").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
  $("#vs_pick_time_chart_from").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
  $("#vs_modal_title").html(name + "<br>" + meter_id);
  $("#vs_modal").modal('show');
    // Lấy dữ liệu và hiển thị
    VS_METER_ID = meter_id;
    VS_SERIAL_SENSOR = serial_sensor;
    vs_show_chart(VS_METER_ID, VS_SERIAL_SENSOR, VS_FROMVISUAL, VS_TOVISUAL, VS_TYPE, true)
}

$(document).ready(function(){
  $('#vs_modal').on('hidden.bs.modal', function () {
      $(this).find('form').trigger('reset');
      $(this).find('select').prop('selectedIndex',0);
      $(this).find('input').not("#static_group").val("");
      VS_TOVISUAL = new Date().getTime();  // thời gian kết thúc
      VS_FROMVISUAL = VS_TOVISUAL -  3600000*24 // thời gian bắt đầu
      $("#vs_pick_time_chart_to").data("daterangepicker").setStartDate(moment().startOf('minute'));
      $("#vs_pick_time_chart_to").data("daterangepicker").setEndDate(moment().startOf('minute'));
      $("#vs_pick_time_chart_from").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
      $("#vs_pick_time_chart_from").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
      if(vs_chart != null){
        vs_chart.dispose();
        delete vs_chart;
        VS_TYPE ="line";
        VS_ARR = [];
        VS_CONFIG = null;
        VS_COLOR_CONFIG = null;
    }
  })
})

var VS_DATA;
var VS_CONFIG; // cấu hình số trường hiển thị biểu đồ
var VS_COLOR_CONFIG; // cấu hình màu từng trường dữ liệu
var VS_TYPE ="line"; // loại biểu đồ
var VS_TOVISUAL = (new Date()).getTime();//thời gian bắt đầu của biểu đồ
var VS_FROMVISUAL = VS_TOVISUAL - 3600000*24;//thời gian kết thúc của biểu đồ 
var VS_ARR = []; // lưu các cấu hình : các para đang hiển thị 
var vs_chart; // biểu đồ tab visual

function vs_show_chart(meter_id,serial_sensor, from, to, type, ft){       //lấy dữ liệu, cấu hình và render biểu đồ
    httpAsync(null,"/source/get/vs_data_chart?meter_id="+meter_id+"&serial_sensor="+serial_sensor+"&fr="+from+"&to="+to,"GET",function(result){
      let a = JSON.parse(result);
      let b = a["config"];
          let data = a["data"];
          VS_DATA = data;
          if(ft == true){
              VS_CONFIG = JSON.parse(b.config);
              VS_COLOR_CONFIG = JSON.parse(b.color_config);
              vs_loadConfig(VS_CONFIG,VS_COLOR_CONFIG);
          }
          vs_render_chart(VS_CONFIG, VS_DATA, type, VS_COLOR_CONFIG);      
    })
  }

  function vs_configtoarr(x){      // config lấy từ db về sẽ có dạng json {pressure: 0, quanity:1, flowRate:1} => chuyển thành dạng array: [pressure]
    let arr=[];
    if(x.pressure == 0) arr.push("pressure");
    if(x.quanity == 0) arr.push("quanity");
    if(x.flowRate == 0) arr.push("flowRate");
    VS_ARR = arr;
    return VS_ARR;
  }


  function vs_render_chart(config, Data, type, color_config){ //render biểu đồ, đầu vào có data, cấu hình: các trường hiển thị, loại biều đồ và màu
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
    let arr = vs_configtoarr(config);
    let x = []
    for(let i=0; i< arr.length; i++){
      x.push(returnUnit(arr[i]));
    }
    let unit = Array.from(new Set(x));
    switch(type){
      case "line":
        thickness = 3;
        VS_TYPE = "line";
        break;
      case "point":
        thickness = 0;
        VS_TYPE = "point"
        break;
      case "bar":
        VS_TYPE = "bar";
        break;
    }
    am4core.useTheme(am4themes_animated);
    if(vs_chart != null){
      vs_chart.dispose();
    }
    vs_chart = am4core.create("vs_chart_main", am4charts.XYChart);
    vs_chart.scrollbarX = new am4core.Scrollbar();
    vs_chart.data = data;
    vs_chart.logo.disabled = true;
    let dateAxis = vs_chart.xAxes.push(new am4charts.DateAxis());
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
  
    vs_chart.cursor = new am4charts.XYCursor();
    vs_chart.cursor.fullWidthLineX = true;
    vs_chart.cursor.xAxis = dateAxis;
    vs_chart.cursor.lineX.strokeWidth = 0;
    vs_chart.cursor.lineX.fill = am4core.color("#000");
    vs_chart.cursor.lineX.fillOpacity = 0.1;
    vs_chart.legend = new am4charts.Legend();
  
  
    let Pa = vs_chart.yAxes.push(new am4charts.ValueAxis());
    Pa.tooltip.disabled = false;
    Pa.renderer.ticks.template.disabled = true;
    Pa.renderer.axisFills.template.disabled = true;
    if(unit.indexOf("Pa") != -1){
    Pa.renderer.line.strokeOpacity = 0.5;
    Pa.renderer.line.strokeWidth = 1;
    Pa.title.text ="Pa"
    }
    Pa.renderer.opposite = false;
    Pa.extraMin = 0.1;
    Pa.extraMax = 0.1; 
  
    var m3 = vs_chart.yAxes.push(new am4charts.ValueAxis());
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
      series = vs_chart.series.push(new am4charts.ColumnSeries());
      series.columns.template.fillOpacity = 1;
      series.columns.template.strokeOpacity = 1;
      }else{
        series = vs_chart.series.push(new am4charts.LineSeries());
       
      }
      if(type == "point"){
        series.bullets.push(new am4charts.CircleBullet());
      }
      switch (returnUnit(field)){     // water
        case "Pa": series.yAxis = Pa;break;
        case "m3/h": series.yAxis = m3;break;
        case "m3": series.yAxis = m3;break;
      }
      series.dataFields.valueY = field;
      series.dataFields.dateX = "time";
      series.title = shortToFullName(field);
      series.strokeWidth = thickness;
      series.tensionX = 0.9;
      series.showOnInit = true;
      series.legendSettings.labelText = shortToFullName(field) +'('+returnUnit(field)+')'
      series.tooltipText =shortToFullName(field)+ ": {valueY} " + returnUnit(field);
      series.name = shortToFullName(field);
      series.tooltip.pointerOrientation = "horizontal";
      series.fill = am4core.color(color_config[field]);
      series.stroke = am4core.color(color_config[field]);
    }
  
    for(let i=0; i< arr.length; i++){
      creatAxisAndSeries(arr[i]);
    }
  }

  function vs_arrtoconfig(arr){
    let key = Object.keys(VS_CONFIG);
    for(let i=0; i<key.length; i++){
        VS_CONFIG[key[i]] = 1;
    }
    for(let i=0; i<arr.length; i++){
      VS_CONFIG[arr[i]] = 0;
    }; 
    return VS_CONFIG;
  }

  $(document).ready(function(){
    $(document).on("click",".vs_selectParaExport",function(){
      if($(this).is(":checked")){
        let val=$(this).val();
        VS_ARR.push(val);
        vs_arrtoconfig(VS_ARR)
      }else{
        let x = $(this).val();
        let index = VS_ARR.indexOf(x);
        VS_ARR.splice(index,1);
        vs_arrtoconfig(VS_ARR)
      }
    })
  })


  function vs_loadConfig(config,color_config){
    vs_configtoarr(config);
    $(".vs_selectParaExport").prop("checked",false);
    for(let i=0; i<VS_ARR.length; i++){
      $("#vs_selectParaExport"+VS_ARR[i]).prop("checked",true);
    }
    let x = ["quanity","flowRate","pressure"];
    for(let i=0; i< x.length; i++){
      $("#vs_color" + x[i]).val(color_config[x[i]]);
    }
  }

  function vs_submitColor(){ // thay đổi màu các trường trong biểu đồ
    let x;
      x = ["quanity","flowRate","pressure"];
    
    for(let i=0;i<x.length; i++){
      VS_COLOR_CONFIG[x[i]] = $("#vs_color"+x[i]).val();
    }
    vs_arrtoconfig(VS_ARR)
    vs_submit_get_chart()
  }
$(function() {
    $('#vs_pick_time_chart_from').daterangepicker(
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
          VS_FROMVISUAL = new Date(end).getTime();   
      }
   );
  });

  $(function() {
    $('#vs_pick_time_chart_to').daterangepicker(
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
        VS_TOVISUAL = new Date(end).getTime();   
      }
   );
  });

  $(document).ready(function(){   //thay đổi laoij biểu đồ
    $("#vs_type_chart").change(function(){
      let val = $(this).children("option:selected").val();
      VS_TYPE = val;
    })
  })

  function vs_save_config(){  // lưu cấu hình
    let postData = {
    meter_id: VS_METER_ID,
    serial_sensor: VS_SERIAL_SENSOR,
    config: VS_CONFIG,
    color_config: VS_COLOR_CONFIG
    }
    httpAsync(postData,"/source/post/vs_config","POST",function(result){
        alert(result);
    })
  };

  function vs_submit_get_chart(){
    vs_show_chart(VS_METER_ID,VS_SERIAL_SENSOR,VS_FROMVISUAL,VS_TOVISUAL,VS_TYPE,false)
  }



  // cảnh báo
  var AL_TO_ALERT_LIST = (new Date()).getTime();
  var AL_FROM_ALERT_LIST = AL_TO_ALERT_LIST - 7 * 24 * 3600000;
  var AL_METER_ID = null;
  var AL_SERIAL_SENSOR = null; 
  
  function alert_modal(name,meter_id,serial_sensor){
    AL_TO_ALERT_LIST = new Date().getTime();  // thời gian kết thúc
    AL_FROM_ALERT_LIST = AL_TO_ALERT_LIST -  3600000*24 // thời gian bắt đầu
    $("#picktimeAlert").css("display","none");
    $("#picktimeAlert").data("daterangepicker").setStartDate(moment().startOf('hour'));
    $("#picktimeAlert").data("daterangepicker").setEndDate(moment().startOf('hour'));
    $("#al_modal_title").html(name + "<br>" + meter_id);
    $("#al_modal").modal('show');
      // Lấy dữ liệu và hiển thị
      AL_METER_ID = meter_id;
      AL_SERIAL_SENSOR = serial_sensor;
      al_getAlertAndRenderTable();
      
  }
  
  $(document).ready(function(){
    $('#al_modal').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
        $(this).find('select').prop('selectedIndex',0);
        $(this).find('input').not("#static_group").val("");
        AL_TO_ALERT_LIST = new Date().getTime();  // thời gian kết thúc
        AL_FROM_ALERT_LIST = AL_TO_ALERT_LIST -  3600000*24 // thời gian bắt đầu
        $("#al_picktimeAlert").css("display","none");
        $("#al_picktimeAlert").data("daterangepicker").setStartDate(moment().startOf('hour'));
        $("#al_picktimeAlert").data("daterangepicker").setEndDate(moment().startOf('hour'));
    })
  })


  function al_getAlertAndRenderTable(){
    httpAsync(null,"/source/get/al_alert?fr="+AL_FROM_ALERT_LIST+"&to="+AL_TO_ALERT_LIST+"&meter_id="+AL_METER_ID+"&serial_sensor="+AL_SERIAL_SENSOR,'GET',function(result){
      if(result == "" || result == null){
        al_loadAL([]);
      }else{
        let data = JSON.parse(result);
        al_loadAL(data);
      }
  })
  }
  
  
  function al_loadAL(data){
      $(document).ready(function() {
        $("#al_totalAlert").val(data.length);
          $('#al_tableAlert').DataTable().destroy();
          $('#al_tableAlert').DataTable({
                  "pageLength": 50,
                  language : translate_data_table(LANG),
                  "columnDefs": [
                    { className: "dt-head-center", targets: [ 0, 1, 2, 3, 4] },
                  ],
                  data: modifi_alert(data),
                  columns: [
                    {data: "id", className: "text-center-data-table align-middle"},
                    {data: "alert_type", className: "text-left-data-table align-middle"},
                    {data: "threshold", className: "text-right-data-table align-middle"},
                    {data: "alert_value", className: "text-right-data-table align-middle"},
                    {data: "alert_time", className: "text-center-data-table align-middle"},
                  ]
          });
      });
    }
    
  $(document).ready(function(){
      $("#al_selectTimeAlert").change(function(){
        let val = $(this).children("option:selected").val();
        switch(val){
          case "week" :  
            $("#al_picktimeAlert").css("display","none");
            AL_TO_ALERT_LIST = (new Date()).getTime();
            AL_FROM_ALERT_LIST = AL_TO_ALERT_LIST - 7 * 24 * 3600000;
            break;
          case "month" :
            $("#al_picktimeAlert").css("display","none");
            AL_TO_ALERT_LIST = (new Date()).getTime();
            AL_FROM_ALERT_LIST = AL_TO_ALERT_LIST - 30 * 24 * 3600000;
            break;
          case "custom" :
            $("#al_picktimeAlert").css("display","block");
            break;
        }
      })
    })
  
  
  $(function() {
    $('#al_picktimeAlert').daterangepicker(
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
      
        AL_FROM_ALERT_LIST = new Date(start).getTime();
        AL_TO_ALERT_LIST = new Date(end).getTime();
        // getAlertAndRenderTable();
      }
   );
  //  $('#reportrange span').html(moment().subtract(29, 'day').format('D MMMM YYYY') + ' - ' + moment().format('D MMMM YYYY'));
  });
  
  function al_filter(){ // bấm nút filter
      al_getAlertAndRenderTable();
  }
    
    // function al_refreshTable(){    // refresh data
    //   al_getAlertAndRenderTable();
    // }
    

    // modal cài đặt thất thoát
    setting_datalostoutput_group_id = null;
    function setting_datalostoutput(gr_id, name){
      let group_id = gr_id || DATA_LOST_OUTPUT_GROUP_ID;
      setting_datalostoutput_group_id = group_id;
      // let name = DATA_LOST_OUTPUT_NAME;

        // Lấy dữ liệu và hiển thị
      httpAsync(null,"/get/datalostoutput_setting?group_id="+group_id,"GET",function(result){
        let parse_data = JSON.parse(result);
        if(parse_data.err_code == 1){
          alert(parse_data.message)
        }else{
          let data = parse_data.data;
          $("#name_group").val(data.name);
          $("#setting_group_note").val(data.note);
          $("#lost_data_threshold").val(data.lost_threshold);
          $("#fre_check_lost_data").val(data.fre_lost_alert);
          $("#offset_group").val(data.offset);
          $("#actual_length").val(data.actual_length)
          $("#caculate_length").val(caculate_length(data.line_map))
          $("#datalostoutput_modal_title").html(name || data.name);
          $("#datalostoutput_modal").modal('show');
        }
      })
      }

function caculate_length(data){
  if(data){
    let length = 0;
    let parse_data = JSON.parse(data);
    for(let i=0; i<parse_data.length; i++){
      for(let j=0; j<parse_data[i].length - 1; j++){
        length += getDistanceFromLatLonInM(Number(parse_data[i][j].lat),Number(parse_data[i][j].lng),Number(parse_data[i][j+1].lat),Number(parse_data[i][j+1].lng))
      }
    }
    return length.toFixed(3);
  }
  return null;
}

function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d*1000;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function save_datalostouput_setting(){
  let post_data = {
    group_id: setting_datalostoutput_group_id,
    name_group:show_if_null($("#name_group").val()),
    setting_group_note:$("#setting_group_note").val(),
    lost_data_threshold:return_num_bar($("#lost_data_threshold").val()),
    fre_check_lost_data:return_num_bar($("#fre_check_lost_data").val()),
    offset_group:return_num_bar($("#offset_group").val()),
    actual_length: stringtonum($("#actual_length").val())
  }
  httpAsync(post_data,"/post/save_setting_datalostoutput","POST",function(result){
    alert(JSON.parse(result).message);
    return true;
  })
}

function send_instant_mess(name, meter_id, serial_sensor){
  // httpAsync({meter_id: meter_id, serial_sensor: serial_sensor},"/post/send_mqtt_ins","POST",function(result){
    $("#loadingModal").modal("show");
    setTimeout(function(){
      // httpAsync(null,"/source/get/instant_value?id="+meter_id+"&serial_sensor="+serial_sensor,"GET",function(result){

      // })
      $("#loadingModal").modal("hide");
    },5000)
  // })
}


// modal log
var LOG_TO = (new Date()).getTime();
  var LOG_FROM = LOG_TO - 7 * 24 * 3600000;
  var LOG_METER_ID = null;
  var LOG_SERIAL_SENSOR = null; 
  $(function() {
    $('#pick_time_log_from').daterangepicker(
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
          LOG_FROM = new Date(end).getTime();   
      }
   );
});

  $(function() {
    $('#pick_time_log_to').daterangepicker(
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
        LOG_TO = new Date(end).getTime();   
      }
   );
  });

  function log_modal(name,meter_id,serial_sensor){
    LOG_TO = new Date().getTime();  // thời gian kết thúc
    LOG_FROM = LOG_TO -  3600000*24 // thời gian bắt đầu
    $("#pick_time_log_to").data("daterangepicker").setStartDate(moment().startOf('minute'));
    $("#pick_time_log_to").data("daterangepicker").setEndDate(moment().startOf('minute'));
    $("#pick_time_log_from").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
    $("#pick_time_log_from").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
    $("#log_modal_title").html(name + "<br>" + meter_id);
    $("#log_modal").modal('show');
      // Lấy dữ liệu và hiển thị
      LOG_METER_ID = meter_id;
      LOG_SERIAL_SENSOR = serial_sensor;
      get_render_table_log();   
  }
  
  $(document).ready(function(){
    $('#log_modal').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
        $(this).find('select').prop('selectedIndex',0);
        $(this).find('input').not("#static_group").val("");
        LOG_TO = new Date().getTime();  // thời gian kết thúc
        LOG_FROM = LOG_TO -  3600000*24 // thời gian bắt đầu
        $("#pick_time_log_to").data("daterangepicker").setStartDate(moment().startOf('minute'));
        $("#pick_time_log_to").data("daterangepicker").setEndDate(moment().startOf('minute'));
        $("#pick_time_log_from").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
        $("#pick_time_log_from").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
    })
  })


  function get_render_table_log(){
    httpAsync(null,"/source/get/log?fr="+LOG_FROM+"&to="+LOG_TO+"&meter_id="+LOG_METER_ID+"&serial_sensor="+LOG_SERIAL_SENSOR,'GET',function(result){
      if(result == "" || result == null){
        log_load_datatable([]);
      }else{
        let data = JSON.parse(result);
        log_load_datatable(data);
      }
  })
  }
  
  
  function log_load_datatable(data){
      $(document).ready(function() {
          $('#log_table_data').DataTable().destroy();
          $('#log_table_data').DataTable({
                  "pageLength": 50,
                  language : translate_data_table(LANG),
                  "columnDefs": [
                    { className: "dt-head-center", targets: [ 0, 1, 2, 3] },
                  ],
                  data: modifi_log(data),
                  columns: [
                    {data: "index", className: "text-center-data-table align-middle"},
                    {data: "time", className: "text-left-data-table align-middle"},
                    {data: "log", className: "text-right-data-table align-middle"},
                    {data: "created_by", className: "text-right-data-table align-middle"}                  ]
          });
      });
    }

    function modifi_log(data){
      var y=[];
      for(let i=0; i<data.length; i++){
        let x ={ 
          index: i+1,
          time: return_date_format_ddmmyyhhmmss(data[i].created_at),
          log: data[i].log,
          created_by: data[i].created_by,
        }
        y.push(x);
      }
      return(y);
    }

    function reset_log(){
      get_render_table_log();
    }