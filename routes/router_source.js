const { json } = require('body-parser');
var express = require('express');
var router = express.Router();
var accessDB = require('../config/mysql-config');
var exportData = require("../config/export-data-config");
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


// lấy danh sách thiết bị
// router.get("/get/EQ", function(req,res){
//     if (req.isAuthenticated()){
//       var group = req.query.group
//       var usr = req.user.usr;
//       var role = req.user.role;
//       var sql;
//       var id = req.user.id;
//           let a;
//           if(group == "all"){
//             if(role == "admin"){
//               a = [];
//               // sql = "SELECT *, totaleq.id AS ideq FROM totaleq INNER JOIN group_eq ON totaleq.group_id = group_eq.id"
//               sql = "SELECT *, totaleq.id AS ideq FROM totaleq ORDER BY last_data_time DESC; "
//             }else{
//               a = [id];
//               // sql = "SELECT *, totaleq.id AS ideq  FROM totaleq INNER JOIN group_user ON totaleq.id = group_user.ideq INNER JOIN group_eq ON totaleq.group_id = group_eq.id WHERE group_user.user_id = ?";
//               sql = "SELECT *, totaleq.id AS ideq  FROM totaleq INNER JOIN group_user ON totaleq.id = group_user.ideq WHERE group_user.user_id = ? ORDER BY last_data_time DESC; ";

//             }
//           }else{
//             if(role == "admin"){
//               a = [group];
//               sql = "SELECT *, totaleq.id AS ideq FROM totaleq INNER JOIN eq_group_relative ON totaleq.id = eq_group_relative.ideq INNER JOIN group_eq ON eq_group_relative.group_id = group_eq.id  WHERE group_eq.id = ? ORDER BY last_data_time DESC;"
//             }else{
//               a = [id,group];
//               sql = "SELECT *, totaleq.id AS ideq  FROM totaleq INNER JOIN eq_group_relative ON totaleq.id = eq_group_relative.ideq INNER JOIN group_eq ON eq_group_relative.group_id = group_eq.id INNER JOIN group_user ON totaleq.id = group_user.ideq WHERE group_user.user_id = ? AND group_eq.group_id = ? ORDER BY last_data_time DESC; ";
//             }
//           }


//           accessDB(sql,a,function(result){
//             if(result.length>0){
//               res.send(JSON.stringify(result))
//             }else{
//               res.send("")
//             }
//             res.end();
//           })
      
//     }else{
//       res.redirect('/login');
//       res.end();
//     }
//   })

// router.get("/test",function(req,res){
//   accessDB("SELECT * FROM totaleq",[],function(result){
//     for(let i=0; i<result.length; i++){
//       accessDB("SELECT * FROM wmeterdata WHERE id = ? ORDER BY idkey DESC LIMIT 1",[result[i].id],function(result1){
//         if(result1.length > 0){
//           let data = result1[0];
//           accessDB("UPDATE totaleq SET last_pressure=?, last_voltage_pin=?, last_ValOfNum=?, last_data_time=? WHERE id = ?",[data.pressure, data.Voltage, data.ValOfNum, data.TIME,result[i].id],function(result3){})

//         }
//       })
//     }
//   })
// })



  //lấy giá trị tức thời
  // router.get("/get/instant_value",function(req,res){
  //     let id = req.query.id;
  //     let serial_sensor = req.query.serial_sensor;
  //     req.session.ideq = id;
  //     req.session.serial_sensor = serial_sensor;
  //     console.log(serial_sensor)
  //       accessDB("SELECT * FROM totaleq WHERE id = ? AND serial_sensor = ?",[id,serial_sensor],function(result1){
  //           if(result1.length > 0){
  //               accessDB("SELECT * FROM wmeterdata WHERE ID = ? AND serial_sensor = ? ORDER BY meterTime DESC LIMIT 2",[id, serial_sensor], function(result){
  //                   if(result.length > 0){
  //                       res.send(JSON.stringify({"data":result, "info":result1}))
  //                       res.end();
  //                   }else{
  //                       res.end();
  //                   }          
  //               })
  //           }else{
  //               res.end();
  //           }
  //       })
  // })


// lấy chỉ số từng thời điểm
// function fixNum(num){
//   if(Number.isNaN(Number(num)) || num == null){
//     return null;
//   }else{
//     return +Number(num).toFixed(3)
//   }
// }

// function configDataWmeter(arrData){
//     let data=[];
//     for(let i=0; i<arrData.length; i++){
//       // let flr = (arrData[i].ValOfNum - arrData[i-1].ValOfNum)*3600*1000/(Number(arrData[i].TIME)-Number(arrData[i-1].TIME));
//       let x = {
//         ValOfNum: arrData[i].ValOfNum,
//         pressure: fixNum(arrData[i].pressure),
//         quanity: arrData[i].terminal_index,
//         flowRate: fixNum(arrData[i].flowRate),
//         TIME: Number(arrData[i].TIME),
//         Voltage: arrData[i].Voltage,
//         meterTime: arrData[i].meterTime,
//         voltage_ac_quy: arrData[i].voltage_ac_quy,
//         measure_sensor: fixNum(arrData[i].measure_sensor),
//         measure_cacul: fixNum(arrData[i].measure_cacul),
//         terminal_index: arrData[i].terminal_index,
//       };
//       data.push(x);
    
