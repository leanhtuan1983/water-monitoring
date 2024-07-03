  //click vào 1 thiết bị

  // hiển thị modal
  function showmodal_inverter(name){
    $('#DetalEQ_inverter').modal('show');
    $("#inverter_name").html(name);
}

// điền chỉ số tức thời
function fill_instant_value_inverter(id,SERIAL_SENSOR){
    httpAsync(null,"/source/get/instant_value?id="+id+"&serial_sensor="+SERIAL_SENSOR,"GET",function(result){
        let data;
        if(result =="" || result == null){
            return false;
        }else{
            data = JSON.parse(result);
            $("#ins_val_idEQ_inverter").val(data.inverter_code); //mã thiết bị biến tần
            $("#ins_val_nameEQ_inverter").val(data.name); // tên
            $("#ins_val_pressure_code_inverter").val(data.serial_sensor); // mã thiết bị áp suất
            $("#ins_val_pressure_inverter").val(data.last_pressure); // áp suất
            $("#ins_val_feedback_inverter").val(data.last_feedback_hz); // tần số hiện tại
            $("#ins_val_fre_inverter").val(data.frequency); // tần suất thu thập
            $("#ins_val_LDD_inverter").val(returnSQLDateFormat(data.last_meter_time)); // thời gian
            $("#ins_val_voltage_inverter").val(data.last_voltage_pin); // điện áo pin
            $("#ins_val_voltage_ac_quy_inverter").val(data.last_voltage_ac_quy); // điện áp ác quy
        }
    })
}

function refresh_instan_val_inverter(){  //refresh chỉ số tức thời
    fill_instant_value_inverter(ID, SERIAL_SENSOR);
}
//Tab chỉ số từng thời điểm 

var TO_DATA_INVERTER = new Date().getTime();  // thời gian kết thúc
var FROM_DATA_INVERTER = TO_DATA_INVERTER -  3600000*24 // thời gian bắt đầu

$(function() {
  $('#time_from_inverter').daterangepicker(
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
      FROM_DATA_INVERTER = new Date(end).getTime();   
    }
 );
});

$(function() {
  $('#time_to_inverter').daterangepicker(
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
      TO_DATA_INVERTER = new Date(end).getTime();   
    }
 );
});

function get_data_inverter(){              // lấy dữ liệu và hiển thị
  httpAsync(null,"/source/get/dataEQ_inverter?to="+TO_DATA_INVERTER+"&fr="+FROM_DATA_INVERTER,"GET",function(result){
        let data = []
        if(result == null || result === ""){
            fill_data_inverter(data);
            return false;
        }else{
            data = JSON.parse(result);
            fill_data_inverter(data);
        }
        console.log(data)
  })
}


function config_data_inverter(data){ 
    var y=[];
    let a = 0
    for(let i= 0;  i<data.length; i++){
      let x ={
      index: a+1,
      time: return_date_format_ddmmyyhhmmss(data[i].meterTime),
      pressure: data[i].pressure,
      cur_fre: (data[i].feedback_hz === null) ? "" : data[i].feedback_hz,
      inverter_comunicate: return_inverter_status(data[i].mode),
      pin_voltage: data[i].Voltage,
      ac_quy_voltage: data[i].voltage_ac_quy
      }
      a++;
      y.push(x);
    }
    return(y);
}

function fill_data_inverter(data){       //hiển thị dữ liệu ra datatable
    $(document).ready(function() {
          $('#table_data_inverter').DataTable().destroy();
          $('#table_data_inverter').DataTable({
                "pageLength": 50,
                language : translate_data_table(LANG),
                "columnDefs": [
                  { className: "dt-head-center", targets: [ 0, 1, 2, 3, 4, 5, 6] },
                  { "orderable": false, "targets": [2, 3, 4] },
                  { "orderable": true, "targets": [0, 1] },

              ],
                data: config_data_inverter(data),
                columns: [
                  {data: "index", className: "text-center-data-table align-middle"},
                  {data: "time", className: "text-center-data-table align-middle"},
                  {data: "pressure", className: "text-right-data-table align-middle"},
                  {data: "cur_fre", className: "text-right-data-table align-middle"},
                  {data: "inverter_comunicate", className: "text-center-data-table align-middle"},
                  {data: "pin_voltage", className: "text-right-data-table align-middle"},
                  {data: "ac_quy_voltage", className: "text-right-data-table align-middle"}
                ],
                // stateSave: true
            });
        });
}
//load và hiển thị lại data khi thay đổi thời gian và ấn submit
function submit_getDataEQ_inverter(){ 
    get_data_inverter();
}

