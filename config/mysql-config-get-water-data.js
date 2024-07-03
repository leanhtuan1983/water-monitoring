const { query } = require('express');
const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host: "115.146.123.242",
    user: "yolearn",
    password: "iTl123!$",
    database: 'lorawan'
})

 function accessDB(query,val,callback){
     pool.getConnection(function(err, con){
        if(err){
            console.log(err);
            //con.release();
        }else{
            try{
                con.query(query,val,function(err2,result){
                    if(!err2){
                        callback(result);
                    }
                    con.release();
                })
            }catch(err2){
                console.log(err2);
                con.release();
            }
        }
    })
}
module.exports = accessDB;