//     }
//     return data;
//   }

  
  // router.get("/get/dataEQ",function(req,res){
  //     let id =req.query.id;
  //     let moment = req.query.moment;
  //     let from = returnSQLDateFormat(req.query.fr);
  //     let to = returnSQLDateFormat(req.query.to);
  //     let serial_sensor = req.session.serial_sensor;
  //     let data;
  //     let sql;
  //     switch(moment){
  //       case "raw": sql = "SELECT DISTINCT * FROM wmeterdata WHERE ID = ? AND serial_sensor = ? AND meterTime > ? AND meterTime < ? ORDER BY meterTime"; break;
  //      case "30minute": sql = "call groupbytime_wmeter(1*30, ?, ?, ?, ?)"; break; 
  //       case "hour": sql = "call groupbytime_wmeter(1*60, ?, ?, ?, ?)"; break; 
  //       case "day": sql = "call groupbytime_wmeter(1*60*24, ?, ?, ?, ?)"; break;
  //       case "week": sql = "call groupbytime_wmeter(24*60*7,?,?,?,?) "; break; 
  //       case "month": sql = "call groupbytime_wmeter(24*60*30,?,?,?,?)"; break; 
  //       case "year": sql = "call groupbytime_wmeter(24*60*365,?,?,?,?)"; break;
  //     }
  //     accessDB(sql, [id, serial_sensor, from, to], function(result){
  //         if(result.length > 0){
  //           switch(moment){
  //               case "raw": data=configDataWmeter(result); break;
  //              case "30minute": data=configDataWmeter(result[0]); break;
  //               case "hour":  data=configDataWmeter(result[0]); break;
  //               case "day": data=configDataWmeter(result[0]);break;
  //               case "week": data=configDataWmeter(result[0]); break;
  //               case "month": data=configDataWmeter(result[0]); break; 
  //               case "year": data=configDataWmeter(result[0]); break;
  //             }
  //             res.send(JSON.stringify(data));
  //             res.end()
  //         }else{
  //             res.end();
  //         }
  //     })
  // })


  // router.get("/get/exportdata",function(req,res){
  //   let usr_id = req.user.id;
  //   let moment = req.query.moment;
  //   let id = req.query.id;
  //   let from = req.query.fr;
  //   let to = req.query.to;
  //   accessDB("SELECT *, totaleq.id AS ideq FROM totaleq WHERE totaleq.id = ?",[id],function(result){
  //       if(result.length > 0){
  //           let info = result[0];
  //           let status;
  //           if(info.status == "1") status = "ON"
  //           else status = "OFF"
  //           exportData(id,from,to,moment,usr_id,res,req,info.name, info.frequency, info, info.address, status);
  //       }else{
  //           res.end();
  //       }
  //   })
  // })


  // router.get("/get/data_chart",function(req,res){
  //   let id = req.query.id;
  //   let usr = req.user.usr;
  //   let serial_sensor = req.session.serial_sensor;
  //   let from = returnSQLDateFormat(req.query.fr)
  //   let to = returnSQLDateFormat(req.query.to)
  //   let moment = req.query.moment;
  //   let sql;
  //   var data = {
  //     "data": null,
  //     "config": null
  //   };
  //     switch(moment){
  //       case "raw": sql = "SELECT DISTINCT * FROM wmeterdata WHERE ID = ? AND serial_sensor = ? AND meterTime > ? AND meterTime < ? ORDER BY meterTime"; break;
  //      case "30minute": sql = "call groupbytime_wmeter(1*30,?,?, ?, ?)"; break; 
  //       case "hour": sql = "call groupbytime_wmeter(1*60,?,?, ?, ?)"; break; 
  //       case "day": sql = "call groupbytime_wmeter(1*60*24,?,?, ?, ?)"; break;
  //       case "week": sql = "call groupbytime_wmeter(24*60*7,?,?,?,?) "; break; 
  //       case "month": sql = "call groupbytime_wmeter(24*60*30,?,?,?,?)"; break; 
  //       case "year": sql = "call groupbytime_wmeter(24*60*365,?,?,?,?)"; break;
  //     }
  //     accessDB(sql, [id,serial_sensor, from, to], function(result){
  //       if(result.length < 1){
  //         data["data"] = [];
  //       }else{
  //         switch(moment){
  //           case "raw": data["data"]=configDataWmeter(result); break;
  //          case "30minute": data["data"]=configDataWmeter(result[0]); break;
  //           case "hour":  data["data"]=configDataWmeter(result[0]); break;
  //           case "day": data["data"]=configDataWmeter(result[0]); break;
  //           case "week": data["data"]=configDataWmeter(result[0]); break;
  //           case "month": data["data"]=configDataWmeter(result[0]); break; 
  //           case "year": data["data"]=configDataWmeter(result[0]); break;
  //         }
  //       }
  //         accessDB("SELECT * FROM config WHERE ideq = ? AND username = ? ", [id, usr], function(row){
  //           if(row.length < 1){
  //             let config3 = {pressure:0, quanity:0, flowRate:0,Voltage:0}
  //             let config4 = {"pressure":"#c74e4e","quanity":"#325431","flowRate":"#000cff","Voltage":"#7bad9c"}
  //             accessDB("INSERT INTO config (ideq,username,config,color_config) VALUES (?,?,?,?)",[id,usr,JSON.stringify(config3),JSON.stringify(config4)],function(result){
  //               let x={
  //                 ideq: id,
  //                 username: usr,
  //                 config: JSON.stringify(config3),
  //                 color_config: JSON.stringify(config4)
  //               }
               
  //               data["config"] = x;
  //               res.send(JSON.stringify(data));
  //               res.end();
  //             })
  //           }else{
  //           data["config"] = row[0] ;
  //           res.send(JSON.stringify(data));
  //           res.end();
  //           }
  //         })
  //     })
  // })

  // router.post("/post/config", function(req, res, next){
  //   let id = req.body.id;
  //   let usr = req.user.usr;
  //   let cf = JSON.stringify(req.body.config);
  //   let cl_cf = JSON.stringify(req.body.color_config);
  //   accessDB("UPDATE config SET config=?,color_config=? WHERE ideq = ? AND username = ?", [cf,cl_cf,id,usr], function(result){
  //     res.send(translate_source(req,"save config success!"));
  //     res.end();
  //   })
  // })