function export_data_inverter(){     // xuất dữ liệu
    window.open('/source/get/exportdata_inverter?fr='+FROM_DATA_INVERTER+'&to='+TO_DATA_INVERTER, '_blank');
}



//tab biến tần
var TO_INVERTER_DATA_INVERTER = new Date().getTime();  // thời gian kết thúc
var FROM_INVERTER_DATA_INVERTER = TO_INVERTER_DATA_INVERTER -  3600000*24 // thời gian bắt đầu

$(function() {
  $('#time_inverter_from_inverter').daterangepicker(
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
        FROM_INVERTER_DATA_INVERTER = new Date(end).getTime();   
    }
 );
});

$(function() {
  $('#time_inverter_to_inverter').daterangepicker(
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
        TO_INVERTER_DATA_INVERTER = new Date(end).getTime();   
    }
 );
});

function get_inverter_data_inverter(){              // lấy dữ liệu và hiển thị
  httpAsync(null,"/source/get/inverter_dataEQ_inverter?to="+TO_INVERTER_DATA_INVERTER+"&fr="+FROM_INVERTER_DATA_INVERTER,"GET",function(result){
        let data = []
        if(result == null || result === ""){
            fill_inverter_data_inverter(data);
            return false;
        }else{
            data = JSON.parse(result);
            fill_inverter_data_inverter(data);
        }
  })
}

function fill_inverter_data_inverter(data){       //hiển thị dữ liệu ra datatable
  $(document).ready(function() {
        $('#table_inverter_data_inverter').DataTable().destroy();
        $('#table_inverter_data_inverter').DataTable({
              "pageLength": 50,
              language : translate_data_table(LANG),
              "columnDefs": [
                { className: "dt-head-center", targets: [ 0, 1, 2, 3, 4] },
                { "orderable": false, "targets": [2, 3, 4] },
                { "orderable": true, "targets": [0, 1] },

            ],
              data: config_inverter_data_inverter(data),
              columns: [
                {data: "index", className: "text-center-data-table align-middle"},
                {data: "time", className: "text-center-data-table align-middle"},
                {data: "inverter_comunicate", className: "text-center-data-table align-middle"},
                {data: "cur_fre", className: "text-right-data-table align-middle"},
                {data: "col_fre", className: "text-right-data-table align-middle"},
              ],
              // stateSave: true
          });
      });
}

function submit_get_inverter_DataEQ_inverter(){ //load và hiển thị lại data khi thay đổi thời gian, moment và ấn submit
  get_inverter_data_inverter();
}

function return_inverter_status(x){
  if(x === "" || x === null) return "";
  if(LANG == "en"){
    if(x == 1 || x == "1"){return "Connected"}
    else if(x==0 || x=="0"){return "Disconected"}
  }else{
    if(x == 1 || x == "1"){return "Kết nối"}
    else if( x==0 || x=="0"){return "Không kết nối"}
  }
}

function config_inverter_data_inverter(data){
    // cấu hình dữ liệu hiển thị
    var y=[];
    for(let i=0; i<data.length; i++){
      let x ={
      index: i+1,
      time: return_date_format_ddmmyyhhmmss(data[i].meterTime),
      inverter_comunicate: return_inverter_status(data[i].mode),
      cur_fre: data[i].feedback_hz,
      col_fre: data[i].Frequency,
      }
      y.push(x);
    }
    return(y);
}


