// ở đây là các router của phần vị trí thiết bị hiển thị trên bản đồ
var express = require('express');
var router = express.Router();
var accessDB = require('../config/mysql-config');

//map
router.get("/get_map_list", function (req, res) {
  accessDB("SELECT * FROM totaleq", [], function (result) {
    if (result.length > 0) {
      res.send(JSON.stringify(result));
    }
    // console.log(result);
    res.end();

  })
})


router.get("/get_map_detail", function (req, res) {
  let ID = req.query.id;
  req.session.ID_map_group = ID;
  res.render("source_map_detail.ejs", { ID: ID });
  res.end();
})

// map detail
router.get("/get_group_map_detail", function (req, res) {
  let ID = req.query.id;
  // console.log(ID);
  // console.log("vxcvxcv");
  accessDB("SELECT * FROM totaleq WHERE group_id=?", [ID], function (result) {
    if (result.length > 0) {
      res.send(JSON.stringify(result));
    }
    // console.log(result);
    res.end();

  })
})



module.exports = router;