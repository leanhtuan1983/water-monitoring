var express = require('express');
var router = express.Router();
const admin_controller = require('../controller/admin');

//get
router.get("/get/account",admin_controller.authen_admin, admin_controller.get_account);
router.get("/get/roleAdmin_dataEQ",admin_controller.authen_admin, admin_controller.get_roleAdmin_dataEQ);
router.get("/get/DeleteSetRoleAll",admin_controller.authen_admin, admin_controller.get_DeleteSetRoleAll);
router.get("/",admin_controller.authen_admin, admin_controller.render_admin);
router.get("/get_MeterCode_list",admin_controller.authen_admin, admin_controller.get_MeterCode_list);
router.get("/change_status",admin_controller.authen_admin, admin_controller.change_status);
router.get("/get/group_setting",admin_controller.authen_admin, admin_controller.get_group_setting);
router.get("/get/get_meter_list",admin_controller.authen_admin, admin_controller.get_meter_list);
router.get("/get/get_filter_group",admin_controller.authen_admin, admin_controller.get_filter_group);
router.get("/get/get_sub_group_list",admin_controller.authen_admin, admin_controller.get_sub_group_list);
router.get("/get/sub_group_setting",admin_controller.authen_admin, admin_controller.sub_group_setting);
router.get("/get/setmap",admin_controller.authen_admin, admin_controller.get_setmap);



router.get("/get/get_data_set_map",admin_controller.authen_admin, admin_controller.get_get_data_set_map);
router.get("/get/table_setting_unit",admin_controller.authen_admin, admin_controller.get_table_setting_unit);
router.get("/get/filter_sub_group",admin_controller.authen_admin, admin_controller.get_filter_sub_group);
router.get("/get/checked_meter",admin_controller.authen_admin, admin_controller.get_checked_meter);
router.get("/get/father_son_add_group",admin_controller.authen_admin, admin_controller.father_son_add_group);
// router.get("/",admin_controller.authen_admin, admin_controller.render_admin);
// router.get("/",admin_controller.authen_admin, admin_controller.render_admin);
router.post("/post/decentralization_meter_id",admin_controller.authen_admin, admin_controller.decentralization_meter_id);
router.post("/post/save_line_setmap",admin_controller.authen_admin, admin_controller.post_save_line_setmap);
router.post("/post/save_zone_setmap",admin_controller.authen_admin, admin_controller.post_save_zone_setmap);


//post
router.post("/registerAdmin",admin_controller.authen_admin, admin_controller.registerAdmin);
router.post("/deleteUsr",admin_controller.authen_admin, admin_controller.deleteUsr);
router.post("/post/AddsendSetRole",admin_controller.authen_admin, admin_controller.post_AddsendSetRole);
router.post("/post/DeletesendSetRole",admin_controller.authen_admin, admin_controller.post_DeletesendSetRole);
router.post("/post/AddSetRoleAll",admin_controller.authen_admin, admin_controller.post_AddSetRoleAll);
router.post("/get/selectEQ",admin_controller.authen_admin, admin_controller.get_selectEQ);
router.post("/set/resetPassword",admin_controller.authen_admin, admin_controller.set_resetPassword);
router.post("/set/changeRoleAdmin",admin_controller.authen_admin, admin_controller.set_changeRoleAdmin);
router.post("/add_meter",admin_controller.authen_admin, admin_controller.add_meter);
router.post("/delete_meter",admin_controller.authen_admin, admin_controller.delete_meter);
router.post("/confirm_delete_meter",admin_controller.authen_admin, admin_controller.confirm_delete_meter);
router.post("/post/delete_group_eq",admin_controller.authen_admin, admin_controller.post_delete_group_eq);
router.post("/post/save_setting_group",admin_controller.authen_admin, admin_controller.post_save_setting_group);
router.post("/post/save_add_group",admin_controller.authen_admin, admin_controller.post_save_add_group);
router.post("/post/setting_unit",admin_controller.authen_admin, admin_controller.setting_unit);
router.post("/post/delete_sub_group_eq",admin_controller.authen_admin, admin_controller.delete_sub_group_eq);
router.post("/post/save_add_sub_group",admin_controller.authen_admin, admin_controller.save_add_sub_group);
router.post("/post/save_setting_sub_group",admin_controller.authen_admin, admin_controller.save_setting_sub_group);
router.post("/post/change_branch_total",admin_controller.authen_admin, admin_controller.change_branch_total);
router.post("/post/save_setmap",admin_controller.authen_admin, admin_controller.save_setmap);
// router.post("/",admin_controller.authen_admin, admin_controller.render_admin);
// router.post("/",admin_controller.authen_admin, admin_controller.render_admin);





module.exports = router;