// tab biểu đồ
var DATA_INVERTER; // dữ liệu của parameter từng thiết bị hiển thị trên biểu đồ tại visual tab
var CONFIG_INVERTER; // cấu hình số trường hiển thị biểu đồ visual tab
var COLOR_CONFIG_INVERTER; // cấu hình màu từng trường dữ liệu
var TYPE_INVERTER ="line"; // loại biểu đồ tab visual
var TOVISUAL_INVERTER = (new Date()).getTime();//thời gian bắt đầu của biểu đồ tab visual
var FROMVISUAL_INVERTER = TOVISUAL_INVERTER - 3600000*24;//thời gian kết thúc của biểu đồ tab visual
var ARR_INVERTER = []; // lưu các cấu hình : các para đang hiển thị 
var chart2_inverter; // biểu đồ tab visual

function showChart_inverter(from, to, type, ft){       //lấy dữ liệu, cấu hình và render biểu đồ
  httpAsync(null,"/source/get/data_chart_inverter?fr="+from+"&to="+to,"GET",function(result){
    let a = JSON.parse(result);
    let b = a["config"];
    let data = a["data"];
    DATA_INVERTER = data;
    console.log(DATA_INVERTER,CONFIG_INVERTER)
    if(ft == true){
        CONFIG_INVERTER = JSON.parse(b.config);
        COLOR_CONFIG_INVERTER = JSON.parse(b.color_config);
        loadConfig_inverter(CONFIG_INVERTER,COLOR_CONFIG_INVERTER);
    }
    renderChart_inverter(CONFIG_INVERTER, DATA_INVERTER, type,COLOR_CONFIG_INVERTER);      
  })
}

function configtoarr_inverter(x){      // config lấy từ db về sẽ có dạng json {pressure: 0, quanity:1, flowRate:1} => chuyển thành dạng array: [pressure]
  let arr=[];
  if(x.pressure == 0) arr.push("pressure");
  if(x.fre == 0) arr.push("fre");
  ARR_INVERTER = arr;
  return ARR_INVERTER;
}



function returnUnit_inverter(field){  //trả về đơn bị vs đầu vào là biến 
  switch(field){
    case "pressure":
      return "bar";
    case "fre":
      return "Hz";
  }
}

function shortToFullName_inverter(name){     // Trả về tên đầy đủ
  if(LANG == "en"){
    switch(name){
      case "pressure":
        name = "Pressure";
        break;
      case "fre":
        name = "Frequency";
        break;
    }
  }else{
    switch(name){
      case "pressure":
        name = "Áp suất";
        break;
      case "fre":
        name = "Tần số";
        break;
    }
  }
  return name;
}

