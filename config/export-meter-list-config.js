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
    var d = new Date(x);
    var mm = d.getMonth() + 1;
    var dd = d.getDate();
    var yy = d.getFullYear();
    return dd + '_' + mm + '_' + yy;
  }

function export_meter_list(req,res,group_id){
    let name_file = "DANH_SACH_THONG_TIN_METER_"+return_date(new Date());
    console.log(group_id)
    accessDB("call get_tree(?)",[group_id],function(result){
     let child = result[0];
     let join_child = [];
     for(let i=0; i<child.length; i++){
        join_child.push(child[i].gr_id)
     }
     join_child.push(group_id);
     console.log(join_child)

     accessDB("SELECT *, totaleq.name AS name, totaleq.status AS status, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.id IN ("+return_in_sql(join_child)+");",[],async function(result_2){
        let data = JSON.parse(JSON.stringify(result_2));
        let workbook = new excel.Workbook(); //creating workbook
        let worksheet = workbook.addWorksheet("DANH_SACH_THIET_BI"); //creating worksheet
        worksheet.getColumn('A').width = 6;       //STT
        worksheet.getColumn('B').width = 25;     // meter_id
        worksheet.getColumn('C').width = 25;    //  serial sensor
        worksheet.getColumn('D').width = 30;    // name
        worksheet.getColumn('E').width = 25;    // seri sim
        worksheet.getColumn('F').width = 20;    //address
        worksheet.getColumn('G').width = 20;    // tần suất
        worksheet.getColumn('H').width = 20;    // Trạng thái

        worksheet.mergeCells('A1:J1');
        worksheet.getCell('A1').value = "DANH SÁCH THIẾT BỊ";
        worksheet.getCell("A1").font ={name: 'Arial', size: 10, bold: true };
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
  
        worksheet.mergeCells('A2:I2');
        worksheet.getCell('A2').value = "Người xuất báo cáo: "+req.user.usr;
        worksheet.getCell("A2").font ={name: 'Arial', size: 10, bold: false };
  
        worksheet.mergeCells('A3:I3');
        worksheet.getCell('A3').value = "Có "+ data.length +" thiết bị";
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
          worksheet.getCell('B4').value = "Mã thiết bị";
          worksheet.getCell('B4').font ={name: 'Arial', size: 10, bold: true };
          worksheet.getCell('B4').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

          worksheet.getCell('C4').fill = {
            type: "pattern",
            pattern: "solid",
            fgColor:{argb:'70CBFF'},
        }
          worksheet.getCell('C4').value = "Serial sensor";
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
          worksheet.getCell('E4').value = "Seri sim";
          worksheet.getCell('E4').font ={name: 'Arial', size: 10, bold: true };
          worksheet.getCell('E4').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

          worksheet.getCell('F4').fill = {
            type: "pattern",
            pattern: "solid",
            fgColor:{argb:'70CBFF'},
        }
          worksheet.getCell('F4').value = "Địa chỉ";
          worksheet.getCell('F4').font ={name: 'Arial', size: 10, bold: true };
          worksheet.getCell('F4').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

          worksheet.getCell('G4').fill = {
            type: "pattern",
            pattern: "solid",
            fgColor:{argb:'70CBFF'},
        }
          worksheet.getCell('G4').value = "Tần suất bản tin";
          worksheet.getCell('G4').font ={name: 'Arial', size: 10, bold: true };
          worksheet.getCell('G4').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

          worksheet.getCell('H4').fill = {
            type: "pattern",
            pattern: "solid",
            fgColor:{argb:'70CBFF'},
        }
          worksheet.getCell('H4').value = "Trạng thái";
          worksheet.getCell('H4').font ={name: 'Arial', size: 10, bold: true };
          worksheet.getCell('H4').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

          for(let i=0; i<data.length; i++){
            worksheet.getCell('A'+(5+i)).value =  " "+(i+1)+" ";
            worksheet.getCell('A'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };
            worksheet.getCell('B'+(5+i)).value =  show_if_null(data[i].meter_id);
            worksheet.getCell('B'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };
            worksheet.getCell('C'+(5+i)).value =  show_if_null(data[i].serial_sensor);
            worksheet.getCell('C'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };
            worksheet.getCell('D'+(5+i)).value =  show_if_null(data[i].name);
            worksheet.getCell('D'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

            worksheet.getCell('E'+(5+i)).value =  show_if_null(data[i].serial_sim);
            worksheet.getCell('E'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

            worksheet.getCell('F'+(5+i)).value =  show_if_null(data[i].address);
            worksheet.getCell('F'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

            worksheet.getCell('G'+(5+i)).value =  show_if_null(data[i].frequency);
            worksheet.getCell('G'+(5+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

            worksheet.getCell('H'+(5+i)).value =  return_inverter_status(data[i].status);
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
     })        
    })
}

// function addlog(to,from,name,para,usr,moment,eq,selectedEQ,url){
 
//   let timescale = from.toString() +","+to.toString();
//   console.log(to,from,name,para,usr,moment,eq,selectedEQ,timescale)
//   accessDB("INSERT INTO report_table (name,timeScale,moment,para,creatby,url,exportTime,eq,selecteq) VALUES (?,?,?,?,?,?,?,?,?)",[name, timescale,moment,para,usr,url,new Date(),eq,selectedEQ],function(result){
//     console.log(result);
//   })
// }


module.exports = export_meter_list;