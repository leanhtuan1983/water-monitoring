var excel = require('exceljs');
var accessDB = require('./mysql-config');

function exportEQ(res,req){
    let sql,sheet;
        sql = 'SELECT * FROM totaleq;'
    accessDB(sql,[],async function(result){
      // console.log(result);
        if(result.length > 0){
            const jsonData = JSON.parse(JSON.stringify(result));

            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet(sheet); //creating worksheet
            worksheet.columns = [
              {header: "ID", key: "id",width:30},
              {header: "NOW", key: "now",width:30},
              {header: "PREV", key: "prev",width:30},
              {header: "NAME", key: "name",width:30},
              {header: "SITE", key: "site",width:30},
              {header: "LAST DATA DATE" , key: "LDD",width:30},
              {header: "GATE TYPE", key: "gatetype",width:30},
              {header: "SOURCE TYPE", key: "sourcetype",width:30},
              {header: "LAST CHECKED", key: "lastchecked",width:30},
              {header: "TAG", key: "tag",width:30},
            ];
            worksheet.addRows(jsonData);
            res.setHeader('Content-Disposition', 'attachment; filename=' + "equipment_list.xlsx");
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            await workbook.xlsx.write(res);
            res.end();
        }
    })
}
module.exports = exportEQ;