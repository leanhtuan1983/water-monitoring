const express = require('express');
const router = express.Router();
const user_controller = require('../controller/user');

// api not authen
//get
router.get("/change-lang/:lang",user_controller.change_lang);
router.get("/login/get/lang",user_controller.login_get_lang);
router.get("/login",user_controller.render_login);
router.get("/user/register",user_controller.render_register);
router.get("/send_code_again",user_controller.send_code_again);
router.get("/checkAccount",user_controller.checkAccount);
router.get("/logout",user_controller.logout);
router.get("/",user_controller.redirect);
router.get("/forgot_password",user_controller.render_forgot_password);
router.get("/enter_verifi_code",user_controller.render_enter_verifi_code);
router.get("/enter_verifi_code_again",user_controller.render_enter_verifi_code_again);
router.get("/setting_new_pass",user_controller.render_setting_new_pass);
// router.get("/",user_controller.main);
// router.get("/",user_controller.main);
// router.get("/",user_controller.main);
// router.get("/",user_controller.main);
// router.get("/",user_controller.main);
// router.get("/",user_controller.main);
// router.get("/",user_controller.main);



//post
router.post("/register",user_controller.register);
router.post("/user/forgot_password",user_controller.user_forgot_password);
router.post("/user/send_verifi_code",user_controller.user_send_verifi_code);
router.post("/user/set_pass",user_controller.user_set_pass);
// router.post("/",user_controller.main);
// router.post("/",user_controller.main);
// router.post("/",user_controller.main);
// router.post("/",user_controller.main);
// router.post("/",user_controller.main);
// router.post("/",user_controller.main);
// router.post("/",user_controller.main);
// router.post("/",user_controller.main);
// router.post("/",user_controller.main);
// router.post("/",user_controller.main);
// router.post("/",user_controller.main);
// router.post("/",user_controller.main);

//api authen
//get
router.get("/get/report", user_controller.authen, user_controller.get_report);
router.get("/get/user", user_controller.authen, user_controller.get_user);
router.get("/get/exportMultiData", user_controller.authen, user_controller.get_exportMultiData);
router.get("/get/alert", user_controller.authen, user_controller.get_alert);
router.get("/get/alertTimeSend", user_controller.authen, user_controller.get_alertTimeSend);
router.get("/source/all", user_controller.authen, user_controller.render_source);
router.get("/source_2/all", user_controller.authen, user_controller.render_source_2);
router.get("/source_3/all", user_controller.authen, user_controller.render_source_3);

router.get("/alert", user_controller.authen, user_controller.render_alert);
router.get("/dashboard", user_controller.authen, user_controller.render_dashboard);
router.get("/profile", user_controller.authen, user_controller.render_profile);
router.get("/report", user_controller.authen, user_controller.render_report);
router.get("/source/get/EQ", user_controller.authen, user_controller.get_EQ);
router.get("/source/get/instant_value", user_controller.authen, user_controller.get_instant_value);
router.get("/source/get/dataEQ", user_controller.authen, user_controller.get_dataEQ);
router.get("/source/get/dt_m_dataEQ", user_controller.authen, user_controller.get_dt_m_dataEQ);

router.get("/source/get/exportdata", user_controller.authen, user_controller.get_exportdata);
router.get("/source/get/dt_m_exportdata", user_controller.authen, user_controller.get_dt_m_exportdata);

router.get("/source/get/data_chart", user_controller.authen, user_controller.get_data_chart);
router.get("/source/get/vs_data_chart", user_controller.authen, user_controller.vs_get_data_chart);

router.get("/source/get/alert", user_controller.authen, user_controller.get_alert_data);
router.get("/source/get/al_alert", user_controller.authen, user_controller.get_al_alert_data);

router.get("/source/get/info", user_controller.authen, user_controller.get_info);
router.get("/source/get/group_eq", user_controller.authen, user_controller.get_group_eq);
router.get("/source/get/quanity_alert_config", user_controller.authen, user_controller.get_quanity_alert_config);
router.get("/source/get/checkAdmin", user_controller.authen, user_controller.get_checkAdmin);
router.get("/source/get/lang", user_controller.authen, user_controller.get_lang);
router.get("/source/get/group", user_controller.authen, user_controller.get_group);
router.get("/source/get/compen_value", user_controller.authen, user_controller.get_compen_value);
router.get("/source/get/dt_m_compen_value", user_controller.authen, user_controller.get_dt_m_compen_value);

router.get("/source/get/pressure_flowrate_alert_config", user_controller.authen, user_controller.get_pressure_flowrate_alert_config);
router.get("/source/get/measure_setting", user_controller.authen, user_controller.get_measure_setting);
router.get("/source/get/pressure_setting", user_controller.authen, user_controller.get_pressure_setting);
router.get("/source/get/setting_info", user_controller.authen, user_controller.get_setting_info);
router.get("/source/get/dataEQ_inverter", user_controller.authen, user_controller.get_dataEQ_inverter);
router.get("/source/get/exportdata_inverter", user_controller.authen, user_controller.get_exportdata_inverter);
router.get("/source/get/inverter_dataEQ_inverter", user_controller.authen, user_controller.get_inverter_dataEQ_inverter);
router.get("/source/get/data_chart_inverter", user_controller.authen, user_controller.get_data_chart_inverter);
router.get("/source/get/setting_fre_config", user_controller.authen, user_controller.get_setting_fre_config);
router.get("/source/get/setting_pressure_config", user_controller.authen, user_controller.get_setting_pressure_config);
router.get("/source/get/sub_group", user_controller.authen, user_controller.get_sub_group);
router.get("/source/get/draw_map_zone_map", user_controller.authen, user_controller.draw_map_zone_map);

