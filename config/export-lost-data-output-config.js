var excel = require('exceljs');
var accessDB = require('./mysql-config');

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

  function removeAccents(str) {
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ", "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"    
    ];
    for (var i=0; i<AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
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

  function export_lost_data(req,res,group_id,from,to){
    console.log(group_id)
    accessDB("SELECT * FROM group_setting WHERE group_id = ?;",[group_id],async function(result){
        if(result.length > 0){
            let name = removeAccents(result[0].name)
            let name_file = "BAO_THAT_THOAT_"+name+"_"+return_date(from)+"_"+return_date(to);
            accessDB("SELECT * FROM data_lost_output WHERE group_id = ? AND meter_time > ? AND meter_time < ? ORDER BY meter_time DESC;",[group_id,from,to],async function(result2){
                let data = JSON.parse(JSON.stringify(result2));
                let sum_tong = 0;
                let sum_nhanh = 0;
                let loss = 0;
                for(let i=0; i<data.length; i++){
                    sum_tong += data[i].sum_tong;
                    sum_nhanh += data[i].sum_nhanh;
                    loss += ((fixed_data(data[i].sum_tong) >= fixed_data(data[i].sum_nhanh)) ? (fixed_data(data[i].sum_tong) - fixed_data(data[i].sum_nhanh)) : 0 )
                }
                // if(sum_nhanh < sum_tong) loss = sum_tong - sum_nhanh;
                let workbook = new excel.Workbook(); //creating workbook
                let worksheet = workbook.addWorksheet(name); //creating worksheet
                worksheet.getColumn('A').width = 6;
                worksheet.getColumn('B').width = 25;
                worksheet.getColumn('C').width = 20;
                worksheet.getColumn('D').width = 20;
                worksheet.getColumn('E').width = 20;
                worksheet.getColumn('F').width = 20;
                worksheet.getColumn('G').width = 20;


                worksheet.mergeCells('A1:G1');
                worksheet.getCell('A1').value = "BÁO CÁO THẤT THOÁT";
                worksheet.getCell("A1").font ={name: 'Arial', size: 10, bold: true };
                worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
          
                worksheet.mergeCells('A2:G2');
                worksheet.getCell('A2').value = "Tên nhóm: "+result[0].name;
                worksheet.getCell("A2").font ={name: 'Arial', size: 10, bold: false };
          
                worksheet.mergeCells('A3:G3');
                worksheet.getCell('A3').value = "Tổng sản lượng thất thoát: " + loss.toFixed(3) + " (m3)";
                worksheet.getCell("A3").font ={name: 'Arial', size: 10, bold: false };

                worksheet.mergeCells('A4:G4');
                worksheet.getCell('A4').value = "Tổng sản lượng thất thoát: " + loss.toFixed(3) + " (m3)";
                worksheet.getCell("A4").font ={name: 'Arial', size: 10, bold: false };
          
                worksheet.mergeCells('A5:G5');
                worksheet.getCell('A5').value = "Người xuất báo cáo: "+req.user.usr;
                worksheet.getCell("A5").font ={name: 'Arial', size: 10, bold: false };
          
                worksheet.mergeCells('A6:G6');
                worksheet.getCell('A6').value = "Có "+ data.length +" bản ghi từ "+ from +" đến "+ to;
                worksheet.getCell("A6").font ={name: 'Arial', size: 10, bold: false };
          
                worksheet.getCell('A7').fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor:{argb:'70CBFF'}
                }
                worksheet.getCell('A7').value = "STT";
                worksheet.getCell('A7').font ={name: 'Arial', size: 10, bold: true };
                worksheet.getCell('A7').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

                worksheet.getCell('B7').fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor:{argb:'70CBFF'}
                }
                worksheet.getCell('B7').value = "Thời gian";
                worksheet.getCell('B7').font ={name: 'Arial', size: 10, bold: true };
                worksheet.getCell('B7').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

                worksheet.getCell('C7').fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor:{argb:'70CBFF'}
                }
                worksheet.getCell('C7').value = "Sản lượng thiết bị tổng (m3)";
                worksheet.getCell('C7').font ={name: 'Arial', size: 10, bold: true };
                worksheet.getCell('C7').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

                worksheet.getCell('D7').fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor:{argb:'70CBFF'}
                }
                worksheet.getCell('D7').value = "Sản lượng thiết bị nhánh (m3)";
                worksheet.getCell('D7').font ={name: 'Arial', size: 10, bold: true };
                worksheet.getCell('D7').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

                worksheet.getCell('E7').fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor:{argb:'70CBFF'}
                }
                worksheet.getCell('E7').value = "Thất thoát (m3)";
                worksheet.getCell('E7').font ={name: 'Arial', size: 10, bold: true };
                worksheet.getCell('E7').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

                worksheet.getCell('F7').fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor:{argb:'70CBFF'}
                }
                worksheet.getCell('F7').value = "Thất thoát (%)";
                worksheet.getCell('F7').font ={name: 'Arial', size: 10, bold: true };
                worksheet.getCell('F7').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

                worksheet.getCell('G7').fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor:{argb:'70CBFF'}
                }
                worksheet.getCell('G7').value = "Chu kỳ kiểm tra thất thoát";
                worksheet.getCell('G7').font ={name: 'Arial', size: 10, bold: true };
                worksheet.getCell('G7').alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };

                for(let i=0; i<data.length; i++){
                    worksheet.getCell('A'+(8+i)).value =  " "+(i+1)+" ";
                    worksheet.getCell('A'+(8+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };
                    worksheet.getCell('B'+(8+i)).value =  return_local_date_string(new Date(data[i].meter_time));
                    worksheet.getCell('B'+(8+i)).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true };
                    worksheet.getCell('C'+(8+i)).value =  fixed_data(data[i].sum_tong);
                    worksheet.getCell('D'+(8+i)).value =  fixed_data(data[i].sum_nhanh);
                    worksheet.getCell('E'+(8+i)).value =  ((fixed_data(data[i].sum_tong) >= fixed_data(data[i].sum_nhanh)) ? (fixed_data(data[i].sum_tong) - fixed_data(data[i].sum_nhanh)) : 0 );
                    worksheet.getCell('F'+(8+i)).value =  fixed_data(data[i].percent);
                    worksheet.getCell('G'+(8+i)).value =  fixed_data(data[i].freq);

                    if(data[i].status == 1){
                        worksheet.getCell('A'+(8+i)).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor:{argb:'ff4d4d'},
                          }
                          worksheet.getCell('B'+(8+i)).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor:{argb:'ff4d4d'},
                          }
                          worksheet.getCell('C'+(8+i)).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor:{argb:'ff4d4d'},
                          }
                          worksheet.getCell('D'+(8+i)).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor:{argb:'ff4d4d'},
                          }
                          worksheet.getCell('E'+(8+i)).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor:{argb:'ff4d4d'},
                          }
                          worksheet.getCell('F'+(8+i)).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor:{argb:'ff4d4d'},
                          }
                          worksheet.getCell('G'+(8+i)).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor:{argb:'ff4d4d'},
                          }
                    }
                  }
                  for(let i=0; i<data.length+1;i++){
                    for(let j=1; j<=7; j++){
                      worksheet.getCell(numToLetter(j)+(7+i)).border ={
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
        }else{
            res.json({
                err_code: 1,
                message: "Nhóm tính thất thoát không tồn tại.",
                data: []
            })
            res.end()
        }
    })
  }

  module.exports = export_lost_data;