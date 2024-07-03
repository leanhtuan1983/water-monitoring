let get_image = require("./get_image_for_excel_export")
const fix = 3;
var excel = require('exceljs');
var accessDB = require('./mysql-config');

function return_inverter_status(x){
    if(x === "" || x === null) return "";
    if(x == 1 || x == "1"){return "Kết nối"}
    else if( x==0 || x=="0"){return "Không kết nối"}
  }
  function show_if_null(x){
    if(x === "" || x === null) 
      return "-";
    return x;
  }

function numToLetter(num){
  switch(num){
    case 1:return "A";
    case 2:return "B";
    case 3:return "C";
    case 4:return "D";
    case 5:return "E";
    case 6:return "F";
    case 7:return "G";
    case 8:return "H";
    case 9:return "I";
    case 10:return "J";
    case 11:return "K";
    case 12:return "L";
    case 13:return "M";
    case 14:return "N";
    case 15:return "O";
    case 16:return "P";
    case 17:return "Q";
    case 18:return "R";
    case 19:return "S"; 
    case 20:return "T";
    case 21:return "U";
    case 22:return "V";
    case 23:return "W";
  }
}
function returnSQLDateFormat(dateObj){
    if(dateObj == "" || dateObj == null) return "-";
    let date = new Date(Number(dateObj));
    let x = date.getFullYear()         + '-' +
    pad(date.getMonth() + 1)  + '-' +
    pad(date.getDate())       + ' ' +
    pad(date.getHours())      + ':' +
    pad(date.getMinutes())    + ':' +
    pad(date.getSeconds());
    return x;
  }
  
function numberWithCommas(x) {
  let parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(",");
}

function lamtron(x){
  return Math.ceil(x * 1000)/1000;
}

function return_in_sql(arr){
    let x = "";
    for(let i=0; i<arr.length; i++){
      x+= "'"+arr[i]+"',"
    }
    return x.slice(0,-1)
  }

function fixed_data(x){
  if(x ==="" || x === null){
    return "-";
  }

  function show_if_null(x){
    if(x === "" || x === null) 
      return "-";
    return x;
  }

 if(!isNaN(Number(x))){
    return Number(x);
  }else{
    return x;
  }
}


var pad = function(num) { return ('00'+num).slice(-2) };
function return_local_date_string(date){
  let x = pad(date.getDate()) + '/' +
  pad(date.getMonth() + 1)   + '/' +
  date.getFullYear() + ', '+
  pad(date.getHours())      + ':' +
  pad(date.getMinutes())    + ':' +
  pad(date.getSeconds());
return x;
}


  function return_date(x){
    var d = new Date(Number(x));
    var mm = d.getMonth() + 1;
    var dd = d.getDate();
    var yy = d.getFullYear();
    return dd + '_' + mm + '_' + yy;
  }

  function changeARRSQLIN(arrStr){
    let arrchange = [];
    let arr = arrStr.split(",");
    for(let i = 0; i<arr.length; i++){
      let a = "'"+arr[i]+"'";
      arrchange.push(a);
    }
    return arrchange.join();
  }

