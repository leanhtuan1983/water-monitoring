let accessDB = require("../config/mysql-config");
var sendVerifiCode = require("../config/send-verifi-code")
var exportMutilData = require("../config/export-multi-data-config");
var exportData = require("../config/export-data-config");
var exportData_2 = require("../config/export-data_2-config")
var exportData_inverter = require("../config/export-data-inverter-config");
var export_lost_data = require("../config/export-lost-data-output-config");
var export_meter_list = require("../config/export-meter-list-config")
var export_alert_data = require("../config/export-alert-data-config")
var add_log = require("../config/add-log-config")
var send_mqtt_inst = require("../config/send-mqtt-instant.js")
function date_format(x){
    if(x == "") return null;
    return x;
  }
  

  function return_icon_map(level_icon, status_alert){
    if(status_alert == 1){
      switch(level_icon){
        case 1: return "father-wt-meter-icon-red";
        case 2: return "wt-meter-icon-level_2-red";
        case 3: return "wt-meter-icon-red";
        default: return "father-wt-meter-icon-red";
      }
    }else{
      switch(level_icon){
        case 1: return "father-wt-meter-icon";
        case 2: return "wt-meter-icon-level_2";
        case 3: return "wt-meter-icon";
        default: return "father-wt-meter-icon";
      }
    }

  }

  function return_in_sql(arr){
    let x = "";
    for(let i=0; i<arr.length; i++){
      x+= "'"+arr[i]+"',"
    }
    return x.slice(0,-1)
  }

  function convert_array_to_father_child_json(data){

    let buildTree = (parent_id) => (item) => {
       const children = data.filter((child) => child.parent_id === item.id);
       return {
         ...item,
         ...(children.length > 0 && { children: children.map(buildTree(item.id)) }),
       };
     };
   
     let nestedData = data.filter((item) => !item.parent_id).map(buildTree(undefined));
     return nestedData;
   }

