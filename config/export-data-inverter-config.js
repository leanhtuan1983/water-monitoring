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

function fixed_data(x){
  if(x == 0){
    return numberWithCommas((0).toFixed(1));
  }
  if(x =="" || x == null){
    return "-";
  }

 if(!isNaN(Number(x))){
    return numberWithCommas(lamtron(Number(x)));
  }else if(x =="" || x == null){
    return "";
  }else{
    return Number(x);
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

function exportData(req,res,from,to,info){

    let id = req.session.ideq;
    let serial_sensor = req.session.serial_sensor;
    let name_file = "CHI_SO_VAN_HANH_"+id+"_"+serial_sensor+"_"+return_date(from)+"_"+return_date(to);
    accessDB("SELECT DISTINCT * FROM wmeterdata WHERE ID = ? AND serial_sensor = ? AND message_type = ? AND meterTime < ? AND meterTime > ? ORDER BY meterTime DESC;",[id,serial_sensor,"Opera",to,from],async function(result){
      let data = JSON.parse(JSON.stringify(result));
      // console.log(data)
      let workbook = new excel.Workbook(); //creating workbook
      let worksheet = workbook.addWorksheet(id); //creating worksheet
      worksheet.getColumn('A').width = 6;
      worksheet.getColumn('B').width = 25;
      worksheet.getColumn('C').width = 20;
      worksheet.getColumn('D').width = 20;
      worksheet.getColumn('E').width = 20;
      worksheet.getColumn('F').width = 20;
      worksheet.getColumn('G').width = 20;

      worksheet.mergeCells('A1:G1');
      worksheet.getCell('A1').value = "Cộng hòa xã hội chủ nghĩa Việt Nam";
      worksheet.getCell("A1").font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };  

      worksheet.mergeCells('A2:G2');
      worksheet.getCell('A2').value = "Độc lập - Tự do - Hạnh phúc";
      worksheet.getCell("A2").font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.mergeCells('A3:G3');
      worksheet.getCell('A3').value = "----------------------------------------------------------";
      worksheet.getCell("A3").font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.mergeCells('A4:G4');
      worksheet.getCell('A4').value = "CHỈ VẬN HÀNH";
      worksheet.getCell("A4").font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('A4').alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.mergeCells('A5:G5');
      worksheet.getCell('A5').value = "Mã thiết bị: "+info.id;
      worksheet.getCell("A5").font ={name: 'Arial', size: 10, bold: false };

      worksheet.mergeCells('A6:G6');
      worksheet.getCell('A6').value = "Tên thiết bị: "+info.name;
      worksheet.getCell("A6").font ={name: 'Arial', size: 10, bold: false };

      worksheet.mergeCells('A7:G7');
      worksheet.getCell('A7').value = "Mã thiết bị biến tần: "+info.inverter_code;
      worksheet.getCell("A7").font ={name: 'Arial', size: 10, bold: false };

      worksheet.mergeCells('A8:G8');
      worksheet.getCell('A8').value = "Người xuất báo cáo: "+req.user.usr;
      worksheet.getCell("A8").font ={name: 'Arial', size: 10, bold: false };

      worksheet.mergeCells('A9:G9');
      worksheet.getCell('A9').value = "Có "+ data.length +" bản ghi từ "+ from +" đến "+ to;
      worksheet.getCell("A9").font ={name: 'Arial', size: 10, bold: false };

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
      worksheet.getCell('C10').value = "Áp suất (bar)";
      worksheet.getCell('C10').font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('C10').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

      worksheet.getCell('D10').fill = {
        type: "pattern",
        pattern: "solid",
        fgColor:{argb:'70CBFF'},
    }
      worksheet.getCell('D10').value = "Tần số hiện tại (Hz)";
      worksheet.getCell('D10').font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('D10').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

      worksheet.getCell('E10').fill = {
        type: "pattern",
        pattern: "solid",
        fgColor:{argb:'70CBFF'},
    }
      worksheet.getCell('E10').value = "Giao tiếp biến tần";
      worksheet.getCell('E10').font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('E10').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

      worksheet.getCell('F10').fill = {
        type: "pattern",
        pattern: "solid",
        fgColor:{argb:'70CBFF'},
    }
      worksheet.getCell('F10').value = "Điện áp pin (V)";
      worksheet.getCell('F10').font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('F10').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

      worksheet.getCell('G10').fill = {
        type: "pattern",
        pattern: "solid",
        fgColor:{argb:'70CBFF'},
    }
      worksheet.getCell('G10').value = "Điện áp ác quy (V)";
      worksheet.getCell('G10').font ={name: 'Arial', size: 10, bold: true };
      worksheet.getCell('G10').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

      for(let i=0; i<data.length; i++){
        worksheet.getCell('A'+(11+i)).value =  " "+(i+1)+" ";
        worksheet.getCell('A'+(11+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

        worksheet.getCell('B'+(11+i)).value =  return_local_date_string(new Date(data[i].meterTime));
        worksheet.getCell('B'+(11+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };
        worksheet.getCell('C'+(11+i)).value =  fixed_data(data[i].pressure);
        worksheet.getCell('D'+(11+i)).value =  fixed_data(data[i].feedback_hz);
        worksheet.getCell('E'+(11+i)).value =  return_inverter_status(data[i].mode);
        worksheet.getCell('F'+(11+i)).value =  fixed_data(data[i].Voltage);
        worksheet.getCell('G'+(11+i)).value =  fixed_data(data[i].voltage_ac_quy);
      }

      for(let i=0; i<data.length+1;i++){
        for(let j=1; j<=7; j++){
          worksheet.getCell(numToLetter(j)+(10+i)).border ={
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
}

// function addlog(to,from,name,para,usr,moment,eq,selectedEQ,url){
 
//   let timescale = from.toString() +","+to.toString();
//   console.log(to,from,name,para,usr,moment,eq,selectedEQ,timescale)
//   accessDB("INSERT INTO report_table (name,timeScale,moment,para,creatby,url,exportTime,eq,selecteq) VALUES (?,?,?,?,?,?,?,?,?)",[name, timescale,moment,para,usr,url,new Date(),eq,selectedEQ],function(result){
//     console.log(result);
//   })
// }


module.exports = exportData;