//   var pad = function(num) { return ('00'+num).slice(-2) };
// function returnSQLDateFormat(dateObj){
//   let date = new Date(Number(dateObj));
//   let x = date.getFullYear()         + '-' +
//   pad(date.getMonth() + 1)  + '-' +
//   pad(date.getDate())       + ' ' +
//   pad(date.getHours())      + ':' +
//   pad(date.getMinutes())    + ':' +
//   pad(date.getSeconds());
//   return x;
// }

// function changeARRSQLIN(arrStr){
//   let arrchange = [];
//   let arr = arrStr.split(",");
//   for(let i = 0; i<arr.length; i++){
//     let a = "'"+arr[i]+"'";
//     arrchange.push(a);
//   }
//   return arrchange.join();
// }

// router.get("/get/alert",function(req,res){
//   let id = req.session.ideq;
//   let from = returnSQLDateFormat(req.query.fr);
//   let to = returnSQLDateFormat(req.query.to);
//   accessDB("SELECT * FROM alert_data WHERE ideq = ? AND alert_time > ? AND alert_time < ?",[id,from,to], function(result){
//     if(result.length>0)
//       res.send(JSON.stringify(result));
//       res.end();
//   })
// })


// router.get("/get/info",function(req,res){
//   let id = req.query.id;
//   let serial_sensor = req.session.serial_sensor;
//   accessDB("SELECT * FROM totaleq WHERE id = ? AND serial_sensor = ?;",[id, serial_sensor],function(result){
//     if(result.length > 0){
//       accessDB("SELECT group_id FROM eq_group_relative WHERE ideq = ?",[id],function(result2){
//         let x = [];
//         for(let i=0; i<result2.length; i++){
//           x.push(result2[i].group_id);
//         }
//         result[0].group_id = x.join();
//         res.send(JSON.stringify(result[0]));
//         res.end();
//       })
//     }else{
//       res.end();
//     }
   
//   })
// })

// router.get("/get/group_eq",function(req,res){
//   accessDB("SELECT * FROM group_eq",[],function(result){
//     if(result.length > 0){
//       res.send(JSON.stringify(result));
//     }
//     res.end()
//   })
// })

// function translate_source(req,str){
//   if(req.cookies.lang){
//     if(req.cookies.lang == "vi"){
//       switch(str){
//         case "save config success!":
//         return "Lưu cấu hình thành công";
//         case "Save success!":
//         return "Lưu thành công";
//         case "no data":
//           return "không có dữ liệu";
//         case "Add new meter successfuly":
//           return "Thêm thiết bị mới thành công";
//         case "Meter has already exist":
//           return "Thiết bị đã tồn tại";
//         case "Delete meter and data successfully":
//           return "Xóa thiết bị và dữ liệu thành công";
//         case "Device has data. Want to delete ?":
//           return "Thiết bị có dữ liệu. Xác nhận xóa thiết bị ?"
//       }
//     }else{
//       return str;
//     }
//   }else{
//     return str;
//   }
// }

// function date_format(x){
//   if(x == "") return null;
//   return x;
// }

