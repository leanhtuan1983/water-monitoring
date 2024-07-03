


var allowLoad = true; var ROLE;


window.onload = function(){
    var accName = document.getElementById('accountName').innerHTML;
    var data = {data: accName};
    // let xmlHttp = new XMLHttpRequest();
    // xmlHttp.open("POST", '/checkAccount' , true);
    // xmlHttp.setRequestHeader("Content-type", "application/json");
    // xmlHttp.send(JSON.stringify(data));
    // xmlHttp.onload = function(){
    //     if(xmlHttp.readyState === xmlHttp.DONE){
    //         if(xmlHttp.status === 200){
    //             // console.log((xmlHttp.responseText));
    //             checkAdmin(xmlHttp.responseText);
    //             ROLE = xmlHttp.responseText;
    //         }
    //     }
    // }
    checkAdmin();
    on_off_eq();
    showAllChart();
    // setInterval(function(){showAllChart();}, 1000*10*60);
  }
    var CHART3 =null;
    var TYPE3 = "line"
    var DATA3;
    var TIME3 = "1month";


    // function checkAdmin(role){
    //     if(role == 'true'){
    //         $('#adminTab').show();
    //         $(".roleAdmin").removeAttr("disable")
    //     }else{
    //         $('#adminTab').hide();
    //         $('.roleAdmin').attr("disabled",true);
    //     }
    // }
var LANG = "en";

    function checkAdmin(){
        httpAsync(null,"/source/get/checkAdmin","GET",function(result){
          let data = JSON.parse(result);
          if(data.lang != null || data.lang !=""){
            LANG = data.lang;
          }
          // set_filter();
          
          if(data.role == "admin"){
            $('#adminTab').show();
            $(".roleAdmin").removeAttr("disable");
            ROLE = 'admin'
            // showDataAccount();
          }else if(data.role == "sub"){
              ROLE = "sub"
            $('#adminTab').hide();
            $('.roleAdmin').attr("disabled",true);
          }
          console.log(LANG)
        })
      }




