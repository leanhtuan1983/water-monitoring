var express = require('express');
var router = express.Router();
var accessDB = require('../config/mysql-config');
// group_eq

router.get("/get_group_eq_list", function (req, res) {
    accessDB("SELECT * FROM group_eq", [], function (result) {
      if (result.length > 0) {
        res.send(JSON.stringify(result));
      }
      // console.log(result);
      res.end();
  
    })
  })
  router.get("/get_count_group_eq_list", function (req, res) {
    accessDB("SELECT COUNT(id) FROM totaleq INNER JOIN group_eq ON group_eq.group_id= totaleq.group_id WHERE status=1 AND group_id=?", [], function (result) {
      if (result.length > 0) {
        res.send(JSON.stringify(result));
      }
      // console.log(result);
      res.end();
  
    })
  })
  
  
  
  // add group
  router.post("/add_group/save", (req, res) => {
    var group_name = req.body.group_name;
    // console.log(group_name);
    if(group_name == ""||group_name == null) {
      res.send({
        success: false,
        mess: translate_noti(req,"Group name cannot be empty!")
      });
      return false;
    }
    accessDB("SELECT * FROM group_eq WHERE group_name=?", [group_name], function (result) {
      if (result.length > 0) {
        if (result[0].group_name == group_name) {
          // req.flash('message', translate_noti(req,'The group already exists'));
          // console.log('Tên đăng nhập đã tồn tại');
          res.send({
            success: false,
            mess: translate_noti(req,"Group name has exist!")
          })
        }
        // res.redirect('/source/all');
        // res.end();
        return false;
      } else {
        accessDB("INSERT INTO group_eq (group_name) VALUES (?)", [group_name], function (result) {
          // console.log(result);
          // console.log('record inserted');
          // req.flash('message', translate_noti(req,'Add success'));
          // res.redirect('/source/all');
          res.send({
            success: true,
            mess: translate_noti(req,"Add group success!")
          });
          res.end();
        })
      }
    })
  })
  
  
  
  // edit group
  router.post('/edit_group/edit', function (req, res) {
    let id = req.body.id;
    let group_name = req.body.group_name;
    // console.log(id);
    // console.log(req.body);
    // if(group_name == ""||group_name== null) {
    //   res.send("false");
    //   return false;
    // }
    var sql = `UPDATE group_eq SET group_name=? WHERE id= ?`;
    accessDB("SELECT * FROM group_eq WHERE id = ? and group_name=?", [id,group_name], function(result){
      if(result.length > 0){
        res.send({
          succsess: false,
          mess: translate_noti(req,"You haven't changed group name yet")
        })
        res.end();
        return false;
      }else{
        accessDB("SELECT * FROM group_eq WHERE group_name = ?",[group_name], function(result){
          if(result.length>0){
            res.send({
              success: false,
              mess: translate_noti(req,"Group name has exist!")
            })
            res.end();
            return false;
          }else{
            accessDB(sql, [group_name, id], function (result) {
              // console.log('record updated!');
              // req.flash('message', translate_noti(req,'Update successful'));
              res.send({
                success: true,
                mess: translate_noti(req,"Edit success!")
              });
              // console.log(result);
              res.end();
            });
          }
        })
      }
    })

    // accessDB("SELECT * FROM group_eq WHERE id=? and group_name=?", [id, group_name], function (result) {
    //   if (result.length > 0) {
    //     accessDB(sql, [group_name, id], function (result) {
    //       console.log('record updated!');
    //       // req.flash('message', translate_noti(req,'Update successful'));
    //       // console.log(result);
    //       res.send("true");
    //       res.end();
    //     });
    //   } else {
    //     accessDB("SELECT * FROM group_eq WHERE group_name=?", [group_name], function (result) {
    //       if (result.length > 0) {
    //         req.flash('message', translate_noti(req,'The group already exists'));
    //         // res.redirect('/source/all');
    //         res.end();
    //       } else {
    //         accessDB(sql, [group_name, id], function (result) {
    //           console.log('record updated!');
    //           // req.flash('message', translate_noti(req,'Update successful'));
    //           res.send("true");
    //           console.log(result);
    //           res.end();
    //         });
    //       }
  
    //     })
    //   }
  
    // })
  
  });
  
  // get total_group
  router.get("/get/info",function(req,res){
    // let id = req.query.id;
    accessDB("SELECT * FROM total_group",[],function(result){
      if(result.length > 0){
        res.send(JSON.stringify(result[0]));
      }
      res.end();
    })
  })
  
  
  // edit total_group
  router.post('/edit_group_total/save', function (req, res) {
    // let id = req.body.id;
    let total_group_name = req.body.total_group_name;
    // console.log(id);
    // console.log(total_group_name);
    // if(total_group_name == ""|| total_group_name==null) {
    //   res.send(translate_noti(req,""));
    //   return false;
    // }
    let sql = `UPDATE total_group SET total_group_name= ? WHERE id= 1`;
    accessDB(sql, [total_group_name], function (result) {
      // console.log('record updated!');
      // console.log(result);
      // req.flash('message', translate_noti(req,'Update successful'));
      res.send(translate_noti(req,"Edit success!"));
      res.end();
    });
  });
  
  
  //delete group
  router.post('/delete_group/delete', function (req, res) {
    var id = req.query.id;
    // console.log(id);
    accessDB("DELETE FROM group_eq WHERE id= ?", [id], function (result) {
      // console.log('record deleted!');
      
      // req.flash('message', translate_noti(req,'Delete successfully'));
      // res.redirect('/source/all');
      res.send(translate_noti(req,"Delete success"));
      res.end();
    });
  });
  
  function translate_noti(req,str){
    if(req.cookies.lang){
      if(req.cookies.lang == "vi"){
        switch (str){
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


module.exports = router;