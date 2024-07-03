var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var methodOverride = require('method-override')
const route = require('./routes/index');
var i18n = require("i18n");
var initializePassport = require('./config/passport-config')
initializePassport(passport);

i18n.configure({
  locales:['en', 'vi'],
  directory: __dirname + '/locales',
 cookie: 'lang',
 });

 var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(session({
  secret: "mySecret",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 3
  },
  resave: false,
  saveUninitialized: false,
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(i18n.init);

// app.use('/', indexRouter);
// app.use('/map', mapRouter);
// app.use('/source', sourceRouter_eq_list);
// app.use('/group', groupRouter);

app.use(methodOverride('_method'))
route(app);

function validateEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
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
// const { resolve } = require('path');
// const { rejects } = require('assert');
// const { use } = require('passport');
// const { Result } = require('express-validator');
// const { toUnicode } = require('punycode');
// const { duration } = require('moment');
// const { combineTableNames } = require('sequelize/types/lib/utils');

var accessDB = require('./config/mysql-config');
// var accessDB_old = require("./config/mysql-config-get-water-data")
// var exportData = require("./export-data-config");
// var exportEQ = require('./config/export-equipment-config');
// var exportMutilData = require("./config/export-multi-data-config");
// var exportMutilDatainfo = require("./config/export-detail-eq-config")
// var sendmail = require("./config/send-mail-resetpass-config");
// var sendVerifiCode = require("./config/send-verifi-code")
// const { resolveInclude } = require('ejs');
// const { selectFields } = require('express-validator/src/select-fields');
// const { json } = require('body-parser');
// const JSONTransport = require('nodemailer/lib/json-transport');


function detectChangeDB(usr, activity, ideq){
  let date = new Date();
  accessDB("INSERT INTO notifi_alert (usr,activity,ideq,day) VALUES (?,?,?,?)",[usr,activity,ideq,date], function(result){
  })
}

function fixNum(num){
  if(Number.isNaN(Number(num)) || num == null){
    return null;
  }else{
    return +Number(num).toFixed(3)
  }
}


function configDataWmeter(arrData){
  let data=[];
  for(let i=1; i<arrData.length; i++){
    if((Number(arrData[i].TIME)-Number(arrData[i-1].TIME))>0 && (arrData[i].ValOfNum - arrData[i-1].ValOfNum)> 0){
    let flr = (arrData[i].ValOfNum - arrData[i-1].ValOfNum)*3600*1000/(Number(arrData[i].TIME)-Number(arrData[i-1].TIME));
    let x = {
      pressure: fixNum(arrData[i].pressure),
      quanity: fixNum(arrData[i].ValOfNum - arrData[i-1].ValOfNum),
      flowRate: fixNum(arrData[i].flowRate),
      TIME: Number(arrData[i].TIME),
      Voltage: arrData[i].Voltage,
      meterTime: arrData[i].meterTime
    };
    data.push(x);
  };
  }
  return data;
}






// app.get('/change-lang/:lang', (req, res) => {
//   res.cookie('lang', req.params.lang, { maxAge: 1000*60*60*24*30 });
//   res.redirect('back');
// })

// app.get("/login/get/lang",function(req,res){
//   // console.log(req.cookies.lang)
//   if(req.cookies.lang){
//     res.send(req.cookies.lang);
//     res.end();
//   }else{
//     // req.cookies.lang = "en";
//     res.cookie('lang', "vi", { maxAge: 1000*60*60*24*30 });
//     res.send("vi");
//     res.end();
//   }
// })






app.route('/login').post(
  passport.authenticate('local-signin',{failureRedirect: '/login',
                                        successRedirect: '/source_3/all',
                                        failureFlash: true,
                                    }))

app.route("/user/register").post(passport.authenticate('local-signup',{failureRedirect: '/user/register',
                                            successRedirect: '/dashboard',
                                            failureFlash: true,
                                      }))


// app.post('/register', function(req, res, next){
//   let email = req.body.e;
//   let usr = req.body.usr;
//   let pass = req.body.pw
//   var x = bcrypt.hashSync(pass, saltRounds);
//   let config1 = {ImRea:0,ExRea:0,ImAct1:0,ImAct2:1,ImAct3:1,ValAct:0,ValRea:1,ValApp:0,A_RMS:1,B_RMS:0,C_RMS:1};
//   let config2 = {TEMP:1, HUMI:1, PIN_STATUS:0};
//   let config3 = {pressure:0, quanity:0, flowRate:0,Voltage:0}
//   // console.log(email, usr, pass, x);
//   accessDB("SELECT * FROM account WHERE email = ? OR usr = ?",[email,usr],function(result){
//     if(result.length >0){
//       res.send(translate_noti_app(req,"email or username had been use!"));
//       res.end();
//     }else{
//       res.render("login")
//       res.end();
//     }
//   })
// })

// app.post('/registerAdmin', function(req, res, next){
//   let email = req.body.e;
//   let usr = req.body.usr;
//   let pass = req.body.pw;
//   let role = req.body.role;
//   var x = bcrypt.hashSync(pass, saltRounds);
//   let config1 = {ImRea:0,ExRea:0,ImAct1:0,ImAct2:1,ImAct3:1,ValAct:0,ValRea:1,ValApp:0,A_RMS:1,B_RMS:0,C_RMS:1};
//   let config2 = {TEMP:1, HUMI:1, PIN_STATUS:0};
//   let config3 = {pressure:0, quanity:0, flowRate:0,Voltage:0}
//   // console.log(email, usr, pass, x);
//   accessDB("SELECT * FROM account WHERE email = ? OR usr = ?",[email,usr],function(result){
//     if(result.length >0){
//       if(result[0].usr == usr){
//         res.send("failUserName");
//         res.end();
//       }else if(result[0].email == req.body.email){
//         res.send("failEmail");
//         res.end();
//       }
//     }else{
//       accessDB("INSERT INTO account (usr, email, pass, role,status) VALUES (?,?,?,?,?)",[usr, email, x, role,1],function(result){
//         res.send(translate_noti_app(req,"Creat Account success!"));
//         res.end();
//       })
//     }
//   })
//   // detectChangeDB(req.body.ad, "system", "creat account","all");
// })




//forgot password
// app.post("/user/forgot_password",function(req,res){
//   let email = req.body.email;
//   if(email == ""){
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//     res.render("forgot_password",{err: translate_noti_app(req,"Email cannot be empty!")});
//     res.end();
//     return false;
//   }
//   else if(!validateEmail(email)){
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//     res.render("forgot_password",{err:  translate_noti_app(req,"Invalid email format!")});
//     res.end();
//     return false;
//   }else{
//     // console.log(email)
//     accessDB("SELECT * FROM account WHERE email = ? AND status = ?",[email,1],function(result){
//       if(result.length > 0){
//         sendVerifiCode(email,res,req,false);
//       }else{
//         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//         res.header('Expires', '-1');
//         res.header('Pragma', 'no-cache');
//         res.render("forgot_password",{err:  translate_noti_app(req,"Your email is incorrect")});
//         res.end()
//       }
//     })
//   }
// })

// app.get("/send_code_again",function(req,res){
//   let email = req.session.email;
//   // console.log("ABC" +  email)
//   accessDB("SELECT * FROM account WHERE email = ? AND status = ?",[email,1],function(result){
//     if(result.length > 0){
//       // res.send("Send code success!")
//       sendVerifiCode(email,res,req,true);
//     }else{
//       res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//       res.header('Expires', '-1');
//       res.header('Pragma', 'no-cache');
//       res.render("forgot_password",{err: translate_noti_app(req,"Your email is incorrect")});
//       res.end()
//     }
//   })
// })



// app.post("/user/send_verifi_code",function(req,res){
//   let email = req.session.email;
//   let code = req.body.verifiCode;
//   // console.log(email,code)
//   if(code == ""){
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//     res.render("enter_verifi_code", {email: email, err: translate_noti_app(req,"Verify code cannot be empty!")});
//     res.end()
//     return false;
//   }
//   accessDB("SELECT * FROM account WHERE email = ? AND status = ?",[email,1],function(result){
//     // console.log(result)
//     if(result.length > 0){
//       if(code == result[0].verify_code){
//         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//         res.header('Expires', '-1');
//         res.header('Pragma', 'no-cache');
//         // res.render("setting_new_pass", {email: email, err:""})
//         res.redirect("/setting_new_pass");
//         res.end();
//       }else{
//         res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//         res.header('Expires', '-1');
//         res.header('Pragma', 'no-cache');
//         res.render("enter_verifi_code", {email: email, err: translate_noti_app(req,"Verify code is incorrect")});
//         // res.redirect("/enter_verifi_code")
//         res.end()
//       }
//     }else{
//       res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//       res.header('Expires', '-1');
//       res.header('Pragma', 'no-cache');
//       res.render("enter_verifi_code", {email: email, err: translate_noti_app(req,"Your email is incorrect")});
//       res.end()
//     }
//   })
// })


// app.post("/user/set_pass",function(req,res){
//   let email = req.session.email;
//   let pass = req.body.password;
//   let cfpass = req.body.cfpassword;
//   // console.log(email,pass,cfpass)

//   if(pass == ""){
//     res.render("setting_new_pass",{email: email, err: translate_noti_app(req,"Password cannot be empty!")})
//     res.end();
//     return false;
//   }else if(cfpass == ""){
//     res.render("setting_new_pass",{email: email, err:translate_noti_app(req,"Confirm password cannot be empty!")})
//     res.end();
//     return false;
//   }else if(pass.length < 8){
//     res.render("setting_new_pass",{email: email, err:translate_noti_app(req,"Password must be at least 8 characters long!")})
//     res.end();
//     return false;
//   }
//   else if(pass != cfpass){
//     res.render("setting_new_pass",{email: email, err:translate_noti_app(req,"The password and confirm password must be match!")})
//     res.end();
//     return false;
//   }

//     accessDB("SELECT * FROM account WHERE email = ? AND status = ?",[email,1],function(result){
//       // console.log(result);
//       if(result.length > 0){
//         let hashPass = bcrypt.hashSync(pass, saltRounds)
//         // console.log(hashPass)
//         accessDB("UPDATE account SET pass = ? WHERE email = ? AND status = ?", [hashPass,email,1],function(result){
//           // console.log(result);
//           if(req.cookies.lang == "en"){
//             req.flash("error","Change pass success");
//           }else{
//             req.flash("error","Đổi mật khẩu thành công");

//           }
//           res.redirect("/login");
//           // res.render("login", {message: req.flash("change pass success")})
//           res.end();
//         })
//       }else{
//         res.render("setting_new_pass",{email: email, err:"wrong email!"})
//         res.end();
//       }
//     })
// })



//main
// app.get("/get/countEQ-em",function(req,res){
//   accessDB("SELECT COUNT(id) AS num  FROM totaleq WHERE eq = ?",["em"],function(result){
//     if(result.length>0)
//       res.send(JSON.stringify(result));
//       res.end();
//   })
// })

// app.get("/get/countEQ-th",function(req,res){
//   accessDB("SELECT COUNT(id) AS num  FROM totaleq WHERE eq = ?",["th"],function(result){
//     if(result.length>0)
//       res.send(JSON.stringify(result));
//       res.end();
//   })
// })


// app.get("/get/countEQ-wt",function(req,res){
//   accessDB("SELECT COUNT(id) AS num  FROM totaleq WHERE eq = ?",["wt"],function(result){
//     if(result.length>0)
//       res.send(JSON.stringify(result));
//       res.end();
//   })
// })


// app.all('/checkAccount', function(req, res){
//   var a = req.body.data;
//   // console.log(a);
//   accessDB("SELECT * FROM account WHERE role = 'admin' AND status =?",[1],function(result){
//     if(result.length > 0){
//       // console.log(result)
//       for(let i=0; i< result.length; i++){
//         if(result[i].usr == a){
//           // console.log(a);
//           res.send("true");
//           res.end();
//           return 0;
          
//         }
//       }
//       res.send('false');
//       res.end();
//     }else{
//       res.send('false');
//       res.end();
//     }
//   })
// })

// app.get("/get/account", function(req, res){
//   // console.log(req)
//   if (req.isAuthenticated()){
//     if(req.user.role == "admin"){
//       accessDB("SELECT * FROM account",[],function(result){
//         if(result.length>0)
//         res.send(JSON.stringify(result));
//         res.end();
//       });
//     }else{
//       res.redirect('/login');
//       res.end();
//     }
//   }else{
//     res.redirect('/login');
//     res.end();
//   }

// });



// app.get("/get/option",function(req,res){
//   accessDB("SELECT * FROM setting_option",[],function(result){
//     res.send(JSON.stringify(result));
//     res.end();
//   })
// })

// app.post("/admin/delete_option",function(req,res){
//   let id_div = req.body.id;
//   let op = req.body.op;
//   // console.log(req.body)
//   accessDB("SELECT * FROM setting_option WHERE id_div = ?",[id_div],function(result){
//     if(result.length > 0){
//       let data = JSON.parse(result[0].option);
//       for(let i=0;i<data.length;i++){
//         if(data[i].option == op){
//           data.splice(i,1);
//         }
//       }
//       let op_update = JSON.stringify(data);
//       console.log(op_update);
//       accessDB("UPDATE setting_option SET `option` = ? WHERE id_div = ?",[op_update,id_div],function(result1){
//         // console.log(result1);
//         res.send("delete success!")
//         res.end();
//       })
//     }else{
//       res.end()
//     }

//   })
// })

// app.post("/admin/add_option",function(req,res){
//   let id_div = req.body.id;
//   let dataAdd  =req.body.addData;
//   console.log(req.body);
//   accessDB("SELECT * FROM setting_option WHERE id_div = ?",[id_div],function(result){
//     if(result.length > 0){
//       let data = JSON.parse(result[0].option);
//       for(let i=0;i<data.length;i++){
//         if(data[i].option == dataAdd){
//           res.send("Option already exist, please try again!");
//           res.end();
//           return false;
//         }
//       }
//       let a = {
//         "option": dataAdd,
//         "value": dataAdd
//       }
//       data.unshift(a);
//       let op_update = JSON.stringify(data);
//       console.log(op_update);
//       accessDB("UPDATE setting_option SET `option` = ? WHERE id_div = ?",[op_update,id_div],function(result1){
//         // console.log(result1);
//         res.send("Add option success!")
//         res.end();
//       })
//     }else{
//       res.end()
//     }
//   })
// })

// app.post("/get/detaiEQ", function(req, res){
//   var x = req.body.id;
//   accessDB('SELECT * FROM totaleq2 WHERE id = ?', [x], function(result){
//     if(result.length>0)
//     res.send(JSON.stringify(result));
//     res.end();
//   })
// })


// app.post("/get/dataEQ", function(req,res){
//   let id = req.body.id;
//   let usr = req.body.usr;
//   let from = req.body.fr;
//   let to = req.body.to;
//   let eq = "wt"
//   let moment = req.body.moment;
//   let sql;
//   console.log(from, to, eq, usr, id)
//   var data = {
//     "data": null,
//     "config": null
//   };
//     switch(moment){
//       // case "raw": sql = "SELECT DISTINCT * FROM wmeterdata WHERE ID = ? AND TIME > ? AND TIME < ? ORDER BY TIME"; break;
//      case "raw": sql = "call groupbytime_wmeter(1*30,?, ?, ?)"; break; 
//       case "hour": sql = "call groupbytime_wmeter(1*60,?, ?, ?)"; break; 
//       case "day": sql = "call groupbytime_wmeter(1*60*24,?, ?, ?)"; break;
//       case "week": sql = "call groupbytime_wmeter(24*60*7,?,?,?) "; break; 
//       case "month": sql = "call groupbytime_wmeter(24*60*30,?,?,?)"; break; 
//       case "year": sql = "call groupbytime_wmeter(24*60*365,?,?,?)"; break;
//     }
//     accessDB_old(sql, [id, from, to], function(result){
//       switch(moment){
//         // case "raw": data["data"]=configDataWmeter(result); break;
//        case "raw": data["data"]=configDataWmeter(result[0]); break;
//         case "hour":  data["data"]=configDataWmeter(result[0]); console.log('hour'); break;
//         case "day": data["data"]=configDataWmeter(result[0]);  console.log('day');break;
//         case "week": data["data"]=configDataWmeter(result[0]);console.log('week'); break;
//         case "month": data["data"]=configDataWmeter(result[0]);console.log('month'); break; 
//         case "year": data["data"]=configDataWmeter(result[0]);console.log('year'); break;
//       }
//       accessDB("SELECT * FROM config WHERE ideq = ? AND username = ? ", [id, usr], function(row){
//         if(row.length < 1){
//           let config3 = {pressure:0, quanity:0, flowRate:0,Voltage:0}
//           let config4 = {"pressure":"#c74e4e","quanity":"#325431","flowRate":"#000cff","Voltage":"#7bad9c"}
//           accessDB("INSERT INTO config (ideq,username,config,color_config) VALUES (?,?,?,?)",[id,usr,JSON.stringify(config3),JSON.stringify(config4)],function(result){
//             let x={
//               ideq: id,
//               username: usr,
//               config: JSON.stringify(config3),
//               color_config: JSON.stringify(config4)
//             }
           
//             data["config"] = x;
//             console.log(data);
//             res.send(JSON.stringify(data));
//             res.end();
//           })
//         }else{
//         data["config"] = row[0] ;
//         res.send(JSON.stringify(data));
//         // console.log(data);
//         res.end();
//         }
//       })
//     })
// })

// app.post("/post/config", function(req, res, next){
//   let id = req.body.id;
//   let usr = req.body.usr;
//   let cf = JSON.stringify(req.body.config);
//   let cl_cf = JSON.stringify(req.body.color_config);
//   accessDB("UPDATE config SET config=?,color_config=? WHERE ideq = ? AND username = ?", [cf,cl_cf,id,usr], function(result){
//     // console.log("update success");
//     res.send("save config success!");
//     res.end();
//   })
//   // detectChangeDB(usr, "Update view config " ,id);
// })

// app.post("/get/variable", function(req, res){
//   let eq = req.body.eq;
//   accessDB("SELECT * FROM variable Where eq =?", [eq], function(result){
//     if(result.length>0)
//     res.send(JSON.stringify(result));
//     res.end();
//   })
// })

// app.post("/get/notifiAlert", function(req, res){
//   let id = req.body.id;
//   accessDB("SELECT * FROM notifi_alert WHERE ideq = ?", [id], function(result){
//     if(result.length>0)
//     res.send(JSON.stringify(result));
//     // console.log("alert" + result, id)
//     res.end();
//   })
// })

// app.get('/logout', function(req, res){
//   req.logout();
//   // res.clearCookie('lang');
//   req.session.destroy();
//   res.redirect('/login');
//   res.end();
// })


//report tab
// app.get('/get/report', function(req, res){
//   let from = returnSQLDateFormat(req.query.fr);
//   let to = returnSQLDateFormat(req.query.to);
//   // console.log(from,to)
//   accessDB("SELECT * FROM report_table WHERE exportTime > ? AND exportTime < ?",[from,to], function(result){
//     if(result.length>0)
//     res.send(JSON.stringify(result));
//     res.end();
//   })
// })

// app.get("/get/reportSetting",function(req,res){
//   let id = req.query.id;
//   accessDB("SELECT * FROM")
// })


//
// app.post('/get/DataQuality', function(req, res){ 
//   let fr = req.body.fr;
//   let to = req.body.to;
//   let val = req.body.val;
//   let id = req.body.id;
//   let eq = req.body.eq;
//   accessDB_old("SELECT * FROM wmeterdata WHERE ID = ? AND TIME > ? AND TIME < ? ORDER BY TIME",[id,fr,to ], function(result){
//     if(result.length>0)
//     res.send(JSON.stringify(configDataWmeter(result)));
//     // console.log(result)
//     res.end();
//   })
// })

// app.post('/get/warningLevel', function(req, res){
//   let id = req.body.id;
//   let eq = req.body.eq;
//   accessDB("SELECT * FROM warning_level WHERE ideq = ?", [id], function(result){
//     if(result.length>0)
//     accessDB("SELECT unit FROM variable WHERE eq = ?",[eq],function(result2){
//       if(result2.length>0){
//         let data = [];
//         for(let i=0; i< result.length; i++){
//           let x = {
//             ideq: result[i].ideq,
//             name: result[i].name,
//             low: result[i].low,
//             high: result[i].high,
//             para:result[i].para,
//             unit: result2[i].unit
//           };
//           data.push(x);
//         }
//         res.send(JSON.stringify(data));
//         res.end();
//       }
//     })
//     // res.send(JSON.stringify(result));
//     // res.end();
//     // console.log(result)
//   })
// })

// app.post("/post/saveWarningLevel", function(req, res){
//   let data = req.body;
//   // console.log(data);
//   accessDB("UPDATE warning_level SET high=?,low=? WHERE ideq = ? AND para = ?",[data.quanityUp, data.quanityDown, data.id, "quanity"], function(result){});
//   accessDB("UPDATE warning_level SET high=?,low=? WHERE ideq = ? AND para = ?",[data.flowRateUp, data.flowRateDown, data.id, "flowRate"], function(result){});
//   res.send("Save warning level success");
//   res.end();

//   // detectChangeDB(req.body.usr,"Update threshold",req.body.id)
// })

// app.post("/save/information", function(req, res){
//   let data =req.body;
//   // console.log(data);
//   accessDB("UPDATE totaleq2 SET sourceType=?,ean=?,meter=?,energyUsage=?,location=?,serial=?,decript=? WHERE id = ?", [data.sourceType,data.ean, data.meter, data.energyUsage, data.location, data.serial, data.decript, data.ideq], function(result){
//     accessDB("UPDATE totaleq SET name=?,tag=? WHERE id = ?", [data.name, data.tag, data.ideq],function(result){
//       res.send("save information success!");
//       res.end();
//     })
//   })
//   // detectChangeDB(data.usr, "Update infomation", data.ideq);
// })

// app.post("/saveProperty", function(req, res){
//   let data = req.body;
//   let sql = "UPDATE totaleq2 SET decript_pro=?,type_pro=?,purpose=?,meter=?,powratio=?,volRatio=?,curratio=?,grid=?,zone=?,cabinet=?,contract=? WHERE id = ?"
//   console.log(data);
//   //let sql = "INSERT INTO totaleq2 (decript_pro,type_pro,purpose,meter,powratio,volRatio,curratio,grid,zone,cabinet,contract) VALUES (?,?,?,?,?,?,?,?,?,?,?) WHERE id = ?"
//   accessDB(sql,[data.description,data.type,data.purpose,data.serialMT,data.powRatio,data.volRatio,data.curRatio,data.gridEQ,data.zone,data.cabinetEQ,data.regCap,data.id],function(result){
//     res.send("save proprety success!");
//     res.end();
//     // detectChangeDB(data.usr, "Update property", data.id);
//   })
// })

// app.post("/saveNotifiSend", function(req, res){
//   let data = req.body;
//   // console.log(data);
//   accessDB("INSERT INTO notifi_send (ideq, sendType, email,typeEmail) VALUES (?,?,?,?)",[data.id, data.type, data.email,data.typeEmail],function(result){
//     res.send("save notification send success!");
//     res.end();
//   })
//   // detectChangeDB(data.usr, "Add user recive notifi", data.id);
// })

// app.get('/get/user',function(req,res){
//   accessDB("SELECT usr,email FROM account WHERE status = ?",[1], function(result){
//     // console.log(result)
//     res.send(JSON.stringify(result));
//     res.end();
//   })
// })

// app.post("/get/userNotifiSend",function(req,res){
//   let id = req.body.id;
//   accessDB("SELECT * FROM notifi_send WHERE ideq = ?",[id],function(result){
//     if(result.length > 0)
//       res.send(JSON.stringify(result))
//     res.end();    
//   })
// })

// app.post("/deleteAlertHistory",function(req, res){
//   let id = req.body.id;
//   accessDB("DELETE FROM notifi_alert WHERE ideq = ?",[id],function(result){
//     res.send("delete success!");
//     res.end();
//   })
// })

// app.post("/deleteSendAlert",function(req,res){
//   let id = req.body.id;
//   let email = req.body.email;
//   accessDB("DELETE FROM notifi_send WHERE ideq = ? AND email = ?",[id,email],function(result){
//     res.send("delete success!");
//     res.end();
//   })
// })

// app.post("/get/userWarnLevelSend",function(req,res){
//   let id = req.body.id;
//   accessDB("SELECT * FROM warning_level_send WHERE ideq = ?",[id],function(result){
//     if(result.length > 0)
//       res.send(JSON.stringify(result))
//     res.end();    
//   })
// })

// app.post("/deleteSendWarnLevel",function(req,res){
//   let id = req.body.id;
//   let email = req.body.email;
//   accessDB("DELETE FROM warning_level_send WHERE ideq = ? AND email = ?",[id,email],function(result){
//     res.send("delete success!");
//     res.end();
//   })
// })

// app.post("/saveWarnLevelSend", function(req, res){
//   let data = req.body;
//   // console.log("AVC",data);
//   accessDB("INSERT INTO warning_level_send (ideq, sendType, email,typeEmail,status,created_by) VALUES (?,?,?,?,?,?)",[data.id, data.type, data.email,data.typeEmail,1,data.usr],function(result){
//     res.send("save warning level send success!");
//     res.end();
//   })
//   // detectChangeDB(data.usr, "Add user recive alert send", data.id);
// })

// app.post("/post/setStatusSendEmail",function(req,res){
//   let idkey = req.body.idkey;
//   let status = req.body.status;
//   console.log(idkey, status);
//   if(status == 1){
//     let x = new Date();
//     let start = x.getFullYear()+"-"+(x.getMonth()+1)+"-"+x.getDate()+ " 00:00:00";
//     let end = null;
//     accessDB("UPDATE warning_level_send SET status=?,start_send=?,next_send=? WHERE idkey=?",[status,start,end,idkey],function(result){
//       res.send(JSON.stringify(result));
//       res.end();
//     })
//   }else if(status == 0){
//     accessDB("UPDATE warning_level_send SET status=? WHERE idkey=?",[status,idkey],function(result){
//       res.send(JSON.stringify(result));
//       res.end();
//     })
//   }
// })



// app.post('/deleteUsr',function(req,res){
//   let usr = req.body.usr;
//   accessDB("DELETE FROM account WHERE usr = ?",[usr],function(result){
//     // accessDB("DELETE FROM config WHERE username = ?",[usr],function(result1){
//       res.send(translate_noti_app(req,"delete success"));
//       res.end();
//     // })
//   })
// })

// app.get("/get/exportdata",function(req,res){
//   let data = req.query;
//   let arr = data.arr;
//   let x = arr.split("-");
//   let usr = data.usr;
//   let moment = data.moment;
//  accessDB("SELECT * FROM totaleq2 WHERE id = ?",[data.id],function(result){
//    if(result.length>0){
//      let serialMeter = result[0].meter;
//      let powRatio = result[0].powratio;
//      let curRatio = result[0].curratio;
//      let volRatio = result[0].volRatio;
//      exportData(data.eq, data.id, data.fr, data.to,res,req,x,serialMeter,powRatio,curRatio,volRatio,usr,moment);
//    }
//  })
// })

// app.get("/get/exportEQ",function(req,res){
//   // let EQ = req.query.EQ;
//   exportEQ(res,req);
// })

// app.get("/get/exportMultiData",function(req,res){
//   let to = req.query.to;
//   let from = req.query.fr;
//   let name = req.query.name;
//   let para = req.query.para;
//   let usr = req.user.usr;
//   let moment = req.query.moment;
//   let eq = "wt";
//   let selectedEQ = req.query.selectedEQ;
//   //  console.log(selectedEQ)
//   exportMutilData(to,from,name,para,usr,moment,eq,selectedEQ,res);
// })

// app.get("/get/exportMultiDatainfo",function(req,res){
//   let to = req.query.to;
//   let from = req.query.fr;
//   let name = req.query.name;
//   let usr = req.query.usr;
//   let selectedEQ = req.query.selectedEQ;
//   exportMutilDatainfo(to,from,name,usr,selectedEQ,res);
// })

//dashboard
// app.get("/get/dashboard",function(req,res){
//   let id = req.query.id;
//   // console.log(id);
//   accessDB("SELECT * FROM emeterdata WHERE ID =?",[id],function(result){
//     if(result.length > 0)
//       res.send(JSON.stringify(result));
//       // console.log(result)
//       res.end();
    
//   })
// })

// app.get("/get/dashboard1",function(req,res){
//   let id = req.query.id;
//   let from = req.query.fr;
//   let to =req.query.to;
//   accessDB("SELECT *,(ImAct1 + ImAct2 + ImAct3) AS Pgiao FROM emeterdata WHERE ID = ?  AND TIME > ? AND TIME < ? ORDER BY TIME",[id,from,to],function(result){
//     // console.log(from);
//     if(result.length > 0){
//       let data=[];
//       let day00h = Number(from);
//       for(let i=0; i<result.length; i++){
//         let sumday = 0;
//         // let day00h = result[i].TIME;
//         while (result[i].TIME <= (day00h + 3600000 * 24)){
//           sumday += result[i].Pgiao;
//           i+=1;
//           if(i == result.length){
//             break;
//           }
//           // console.log(result[i].TIME);
//         }
        
//         let x={
//           Pgiao: sumday,
//           TIME: day00h
//         }
//         data.push(x);
//         day00h = day00h + 3600000 * 24;
//       }
      
//       res.send(JSON.stringify(data));
//       res.end();
//     }else{
//       res.send(null);
//       res.end();
//     }
//   })
// })

// app.get("/get/dashboard2",function(req,res){
//   let id = req.query.id;
//   let from = req.query.fr;
//   let to =req.query.to;
//   accessDB("SELECT *,(ImAct1 + ImAct2 + ImAct3) AS Pgiao  FROM emeterdata WHERE ID = ? AND TIME > ? AND TIME < ? ORDER BY TIME",[id,from,to],function(result){
//     // console.log(result);
//     if(result.length > 0){
//       let data=[];
//       let day00h = Number(from);
//       for(let i=0; i<result.length; i++){
//         let maxday = result[0].Pgiao;
//         // let day00h = result[i].TIME;
//         while (result[i].TIME <= (day00h + 3600000 * 24)){
//           if(result[i].Pgiao > maxday) maxday = result[i].Pgiao;

//           i++;
//           if(i == result.length){
//             break;
//           }
//           // console.log(result[i].TIME);
//         }
        
//         let x={
//           Pgiao: maxday,
//           TIME: day00h
//         }
//         data.push(x);
//         day00h += 3600000 * 24;
//       }
      
//       res.send(JSON.stringify(data));
//       res.end();
//     }else{
//       res.send(null);
//       res.end();
//     }
//   })
// })

app.get("/get/dashboard3",function(req,res){
  let id = req.query.id;
  let from = req.query.fr;
  let to =req.query.to;
  let from1 = returnSQLDateFormat(from);
  let to1 = returnSQLDateFormat(to);
  accessDB("SELECT * FROM wmeterdata WHERE ID = ? AND meterTime > ? AND meterTime < ? ORDER BY meterTime",[id,from1,to1],function(result1){
    // console.log(result);
    if(result1.length > 0){
      let data=[];
      let result =configDataWmeter(result1);
      let day00h = Number(from);
      for(let i=0; i<result.length; i++){
        let sumday = 0;
        // let day00h = result[i].TIME;
        while (result[i].TIME <= (day00h + 3600000 * 24)){
          sumday += result[i].quanity;
          i+=1;
          if(i == result.length){
            break;
          }
          // console.log(result[i].TIME);
        }
        
        let x={
          Pgiao: sumday,
          TIME: day00h
        }
        data.push(x);
        day00h += 3600000 * 24
      }
      res.send(JSON.stringify(data));
      res.end();
    }else{
      res.send(null);
      res.end();
    }
  })
})

// app.get("/get/dashboard4",function(req,res){
//   let id= req.query.id;
//   let from = req.query.fr;
//   let to = req.query.to;
//   accessDB("SELECT * FROM temphumidata WHERE ID = ? AND TIME_INSERT > ? AND TIME_INSERT < ? ORDER BY TIME_INSERT",[id,from,to],function(result){
//     if(result.length > 0)
//       res.send(JSON.stringify(result));
//       res.end();
//   })
// })


app.get("/get/idChartDashboard",function(req,res){
  accessDB("SELECT * FROM dashboard_config INNER JOIN totaleq ON dashboard_config.ID = totaleq.id",[],function(result){
    if(result.length > 0)
      res.send(JSON.stringify(result));
      res.end();
  })
})



app.post("/post/updateDashboard",function(req,res){
  let data = req.body;
  // console.log(data);
  accessDB("UPDATE dashboard_config SET ID=?,decription=? WHERE id_div = ?",[data.ID,data.decript,data.id_div],function(result){
    // console.log(result);
    res.send( translate_noti_app(req,"Update success!"))
    res.end();
  })
})

app.get("/get/dashboard/fillSelectId",function(req,res){
  accessDB("SELECT * FROM totaleq",[],function(result){
    if(result.length > 0){
      res.send(JSON.stringify(result));
    }
    res.end();
  })
})

app.get("/get/onoffEq",function(req,res){
  let data = {
    on: null,
    off: null
  }
    accessDB("SELECT COUNT(ID) AS on_eq FROM totaleq WHERE status = ?",["1"],function(result1){
        data.on = result1[0].on_eq;
        // console.log(result1)
        accessDB("SELECT COUNT(ID) AS off_eq FROM totaleq WHERE status = ?",["0"],function(result2){
          data.off = result2[0].off_eq
          res.send(JSON.stringify(data));
          res.end()
        })
      })
})

// app.get("/get/offEq",function(req,res){ //note
//     accessDB("SELECT COUNT(ID) AS wt FROM totaleq WHERE status = ?",["0"],function(result1){
//       // res.send(result1[0].wt);
//       res.end();
//     })    
// })


// ALERT TAB
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

function changeARRSQLIN(arrStr){
  let arrchange = [];
  let arr = arrStr.split(",");
  for(let i = 0; i<arr.length; i++){
    let a = "'"+arr[i]+"'";
    arrchange.push(a);
  }
  return arrchange.join();
}

// app.get("/get/alert",function(req,res){
//   // let from = new Date(Number(req.query.fr)).toLocaleString();
//   // let to = new Date(Number(req.query.to)).toLocaleString("en-US");
//   let from = returnSQLDateFormat(req.query.fr);
//   let to = returnSQLDateFormat(req.query.to);
//   let sourcetype = req.query.st
//   let para = changeARRSQLIN(req.query.para)
//   // console.log(from,to,sourcetype,para);
//   accessDB("SELECT * FROM alert_data INNER JOIN totaleq ON alert_data.ideq = totaleq.id WHERE alert_data.para IN ("+para+") AND alert_data.created_at > ? AND alert_data.created_at < ?",[from,to], function(result){
//     // console.log(result)
//     if(result.length>0)
//       res.send(JSON.stringify(result));
//       res.end();
//   })
// })

// app.get("/administrator/agents",function(req,res){
//   accessDB("SELECT * FROM alert_data INNER JOIN totaleq ON alert_data.ideq = totaleq.id INNER JOIN totaleq2 ON alert_data.ideq = totaleq2.id",[], function(result){
//     if(result.length > 0){
//       let data=[];
//       for(let i=0; i<result.length; i++){
//         let x ={
//           id: result[i].ideq,
//           site: result[i].name,
//           source: result[i].sourceType,
//           alertType: result[i].alert_type,
//           threshold: result[i].threshold,
//           value: result[i].alert_value,
//           status: result[i].alert_status,
//           creatby: result[i].created_by,
//           creatat: new Date(result[i].created_at).toLocaleString(),
//           para: shortToFullName(result[i].para)
//         }
//         data.push(x);
//       }
//       //console.log(data)
//       res.json({
//         draw: 1,
//         agents:data,
//         recordsTotal: data.length,
//         recordsFiltered: data.length, 
//       });
//     }
//     res.end()
//   })
// })

function shortToFullName(name){
  switch(name){
    case "quanity":
      name = "Quanity";
      break;
    case "flowRate":
      name = "Flow rate";
      break;
    case "pressure":
      name = "Pressure";
      break;
  }
  return name;
}

// app.get("/get/alertTimeSend",function(req,res){
//   let usr = req.user.usr;
//   accessDB("SELECT alert_time_send.dayOfWeek,alert_time_send.time,alert_time_send.status FROM alert_time_send,account WHERE account.usr = ? AND account.id=alert_time_send.id",[usr],function(result){
//     // console.log(result);
//     if(result.length>0){
//       if(result[0].dayOfWeek == null){
//         res.send(null);
//         res.end()
//       }else{
//         res.send(JSON.stringify(result[0]));
//         res.end();
//       }

//     }
//     else{
//       res.end(null);
//     }
//   })
// })

// app.post("/post/alertTimeSend",function(req,res){
//   let usr = req.body.usr;
//   let time = req.body.time;
//   let dow = req.body.dayOfWeek;
//   let status = req.body.status;
//   // console.log(status);
//   accessDB("UPDATE alert_time_send,account SET alert_time_send.time = ?, alert_time_send.dayOfWeek = ?, alert_time_send.status=? WHERE account.usr = ? AND account.id=alert_time_send.id",[time,dow,status,usr],function(result){
//     // console.log(result);
//     res.send(translate_noti_app(req,"save success!"));
//     res.end();
//   })
// })

//admin tab
// app.get("/get/roleAdmin_dataEQ",function(req,res){
//   accessDB("SELECT * FROM totaleq",[],function(result){
//     // console.log(result);
//     if(result.length>0){
//       // console.log(result)
//       res.send(JSON.stringify(result));
//       res.end();
//     }else{
//       res.send(null);
//       res.end();
//     }
//   })
// })

// app.post("/post/AddsendSetRole",function(req,res){
//   let user_id = req.body.user_id;
//   let ideq = req.body.ideq;
//   // console.log(user_id, ideq );
//   accessDB("INSERT INTO group_user (user_id,ideq) VALUES (?,?)",[user_id,ideq],function(result){
//     res.send(JSON.stringify(result));
//     res.end();
//   })
// })

// app.post("/post/DeletesendSetRole",function(req,res){
//   let user_id = req.body.user_id;
//   let ideq = req.body.ideq;
//   // console.log(user_id, ideq );
//   accessDB("DELETE FROM group_user WHERE user_id = ? AND ideq = ?",[user_id,ideq],function(result){
//     res.send(JSON.stringify(result));
//     res.end();
//   })
// })

// app.get("/get/DeleteSetRoleAll",function(req,res){
//   if(req.user.role == "admin"){
//     let user_id = req.query.user_id;
//     accessDB("DELETE FROM group_user WHERE user_id = ?",[user_id],function(result){
//       res.send(JSON.stringify(result));
//       res.end();
//     })
//   }else{
//     res.redirect("/dashboard");
//     res.end()
//   }

// })

// app.post("/post/AddSetRoleAll",function(req,res){
//   if(req.user.role == "admin"){
//     let user_id = req.body.user_id;
//     let eq = req.body.eq;
    
//     accessDB("DELETE FROM group_user WHERE user_id = ?",[user_id],function(result){
//       for(let i=0; i<eq.length; i++){
//         accessDB("INSERT INTO group_user (user_id,ideq) VALUES (?,?)",[user_id,eq[i]],function(result1){
//           // console.log(result1);
//         })
//       }
//     })
//   }else{
//     res.redirect("/dashboard");
//   }
//   res.end()
// })

// app.post("/get/selectEQ",function(req,res){
//   let user_id = req.body.user_id;
//   accessDB("SELECT * FROM group_user WHERE user_id = ?",[user_id],function(result){
//     res.send(JSON.stringify(result));
//     res.end();
//   })
// })

// app.post("/set/resetPassword",function(req,res){
//   let email = req.body.email;
//   let usr = req.body.usr;
//   // console.log(email,usr)
//   sendmail(req,email,res,usr);
// })



// app.post("/get/changePassword",function(req,res){
//   let newPass = req.body.newPass;
//   let curPass = req.body.curPass;
//   let usr = req.body.usr;
//   accessDB("SELECT * FROM account WHERE usr = ?",[usr],function(result){
//     if(result.length > 0){
//       if(bcrypt.compareSync(curPass, result[0].pass)){
//         accessDB("UPDATE account SET pass=? WHERE usr = ?",[bcrypt.hashSync(newPass, saltRounds),usr],function(result){
//           console.log(result);
//           res.send(translate_noti_app(req,"Change password success!"));
//           res.end();
//           return true;
//         })
//       }else{
//         res.send(translate_noti_app(req,"wrong current password!"));
//         res.end();
//         return false;
//       }
//     }else{
//       res.send(translate_noti_app(req,"ERR! cannot find user!"))
//       res.end();
//       return false;
//     }
//   })
// })



// app.get("/set/changeRoleAdmin",function(req,res){
//   let role = req.query.role;
//   let id = req.query.id;
//   // console.log(role);
//   accessDB("UPDATE account SET role=? WHERE id = ?",[role,id],function(result){
//     res.send(JSON.stringify(result));
//     res.end();
//   })
// })







//test warning level time
// app.get("/get/warningThresholdTime",function(req,res){
//   let id= req.query.ID;
//   let fr = req.query.fr;
//   let to = req.query.to;
//   accessDB("SELECT * FROM emeterdata WHERE ID = ? AND TIME > ? AND TIME < ?",[id,fr,to],function(result){
//     if(result.length>0){
//       res.send(JSON.stringify(result));
//     }
//     res.end();
//   })
// })

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
// var port = 8000;
// // app.listen(port, ()=> console.log("server listening on port " + port));
// port = process.env.PORT || port;
// app.listen(port);
// console.log('todo list RESTful API server started on: ' + port);