// router.post("/post/edit_info",function(req,res){
//   let id = req.session.ideq;
//   let serial_sensor = req.session.serial_sensor;
//   let data = req.body;
//   let group = data.group_id;
//   let val = [];
//   for(let i=0; i<group.length; i++){
//     if(group[i] != "" && group[i] != ""){
//       val.push([group[i],id]);
//     } 
//   }
//   let sql = "UPDATE totaleq SET name=?, location_lat=?, location_long=?, address=?, phone_alert=?, install_date=?, inspection_date=?, loger_install_date=?, total_branch_setting=? WHERE id = ? AND serial_sensor = ?;"
//   accessDB(sql,[data.name, data.location_lat, data.location_long, data.address, data.phone_alert, date_format(data.install_date), date_format(data.inspection_date), date_format(data.loger_install_date), data.total_branch_setting, id, serial_sensor],function(result){
//     accessDB("DELETE FROM eq_group_relative WHERE ideq = ?;",[id],function(result2){
//       if(val.length > 0){
//         accessDB("INSERT INTO eq_group_relative (group_id, ideq) VALUES ?",[val],function(result3){
//           res.send(translate_source(req,"Save success!"));
//           res.end();
//         })
//       }else{
//         res.send(translate_source(req,"Save success!"));
//         res.end();
//       }

//     })
//   })
// })

// router.post("/post/edit_setting",function(req,res){
//   let id = req.session.ideq;
//   let serial_sensor = req.session.serial_sensor
//   let data = req.body;
//   console.log(req.body);
//   if(data.threshold_pin == null){
//     accessDB("DELETE FROM alert_config WHERE ideq = ? AND config_type = ?",[id,"PIN"],function(result){})
//   }else{
//     accessDB("SELECT * FROM alert_config WHERE ideq = ? AND config_type = ?",[id,"PIN"],function(result){
//       if(result.length > 0){
//         accessDB("UPDATE alert_config SET min_value = ? WHERE ideq = ? AND config_type = ?",[data.threshold_pin,id,"PIN"],function(result1){})
//       }else{
//         accessDB("INSERT INTO alert_config (min_value,updated_by,updated_at,ideq,config_type,serial_sensor) VALUES (?,?,?,?,?,?) ;",[data.threshold_pin, req.user.usr,new Date(),id,"PIN",req.session.serial_sensor],function(result1){})
//       }
//     })
//   }
//   if(data.threshold_battery == null){
//     accessDB("DELETE FROM alert_config WHERE ideq = ? AND config_type = ?",[id,"ACQUY"],function(result){})
//   }else{
//     accessDB("SELECT * FROM alert_config WHERE ideq = ? AND config_type = ?",[id,"ACQUY"],function(result){
//       if(result.length > 0){
//         accessDB("UPDATE alert_config SET min_value = ? WHERE ideq = ? AND config_type = ?",[data.threshold_battery,id,"ACQUY"],function(result1){})
//       }else{
//         accessDB("INSERT INTO alert_config (min_value,updated_by,updated_at,ideq,config_type,serial_sensor) VALUES (?,?,?,?,?,?) ;",[data.threshold_battery, req.user.usr,new Date(),id,"ACQUY",req.session.serial_sensor],function(result1){})
//       }
//     })
//   }
//   let sql = "UPDATE totaleq SET multiplier=?, first_index=? WHERE id = ? AND serial_sensor = ?;"
//   accessDB(sql,[data.multiplier, data.first_index, id, serial_sensor],function(result){
//     res.send(translate_source(req,"Save success!"));
//     res.end();
//   })
// })

// router.get("/get/quanity_alert_config",function(req,res){
//   let id = req.session.ideq;
//   accessDB("SELECT * FROM alert_config WHERE ideq = ? AND config_type = ?",[id, "SL"],function(result){
//     if(result.length > 0){
//       res.send(JSON.stringify(result[0]));
//     }
//     res.end();
//   })
// })

// router.post("/post/save_alert_setting",function(req,res){
//   let id = req.session.ideq;
//   let data = req.body;
//   console.log(data);
//   if(data.estimate_quanity == null){
//     accessDB("DELETE FROM alert_config WHERE ideq = ? AND config_type = ?",[id,"SL"],function(result){
//       res.send(translate_source(req,"Save success!"));
//       res.end();
//       return true;
//     })
//   }else{
//     accessDB("SELECT * FROM alert_config WHERE ideq = ? AND config_type = ?;",[id,"SL"],function(result){
//       if(result.length > 0){
//         let sql = "UPDATE alert_config SET start_time=?, end_time=?, min_value=?, updated_by=?, updated_at=?, day_of_week=?, `repeat_alert`=? WHERE ideq = ? AND config_type = ?";
//         accessDB(sql,[data.start_time, data.end_time, Number(data.estimate_quanity), req.user.usr, new Date(), data.day_of_week, Number(data.repeat_alert), id, "SL"],function(result1){
//           res.send(translate_source(req,"Save success!"));
//           res.end();
//           return true;
//         })
//       }else{
//         let sql2 = "INSERT INTO alert_config (start_time,end_time,min_value,updated_by,updated_at,ideq,config_type,day_of_week,serial_sensor,`repeat_alert`) VALUES (?,?,?,?,?,?,?,?,?,?)";
//         accessDB(sql2,[data.start_time,data.end_time,Number(data.estimate_quanity),req.user.usr,new Date(),id,"SL",data.day_of_week,req.session.serial_sensor,Number(data.repeat_alert)],function(result1){
//           res.send(translate_source(req,"Save success!"));
//           res.end();
//           return true;
//         })
//       }
//     })
//   }
// })

