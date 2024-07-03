var mysql= require('mysql');
var con = mysql.createConnection({
  host: "115.146.123.242",
  user: "yolearn",
  password: "iTl123!$",
  database: "yolearn"
});
var con1 = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: '',
  database: 'saoviet'

});
var id1 = 0;
// Tạo clone bảng data loran về localhost và cập nhật liên tục
function updateDataRaw(){
let sql = 'SELECT * FROM lorawan WHERE id > ' + id1 ;
con.query(sql, function(err, result){
  if(result.length != 0){
    if(err) throw err;
    id1 = result[result.length-1].id;
    for(let i=0; i<result.length; i++){
        var x= JSON.stringify(result[i].data);
        var y=JSON.stringify(result[i].datetime);
        var sql1 = "INSERT INTO dataraw (data, date) VALUES ("+ x +","+ y +")";
        con1.query(sql1, function(err, result){
            if(err) {
                throw err
            };
        });
    }
  }
});
};
var updateTime = 1000 * 60 * 3;
updateDataRaw();
setInterval(function(){
  updateDataRaw();
  console.log("update.....");
}, updateTime);