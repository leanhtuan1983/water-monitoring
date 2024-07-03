let get_image = require("./get_image_for_excel_export")
const fix = 3;
var excel = require('exceljs');
var accessDB = require('./mysql-config');

function return_inverter_status(x){
    if(x === "" || x === null) return "";
    if(x == 1 || x == "1"){return "Kết nối"}
    else if( x==0 || x=="0"){return "Không kết nối"}
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

// function fixed_data(x){
//   if(x == 0){
//     return numberWithCommas((0).toFixed(1));
//   }
//   if(x =="" || x == null){
//     return "-";
//   }

//  if(!isNaN(Number(x))){
//     return numberWithCommas(lamtron(Number(x)));
//   }else if(x =="" || x == null){
//     return "";
//   }else{
//     return Number(x);
//   }
// }

function fixed_data(x){
  if(x ==="" || x === null){
    return "-";
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

function exportData(req,res,from,to,info,meter_id,serial_sensor_1){

    let id = meter_id;
    let serial_sensor = serial_sensor_1;
    let name_file = "CHI_SO_TUNG_THOI_DIEM"+id+"_"+serial_sensor+"_"+return_date(from)+"_"+return_date(to);
    accessDB("SELECT DISTINCT * FROM wmeterdata WHERE ID = ? AND serial_sensor = ? AND meterTime < ? AND meterTime > ? ORDER BY meterTime DESC;",[id,serial_sensor,to,from],async function(result){
      
      let data = JSON.parse(JSON.stringify(result));
      let workbook = new excel.Workbook(); //creating workbook
      let worksheet = workbook.addWorksheet(id); //creating worksheet
      worksheet.getColumn('A').width = 6;
      worksheet.getColumn('B').width = 25;
      worksheet.getColumn('C').width = 20;
      worksheet.getColumn('D').width = 20;
      worksheet.getColumn('E').width = 20;
      worksheet.getColumn('F').width = 20;
      worksheet.getColumn('G').width = 20;
      worksheet.getColumn('H').width = 20;
      worksheet.getColumn('I').width = 20;

      worksheet.getRow(7).height = 1;
      worksheet.getRow(8).height = 300;
      worksheet.getRow(9).height = 300;

      worksheet.mergeCells('A1:J1');
      worksheet.getCell('A1').value = "CHỈ SỐ TỪNG THỜI ĐIỂM";
      worksheet.getCell("A1").font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.mergeCells('A2:J2');
      worksheet.getCell('A2').value = "Mã thiết bị: "+info.meter_id;
      worksheet.getCell("A2").font ={name: 'Arial', size: 10, bold: false };

      worksheet.mergeCells('A3:J3');
      worksheet.getCell('A3').value = "Tên thiết bị: "+info.name;
      worksheet.getCell("A3").font ={name: 'Arial', size: 10, bold: false };

      worksheet.mergeCells('A4:J4');
      worksheet.getCell('A4').value = "Trạng thái: "+return_inverter_status(info.status);
      worksheet.getCell("A4").font ={name: 'Arial', size: 10, bold: false };

      worksheet.mergeCells('A5:J5');
      worksheet.getCell('A5').value = "Người xuất báo cáo: "+req.user.usr;
      worksheet.getCell("A5").font ={name: 'Arial', size: 10, bold: false };

      worksheet.mergeCells('A6:J6');
      worksheet.getCell('A6').value = "Có "+ data.length +" bản ghi từ "+ from +" đến "+ to;
      worksheet.getCell("A6").font ={name: 'Arial', size: 10, bold: false };







      worksheet.getCell('A10').fill = {
        type: "pattern",
        pattern: "solid",
        fgColor:{argb:'70CBFF'},
    }
      worksheet.getCell('A10').value = "STT";
      worksheet.getCell('A10').font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('A10').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

      worksheet.getCell('B10').fill = {
        type: "pattern",
        pattern: "solid",
        fgColor:{argb:'70CBFF'},
    }
      worksheet.getCell('B10').value = "Thời gian";
      worksheet.getCell('B10').font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('B10').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

      worksheet.getCell('C10').fill = {
        type: "pattern",
        pattern: "solid",
        fgColor:{argb:'70CBFF'},
    }
      worksheet.getCell('C10').value = "Chỉ số hiện tại";
      worksheet.getCell('C10').font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('C10').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

      worksheet.getCell('D10').fill = {
        type: "pattern",
        pattern: "solid",
        fgColor:{argb:'70CBFF'},
    }
      worksheet.getCell('D10').value = "Áp suất (Pa)";
      worksheet.getCell('D10').font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('D10').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

      worksheet.getCell('E10').fill = {
        type: "pattern",
        pattern: "solid",
        fgColor:{argb:'70CBFF'},
    }
      worksheet.getCell('E10').value = "Lưu lượng (m3/h)";
      worksheet.getCell('E10').font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('E10').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

      worksheet.getCell('F10').fill = {
        type: "pattern",
        pattern: "solid",
        fgColor:{argb:'70CBFF'},
    }
      worksheet.getCell('F10').value = "Mực nước (m)";
      worksheet.getCell('F10').font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('F10').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

      worksheet.getCell('G10').fill = {
        type: "pattern",
        pattern: "solid",
        fgColor:{argb:'70CBFF'},
    }
      worksheet.getCell('G10').value = "Sản lượng (m3)";
      worksheet.getCell('G10').font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('G10').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

      worksheet.getCell('H10').fill = {
        type: "pattern",
        pattern: "solid",
        fgColor:{argb:'70CBFF'},
    }
      worksheet.getCell('H10').value = "Điện áp pin (V)";
      worksheet.getCell('H10').font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('H10').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

      worksheet.getCell('I10').fill = {
        type: "pattern",
        pattern: "solid",
        fgColor:{argb:'70CBFF'},
    }
      worksheet.getCell('I10').value = "Điện áp ác quy (V)";
      worksheet.getCell('I10').font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('I10').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

      for(let i=0; i<data.length; i++){
        worksheet.getCell('A'+(11+i)).value =  " "+(i+1)+" ";
        worksheet.getCell('A'+(11+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

        worksheet.getCell('B'+(11+i)).value =  return_local_date_string(new Date(data[i].meterTime));
        worksheet.getCell('B'+(11+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };
        worksheet.getCell('C'+(11+i)).value =  fixed_data(data[i].ValOfNum);
        worksheet.getCell('D'+(11+i)).value =  fixed_data(data[i].pressure);
        worksheet.getCell('E'+(11+i)).value =  fixed_data(data[i].flowRate);
        worksheet.getCell('F'+(11+i)).value =  fixed_data(data[i].measure_sensor);
        worksheet.getCell('G'+(11+i)).value =  fixed_data(data[i].terminal_index);
        worksheet.getCell('H'+(11+i)).value =  fixed_data(data[i].Voltage);
        worksheet.getCell('I'+(11+i)).value =  fixed_data(data[i].voltage_ac_quy);
      }

      for(let i=0; i<data.length+1;i++){
        for(let j=1; j<=9; j++){
          worksheet.getCell(numToLetter(j)+(10+i)).border ={
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
          }
        }
      }

      let myBase64Image_pressure = await get_image(data, "pressure");
      let myBase64Image_flow_rate = await get_image(data, "flow_rate");

      const image_pressure = workbook.addImage({
          base64: myBase64Image_pressure,
          extension: 'png',
      });
      const image_flow_rate = workbook.addImage({
        base64: myBase64Image_flow_rate,
        extension: 'png',
      });
      worksheet.addImage(image_pressure, 'A8:I8');
      worksheet.addImage(image_flow_rate, 'A9:I9');
            
      res.setHeader('Content-Disposition', 'attachment; filename=' +name_file+ ".xlsx");
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      await workbook.xlsx.write(res);
      res.end();
        
    })
}

// function addlog(to,from,name,para,usr,moment,eq,selectedEQ,url){
 
//   let timescale = from.toString() +","+to.toString();
//   console.log(to,from,name,para,usr,moment,eq,selectedEQ,timescale)
//   accessDB("INSERT INTO report_table (name,timeScale,moment,para,creatby,url,exportTime,eq,selecteq) VALUES (?,?,?,?,?,?,?,?,?)",[name, timescale,moment,para,usr,url,new Date(),eq,selectedEQ],function(result){
//     console.log(result);
//   })
// }


module.exports = exportData;