// router.get("/get/checkAdmin",function(req,res){
//   let data = {
//     role: req.user.role,
//     lang: "vi"
//   }
//   if(req.cookies.lang){
//     data.lang = req.cookies.lang;
//   }
//   res.send(JSON.stringify(data));
//   res.end();
// })

// router.get("/get/lang",function(req,res){
//   let data = {
//     lang: "vi"
//   }
//   if(req.cookies.lang){
//     data.lang = req.cookies.lang;
//   }
//   res.send(JSON.stringify(data));
//   res.end();
// })

// router.post("/post/save_map_location",function(req,res){
//   let long = req.body.long;
//   let id = req.session.ideq;
//   let serial_sensor = req.session.serial_sensor;
//   let lat = req.body.lat;
//   accessDB("UPDATE totaleq SET location_long = ?, location_lat=? WHERE id = ? AND serial_sensor = ?;", [long,lat,id, serial_sensor],function(result){
//     res.send("true");
//     res.end();
//   })
// })



// router.get("/get/group",function(req,res){
//   accessDB("SELECT * FROM group_eq",[],async function(result3){
//     // res.send(JSON.stringify(result3))
//     if(result3.length > 0){
//       let x = JSON.parse(JSON.stringify(result3))
//       pushData(x)
//       .then(result => Promise.all(result))
//       .then(async function(result){
//         res.send(JSON.stringify(result));
//         res.end();
//       })
//     }else{
//       res.send(translate_source(req,"no data"));
//       res.end();
//     }
//   })
// })

// router.get("/get/compen_value",function(req,res){
//   let id = req.session.ideq;
//   let serial_sensor = req.session.serial_sensor
//   accessDB("SELECT compen_value FROM totaleq WHERE id = ? AND serial_sensor = ?",[id, serial_sensor],function(result){
//     if(result.length > 0){
//       res.send(JSON.stringify(result))
//     }
//     res.end()
//   })
// })

// router.get("/get/setting_flowrate_pressure_setting",function(req,res){
//   let id = req.session.ideq;
//   let user_id = req.user.id;
//   accessDB("SELECT * FROM flow_rate_pressure_setting WHERE usr_id = ? AND ideq = ?",[user_id,id],function(result){
//     if(result.length > 0){
//       res.send(result[0]);
//       res.end();
//     }else{
//       let flowrate_setting =  [];
//       for(let i=0; i<6; i++){
//         flowrate_setting.push({
//           index: i+1,
//           start: null,
//           end: null,
//           low_threshold_flowRate: null,
//           high_threshold_flowRate: null
//         })
//       }
//       let pressure_setting =  [];
//       for(let i=0; i<6; i++){
//         pressure_setting.push({
//           index: i+1,
//           start: null,
//           end: null,
//           low_threshold_pressure: null,
//           high_threshold_pressure: null
//         })
//       }
//       accessDB("INSERT INTO flow_rate_pressure_setting (ideq, flowrate_setting, pressure_setting, day_of_week, usr_id) VALUES (?,?,?,?,?)",[id,JSON.stringify(flowrate_setting),JSON.stringify(pressure_setting),"",user_id],function(result2){
//         res.send(JSON.stringify({
//           ideq: id,
//           flowrate_setting: JSON.stringify(flowrate_setting),
//           pressure_setting: JSON.stringify(pressure_setting),
//           usr_id: user_id,
//           day_of_week: ""
//         }));
//         res.end();
//       })
//     }
//   })
// })


// router.get("/get/pressure_flowrate_alert_config",function(req,res){
//   let ideq = req.session.ideq;
//   accessDB("SELECT * FROM alert_config WHERE ideq = ? AND config_type IN (?,?)",[ideq, "APSUAT", "OP"],function(result){
//     res.send(JSON.stringify(result));
//     res.end();
//   })
// })




// router.post("/save_pr_fl_setting",function(req,res){
//   let pr = req.body.pr;
//   let fl = req.body.fl;
//   let ideq = req.session.ideq;
//   let usr = req.user.id;
//   let day_of_week = req.body.day_of_week;
//   accessDB("UPDATE flow_rate_pressure_setting SET flowrate_setting=?, pressure_setting=?, day_of_week=? WHERE ideq = ? AND usr_id = ?",[fl,pr,day_of_week,ideq,usr ],function(result){

//     res.send(translate_source(req,"Save success!"));
//     res.end();
//   })
// })