function translate_source(req,str){
    if(req.cookies.lang){
      if(req.cookies.lang == "vi"){
        switch(str){
          case "save config success!":
          return "Lưu cấu hình thành công";
          case "Save success!":
          return "Lưu thành công";
          case "no data":
            return "không có dữ liệu";
          case "Add new meter successfuly":
            return "Thêm thiết bị mới thành công";
          case "Meter has already exist":
            return "Thiết bị đã tồn tại";
          case "Delete meter and data successfully":
            return "Xóa thiết bị và dữ liệu thành công";
          case "Device has data. Want to delete ?":
            return "Thiết bị có dữ liệu. Xác nhận xóa thiết bị ?"
        }
      }else{
        return str;
      }
    }else{
      return str;
    }
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

function fixNum(num){
    if(Number.isNaN(Number(num)) || num == null){
      return null;
    }else{
      return +Number(num).toFixed(3)
    }
  }

function translate_noti(req,str){
    if(req.cookies.lang){
      if(req.cookies.lang == "vi"){
        switch (str){
        case "Send success!":
            return "Gửi lại mã xác nhận thành công";
        case 'The group already exists':
            return "Tên đơn vị đã tồn tại";
        case "Add success":
            return "Thêm đơn vị thành công";
        case "Update successful":
            return "Cập nhật thành công";
        case 'Delete successfully':
            return "Xóa thành công";
        case "Group name cannot be empty!":
            return "Tên đơn vị không được để trống"
        case "Group name has exist!":
            return "Tên đơn vị đã tồn tại";
        case "Add group success!":
            return "Thêm đơn vị thành công";
        case "You haven't changed group name yet":
            return "Bạn chưa thay đổi tên đơn vị";
        case "Edit success!":
            return "Sửa thành công";
        case "Delete success":
            return "Xóa thành công"
        }
      }else{ return str}
    }else{
      return str;
    }
  }

function translate_noti_app(req,str){
    if(req.cookies.lang){
      if(req.cookies.lang == "vi"){
        switch(str){
            case "Creat Account success!":
                return "Tạo tài khoản thành công";
            case "Email cannot be empty!":
                return "Email không được để trống";
            case "Invalid email format!":
                return "Sai định dạng email";
            case "Your email is incorrect":
                return "Email không chính xác";
            case "delete success":
                return "Xóa thành công";
            case "Update success!":
                return "Cập nhật thành công";
            case "Change password success!":
                return "Đổi mật khẩu thành công";
            case "wrong current password!":
                return "Sai mật khẩu hiện tại";
            case "ERR! cannot find user!":
                return "Không tìm thấy tài khoản";
            case "save success!":
                return "Lưu thành công";
            case "email or username had been use!":
                return "email hoặc tên đăng nhập đã đc sử dụng";
            case "Missing credentials":
                return "Thiếu thông tin đăng nhập";
            case "Missing register information":
                return "Thiểu thông tin đăng ký";
            case "Verify code is incorrect":
                return "Mã xác nhận không chính xác";
            case "Password cannot be empty!":
                return "Mật khẩu không được để trống"
            case "Confirm password cannot be empty!":
                return "Xác nhận mật khẩu không được để trống";
            case "Password must be at least 8 characters long!":
                return "Mật khẩu phải có độ dài ít nhất 8 ký tự"
            case "The password and confirm password must be match!": 
                return "Mật khẩu xác nhận không khớp"

        }
      }else{
        return str;
      }
    }else{
      return str;
    }
  }

  function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    var pad = function(num) { return ('00'+num).slice(-2) };
    function returnSQLDateFormat(dateObj){
      let date = new Date(Number(dateObj));
      let x = date.getFullYear()         + '-' +
      pad(date.getMonth() + 1)  + '-' +
      pad(date.getDate())       + ' ' +
      pad(date.getHours())      + ':' +
      pad(date.getMinutes())    + ':' +
      pad(date.getSeconds());
      return x;
    }

    function return_sql_fr_day_format(dateObj){
      let date = new Date(Number(dateObj));
      let x = date.getFullYear()         + '-' +
      pad(date.getMonth() + 1)  + '-' +
      pad(date.getDate())       + ' 00:00:00' 
      return x;
    }

    function return_sql_to_day_format(dateObj){
      let date = new Date(Number(dateObj));
      let x = date.getFullYear()         + '-' +
      pad(date.getMonth() + 1)  + '-' +
      pad(date.getDate())       + ' 23:59:59' 
      return x;
    }

    function return_sql_day_format(dateObj){
      let date = new Date(Number(dateObj));
      let x = date.getFullYear()         + '-' +
      pad(date.getMonth() + 1)  + '-' +
      pad(date.getDate())
      return x;
    }

    function configDataWmeter(arrData){
        let data=[];
        for(let i=0; i<arrData.length; i++){
          let x = {
            ValOfNum: arrData[i].ValOfNum,
            pressure: fixNum(arrData[i].pressure),
            quanity: arrData[i].terminal_index,
            flowRate: fixNum(arrData[i].flowRate),
            TIME: Number(arrData[i].TIME),
            Voltage: arrData[i].Voltage,
            meterTime: arrData[i].meterTime,
            voltage_ac_quy: arrData[i].voltage_ac_quy,
            measure_sensor: fixNum(arrData[i].measure_sensor),
            measure_cacul: fixNum(arrData[i].measure_cacul),
            terminal_index: arrData[i].terminal_index,
          };
          data.push(x);
        }
        return data;
      }

      function addonoff(arrDatai){
        let data = arrDatai;
        return new Promise (function(resolve){
        accessDB("SELECT COUNT(totaleq.id) AS on_eq FROM totaleq INNER JOIN group_relative ON totaleq.id = group_relative.ideq INNER JOIN group ON group_relative.group_id = group.id  WHERE `status` = ? AND group.id = ?",["1",arrDatai.id],function(result1){
          if(result1.length > 0){
            accessDB("SELECT COUNT(totaleq.id) AS off_eq FROM totaleq INNER JOIN group_relative ON totaleq.id = group_relative.ideq INNER JOIN group ON group_relative.group_id = group.id WHERE `status` = ? AND group.id = ?",["0",arrDatai.id],function(result2){
              if(result2.length > 0 ){
                data.oneq = result1[0].on_eq;
                data.offeq = result2[0].off_eq;
                resolve(data);
                }
            })
          }
        })
      })
      }
      
      async function pushData(arrData){
        return arrData.map(async function(arrDatai){
          const result = await addonoff(arrDatai);
          return result;
      })
      }

      function get_on_off_group(node_id){
        return new Promise (function(resolve){
          accessDB("call get_tree(?);",[node_id],function(result){
            if(result[0].length > 0){
              let child_data = result[0];
              let join_child = [];
              for(let i=0; i<child_data.length; i++){
                join_child.push(child_data[i].gr_id)
              }
              join_child.push(node_id);

              accessDB("SELECT COUNT(totaleq.idkey) AS status_on FROM group_relationship_demo_QN INNER JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor WHERE totaleq.`status` = ? AND group_relationship_demo_QN.id IN ("+return_in_sql(join_child)+");SELECT COUNT(totaleq.idkey) AS status_all FROM group_relationship_demo_QN INNER JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor WHERE group_relationship_demo_QN.id IN ("+return_in_sql(join_child)+");",[1],function(result_2){
                resolve("("+result_2[0][0].status_on+"/"+result_2[1][0].status_all+")")
              })
            }else{
              resolve("(0/0)")
            }
          })
        })
      }

class user_controller {
    authen(req,res,next){
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("/login");
            res.end();
        } 
    }

    change_lang(req,res,next){
        res.cookie('lang', req.params.lang, { maxAge: 1000*60*60*24*30 });
        res.redirect('back');
        res.end();
    }
    login_get_lang(req,res,next){
        if(req.cookies.lang){
            res.send(req.cookies.lang);
            res.end();
        }else{
            res.cookie('lang', "vi", { maxAge: 1000*60*60*24*30 });
            res.send("vi");
            res.end();
        }
    }
    render_login(req,res,next){
        if (req.isAuthenticated()) {
            res.redirect('/source_3/all')
          }else{
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.render('login',{message: req.flash()});
            res.end();
        }
    }

    render_register(req,res,next){
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.render('register',{message: req.flash()});
        res.end();
    }
    register(req,res,next){
        let email = req.body.e;
        let usr = req.body.usr;
        let pass = req.body.pw
        var x = bcrypt.hashSync(pass, saltRounds);
        let config1 = {ImRea:0,ExRea:0,ImAct1:0,ImAct2:1,ImAct3:1,ValAct:0,ValRea:1,ValApp:0,A_RMS:1,B_RMS:0,C_RMS:1};
        let config2 = {TEMP:1, HUMI:1, PIN_STATUS:0};
        let config3 = {pressure:0, quanity:0, flowRate:0,Voltage:0}
        accessDB("SELECT * FROM account WHERE email = ? OR usr = ?",[email,usr],function(result){
          if(result.length >0){
            res.send(translate_noti_app(req,"email or username had been use!"));
            res.end();
          }else{
            res.render("login")
            res.end();
          }
        })
    }
    user_forgot_password(req,res,next){
        let email = req.body.email;
        if(email == ""){
          res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
          res.header('Expires', '-1');
          res.header('Pragma', 'no-cache');
          res.render("forgot_password",{err: translate_noti_app(req,"Email cannot be empty!")});
          res.end();
          return false;
        }
        else if(!validateEmail(email)){
          res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
          res.header('Expires', '-1');
          res.header('Pragma', 'no-cache');
          res.render("forgot_password",{err:  translate_noti_app(req,"Invalid email format!")});
          res.end();
          return false;
        }else{
          accessDB("SELECT * FROM account WHERE email = ? AND `status` = ?",[email,1],function(result){
            if(result.length > 0){
              sendVerifiCode(email,res,req,false);
            }else{
              res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
              res.header('Expires', '-1');
              res.header('Pragma', 'no-cache');
              res.render("forgot_password",{err:  translate_noti_app(req,"Your email is incorrect")});
              res.end()
            }
          })
        }
    }
    send_code_again(req,res,next){
        let email = req.session.email;
        accessDB("SELECT * FROM account WHERE email = ? AND status = ?",[email,1],function(result){
          if(result.length > 0){
            sendVerifiCode(email,res,req,true);
          }else{
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.render("forgot_password",{err: translate_noti_app(req,"Your email is incorrect")});
            res.end()
          }
        })
    }
    user_send_verifi_code(req,res,next){
        let email = req.session.email;
        let code = req.body.verifiCode;
        if(code == ""){
          res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
          res.header('Expires', '-1');
          res.header('Pragma', 'no-cache');
          res.render("enter_verifi_code", {email: email, err: translate_noti_app(req,"Verify code cannot be empty!")});
          res.end()
          return false;
        }
        accessDB("SELECT * FROM account WHERE email = ? AND `status` = ?",[email,1],function(result){
          if(result.length > 0){
            if(code == result[0].verify_code){
              res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
              res.header('Expires', '-1');
              res.header('Pragma', 'no-cache');
              res.redirect("/setting_new_pass");
              res.end();
            }else{
              res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
              res.header('Expires', '-1');
              res.header('Pragma', 'no-cache');
              res.render("enter_verifi_code", {email: email, err: translate_noti_app(req,"Verify code is incorrect")});
              res.end()
            }
          }else{
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.render("enter_verifi_code", {email: email, err: translate_noti_app(req,"Your email is incorrect")});
            res.end()
          }
        })
    }
    user_set_pass(req,res,next){
        let email = req.session.email;
        let pass = req.body.password;
        let cfpass = req.body.cfpassword;      
        if(pass == ""){
          res.render("setting_new_pass",{email: email, err: translate_noti_app(req,"Password cannot be empty!")})
          res.end();
          return false;
        }else if(cfpass == ""){
          res.render("setting_new_pass",{email: email, err:translate_noti_app(req,"Confirm password cannot be empty!")})
          res.end();
          return false;
        }else if(pass.length < 8){
          res.render("setting_new_pass",{email: email, err:translate_noti_app(req,"Password must be at least 8 characters long!")})
          res.end();
          return false;
        }
        else if(pass != cfpass){
          res.render("setting_new_pass",{email: email, err:translate_noti_app(req,"The password and confirm password must be match!")})
          res.end();
          return false;
        }
          accessDB("SELECT * FROM account WHERE email = ? AND `status` = ?",[email,1],function(result){
            if(result.length > 0){
              let hashPass = bcrypt.hashSync(pass, saltRounds)
              accessDB("UPDATE account SET pass = ? WHERE email = ? AND `status` = ?", [hashPass,email,1],function(result){
                if(req.cookies.lang == "en"){
                  req.flash("error","Change pass success");
                }else{
                  req.flash("error","Đổi mật khẩu thành công");
      
                }
                res.redirect("/login");
                res.end();
              })
            }else{
              res.render("setting_new_pass",{email: email, err:"wrong email!"})
              res.end();
            }
          })
    }
    checkAccount(req,res,next){
        var a = req.body.data;
        accessDB("SELECT * FROM account WHERE role = 'admin' AND `status` =?",[1],function(result){
          if(result.length > 0){
            for(let i=0; i< result.length; i++){
              if(result[i].usr == a){
                res.send("true");
                res.end();
                return 0;
                
              }
            }
            res.send('false');
            res.end();
          }else{
            res.send('false');
            res.end();
          }
        })
    }
    logout(req,res,next){
        req.logout();
        req.session.destroy();
        res.redirect('/login');
        res.end();
    }
    get_report(req,res,next){
        let from = returnSQLDateFormat(req.query.fr);
        let to = returnSQLDateFormat(req.query.to);
        accessDB("SELECT * FROM report_table WHERE exportTime > ? AND exportTime < ?",[from,to], function(result){
          if(result.length>0)
          res.send(JSON.stringify(result));
          res.end();
        })
    }
    get_user(req,res,next){
        accessDB("SELECT usr,email FROM account WHERE `status` = ?",[1], function(result){
            res.send(JSON.stringify(result));
            res.end();
        })
    }
    get_exportMultiData(req,res,next){
        let to = req.query.to;
        let from = req.query.fr;
        let name = req.query.name;
        let para = req.query.para;
        let usr = req.user.usr;
        let moment = req.query.moment;
        let eq = "wt";
        let selectedEQ = req.query.selectedEQ;
        exportMutilData(to,from,name,para,usr,moment,eq,selectedEQ,res);
    }
    get_alert(req,res,next){
    let from = returnSQLDateFormat(req.query.fr);
    let to = returnSQLDateFormat(req.query.to);
    let para = changeARRSQLIN(req.query.para);
    // console.log(from,to, para)
    if(req.user.role == "admin"){
      accessDB("SELECT alert_data.alert_time AS alert_time, totaleq.id AS meter_id, totaleq.name AS name, totaleq.serial_sensor AS serial_sensor, alert_data.alert_type AS alert_type, alert_data.threshold AS threshold, alert_data.alert_value AS alert_value, group_setting.name AS group_name, group_setting.lost_threshold AS group_threshold, alert_data.para AS para FROM alert_data INNER JOIN totaleq ON alert_data.meter_id = totaleq.id AND alert_data.serial_sensor = totaleq.serial_sensor LEFT JOIN group_relationship_demo_QN ON alert_data.meter_id = group_relationship_demo_QN.meter_id AND alert_data.serial_sensor = group_relationship_demo_QN.serial_sensor LEFT JOIN group_setting ON group_relationship_demo_QN.id = group_setting.group_id WHERE alert_data.para IN ("+para+") AND alert_data.alert_time > ? AND alert_data.alert_time < ? ORDER BY alert_data.alert_time DESC;",[from,to], function(result){
        if(result.length>0)
        res.send(JSON.stringify(result));
        res.end();
        })
    }else{
      let group_id = req.user.group;
      // console.log(group_id)
      accessDB("call get_tree(?);",[group_id],function(result){
        let child_data = result[0];
        let join_child = []
        for(let i=0; i<child_data.length; i++){
          join_child.push(child_data.gr_id)
        }
        join_child.push(group_id);
        // accessDB("SELECT alert_data.alert_time AS alert_time, totaleq.id AS meter_id, totaleq.name AS name, totaleq.serial_sensor AS serial_sensor, alert_data.alert_type AS alert_type, alert_data.threshold AS threshold, alert_data.alert_value AS alert_value, group_setting.name AS group_name, group_setting.lost_threshold AS group_threshold, alert_data.para AS para FROM alert_data INNER JOIN totaleq ON alert_data.meter_id = totaleq.id AND alert_data.serial_sensor = totaleq.serial_sensor LEFT JOIN group_relationship_demo_QN ON alert_data.meter_id = group_relationship_demo_QN.meter_id AND alert_data.serial_sensor = group_relationship_demo_QN.serial_sensor LEFT JOIN group_setting ON group_relationship_demo_QN.id = group_setting.group_id WHERE alert_data.meter_id IN (SELECT meter_id FROM group_relationship_demo_QN WHERE id IN ("+return_in_sql(join_child)+")) AND alert_data.serial_sensor IN (SELECT serial_sensor FROM group_relationship_demo_QN WHERE id IN ("+return_in_sql(join_child)+")) AND alert_data.para IN ("+para+") AND alert_data.alert_time >= ? AND alert_data.alert_time <= ? ORDER BY alert_data.alert_time DESC;",[from,to],function(result_2){
        //   if(result_2.length>0)
        //   res.send(JSON.stringify(result_2));
        //   res.end();
        // })
        accessDB("SELECT alert_data.alert_time AS alert_time, totaleq.id AS meter_id, totaleq.name AS name, totaleq.serial_sensor AS serial_sensor, alert_data.alert_type AS alert_type, alert_data.threshold AS threshold, alert_data.alert_value AS alert_value, group_setting.name AS group_name, group_setting.lost_threshold AS group_threshold, alert_data.para AS para FROM alert_data INNER JOIN totaleq ON alert_data.meter_id = totaleq.id AND alert_data.serial_sensor = totaleq.serial_sensor INNER JOIN group_relationship_demo_QN ON alert_data.meter_id = group_relationship_demo_QN.meter_id AND alert_data.serial_sensor = group_relationship_demo_QN.serial_sensor LEFT JOIN group_setting ON group_relationship_demo_QN.id = group_setting.group_id WHERE (group_relationship_demo_QN.id IN ("+return_in_sql(join_child)+") OR group_relationship_demo_QN.parent_id IN ("+return_in_sql(join_child)+")) AND alert_data.para IN ("+para+") AND alert_data.alert_time >= ? AND alert_data.alert_time <= ? ORDER BY alert_data.alert_time DESC;",[from,to],function(result_2){
          if(result_2.length>0)
          res.send(JSON.stringify(result_2));
          res.end();
        })
      })
    }
    }
    get_alertTimeSend(req,res,next){
        let usr = req.user.usr;
        accessDB("SELECT alert_time_send.dayOfWeek,alert_time_send.time,alert_time_send.`status` FROM alert_time_send,account WHERE account.usr = ? AND account.id=alert_time_send.id",[usr],function(result){
          if(result.length>0){
            if(result[0].dayOfWeek == null){
              res.send(null);
              res.end()
            }else{
              res.send(JSON.stringify(result[0]));
              res.end();
            }
          }
          else{
            res.end(null);
          }
        })
    }
    post_alertTimeSend(req,res,next){
        let usr = req.body.usr;
        let time = req.body.time;
        let dow = req.body.dayOfWeek;
        let status = req.body.status;
        accessDB("UPDATE alert_time_send,account SET alert_time_send.time = ?, alert_time_send.dayOfWeek = ?, alert_time_send.`status`=? WHERE account.usr = ? AND account.id=alert_time_send.id",[time,dow,status,usr],function(result){
          res.send(translate_noti_app(req,"save success!"));
          res.end();
        })
    }
    get_changePassword(req,res,next){
        let newPass = req.body.newPass;
        let curPass = req.body.curPass;
        let usr = req.body.usr;
        accessDB("SELECT * FROM account WHERE usr = ?",[usr],function(result){
          if(result.length > 0){
            if(bcrypt.compareSync(curPass, result[0].pass)){
              accessDB("UPDATE account SET pass=? WHERE usr = ?",[bcrypt.hashSync(newPass, saltRounds),usr],function(result){
                res.send(translate_noti_app(req,"Change password success!"));
                res.end();
                return true;
              })
            }else{
              res.send(translate_noti_app(req,"wrong current password!"));
              res.end();
              return false;
            }
          }else{
            res.send(translate_noti_app(req,"ERR! cannot find user!"))
            res.end();
            return false;
          }
        })
    }
    redirect(req,res,next){
        res.redirect('/login');
        res.end();
    }
    render_source(req,res,next){
        let access_tab = [];
        if(req.user.access_tab){
          access_tab = req.user.access_tab.split(",")
        }
        let group = "";
        if(req.user.group){
          accessDB("SELECT * FROM `group` WHERE id = ?;",[req.user.group],function(result){
            if(result.length > 0){
              group = result[0].group_name;
            }
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.render('source', {name: req.user.usr, eq: "all", role: req.user.role, arr_access_tab :access_tab, group: group });
            res.end();
          })
        }else{
          res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
          res.header('Expires', '-1');
          res.header('Pragma', 'no-cache');
          res.render('source', {name: req.user.usr, eq: "all", role: req.user.role, arr_access_tab :access_tab, group: group });
          res.end();
        }
    }
    render_source_2(req,res,next){
      let access_tab = [];
      if(req.user.access_tab){
        access_tab = req.user.access_tab.split(",")
      }
      let group = "";
      if(req.user.group){
        accessDB("SELECT * FROM `group` WHERE id = ?;",[req.user.group],function(result){
          if(result.length > 0){
            group = result[0].group_name;
          }
          res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
          res.header('Expires', '-1');
          res.header('Pragma', 'no-cache');
          res.render('source_2', {name: req.user.usr, eq: "all", role: req.user.role, arr_access_tab :access_tab, group: group });
          res.end();
        })
      }else{
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.render('source_2', {name: req.user.usr, eq: "all", role: req.user.role, arr_access_tab :access_tab, group: group });
        res.end();
      }
  }

  render_source_3(req,res,next){
    let access_tab = [];
    if(req.user.access_tab){
      access_tab = req.user.access_tab.split(",")
    }
    let group_name = "";
    if(req.user.group != null){
      accessDB("SELECT * FROM group_relationship_demo_QN WHERE id = ?;",[req.user.group],function(result){
        if(result.length > 0){
          group_name = result[0].name;
        }
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.render('source_3', {name: req.user.usr, eq: "all", role: req.user.role, arr_access_tab :access_tab, group_name: group_name});
        res.end();
      })
    }else{
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      res.render('source_3', {name: req.user.usr, eq: "all", role: req.user.role, arr_access_tab :access_tab, group_name: group_name });
      res.end();
    }
}

    render_alert(req,res,next){
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.render('alert', { name: req.user.usr,  role: req.user.role})
        res.end()
    }
    render_dashboard(req,res,next){
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.render('dashboard', { name: req.user.usr, role: req.user.role })
        res.end();
    }
    render_profile(req,res,next){
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.render('profile', { name: req.user.usr, role: req.user.role })
        res.end();
    }
    render_report(req,res,next){
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.render('report', { name: req.user.usr, role: req.user.role });
        res.end();
    }
    render_forgot_password(req,res,next){
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        delete req.session.email;
        res.render("forgot_password", { err: "" });
        res.end();
    }
    render_enter_verifi_code(req,res,next){
        if (req.session.email) {
            res.render("enter_verifi_code", { email: req.session.email, err: "" });
            res.end();
          } else {
            res.redirect("/forgot_password")
            res.end();
          }
    }
    render_enter_verifi_code_again(req,res,next){
        if (req.session.email) {
            res.render("enter_verifi_code", { email: req.session.email, err: translate_noti(req,"Send success!") });
            res.end();
          }else {
            res.redirect("/forgot_password")
            res.end();
        }
    }
    render_setting_new_pass(req,res,next){
        if(req.session.email) {
            res.render("setting_new_pass", { email: req.session.email, err: "" });
            res.end();
        }else {
            res.redirect("/forgot_password");
            res.end()
        }
    }

    //group_user, eq_group_relative, group_eq
    get_EQ(req,res,next){
        var group = req.query.group;
        let sub_group = req.query.sub_group;
        let role = req.user.role;
        let sql = "";
        let sql_para;
        if(group == "all"){
          switch(role){
            case "admin":
              sql = "SELECT *, totaleq.id AS meter_id FROM totaleq ORDER BY totaleq.last_meter_time DESC;";
              sql_para = [];
              break;
            case "admin_client":
              sql = "SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relative ON totaleq.id = group_relative.ideq WHERE group_relative.group_id = ? ORDER BY totaleq.last_meter_time DESC;";
              sql_para = [req.user.group];
              break;
            case "client":
              sql = "SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN group_client ON totaleq.id = group_client.ideq WHERE group_client.user_id = ? ORDER BY totaleq.last_meter_time DESC;";
              sql_para = [req.user.id];
              break;
            default:
              res.end();
              return false;
          }
        }else{
          if(sub_group == "all"){
            switch(role){
              case "admin":
                sql = "SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relative ON totaleq.id = group_relative.ideq WHERE group_relative.group_id = ? ORDER BY totaleq.last_meter_time DESC;";
                sql_para = [group];
                break;
              case "admin_client":
                sql = "SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relative ON totaleq.id = group_relative.ideq WHERE group_relative.group_id = ? ORDER BY totaleq.last_meter_time DESC;";
                sql_para = [req.user.group];
                break;
              case "client":
                sql = "SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN group_client ON totaleq.id = group_client.ideq WHERE group_client.user_id = ? ORDER BY totaleq.last_meter_time DESC;";
                sql_para = [req.user.id];
                break;
            }
          }else{
            switch(role){
              case "admin":
                sql = "SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN sub_group_relative ON totaleq.id = sub_group_relative.ideq WHERE sub_group_relative.sub_group_id = ? ORDER BY totaleq.last_meter_time DESC;";
                sql_para = [sub_group];
                break;
              case "admin_client":
                sql = "SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN sub_group_relative ON totaleq.id = sub_group_relative.ideq WHERE sub_group_relative.sub_group_id = ? ORDER BY totaleq.last_meter_time DESC;";
                sql_para = [sub_group];
                break;
              case "client":
                sql = "SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN sub_group ON totaleq.id = sub_group.ideq INNER JOIN group_client ON totaleq.id = group_client.ideq INNER JOIN sub_group_relative ON totaleq.id = sub_group_relative.ideq WHERE sub_group.sub_group_id = ? AND group_client.user_id = ? ORDER BY totaleq.last_meter_time DESC;";
                sql_para = [sub_group, req.user.id];
                break;
            }
          }
        }
        // if(group == "all"){
        //   if(role == "admin"){
        //     a = [];
        //     sql = "SELECT *, totaleq.id AS meter_id FROM totaleq ORDER BY totaleq.last_data_time DESC;"
        //   }else{
        //     a = [id];
        //     sql = "SELECT *, totaleq.id AS meter_id  FROM totaleq INNER JOIN group_user ON totaleq.id = group_user.ideq WHERE group_user.user_id = ? ORDER BY totaleq.last_data_time DESC;";
        //   }
        // }else{
        //   if(role == "admin"){
        //     a = [group];
        //     sql = "SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN eq_group_relative ON totaleq.id = eq_group_relative.ideq INNER JOIN group_eq ON eq_group_relative.group_id = group_eq.id  WHERE group_eq.id = ? ORDER BY totaleq.last_data_time DESC;"
        //   }else{
        //     a = [id,group];
        //     sql = "SELECT *, totaleq.id AS meter_id  FROM totaleq INNER JOIN eq_group_relative ON totaleq.id = eq_group_relative.ideq INNER JOIN group_eq ON eq_group_relative.group_id = group_eq.id INNER JOIN group_user ON totaleq.id = group_user.ideq WHERE group_user.user_id = ? AND group_eq.group_id = ? ORDER BY totaleq.last_data_time DESC;";
        //   }
        // }
        accessDB(sql,sql_para,function(result2){
          res.send(JSON.stringify(result2))
          res.end();
        })
    }

    get_instant_value(req,res,next){
        let id = req.query.id;
        let serial_sensor = req.query.serial_sensor;
        req.session.ideq = id;
        req.session.serial_sensor = serial_sensor;
        accessDB("SELECT *, totaleq.id AS meter_id FROM totaleq WHERE id = ? AND serial_sensor = ?",[id,serial_sensor],function(result){
            if(result.length > 0) 
            res.send(JSON.stringify(result[0]))
            res.end();
        })
    }
    get_dataEQ(req,res,next){
        let id =req.session.ideq;
        // let moment = req.query.moment;
        let from = returnSQLDateFormat(req.query.fr);
        let to = returnSQLDateFormat(req.query.to);
        let serial_sensor = req.session.serial_sensor;
        let data;
        let sql = "SELECT DISTINCT * FROM wmeterdata WHERE ID = ? AND serial_sensor = ? AND meterTime >= ? AND meterTime <= ? ORDER BY meterTime";
        // switch(moment){
        //   case "raw": sql = "SELECT DISTINCT * FROM wmeterdata WHERE ID = ? AND serial_sensor = ? AND meterTime > ? AND meterTime < ? ORDER BY meterTime"; break;
        //  case "30minute": sql = "call groupbytime_wmeter(1*30, ?, ?, ?, ?)"; break; 
        //   case "hour": sql = "call groupbytime_wmeter(1*60, ?, ?, ?, ?)"; break; 
        //   case "day": sql = "call groupbytime_wmeter(1*60*24, ?, ?, ?, ?)"; break;
        //   case "week": sql = "call groupbytime_wmeter(24*60*7,?,?,?,?) "; break; 
        //   case "month": sql = "call groupbytime_wmeter(24*60*30,?,?,?,?)"; break; 
        //   case "year": sql = "call groupbytime_wmeter(24*60*365,?,?,?,?)"; break;
        // }
        accessDB(sql, [id, serial_sensor, from, to], function(result){
            if(result.length > 0){
              // switch(moment){
              //     case "raw": data=configDataWmeter(result); break;
              //    case "30minute": data=configDataWmeter(result[0]); break;
              //     case "hour":  data=configDataWmeter(result[0]); break;
              //     case "day": data=configDataWmeter(result[0]);break;
              //     case "week": data=configDataWmeter(result[0]); break;
              //     case "month": data=configDataWmeter(result[0]); break; 
              //     case "year": data=configDataWmeter(result[0]); break;
              //   }
                res.send(JSON.stringify(result));
                res.end()
            }else{
                res.end();
            }
        })
    }
    get_dt_m_dataEQ(req,res,next){
      let id =req.query.meter_id;
      let from = returnSQLDateFormat(req.query.fr);
      let to = returnSQLDateFormat(req.query.to);
      let serial_sensor = req.query.serial_sensor;
      let sql = "SELECT DISTINCT * FROM wmeterdata WHERE ID = ? AND serial_sensor = ? AND meterTime >= ? AND meterTime <= ? ORDER BY meterTime";
      accessDB(sql, [id, serial_sensor, from, to], function(result){
          if(result.length > 0){
              res.send(JSON.stringify(result));
              res.end()
          }else{
              res.end();
          }
      })
  }
    get_exportdata(req,res,next){
        let id = req.session.ideq;
        let serial_sensor = req.session.serial_sensor;
        let from = returnSQLDateFormat(req.query.fr);
        let to = returnSQLDateFormat(req.query.to);
        accessDB("SELECT *, totaleq.id AS meter_id FROM totaleq WHERE id = ? AND serial_sensor = ?;",[id, serial_sensor],function(result){
            if(result.length > 0){
              exportData_2(req,res,from,to,result[0],id,serial_sensor);
            }else{
                res.end();
            }
        })
        add_log(id,serial_sensor,returnSQLDateFormat(new Date().getTime()),"Xuất dữ liệu chỉ số từng thời điểm",req.user.usr)
    }
    get_dt_m_exportdata(req,res,next){
      let id = req.query.meter_id;
      let serial_sensor = req.query.serial_sensor;
      let from = returnSQLDateFormat(req.query.fr);
      let to = returnSQLDateFormat(req.query.to);
      accessDB("SELECT *, totaleq.id AS meter_id FROM totaleq WHERE id = ? AND serial_sensor = ?;",[id, serial_sensor],function(result){
          if(result.length > 0){
            exportData_2(req,res,from,to,result[0],id,serial_sensor);
          }else{
              res.end();
          }
      })
      add_log(id,serial_sensor,returnSQLDateFormat(new Date().getTime()),"Xuất dữ liệu chỉ số từng thời điểm",req.user.usr)
    }
    get_data_chart(req,res,next){
        let id = req.session.ideq;
        let usr = req.user.usr;
        let serial_sensor = req.session.serial_sensor;
        let from = returnSQLDateFormat(req.query.fr)
        let to = returnSQLDateFormat(req.query.to)
        let moment = req.query.moment;
        let sql;
        var data = {
          "data": null,
          "config": null
        };
        sql = "SELECT DISTINCT * FROM wmeterdata WHERE ID = ? AND serial_sensor = ? AND meterTime > ? AND meterTime < ? ORDER BY meterTime"
          // switch(moment){
          //   case "raw": sql = "SELECT DISTINCT * FROM wmeterdata WHERE ID = ? AND serial_sensor = ? AND meterTime > ? AND meterTime < ? ORDER BY meterTime"; break;
          //  case "30minute": sql = "call groupbytime_wmeter(1*30,?,?, ?, ?)"; break; 
          //   case "hour": sql = "call groupbytime_wmeter(1*60,?,?, ?, ?)"; break; 
          //   case "day": sql = "call groupbytime_wmeter(1*60*24,?,?, ?, ?)"; break;
          //   case "week": sql = "call groupbytime_wmeter(24*60*7,?,?,?,?) "; break; 
          //   case "month": sql = "call groupbytime_wmeter(24*60*30,?,?,?,?)"; break; 
          //   case "year": sql = "call groupbytime_wmeter(24*60*365,?,?,?,?)"; break;
          // }
          accessDB(sql, [id,serial_sensor, from, to], function(result){
            if(result.length < 1){
              data["data"] = [];
            }else{
              data["data"] = result;
              // switch(moment){
              //   case "raw": data["data"]=configDataWmeter(result); break;
              //  case "30minute": data["data"]=configDataWmeter(result[0]); break;
              //   case "hour":  data["data"]=configDataWmeter(result[0]); break;
              //   case "day": data["data"]=configDataWmeter(result[0]); break;
              //   case "week": data["data"]=configDataWmeter(result[0]); break;
              //   case "month": data["data"]=configDataWmeter(result[0]); break; 
              //   case "year": data["data"]=configDataWmeter(result[0]); break;
              // }
            }
              accessDB("SELECT * FROM config WHERE ideq = ? AND serial_sensor = ? AND username = ? ", [id, serial_sensor, usr], function(row){
                if(row.length < 1){
                  let config3 = {pressure:0, quanity:0, flowRate:0,Voltage:0}
                  let config4 = {"pressure":"#ff9900","quanity":"#0987ed","flowRate":"#50a605","Voltage":"#7bad9c"}
                  accessDB("INSERT INTO config (ideq, serial_sensor, username, config, color_config) VALUES (?,?,?,?,?)",[id,serial_sensor,usr,JSON.stringify(config3),JSON.stringify(config4)],function(result){
                    let x={
                      ideq: id,
                      username: usr,
                      config: JSON.stringify(config3),
                      color_config: JSON.stringify(config4)
                    }
                   
                    data["config"] = x;
                    res.send(JSON.stringify(data));
                    res.end();
                  })
                }else{
                data["config"] = row[0] ;
                res.send(JSON.stringify(data));
                res.end();
                }
              })
          })
    }

    vs_get_data_chart(req,res,next){
      let id = req.query.meter_id;
      let usr = req.user.usr;
      let serial_sensor = req.query.serial_sensor;
      let from = returnSQLDateFormat(req.query.fr)
      let to = returnSQLDateFormat(req.query.to)
      let sql;
      var data = {
        "data": null,
        "config": null
      };
      sql = "SELECT DISTINCT * FROM wmeterdata WHERE ID = ? AND serial_sensor = ? AND meterTime > ? AND meterTime < ? ORDER BY meterTime"
        accessDB(sql, [id,serial_sensor, from, to], function(result){
          if(result.length < 1){
            data["data"] = [];
          }else{
            data["data"] = result;
          }
            accessDB("SELECT * FROM config WHERE ideq = ? AND serial_sensor = ? AND username = ? ", [id, serial_sensor, usr], function(row){
              if(row.length < 1){
                let config3 = {pressure:0, quanity:0, flowRate:0, Voltage:0}
                let config4 = {"pressure":"#ff9900","quanity":"#0987ed","flowRate":"#50a605","Voltage":"#7bad9c"}
                accessDB("INSERT INTO config (ideq, serial_sensor, username, config, color_config) VALUES (?,?,?,?,?)",[id,serial_sensor,usr,JSON.stringify(config3),JSON.stringify(config4)],function(result){
                  let x={
                    ideq: id,
                    username: usr,
                    config: JSON.stringify(config3),
                    color_config: JSON.stringify(config4)
                  }
                  data["config"] = x;
                  res.send(JSON.stringify(data));
                  res.end();
                })
              }else{
              data["config"] = row[0] ;
              res.send(JSON.stringify(data));
              res.end();
              }
            })
        })
  }

    post_config(req,res,next){
        let id = req.session.ideq;
        let serial_sensor = req.session.serial_sensor
        let usr = req.user.usr;
        let cf = JSON.stringify(req.body.config);
        let cl_cf = JSON.stringify(req.body.color_config);
        accessDB("UPDATE config SET config=?,color_config=? WHERE ideq = ? AND serial_sensor = ? AND username = ?", [cf,cl_cf,id,serial_sensor,usr], function(result){
          res.send(translate_source(req,"save config success!"));
          res.end();
        })
        add_log(id,serial_sensor,returnSQLDateFormat(new Date().getTime()),"Cài đặt cấu hình biểu đồ",req.user.usr);
    }

    vs_post_config(req,res,next){
      let id = req.body.meter_id;
      let serial_sensor = req.body.serial_sensor;
      let usr = req.user.usr;
      let cf = JSON.stringify(req.body.config);
      let cl_cf = JSON.stringify(req.body.color_config);
      accessDB("UPDATE config SET config=?, color_config=? WHERE ideq = ? AND serial_sensor = ? AND username = ?", [cf,cl_cf,id,serial_sensor,usr], function(result){
        res.send(translate_source(req,"save config success!"));
        res.end();
      })
      add_log(id,serial_sensor,returnSQLDateFormat(new Date().getTime()),"Cài đặt cấu hình biểu đồ",req.user.usr);
  }

    get_alert_data(req,res,next){
        let id = req.session.ideq;
        let serial_sensor = req.session.serial_sensor;
        let from = returnSQLDateFormat(req.query.fr);
        let to = returnSQLDateFormat(req.query.to);
        accessDB("SELECT * FROM alert_data WHERE meter_id = ? AND serial_sensor = ? AND alert_time > ? AND alert_time < ? ORDER BY alert_time DESC",[id,serial_sensor,from,to], function(result){
          if(result.length > 0)
            res.send(JSON.stringify(result));
            res.end();
        })
    }
    get_al_alert_data(req,res,next){
      let id = req.query.meter_id;
      let serial_sensor = req.query.serial_sensor;
      let from = returnSQLDateFormat(req.query.fr);
      let to = returnSQLDateFormat(req.query.to);
      accessDB("SELECT * FROM alert_data WHERE meter_id = ? AND serial_sensor = ? AND alert_time >= ? AND alert_time <= ? ORDER BY alert_time DESC",[id,serial_sensor,from,to], function(result){
        if(result.length > 0)
          res.send(JSON.stringify(result));
          res.end();
      })
  }
    get_info(req,res,next){
        let id = req.session.ideq;
        let serial_sensor = req.session.serial_sensor;
        accessDB("SELECT *, totaleq.id AS meter_id FROM totaleq WHERE id = ? AND serial_sensor = ?; SELECT DISTINCT group_setting.name FROM group_setting INNER JOIN group_information_demo_QN ON group_setting.group_id = group_information_demo_QN.group_id WHERE group_information_demo_QN.meter_id = ? AND group_information_demo_QN.serial_sensor = ?;",[id, serial_sensor,id, serial_sensor],function(result){
          if(result[0].length > 0){
            // accessDB("SELECT group_id FROM group_relative WHERE ideq = ?",[id],function(result2){
            //   let x = [];
            //   for(let i=0; i<result2.length; i++){
            //     x.push(result2[i].group_id);
            //   }
              // result[0].group_id = x.join();
              let group_eq = [];
              for(let i=0; i<result[1].length; i++){
                group_eq.push(result[1][i].name);
              }
              res.send(JSON.stringify({
                group_eq: group_eq.join(),
                name: result[0][0].name,
                location_lat: result[0][0].location_lat,
                location_long: result[0][0].location_long,
                address: result[0][0].address,
                install_date: result[0][0].install_date,
                inspection_date: result[0][0].inspection_date,
                loger_install_date: result[0][0].loger_install_date,
                serial_sim: result[0][0].serial_sim,
                level_icon: result[0][0].level_icon,

              }));
              res.end();
            // })
          }else{
            res.end();
          }
        })
    }
    get_group_eq(req,res,next){
        accessDB("SELECT * FROM `group_list`;",[],function(result){
            res.send(JSON.stringify({data: result, display_meter_list: req.user.display_meter_list}));
            res.end()
        })
    }
    post_edit_info(req,res,next){
        let id = req.session.ideq;
        let serial_sensor = req.session.serial_sensor;
        let data = req.body;
        // let group = data.group_id;
        let val = [];
        // for(let i=0; i<group.length; i++){
        //   if(group[i] != "" && group[i] != ""){
        //     val.push([group[i],id]);
        //   } 
        // }
        let sql = "UPDATE totaleq SET name=?, location_lat=?, location_long=?, address=?, phone_alert=?, install_date=?, inspection_date=?, loger_install_date=?, level_icon=? WHERE id = ? AND serial_sensor = ?;"
        accessDB(sql,[data.name, data.location_lat, data.location_long, data.address, data.phone_alert, date_format(data.install_date), date_format(data.inspection_date), date_format(data.loger_install_date),level_icon, id, serial_sensor],function(result){
          // accessDB("DELETE FROM group_relative WHERE ideq = ?;",[id],function(result2){
            // if(val.length > 0){
              // accessDB("INSERT INTO group_relative (group_id, ideq) VALUES ?",[val],function(result3){
              //   res.send(translate_source(req,"Save success!"));
              //   res.end();
              // })
            // }else{
              res.send(translate_source(req,"Save success!"));
              res.end();
            // }
      
          // })
        })
        add_log(id,serial_sensor,returnSQLDateFormat(new Date().getTime()),"Cài đặt thông tin thiết bị",req.user.usr);
    }
    post_edit_setting(req,res,next){
        let id = req.session.ideq;
        let serial_sensor = req.session.serial_sensor
        let data = req.body;
        if(data.threshold_pin == null || data.threshold_pin == ''){
          accessDB("DELETE FROM alert_config WHERE meter_id = ? AND config_type = ?",[id,"PIN"],function(result){})
        }else{
          accessDB("SELECT * FROM alert_config WHERE meter_id = ? AND config_type = ?",[id,"PIN"],function(result){
            if(result.length > 0){
              accessDB("UPDATE alert_config SET min_value = ? WHERE meter_id = ? AND config_type = ?",[data.threshold_pin,id,"PIN"],function(result1){})
            }else{
              accessDB("INSERT INTO alert_config (min_value,updated_by,updated_at,meter_id,config_type,serial_sensor) VALUES (?,?,?,?,?,?) ;",[data.threshold_pin, req.user.usr,new Date(),id,"PIN",req.session.serial_sensor],function(result1){})
            }
          })
        }
        if(data.threshold_battery == null || data.threshold_battery == ''){
          accessDB("DELETE FROM alert_config WHERE meter_id = ? AND config_type = ?",[id,"ACQUY"],function(result){})
        }else{
          accessDB("SELECT * FROM alert_config WHERE meter_id = ? AND config_type = ?",[id,"ACQUY"],function(result){
            if(result.length > 0){
              accessDB("UPDATE alert_config SET min_value = ? WHERE meter_id = ? AND config_type = ?",[data.threshold_battery,id,"ACQUY"],function(result1){})
            }else{
              accessDB("INSERT INTO alert_config (min_value,updated_by,updated_at,meter_id,config_type,serial_sensor) VALUES (?,?,?,?,?,?) ;",[data.threshold_battery, req.user.usr,new Date(),id,"ACQUY",req.session.serial_sensor],function(result1){})
            }
          })
        }
        // if(data.name_group != null && data.name_group != ""){
        //   accessDB("SELECT group_setting.id AS id FROM group_setting INNER JOIN group_relationship_demo_QN ON group_setting.group_id = group_relationship_demo_QN.id WHERE group_relationship_demo_QN.meter_id = ? AND group_relationship_demo_QN.serial_sensor = ?;",[id,serial_sensor],function(result){
        //     if(result.length > 0){
        //       let group_id = result[0].id
        //       accessDB("UPDATE group_setting SET name = ?, lost_threshold = ?, fre_lost_alert = ?, note = ?, offset = ? WHERE id = ?;",[data.name_group,data.lost_data_threshold,data.fre_check_lost_data,data.setting_group_note,data.offset_group,group_id],function(result){})
        //     }
        //   })
        // } 
        let sql = "UPDATE totaleq SET multiplier=?, first_index=? WHERE id = ? AND serial_sensor = ?;"
        accessDB(sql,[data.multiplier, data.first_index, id, serial_sensor],function(result){
          res.send(translate_source(req,"Save success!"));
          res.end();
        })
        add_log(id,serial_sensor,returnSQLDateFormat(new Date().getTime()),"Cài đặt hệ số xung, chỉ số ban đầu và ngưỡng nguồn điện",req.user.usr);
    }
    get_quanity_alert_config(req,res,next){
        let id = req.session.ideq;
        accessDB("SELECT * FROM alert_config WHERE meter_id = ? AND config_type = ?",[id, "SL"],function(result){
          if(result.length > 0){
            res.send(JSON.stringify(result[0]));
          }
          res.end();
        })
    }
    post_save_alert_setting(req,res,next){
        let id = req.session.ideq;
        let serial_sensor = req.session.serial_sensor;
        let data = req.body;
        if(data.estimate_quanity == null){
          accessDB("DELETE FROM alert_config WHERE meter_id = ? AND config_type = ?",[id,"SL"],function(result){
            res.send(translate_source(req,"Save success!"));
            res.end();
            return true;
          })
        }else{
          accessDB("SELECT * FROM alert_config WHERE meter_id = ? AND config_type = ?;",[id,"SL"],function(result){
            if(result.length > 0){
              let sql = "UPDATE alert_config SET start_time=?, end_time=?, min_value=?, updated_by=?, updated_at=?, day_of_week=?, `repeat_alert`=? WHERE meter_id = ? AND config_type = ?";
              accessDB(sql,[data.start_time, data.end_time, Number(data.estimate_quanity), req.user.usr, new Date(), data.day_of_week, Number(data.repeat_alert), id, "SL"],function(result1){
                res.send(translate_source(req,"Save success!"));
                res.end();
                return true;
              })
            }else{
              let sql2 = "INSERT INTO alert_config (start_time,end_time,min_value,updated_by,updated_at,meter_id,config_type,day_of_week,serial_sensor,`repeat_alert`) VALUES (?,?,?,?,?,?,?,?,?,?)";
              accessDB(sql2,[data.start_time,data.end_time,Number(data.estimate_quanity),req.user.usr,new Date(),id,"SL",data.day_of_week,req.session.serial_sensor,Number(data.repeat_alert)],function(result1){
                res.send(translate_source(req,"Save success!"));
                res.end();
                return true;
              })
            }
          })
        }
        add_log(id,serial_sensor,returnSQLDateFormat(new Date().getTime()),"Cài đặt vượt sản lượng",req.user.usr);
    }
    get_checkAdmin(req,res,next){
        let data = {
            role: req.user.role,
            lang: "vi"
          }
          if(req.cookies.lang){
            data.lang = req.cookies.lang;
          }
          res.send(JSON.stringify(data));
          res.end();
    }
    get_lang(req,res,next){
        let data = {
            lang: "vi"
          }
          if(req.cookies.lang){
            data.lang = req.cookies.lang;
          }
          res.send(JSON.stringify(data));
          res.end();
    }
    post_save_map_location(req,res,next){
        let long = req.body.long;
        let id = req.session.ideq;
        let serial_sensor = req.session.serial_sensor;
        let lat = req.body.lat;
        accessDB("UPDATE totaleq SET location_long = ?, location_lat=? WHERE id = ? AND serial_sensor = ?;", [long,lat,id, serial_sensor],function(result){
          res.send("true");
          res.end();
        })
        add_log(id,serial_sensor,returnSQLDateFormat(new Date().getTime()),"Cài đặt vị trí thiết bị",req.user.usr)
    }
    get_group(req,res,next){
        accessDB("SELECT * FROM `group_list`",[],async function(result3){
            if(result3.length > 0){
              let x = JSON.parse(JSON.stringify(result3))
              pushData(x)
              .then(result => Promise.all(result))
              .then(async function(result){
                res.send(JSON.stringify(result));
                res.end();
              })
            }else{
              res.send(translate_source(req,"no data"));
              res.end();
            }
        })
    }
    get_compen_value(req,res,next){
        let id = req.session.ideq;
        let serial_sensor = req.session.serial_sensor
        accessDB("SELECT compen_value FROM totaleq WHERE id = ? AND serial_sensor = ?",[id, serial_sensor],function(result){
          if(result.length > 0){
            res.send(JSON.stringify(result))
          }
          res.end()
        })
    }
    get_dt_m_compen_value(req,res,next){
      let id = req.query.meter_id;
      let serial_sensor = req.query.serial_sensor
      accessDB("SELECT compen_value FROM totaleq WHERE id = ? AND serial_sensor = ?",[id, serial_sensor],function(result){
        if(result.length > 0){
          res.send(JSON.stringify(result))
        }
        res.end()
      })
  }
    get_pressure_flowrate_alert_config(req,res,next){
        let ideq = req.session.ideq;
        accessDB("SELECT * FROM alert_config WHERE meter_id = ? AND config_type IN (?,?)",[ideq, "APSUAT", "OP"],function(result){
          res.send(JSON.stringify(result));
          res.end();
        })
    }
    save_pr_fl_setting(req,res,next){
        let plr = req.body.plr_config;
        let press = req.body.press_config;
        let insert = [];
        let update = [];
        let delete_setting = [];
      for(let i=0; i<plr.length; i++){
        if(plr[i].if_exist){
          if((plr[i].max_value != null && plr[i].max_value != "") || (plr[i].min_value != null  && plr[i].min_value != "")){
            update.push({
              index: date_format(plr[i].index),
              config_type: date_format(plr[i].config_type),
              start_time: date_format(plr[i].start_time),
              end_time: date_format(plr[i].end_time),
              min_value: date_format(Number(plr[i].min_value)),
              max_value: date_format(Number(plr[i].max_value)),
              ID: plr[i].if_exist,
              day_of_week: date_format(plr[i].day_of_week)
            })
          }else{
            delete_setting.push({
              index: plr[i].index,
              config_type: "OP",
            })
          }
        }else{
          if((plr[i].max_value != null && plr[i].max_value != "") || (plr[i].min_value != null && plr[i].min_value != "")){
            insert.push([
              date_format(plr[i].start_time),
              date_format(plr[i].end_time),
              date_format(Number(plr[i].min_value)),
              date_format(Number(plr[i].max_value)),
              req.user.usr,
              new Date(),
              req.session.ideq,
              "OP",
              date_format(plr[i].day_of_week),
              date_format(plr[i].index),
              req.session.serial_sensor
            ])
          }else{
            delete_setting.push({
              index: plr[i].index,
              config_type: "OP",
            })
          }
        }
      }
      
      for(let i=0; i<press.length; i++){
        if(press[i].if_exist){
          if((press[i].max_value != null && press[i].max_value != "") || (press[i].min_value != null && press[i].min_value != "")){
            update.push({
              index: date_format(press[i].index),
              config_type: date_format(press[i].config_type),
              start_time: date_format(press[i].start_time),
              end_time: date_format(press[i].end_time),
              min_value: date_format(Number(press[i].min_value)),
              max_value: date_format(Number(press[i].max_value)),
              ID: press[i].if_exist,
              day_of_week: date_format(press[i].day_of_week)
            })
          }else{
            delete_setting.push({
              index: press[i].index,
              config_type: "APSUAT",
            })
          }
        }else{
          if((press[i].max_value != null && press[i].max_value != "") || (press[i].min_value != null && press[i].min_value != "")){
            insert.push([
              date_format(press[i].start_time),
              date_format(press[i].end_time),
              date_format(Number(press[i].min_value)),
              date_format(Number(press[i].max_value)),
              req.user.usr,
              new Date(),
              req.session.ideq,
              "APSUAT",
              date_format(press[i].day_of_week),
              date_format(press[i].index),
              req.session.serial_sensor
            ])
          }else{
            delete_setting.push({
              index: press[i].index,
              config_type: "APSUAT",
            })
          }
        }
      }
      
        if(delete_setting.length > 0){
          let sql2 = "";
          for(let i=0; i<delete_setting.length; i++){
            sql2 += "DELETE FROM alert_config WHERE meter_id ='"+req.session.ideq+"' AND `index` = "+delete_setting[i].index+" AND config_type ='"+delete_setting[i].config_type+"'; " 
          }
          accessDB(sql2,[],function(result){
          })
        }
      
        let sql = "";
        let data_sql = []
        for(let i=0; i< update.length; i++){
          sql += "UPDATE alert_config SET start_time=?, end_time=?, min_value=?, max_value=?, updated_by=?, updated_at=?, day_of_week=?, `index` = ?, config_type = ?, serial_sensor = ? WHERE id = ?; "
          data_sql.push(update[i].start_time,update[i].end_time,update[i].min_value,update[i].max_value,req.user.usr,new Date(),update[i].day_of_week,update[i].index,update[i].config_type, req.session.serial_sensor, Number(update[i].ID))
        }
      
        let insert_length = insert.length;
        let update_length = data_sql.length;
        if(insert_length > 0 && update_length > 0){
          accessDB("INSERT INTO alert_config (start_time, end_time, min_value, max_value, updated_by, updated_at, meter_id, config_type, day_of_week, `index`, serial_sensor) VALUES ? ",[insert],function(result){
            accessDB(sql,data_sql,function(result2){
              res.send(translate_source(req,"Save success!"));
              res.end();
            })
          })
        }else if(insert_length > 0 && update_length == 0){
          accessDB("INSERT INTO alert_config (start_time, end_time, min_value, max_value, updated_by, updated_at, meter_id, config_type, day_of_week, `index`, serial_sensor) VALUES ? ",[insert],function(result){
              res.send(translate_source(req,"Save success!"));
              res.end();
          })
        }else if(insert_length == 0 && update_length > 0){
            accessDB(sql,data_sql,function(result2){
              res.send(translate_source(req,"Save success!"));
              res.end();
          })
        }else if(insert_length ==0 && update_length == 0){
              res.send(translate_source(req,"Save success!"));
              res.end();
        }
        add_log(req.session.ideq,req.session.serial_sensor,returnSQLDateFormat(new Date().getTime()),"Cài đặt vượt lưu lượng và áp suất",req.user.usr)
    }

    get_measure_setting(req,res,next){
        let ideq = req.session.ideq;
        accessDB("SELECT * FROM alert_config WHERE meter_id = ? AND config_type = ?",[ideq, "MN"],function(result){
          res.send(JSON.stringify(result));
          res.end();
        })
    }
    save_measure_level_setting(req,res,next){
        let ms = req.body.ms_config;
        let insert = [];
        let update = [];
        let delete_setting = [];
      for(let i=0; i<ms.length; i++){
        if(ms[i].if_exist){
          if((ms[i].max_value != null && ms[i].max_value != "") || (ms[i].min_value != null && ms[i].min_value != "")){
            update.push({
              index: date_format(ms[i].index),
              config_type: date_format(ms[i].config_type),
              start_time: date_format(ms[i].start_time),
              end_time: date_format(ms[i].end_time),
              min_value: date_format(Number(ms[i].min_value)),
              max_value: date_format(Number(ms[i].max_value)),
              ID: ms[i].if_exist,
              day_of_week: date_format(ms[i].day_of_week)
            })
          }else{
            delete_setting.push({
              index: ms[i].index,
              config_type: "MN",
            })
          }
        }else{
          if((ms[i].max_value != null && ms[i].max_value != "") || (ms[i].min_value != null && ms[i].min_value != "")){
            insert.push([
              date_format(ms[i].start_time),
              date_format(ms[i].end_time),
              date_format(Number(ms[i].min_value)),
              date_format(Number(ms[i].max_value)),
              req.user.usr,
              new Date(),
              req.session.ideq,
              "MN",
              date_format(ms[i].day_of_week),
              date_format(ms[i].index),
              req.session.serial_sensor
            ])
          }else{
            delete_setting.push({
              index: ms[i].index,
              config_type: "MN",
            })
          }
        }
      }
      
      if(delete_setting.length > 0){
        let sql2 = "";
        for(let i=0; i<delete_setting.length; i++){
          sql2 += "DELETE FROM alert_config WHERE meter_id ='"+req.session.ideq+"' AND `index` = "+delete_setting[i].index+" AND config_type ='"+delete_setting[i].config_type+"'; " 
        }
        accessDB(sql2,[],function(result){
        })
      }
      
        let sql = "";
        let data_sql = []
        for(let i=0; i< update.length; i++){
          sql += "UPDATE alert_config SET start_time=?, end_time=?, min_value=?, max_value=?, updated_by=?, updated_at=?, day_of_week=?, `index` = ?, config_type = ?, serial_sensor = ? WHERE id = ?; "
          data_sql.push(update[i].start_time,update[i].end_time,update[i].min_value,update[i].max_value,req.user.usr,new Date(),update[i].day_of_week,update[i].index,update[i].config_type, req.session.serial_sensor, Number(update[i].ID))
        }
        let insert_length = insert.length;
        let update_length = data_sql.length;
        if(insert_length > 0 && update_length > 0){
          accessDB("INSERT INTO alert_config (start_time, end_time, min_value, max_value, updated_by, updated_at, meter_id, config_type, day_of_week, `index`, serial_sensor) VALUES ? ",[insert],function(result){
            accessDB(sql,data_sql,function(result2){
              res.send(translate_source(req,"Save success!"));
              res.end();
            })
          })
        }else if(insert_length > 0 && update_length == 0){
          accessDB("INSERT INTO alert_config (start_time, end_time, min_value, max_value, updated_by, updated_at, meter_id, config_type, day_of_week, `index`, serial_sensor) VALUES ? ",[insert],function(result){
              res.send(translate_source(req,"Save success!"));
              res.end();
          })
        }else if(insert_length == 0 && update_length > 0){
            accessDB(sql,data_sql,function(result2){
              res.send(translate_source(req,"Save success!"));
              res.end();
          })
        }else if(insert_length ==0 && update_length == 0){
              res.send(translate_source(req,"Save success!"));
              res.end();
        }
        add_log(req.session.ideq,req.session.serial_sensor,returnSQLDateFormat(new Date().getTime()),"Cài đặt cảnh báo mực nước",req.user.usr)
    }
    save_compen_value(req,res,next){
        let compen_value = req.body.compen_value;
        let ideq = req.session.ideq;
        let serial_sensor = req.session.serial_sensor;
        accessDB("UPDATE totaleq SET compen_value = ? WHERE id = ? AND serial_sensor = ?;",[compen_value, ideq, serial_sensor],function(result){
          res.send(translate_source(req,"Save success!"));
          res.end();
        })
        add_log(req.session.ideq,req.session.serial_sensor,returnSQLDateFormat(new Date().getTime()),"Cài đặt bù mực nước",req.user.usr)

    }
    get_pressure_setting(req,res,next){
        let ideq = req.session.ideq;
        let serial_sensor = req.session.serial_sensor;
        accessDB("SELECT bar_to_met,conver_factor,compen_factor FROM totaleq WHERE id = ? AND serial_sensor = ?;",[ideq, serial_sensor],function(result){
          if(result.length > 0){
            res.send(JSON.stringify(result[0]));
          }
          res.end()
        })
    }
    post_pressure_setting(req,res,next){
        let ideq = req.session.ideq;
        let data = req.body;
        let serial_sensor = req.session.serial_sensor
        accessDB("UPDATE totaleq SET bar_to_met =?, conver_factor=?, compen_factor=? WHERE id = ? AND serial_sensor = ?;",[data.bar_to_met, data.conver_factor, data.compen_factor, ideq, serial_sensor],function(result){
          res.send(translate_source(req,"Save success!"));
          res.end();
        })
        add_log(req.session.ideq,req.session.serial_sensor,returnSQLDateFormat(new Date().getTime()),"Cài đặt áp suất",req.user.usr)
    }
    get_setting_info(req,res,next){
        let id = req.session.ideq;
        let serial_sensor = req.session.serial_sensor;
        accessDB("SELECT multiplier, first_index FROM totaleq WHERE id = ? AND serial_sensor = ?; SELECT * FROM alert_config WHERE meter_id = ? AND serial_sensor = ? AND config_type IN (?,?); SELECT *, group_setting.name AS name FROM group_setting INNER JOIN group_relationship_demo_QN ON group_setting.group_id = group_relationship_demo_QN.id WHERE group_relationship_demo_QN.meter_id = ? AND group_relationship_demo_QN.serial_sensor = ?;",[id,serial_sensor,id,serial_sensor,"PIN","ACQUY",id,serial_sensor],function(result){
          res.json({
            err_code:0,
            message: null,
            data: {
              multiplier_first_index: result[0],
              alert_v_config: result[1],
              group_setting: result[2] 
            }
          })
          res.end()
          // res.send(JSON.stringify(result));
          // res.end();
        })
    }
    get_dataEQ_inverter(req,res,next){
        let id =req.session.ideq;
        let serial_sensor = req.session.serial_sensor;
        let from = returnSQLDateFormat(req.query.fr);
        let to = returnSQLDateFormat(req.query.to);
        let sql = "SELECT DISTINCT * FROM wmeterdata WHERE ID = ? AND serial_sensor = ? AND meterTime >= ? AND meterTime <= ? AND topic_type = ? AND message_type = ? ORDER BY meterTime DESC";
        accessDB(sql, [id,serial_sensor, from, to,"WMPI", "Opera"], function(result){
            if(result.length > 0){
                res.send(JSON.stringify(result));
                res.end()
            }else{
                res.end();
            }
        })
    }
    get_exportdata_inverter(req,res,next){
        let id = req.session.ideq;
        let serial_sensor = req.session.serial_sensor;
        let from = returnSQLDateFormat(req.query.fr);
        let to = returnSQLDateFormat(req.query.to);
        accessDB("SELECT * FROM totaleq WHERE id = ? AND serial_sensor = ?;",[id, serial_sensor],function(result){
            if(result.length > 0){
                exportData_inverter(req,res,from,to,result[0]);
            }else{
                res.end();
            }
        })
    }
    get_inverter_dataEQ_inverter(req,res,next){
        let id = req.session.ideq;
        let serial_sensor = req.session.serial_sensor;
        let from = returnSQLDateFormat(req.query.fr);
        let to = returnSQLDateFormat(req.query.to);
        accessDB("SELECT inverter_code FROM totaleq WHERE id = ? AND serial_sensor = ?",[id,serial_sensor],function(result){
          if(result.length > 0){
            let inverter_code = result[0].inverter_code;
            let sql = "SELECT DISTINCT * FROM wmeterdata WHERE ID = ? AND serial_sensor = ? AND meterTime > ? AND meterTime < ? AND topic_type = ? AND message_type = ? ORDER BY meterTime DESC;";
            accessDB(sql, [inverter_code, inverter_code, from, to,"WMCI", "Opera"], function(result){
                if(result.length > 0){
                    res.send(JSON.stringify(result));
                    res.end()
                }else{  
                    res.end();
                }
            })
          }else{
            res.end();
          }
        })
    }
    get_data_chart_inverter(req,res,next){
        let id = req.session.ideq;
        let serial_sensor = req.session.serial_sensor;
        let usr = req.user.usr;
        let from = returnSQLDateFormat(req.query.fr)
        let to = returnSQLDateFormat(req.query.to)
        let sql;
        var data = {
          "data": null,
          "config": null
        };
         sql = "SELECT DISTINCT * FROM wmeterdata WHERE ID = ? AND serial_sensor = ? AND meterTime > ? AND meterTime < ? AND message_type = ? AND topic_type = ? ORDER BY meterTime";
          accessDB(sql, [id, serial_sensor, from, to, "Opera", "WMPI"], function(result){
              data["data"] = result;
              accessDB("SELECT * FROM config WHERE ideq = ? AND serial_sensor = ? AND username = ? ", [id, serial_sensor, usr], function(row){
                if(row.length < 1){
                  let config3 = {pressure:0, fre:0}
                  let config4 = {"pressure":"#c74e4e","fre":"#325431"}
                  accessDB("INSERT INTO config (ideq,serial_sensor,username,config,color_config) VALUES (?,?,?,?,?)",[id,serial_sensor,usr,JSON.stringify(config3),JSON.stringify(config4)],function(result){
                    let x={
                      ideq: id,
                      username: usr,
                      config: JSON.stringify(config3),
                      color_config: JSON.stringify(config4)
                    }
                    data["config"] = x;
                    res.send(JSON.stringify(data));
                    res.end();
                  })
                }else{
                data["config"] = row[0] ;
                res.send(JSON.stringify(data));
                res.end();
                }
              })
          })
    }
    post_edit_info_inverter(req,res,next){
        let id = req.session.ideq;
        let serial_sensor = req.session.serial_sensor;
        let data = req.body;
        let group = data.group_id;
        let val = [];
        for(let i=0; i<group.length; i++){
          if(group[i] != "" && group[i] != ""){
            val.push([group[i],id]);
          } 
        }
        let sql = "UPDATE totaleq SET name=?, address=?, install_date=?, inspection_date=?, loger_install_date=?, inverter_code=? WHERE id = ? AND serial_sensor = ?;"
        accessDB(sql,[data.name, data.address, date_format(data.install_date), date_format(data.inspection_date), date_format(data.loger_install_date), data.inverter_code, id, serial_sensor],function(result){
          accessDB("DELETE FROM group_relative WHERE ideq = ?",[id],function(result2){
            if(val.length > 0){
              accessDB("INSERT INTO group_relative (group_id, ideq) VALUES ?",[val],function(result3){
                res.send(translate_source(req,"Save success!"));
                res.end();
              })
            }else{
              res.send(translate_source(req,"Save success!"));
              res.end();
            }
          })
        })
    }
    get_setting_fre_config(req,res,next){
        let meter_id = req.session.ideq
        let serial_sensor = req.session.serial_sensor
        accessDB("SELECT * FROM commands WHERE serial_sensor = ? AND meter_id = ? AND command_type = ?;",[serial_sensor, meter_id, "TANSO"],function(result){
          if(result.length > 0)
          res.send(JSON.stringify(result))
          res.end();
        })
    }
    post_save_setting_fre_alert(req,res,next){
        let meter_id = req.session.ideq
        let data = req.body.config_fre;
        let serial_sensor = req.session.serial_sensor;
        if(data.length == 0){
          accessDB("DELETE FROM commands WHERE serial_sensor = ? AND meter_id = ? AND command_type = ?",[serial_sensor,meter_id,"TANSO"],function(result){
            res.send(translate_noti(req,"Update successful"));
            res.end();
          })
        }else{
          accessDB("SELECT * FROM commands WHERE serial_sensor = ? AND meter_id = ? AND command_type = ?",[serial_sensor,meter_id,"TANSO"],function(result){
            if(result.length > 0){
              accessDB("UPDATE commands SET command = ?, created_by = ?, updated_at = ? WHERE serial_sensor = ? AND meter_id = ? AND command_type = ?",[JSON.stringify(data),req.user.id,new Date(),serial_sensor,meter_id,"TANSO"],function(result2){
                res.send(translate_noti(req,"Update successful"));
                res.end();
              })
            }else{
              accessDB("INSERT INTO commands (meter_id,serial_sensor,command,created_at,updated_at,created_by,command_type) VALUES (?,?,?,?,?,?,?)",[meter_id,serial_sensor,JSON.stringify(data),new Date(),new Date(),req.user.id,"TANSO"],function(result2){
                res.send(translate_noti(req,"Update successful"));
                res.end();
              })
            }
          })
        }
    }
    get_setting_pressure_config(req,res,next){
        let meter_id = req.session.ideq
        let serial_sensor = req.session.serial_sensor
        accessDB("SELECT * FROM commands WHERE serial_sensor = ? AND meter_id = ? AND command_type = ?;",[serial_sensor, meter_id, "APSUAT"],function(result){
          if(result.length > 0)
          res.send(JSON.stringify(result))
          res.end();
        })
    }
    post_save_setting_pressure_alert(req,res,next){
        let meter_id = req.session.ideq
        let data = req.body.config_pressure;
        let serial_sensor = req.session.serial_sensor;
        if(data.length == 0){
          accessDB("DELETE FROM commands WHERE serial_sensor = ? AND meter_id = ? AND command_type = ?",[serial_sensor, meter_id,"APSUAT"],function(result){
            res.send(translate_noti(req,"Update successful"));
            res.end();
          })
        }else{
          accessDB("SELECT * FROM commands WHERE serial_sensor = ? AND meter_id = ? AND command_type = ?",[serial_sensor, meter_id,"APSUAT"],function(result){
            if(result.length > 0){
              accessDB("UPDATE commands SET command = ?, created_by = ?, updated_at = ? WHERE serial_sensor = ? AND meter_id = ? AND command_type = ?",[JSON.stringify(data),req.user.id,new Date(),serial_sensor, meter_id,"APSUAT"],function(result2){
                res.send(translate_noti(req,"Update successful"));
                res.end();
              })
            }else{
              accessDB("INSERT INTO commands (meter_id,serial_sensor,command,created_at,updated_at,created_by,command_type) VALUES (?,?,?,?,?,?,?)",[meter_id,serial_sensor,JSON.stringify(data),new Date(),new Date(),req.user.id,"APSUAT"],function(result2){
                res.send(translate_noti(req,"Update successful"));
                res.end();
              })
            }
          })
        }
    }
    save_filter_eq_list(req,res,next){
      let data = req.body.data;
      accessDB("UPDATE account SET display_meter_list = ? WHERE id = ?;",[data, req.user.id],function(result){
        res.end();
      })
    }
    get_sub_group(req,res,next){
      let group_eq = req.query.group_eq;
      accessDB("SELECT * FROM sub_group WHERE parent_group_id = ?;",[group_eq],function(result){
        res.send(JSON.stringify(result))
        res.end();
      })
    }
    draw_map_zone_map(req,res,next){
      var group = req.query.group;
      let sub_group = req.query.sub_group;
      let SQL = "";
      let SQL_PARA = [];
      if(group == "all"){
        SQL = "SELECT * FROM sub_group;"
        SQL_PARA = [];
      }else{
        if(sub_group == "all"){
          SQL = "SELECT * FROM sub_group WHERE parent_group_id = ?;"
          SQL_PARA = [group];
        }else{
          SQL = "SELECT * FROM sub_group WHERE id = ?;"
          SQL_PARA = [sub_group];
        }
      }
      accessDB(SQL,SQL_PARA,function(result){
        res.send(JSON.stringify(result));
        res.end();
      })
    }
    get_meter_tree(req,res,next){
      let depth = req.query.depth;
      accessDB("SELECT group_relationship_demo_QN.have_child AS have_child, group_relationship_demo_QN.id AS id, group_relationship_demo_QN.meter_id AS meter_id, totaleq.name AS name_totaleq, group_relationship_demo_QN.name AS name, group_relationship_demo_QN.parent_id AS parent_id, group_relationship_demo_QN.depth AS depth FROM group_relationship_demo_QN LEFT JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id WHERE group_relationship_demo_QN.depth <= ? AND group_relationship_demo_QN.depth >= ? AND group_relationship_demo_QN.`status` = ? ORDER BY group_relationship_demo_QN.depth;",[depth,0,1],function(result){
        res.send(JSON.stringify({
          err_code: 0,
          message: null,
          data: result
        }));
        res.end();
      })
    }
    get_node_child(req,res,next){
      let node_id = req.query.node_id;
      if(node_id == null){
        res.send(JSON.stringify({
          err_code: 1,
          message: "Node id không tồn tại",
          data: []
        }));
        res.end();
        return false;
      }
      accessDB("SELECT * FROM group_relationship_demo_QN WHERE parent_id = ? AND `status` = ?;",[node_id,1],function(result){
        res.send(JSON.stringify({
          err_code: 0,
          message: null,
          data: result
        }));
        res.end();
      })
    }
    get_load_tree(req,res,next){
      let group_id = req.query.id;
      if(req.user.role == "admin"){
        if(group_id != "#"){
          accessDB("SELECT totaleq.level_icon AS level_icon, totaleq.status_alert AS status_alert, group_relationship_demo_QN.id AS node_id, group_relationship_demo_QN.depth AS depth, group_relationship_demo_QN.meter_id AS meter_id, group_relationship_demo_QN.serial_sensor AS serial_sensor, group_relationship_demo_QN.contain_meter AS contain_meter, group_relationship_demo_QN.have_child AS have_child, group_relationship_demo_QN.name AS main_name, group_setting.name AS group_name, totaleq.name AS name FROM group_relationship_demo_QN LEFT JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor LEFT JOIN group_setting ON group_relationship_demo_QN.id = group_setting.group_id WHERE group_relationship_demo_QN.parent_id = ? AND group_relationship_demo_QN.`status` = ?;",[group_id,1],async function(result){
            let data = JSON.parse(JSON.stringify(result));
            let jstree_child_node = []
            for(let i=0; i<data.length; i++){
              let x = {
                // "text": data[i].name,
                // "state":{
                //   opened: true,
                //   selected: false
                // },
                icon: return_icon_map(data[i].level_icon, data[i].status_alert),
                id: data[i].node_id,
                depth: data[i].depth,
                meter_id: data[i].meter_id,
                serial_sensor: data[i].serial_sensor,
                have_child: data[i].have_child,
                contain_meter: data[i].contain_meter
              }
              if(data[i].group_name){
                x.text = data[i].group_name 
              }else if(data[i].name){
                x.text = data[i].name 
              }else{
                x.text = data[i].main_name 
              }
              x.name = x.text;
              if(data[i].have_child == 1){
                x.children = true;
                x.text += await get_on_off_group(x.id);
              }
              jstree_child_node.push(x)
            }
            res.status(200).json(jstree_child_node)
            res.end()
          })
        }else{
          let first_select = 0;
          accessDB("SELECT totaleq.level_icon AS level_icon, totaleq.status_alert AS status_alert, group_relationship_demo_QN.id AS node_id, group_relationship_demo_QN.parent_id AS parent_id, group_relationship_demo_QN.depth AS depth, group_relationship_demo_QN.have_child AS have_child, group_relationship_demo_QN.meter_id AS meter_id, group_relationship_demo_QN.serial_sensor AS serial_sensor, group_relationship_demo_QN.contain_meter AS contain_meter, totaleq.name AS name, group_relationship_demo_QN.name AS main_name, group_setting.name AS group_name FROM group_relationship_demo_QN LEFT JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor LEFT JOIN group_setting ON group_relationship_demo_QN.id = group_setting.group_id WHERE group_relationship_demo_QN.depth <= ? AND group_relationship_demo_QN.depth >= ? AND group_relationship_demo_QN.`status` = ? ORDER BY group_relationship_demo_QN.depth, group_relationship_demo_QN.id;",[1,0, 1],async function(result){
            let data = JSON.parse(JSON.stringify(result));
            let jstree_data = [];
            for(let i=0; i<data.length; i++){
              let x = {
                // text: data[i].name,
              // "state":{
              //     opened: true,
              //     selected: false
              //   },  
                icon: return_icon_map(data[i].level_icon, data[i].status_alert),
                id: data[i].node_id,
                parent_id: data[i].parent_id,
                depth: data[i].depth,
                have_child: data[i].have_child,
                meter_id: data[i].meter_id,
                serial_sensor: data[i].serial_sensor,
                contain_meter: data[i].contain_meter
              }
              if(data[i].group_name){
                x.text = data[i].group_name
              }else if(data[i].name){
                x.text = data[i].name
              }else{
                x.text = data[i].main_name 
              }
              x.name = x.text;
              if(data[i].have_child == 1){
                x.children = true;
                x.text += await get_on_off_group(x.id);
              }
              if(data[i].depth == 0 && first_select == 0){
                first_select = 1;
                x.state = {
                  opened: true,
                  selected: true
                }
              }else{
                x.state = {
                  opened: false,
                  selected: false
                }
              }
              jstree_data.push(x)
            }
            res.status(200).json(convert_array_to_father_child_json(jstree_data));
            res.end();
          })
        }
      }else{
        if(req.user.group != null){
          if(group_id != "#"){
            accessDB("SELECT totaleq.level_icon AS level_icon, totaleq.status_alert AS status_alert, group_relationship_demo_QN.id AS node_id, group_relationship_demo_QN.depth AS depth, group_relationship_demo_QN.have_child AS have_child, group_relationship_demo_QN.meter_id AS meter_id, group_relationship_demo_QN.serial_sensor AS serial_sensor, group_relationship_demo_QN.contain_meter AS contain_meter, totaleq.name AS name, group_relationship_demo_QN.name AS main_name, group_setting.name AS group_name FROM group_relationship_demo_QN LEFT JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor LEFT JOIN group_setting ON group_relationship_demo_QN.id = group_setting.group_id WHERE group_relationship_demo_QN.parent_id = ? AND group_relationship_demo_QN.`status` = ?;",[group_id,1],async function(result){
              let data = JSON.parse(JSON.stringify(result));
              let jstree_child_node = []
              for(let i=0; i<data.length; i++){
                let x = {
                  // "text": data[i].name,
                  // "state":{
                  //   opened: true,
                  //   selected: false
                  // },
                  icon: return_icon_map(data[i].level_icon, data[i].status_alert),
                  id: data[i].node_id,
                  depth: data[i].depth,
                  have_child: data[i].have_child,
                  meter_id: data[i].meter_id,
                  serial_sensor: data[i].serial_sensor
                }
                if(data[i].group_name){
                  x.text = data[i].group_name
                }else if(data[i].name){
                  x.text = data[i].name
                }else{
                  x.text = data[i].main_name
                }
                x.name = x.text;
                if(data[i].have_child == 1){
                  x.children = true;
                  x.text += await get_on_off_group(x.id);
                }
                jstree_child_node.push(x)
              }
              res.status(200).json(jstree_child_node)
              res.end()
            })
          }else{
            let first_select = 0;
            accessDB("call get_tree(?)",[req.user.group],function(result){
              let child_data = result[0];
              if(child_data.length > 0){
                let join_child_data = [];
                for(let i=0; i<child_data.length; i++ ){
                  join_child_data.push(child_data[i].gr_id)
                }
                join_child_data.push(req.user.group)
                accessDB("SELECT totaleq.level_icon AS level_icon, totaleq.status_alert AS status_alert, group_relationship_demo_QN.have_child AS have_child, group_relationship_demo_QN.id AS node_id, group_relationship_demo_QN.name AS main_name, group_setting.name AS group_name, group_relationship_demo_QN.meter_id AS meter_id, group_relationship_demo_QN.serial_sensor AS serial_sensor, group_relationship_demo_QN.contain_meter AS contain_meter, totaleq.name AS name, group_relationship_demo_QN.parent_id AS parent_id, group_relationship_demo_QN.depth AS depth FROM group_relationship_demo_QN LEFT JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id LEFT JOIN group_setting ON group_relationship_demo_QN.id = group_setting.group_id WHERE group_relationship_demo_QN.depth <= ? AND group_relationship_demo_QN.depth >= ? AND group_relationship_demo_QN.`status` = ? AND group_relationship_demo_QN.id IN ("+return_in_sql(join_child_data)+") ORDER BY group_relationship_demo_QN.depth, group_relationship_demo_QN.id;",[1,0, 1],async function(result){
                  let data = JSON.parse(JSON.stringify(result));
                  let jstree_data = [];
                  for(let i=0; i<data.length; i++){
                    let x = {
                      // text: data[i].name,
                    // "state":{
                    //     opened: true,
                    //     selected: false
                    //   },  
                      icon: return_icon_map(data[i].level_icon, data[i].status_alert),
                      id: data[i].node_id,
                      parent_id: data[i].parent_id,
                      depth: data[i].depth,
                      have_child: data[i].have_child,
                      meter_id: data[i].meter_id,
                      serial_sensor: data[i].serial_sensor,
                      contain_meter: data[i].contain_meter
                    }
                    if(data[i].group_name){
                      x.text = data[i].group_name
                    }else if(data[i].name){
                      x.text = data[i].name
                    }else{
                      x.text = data[i].main_name
                    }
                    x.name = x.text;
                    if(data[i].have_child == 1){
                      x.children = true;
                      x.text += await get_on_off_group(x.id);
                    }
                    if(data[i].depth == 0 && first_select == 0){
                      first_select = 1;
                      x.state = {
                        opened: true,
                        selected: true
                      }
                    }else{
                      x.state = {
                        opened: false,
                        selected: false
                      }
                    }
                    jstree_data.push(x)
                  }
                  res.status(200).json(convert_array_to_father_child_json(jstree_data));
                  res.end();
                })
              }else{
                accessDB("SELECT totaleq.level_icon AS level_icon, totaleq.status_alert AS status_alert, group_relationship_demo_QN.have_child AS have_child, group_relationship_demo_QN.name AS main_name, group_setting.name AS group_name, group_relationship_demo_QN.id AS node_id, group_relationship_demo_QN.meter_id AS meter_id, group_relationship_demo_QN.serial_sensor AS serial_sensor, group_relationship_demo_QN.contain_meter AS contain_meter, totaleq.name AS name, group_relationship_demo_QN.parent_id AS parent_id, group_relationship_demo_QN.depth AS depth FROM group_relationship_demo_QN LEFT JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor LEFT JOIN group_setting ON group_relationship_demo_QN.id = group_setting.group_id WHERE group_relationship_demo_QN.depth <= ? AND group_relationship_demo_QN.depth >= ? AND group_relationship_demo_QN.`status` = ? AND group_relationship_demo_QN.id = ? ORDER BY group_relationship_demo_QN.depth, group_relationship_demo_QN.id;",[1, 0, 1, req.user.group],async function(result){
                  let data = JSON.parse(JSON.stringify(result));
                  let jstree_data = [];
                  for(let i=0; i<data.length; i++){
                    let x = {
                      // text: data[i].name,
                    // "state":{
                    //     opened: true,
                    //     selected: false
                    //   },  
                      icon: return_icon_map(data[i].level_icon, data[i].status_alert),
                      id: data[i].node_id,
                      parent_id: data[i].parent_id,
                      depth: data[i].depth,
                      have_child: data[i].have_child,
                      meter_id: data[i].meter_id,
                      serial_sensor: data[i].serial_sensor,
                      contain_meter: data[i].contain_meter

                    }
                    if(data[i].group_name){
                      x.text = data[i].group_name
                    }else if(data[i].name){
                      x.text = data[i].name
                    }else{
                      x.text = data[i].main_name
                    }
                    x.name = x.text;
                    if(data[i].have_child == 1){
                      x.children = true;
                      x.text += await get_on_off_group(x.id);
                    }
                    if(data[i].depth == 0 && first_select == 0){
                      first_select = 1;
                      x.state = {
                        opened: true,
                        selected: true
                      }
                    }else{
                      x.state = {
                        opened: false,
                        selected: false
                      }
                    }
                    jstree_data.push(x)
                  }
                  res.status(200).json(convert_array_to_father_child_json(jstree_data));
                  res.end();
                })
              }
            })

          }
        }
      }
      // if(req.user.role != "admin" && req.user.group != null){
      //   if(group_id =="#") group_id = req.user.group
      // }

    }
    get_level_1_data(req,res,next){
      let group_id = null;
      let name = "";
      let t,f;
      let sql = "";
      let para = [];
      // let to = returnSQLDateFormat(t);
      // let from = returnSQLDateFormat(f);
      // if(req.query.to == "0" && req.query.fr == "0"){
      //   t = new Date().getTime();
      //   f = t - 24*60*60*1000 
      // }else{
      //   t = req.query.to;
      //   f = req.query.fr;
      // }
      if(req.user.role == "admin"){
        if(req.query.group_id != -1){
          group_id = req.query.group_id;
          accessDB("SELECT * FROM group_relationship_demo_QN WHERE id = ?;",[group_id],function(result){
            if(result.length > 0){
              name = result[0].name;
              accessDB("call get_tree(?);",[group_id],function(result){
                if(result[0].length > 0){
                  let child_data = result[0];
                  let join_child = [];
                  for(let i=0; i<child_data.length; i++){
                    join_child.push(child_data[i].gr_id);
                  }
                  if(req.query.to == "0" && req.query.fr == "0"){
                    sql = "SELECT * FROM data_lost_output WHERE data_lost_output.group_id IN("+return_in_sql(join_child)+") AND id IN (SELECT MAX(id) FROM data_lost_output GROUP BY data_lost_output.group_id); SELECT *, totaleq.status AS status FROM data_lost_output INNER JOIN group_relationship_demo_QN ON data_lost_output.group_id = group_relationship_demo_QN.id INNER JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor WHERE group_relationship_demo_QN.depth >= ? AND group_relationship_demo_QN.`status` = ? AND group_relationship_demo_QN.parent_id = ? AND data_lost_output.id IN (SELECT MAX(id) FROM data_lost_output GROUP BY data_lost_output.group_id)";
                    para = [1,1,group_id]
                  }else{
                    // t = req.query.to;
                    // f = req.query.fr;
                    switch(req.query.to +""+ req.query.fr){
                      case "-1-1":
                        t = returnSQLDateFormat(new Date().getTime());
                        f = returnSQLDateFormat(new Date().getTime() - 24*3600000);
                        break;
                      case "-2-2":
                        t = return_sql_to_day_format(new Date().getTime());
                        f = return_sql_fr_day_format(new Date().getTime() - 7*24*3600000);
                        break;
                      case "-3-3":
                        t = return_sql_to_day_format(new Date().getTime());
                        f = return_sql_fr_day_format(new Date().getTime() - 30*24*3600000);
                        break;
                      default:
                        t = return_sql_to_day_format(Number(req.query.to));
                        f = return_sql_fr_day_format(Number(req.query.fr));
                        break;
                    }
                    sql = "SELECT * FROM data_lost_output WHERE group_id IN("+return_in_sql(join_child)+") AND meter_time > ? AND meter_time < ?; SELECT *, totaleq.status AS status FROM (SELECT SUM(data_lost_output.sum_nhanh) AS sum_nhanh, SUM(data_lost_output.sum_tong) AS sum_tong, group_id FROM data_lost_output WHERE meter_time >= ? AND meter_time <= ? GROUP BY group_id) AS dt_lost INNER JOIN group_relationship_demo_QN ON dt_lost.group_id = group_relationship_demo_QN.id INNER JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor WHERE group_relationship_demo_QN.depth >= ? AND group_relationship_demo_QN.`status` = ? AND group_relationship_demo_QN.parent_id = ?;" 
                    para = [f,t,f,t,1,1,group_id]
                  }
                  accessDB(sql,para,function(result_1){
                    if(result_1[1].length > 0){
                      res.json({
                        err_code:0,
                        message: null,
                        data: {
                          name: name,
                          main_lost: result_1[0],
                          child_lost: result_1[1]
                        }
                      })
                      res.end();
                    }else{
                      res.json({
                        err_code:0,
                        message: null,
                        data: {
                          name: name,
                          main_lost: [],
                          child_lost: []
                        }
                      })
                      res.end();
                    }
                  })
                }else{
                  res.json({
                    err_code:0,
                    message: null,
                    data: {
                      name: name,
                      main_lost: [],
                      child_lost: []
                    }
                  })
                  res.end();
                }
              })
            }else{
              res.json({
                err_code:0,
                message: null,
                data: {
                  name: name,
                  main_lost: [],
                  child_lost: []
                }
              })
              res.end();
            }
          })
        }else{
          accessDB("SELECT id, name FROM group_relationship_demo_QN WHERE group_relationship_demo_QN.depth = ? AND parent_id = ? AND `status` = ? ORDER BY id;",[0,0,1],function(result){
            if(result.length > 0){
              group_id = result[0].id;
              name = result[0].name;
              accessDB("call get_tree(?);",[group_id],function(result_1){
                if(result_1[0].length > 0){
                  let child_data = result_1[0];
                  let join_child = [];
                  for(let i=0; i<child_data.length; i++){
                    join_child.push(child_data[i].gr_id);
                  }
                  if(req.query.to == "0" && req.query.fr == "0"){
                    sql = "SELECT * FROM data_lost_output WHERE group_id IN("+return_in_sql(join_child)+") AND id IN (SELECT MAX(id) FROM data_lost_output GROUP BY data_lost_output.group_id); SELECT *, totaleq.`status` AS `status` FROM data_lost_output INNER JOIN group_relationship_demo_QN ON data_lost_output.group_id = group_relationship_demo_QN.id INNER JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor WHERE group_relationship_demo_QN.`status` = ? AND group_relationship_demo_QN.parent_id = ? AND data_lost_output.id IN (SELECT MAX(id) FROM data_lost_output GROUP BY data_lost_output.group_id)";
                    para = [1,group_id]
                  }else{
                    // t = req.query.to;
                    // f = req.query.fr;
                    switch(req.query.to +""+ req.query.fr){
                      case "-1-1":
                        t = returnSQLDateFormat(new Date().getTime());
                        f = returnSQLDateFormat(new Date().getTime() - 24*3600000);
                        break;
                      case "-2-2":
                        t = return_sql_to_day_format(new Date().getTime());
                        f = return_sql_fr_day_format(new Date().getTime() - 7*24*3600000);
                        break;
                      case "-3-3":
                        t = return_sql_to_day_format(new Date().getTime());
                        f = return_sql_fr_day_format(new Date().getTime() - 30*24*3600000);
                        break;
                      default:
                        t = return_sql_to_day_format(Number(req.query.to));
                        f = return_sql_fr_day_format(Number(req.query.fr));
                        break;
                    }
                    sql = "SELECT * FROM data_lost_output WHERE data_lost_output.group_id IN("+return_in_sql(join_child)+") AND meter_time >= ? AND meter_time <= ?; SELECT *, totaleq.status AS status FROM (SELECT SUM(data_lost_output.sum_nhanh) AS sum_nhanh, SUM(data_lost_output.sum_tong) AS sum_tong, group_id FROM data_lost_output WHERE data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? GROUP BY data_lost_output.group_id) AS dt_lost INNER JOIN group_relationship_demo_QN ON dt_lost.group_id = group_relationship_demo_QN.id INNER JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor WHERE group_relationship_demo_QN.`status` = ? AND group_relationship_demo_QN.parent_id = ?;" 
                    para = [f,t,f,t,1,group_id]
                  }
                  accessDB(sql,para,function(result_2){
                    res.json({
                      err_code:0,
                      message: null,
                      data: {
                        name: name,
                        main_lost: result_2[0],
                        child_lost: result_2[1]
                      }
                    })
                    res.end();
                  })
                }else{
                  res.json({
                    err_code:0,
                    message: null,
                    data: {
                      name: name,
                      main_lost: [],
                      child_lost: []
                    }
                  })
                  res.end();
                }
              })
            }else{
              res.json({
                err_code:0,
                message: null,
                data: {
                  name: name,
                  main_lost: [],
                  child_lost: []
                }
              })
              res.end();
            }
          })
        }
      }else{
        group_id = req.user.group;
        if(group_id != null){
          accessDB("SELECT * FROM group_relationship_demo_QN WHERE id = ?;",[group_id],function(result){
            if(result.length > 0){
              name = result[0].name;
              accessDB("call get_tree(?);",[group_id],function(result_1){
                if(result_1[0].length > 0){
                  let child_data = result_1[0];
                  let join_child = [];
                  for(let i=0; i<child_data.length; i++){
                    join_child.push(child_data[i].gr_id);
                  }
                  if(req.query.to == "0" && req.query.fr == "0"){
                    sql = "SELECT * FROM data_lost_output WHERE group_id IN("+return_in_sql(join_child)+") AND id IN (SELECT MAX(id) FROM data_lost_output GROUP BY data_lost_output.group_id); SELECT *, totaleq.status AS status FROM data_lost_output INNER JOIN group_relationship_demo_QN ON data_lost_output.group_id = group_relationship_demo_QN.id INNER JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor WHERE group_relationship_demo_QN.`status` = ? AND group_relationship_demo_QN.parent_id = ? AND data_lost_output.id IN (SELECT MAX(id) FROM data_lost_output GROUP BY data_lost_output.group_id)";
                    para = [1,group_id]
                  }else{
                    // t = req.query.to;
                    // f = req.query.fr;
                    switch(req.query.to +""+ req.query.fr){
                      case "-1-1":
                        t = returnSQLDateFormat(new Date().getTime());
                        f = returnSQLDateFormat(new Date().getTime() - 24*3600000);
                        break;
                      case "-2-2":
                        t = return_sql_to_day_format(new Date().getTime());
                        f = return_sql_fr_day_format(new Date().getTime() - 7*24*3600000);
                        break;
                      case "-3-3":
                        t = return_sql_to_day_format(new Date().getTime());
                        f = return_sql_fr_day_format(new Date().getTime() - 30*24*3600000);
                        break;
                      default:
                        t = return_sql_to_day_format(Number(req.query.to));
                        f = return_sql_fr_day_format(Number(req.query.fr));
                        break;
                    }
                    sql = "SELECT * FROM data_lost_output WHERE group_id IN("+return_in_sql(join_child)+") AND meter_time > ? AND meter_time < ?; SELECT *, totaleq.status AS status FROM (SELECT SUM(data_lost_output.sum_nhanh) AS sum_nhanh, SUM(data_lost_output.sum_tong) AS sum_tong, group_id FROM data_lost_output WHERE meter_time >= ? AND meter_time <= ? GROUP BY group_id) AS dt_lost INNER JOIN group_relationship_demo_QN ON dt_lost.group_id = group_relationship_demo_QN.id INNER JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor WHERE group_relationship_demo_QN.`status` = ? AND group_relationship_demo_QN.parent_id = ?;" 
                    para = [f,t,f,t,1,group_id]
                  }
                  accessDB(sql,para,function(result_2){
                    if(result_2.length > 0){
                      res.json({
                        err_code:0,
                        message: null,
                        data: {
                          name: name,
                          main_lost: result_2[0],
                          child_lost: result_2[1]
                        }
                      })
                      res.end();
                    }else{
                      res.json({
                        err_code:0,
                        message: null,
                        data: {
                          name: name,
                          main_lost: [],
                          child_lost: []
                        }
                      })
                      res.end();
                    }
                })
                }else{
                  res.json({
                    err_code:0,
                    message: null,
                    data: {
                      name: name,
                      main_lost: [],
                      child_lost: []
                    }
                  })
                  res.end();
                }
              })

            }else{
              res.json({
                err_code:0,
                message: null,
                data: {
                  name: name,
                  main_lost: [],
                  child_lost: []
                }
              })
              res.end();
            }
          })
        }else{
          res.json({
            err_code:0,
            message: null,
            data: {
              name: name,
              main_lost: [],
              child_lost: []
            }
          })
          res.end();
        }
      }
    }
    get_data_lost_output_level_1(req,res,next){
      let from, to, sql;
      if(req.query.to == "-2" && req.query.fr == "-2"){
        from = return_sql_fr_day_format(new Date().getTime() - 7*24*3600*1000)
        to = return_sql_to_day_format(new Date().getTime())
      }else if(req.query.to == "-3" && req.query.fr == "-3"){
        from = return_sql_fr_day_format(new Date().getTime() - 30*24*3600*1000)
        to = return_sql_to_day_format(new Date().getTime())
      }else{
        if((req.query.to == "0" && req.query.fr == "0") || (req.query.to == "-1" && req.query.fr == "-1")){
          from = returnSQLDateFormat(new Date().getTime() - 24*3600000);
          to = returnSQLDateFormat(new Date().getTime());
        }else{
          from = returnSQLDateFormat(req.query.fr)
          to = returnSQLDateFormat(req.query.to)
        }
      }
      let group = null;
      let name = "";
      if(req.user.role == "admin"){
        if(req.query.group_id == -1){
          accessDB("SELECT id,name FROM group_relationship_demo_QN WHERE group_relationship_demo_QN.depth = ? AND parent_id = ? AND `status` = ? ORDER BY id;",[0,0,1],function(result){
            if(result.length > 0){
              group = result[0].id;
              name = result[0].name;
              accessDB("call get_tree(?);",[group],function(gr_arr){
                let child_data = gr_arr[0];
                let join_child = [];
                for(let i=0; i<child_data.length; i++){
                  join_child.push(child_data[i].gr_id);
                }
                if((req.query.to == "-2" && req.query.fr == "-2")||(req.query.to == "-3" && req.query.fr == "-3")){
                  sql = "SELECT SUM(sum_tong) AS sum_tong, SUM(lost) AS lost, meter_time FROM (SELECT SUM(data_lost_output.sum_tong) AS sum_tong, null AS lost, DATE(data_lost_output.meter_time) AS meter_time FROM data_lost_output INNER JOIN group_relationship_demo_QN ON data_lost_output.group_id = group_relationship_demo_QN.id WHERE group_relationship_demo_QN.parent_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? GROUP BY DATE(data_lost_output.meter_time) UNION ALL SELECT null AS sum_tong, (SUM(sum_tong) - SUM(sum_nhanh)) AS lost, DATE(meter_time) AS meter_time FROM data_lost_output WHERE group_id IN ("+return_in_sql(join_child)+") AND meter_time >= ? AND meter_time <= ? GROUP BY DATE(meter_time)) as dt GROUP BY dt.meter_time"
                }else{
                  sql = "SELECT SUM(sum_tong) AS sum_tong, SUM(lost) AS lost, meter_time FROM (SELECT SUM(data_lost_output.sum_tong) AS sum_tong, null AS lost, data_lost_output.meter_time AS meter_time FROM data_lost_output INNER JOIN group_relationship_demo_QN ON data_lost_output.group_id = group_relationship_demo_QN.id WHERE group_relationship_demo_QN.parent_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? GROUP BY data_lost_output.meter_time UNION ALL SELECT null AS sum_tong, (SUM(sum_tong) - SUM(sum_nhanh)) AS lost, meter_time AS meter_time FROM data_lost_output WHERE group_id IN ("+return_in_sql(join_child)+") AND meter_time >= ? AND meter_time <= ? GROUP BY meter_time) as dt GROUP BY dt.meter_time"
                }
                accessDB(sql,[group,from,to,from,to],function(result_1){
                  // console.log(result_1)
                  res.json({
                    err_code:0,
                    message: null,
                    data: {
                      name: result[0].name,
                      data: result_1
                    }
                  })
                  res.end()
                })
              })

            }else{
              res.json({
                err_code:0,
                message: null,
                data: {
                  name: name,
                  data: []
                }
              })
              res.end()
            }
          })
        }else{
          group = req.query.group_id;
          accessDB("SELECT name FROM group_relationship_demo_QN WHERE id = ?;",[group],function(result){
            if(result.length > 0){
              accessDB("call get_tree(?);",[group],function(gr_arr){
                let child_data = gr_arr[0];
                let join_child = [];
                for(let i=0; i<child_data.length; i++){
                  join_child.push(child_data[i].gr_id);
                }
                if((req.query.to == "-2" && req.query.fr == "-2")||(req.query.to == "-3" && req.query.fr == "-3")){
                  sql = "SELECT SUM(sum_tong) AS sum_tong, SUM(lost) AS lost, meter_time FROM (SELECT SUM(data_lost_output.sum_tong) AS sum_tong, null AS lost, DATE(data_lost_output.meter_time) AS meter_time FROM data_lost_output INNER JOIN group_relationship_demo_QN ON data_lost_output.group_id = group_relationship_demo_QN.id WHERE group_relationship_demo_QN.parent_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? GROUP BY DATE(data_lost_output.meter_time) UNION ALL SELECT null AS sum_tong, (SUM(sum_tong) - SUM(sum_nhanh)) AS lost, DATE(meter_time) AS meter_time FROM data_lost_output WHERE group_id IN ("+return_in_sql(join_child)+") AND meter_time >= ? AND meter_time <= ? GROUP BY DATE(meter_time)) as dt GROUP BY dt.meter_time"
                }else{
                  sql = "SELECT SUM(sum_tong) AS sum_tong, SUM(lost) AS lost, meter_time FROM (SELECT SUM(data_lost_output.sum_tong) AS sum_tong, null AS lost, data_lost_output.meter_time AS meter_time FROM data_lost_output INNER JOIN group_relationship_demo_QN ON data_lost_output.group_id = group_relationship_demo_QN.id WHERE group_relationship_demo_QN.parent_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? GROUP BY data_lost_output.meter_time UNION ALL SELECT null AS sum_tong, (SUM(sum_tong) - SUM(sum_nhanh)) AS lost, meter_time AS meter_time FROM data_lost_output WHERE group_id IN ("+return_in_sql(join_child)+") AND meter_time >= ? AND meter_time <= ? GROUP BY meter_time) as dt GROUP BY dt.meter_time"
                }
                accessDB(sql,[group,from,to,from,to],function(result_1){
                  res.json({
                    err_code:0,
                    message: null,
                    data: {
                      name: result[0].name,
                      data: result_1
                    }
                  })
                  res.end()
                })
              })
              // accessDB(sql,[from,to,group],function(result_1){
              //   res.json({
              //     err_code:0,
              //     message: null,
              //     data: {
              //       name: result[0].name,
              //       data: result_1
              //     }
              //   })
              //   res.end()
              // })
            }else{
              res.json({
                err_code:0,
                message: null,
                data: {
                  name: name,
                  data: []
                }
              })
              res.end()
            }
          })
        }
      }else{
        group = req.user.group;
        accessDB("SELECT name FROM group_relationship_demo_QN WHERE id = ?;",[group],function(result){
          if(result.length > 0){
            // accessDB(sql,[from,to,group],function(result_1){
            //   res.json({
            //     err_code:0,
            //     message: null,
            //     data: {
            //       name: result[0].name,
            //       data: result_1
            //     }
            //   })
            //   res.end()
            // })
            accessDB("call get_tree(?);",[group],function(gr_arr){
              let child_data = gr_arr[0];
              let join_child = [];
              for(let i=0; i<child_data.length; i++){
                join_child.push(child_data[i].gr_id);
              }
              if((req.query.to == "-2" && req.query.fr == "-2")||(req.query.to == "-3" && req.query.fr == "-3")){
                sql = "SELECT SUM(sum_tong) AS sum_tong, SUM(lost) AS lost, meter_time FROM (SELECT SUM(data_lost_output.sum_tong) AS sum_tong, null AS lost, DATE(data_lost_output.meter_time) AS meter_time FROM data_lost_output INNER JOIN group_relationship_demo_QN ON data_lost_output.group_id = group_relationship_demo_QN.id WHERE group_relationship_demo_QN.parent_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? GROUP BY DATE(data_lost_output.meter_time) UNION ALL SELECT null AS sum_tong, (SUM(sum_tong) - SUM(sum_nhanh)) AS lost, DATE(meter_time) AS meter_time FROM data_lost_output WHERE group_id IN ("+return_in_sql(join_child)+") AND meter_time >= ? AND meter_time <= ? GROUP BY DATE(meter_time)) as dt GROUP BY dt.meter_time"
              }else{
                sql = "SELECT SUM(sum_tong) AS sum_tong, SUM(lost) AS lost, meter_time FROM (SELECT SUM(data_lost_output.sum_tong) AS sum_tong, null AS lost, data_lost_output.meter_time AS meter_time FROM data_lost_output INNER JOIN group_relationship_demo_QN ON data_lost_output.group_id = group_relationship_demo_QN.id WHERE group_relationship_demo_QN.parent_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? GROUP BY data_lost_output.meter_time UNION ALL SELECT null AS sum_tong, (SUM(sum_tong) - SUM(sum_nhanh)) AS lost, meter_time AS meter_time FROM data_lost_output WHERE group_id IN ("+return_in_sql(join_child)+") AND meter_time >= ? AND meter_time <= ? GROUP BY meter_time) as dt GROUP BY dt.meter_time"
              }
              accessDB(sql,[group,from,to,from,to],function(result_1){
                res.json({
                  err_code:0,
                  message: null,
                  data: {
                    name: result[0].name,
                    data: result_1
                  }
                })
                res.end()
              })
            })
          }else{
            res.json({
              err_code:0,
              message: null,
              data: {
                name: name,
                data: []
              }
            })
            res.end()
          }

        })
      }
    }
    
    // get_data_lost_output_level_1(req,res,next){ 
    //   let from, to, sql;
    //   if(req.query.to == "-2" && req.query.fr == "-2"){
    //     from = return_sql_day_format(new Date().getTime() - 7*24*3600*1000)
    //     to = return_sql_day_format(new Date().getTime())
    //     sql = "SELECT meter_time, SUM(k.SUM_NHANH) AS sum_nhanh, SUM(k.SUM_TONG) AS sum_tong FROM (SELECT data_lost_output.group_id, DATE(data_lost_output.meter_time) as meter_time, SUM(data_lost_output.sum_tong) as SUM_TONG, SUM(data_lost_output.sum_nhanh) as SUM_NHANH FROM data_lost_output INNER JOIN group_relationship_demo_QN ON data_lost_output.group_id = group_relationship_demo_QN.id WHERE DATE(data_lost_output.meter_time) >= ? AND DATE(data_lost_output.meter_time) <= ? AND group_relationship_demo_QN.parent_id = ? GROUP BY data_lost_output.group_id, DATE(data_lost_output.meter_time)) as k GROUP BY k.meter_time"
    //   }else if(req.query.to == "-3" && req.query.fr == "-3"){
    //     from = return_sql_day_format(new Date().getTime() - 30*24*3600*1000)
    //     to = return_sql_day_format(new Date().getTime())
    //     sql = "SELECT meter_time, SUM(k.SUM_NHANH) AS sum_nhanh, SUM(k.SUM_TONG) AS sum_tong FROM (SELECT data_lost_output.group_id, DATE(data_lost_output.meter_time) as meter_time, SUM(data_lost_output.sum_tong) as SUM_TONG, SUM(data_lost_output.sum_nhanh) as SUM_NHANH FROM data_lost_output INNER JOIN group_relationship_demo_QN ON data_lost_output.group_id = group_relationship_demo_QN.id WHERE DATE(data_lost_output.meter_time) >= ? AND DATE(data_lost_output.meter_time) <= ? AND group_relationship_demo_QN.parent_id = ? GROUP BY data_lost_output.group_id, DATE(data_lost_output.meter_time)) as k GROUP BY k.meter_time"
    //   }else{
    //     if((req.query.to == "0" && req.query.fr == "0") || (req.query.to == "-1" && req.query.fr == "-1")){
    //       from = returnSQLDateFormat(new Date().getTime() - 24*3600000);
    //       to = returnSQLDateFormat(new Date().getTime());
    //     }else{
    //       from = returnSQLDateFormat(req.query.fr)
    //       to = returnSQLDateFormat(req.query.to)
    //     }
    //     sql = "SELECT meter_time, SUM(k.SUM_NHANH) AS sum_nhanh, SUM(k.SUM_TONG) AS sum_tong FROM (SELECT data_lost_output.group_id, data_lost_output.meter_time as meter_time, SUM(data_lost_output.sum_tong) as SUM_TONG, SUM(data_lost_output.sum_nhanh) as SUM_NHANH FROM data_lost_output INNER JOIN group_relationship_demo_QN ON data_lost_output.group_id = group_relationship_demo_QN.id WHERE data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? AND group_relationship_demo_QN.parent_id = ? GROUP BY data_lost_output.group_id, data_lost_output.meter_time) as k GROUP BY k.meter_time"
    //   }

    //   let group = null;
    //   let name = "";
    //   // let sql = "SELECT parent_id,meterTime, SUM(SUM_NHANH) AS SUM_NHANH FROM (SELECT group_relationship_demo_QN.parent_id as parent_id, wmeterdata.meterTime as meterTime, SUM(wmeterdata.terminal_index) AS SUM_NHANH FROM wmeterdata INNER JOIN group_relationship_demo_QN ON wmeterdata.ID = group_relationship_demo_QN.meter_id AND wmeterdata.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.parent_id = ? AND wmeterdata.meterTime >= ? AND wmeterdata.meterTime <= ? AND group_relationship_demo_QN.status = ? AND group_relationship_demo_QN.depth <> ? GROUP BY group_relationship_demo_QN.parent_id, wmeterdata.meterTime) as k GROUP BY parent_id, meterTime"
    //   if(req.user.role == "admin"){
    //     if(req.query.group_id == -1){
    //       accessDB("SELECT id,name FROM group_relationship_demo_QN WHERE group_relationship_demo_QN.depth = ? AND parent_id = ? AND `status` = ? ORDER BY id;",[0,0,1],function(result){
    //         if(result.length > 0){
    //           group = result[0].id;
    //           name = result[0].name;
    //           accessDB(sql,[from,to,group],function(result_1){
    //             res.json({
    //               err_code:0,
    //               message: null,
    //               data: {
    //                 name: result[0].name,
    //                 data: result_1
    //               }
    //             })
    //             res.end()
    //           })
    //         }else{
    //           res.json({
    //             err_code:0,
    //             message: null,
    //             data: {
    //               name: name,
    //               data: []
    //             }
    //           })
    //           res.end()
    //         }
    //       })
    //     }else{
    //       group = req.query.group_id;
    //       accessDB("SELECT name FROM group_relationship_demo_QN WHERE id = ?;",[group],function(result){
    //         if(result.length > 0){
    //           accessDB(sql,[from,to,group],function(result_1){
    //             res.json({
    //               err_code:0,
    //               message: null,
    //               data: {
    //                 name: result[0].name,
    //                 data: result_1
    //               }
    //             })
    //             res.end()
    //           })
    //         }else{
    //           res.json({
    //             err_code:0,
    //             message: null,
    //             data: {
    //               name: name,
    //               data: []
    //             }
    //           })
    //           res.end()
    //         }
    //       })
    //     }
    //   }else{
    //     group = req.user.group;
    //     accessDB("SELECT name FROM group_relationship_demo_QN WHERE id = ?;",[group],function(result){
    //       if(result.length > 0){
    //         accessDB(sql,[from,to,group],function(result_1){
    //           res.json({
    //             err_code:0,
    //             message: null,
    //             data: {
    //               name: result[0].name,
    //               data: result_1
    //             }
    //           })
    //           res.end()
    //         })
    //       }else{
    //         res.json({
    //           err_code:0,
    //           message: null,
    //           data: {
    //             name: name,
    //             data: []
    //           }
    //         })
    //         res.end()
    //       }

    //     })
    //   }
    // }

    get_total_level_1_terminal_index_data(req,res,next){
      let t,f;
      if(req.query.to == "0" && req.query.fr == "0"){
        t = new Date().getTime();
        f = t - 24*60*60*1000 
      }else{
        t = req.query.to;
        f = req.query.fr;
      }
      let to = returnSQLDateFormat(t);
      let from = returnSQLDateFormat(f);
      let group = null;
      let name = "";
      let sql = "SELECT parent_id,meterTime, SUM(SUM_NHANH) AS SUM_NHANH FROM (SELECT group_relationship_demo_QN.parent_id as parent_id, wmeterdata.meterTime as meterTime, SUM(wmeterdata.terminal_index) AS SUM_NHANH FROM wmeterdata INNER JOIN group_relationship_demo_QN ON wmeterdata.ID = group_relationship_demo_QN.meter_id AND wmeterdata.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.parent_id = ? AND wmeterdata.meterTime >= ? AND wmeterdata.meterTime <= ? AND group_relationship_demo_QN.status = ? AND group_relationship_demo_QN.depth <> ? GROUP BY group_relationship_demo_QN.parent_id, wmeterdata.meterTime) as k GROUP BY parent_id, meterTime"
      if(req.user.role == "admin"){
        if(req.query.group_id == -1){
          accessDB("SELECT id,name FROM group_relationship_demo_QN WHERE group_relationship_demo_QN.depth = ? AND parent_id = ? AND `status` = ? ORDER BY id;",[0,0,1],function(result){
            if(result.length > 0){
              group = result[0].id;
              name = result[0].name;
              accessDB(sql,[group,from,to,1,-1],function(result_1){
                res.json({
                  err_code:0,
                  message: null,
                  data: {
                    name: result[0].name,
                    data: result_1
                  }
                })
                res.end()
              })
            }else{
              res.json({
                err_code:0,
                message: null,
                data: {
                  name: name,
                  data: []
                }
              })
              res.end()
            }
          })
        }else{
          group = req.query.group_id;
          accessDB("SELECT name FROM group_relationship_demo_QN WHERE id = ?;",[group],function(result){
            if(result.length > 0){
              accessDB(sql,[group,from,to,1,-1],function(result_1){
                res.json({
                  err_code:0,
                  message: null,
                  data: {
                    name: result[0].name,
                    data: result_1
                  }
                })
                res.end()
              })
            }else{
              res.json({
                err_code:0,
                message: null,
                data: {
                  name: name,
                  data: []
                }
              })
              res.end()
            }
          })
        }
      }else{
        group = req.user.group;
        accessDB("SELECT name FROM group_relationship_demo_QN WHERE id = ?;",[group],function(result){
          if(result.length > 0){
            accessDB(sql,[group,from,to,1,-1],function(result_1){
              res.json({
                err_code:0,
                message: null,
                data: {
                  name: result[0].name,
                  data: result_1
                }
              })
              res.end()
            })
          }else{
            res.json({
              err_code:0,
              message: null,
              data: {
                name: name,
                data: []
              }
            })
            res.end()
          }

        })
      }
    }
    get_level_1_main_map_data(req,res,next){
      let group_id = null;
      if(req.user.role == "admin"){
        if(req.query.group_id != -1){
          group_id = req.query.group_id;
          accessDB("call get_tree(?);",[group_id],function(result){
            if(result[0].length > 0){
              let child_data = result[0];
              let join_child = [];
              for(let i=0; i<child_data.length; i++){
                join_child.push(child_data[i].gr_id)
              }
              accessDB("SELECT totaleq.level_icon, totaleq.status_alert, totaleq.status_alert_SL, totaleq.status_alert_OP, totaleq.status_alert_APSUAT, totaleq.status_alert_PIN, totaleq.status_alert_ACQUY, totaleq.id AS meter_id, totaleq.serial_sensor, totaleq.`name`, totaleq.location_lat AS lat, totaleq.location_long AS lng, group_relationship_demo_QN.have_child, group_relationship_demo_QN.depth FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.id IN ("+return_in_sql(join_child)+") ; SELECT * FROM draw_map_demo_QN LEFT JOIN (SELECT * FROM data_lost_output WHERE data_lost_output.id IN (SELECT MAX(id) FROM data_lost_output GROUP BY data_lost_output.group_id)) AS dt_lost ON draw_map_demo_QN.group_id = dt_lost.group_id WHERE draw_map_demo_QN.group_id IN ("+return_in_sql(join_child)+");",[],function(result_1){
                res.json({
                  err_code:0,
                  message: null,
                  data: {
                    meter_location: result_1[0],
                    draw_map: result_1[1]
                  }
                })
                res.end()
              })
            }else{
              res.json({
                err_code:0,
                message: null,
                data: {
                  meter_location: [],
                  draw_map: []
                }
              })
              res.end()
            }
          })
        }else{
          accessDB("SELECT totaleq.level_icon AS level_icon,totaleq.status_alert, totaleq.status_alert_SL, totaleq.status_alert_OP, totaleq.status_alert_APSUAT, totaleq.status_alert_PIN, totaleq.status_alert_ACQUY, group_relationship_demo_QN.have_child AS have_child, group_relationship_demo_QN.id AS id, group_relationship_demo_QN.meter_id AS meter_id, totaleq.name AS name_totaleq, group_relationship_demo_QN.name AS name, group_relationship_demo_QN.parent_id AS parent_id, group_relationship_demo_QN.depth AS depth FROM group_relationship_demo_QN LEFT JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor WHERE group_relationship_demo_QN.depth <= ? AND group_relationship_demo_QN.depth >= ?  AND group_relationship_demo_QN.`status` = ? ORDER BY group_relationship_demo_QN.depth, group_relationship_demo_QN.id;",[1,0,1],function(result_2){
            if(result_2.length > 0){
              group_id = result_2[0].id;
              accessDB("call get_tree(?);",[group_id],function(result){
                if(result[0].length > 0){
                  let child_data = result[0];
                  let join_child = [];
                  for(let i=0; i<child_data.length; i++){
                    join_child.push(child_data[i].gr_id)
                  }
                  accessDB("SELECT totaleq.level_icon, totaleq.status_alert, totaleq.status_alert_SL, totaleq.status_alert_OP, totaleq.status_alert_APSUAT, totaleq.status_alert_PIN, totaleq.status_alert_ACQUY, totaleq.id AS meter_id, totaleq.serial_sensor, totaleq.`name`, totaleq.location_lat AS lat, totaleq.location_long AS lng, group_relationship_demo_QN.have_child, group_relationship_demo_QN.depth FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.id IN ("+return_in_sql(join_child)+") ; SELECT * FROM draw_map_demo_QN LEFT JOIN (SELECT * FROM data_lost_output WHERE data_lost_output.id IN (SELECT MAX(id) FROM data_lost_output GROUP BY data_lost_output.group_id)) AS dt_lost ON draw_map_demo_QN.group_id = dt_lost.group_id WHERE draw_map_demo_QN.group_id IN ("+return_in_sql(join_child)+");",[],function(result_1){
                    res.json({
                      err_code:0,
                      message: null,
                      data: {
                        meter_location: result_1[0],
                        draw_map: result_1[1]
                      }
                    })
                    res.end()
                  })
                }else{
                  res.json({
                    err_code:0,
                    message: null,
                    data: {
                      meter_location: [],
                      draw_map: []
                    }
                  })
                  res.end()
                }
              })
            }else{
              res.json({
                err_code:0,
                message: null,
                data: {
                  meter_location: [],
                  draw_map: []
                }
              })
              res.end()
            }
          })
        }
      }else{
        group_id = req.user.group;
        accessDB("call get_tree(?);",[group_id],function(result){
          if(result[0].length > 0){
            let child_data = result[0];
            let join_child = [];
            for(let i=0; i<child_data.length; i++){
              join_child.push(child_data[i].gr_id)
            }
            accessDB("SELECT totaleq.level_icon, totaleq.status_alert, totaleq.status_alert_SL, totaleq.status_alert_OP, totaleq.status_alert_APSUAT, totaleq.status_alert_PIN, totaleq.status_alert_ACQUY, totaleq.id AS meter_id, totaleq.serial_sensor, totaleq.`name`, totaleq.location_lat AS lat, totaleq.location_long AS lng, group_relationship_demo_QN.have_child, group_relationship_demo_QN.depth FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.id IN ("+return_in_sql(join_child)+"); SELECT * FROM draw_map_demo_QN LEFT JOIN (SELECT * FROM data_lost_output WHERE data_lost_output.id IN (SELECT MAX(id) FROM data_lost_output GROUP BY data_lost_output.group_id)) AS dt_lost ON draw_map_demo_QN.group_id = dt_lost.group_id WHERE draw_map_demo_QN.group_id IN ("+return_in_sql(join_child)+");",[],function(result_1){
              res.json({
                err_code:0,
                message: null,
                data: {
                  meter_location: result_1[0],
                  draw_map: result_1[1]
                }
              })
              res.end()
            })
          }else{
            res.json({
              err_code:0,
              message: null,
              data: {
                meter_location: [],
                draw_map: []
              }
            })
            res.end()
          }
        })
      }
      // accessDB("SELECT totaleq_demo_QN.level_icon ,totaleq_demo_QN.meter_id, totaleq_demo_QN.`name`, totaleq_demo_QN.location_lat AS lat, totaleq_demo_QN.location_long AS lng, group_relationship_demo_QN.have_child, group_relationship_demo_QN.depth FROM totaleq_demo_QN LEFT JOIN group_relationship_demo_QN ON totaleq_demo_QN.meter_id = group_relationship_demo_QN.meter_id; SELECT * FROM draw_map_demo_QN;",[],function(result){
      //   res.json({
      //     err_code:0,
      //     message: null,
      //     data: {
      //       meter_location: result[0],
      //       draw_map: result[1]
      //     }
      //   })
      //   res.end()
      // })
    }

    get_pie_chart_data_level_2(req,res,next){
      let group_id = req.query.node_id;
      let sql = "";
      let para = [];
      if(req.query.fr == 0 && req.query.to == 0){
        sql = "SELECT * FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? ORDER BY data_lost_output.meter_time DESC LIMIT 1; ";
        para = [group_id];
      }else{
        let from = null; let to = null;
        if(req.query.to == "-2" && req.query.fr == "-2"){
          from = returnSQLDateFormat(new Date().getTime() - 7*24*3600*1000)
          to = returnSQLDateFormat(new Date().getTime())
        }else if(req.query.to == "-3" && req.query.fr == "-3"){
          from = returnSQLDateFormat(new Date().getTime() - 30*24*3600*1000)
          to = returnSQLDateFormat(new Date().getTime())
        }else{
          from = returnSQLDateFormat(req.query.fr)
          to = returnSQLDateFormat(req.query.to)
        }
        sql = "SELECT group_setting.`name` AS `name`, SUM(data_lost_output.sum_tong) AS sum_tong, SUM(data_lost_output.sum_nhanh) AS sum_nhanh FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? GROUP BY data_lost_output.group_id,group_setting.`name`;";
        para = [group_id,from,to];
      }
      accessDB(sql,para,function(result){
        res.json({
          err_code:0,
          message: null,
          data: result[0]
        })
        res.end()
      })
    }

    get_ins_data_level_2(req,res,next){
      let group_id = req.query.node_id;
      accessDB("SELECT *, totaleq.id AS meter_id, totaleq.status AS status FROM totaleq INNER JOIN group_information_demo_QN ON totaleq.id = group_information_demo_QN.meter_id AND totaleq.serial_sensor = group_information_demo_QN.serial_sensor WHERE group_information_demo_QN.group_id = ?;",[group_id],function(result){
        res.json({
          err_code:0,
          message: null,
          data: result
        })
        res.end()
      })
    }

    get_level_2_data(req,res,next){
      let group_id = req.query.node_id;
      let sql = "";
      let para = [];
      if(req.query.type == "pie"){
        if(req.query.fr == 0 && req.query.to == 0){
          sql = "SELECT * FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? ORDER BY data_lost_output.meter_time DESC LIMIT 1; SELECT *, totaleq.id AS meter_id FROM totaleq RIGHT JOIN group_information_demo_QN ON totaleq.id = group_information_demo_QN.meter_id AND totaleq.serial_sensor = group_information_demo_QN.serial_sensor WHERE group_information_demo_QN.group_id = ?;";
          para = [group_id,group_id];
        }else{
          sql = "SELECT group_setting.`name` AS `name`, SUM(data_lost_output.sum_tong) AS sum_tong, SUM(data_lost_output.sum_nhanh) AS sum_nhanh FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? GROUP BY data_lost_output.group_id,group_setting.`name`; SELECT *, totaleq.id AS meter_id FROM totaleq RIGHT JOIN group_information_demo_QN ON totaleq.id = group_information_demo_QN.meter_id AND totaleq.serial_sensor = group_information_demo_QN.serial_sensor WHERE group_information_demo_QN.group_id = ?;";
          para = [group_id,returnSQLDateFormat(req.query.fr),returnSQLDateFormat(req.query.to),group_id];
        }
      }else{
        let t,f;
        if(req.query.to == "0" && req.query.fr == "0"){
          t = new Date().getTime();
          f = t - 24*60*60*1000 
        }else{
          t = req.query.to;
          f = req.query.fr;
        }
        // sql = "SELECT * FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? ORDER BY data_lost_output.meter_time; SELECT *, totaleq.id AS meter_id FROM totaleq RIGHT JOIN group_information_demo_QN ON totaleq.id = group_information_demo_QN.meter_id AND totaleq.serial_sensor = group_information_demo_QN.serial_sensor WHERE group_information_demo_QN.group_id = ?; SELECT SUM(pressure) AS pressure, SUM(flowRate) AS flowRate, meterTime FROM wmeterdata WHERE ID IN (SELECT meter_id FROM group_information_demo_QN WHERE group_id = ? AND nhanh_tong = ?) AND serial_sensor IN (SELECT serial_sensor FROM group_information_demo_QN WHERE group_id = ? AND nhanh_tong = ?) AND meterTime > ? AND meterTime < ? GROUP BY meterTime;";
        // para = [group_id,returnSQLDateFormat(f),returnSQLDateFormat(t),group_id,group_id,1,group_id,1,returnSQLDateFormat(f),returnSQLDateFormat(t)];
      }
      accessDB(sql,para,function(result){
        res.json({
          err_code:0,
          message: null,
          data: {
            lost_output_data: result[0],
            instant_data_tong: result[1],
            other_data: result[2]
          }
        })
        res.end()
      })
    }
    get_level_2_line_chart_data(req,res,next){
      let group_id = req.query.node_id;
      let t,f;
      if(req.query.to == "0" && req.query.fr == "0"){
        t = new Date().getTime();
        f = t - 24*60*60*1000 
      }else{
        t = req.query.to;
        f = req.query.fr;
      }
      let to = returnSQLDateFormat(t);
      let from = returnSQLDateFormat(f);
      accessDB("SELECT totaleq.name FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.id = ?;SELECT * FROM wmeterdata INNER JOIN group_relationship_demo_QN ON wmeterdata.ID = group_relationship_demo_QN.meter_id AND wmeterdata.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.id = ? AND wmeterdata.meterTime >= ? AND wmeterdata.meterTime <= ?;",[group_id,group_id,from,to],function(result){
        res.json({
          err_code:0,
          message: null,
          data: { data: result[1], name: result[0]}
        })
        res.end()
      })
    }
    get_level_2_main_map_data(req,res,next){
      let group_id = req.query.node_id;
      accessDB("call get_tree(?); SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.id = ?; SELECT *, dt_lost.status AS status FROM draw_map_demo_QN INNER JOIN group_relationship_demo_QN ON draw_map_demo_QN.group_id = group_relationship_demo_QN.id LEFT JOIN (SELECT * FROM data_lost_output WHERE data_lost_output.id IN (SELECT MAX(id) FROM data_lost_output GROUP BY data_lost_output.group_id)) AS dt_lost ON draw_map_demo_QN.group_id = dt_lost.group_id WHERE group_relationship_demo_QN.id = ? OR group_relationship_demo_QN.parent_id = ?;",[group_id,group_id,group_id,group_id],function(result){
        if(result[2].length > 0){
          result[0].push(result[2][0]);
        }
        res.json({
          err_code:0,
          message: null,
          data: {
            meter_location: result[0],
            draw_map: result[3]
          }
        })
        res.end()
      })
    }
    get_ins_data_level_3(req,res,next){
      let node_id = req.query.node_id;
      accessDB("SELECT *, totaleq.`status` AS status, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor INNER JOIN group_information_demo_QN ON totaleq.id = group_information_demo_QN.meter_id AND totaleq.serial_sensor = group_information_demo_QN.serial_sensor WHERE (group_relationship_demo_QN.id = ? OR group_relationship_demo_QN.parent_id = ?) AND group_information_demo_QN.group_id = ?;",[node_id,node_id,node_id],function(result){
        res.json({
          err_code:0,
          message: null,
          data: result
        })
        res.end()
      })
    }

    get_pie_chart_data_level_3(req,res,next){
      let node_id = req.query.node_id;
      let sql = "";
      let para = [];
      if(req.query.fr == "0" && req.query.to == "0"){
        sql = "SELECT * FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? ORDER BY data_lost_output.meter_time DESC LIMIT 1;";
        para = [node_id];
      }else{
        let from, to;
        switch(req.query.to +""+ req.query.fr){
          case "-1-1":
            to = returnSQLDateFormat(new Date().getTime());
            from = returnSQLDateFormat(new Date().getTime() - 24*3600000);
            break;
          case "-2-2":
            to = return_sql_to_day_format(new Date().getTime());
            from = return_sql_fr_day_format(new Date().getTime() - 7*24*3600000);
            break;
          case "-3-3":
            to = return_sql_to_day_format(new Date().getTime());
            from = return_sql_fr_day_format(new Date().getTime() - 30*24*3600000);
            break;
          default:
            to = return_sql_to_day_format(Number(req.query.to));
            from = return_sql_fr_day_format(Number(req.query.fr));
            break;
        }
        sql = "SELECT group_setting.`name` AS `name`, SUM(data_lost_output.sum_tong) AS sum_tong, SUM(data_lost_output.sum_nhanh) AS sum_nhanh FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? GROUP BY data_lost_output.group_id,group_setting.`name`;";
        para = [node_id,from,to];
      }
      accessDB(sql,para,function(result){
        if(result.length > 0){
          res.json({
            err_code:0,
            message: null,
            data:  result
          })
          res.end() 
        }else{
          res.json({
            err_code: 1,
            message: "Không có dữ liệu thất thoát",
            data:  []
          })
          res.end() 
        }
        })
    }

    get_line_chart_data_level_3(req,res,next){
      let from, to;
      let node_id = req.query.node_id;
      if((req.query.to == "0" && req.query.fr == "0") || (req.query.to == "-1" && req.query.fr == "-1")){
        from = returnSQLDateFormat(new Date().getTime() - 24*3600000)
        to = returnSQLDateFormat(new Date().getTime())
      }else if(req.query.to == "-2" && req.query.fr == "-2"){
        from = return_sql_day_format(new Date().getTime() - 7*24*3600000)
        to = return_sql_day_format(new Date().getTime())
      }else if(req.query.to == "-3" && req.query.fr == "-3"){
        from = return_sql_day_format(new Date().getTime() - 30*24*3600000)
        to = return_sql_day_format(new Date().getTime())
      }else{
        from = returnSQLDateFormat(req.query.fr)
        to = returnSQLDateFormat(req.query.to)
      }
      accessDB("SELECT meter_id, serial_sensor FROM group_information_demo_QN WHERE group_id = ? AND nhanh_tong = ?;",[node_id,1],function(result){
        let sql = "";
        let para = [node_id,from,to];
        let meter_id_arr = []
        if((req.query.to == "-2" && req.query.fr == "-2") || (req.query.to == "-3" && req.query.fr == "-3")){
          for(let i=0; i<result.length; i++){
            sql += 'SELECT m.ID, m.serial_sensor, DATE( w.meterTime ) AS meterTime, m.minMeterTime, m.pressure, w.ValOfNum FROM (SELECT ID, serial_sensor, MIN(meterTime) AS minMeterTime, AVG( flowRate ) AS flowRate, AVG( pressure ) AS pressure FROM wmeterdata WHERE DATE( meterTime ) >= ? AND DATE( meterTime ) <= ? AND id = ? AND serial_sensor = ? GROUP BY ID, serial_sensor, DATE( meterTime ) UNION ALL SELECT ID, serial_sensor, MAX( meterTime ) AS maxMeterTime, 0 AS flowRate, 0 AS pressure FROM wmeterdata WHERE DATE( meterTime ) >= ? AND DATE( meterTime ) <= ? AND id = ? AND serial_sensor = ? GROUP BY ID, serial_sensor ) AS m JOIN wmeterdata AS w ON w.ID = m.ID AND w.serial_sensor = m.serial_sensor WHERE w.meterTime = m.minMeterTime;'
            para.push(from,to,result[i].meter_id,result[i].serial_sensor,from,to,result[i].meter_id,result[i].serial_sensor)
            meter_id_arr.push(result[i].meter_id)
          }
           sql = "SELECT DATE(data_lost_output.meter_time) as meter_time, SUM(sum_tong) AS sum_tong, SUM(sum_nhanh) AS sum_nhanh FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? AND DATE(data_lost_output.meter_time) >= ? AND DATE(data_lost_output.meter_time) <= ? GROUP BY DATE(meter_time)  ORDER BY DATE(meter_time); " + sql;
          accessDB(sql,para,function(result_2){
            res.json({
              err_code:0,
              message: null,
              data: {
                data: result_2,
                meter_id_arr: meter_id_arr
              }
            })
            res.end()
          })
        }else{
          for(let i=0; i<result.length; i++){
            sql += 'SELECT * FROM wmeterdata WHERE id = ? AND serial_sensor = ? AND meterTime >= ? AND meterTime <= ?;'
            para.push(result[i].meter_id,result[i].serial_sensor,from,to)
            meter_id_arr.push(result[i].meter_id)
          }
           sql = "SELECT * FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? ORDER BY data_lost_output.meter_time; " + sql;
          accessDB(sql,para,function(result_2){
            res.json({
              err_code:0,
              message: null,
              data: {
                data: result_2,
                meter_id_arr: meter_id_arr
              }
            })
            res.end()
          })
        }
      })
    }

    get_line_chart_data_level_2(req,res,next){
      let from, to;
      let node_id = req.query.node_id;
      if(req.query.to == "-2" && req.query.fr == "-2"){
        from = return_sql_day_format(new Date().getTime() - 7*24*3600*1000)
        to = return_sql_day_format(new Date().getTime())
      }else if(req.query.to == "-3" && req.query.fr == "-3"){
        from = return_sql_day_format(new Date().getTime() - 30*24*3600*1000)
        to = return_sql_day_format(new Date().getTime())
      }else if(req.query.to == "0" && req.query.fr == "0"){
        from = returnSQLDateFormat(new Date().getTime() - 24*3600*1000)
        to = returnSQLDateFormat(new Date().getTime())
      }else{
        from = returnSQLDateFormat(req.query.fr)
        to = returnSQLDateFormat(req.query.to)
      }
      accessDB("SELECT meter_id, serial_sensor FROM group_information_demo_QN WHERE group_id = ? AND nhanh_tong = ?;",[node_id,1],function(result){
        let sql = "";
        let para = [node_id,from,to];
        let meter_id_arr = []
        if((req.query.to == "-2" && req.query.fr == "-2") || (req.query.to == "-3" && req.query.fr == "-3")){
          for(let i=0; i<result.length; i++){
            sql += 'SELECT m.ID, m.serial_sensor, DATE( w.meterTime ) AS meterTime, m.minMeterTime, m.pressure, w.ValOfNum FROM (SELECT ID, serial_sensor, MIN(meterTime) AS minMeterTime, AVG( flowRate ) AS flowRate, AVG( pressure ) AS pressure FROM wmeterdata WHERE DATE( meterTime ) >= ? AND DATE( meterTime ) <= ? AND id = ? AND serial_sensor = ? GROUP BY ID, serial_sensor, DATE( meterTime ) UNION ALL SELECT ID, serial_sensor, MAX( meterTime ) AS maxMeterTime, 0 AS flowRate, 0 AS pressure FROM wmeterdata WHERE DATE( meterTime ) >= ? AND DATE( meterTime ) <= ? AND id = ? AND serial_sensor = ? GROUP BY ID, serial_sensor ) AS m JOIN wmeterdata AS w ON w.ID = m.ID AND w.serial_sensor = m.serial_sensor WHERE w.meterTime = m.minMeterTime;'
            para.push(from,to,result[i].meter_id,result[i].serial_sensor,from,to,result[i].meter_id,result[i].serial_sensor)
            meter_id_arr.push(result[i].meter_id)
          }
           sql = "SELECT DATE(data_lost_output.meter_time) as meter_time, SUM(sum_tong) AS sum_tong, SUM(sum_nhanh) AS sum_nhanh FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? AND DATE(data_lost_output.meter_time) >= ? AND DATE(data_lost_output.meter_time) <= ? GROUP BY DATE(meter_time)  ORDER BY DATE(meter_time); " + sql;
          accessDB(sql,para,function(result_2){
            res.json({
              err_code:0,
              message: null,
              data: {
                data: result_2,
                meter_id_arr: meter_id_arr
              }
            })
            res.end()
          })
        }else{
          for(let i=0; i<result.length; i++){
            sql += 'SELECT * FROM wmeterdata WHERE id = ? AND serial_sensor = ? AND meterTime >= ? AND meterTime <= ?;'
            para.push(result[i].meter_id,result[i].serial_sensor,from,to)
            meter_id_arr.push(result[i].meter_id)
          }
           sql = "SELECT * FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? ORDER BY data_lost_output.meter_time; " + sql;
          accessDB(sql,para,function(result_2){
            res.json({
              err_code:0,
              message: null,
              data: {
                data: result_2,
                meter_id_arr: meter_id_arr
              }
            })
            res.end()
          })
        }
      })
    }

    get_data_level_3(req,res,next){
      let node_id = req.query.node_id;
      let sql = "";
      let para = [];
      if(req.query.type == "pie"){
        if(req.query.fr == 0 && req.query.to == 0){
          sql = "SELECT *, totaleq.`status` AS status, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor INNER JOIN group_information_demo_QN ON totaleq.id = group_information_demo_QN.meter_id AND totaleq.serial_sensor = group_information_demo_QN.serial_sensor WHERE (group_relationship_demo_QN.id = ? OR group_relationship_demo_QN.parent_id = ?) AND group_information_demo_QN.group_id = ?;SELECT * FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? ORDER BY data_lost_output.meter_time DESC LIMIT 1;";
          para = [node_id,node_id,node_id,node_id];
        }else{
          sql = "SELECT *, totaleq.`status` AS status, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor INNER JOIN group_information_demo_QN ON totaleq.id = group_information_demo_QN.meter_id AND totaleq.serial_sensor = group_information_demo_QN.serial_sensor WHERE (group_relationship_demo_QN.id = ? OR group_relationship_demo_QN.parent_id = ?) AND group_information_demo_QN.group_id = ?;SELECT group_setting.`name` AS `name`, SUM(data_lost_output.sum_tong) AS sum_tong, SUM(data_lost_output.sum_nhanh) AS sum_nhanh FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? GROUP BY data_lost_output.group_id,group_setting.`name`;";
          para = [node_id,node_id,node_id,node_id,returnSQLDateFormat(req.query.fr),returnSQLDateFormat(req.query.to)];
        }
        accessDB(sql,para,function(result){
          if(result[0].length > 0){
            res.json({
              err_code:0,
              message: null,
              data: {
                have_child: 1,
                ins_data: result[0],
                lost_data: result[1],
                other_data: result[2]
              }
            })
            res.end() }
          // }else{
          //   let sql_2 = "";
          //   let para_2 = [];
          //   if(req.query.type == "pie"){
          //     if(req.query.fr == 0 && req.query.to == 0){
          //       sql_2 = "SELECT *, totaleq.`status` AS status, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE (group_relationship_demo_QN.id = ? OR group_relationship_demo_QN.parent_id = ?); SELECT * FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? ORDER BY data_lost_output.meter_time DESC LIMIT 1;";
          //       para_2 = [node_id,node_id,node_id];
          //     }else{
          //       sql_2 = "SELECT *, totaleq.`status` AS status, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE (group_relationship_demo_QN.id = ? OR group_relationship_demo_QN.parent_id = ?); SELECT group_setting.`name` AS `name`, SUM(data_lost_output.sum_tong) AS sum_tong, SUM(data_lost_output.sum_nhanh) AS sum_nhanh FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? GROUP BY data_lost_output.group_id,group_setting.`name`;";
          //       para_2 = [node_id,node_id,node_id,returnSQLDateFormat(req.query.fr),returnSQLDateFormat(req.query.to)];
          //     }
          //   }else{
          //     let t,f;
          //     if(req.query.to == "0" && req.query.fr == "0"){
          //       t = new Date().getTime();
          //       f = t - 24*60*60*1000 
          //     }else{
          //       t = req.query.to;
          //       f = req.query.fr;
          //     }
          //     sql_2 = "SELECT *, totaleq.`status` AS status, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE (group_relationship_demo_QN.id = ? OR group_relationship_demo_QN.parent_id = ?); SELECT * FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? ORDER BY data_lost_output.meter_time;";
          //     para_2 = [node_id,node_id,node_id,returnSQLDateFormat(f),returnSQLDateFormat(t)];
          //   }
          //   accessDB(sql_2,para_2,function(result_2){
          //     res.json({
          //       err_code:0,
          //       message: null,
          //       data: {
          //         have_child: 0,
          //         ins_data: result_2[0],
          //         lost_data: result_2[1],
          //         other_data: []
          //       }
          //     })
          //     res.end()
          //   })
          // } 
        })
      }else{
        let from, to;
        if(req.query.to == "-2" && req.query.fr == "-2"){
          from = return_sql_day_format(new Date().getTime() - 7*24*3600*1000)
          to = return_sql_day_format(new Date().getTime())
        }else if(req.query.to == "-3" && req.query.fr == "-3"){
          from = return_sql_day_format(new Date().getTime() - 30*24*3600*1000)
          to = return_sql_day_format(new Date().getTime())
        }else{
          from = returnSQLDateFormat(req.query.fr)
          to = returnSQLDateFormat(req.query.to)
        }
        accessDB("SELECT meter_id, serial_sensor FROM group_information_demo_QN WHERE group_id = ? AND nhanh_tong = ?;",[node_id],function(result){
          let sql = "";
          let para = [node_id,from,to];
          if((req.query.to == "-2" && req.query.fr == "-2") || (req.query.to == "-3" && req.query.fr == "-3")){
            for(let i=0; i<result.length; i++){
              sql += 'SELECT m.ID, m.serial_sensor, DATE( w.meterTime ) AS meterTime, m.minMeterTime, m.pressure, w.ValOfNum FROM (SELECT ID, serial_sensor, MIN(meterTime) AS minMeterTime, AVG( flowRate ) AS flowRate, AVG( pressure ) AS pressure FROM wmeterdata WHERE DATE( meterTime ) >= ? AND DATE( meterTime ) <= ? AND id = ? AND serial_sensor = ? GROUP BY ID, serial_sensor, DATE( meterTime ) UNION ALL SELECT ID, serial_sensor, MAX( meterTime ) AS maxMeterTime, 0 AS flowRate, 0 AS pressure FROM wmeterdata WHERE DATE( meterTime ) >= ? AND DATE( meterTime ) <= ? AND id = ? AND serial_sensor = ? GROUP BY ID, serial_sensor ) AS m JOIN wmeterdata AS w ON w.ID = m.ID AND w.serial_sensor = m.serial_sensor WHERE w.meterTime = m.minMeterTime;'
              para.push(from,to,result[i].meter_id,result[i].serial_sensor,from,to,result[i].meter_id,result[i].serial_sensor)
            }
             sql = "SELECT DATE(meter_time), SUM(sum_tong) AS sum_tong, SUM(sum_nhanh) AS sum_nhanh FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? ORDER BY data_lost_output.meter_time;" + sql;
            accessDB(sql,para,function(result_2){
              res.json({
                err_code:0,
                message: null,
                data: result_2
              })
              res.end()
            })
          }else{
            for(let i=0; i<result.length; i++){
              sql += 'SELECT * FROM wmeterdata WHERE id = ? AND serial_sensor = ? AND meterTime >= ? AND meterTime <= ?;'
              para.push(result[i].meter_id,result[i].serial_sensor,from,to)
            }
             sql = "SELECT DATE(meter_time), SUM(sum_tong) AS sum_tong, SUM(sum_nhanh) AS sum_nhanh FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? ORDER BY data_lost_output.meter_time;" + sql;
            accessDB(sql,para,function(result_2){
              res.json({
                err_code:0,
                message: null,
                data: result_2
              })
              res.end()
            })
          }
        })
        // let t,f;
        // if(req.query.to == "0" && req.query.fr == "0"){
        //   t = new Date().getTime();
        //   f = t - 24*60*60*1000 
        // }else{
        //   t = req.query.to;
        //   f = req.query.fr;
        // }

        // sql = "SELECT *, totaleq.`status` AS status, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor INNER JOIN group_information_demo_QN ON totaleq.id = group_information_demo_QN.meter_id AND totaleq.serial_sensor = group_information_demo_QN.serial_sensor WHERE (group_relationship_demo_QN.id = ? OR group_relationship_demo_QN.parent_id = ?) AND group_information_demo_QN.group_id = ?;SELECT * FROM data_lost_output LEFT JOIN group_setting ON data_lost_output.group_id = group_setting.group_id WHERE data_lost_output.group_id = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? ORDER BY data_lost_output.meter_time; SELECT SUM(pressure) AS pressure, SUM(flowRate) AS flowRate, meterTime FROM wmeterdata WHERE ID IN (SELECT meter_id FROM group_information_demo_QN WHERE group_id = ? AND nhanh_tong = ?) AND serial_sensor IN (SELECT serial_sensor FROM group_information_demo_QN WHERE group_id = ? AND nhanh_tong = ?) AND meterTime > ? AND meterTime < ? GROUP BY meterTime;";
        // para = [node_id,node_id,node_id,node_id,returnSQLDateFormat(f),returnSQLDateFormat(t),node_id,1,node_id,1,returnSQLDateFormat(f),returnSQLDateFormat(t)];
      }






      
      // accessDB("SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor INNER JOIN group_information_demo_QN ON totaleq.id = group_information_demo_QN.meter_id AND totaleq.serial_sensor = group_information_demo_QN.serial_sensor WHERE (group_relationship_demo_QN.id = ? OR group_relationship_demo_QN.parent_id = ?) AND group_information_demo_QN.group_id = ?; SELECT * FROM data_lost_output WHERE group_id = ? ORDER BY meter_time DESC LIMIT 1;",[node_id,node_id,node_id,node_id],function(result){
      //   if(result[0].length > 0){
      //     res.json({
      //       err_code:0,
      //       message: null,
      //       data: {
      //         ins_data: result[0],
      //         lost_data: result[1]
      //       }
      //     })
      //     res.end()
      //   }else{
      //     accessDB("SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE (group_relationship_demo_QN.id = ? OR group_relationship_demo_QN.parent_id = ?); SELECT * FROM data_lost_output WHERE group_id = ? ORDER BY meter_time DESC LIMIT 1;",[node_id,node_id,node_id],function(result_2){
      //       res.json({
      //         err_code:0,
      //         message: null,
      //         data: {
      //           ins_data: result_2[0],
      //           lost_data: result_2[1]
      //         }
      //       })
      //       res.end()
      //     })
      //     }

      // })
    }
    get_meter_id_node_id(req,res,next){
      let meter_id = req.query.meter_id;
      let serial_sensor = req.query.serial_sensor;
      let node_id = req.query.node_id;
      let SQL_query = "";
      if(meter_id != null && meter_id != "" && meter_id != "null" && serial_sensor != null && serial_sensor != "" && serial_sensor != "null"){
        SQL_query = "SELECT group_relationship_demo_QN.id AS node_id FROM group_relationship_demo_QN INNER JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor WHERE totaleq.id = ? AND totaleq.serial_sensor = ?;"
        accessDB(SQL_query,[meter_id,serial_sensor],function(result){
          if(result.length > 0){
            res.json({
              err_code:0,
              message: null,
              data: {node_id: result[0].node_id, meter_id: meter_id, serial_sensor:serial_sensor}
            })
            res.end()
          }else{
            res.json({
              err_code:1,
              message: "Không có node_id với meter id :" + meter_id,
              data: []
            })
            res.end()
          }
        })
    }else if(node_id != null && node_id != "" && node_id != "null"){
      SQL_query = "SELECT meter_id, serial_sensor FROM group_relationship_demo_QN WHERE id = ?;"
      accessDB(SQL_query,[node_id],function(result){
        if(result.length > 0){
          res.json({
            err_code:0,
            message: null,
            data: {meter_id: result[0].meter_id, serial_sensor:result[0].serial_sensor, node_id: node_id}
          })
          res.end()
        }else{
          res.json({
            err_code:1,
            message: "Không có meter id với node id :" + node_id,
            data: []
          })
          res.end()
        }
      })
    }else{
      res.json({
        err_code:1,
        message: "meter id và node id không hợp lệ",
        data: []
      })
      res.end()
    }
  }
  get_data_zooming_chart(req,res,next){
    let meter_id = req.query.meter_id;
    let serial_sensor = req.query.serial_sensor;
    let sql = "";
    let arr_sql = [];
    let to, from;
    if(req.query.fr == "0" && req.query.to == "0"){
      sql = "SELECT * FROM data_lost_output INNER JOIN group_relationship_demo_QN ON data_lost_output.group_id = group_relationship_demo_QN.id WHERE group_relationship_demo_QN.meter_id = ? AND group_relationship_demo_QN.serial_sensor = ? ORDER BY data_lost_output.meter_time DESC LIMIT 1;"
      arr_sql = [meter_id, serial_sensor]
    }else{
      switch(req.query.to +""+ req.query.fr){
        case "-1-1":
          to = returnSQLDateFormat(new Date().getTime());
          from = returnSQLDateFormat(new Date().getTime() - 24*3600000);
          break;
        case "-2-2":
          to = return_sql_to_day_format(new Date().getTime());
          from = return_sql_fr_day_format(new Date().getTime() - 7*24*3600000);
          break;
        case "-3-3":
          to = return_sql_to_day_format(new Date().getTime());
          from = return_sql_fr_day_format(new Date().getTime() - 30*24*3600000);
          break;
        default:
          to = return_sql_to_day_format(Number(req.query.to));
          from = return_sql_fr_day_format(Number(req.query.fr));
          break;
      }
      sql = "SELECT SUM(sum_tong) AS sum_tong, SUM(sum_nhanh) AS sum_nhanh, group_relationship_demo_QN.name AS name FROM data_lost_output INNER JOIN group_relationship_demo_QN ON data_lost_output.group_id = group_relationship_demo_QN.id WHERE group_relationship_demo_QN.meter_id = ? AND group_relationship_demo_QN.serial_sensor = ? AND data_lost_output.meter_time >= ? AND data_lost_output.meter_time <= ? GROUP BY data_lost_output.group_id;"
      arr_sql = [meter_id, serial_sensor, from, to]
    }
    accessDB(sql,arr_sql,function(result){
      if(result.length > 0){
        res.json({
          err_code:0,
          message: null,
          data: result[0]
        })
        res.end()
      }else{
        res.json({
          err_code:1,
          message: "Thiết bị này chưa có thất thoát",
          data: []
        })
        res.end()
      }
    })
  }
  data_lost_output_chart_data(req,res,next){
    let from = returnSQLDateFormat(req.query.fr);
    let to = returnSQLDateFormat(req.query.to);
    let node_id = req.query.node_id;
    accessDB("SELECT * FROM data_lost_output WHERE group_id = ? AND meter_time >= ? AND meter_time <= ?;",[node_id,from,to],function(result){
      res.json({
        err_code: 0,
        message: null,
        data: result
      })
      res.end()
    })
  }

  export_lostdataoutput(req,res,next){
    let to, from;
    if((req.query.to == "0" && req.query.fr == "0") || (req.query.to == "-1" && req.query.fr == "-1")){
      to = returnSQLDateFormat(new Date().getTime());
      from = returnSQLDateFormat(new Date().getTime() - 24*3600000) 
    }else if(req.query.to == "-2" && req.query.fr == "2"){
      to = return_sql_to_day_format(new Date().getTime());
      from = return_sql_fr_day_format(new Date().getTime() - 7*24*3600000) 
    }else if(req.query.to == "-3" && req.query.fr == "-3"){
      to = return_sql_to_day_format(new Date().getTime());
      from = return_sql_fr_day_format(new Date().getTime() - 30*24*3600000) 
    }else{
      to = returnSQLDateFormat(req.query.to);
      from = returnSQLDateFormat(req.query.fr);
    }
    let group_id = req.query.group_id;
    export_lost_data(req,res,group_id,from,to);
  }
  get_datalostoutput_setting(req,res,next){
    let group_id = req.query.group_id;
    accessDB("SELECT * FROM group_setting LEFT JOIN draw_map_demo_QN ON group_setting.group_id = draw_map_demo_QN.group_id WHERE group_setting.group_id = ?;",[group_id],function(result){
      if(result.length > 0){
        res.json({
          err_code: 0,
          message: null,
          data: result[0]
        })
        res.end()
      }else{
        res.json({
          err_code: 1,
          message: "group id không tồn tại",
          data: []
        })
        res.end()
      }
    })
  }
  post_save_setting_datalostoutput(req,res,next){
    let data = req.body;
    accessDB("UPDATE group_setting SET name=?, lost_threshold = ?, fre_lost_alert = ?, note=?, offset = ?, actual_length = ? WHERE group_id = ?;",[data.name_group, data.lost_data_threshold, data.fre_check_lost_data, data.setting_group_note, data.offset_group, data.actual_length, data.group_id],function(result){
      res.json({
        err_code: 0,
        message: "Cập nhật thành công",
        data: []
      })
      res.end()
    })
  }

  get_genera_data(req,res,next){
    let node_id = null;
    let today = return_sql_day_format(new Date().getTime())
    if(req.user.role == "admin"){
      if(req.query.node_id == "-1"){
        accessDB("SELECT * FROM group_relationship_demo_QN WHERE parent_id = ? AND depth = ? AND status = ? ORDER BY id LIMIT 1;",[0,0,1],function(result){
          if(result.length > 0){
            node_id = result[0].id;
            accessDB("call get_tree_test(?);",[node_id],function(result_2){
              res.json({
                err_code: 0,
                message: "",
                data: {
                  status_meter: result_2[0][0].mpm.toString()
                }
              })
              res.end()
            })
          }else{
            res.json({
              err_code: 1,
              message: "Node id không chính xác",
              data: []
            })
            res.end()
          }
        })
      }else{
        node_id = req.query.node_id;
        accessDB("call get_tree_test(?);",[node_id],function(result_2){
          res.json({
            err_code: 0,
            message: "",
            data: {
              status_meter: result_2[0][0].mpm.toString()
            }
          })
          res.end()
        })
      }
    }else{
      if(req.query.node_id == "-1"){
        node_id = req.user.group;
        accessDB("call get_tree_test(?);",[node_id],function(result_2){
          res.json({
            err_code: 0,
            message: "",
            data: {
              status_meter: result_2[0][0].mpm.toString()
            }
          })
          res.end()
        })
      }else{
        node_id = req.query.node_id;
        accessDB("call get_tree_test(?);",[node_id],function(result_2){
          res.json({
            err_code: 0,
            message: "",
            data: {
              status_meter: result_2[0][0].mpm.toString()
            }
          })
          res.end()
        })
      }
    }
  }
  get_log(req,res,next){
    let meter_id = req.query.meter_id;
    let serial_sensor = req.query.serial_sensor;
    let to = returnSQLDateFormat(req.query.to);
    let from = returnSQLDateFormat(req.query.fr);
    accessDB("SELECT * FROM log_data WHERE meter_id = ? AND serial_sensor = ? AND created_at >= ? AND created_at <= ?;",[meter_id,serial_sensor,from,to],function(result){
        res.send(result)
        res.end()
    })
  }
  export_meter_list(req,res,next){
    let node_id = null;
    if(req.user.role == 'admin'){
      if(req.query.group_id == "-1"){
        accessDB("SELECT * FROM group_relationship_demo_QN WHERE parent_id = ? AND depth = ? AND status = ? ORDER BY id LIMIT 1;",[0,0,1],function(result){
          if(result.length > 0){
            node_id = result[0].id
            export_meter_list(req,res,node_id);
          }else{
            res.json({
              err_code: 0,
              message: "Group id không tồn tại",
              data: []
            })
            res.end()
          }
        })
      }else{
        export_meter_list(req,res,req.query.group_id);
      }
    }else{        
      if(req.query.group_id == "-1"){
        node_id = req.user.group;
        export_meter_list(req,res,node_id);
      }else{
        export_meter_list(req,res,req.query.group_id);
      }
    }
    add_log(null,null,returnSQLDateFormat(new Date().getTime()),"Xuất dữ liệu danh sách các thiết bị",req.user.usr);
  }
    get_data_level_4(req,res,next){
      let node_id = req.query.node_id;
      accessDB("SElECT *, totaleq.id AS meter_id, totaleq.status AS status FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.id = ?;",[node_id],function(result){
        if(result.length > 0){
          let meter_id = result[0].meter_id;
          let serial_sensor = result[0].serial_sensor;
          accessDB("SELECT meterTime, pressure, flowRate, terminal_index  FROM wmeterdata WHERE ID = ? AND serial_sensor = ? AND meterTime >= ? AND meterTime <= ? ORDER BY meterTime;",[meter_id,serial_sensor,returnSQLDateFormat(new Date().getTime() - 24*3600000),returnSQLDateFormat(new Date().getTime())],function(result_2){
            res.json({
              err_code: 0,
              message: "",
              data: {
                ins_data: result[0],
                chart_data: result_2
              }
            })
            res.end()
          })
        }else{
          res.json({
            err_code: 1,
            message: "Node id không tồn tại",
            data: []
          })
          res.end()
        }
      })
    }
    get_export_alert(req,res,next){
      export_alert_data(req,res);
    }
    
    get_mess_rate(req,res,next){
      let node_id = null;
      let today = return_sql_day_format(new Date().getTime())
      // let depth = req.query.depth

      if(req.user.role == "admin"){
        if(req.query.node_id == "-1"){
          accessDB("SELECT * FROM group_relationship_demo_QN WHERE parent_id = ? AND depth = ? AND status = ? ORDER BY id LIMIT 1;",[0,0,1],function(result){
            if(result.length > 0){
              node_id = result[0].id;
              accessDB("SELECT * FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.parent_id = ?;",[node_id],function(result_2){
                let sql = "";
                let para = [];
                for(let i=0; i<result_2.length; i++){
                  sql += " call getTimes(?,?,?,?);";
                  para.push(today,result_2[i].frequency,result_2[i].meter_id, result_2[i].serial_sensor);
                }
                accessDB(sql, para,function(result_3){
                  res.json({
                    err_code: 0,
                    message: "",
                    data: {
                      mess_rate: result_3
                    }
                  })
                  res.end()
                })
              })
            }else{
              res.json({
                err_code: 1,
                message: "Node id không chính xác",
                data: []
              })
              res.end()
            }
          })
        }else{
          node_id = req.query.node_id;
          accessDB("SELECT * FROM group_relationship_demo_QN WHERE id = ?;",[node_id],function(result){
            if(result.length > 0){
              if(result[0].depth == 0){
                accessDB("SELECT * FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.parent_id = ?;",[node_id],function(result_2){
                  let sql = "";
                  let para = [];
                  for(let i=0; i<result_2.length; i++){
                    sql += " call getTimes(?,?,?,?);";
                    para.push(today,result_2[i].frequency,result_2[i].meter_id, result_2[i].serial_sensor);
                  }
                  accessDB(sql, para,function(result_3){
                    res.json({
                      err_code: 0,
                      message: "",
                      data: {
                        mess_rate: result_3
                      }
                    })
                    res.end()
                  })
                })
              }else{
                accessDB("SELECT * FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.id = ?;",[node_id],function(result_2){
                  let sql = "";
                  let para = [];
                  for(let i=0; i<result_2.length; i++){
                    sql += " call getTimes(?,?,?,?);";
                    para.push(today,result_2[i].frequency,result_2[i].meter_id, result_2[i].serial_sensor);
                  }
                  accessDB(sql, para,function(result_3){
                    res.json({
                      err_code: 0,
                      message: "",
                      data: {
                        mess_rate: result_3
                      }
                    })
                    res.end()
                  })
                })
              }
            }else{
              res.json({
                err_code: 1,
                message: "Node id không chính xác",
                data: []
              })
              res.end()
            }
          })
        }
      }else{
        if(req.query.node_id == "-1"){
          node_id = req.user.group;
          accessDB("SELECT * FROM group_relationship_demo_QN WHERE id = ?;",[node_id],function(result){
            if(result.length > 0){
              if(result[0].depth == 0){
                accessDB("SELECT * FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.parent_id = ?;",[node_id],function(result_2){
                  let sql = "";
                  let para = [];
                  for(let i=0; i<result_2.length; i++){
                    sql += " call getTimes(?,?,?,?);";
                    para.push(today,result_2[i].frequency,result_2[i].meter_id, result_2[i].serial_sensor);
                  }
                  accessDB(sql, para,function(result_3){
                    res.json({
                      err_code: 0,
                      message: "",
                      data: {
                        mess_rate: result_3
                      }
                    })
                    res.end()
                  })
                })
              }else{
                accessDB("SELECT * FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.id = ?;",[node_id],function(result_2){
                  let sql = "";
                  let para = [];
                  for(let i=0; i<result_2.length; i++){
                    sql += " call getTimes(?,?,?,?);";
                    para.push(today,result_2[i].frequency,result_2[i].meter_id, result_2[i].serial_sensor);
                  }
                  accessDB(sql, para,function(result_3){
                    res.json({
                      err_code: 0,
                      message: "",
                      data: {
                        mess_rate: result_3
                      }
                    })
                    res.end()
                  })
                })
              }
            }else{
              res.json({
                err_code: 1,
                message: "Node id không chính xác",
                data: []
              })
              res.end()
            }
          })
        }else{
          node_id = req.query.node_id;
          accessDB("SELECT * FROM group_relationship_demo_QN WHERE id = ?;",[node_id],function(result){
            if(result.length > 0){
              if(result[0].depth == 0){
                accessDB("SELECT * FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.parent_id = ?;",[node_id],function(result_2){
                  let sql = "";
                  let para = [];
                  for(let i=0; i<result_2.length; i++){
                    sql += " call getTimes(?,?,?,?);";
                    para.push(today,result_2[i].frequency,result_2[i].meter_id, result_2[i].serial_sensor);
                  }
                  accessDB(sql, para,function(result_3){
                    res.json({
                      err_code: 0,
                      message: "",
                      data: {
                        mess_rate: result_3
                      }
                    })
                    res.end()
                  })
                })
              }else{
                accessDB("SELECT * FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE group_relationship_demo_QN.id = ?;",[node_id],function(result_2){
                  let sql = "";
                  let para = [];
                  for(let i=0; i<result_2.length; i++){
                    sql += " call getTimes(?,?,?,?);";
                    para.push(today,result_2[i].frequency,result_2[i].meter_id, result_2[i].serial_sensor);
                  }
                  accessDB(sql, para,function(result_3){
                    res.json({
                      err_code: 0,
                      message: "",
                      data: {
                        mess_rate: result_3
                      }
                    })
                    res.end()
                  })
                })
              }
            }else{
              res.json({
                err_code: 1,
                message: "Node id không chính xác",
                data: []
              })
              res.end()
            }
          })
        }
      }
    }
    get_group_alert(req,res,next){
      let group_id = req.query.group_id;
      let from = return_sql_fr_day_format(req.query.fr);
      let to = return_sql_to_day_format(req.query.to);
      let para = changeARRSQLIN(req.query.para);
      // console.log(from,to)
      accessDB("SELECT *, group_setting.lost_threshold AS group_threshold FROM alert_data INNER JOIN (SELECT id, meter_id, serial_sensor, name FROM group_relationship_demo_QN WHERE id = ? OR parent_id = ?) AS mt ON alert_data.meter_id = mt.meter_id AND alert_data.serial_sensor = mt.serial_sensor LEFT JOIN group_setting ON mt.id = group_setting.group_id WHERE alert_data.alert_time >= ? AND alert_data.alert_time <= ? AND alert_data.para IN ("+para+") ORDER BY alert_data.alert_time DESC;",[group_id,group_id,from,to],function(result){
        if(result.length>0)
        res.send(JSON.stringify(result));
        res.end();
      })
    }
    post_send_mqtt_ins(req,res,next){
      send_mqtt_inst(req,res);
    }
    get_ins_data_level_5(req,res,next){
      let node_id = req.query.node_id;
      accessDB("SELECT *, totaleq.`status` AS status, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relationship_demo_QN ON totaleq.id = group_relationship_demo_QN.meter_id AND totaleq.serial_sensor = group_relationship_demo_QN.serial_sensor WHERE  group_relationship_demo_QN.parent_id = ?;",[node_id],function(result){
        res.json({
          err_code:0,
          message: null,
          data: result
        })
        res.end()
      })
    }
        // authen(req,res,next){

    // }
        // authen(req,res,next){

    // }
        // authen(req,res,next){

    // }
        // authen(req,res,next){

    // }
        // authen(req,res,next){

    // }
        // authen(req,res,next){

    // }
        // authen(req,res,next){

    // }
        // authen(req,res,next){

    // }
        // authen(req,res,next){

    // }
        // authen(req,res,next){

    // }
        // authen(req,res,next){

    // }
        // authen(req,res,next){

    // }
        // authen(req,res,next){

    // }


}



module.exports = new user_controller;