function renderChart_inverter(config, Data, type, color_config){ //render biểu đồ, đầu vào có data, cấu hình: các trường hiển thị, loại biều đồ và màu
  let data =[];
    for(let i=0;i<Data.length;i++){
        let x={
        "time":new Date(Data[i].meterTime),
        "pressure":stringtonum(Data[i].pressure),
        "fre":stringtonum(Data[i].feedback_hz),
        }
        data.push(x);
    }

  let thickness;
  let arr = configtoarr_inverter(config);
  let x = []
  for(let i=0; i< arr.length; i++){
    x.push(returnUnit_inverter(arr[i]));
  }
  let unit = Array.from(new Set(x));
  switch(type){
    case "line":
      thickness = 3;
      TYPE_INVERTER = "line";
      break;
    case "point":
      thickness = 0;
      TYPE_INVERTER = "point"
      break;
    case "bar":
      TYPE_INVERTER = "bar";
      break;
  }
  am4core.useTheme(am4themes_animated);
  if(chart2_inverter != null){
    chart2_inverter.dispose();
  }
  chart2_inverter = am4core.create("chartMain_inverter", am4charts.XYChart);
  chart2_inverter.scrollbarX = new am4core.Scrollbar();
  chart2_inverter.data = data;
  chart2_inverter.logo.disabled = true;
  let dateAxis = chart2_inverter.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 50;
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

  dateAxis.dateFormats.setKey("year", "yyyy");
  dateAxis.periodChangeDateFormats.setKey("month", "yyyy");



  chart2_inverter.cursor = new am4charts.XYCursor();
  chart2_inverter.cursor.fullWidthLineX = true;
  chart2_inverter.cursor.xAxis = dateAxis;
  chart2_inverter.cursor.lineX.strokeWidth = 0;
  chart2_inverter.cursor.lineX.fill = am4core.color("#000");
  chart2_inverter.cursor.lineX.fillOpacity = 0.1;
  chart2_inverter.legend = new am4charts.Legend();


  let bar = chart2_inverter.yAxes.push(new am4charts.ValueAxis());
  bar.tooltip.disabled = false;
  bar.renderer.ticks.template.disabled = true;
  bar.renderer.axisFills.template.disabled = true;
  if(unit.indexOf("bar") != -1){
    bar.renderer.line.strokeOpacity = 0.5;
    bar.renderer.line.strokeWidth = 1;
    bar.title.text ="bar"
  }
  bar.renderer.opposite = true;
  bar.extraMin = 0.1;
  bar.extraMax = 0.1; 

  var Hz = chart2_inverter.yAxes.push(new am4charts.ValueAxis());
  Hz.tooltip.disabled = false;
  Hz.renderer.ticks.template.disabled = true;
  Hz.renderer.axisFills.template.disabled = true;
  if(unit.indexOf("Hz") != -1){
    Hz.renderer.line.strokeOpacity = 0.5;
    Hz.renderer.line.strokeWidth = 1;
    Hz.title.text ="Hz"
  }
  Hz.renderer.opposite = false;
  Hz.extraMin = 0.1;
  Hz.extraMax = 0.1; 

  function creatAxisAndSeries_inverter(field){
    let series;
    if(type == "bar"){
    series = chart2_inverter.series.push(new am4charts.ColumnSeries());
    series.columns.template.fillOpacity = 1;
    series.columns.template.strokeOpacity = 1;
    }else{
      series = chart2_inverter.series.push(new am4charts.LineSeries());
    }
    if(type == "point"){
      series.bullets.push(new am4charts.CircleBullet());
    }
    switch (returnUnit_inverter(field)){     // water
      case "bar": series.yAxis = bar;break;
      case "Hz": series.yAxis = Hz;break;
    }
    series.dataFields.valueY = field;
    series.dataFields.dateX = "time";
    series.title = shortToFullName_inverter(field);
    series.strokeWidth = thickness;
    series.tensionX = 1;
    series.showOnInit = true;
    series.legendSettings.labelText = shortToFullName_inverter(field) +'('+returnUnit_inverter(field)+')'
    series.tooltipText =shortToFullName_inverter(field)+ ": {valueY} " + returnUnit_inverter(field);
    series.name = shortToFullName_inverter(field) ;
    series.tooltip.pointerOrientation = "horizontal";
    series.fill = am4core.color(color_config[field]);
    series.stroke = am4core.color(color_config[field]);
  }

  for(let i=0; i< arr.length; i++){
    creatAxisAndSeries_inverter(arr[i]);
  }
}

function arrtoconfig_inverter(arr){
  let key = Object.keys(CONFIG_INVERTER);
  for(let i=0; i<key.length; i++){
    CONFIG_INVERTER[key[i]] = 1;
  }
  for(let i=0; i<arr.length; i++){
    CONFIG_INVERTER[arr[i]] = 0;
  }; 
  return CONFIG_INVERTER;
}

$(document).ready(function(){
  $(document).on("click",".selectParaExport_inverter",function(){
    if($(this).is(":checked")){
      let val=$(this).val();
      ARR_INVERTER.push(val);arrtoconfig_inverter(ARR_INVERTER);
    }else{
      let x = $(this).val();
      let index = ARR_INVERTER.indexOf(x);
      ARR_INVERTER.splice(index,1);arrtoconfig_inverter(ARR_INVERTER);
    }
  })
})

function loadConfig_inverter(config,color_config){
  configtoarr_inverter(config);
  $(".selectParaExport_inverter").prop("checked",false);
  for(let i=0; i<ARR.length; i++){
    $("#selectParaExport"+ARR_INVERTER[i]+"_inverter").prop("checked",true);
  }
  let x = ["pressure","fre"];
  for(let i=0; i< x.length; i++){
    $("#color" + x[i]+"_inverter").val(color_config[x[i]]);
  }
}