// api cho giao dien moi

router.get("/get/meter_tree", user_controller.authen, user_controller.get_meter_tree);
router.get("/get/node_child", user_controller.authen, user_controller.get_node_child);
router.get("/get/load_tree", user_controller.get_load_tree);
router.get("/get/level_1_data", user_controller.authen, user_controller.get_level_1_data);
router.get("/get/total_level_1_terminal_index_data", user_controller.authen, user_controller.get_total_level_1_terminal_index_data);
router.get("/get/level_1_main_map_data", user_controller.authen, user_controller.get_level_1_main_map_data);
router.get("/get/level_2_data", user_controller.authen, user_controller.get_level_2_data);
router.get("/get/level_2_line_chart_data", user_controller.authen, user_controller.get_level_2_line_chart_data);
router.get("/get/level_2_main_map_data", user_controller.authen, user_controller.get_level_2_main_map_data);
router.get("/get/data_level_3", user_controller.authen, user_controller.get_data_level_3);
router.get("/get/meter_id_node_id", user_controller.authen, user_controller.get_meter_id_node_id);
router.get("/get/data_zooming_chart", user_controller.authen, user_controller.get_data_zooming_chart);
router.get("/get/data_lost_output_chart_data", user_controller.authen, user_controller.data_lost_output_chart_data);
router.get("/get/export_lostdataoutput", user_controller.authen, user_controller.export_lostdataoutput);
router.get("/get/datalostoutput_setting", user_controller.authen, user_controller.get_datalostoutput_setting);
router.get("/get/data_lost_output_level_1", user_controller.authen, user_controller.get_data_lost_output_level_1);
router.get("/get/genera_data", user_controller.authen, user_controller.get_genera_data);
router.get("/source/get/log", user_controller.authen, user_controller.get_log);
router.get("/get/export_meter_list", user_controller.authen, user_controller.export_meter_list);
router.get("/get/ins_data_level_3", user_controller.authen, user_controller.get_ins_data_level_3);
router.get("/get/pie_chart_data_level_3", user_controller.authen, user_controller.get_pie_chart_data_level_3);
router.get("/get/line_chart_data_level_3", user_controller.authen, user_controller.get_line_chart_data_level_3);
router.get("/get/data_level_4", user_controller.authen, user_controller.get_data_level_4);
router.get("/get/export_alert", user_controller.authen, user_controller.get_export_alert);
router.get("/get/mess_rate", user_controller.authen, user_controller.get_mess_rate);
router.get("/get/pie_chart_data_level_2", user_controller.authen, user_controller.get_pie_chart_data_level_2);
router.get("/get/ins_data_level_2", user_controller.authen, user_controller.get_ins_data_level_2);
router.get("/get/line_chart_data_level_2", user_controller.authen, user_controller.get_line_chart_data_level_2);
router.get("/get/group_alert", user_controller.authen, user_controller.get_group_alert);
router.get("/get/ins_data_level_5", user_controller.authen, user_controller.get_ins_data_level_5);
// router.get("/source", user_controller.authen, user_controller.render_source);
// router.get("/source", user_controller.authen, user_controller.render_source);



//post
router.post("/post/alertTimeSend", user_controller.authen, user_controller.post_alertTimeSend);
router.post("/get/changePassword", user_controller.authen, user_controller.get_changePassword);
router.post("/source/post/config", user_controller.authen, user_controller.post_config);
router.post("/source/post/vs_config", user_controller.authen, user_controller.vs_post_config);
router.post("/source/post/edit_info", user_controller.authen, user_controller.post_edit_info);
router.post("/source/post/edit_setting", user_controller.authen, user_controller.post_edit_setting);
router.post("/source/post/save_alert_setting", user_controller.authen, user_controller.post_save_alert_setting);
router.post("/source/post/save_map_location", user_controller.authen, user_controller.post_save_map_location);
router.post("/source/save_pr_fl_setting", user_controller.authen, user_controller.save_pr_fl_setting);
router.post("/source/save_measure_level_setting", user_controller.authen, user_controller.save_measure_level_setting);
router.post("/source/save_compen_value", user_controller.authen, user_controller.save_compen_value);
router.post("/source/post/pressure_setting", user_controller.authen, user_controller.post_pressure_setting);
router.post("/source/post/edit_info_inverter", user_controller.authen, user_controller.post_edit_info_inverter);
router.post("/source/post/save_setting_fre_alert", user_controller.authen, user_controller.post_save_setting_fre_alert);
router.post("/source/post/save_setting_pressure_alert", user_controller.authen, user_controller.post_save_setting_pressure_alert);
router.post("/source/post/save_filter_eq_list", user_controller.authen, user_controller.save_filter_eq_list);
router.post("/post/save_setting_datalostoutput", user_controller.authen, user_controller.post_save_setting_datalostoutput);
router.post("/post/send_mqtt_ins", user_controller.authen, user_controller.post_send_mqtt_ins);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);
// router.post("/source", user_controller.authen, user_controller.source_post_edit_setting);


module.exports = router;