// router.post("/save_pr_fl_setting",function(req,res){
//   let plr = req.body.plr_config;
//   let press = req.body.press_config;
//   console.log(req.session.serial_sensor)
//   let insert = [];
//   let update = [];
//   let delete_setting = [];
// for(let i=0; i<plr.length; i++){
//   if(plr[i].if_exist){
//     if(plr[i].max_value != null && plr[i].min_value != null && plr[i].max_value != "" && plr[i].min_value != ""){
//       update.push({
//         index: date_format(plr[i].index),
//         config_type: date_format(plr[i].config_type),
//         start_time: date_format(plr[i].start_time),
//         end_time: date_format(plr[i].end_time),
//         min_value: date_format(Number(plr[i].min_value)),
//         max_value: date_format(Number(plr[i].max_value)),
//         ID: plr[i].if_exist,
//         day_of_week: date_format(plr[i].day_of_week)
//       })
//     }else{
//       delete_setting.push({
//         index: plr[i].index,
//         config_type: "OP",
//       })
//     }
//   }else{
//     if(plr[i].max_value != null && plr[i].min_value != null && plr[i].max_value != "" && plr[i].min_value != ""){
//       insert.push([
//         date_format(plr[i].start_time),
//         date_format(plr[i].end_time),
//         date_format(Number(plr[i].min_value)),
//         date_format(Number(plr[i].max_value)),
//         req.user.usr,
//         new Date(),
//         req.session.ideq,
//         "OP",
//         date_format(plr[i].day_of_week),
//         date_format(plr[i].index),
//         req.session.serial_sensor
//       ])
//     }else{
//       delete_setting.push({
//         index: plr[i].index,
//         config_type: "OP",
//       })
//     }
//   }
// }

// for(let i=0; i<press.length; i++){
//   if(press[i].if_exist){
//     if(press[i].max_value != null && press[i].min_value != null && press[i].max_value != "" && press[i].min_value != ""){
//       update.push({
//         index: date_format(press[i].index),
//         config_type: date_format(press[i].config_type),
//         start_time: date_format(press[i].start_time),
//         end_time: date_format(press[i].end_time),
//         min_value: date_format(Number(press[i].min_value)),
//         max_value: date_format(Number(press[i].max_value)),
//         ID: press[i].if_exist,
//         day_of_week: date_format(press[i].day_of_week)
//       })
//     }else{
//       delete_setting.push({
//         index: press[i].index,
//         config_type: "APSUAT",
//       })
//     }
//   }else{
//     if(press[i].max_value != null && press[i].min_value != null && press[i].max_value != "" && press[i].min_value != ""){
//       insert.push([
//         date_format(press[i].start_time),
//         date_format(press[i].end_time),
//         date_format(Number(press[i].min_value)),
//         date_format(Number(press[i].max_value)),
//         req.user.usr,
//         new Date(),
//         req.session.ideq,
//         "APSUAT",
//         date_format(press[i].day_of_week),
//         date_format(press[i].index),
//         req.session.serial_sensor
//       ])
//     }else{
//       delete_setting.push({
//         index: press[i].index,
//         config_type: "APSUAT",
//       })
//     }
//   }
// }

//   if(delete_setting.length > 0){
//     let sql2 = "";
//     for(let i=0; i<delete_setting.length; i++){
//       sql2 += "DELETE FROM alert_config WHERE ideq ='"+req.session.ideq+"' AND `index` = "+delete_setting[i].index+" AND config_type ='"+delete_setting[i].config_type+"'; " 
//     }
//     console.log(sql2)
//     accessDB(sql2,[],function(result){
//       console.log(result);
//     })
//   }

//   let sql = "";
//   let data_sql = []
//   for(let i=0; i< update.length; i++){
//     sql += "UPDATE alert_config SET start_time=?, end_time=?, min_value=?, max_value=?, updated_by=?, updated_at=?, day_of_week=?, `index` = ?, config_type = ?, serial_sensor = ? WHERE id = ?; "
//     data_sql.push(update[i].start_time,update[i].end_time,update[i].min_value,update[i].max_value,req.user.usr,new Date(),update[i].day_of_week,update[i].index,update[i].config_type, req.session.serial_sensor, Number(update[i].ID))
//   }

//   let insert_length = insert.length;
//   let update_length = data_sql.length;
//   if(insert_length > 0 && update_length > 0){
//     accessDB("INSERT INTO alert_config (start_time, end_time, min_value, max_value, updated_by, updated_at, ideq, config_type, day_of_week, `index`, serial_sensor) VALUES ? ",[insert],function(result){
//       accessDB(sql,data_sql,function(result2){
//         res.send(translate_source(req,"Save success!"));
//         res.end();
//       })
//     })
//   }else if(insert_length > 0 && update_length == 0){
//     accessDB("INSERT INTO alert_config (start_time, end_time, min_value, max_value, updated_by, updated_at, ideq, config_type, day_of_week, `index`, serial_sensor) VALUES ? ",[insert],function(result){
//         res.send(translate_source(req,"Save success!"));
//         res.end();
//     })
//   }else if(insert_length == 0 && update_length > 0){
//       accessDB(sql,data_sql,function(result2){
//         res.send(translate_source(req,"Save success!"));
//         res.end();
//     })
//   }else if(insert_length ==0 && update_length == 0){
//         res.send(translate_source(req,"Save success!"));
//         res.end();
//   }

// })