function submitColor_inverter(){ // thay đổi màu các trường trong biểu đồ
  let x;
    x = ["pressure","fre"];
  for(let i=0;i<x.length; i++){
    COLOR_CONFIG_INVERTER[x[i]] = $("#color"+x[i]).val();
  }
  arrtoconfig_inverter(ARR_INVERTER)
  // renderChart(arrtoconfig(ARR), DATA, TYPE, COLOR_CONFIG);
}



$(function(){
  $('#time_chart_from_inverter').daterangepicker(
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
        FROMVISUAL_INVERTER = new Date(end).getTime();   
    }
 );
});

$(function() {
  $('#time_chart_to_inverter').daterangepicker(
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
        TOVISUAL_INVERTER = new Date(end).getTime();   
    }
 );
});

$(document).ready(function(){   //thay đổi laoij biểu đồ
  $("#typeChart_inverter").change(function(){
    let val = $(this).children("option:selected").val();
    TYPE_INVERTER = val;
    // renderChart(CONFIG, DATA, val, COLOR_CONFIG);
  })
})

function saveConfig_inverter(){  // lưu cấu hình
  let postData = {
  config: CONFIG_INVERTER,
  color_config: COLOR_CONFIG_INVERTER
  }
  httpAsync(postData,"/source/post/config","POST",function(result){
      alert(result);
  })
};

function submit_get_chart(){
  showChart_inverter(FROMVISUAL_INVERTER,TOVISUAL_INVERTER,TYPE_INVERTER,true)
}


// tab danh sách các cảnh báo
var TO_ALERT_LIST_INVERTER = (new Date()).getTime();
var FROM_ALERT_LIST_INVERTER = TO_ALERT_LIST_INVERTER - 24 * 3600000;


$(function() {
    $('#time_alert_to_inverter').daterangepicker(
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
        TO_ALERT_LIST_INVERTER = new Date(end).getTime();   
      }
   );
  });

  $(function() {
    $('#time_alert_from_inverter').daterangepicker(
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
        FROM_ALERT_LIST_INVERTER = new Date(end).getTime();   
      }
   );
  });


function getAlertAndRenderTable_inverter(){
  httpAsync(null,"/source/get/alert?fr="+FROM_ALERT_LIST_INVERTER+"&to="+TO_ALERT_LIST_INVERTER,'GET',function(result){
    if(result === "" || result == null){
      loadAL_inverter([]);
    }else{
      let data = JSON.parse(result);
      loadAL_inverter(data);
    }
})
}

