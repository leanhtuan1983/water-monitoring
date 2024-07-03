let accessDB = require("../config/mysql-config")
var bcrypt = require('bcrypt');
var saltRounds = 10;
var sendmail = require("../config/send-mail-resetpass-config");
var add_log = require("../config/add-log-config")

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

function return_in_sql(arr){
  let x = "";
  for(let i=0; i<arr.length; i++){
    x+= "'"+arr[i]+"',"
  }
  return x.slice(0,-1)
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

class admin_controller {
    authen_admin(req,res,next){
        if(req.isAuthenticated() && (req.user.role== "admin" || req.user.role== "admin_client")){
            next();
          }else{
            res.redirect("/login");
            res.end();
          }
    }
    registerAdmin(req,res,next){
        let email = req.body.e;
        let usr = req.body.usr;
        let pass = req.body.pw;
        let role = req.body.role;
        let group = req.body.group;
        let parent_role = req.user.id;
        let access_tab = req.user.access_tab;
        if(role == "admin"){
          group = null;
          access_tab = null;
        }
        if(req.user.role == "admin_client"){
          group = req.user.group;
        }
        var x = bcrypt.hashSync(pass, saltRounds);
        accessDB("SELECT * FROM account WHERE email = ? OR usr = ?",[email,usr],function(result){
          if(result.length >0){
            if(result[0].user_name == usr){
              res.send("failUserName");
              res.end();
            }else if(result[0].email == email){
              res.send("failEmail");
              res.end();
            }
          }else{
            // console.log(usr, email, x, role, 1, group, parent_role, access_tab)
            accessDB("INSERT INTO account (usr, email, pass, role, status, `group`, parent_role, access_tab, created_at) VALUES (?,?,?,?,?,?,?,?,?)",[usr, email, x, role, 1, group, parent_role, access_tab, returnSQLDateFormat(new Date())],function(result){
              res.send(translate_noti_app(req,"Creat Account success!"));
              res.end();
            })
          }
        })
    }

    get_account(req,res,next){
        let role = req.user.role;
        let sql;
        let data_sql = [];
        if(role == "admin"){
          sql = "SELECT *, account.id AS id_acc, account.status AS status FROM account LEFT JOIN group_relationship_demo_QN ON account.group = group_relationship_demo_QN.id;"
        }else if(role == "admin_client"){
          sql = "SELECT *, account.id AS id_acc, account.status AS status FROM account LEFT JOIN group_relationship_demo_QN ON account.group = group_relationship_demo_QN.id WHERE parent_role = ?;"
          data_sql = [req.user.id]
        }else{
          res.end();
          return false;
        }
        accessDB(sql,data_sql,function(result){
          if(result.length>0)
          res.send(JSON.stringify(result));
          res.end();
        });
    }

    deleteUsr(req,res,next){
        let usr = req.body.usr;
        accessDB("DELETE FROM account WHERE usr = ?",[usr],function(result){
            res.send(translate_noti_app(req,"delete success"));
            res.end();
        })
        add_log(null,null,returnSQLDateFormat(new Date().getTime()),"Xóa tài khoản "+ usr,req.user.usr)
    }
    get_roleAdmin_dataEQ(req,res,next){
        let role = req.user.role;
        let sql;
        let data_sql = [];
        if(role == "admin"){
          sql = "SELECT *, totaleq.id AS meter_id FROM totaleq;"
        }else if(role == "admin_client"){
          sql = "SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN group_client ON totaleq.id = group_client.ideq WHERE group_client.user_id = ?;"
          data_sql = [req.user.id]
        }else{
          res.end();
          return false;
        }
        accessDB(sql,data_sql,function(result){
          if(result.length>0){
            res.send(JSON.stringify(result));
            res.end();
          }else{
            res.send(null);
            res.end();
          }
        })
    }
    post_AddsendSetRole(req,res,next){
        let user_id = req.body.user_id;
        let ideq = req.body.ideq;
        accessDB("INSERT INTO group_client (user_id,ideq) VALUES (?,?)",[user_id,ideq],function(result){
          res.send(JSON.stringify(result));
          res.end();
        })
    }
    post_DeletesendSetRole(req,res,next){
        let user_id = req.body.user_id;
        let ideq = req.body.ideq;
        accessDB("DELETE FROM group_client WHERE user_id = ? AND ideq = ?",[user_id,ideq],function(result){
          res.send(JSON.stringify(result));
          res.end();
        })
    }
    get_DeleteSetRoleAll(req,res,next){
        let user_id = req.query.user_id;
        accessDB("DELETE FROM group_client WHERE user_id = ?",[user_id],function(result){
          res.send(JSON.stringify(result));
          res.end();
        })
    }
    post_AddSetRoleAll(req,res,next){
            let user_id = req.body.user_id;
            let eq = req.body.eq;
            accessDB("DELETE FROM group_client WHERE user_id = ?",[user_id],function(result){
              for(let i=0; i<eq.length; i++){
                accessDB("INSERT INTO group_client (user_id,ideq) VALUES (?,?)",[user_id,eq[i]],function(result1){
                })
              }
            })
          res.end()
    }
    get_selectEQ(req,res,next){
        let user_id = req.body.user_id;
        accessDB("SELECT * FROM group_client WHERE user_id = ?",[user_id],function(result){
          res.send(JSON.stringify(result));
          res.end();
        })
    }
    set_resetPassword(req,res,next){
        let email = req.body.email;
        let usr = req.body.usr;
        sendmail(req,email,res,usr);
    }
    set_changeRoleAdmin(req,res,next){
        let role = req.query.role;
        let id = req.query.id;
        accessDB("UPDATE account SET role=? WHERE id = ?",[role,id],function(result){
          res.send(JSON.stringify(result));
          res.end();
        })
    }
    render_admin(req,res,next){
        let group_name = "";
        if(req.user.group != null){
            accessDB("SELECT * FROM group_relationship_demo_QN WHERE id = ?;",[req.user.group],function(result){
              if(result.length > 0){
                group_name = result[0].name;
              }
              res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
              res.header('Expires', '-1');
              res.header('Pragma', 'no-cache');
              res.render('admin', { name: req.user.usr, role: req.user.role, group_name: group_name})
              res.end();
            })
          }else{
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.render('admin', { name: req.user.usr, role: req.user.role, group_name: group_name})
            res.end();
          }
    }
    get_MeterCode_list(req,res,next){
        accessDB("SELECT id, name, serial_sensor, totaleq.id AS meter_id FROM totaleq",[],function(result){
            res.send(JSON.stringify(result));
            res.end();
          })
    }
    add_meter(req,res,next){
        let data = req.body;
        accessDB("SELECT *, totaleq.id AS meter_id FROM totaleq WHERE id = ? AND serial_sensor = ?; ",[data.MeterCode, data.serial_sensor],function(result){
          if(result.length > 0){
            res.send(translate_source(req,"Meter has already exist"));
            res.end();
          }else{
            // accessDB("INSERT INTO totaleq (id,name,serial_sensor) VALUES (?,?,?) ;",[data.MeterCode, data.name, data.serial_sensor],function(result){
              res.send(translate_source(req,"Add new meter successfuly"));
              res.end();
            // })
          }
        })
    }
    delete_meter(req,res,next){
        let data = req.body.MeterCode.split("|");
        let id = data[0]; let serial_sensor = data[1];
        accessDB("SELECT * FROM wmeterdata WHERE id = ? AND serial_sensor = ?",[id,serial_sensor],function(result){
          if(result.length > 0){
            res.send(translate_source(req,"Device has data. Want to delete ?"))
            res.end();
          }else{
            accessDB("DELETE FROM totaleq WHERE id = ? AND serial_sensor = ?",[id, serial_sensor],function(result1){
              res.send("no_data");
              res.end()
            })
          }
        })
    }
    confirm_delete_meter(req,res,next){
        let data = req.body.MeterCode.split("|");
        let id = data[0]; let serial_sensor = data[1];
        accessDB("DELETE FROM wmeterdata WHERE ID = ? AND serial_sensor = ?; DELETE FROM totaleq WHERE id = ? AND serial_sensor = ?;", [id, serial_sensor, id, serial_sensor],function(result){
          res.send(translate_source(req,"Delete meter and data successfully"));
          res.end();
        })
    }
    change_status(req,res,next){
        let id = req.query.id;
        let status = req.query.status;
        accessDB("UPDATE account SET status = ? WHERE id = ?",[status,id],function(result){
          if(req.cookies.lang == "en"){
            res.send("Change status success!");
            res.end();
          }else{
            res.send("Thay đổi trạng thái tài khoảng thành công");
            res.end();
          }
        })
    }
    get_group_setting(req,res,next){
        accessDB("SELECT * FROM group_relationship_demo_QN WHERE depth = ? AND parent_id = ?;",[0,0],function(result){
            if(result.length > 0){
              res.send(JSON.stringify(result));
            }
            res.end();
        })
    }
    post_delete_group_eq(req,res,next){
        let id = req.body.id;
        accessDB("call get_tree(?)",[id],function(result){
          let child_data = result[0];
          if(child_data.length > 0){
            let join_child = [];
            for(let i=0; i<child_data.length; i++){
              join_child.push(child_data[i].gr_id);
            }
            join_child.push(id);
            let sql_query = "";
            let sql_para = [];
            if(join_child.length > 1){
              sql_query = "DELETE FROM group_setting WHERE group_id IN ("+join_child.join()+"); DELETE FROM group_information_demo_QN WHERE group_id IN ("+join_child.join()+"); UPDATE group_relationship_demo_QN SET parent_id = ?, depth = ?, have_child = ?, status = ? WHERE id IN ("+join_child.join()+");";
              sql_para = [-1, -1, 0, 0]
            }else{
              sql_query = "DELETE FROM group_setting WHERE group_id = ?; DELETE FROM group_information_demo_QN WHERE group_id = ?; UPDATE group_relationship_demo_QN SET parent_id = ?, depth = ?, have_child = ?, status = ? WHERE id = ?;";
              sql_para = [child_data[0].gr_id, child_data[0].gr_id, -1, -1, 0, 0, child_data[0].gr_id]
            }
            accessDB(sql_query,sql_para,function(result){
              res.send("xóa đơn vị thành công");
              res.end()
            })
          }else{
          res.send("Sai group id");
          res.end()
          }
        })
        // accessDB("DELETE FROM group_list WHERE id = ?; DELETE FROM group_relative WHERE group_id = ?; DELETE sub_group, sub_group_relative FROM sub_group INNER JOIN sub_group_relative ON sub_group.id = sub_group_relative.sub_group_id WHERE sub_group.parent_group_id = ?; ",[id, id, id],function(result){
        //   res.send(translate_noti(req,"Delete successfully"));
        //   res.end()
        // })
    }
    post_save_setting_group(req,res,next){
        let id =req.body.id;
        let val = req.body.val;
        accessDB("UPDATE group_relationship_demo_QN SET name = ? WHERE id = ?;",[val,id],function(result){
          res.send(translate_noti(req,"Edit success!"));
          res.end();
        })
    }
    post_save_add_group(req,res,next){
        let group_name = req.body.group_name;
        accessDB("SELECT * FROM group_relationship_demo_QN WHERE name = ?",[group_name],function(result){
          if(result.length > 0){
            res.send(translate_noti(req,"The group already exists"));
            res.end();
          }else{
            accessDB("INSERT INTO group_relationship_demo_QN (name,parent_id,meter_id,depth,have_child,serial_sensor,status) VALUES (?,?,?,?,?,?,?)",[group_name,0,group_name,0,0,group_name,1],function(result2){
              res.send(translate_noti(req,"Add group success!"));
              res.end();
            })
          }
        })
    }

    get_meter_list(req,res,next){
      let group = req.query.group;
      let sub_group = req.query.sub_group;
      let role = req.user.role;
      let sql_query = "";
      let sql_para = null;
      if(role == "admin"){
        if(group == "all"){
          sql_query = "SELECT *, totaleq.id AS meter_id FROM totaleq;";
          sql_para = [];
        }else{
          if(sub_group == "all"){
            sql_query = "SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relative ON totaleq.id = group_relative.ideq WHERE group_relative.group_id = ?;";
            sql_para = [group];
          }else{
            sql_query = "SELECT *, totaleq.id AS meter_id, sub_group_relative.id AS sub_group_relative_id FROM totaleq  INNER JOIN sub_group_relative ON totaleq.id = sub_group_relative.ideq INNER JOIN sub_group ON sub_group_relative.sub_group_id = sub_group.id WHERE sub_group_relative.sub_group_id = ?;";
            sql_para = [sub_group];
          }
        }
      }else if(role == "admin_client"){
        if(sub_group == "all"){
          sql_query = "SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN group_relative ON totaleq.id = group_relative.ideq WHERE group_relative.group_id = ?;";
          sql_para = [group];
        }else{
          sql_query = "SELECT *, totaleq.id AS meter_id, sub_group_relative. AS sub_group_relative_id FROM totaleq  INNER JOIN sub_group_relative ON totaleq.id = sub_group_relative.ideq INNER JOIN sub_group ON sub_group_relative.sub_group_id = sub_group.id WHERE sub_group_relative.sub_group_id = ?;";
          sql_para = [sub_group];
        }
      }
      accessDB(sql_query,sql_para,function(result){
        res.send(JSON.stringify(result))
        res.end();
      })
    }

    get_filter_group(req,res,next){
      let role = req.user.role;
      if(role == "admin"){
        accessDB("SELECT * FROM group_relationship_demo_QN WHERE parent_id = ? AND depth = ?;",[0,0],function(result){
          res.json({
            err_code: 0,
            message: null,
            data: {role: role, data: result, group: req.user.group}
          })
          res.end()
        })
      }else if(role == "admin_client"){
        let group_id = req.user.group;
        accessDB("call get_tree(?)",[group_id],function(result){
          let child_data = result[0];
          if(child_data.length > 0){
            let join_child = [];
            for(let i=0; i<child_data.length; i++){
              join_child.push(child_data[i].gr_id);
            }
            let sql_query = "";
            let sql_para = [];
            if(child_data.length > 1){
              sql_query = "SELECT * FROM group_setting WHERE group_id IN ("+join_child.join()+");";
              sql_para = []
            }else{
              sql_query = "SELECT * FROM group_setting WHERE group_id = ?";
              sql_para = [child_data[0].gr_id]
            }
            accessDB(sql_query,sql_para,function(result){
              res.json({
                err_code: 0,
                message: null,
                data: {role: role, data: result}
              })
              res.end()
            })
          }else{
            res.json({
              err_code: 0,
              message: null,
              data: {role: role, data: []}
            })
            res.end()
          }
        })
      }

      // accessDB("SELECT * FROM group_list;",[],function(result){
      //   res.send(JSON.stringify(result))
      //   res.end()
      // })
    }
    get_sub_group_list(req,res,next){
      let group_id = req.query.group;
      accessDB("call get_tree(?)",[group_id],function(result){
        let child_data = result[0];
        if(child_data.length > 0){
          let join_child = [];
          for(let i=0; i<child_data.length; i++){
            join_child.push(child_data[i].gr_id);
          }
          let sql_query = "";
          let sql_para = [];
          if(child_data.length > 1){
            sql_query = "SELECT * FROM group_setting WHERE group_id IN ("+join_child.join()+");";
            sql_para = []
          }else{
            sql_query = "SELECT * FROM group_setting WHERE group_id = ?";
            sql_para = [child_data[0].gr_id]
          }
          accessDB(sql_query,sql_para,function(result){
            res.json({
              err_code: 0,
              message: null,
              data: result
            })
            res.end()
          })
        }else{
          res.json({
            err_code: 0,
            message: null,
            data: []
          })
          res.end()
        }
      })
    }

    setting_unit(req,res,next){
      let meter_id = req.body.meter_id;
      let filter_group =  req.body.filter_group;
      let filter_sub_group =  req.body.filter_sub_group;
      let val =  req.body.val;
      if(filter_sub_group == "all"){
        if(filter_group == "all"){
          res.send("lỗi");
          res.end();
        }else{
          if(val){
            accessDB("INSERT INTO group_relative (ideq, group_id) VALUES (?,?);",[meter_id, filter_group],function(result){
              res.send("Thêm thiết bị vào đơn vị thành công!");
              res.end();
            })
          }else{
            accessDB("SELECT * FROM sub_group WHERE parent_group_id = ?;",[filter_group],function(result){
              if(result.length > 0){
                let id_sub_group = [];
                for(let i=0; i<result.length; i++){
                  id_sub_group.push(result[i].id);
                }
                accessDB("DELETE FROM sub_group_relative WHERE id IN ("+id_sub_group.join()+");",[],function(result_2){
                  accessDB("DELETE FROM group_relative WHERE ideq =  ? AND group_id = ?;",[meter_id, filter_group], function(result_3){
                    res.send("Xóa thiết bị khỏi đơn vị thành công!");
                    res.end();
                  })
                })
              }else{
                accessDB("DELETE FROM group_relative WHERE ideq =  ? AND group_id = ?;",[meter_id, filter_group], function(result_3){
                  res.send("Xóa thiết bị khỏi đơn vị thành công!");
                  res.end();
                })
              }
            })

          }
        }
      }else{
        if(val){
          accessDB("SELECT * FROM group_relative WHERE ideq = ? AND group_id = ?;",[meter_id,filter_group],function(result){
            if(result.length > 0){
              accessDB("INSERT INTO sub_group_relative (ideq, sub_group_id) VALUES (?,?);",[meter_id, filter_sub_group],function(result_2){
                res.send("Thêm thiết bị vào nhóm thành công!");
                res.end();
              })
            }else{
              accessDB("INSERT INTO sub_group_relative (ideq, sub_group_id) VALUES (?,?); INSERT INTO group_relative (ideq, group_id) VALUES (?,?);",[meter_id, filter_sub_group, meter_id, filter_group],function(result){
                res.send("Thêm thiết bị vào nhóm thành công!");
                res.end();
              })
            }
          })

        }else{
          accessDB("DELETE FROM sub_group_relative WHERE ideq=  ? AND sub_group_id = ?;",[meter_id, filter_sub_group], function(result){
            res.send("Xóa thiết bị khỏi nhóm thành công!");
            res.end();
          })
        }
      }
    }
    sub_group_setting(req,res,next){
      let group = "";
      if(req.user.role == "admin"){
        group = req.query.group;
      }else{
        group = req.user.group;
      }
      accessDB("call get_tree(?)",[group],function(result){
        let child_data = result[0];
        if(child_data.length > 0){
          let join_child = [];
          for(let i=0; i<child_data.length; i++){
            join_child.push(child_data[i].gr_id);
          }
          join_child.push(group);
            let sql_query = "";
            sql_query = "SELECT * FROM group_setting WHERE group_id IN ("+return_in_sql(join_child)+");";
            let sql_para = []
 
          accessDB(sql_query,sql_para,function(result1){
            res.json({
              err_code: 0,
              message: null,
              data:  result1
            })
            res.end()
          })
        }else{
          res.json({
            err_code: 0,
            message: null,
            data: []
          })
          res.end()
        }
      })
    }
    delete_sub_group_eq(req,res,next){
      let sub_group = req.body.sub_group;
      accessDB("call get_tree(?);",[sub_group],function(result){
        let child_data = result[0];
          let join_child = [];
          for(let i=0; i<child_data.length; i++){
            join_child.push(child_data[i].gr_id);
          }
          join_child.push(sub_group);
          let sql_query = "";
          let sql_para = [];
          // if(join_child.length > 1){
            sql_query = "DELETE FROM group_setting WHERE group_id IN ("+join_child.join()+"); DELETE FROM group_information_demo_QN WHERE group_id IN ("+join_child.join()+"); UPDATE group_relationship_demo_QN SET parent_id = ?, depth = ?, have_child = ?, status = ? WHERE id IN ("+join_child.join()+");";
            sql_para = [-1, -1, 0, 0]
          // }else{
          //   sql_query = "DELETE FROM group_setting WHERE group_id = ?; DELETE FROM group_information_demo_QN WHERE group_id = ?; UPDATE group_relationship_demo_QN SET parent_id = ?, depth = ?, have_child = ?, status = ? WHERE id = ?;";
          //   sql_para = [join_child[0], join_child[0], -1, -1, 0, 0, join_child.gr_id]
          // }
          accessDB(sql_query,sql_para,function(result){
            res.send("xóa nhóm thành công");
            res.end()
          })
      })
    }
    save_add_sub_group(req,res,next){
      let sub_group_name = req.body.sub_group_name;
      let group = req.body.group;
      let father_id = req.body.father_id;
      let father_depth = req.body.father_depth;
      let meter_id = req.body.meter_id;
      let serial_sensor = req.body.serial_sensor;
      if(sub_group_name == "" || sub_group_name == null || father_id == "" || father_id == null || father_depth == null || father_depth == ""){
        res.send("Trường dữ liệu không được để trống");
        res.end();
        return false;
      }else{
        if(meter_id =="" && serial_sensor == ""){
          accessDB("INSERT INTO group_relationship_demo_QN (name, parent_id, meter_id, depth, have_child, serial_sensor, status, contain_meter) VALUES(?,?,?,?,?,?,?,?);", [sub_group_name, father_id, sub_group_name, father_depth, 1, sub_group_name, 1, 0], function(result){
            let id = result.insertId;
            accessDB("INSERT INTO group_setting (group_id, name, active) VALUES(?,?,?);",[id, sub_group_name, 0],function(result_2){
              res.send("Thêm nhóm thành công");
              res.end();
            })
          })
          // accessDB("INSERT INTO group_setting (group_id, name, active) VALUES(?,?,?); INSERT INTO group_relationship_demo_QN (name, parent_id, meter_id, depth, have_child, serial_sensor, status, contain_meter) VALUES(?,?,?,?,?,?,?,?);",[father_id, sub_group_name, 0,sub_group_name, father_id, sub_group_name, father_depth, 1, sub_group_name, 1, 0],function(result){
          //   res.send("Thêm nhóm thành công");
          //   res.end();
          // })
        }else{
          accessDB("INSERT INTO group_setting (group_id, name, active) VALUES(?,?,?); INSERT INTO group_information_demo_QN (group_id,meter_id,nhanh_tong,serial_sensor) VALUES (?,?,?,?);",[father_id, sub_group_name,1,father_id,meter_id,1,serial_sensor],function(result){
            res.send("Thêm nhóm thành công");
            res.end();
          })
        }

      }
    }
    save_setting_sub_group(req,res,next){
      let sub_group_id = req.body.id;
      let sub_group_name = req.body.val;
      accessDB("UPDATE group_setting SET name = ? WHERE group_id = ?;",[sub_group_name, sub_group_id],function(result){
        res.send("Cập nhật nhóm thành công")
        res.end()
      })
    }
    change_branch_total(req,res,next){
      let id = req.body.id;
      let data = req.body.data;
      let number_data;
      switch(data){
        case "branch":
          number_data = 0;
          break;
        case "total":
          number_data = 1;
          break
        default:
          res.send("Sai định dạng nhánh tổng!");
          res.end();
          return false;
      }
      accessDB("UPDATE group_information_demo_QN SET nhanh_tong = ? WHERE id = ?;",[number_data,id],function(result){
        res.send("Cập nhật nhánh tổng thành công;")
        res.end();
      })
    }
    save_setmap(req,res,next){
      let draw_map = req.body.draw_map;
      let filter_sub_group_setmap = Number(req.body.filter_sub_group_setmap);
      accessDB("UPDATE sub_group SET draw_map = ? WHERE id = ?;",[JSON.stringify(draw_map),filter_sub_group_setmap],function(result){
        res.send("Cài đặt vẽ bản đồ thành công!")
        res.end();
      })
    }
    get_setmap(req,res,next){
      let sub_group = req.query.sub_group;
      accessDB("SELECT draw_map FROM sub_group WHERE id = ?;",[sub_group],function(result){
        if(result.length>0){
          res.send(result[0].draw_map)
        }
        res.end();
      })
    }
    get_get_data_set_map(req,res,next){
      let group_id = req.query.group_id;
      accessDB("SELECT *, totaleq.id AS meter_id FROM totaleq INNER JOIN group_information_demo_QN ON totaleq.id = group_information_demo_QN.meter_id AND totaleq.serial_sensor = group_information_demo_QN.serial_sensor WHERE group_information_demo_QN.group_id = ?; SELECT * FROM draw_map_demo_QN WHERE group_id = ?;",[group_id,group_id],function(result){
        res.json({
          err_code: 0,
          message: null,
          data: {
            meter_location: result[0],
            draw_map: result[1]
          }
        })
        res.end()
      })
    }
    post_save_line_setmap(req,res,next){
      let group_id = req.body.group_id;
      let line_setmap = req.body.line_setmap
      if(group_id == "all" || isNaN(Number(group_id)) == true){
        res.json({
          err_code: 1,
          message: "Sai định dạng group id;",
          data: []
        })
        res.end();
        return false;
      }else{  
        accessDB("SELECT * FROM draw_map_demo_QN WHERE group_id = ?;",[group_id],function(result){
          if(result.length > 0){
            accessDB("UPDATE draw_map_demo_QN SET line_map = ? WHERE group_id = ?;",[JSON.stringify(line_setmap),group_id],function(result){
              res.json({
                err_code: 0,
                message: "",
                data: "Cập nhật vẽ đường bản đồ thành công"
              })
              res.end();
              return true;
            })
          }else{
            accessDB("INSERT INTO draw_map_demo_QN (group_id, line_map) VALUES (?,?);",[group_id,JSON.stringify(line_setmap)],function(result){
              res.json({
                err_code: 0,
                message: "",
                data: "Cập nhật vẽ đường bản đồ thành công"
              })
              res.end();
            })
          }
        })
      }
    }
    post_save_zone_setmap(req,res,next){
      let group_id = req.body.group_id;
      let zone_setmap = req.body.zone_setmap
      if(group_id == "all" || isNaN(Number(group_id)) == true){
        res.json({
          err_code: 1,
          message: "Sai định dạng group id;",
          data: []
        })
        res.end();
        return false;
      }else{  
        accessDB("SELECT * FROM draw_map_demo_QN WHERE group_id = ?;",[group_id],function(result){
          if(result.length > 0){
            accessDB("UPDATE draw_map_demo_QN SET zone_map = ? WHERE group_id = ?;",[JSON.stringify(zone_setmap),group_id],function(result){
              res.json({
                err_code: 0,
                message: "",
                data: "Cập nhật vẽ vùng bản đồ thành công"
              })
              res.end();
              return true;
            })
          }else{
            accessDB("INSERT INTO draw_map_demo_QN (group_id, zone_map) VALUES (?,?);",[group_id,JSON.stringify(zone_setmap)],function(result){
              res.json({
                err_code: 0,
                message: "",
                data: "Cập nhật vẽ vùng bản đồ thành công"
              })
              res.end();
            })
          }
        })
      }
    }
    get_table_setting_unit(req,res,next){
      if(req.user.role == "admin"){
        accessDB("SELECT * FROM group_relationship_demo_QN INNER JOIN totaleq ON group_relationship_demo_QN.meter_id = totaleq.id AND group_relationship_demo_QN.serial_sensor = totaleq.serial_sensor;",[],function(result){
          res.json({
            err_code: 0,
            message: "",
            data: result
          })
          res.end();
        })
      }else{
        if(req.user.group != null){
          accessDB("call get_tree(?)",[req.user.group],function(result){
            res.json({
              err_code: 0,
              message: "",
              data: result[0]
            })
            res.end();
          })
        }else{
          res.json({
            err_code: 1,
            message: "Không có group id;",
            data: []
          })
          res.end();
        }
      }
    }
    get_filter_sub_group(req,res,next){
      let group_id = req.query.group;
      if(group_id == "all"){
        res.json({
          err_code: 0,
          message: null,
          data: []
        })
        res.end()
      }else{
        accessDB("call get_tree(?)",[group_id],function(result){
          let child_data = result[0];
          if(child_data.length > 0){
            let join_child = [];
            for(let i=0; i<child_data.length; i++){
              join_child.push(child_data[i].gr_id);
            }
            let sql_query = "";
            let sql_para = [];
            if(child_data.length > 1){
              sql_query = "SELECT * FROM group_setting WHERE group_id IN ("+join_child.join()+");";
              sql_para = []
            }else{
              sql_query = "SELECT * FROM group_setting WHERE group_id = ?";
              sql_para = [child_data[0].gr_id]
            }
            accessDB(sql_query,sql_para,function(result1){
              res.json({
                err_code: 0,
                message: null,
                data:  result1
              })
              res.end()
            })
          }else{
            res.json({
              err_code: 0,
              message: null,
              data: []
            })
            res.end()
          }
        })
      }

    }
    get_checked_meter(req,res,next){
      let group;
      if(req.user.role == "admin"){
        group = req.query.group;
      }else{
        group = req.user.group;
      }
      let sub_group = req.query.sub_group;
      let role = req.user.role; 
      if(role == "admin"){
        if(group == "all"){
          res.json({
            err_code: 0,
            message: null,
            data: []
          })
          res.end()
        }else{
          if(sub_group == "all"){
            accessDB("call get_tree(?)",[group],function(result){
              res.json({
                err_code: 0,
                message: null,
                data: result[0]
              })
              res.end()
            })
          }else{
            accessDB("SELECT *, group_information_demo_QN.id AS gr_info_id, totaleq.id AS id FROM totaleq INNER JOIN group_information_demo_QN ON totaleq.id = group_information_demo_QN.meter_id AND totaleq.serial_sensor = group_information_demo_QN.serial_sensor WHERE group_information_demo_QN.group_id = ?;",[sub_group],function(result){
              res.json({
                err_code: 0,
                message: null,
                data: result
              })
              res.end()
            })
          }
        }
      }else if(role == "admin_client"){
        if(sub_group == 'all'){
          res.json({
            err_code: 0,
            message: null,
            data: []
          })
          res.end()
        }else{
          accessDB("SELECT *, group_information_demo_QN.id AS gr_info_id, totaleq.id AS id FROM totaleq INNER JOIN group_information_demo_QN ON totaleq.id = group_information_demo_QN.meter_id AND totaleq.serial_sensor = group_information_demo_QN.serial_sensor WHERE group_information_demo_QN.group_id = ?;",[sub_group],function(result){
            res.json({
              err_code: 0,
              message: null,
              data: result
            })
            res.end()
          })
        }
      }
    }
    decentralization_meter_id(req,res,next){
      let meter_id = req.body.meter_id;
      let val = req.body.val;
      let group = req.body.group;
      let sub_group = req.body.sub_group;
      let serial_sensor = req.body.serial_sensor;
      if(group == "all"){
        res.json({
          err_code: 1,
          message: "Chưa chọn đơn vị, nhóm",
          data: []
        })
        res.end()
      }else{
        if(val){
          if(sub_group == "all"){
            accessDB('SELECT * FROM group_relationship_demo_QN WHERE meter_id = ? AND serial_sensor = ?;',[meter_id,serial_sensor],function(result){
              if(result.length > 0){
                accessDB("SELECT * FROM group_relationship_demo_QN WHERE id = ?;",[group],function(result3){
                  if(result3.length > 0){
                    accessDB("UPDATE group_relationship_demo_QN SET parent_id = ?, depth = ?, have_child = ?, `status` = ?  WHERE meter_id = ? AND serial_sensor = ?;",[group,1,0,1,meter_id,serial_sensor],function(result2){
                      res.json({
                        err_code: 0,
                        message: null,
                        data: "Thêm thiết bị "+meter_id+" vào đơn vị "+result3[0].name +" thành công"
                      })
                      res.end()
                    })
                  }else{
                    res.json({
                      err_code: 1,
                      message: "Thiết bị không tồn tại",
                      data: []
                    })
                    res.end()
                  }
                })
              }else{
                res.json({
                  err_code: 1,
                  message: "Thiết bị không tồn tại",
                  data: []
                })
                res.end()
              }
            })
          }else{
            accessDB('SELECT * FROM group_relationship_demo_QN WHERE meter_id = ? AND serial_sensor = ?;',[meter_id,serial_sensor],function(result){
              if(result.length > 0){
                accessDB("SELECT * FROM group_relationship_demo_QN WHERE id = ?;",[sub_group],function(result3){
                  if(result3.length > 0){
                    accessDB("UPDATE group_relationship_demo_QN SET parent_id = ?, depth = ?, have_child = ?, status = ? WHERE meter_id = ? AND serial_sensor = ?; INSERT INTO group_information_demo_QN (group_id,meter_id,nhanh_tong,serial_sensor) VALUES (?,?,?,?);",[sub_group,result3[0].depth + 1,0,1,meter_id,serial_sensor,sub_group,meter_id,0,serial_sensor],function(result2){
                      res.json({
                        err_code: 0,
                        message: null,
                        data: "Thêm thiết bị "+meter_id+" vào nhóm "+result3[0].name +" thành công"
                      })
                      res.end()
                    })
                  }else{
                    res.json({
                      err_code: 1,
                      message: "Thiết bị không tồn tại",
                      data: []
                    })
                    res.end()
                  }
                })

              }else{
                res.json({
                  err_code: 1,
                  message: "Thiết bị không tồn tại",
                  data: []
                })
                res.end()
              }
            })
          }
        }else{
          if(sub_group == "all"){
            accessDB('SELECT * FROM group_relationship_demo_QN WHERE meter_id = ? AND serial_sensor = ?;',[meter_id,serial_sensor],function(result){
              if(result.length > 0){
                accessDB("call get_tree(?)",[result[0].id],function(result1){
                  let child_data = result1[0];
                  let join_child = [];
                  for(let i=0; i<child_data.length; i++){
                    join_child.push(child_data[i].meter_id)
                  }
                  let sql_query ="";
                  let sql_para = [];
                  join_child.push(meter_id);
                    sql_query = "UPDATE group_relationship_demo_QN SET parent_id = ?, status = ?, depth = ?, have_child = ? WHERE meter_id IN ("+return_in_sql(join_child)+"); DELETE FROM group_information_demo_QN WHERE meter_id IN ("+join_child.join()+");"
                    sql_para = [-1,0,-1,0] 
                  accessDB(sql_query,sql_para,function(result2){
                    res.json({
                      err_code: 0,
                      message: null,
                      data: "Xóa thiết bị "+meter_id+" khỏi đơn vị thành công"
                    })
                    res.end()
                  })
                })
              }else{
                res.json({
                  err_code: 1,
                  message: "Thiết bị không tồn tại",
                  data: []
                })
                res.end()
              }
            })
          }else{
            accessDB('SELECT * FROM group_relationship_demo_QN WHERE meter_id = ? AND serial_sensor = ?;',[meter_id,serial_sensor],function(result){
              if(result.length > 0){
                accessDB("call get_tree(?)",[result[0].id],function(result1){
                  let child_data = result1[0];
                  let join_child = [];
                  for(let i=0; i<child_data.length; i++){
                    join_child.push(child_data[i].meter_id)
                  }
                  join_child.push(meter_id);
                  let sql_query = "";
                  let sql_para = [];
                    sql_query = "UPDATE group_relationship_demo_QN SET parent_id = ?, status = ?, depth = ?, have_child = ? WHERE meter_id IN ("+return_in_sql(join_child)+"); DELETE FROM group_information_demo_QN WHERE meter_id IN ("+join_child.join()+");"
                    sql_para = [group,1,-1,0] 
                  accessDB(sql_query,sql_para,function(result2){
                    res.json({
                      err_code: 0,
                      message: null,
                      data: "Xóa thiết bị "+meter_id+" khỏi nhóm thành công"
                    })
                    res.end()
                  })
                })

              }else{
                res.json({
                  err_code: 1,
                  message: "Thiết bị không tồn tại",
                  data: []
                })
                res.end()
              }
            })
          }
        }
      }
  }
  father_son_add_group(req,res,next){
    let group = "";
    // let sub_group = req.query.sub_group;
    if(req.user.role == "admin"){
      group = req.query.group;
    }else{
      group = req.user.group;
    }
    // console.log(group)
    accessDB("call get_tree(?)",[group],function(result){
      let child_data = result[0];
      if(child_data.length > 0){
        let join_child = [];
        for(let i=0; i<child_data.length; i++){
          join_child.push(child_data[i].gr_id);
        }
        let sql_query = "";
        let sql_para = [];
          sql_query = 'SELECT rela.depth AS depth, rela.meter_id AS meter_id, rela.serial_sensor AS serial_sensor, rela.id AS id, totaleq.name AS name FROM (SELECT * FROM group_relationship_demo_QN WHERE group_relationship_demo_QN.id IN ('+return_in_sql(join_child)+') AND have_child = ?) AS rela LEFT JOIN group_information_demo_QN ON rela.meter_id = group_information_demo_QN.meter_id AND rela.serial_sensor = group_information_demo_QN.serial_sensor INNER JOIN totaleq ON rela.meter_id = totaleq.id AND rela.serial_sensor = totaleq.serial_sensor WHERE (group_information_demo_QN.nhanh_tong = ? AND rela.depth < 3) OR (group_information_demo_QN.nhanh_tong IS NULL AND rela.depth = ?);';
          sql_para = [0,0,1]
        accessDB(sql_query,sql_para,function(result1){
          res.json({
            err_code: 0,
            message: null,
            data:  result1
          })
          res.end()
        })
      }else{
        res.json({
          err_code: 0,
          message: null,
          data: []
        })
        res.end()
      }
    })
  }
    // authen_admin(req,res,next){

    // }
    // authen_admin(req,res,next){

    // }
    // authen_admin(req,res,next){

    // }
    // authen_admin(req,res,next){

    // }
    // authen_admin(req,res,next){

    // }
    // authen_admin(req,res,next){

    // }
    // authen_admin(req,res,next){

    // }
    // authen_admin(req,res,next){

    // }
    // authen_admin(req,res,next){

    // }
    // authen_admin(req,res,next){

    // }
    // authen_admin(req,res,next){

    // }

    // authen_admin(req,res,next){

    // }
    
}


module.exports = new admin_controller;