// router.get("/get/measure_setting",function(req,res){
//   let ideq = req.session.ideq;
//   accessDB("SELECT * FROM alert_config WHERE ideq = ? AND config_type = ?",[ideq, "MN"],function(result){
//     res.send(JSON.stringify(result));
//     res.end();
//   })
// })

// router.post("/save_measure_level_setting",function(req,res){
//   let ms = req.body.ms_config;
//   let insert = [];
//   let update = [];
//   let delete_setting = [];
// for(let i=0; i<ms.length; i++){
//   if(ms[i].if_exist){
//     if(ms[i].max_value != null && ms[i].min_value != null && ms[i].max_value != "" && ms[i].min_value != ""){
//       update.push({
//         index: date_format(ms[i].index),
//         config_type: date_format(ms[i].config_type),
//         start_time: date_format(ms[i].start_time),
//         end_time: date_format(ms[i].end_time),
//         min_value: date_format(Number(ms[i].min_value)),
//         max_value: date_format(Number(ms[i].max_value)),
//         ID: ms[i].if_exist,
//         day_of_week: date_format(ms[i].day_of_week)
//       })
//     }else{
//       delete_setting.push({
//         index: ms[i].index,
//         config_type: "MN",
//       })
//     }
//   }else{
//     if(ms[i].max_value != null && ms[i].min_value != null && ms[i].max_value != "" && ms[i].min_value != ""){
//       insert.push([
//         date_format(ms[i].start_time),
//         date_format(ms[i].end_time),
//         date_format(Number(ms[i].min_value)),
//         date_format(Number(ms[i].max_value)),
//         req.user.usr,
//         new Date(),
//         req.session.ideq,
//         "MN",
//         date_format(ms[i].day_of_week),
//         date_format(ms[i].index),
//         req.session.serial_sensor
//       ])
//     }else{
//       delete_setting.push({
//         index: ms[i].index,
//         config_type: "MN",
//       })
//     }
//   }
// }

// if(delete_setting.length > 0){
//   let sql2 = "";
//   for(let i=0; i<delete_setting.length; i++){
//     sql2 += "DELETE FROM alert_config WHERE ideq ='"+req.session.ideq+"' AND `index` = "+delete_setting[i].index+" AND config_type ='"+delete_setting[i].config_type+"'; " 
//   }
//   console.log(sql2)
//   accessDB(sql2,[],function(result){
//     console.log(result);
//   })
// }

//   let sql = "";
//   let data_sql = []
//   for(let i=0; i< update.length; i++){
//     sql += "UPDATE alert_config SET start_time=?, end_time=?, min_value=?, max_value=?, updated_by=?, updated_at=?, day_of_week=?, `index` = ?, config_type = ?, serial_sensor = ? WHERE id = ?; "
//     data_sql.push(update[i].start_time,update[i].end_time,update[i].min_value,update[i].max_value,req.user.usr,new Date(),update[i].day_of_week,update[i].index,update[i].config_type, req.session.serial_sensor, Number(update[i].ID))
//   }
//   let insert_length = insert.length;
//   let update_length = data_sql.length;
//   if(insert_length > 0 && update_length > 0){
//     accessDB("INSERT INTO alert_config (start_time, end_time, min_value, max_value, updated_by, updated_at, ideq, config_type, day_of_week, `index`, serial_sensor) VALUES ? ",[insert],function(result){
//       accessDB(sql,data_sql,function(result2){
//         res.send(translate_source(req,"Save success!"));
//         res.end();
//       })
//     })
//   }else if(insert_length > 0 && update_length == 0){
//     accessDB("INSERT INTO alert_config (start_time, end_time, min_value, max_value, updated_by, updated_at, ideq, config_type, day_of_week, `index`, serial_sensor) VALUES ? ",[insert],function(result){
//         res.send(translate_source(req,"Save success!"));
//         res.end();
//     })
//   }else if(insert_length == 0 && update_length > 0){
//       accessDB(sql,data_sql,function(result2){
//         res.send(translate_source(req,"Save success!"));
//         res.end();
//     })
//   }else if(insert_length ==0 && update_length == 0){
//         res.send(translate_source(req,"Save success!"));
//         res.end();
//   }
// })

// router.post("/save_compen_value",function(req,res){
//   let compen_value = req.body.compen_value;
//   let ideq = req.session.ideq;
//   let serial_sensor = req.session.serial_sensor;
//   accessDB("UPDATE totaleq SET compen_value = ? WHERE id = ? AND serial_sensor = ?;",[compen_value, ideq, serial_sensor],function(result){
//     res.send(translate_source(req,"Save success!"));
//     res.end();
//   })
// })

// router.get("/get/pressure_setting",function(req,res){
//   let ideq = req.session.ideq;
//   let serial_sensor = req.session.serial_sensor;
//   accessDB("SELECT bar_to_met,conver_factor,compen_factor FROM totaleq WHERE id = ? AND serial_sensor = ?;",[ideq, serial_sensor],function(result){
//     if(result.length > 0){
//       res.send(JSON.stringify(result[0]));
//     }
//     res.end()
//   })
// })