function showChart3(fr,to){            
    let id = $("#IDchart3").val();
    if(CHART3 != null){
        CHART3.dispose();
      }
    httpAsync(null,"/get/dashboard3?id="+id+"&fr="+fr+"&to="+to,"GET",function(result){
        // console.log(JSON.parse(result));
        let data;
        if(result == ""){
            data = [];
        }else{
            data=JSON.parse(result);
        }
        DATA3=data;
        renderChart(CHART3,data,"chart3",TYPE3);
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

function toISO(x){
    if(Number.isNaN(Number(x))){
      var y = new Date(x);
      return y;
    }else{
    var y = new Date(Number(x));
    return y;
    }
  }

function stringtonum(st){
    if(Number.isNaN(Number(st))){
      return null;
    }else{
    return Number(st);
    }
}

// chart.language.locale = am4lang_xx_XX;
// var am4lang_xx_XX ={
//     "Apr 11":" 123"
// }
function renderChart(CHART,Data,idDiv,TYPE){
    // console.log(Data)
    let data = [];
    for(let i=0; i< Data.length; i++){  
        let x= {
            "time": toISO(Data[i].TIME),
            "val": stringtonum(Data[i].Pgiao)
            };
        // if(!Number.isNaN(Number(x.val)))
        if(stringtonum(Data[i].Pgiao)!=null)
        data.push(x);
    }
    // console.log(data)
    am4core.useTheme(am4themes_animated);
    if(CHART != null){
        CHART.dispose();
      }
    //   console.log(CHART);
    CHART = am4core.create(idDiv, am4charts.XYChart);
    // CHART.language.locale = am4lang_xx_XX;
    // CHART.dateFormatter.dateFormat = "yyyy-MM-dd";
    CHART.data = data;
    CHART.logo.disabled = true;
    var dateAxis = CHART.xAxes.push(new am4charts.DateAxis());
      dateAxis.startLocation = 0.5;
      dateAxis.endLocation = 0.5;
      dateAxis.renderer.minGridDistance = 60;
      dateAxis.baseInterval.tineUnit = "minute";
      dateAxis.dateFormats.setKey("hour", "HH:mm");
      dateAxis.dateFormats.setKey("day", "dd/MM");
      dateAxis.periodChangeDateFormats.setKey("hour", "dd/MM"); 
      dateAxis.dateFormats.setKey("month", "MM/yyyy");
      dateAxis.periodChangeDateFormats.setKey("day", "MM/yyyy");
    var valueAxis = CHART.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = false;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.renderer.axisFills.template.disabled = true;
    valueAxis.renderer.line.strokeOpacity = 0.5;
    valueAxis.renderer.line.strokeWidth = 1;
    // valueAxis.renderer.opposite = true;
    valueAxis.extraMin = 0.1;
    valueAxis.extraMax = 0.1;


    var title = CHART.titles.create();
    
    title.fontSize = 15;
    title.marginBottom = 0;


    var series;
    if(TYPE == "bar"){
        series = CHART.series.push(new am4charts.ColumnSeries());
        series.columns.template.fillOpacity = 1;
        series.columns.template.strokeOpacity = 1;
        }else{
          series = CHART.series.push(new am4charts.LineSeries());
        }
    if(TYPE == "point"){
          series.bullets.push(new am4charts.CircleBullet());
          series.strokeWidth = 0;
        }
    if(TYPE == "line"){
        series.strokeWidth = 2;
        switch(idDiv){
            case "chart1":
                series.fillOpacity = 0.8;
                var fillModifier = new am4core.LinearGradientModifier();
                fillModifier.opacities = [1, 0];
                fillModifier.offsets = [0, 1];
                fillModifier.gradient.rotation = 90;
                series.segments.template.fillModifier = fillModifier;
                series.tooltipText = "Sum P : [bold]{valueY}[/] (Wh) "; 
                break;
            case "chart2":
                series.tooltipText = "P max: [bold]{valueY}[/] (Wh) ";
                break;
            case "chart3":
                series.fillOpacity = 0.8;
                var fillModifier = new am4core.LinearGradientModifier();
                fillModifier.opacities = [1, 0];
                fillModifier.offsets = [0, 1];
                fillModifier.gradient.rotation = 90;
                series.segments.template.fillModifier = fillModifier;
                if(LANG == "en"){
                    series.tooltipText = "Sum quanity : [bold]{valueY}[/] (m3) "; 
                }else{
                    series.tooltipText = "Tổng sản lượng : [bold]{valueY}[/] (m3) "; 

                }
                break;
        }
    }
    
    series.dataFields.valueY = "val";
    series.dataFields.dateX = "time";
    series.title = '';
    // series.bullets.push(new am4charts.CircleBullet());
    //series.tooltipText = "Sum P : [bold]{valueY}[/] (Wh) " 
    series.tensionX = 0.9;
    series.showOnInit = true;



   

    switch(idDiv){
        case "chart3":
            valueAxis.title.text ="m3";
            if(LANG == "en"){
                title.text = "Daily consumption quanity for all sites W-meter (m3)";

            }else{
                title.text = "Tổng sản lượng nước của thiết bị tổng theo ngày (m3)";

            }
            // var myEvent = title.events.on("hit",function(ev){
            //     window.open("/source/Wmeter","_self")
            // },this);
            break;
    }
    series.yAxis = valueAxis
    CHART.cursor = new am4charts.XYCursor();
    CHART.cursor.fullWidthLineX = true;
    CHART.cursor.xAxis = dateAxis;
    CHART.cursor.lineX.strokeWidth = 0;
    CHART.cursor.lineX.fill = am4core.color("#000");
    CHART.cursor.lineX.fillOpacity = 0.1;
    
    CHART.scrollbarX = new am4core.Scrollbar();
}



$(document).ready(function(){
    $(document).on("click",".settingBtn",function(){
        let id= $(this).attr("id").slice(0,6)
        IDDIV = id;
        console.log(id);
        fillSeting(id);
        $("#ChartSettingModal").modal("show")
    })
})

function setToDate(){
    let x = new Date();
    x.setHours(0,0,0,0);
    let y = new Date(x);
    // console.log(y)
    return y.getTime();
}
var TO = setToDate()
var FROM = TO - 3600000 * 24 * 30;

function fillSeting(id){
    allowLoad = false;
    switch(id){
        case "chart3":  $("#typeChart").val(TYPE3).trigger("change");$("#selectTime").val(TIME3).trigger("change");allowLoad = true; break;
    }

        fillSelectId(id);

}
// select-search-ID
function fillSelectId(id){
    let eq;
    switch(id){
        case "chart3": eq ="wt";break;
    }
    httpAsync(null,"/get/dashboard/fillSelectId","GET",function(result){
        let data = JSON.parse(result);
        console.log(data)
        $("#idSetting").empty()
        for(let i=0; i<data.length;i++){
            $("#idSetting").append('<option value="'+data[i].id+'" data-tokens="'+data[i].name+'" >'+data[i].name+' - '+data[i].id+'</option>');
        }
        $('#idSetting').selectpicker('refresh');
        httpAsync(null,"/get/idChartDashboard","GET",function(result){
            let data = JSON.parse(result);
            for(let i=0;i<data.length;i++){
                console.log(data[i].ID) 
                if((data[i].id_div) == id){
                    $("#idSetting").val(data[i].ID).trigger('change');
                    $("#decriptSetting").val(data[i].decription)
                    $("#"+data[i].id_div+"Name").html(data[i].name)
                    break;
                }
            }
        })

    })
}



var CONFIG;
function showAllChart(){
    httpAsync(null,"/get/idChartDashboard","GET",function(result){
        let data = JSON.parse(result);
        // console.log(data);
        CONFIG = data;
        for(let i=0; i<data.length; i++){
            $("#ID"+data[i].id_div).val(data[i].ID);
            $("#decript"+data[i].id_div).html(data[i].decription)
            $("#"+data[i].id_div+"Name").html(data[i].name)
        }
        showChart3(FROM,TO);
    })
}

function setTime(x){
    switch(IDDIV){
        case "chart3": TIME1 = x; break;
    }
}

$(document).ready(function(){
    $("#selectTime").change(function(){
        let val = $(this).children("option:selected").val();
        if(allowLoad == true){
        switch(val){
            case "1month":
                document.getElementById("picktimeChart").style.display = 'none';
                TO = setToDate()
                FROM = TO - 3600000 * 24 * 30;
                setTime("1month");
                show1chart(IDDIV);
                break;
            case "2month":
                document.getElementById("picktimeChart").style.display = 'none';
                TO = setToDate()
                FROM = TO - 3600000 * 24 * 60;
                show1chart(IDDIV)
                setTime("2month");
                break;
            case "custom":
                document.getElementById("picktimeChart").style.display = 'block';
                setTime("1month");
                break;
        }
    }else{
        return false;
    }
    })
})

function show1chart(x){
    switch(x){
        case "chart3":
            showChart3(FROM,TO);break;
    }
}

$(function() {
    $('#picktimeChart').daterangepicker(
      {
        //  startDate: moment().startOf('hour'),
        //  endDate: moment().startOf('hour'),
         showDropdowns: true,
         showWeekNumbers: true,
        //  timePicker: true,
        //  timePickerIncrement: 1,
        //  timePicker12Hour: true,
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
             format: 'DD/MM/YYY'
         }
      },
      function(start, end) {
      console.log(start, end)
       FROM = (new Date(start)).getTime();
        TO = (new Date(end)).getTime();   
        show1chart(IDDIV); 
      }
   );
  });

function setType(x){
    switch(IDDIV){
        case "chart3":TYPE3 = x;break;
    }
}

  $(document).ready(function(){
      $("#typeChart").change(function(){
        let val = $(this).children("option:selected").val();
        switch(val){
            case "line":setType("line"); renderchartChangeType(IDDIV);break;
            case "point":setType("point"); renderchartChangeType(IDDIV);break;
            case "bar":setType("bar"); renderchartChangeType(IDDIV);break;
        }
      })
  })

  function renderchartChangeType(x){
    if(allowLoad == true){
    switch(x){
        case "chart3":  renderChart(CHART3,DATA3,"chart3",TYPE3);break;
    }
}else{
    return false;
}
  }


function updateDashboard(){
    let postData ={
        ID: $("#idSetting").val(),
        id_div: IDDIV,
        decript: $("#decriptSetting").val()
    }
    console.log(postData)
    if(ROLE == "admin"){
        console.log(postData)
    httpAsync(postData,"/post/updateDashboard","POST",function(result){
        alert(result);
        httpAsync(null,"/get/idChartDashboard","GET",function(result){
            let data = JSON.parse(result);
            console.log(data);
            CONFIG = data;
            for(let i=0; i<data.length; i++){
                $("#ID"+data[i].id_div).val(data[i].ID);
                $("#decript"+data[i].id_div).html(data[i].decription)
                $("#"+data[i].id_div+"Name").html(data[i].name)
            }
            show1chart(IDDIV)
        })
    })
    }else return false;
}


function on_off_eq(){
    httpAsync(null,"/get/onoffEq","GET",function(result){
        let data = JSON.parse(result);

        $("#onEqWmeter").val(data.on);
        // httpAsync(null,"/get/offEq","GET",function(result1){
        //     console.log(result,result1)

        //     let data1 = Number(result1);
            $("#offEqWmeter").val(data.off);
            $("#TotalDevice").html(data.on+ data.off);
            $("#onEq").html(data.on);
            $("#offEq").html(data.off);
            renderChartCount(data.on,data.off,"chartDivwt","Wmeter")
        // })
    })
}

function renderChartCount(on,off,chartDiv,TITLE){
    if(LANG =="en"){
        TITLE = "W - METER"
    }else{
        TITLE = "CÔNG TƠ NƯỚC"
    }
am4core.useTheme(am4themes_animated);
var chart = am4core.create(chartDiv, am4charts.PieChart3D);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

chart.data = [
  {
    status: "ON",
    value: on
  },
  {
    status: "OFF",
    value: off
  }
];

chart.innerRadius = am4core.percent(40);
chart.depth = 20;
chart.legend = new am4charts.Legend();
chart.legend.position = "right";
chart.radius = am4core.percent(100);
chart.logo.disabled = true;
var series = chart.series.push(new am4charts.PieSeries3D());
series.dataFields.value = "value";
// series.dataFields.depthValue = "value";
series.dataFields.category = "status";
series.slices.template.cornerRadius = 5;
series.colors.step = 3;

var title = chart.titles.create();
title.text = TITLE;
title.fontSize = 25;
title.marginBottom = 30;
}