function export_alert_data(req,res){
    let name_file = "DANH_SACH_CANH_BAO"+return_date(req.query.fr)+"_"+return_date(req.query.to);;
    let from = returnSQLDateFormat(req.query.fr);
    let to = returnSQLDateFormat(req.query.to);
    // console.log(from,to)
    let para = changeARRSQLIN(req.query.para);
    if(req.user.role == "admin"){
      accessDB("SELECT * FROM alert_data INNER JOIN totaleq ON alert_data.meter_id = totaleq.id AND alert_data.serial_sensor = totaleq.serial_sensor WHERE alert_data.para IN ("+para+") AND alert_data.alert_time >= ? AND alert_data.alert_time <= ? ORDER BY alert_data.alert_time DESC;",[from,to], function(result){
        render_alert_excle(req,res,result,name_file)
        // console.log(result)

        })
    }else{
      let group_id = req.user.group;
      accessDB("call get_tree(?);",[group_id],function(result){
        let child_data = result[0];
        let join_child = []
        for(let i=0; i<child_data.length; i++){
          join_child.push(child_data.gr_id)
        }
        join_child.push(group_id);
        accessDB("SELECT * FROM alert_data INNER JOIN totaleq ON alert_data.meter_id = totaleq.ID AND alert_data.serial_sensor = totaleq.serial_sensor INNER JOIN group_relationship_demo_QN WHERE (group_relationship_demo_QN.id IN ("+return_in_sql(join_child)+") OR group_relationship_demo_QN.parent_id IN ("+return_in_sql(join_child)+")) AND alert_data.para IN ("+para+") AND alert_data.alert_time >= ? AND alert_data.alert_time <= ? ORDER BY alert_data.alert_time DESC;",[from,to],function(result_2){
            render_alert_excle(req,res,result_2,name_file)
        })
      })
    }

}
async function render_alert_excle(req,res,result_2,name_file){
        let data = JSON.parse(JSON.stringify(result_2));
        let workbook = new excel.Workbook(); //creating workbook
        let worksheet = workbook.addWorksheet("DANH_SACH_CANH_BAO"); //creating worksheet
        worksheet.getColumn('A').width = 6;       //STT
        worksheet.getColumn('B').width = 30;     // thời gian
        worksheet.getColumn('C').width = 30;    //  meter_id
        worksheet.getColumn('D').width = 30;    // name
        worksheet.getColumn('E').width = 35;    // Cảnh báo
        worksheet.getColumn('F').width = 20;    // Ngưỡng cảnh báo
        worksheet.getColumn('G').width = 20;    // Giá trị
        worksheet.getColumn('H').width = 30;    // serial_sensor

        worksheet.mergeCells('A1:H1');
        worksheet.getCell('A1').value = "DANH SÁCH CẢNH BÁO";
        worksheet.getCell("A1").font ={name: 'Arial', size: 10, bold: true };
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
  
        worksheet.mergeCells('A2:H2');
        worksheet.getCell('A2').value = "Người xuất báo cáo: "+req.user.usr;
        worksheet.getCell("A2").font ={name: 'Arial', size: 10, bold: false };
  
        worksheet.mergeCells('A3:H3');
        worksheet.getCell('A3').value = "Có "+ data.length +" bản ghi từ "+return_local_date_string(new Date(Number(req.query.fr))) + "đến "+return_local_date_string(new Date(Number(req.query.to)));
        worksheet.getCell("A3").font ={name: 'Arial', size: 10, bold: false };

        worksheet.getCell('A4').fill = {
            type: "pattern",
            pattern: "solid",
            fgColor:{argb:'70CBFF'},
        }
          worksheet.getCell('A4').value = "STT";
          worksheet.getCell('A4').font ={name: 'Arial', size: 10, bold: true };
          worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

          worksheet.getCell('B4').fill = {
            type: "pattern",
            pattern: "solid",
            fgColor:{argb:'70CBFF'},
        }
          worksheet.getCell('B4').value = "Thời gian";
          worksheet.getCell('B4').font ={name: 'Arial', size: 10, bold: true };
          worksheet.getCell('B4').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

          worksheet.getCell('C4').fill = {
            type: "pattern",
            pattern: "solid",
            fgColor:{argb:'70CBFF'},
        }
          worksheet.getCell('C4').value = "Mã thiết bị";
          worksheet.getCell('C4').font ={name: 'Arial', size: 10, bold: true };
          worksheet.getCell('C4').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

          worksheet.getCell('D4').fill = {
            type: "pattern",
            pattern: "solid",
            fgColor:{argb:'70CBFF'},
        }
          worksheet.getCell('D4').value = "Tên thiết bị";
          worksheet.getCell('D4').font ={name: 'Arial', size: 10, bold: true };
          worksheet.getCell('D4').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

          worksheet.getCell('E4').fill = {
            type: "pattern",
            pattern: "solid",
            fgColor:{argb:'70CBFF'},
        }
          worksheet.getCell('E4').value = "Cảnh báo";
          worksheet.getCell('E4').font ={name: 'Arial', size: 10, bold: true };
          worksheet.getCell('E4').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

          worksheet.getCell('F4').fill = {
            type: "pattern",
            pattern: "solid",
            fgColor:{argb:'70CBFF'},
        }
          worksheet.getCell('F4').value = "Ngưỡng cảnh báo";
          worksheet.getCell('F4').font ={name: 'Arial', size: 10, bold: true };
          worksheet.getCell('F4').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

          worksheet.getCell('G4').fill = {
            type: "pattern",
            pattern: "solid",
            fgColor:{argb:'70CBFF'},
        }
          worksheet.getCell('G4').value = "Giá trị cảnh báo";
          worksheet.getCell('G4').font ={name: 'Arial', size: 10, bold: true };
          worksheet.getCell('G4').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

          worksheet.getCell('H4').fill = {
            type: "pattern",
            pattern: "solid",
            fgColor:{argb:'70CBFF'},
        }
          worksheet.getCell('H4').value = "Serial sensor";
          worksheet.getCell('H4').font ={name: 'Arial', size: 10, bold: true };
          worksheet.getCell('H4').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

          for(let i=0; i<data.length; i++){
            worksheet.getCell('A'+(5+i)).value =  " "+(i+1)+" ";
            worksheet.getCell('A'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };
            worksheet.getCell('B'+(5+i)).value =  return_local_date_string(new Date(data[i].alert_time));
            worksheet.getCell('B'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };
            worksheet.getCell('C'+(5+i)).value =  show_if_null(data[i].meter_id);
            worksheet.getCell('C'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };
            worksheet.getCell('D'+(5+i)).value =  show_if_null(data[i].name);
            worksheet.getCell('D'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

            worksheet.getCell('E'+(5+i)).value =  show_if_null(data[i].alert_type);
            worksheet.getCell('E'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

            worksheet.getCell('F'+(5+i)).value =  show_if_null(data[i].threshold);
            worksheet.getCell('F'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

            worksheet.getCell('G'+(5+i)).value =  show_if_null(data[i].alert_value);
            worksheet.getCell('G'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

            worksheet.getCell('H'+(5+i)).value =  show_if_null(data[i].serial_sensor);
            worksheet.getCell('H'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

          }

          for(let i=0; i<data.length+1;i++){
            for(let j=1; j<=8; j++){
              worksheet.getCell(numToLetter(j)+(4+i)).border ={
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
              }
            }
          }
          res.setHeader('Content-Disposition', 'attachment; filename=' +name_file+ ".xlsx");
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          await workbook.xlsx.write(res);
          res.end();
             
}

// function addlog(to,from,name,para,usr,moment,eq,selectedEQ,url){
 
//   let timescale = from.toString() +","+to.toString();
//   console.log(to,from,name,para,usr,moment,eq,selectedEQ,timescale)
//   accessDB("INSERT INTO report_table (name,timeScale,moment,para,creatby,url,exportTime,eq,selecteq) VALUES (?,?,?,?,?,?,?,?,?)",[name, timescale,moment,para,usr,url,new Date(),eq,selectedEQ],function(result){
//     console.log(result);
//   })
// }


module.exports = export_alert_data;