// router.post("/post/pressure_setting",function(req,res){
//   let ideq = req.session.ideq;
//   let data = req.body;
//   let serial_sensor = req.session.serial_sensor
//   accessDB("UPDATE totaleq SET bar_to_met =?, conver_factor=?, compen_factor=? WHERE id = ? AND serial_sensor = ?;",[data.bar_to_met, data.conver_factor, data.compen_factor, ideq, serial_sensor],function(result){
//     res.send(translate_source(req,"Save success!"));
//     res.end();
//   })
// })

// router.get("/get/setting_info",function(req,res){
//   let id = req.session.ideq;
//   let serial_sensor = req.session.serial_sensor;
//   accessDB("SELECT multiplier, first_index FROM totaleq WHERE id = ? AND serial_sensor = ?; SELECT * FROM alert_config WHERE ideq = ? AND serial_sensor = ? AND config_type IN (?,?);",[id,serial_sensor,id,serial_sensor,"PIN","ACQUY"],function(result){
//     // console.log(result)
//     res.send(JSON.stringify(result));
//     res.end();
//   })
// })


//admin

// router.get("/admin/get_MeterCode_list",function(req,res){
//   accessDB("SELECT id, name, serial_sensor FROM totaleq",[],function(result){
//     res.send(JSON.stringify(result));
//     res.end();
//   })
// })

// router.post("/admin/add_meter",function(req,res){
//   let data = req.body;
//   // console.log(data);
//   accessDB("SELECT * FROM totaleq WHERE id = ? AND serial_sensor = ?; ",[data.MeterCode, data.serial_sensor],function(result){
//     if(result.length > 0){
//       res.send(translate_source(req,"Meter has already exist"));
//       res.end();
//     }else{
//       // accessDB("INSERT INTO totaleq (id,name,serial_sensor) VALUES (?,?,?) ;",[data.MeterCode, data.name, data.serial_sensor],function(result){
//         console.log(data.MeterCode,  data.serial_sensor);
//         res.send(translate_source(req,"Add new meter successfuly"));
//         res.end();
//       // })
//     }
//   })
// })

// router.post("/admin/delete_meter",function(req,res){
//   let data = req.body.MeterCode.split("|");
//   let id = data[0]; let serial_sensor = data[1];
//   accessDB("SELECT * FROM wmeterdata WHERE id = ? AND serial_sensor = ?",[id,serial_sensor],function(result){
//     if(result.length > 0){
//       res.send(translate_source(req,"Device has data. Want to delete ?"))
//       res.end();
//     }else{
//       // console.log(id, serial_sensor);
//       accessDB("DELETE FROM totaleq WHERE id = ? AND serial_sensor = ?",[id, serial_sensor],function(result1){
//         res.send("no_data");
//         res.end()
//       })
//     }
//   })
// })

// router.post("/admin/confirm_delete_meter",function(req,res){
//   let data = req.body.MeterCode.split("|");
//   let id = data[0]; let serial_sensor = data[1];
//   // console.log(id, serial_sensor);
//   accessDB("DELETE FROM wmeterdata WHERE ID = ? AND serial_sensor = ?; DELETE FROM totaleq WHERE id = ? AND serial_sensor = ?;", [id, serial_sensor, id, serial_sensor],function(result){
//     res.send(translate_source(req,"Delete meter and data successfully"));
//     res.end();
//   })
// })


// function addonoff(arrDatai){
//   let data = arrDatai;
//   return new Promise (function(resolve){
//   accessDB("SELECT COUNT(totaleq.id) AS on_eq FROM totaleq INNER JOIN eq_group_relative ON totaleq.id = eq_group_relative.ideq INNER JOIN group_eq ON eq_group_relative.group_id = group_eq.id  WHERE status = ? AND group_eq.id = ?",["1",arrDatai.id],function(result1){
//     if(result1.length > 0){
//       accessDB("SELECT COUNT(totaleq.id) AS off_eq FROM totaleq INNER JOIN eq_group_relative ON totaleq.id = eq_group_relative.ideq INNER JOIN group_eq ON eq_group_relative.group_id = group_eq.id WHERE status = ? AND group_eq.id = ?",["0",arrDatai.id],function(result2){
//         if(result2.length > 0 ){
//           data.oneq = result1[0].on_eq;
//           data.offeq = result2[0].off_eq;
//           resolve(data);
//           }
//       })
//     }
//   })
// })
// }

// async function pushData(arrData){
//   return arrData.map(async function(arrDatai){
//     const result = await addonoff(arrDatai);
//     return result;
// })
// }

// router.get("/change_status",function(req,res){
//   let id = req.query.id;
//   let status = req.query.status;
//   accessDB("UPDATE account SET status = ? WHERE id = ?",[status,id],function(result){
//     if(req.cookies.lang == "en"){
//       res.send("Change status success!");
//       res.end();
//     }else{
//       res.send("Thay đổi trạng thái tài khoảng thành công");
//       res.end();
//     }
//   })
// })








module.exports = router;