function loadAL_inverter(data){
  $(document).ready(function() {
    $("#totalAlert_inverter").val(data.length);
      $('#tableAlert_inverter').DataTable().destroy();
      $('#tableAlert_inverter').DataTable({
              "pageLength": 50,
              language : translate_data_table(LANG),
              "columnDefs": [
                { className: "dt-head-center", targets: [ 0, 1, 2, 3, 4, 5] },
              ],
              data: modifi_alert_inverter(data),
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

function config_alert_type_inverter(x){
  if(LANG == "en"){
    switch(x){
      case "OVER_FRE": return "Over frequency";
      case "LOWER_FRE": return "Lower frequency";
      case "OVER_APSUAT": return "Over pressure";
      case "LOWER_APSUAT": return "Lower pressure";
    }
  }else{
    switch(x){
      case "OVER_FRE": return "Tần số vượt ngưỡng";
      case "LOWER_FRE": return "Tần số dưới ngưỡng";
      case "OVER_APSUAT": return "Áp suát vượt ngưỡng";
      case "LOWER_APSUAT": return "Áp suất dưới ngưỡng";
      default: return x;
    }
  }
  return x;
}

function modifi_alert_inverter(data){
  var y=[];
  for(let i=0; i<data.length; i++){
    let x ={ 
    id: i+1,
    alert_type: config_alert_type_inverter(data[i].alert_type),
    threshold: data[i].threshold,
    alert_value: data[i].alert_value,
    comparative_value: data[i].comparative_value,
    alert_time: returnSQLDateFormat(data[i].alert_time),
    }
    y.push(x);
  }
  return(y);
}


// function filter(){ // bấm nút filter
//     getAlertAndRenderTable_inverter();
// }

function refreshTable_inverter(){    // refresh data
    getAlertAndRenderTable_inverter();
}



// tab thông tin thiết bị
var SAVE_GROUP_INVERTER = [];
function set_select_group_option_inverter(){
  httpAsync(null,"/source/get/group_eq","GET",function(result){
    if(result =="" || result == null){
      return false;
    }else{
      let data = JSON.parse(result);
      $("#group_eq_inverter").empty();
      for(let i=0; i<data.length; i++){
        $("#group_eq_inverter").append('<li><label><input class="info_group_select_inverter" type="checkbox" id="group_id__inverter'+data[i].id+'" value="'+data[i].id+'">'+data[i].group_name+'</label></li>')
      }
    }
    get_info_inverter();
  })
}


function get_info_inverter(){ // lấy thông tin và điền vào các trường
  httpAsync(null,"/source/get/info","GET",function(result){
    if(result === "" || result == null){
      return false;
    }else{
      let data = JSON.parse(result);
      let x = data.group_id.split(",");
      $(".info_group_select_inverter").prop("checked",false);
      SAVE_GROUP_INVERTER = [];
     if(x != "" && x != null){
      for(let i=0; i<x.length;i++){
        $("#group_id__inverter"+x[i]+"").prop("checked",true);
        SAVE_GROUP_INVERTER.push(x[i]);
      }
     }
      $("#name_eq_inverter").val(data.name);
      $("#info_inverter_code").val(data.inverter_code);
      $("#address_info_inverter").val(data.address);
      $("#install_date_inverter").val( return_date_input_format(data.install_date));
      $("#inspection_date_inverter").val( return_date_input_format(data.inspection_date));
      $("#loger_install_date_inverter").val( return_date_input_format(data.loger_install_date));
    }
  })
}



$(document).on("click", ".info_group_select_inverter","input[type=checkbox]", function(){
  if($(this).is(":checked")){
    let x = $(this).attr("id").slice(18);
    SAVE_GROUP_INVERTER.push(x);
  }else{
    let x = $(this).attr("id").slice(18);
    let index = SAVE_GROUP_INVERTER.indexOf(x);
    SAVE_GROUP_INVERTER.splice(index, 1);
  }
  // console.log(SAVE_GROUP);
})

function save_info_inverter (){
  let post_data = {
    group_id: SAVE_GROUP_INVERTER,
    name:$("#name_eq_inverter").val(),
    inverter_code: $("#info_inverter_code").val(),
    address:$("#address_info_inverter").val(),
    install_date:$("#install_date_inverter").val(),
    inspection_date:$("#inspection_date_inverter").val(),
    loger_install_date:$("#loger_install_date_inverter").val(),
  }
  if(post_data.name == null || post_data.name === ""){
    if(LANG == "en"){
      alert("Name value must not be empty!");

    }else{
      alert("Tên không được để trống");
    }
    return false;
  } 
    httpAsync(post_data,"/source/post/edit_info_inverter","POST",function(result){
      alert(result);
      getEQ(FILTER_EQ_LIST);
      return true;
    })
}




// tab cài đặt cảnh báo dòng điện và điện áp


function get_setting_fre_config(){
  httpAsync(null,"/source/get/setting_fre_config","GET",function(result){
    if(result === "" || result == null){
      return false;
    }else{
      let data = JSON.parse(result);
      let config = JSON.parse(data[0].command);
      for(let i=0; i<config.length; i++){
        $("#fre__lower_"+(i+1)).val(config[i].lower);
        $("#fre__over_"+(i+1)).val(config[i].over);
        $("#fre__value_"+(i+1)).val(config[i].value);
      }
    }
  })
}

function save_setting_amperage(){
  let config_fre = [];
  for(let i=1; i<=6; i++){
    let lower = $("#fre__lower_"+i).val();
    let over = $("#fre__over_"+i).val();
    let value = $("#fre__value_"+i).val();
    if(lower != "" || over != "" || value != ""){
      config_fre.push({lower: config_pressure_value(lower), over:config_pressure_value(over), value: config_pressure_value(value)})
    }
  }
  httpAsync({config_fre: config_fre},"/source/post/save_setting_fre_alert","POST",function(result){
    alert(result);
  })
}

// cài đặt cấu hình áp suất

function config_pressure_value(x){
  if(x =="" || x === null){
    return null;
  }
  if(typeof(Number(x)) == 'number'){
    return Number(x)
  };
}

function get_setting_pressure_config(){
  httpAsync(null,"/source/get/setting_pressure_config","GET",function(result){
    if(result === "" || result == null){
      return false;
    }else{
      let data = JSON.parse(result);
      let config = JSON.parse(data[0].command);
      for(let i=0; i<config.length; i++){
        $("#pressure__lower_"+(i+1)).val(config[i].lower);
        $("#pressure__over_"+(i+1)).val(config[i].over);
      }
    }
  })
}

function save_setting_pressure_alert(){
  let config_pressure = [];
  for(let i=1; i<=6; i++){
    let lower = $("#pressure__lower_"+i).val();
    let over = $("#pressure__over_"+i).val();
    if(lower != "" || over != "" ){
      config_pressure.push({lower: config_pressure_value(lower), over:config_pressure_value(over)})
    }
  }
  httpAsync({config_pressure: config_pressure},"/source/post/save_setting_pressure_alert","POST",function(result){
    alert(result);
  })
}



//reset khi đóng modal
$(document).ready(function(){
  $('#DetalEQ_inverter').on('hidden.bs.modal', function () {
    //   $("#inverter_code").html("");
      $(this).find('form').trigger('reset');
      $(this).find('select').prop('selectedIndex',0);
      $(this).find('input').not("#static_group").val("");
      if(chart2_inverter != null){
          chart2_inverter.dispose();
      }
      $('a[data-target="#instant_value_tab_inverter"]').tab('show');
      LOADED_DATA_INVERTER =false; LOADED_INVERTER_DATA_INVERTER = false; LOADED_INFO_INVERTER = false;
      LOADED_VIS_INVERTER = false; LOADED_WARN_INVERTER = false; LOADED_SET_PRESSURE_CONFIG_ALERT_INVERTER = false;
      LOADED_SET_AMPERAGE_ALERT_INVERTER = false;

        TOVISUAL_INVERTER = (new Date()).getTime();//thời gian bắt đầu của biểu đồ tab visual
        FROMVISUAL_INVERTER = TOVISUAL_INVERTER - 3600000*24 ;//thời gian kết thúc của biểu đồ tab visual
      TO_DATA_INVERTER = new Date().getTime();  // thời gian kết thúc
      FROM_DATA_INVERTER = TO_DATA_INVERTER -  3600000*24 // thời gian bắt đầu
      TO_INVERTER_DATA_INVERTER = new Date().getTime();  // thời gian kết thúc
      FROM_INVERTER_DATA_INVERTER = TO_INVERTER_DATA_INVERTER -  3600000*24 // thời gian bắt đầu
      TO_ALERT_LIST_INVERTER = (new Date()).getTime();
      FROM_ALERT_LIST_INVERTER = TO_ALERT_LIST_INVERTER - 24 * 3600000;
      TYPE_INVERTER ="line";

      $(".DOW").prop("checked",false);
      $(".info_group_select").prop("checked",false);
      SAVE_GROUP_INVERTER = [];
  })
})

// xử lý event khi chuyển tab mới bắt đầu load dữ liệu, quay lại tab đã load thì ko load nữa
var LOADED_DATA_INVERTER =false, LOADED_INVERTER_DATA_INVERTER = false, LOADED_INFO_INVERTER = false, LOADED_SET_AMPERAGE_ALERT_INVERTER = false, LOADED_SET_PRESSURE_CONFIG_ALERT_INVERTER = false,
 LOADED_VIS_INVERTER = false, LOADED_WARN_INVERTER = false;
$(document).ready(function(){
    $('a[data-target="#instant_value_tab_inverter"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('a[data-target="#detail_data_tab_inverter"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        if(!LOADED_DATA_INVERTER){
        TO_DATA_INVERTER = new Date().getTime()  // thời gian kết thúc
        FROM_DATA_INVERTER = TO_DATA_INVERTER - 3600000*24 // thời gian bắt đầu
          $("#time_to_inverter").data("daterangepicker").setStartDate(moment().startOf('minute'));
          $("#time_to_inverter").data("daterangepicker").setEndDate(moment().startOf('minute'));
          $("#time_from_inverter").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
          $("#time_from_inverter").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
          get_data_inverter()
            LOADED_DATA_INVERTER=true;
        }
    });

    $('a[data-target="#detail_inverter_tab_inverter"]').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
      if(!LOADED_INVERTER_DATA_INVERTER){
        TO_INVERTER_DATA_INVERTER = new Date().getTime()  // thời gian kết thúc
        FROM_INVERTER_DATA_INVERTER = TO_INVERTER_DATA_INVERTER - 3600000*24 // thời gian bắt đầu
        $("#time_inverter_to_inverter").data("daterangepicker").setStartDate(moment().startOf('minute'));
        $("#time_inverter_to_inverter").data("daterangepicker").setEndDate(moment().startOf('minute'));
        $("#time_inverter_from_inverter").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
        $("#time_inverter_from_inverter").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
          get_inverter_data_inverter()
          LOADED_INVERTER_DATA_INVERTER=true;
      }
  });

    $('a[data-target="#visualize_tab_inverter"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        if(!LOADED_VIS_INVERTER){
            TOVISUAL_INVERTER = new Date().getTime()  // thời gian kết thúc
            FROMVISUAL_INVERTER = TOVISUAL_INVERTER - 3600000*24 // thời gian bắt đầu
          $("#time_chart_to_inverter").data("daterangepicker").setStartDate(moment().startOf('minute'));
          $("#time_chart_to_inverter").data("daterangepicker").setEndDate(moment().startOf('minute'));
          $("#time_chart_from_inverter").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
          $("#time_chart_from_inverter").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
          showChart_inverter(FROMVISUAL_INVERTER,TOVISUAL_INVERTER,TYPE_INVERTER,true)
            LOADED_VIS_INVERTER = true;
        }
    });
    $('a[data-target="#warning_tab_inverter"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        if(!LOADED_WARN_INVERTER){
            TO_ALERT_LIST_INVERTER = new Date().getTime()  // thời gian kết thúc
            FROM_ALERT_LIST_INVERTER = TO_ALERT_LIST_INVERTER - 3600000*24 // thời gian bắt đầu
          $("#time_alert_to_inverter").data("daterangepicker").setStartDate(moment().startOf('minute'));
          $("#time_alert_to_inverter").data("daterangepicker").setEndDate(moment().startOf('minute'));
          $("#time_alert_from_inverter").data("daterangepicker").setStartDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
          $("#time_alert_from_inverter").data("daterangepicker").setEndDate(moment().startOf('minute').subtract(moment.duration("24:00:00")));
          getAlertAndRenderTable_inverter();
          LOADED_WARN_INVERTER = true;
        }
    });
    $('a[data-target="#information_tab_inverter"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        if(!LOADED_INFO_INVERTER){
            set_select_group_option_inverter();
            LOADED_INFO_INVERTER = true;
        }
    });
    $('a[data-target="#setting_amperage_tab_inverter"]').click(function (e) {
      e.preventDefault();
      if(!LOADED_SET_AMPERAGE_ALERT_INVERTER){
        get_setting_fre_config()
        LOADED_SET_AMPERAGE_ALERT_INVERTER = true;
      }
  });

  $('a[data-target="#setting_pressure_config_tab_inverter"]').click(function (e) {
    e.preventDefault();
    if(!LOADED_SET_PRESSURE_CONFIG_ALERT_INVERTER){
      get_setting_pressure_config();
      LOADED_SET_PRESSURE_CONFIG_ALERT_INVERTER = true;
    }
});
})

// set giao dien dropdow checkbox
// $(".checkbox-menu").on("change", "input[type='checkbox']", function() {
//   $(this).closest("li").toggleClass("active", this.checked);
// });

// $(document).on('click', '.allow-focus', function (e) {
//  e.stopPropagation();
// });