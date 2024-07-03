// var express = require('express');
// var router = express.Router();
// var accessDB = require('../config/mysql-config');

// router.get('/', function (req, res, next) {
//   res.redirect('/login');
//   res.end();
// });

// router.get('/source/all',function(req,res,next){
//   if (req.isAuthenticated()){
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//   res.render('source', {name: req.user.usr, eq: "all"});
//   res.end();
// }
// else{
//   res.redirect('/login');
//   res.end();
// }
// });

// router.get('/admin', function (req, res, next) {
//   if (req.isAuthenticated()) {
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//     res.render('admin', { name: req.user.usr })
//     res.end();
//   }
//   else {
//     res.redirect('/login');
//     res.end();
//   }
// })

// router.get('/alert', function (req, res, next) {
//   if (req.isAuthenticated()) {
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//     res.render('alert', { name: req.user.usr })
//     res.end();
//   }
//   else {
//     res.redirect('/login');
//     res.end();
//   }
// })


// router.get('/dashboard', function (req, res, next) {
//   if (req.isAuthenticated()) {
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//     res.render('dashboard', { name: req.user.usr })
//     res.end();
//   } else {
//     res.redirect('/login');
//     res.end();
//   }
// })

// router.get('/profile', function (req, res, next) {
//   if (req.isAuthenticated()) {
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//     res.render('profile', { name: req.user.usr })
//     res.end();
//   }
//   else {
//     res.redirect('/login');
//     res.end();
//   }
// })

// router.get('/report', function (req, res, next) {
//   if (req.isAuthenticated()) {
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//     res.render('report', { name: req.user.usr });
//     res.end();
//   }
//   else {
//     res.redirect('/login');
//     res.end();
//   }
// });


// router.get("/forgot_password", function (req, res) {
//   res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//   res.header('Expires', '-1');
//   res.header('Pragma', 'no-cache');
//   // req.session.destroy();
//   delete req.session.email;
//   res.render("forgot_password", { err: "" });
//   res.end;
// })


// router.get("/enter_verifi_code", function (req, res) {
//   if (req.session.email) {
//     res.render("enter_verifi_code", { email: req.session.email, err: "" });
//     res.end();
//   } else {
//     res.redirect("/forgot_password")
//     res.end();
//   }
// })




// router.get("/enter_verifi_code_again", function (req, res) {
//   if (req.session.email) {
//     res.render("enter_verifi_code", { email: req.session.email, err: translate_noti(req,"Send success!") });
//     res.end();
//   } else {
//     res.redirect("/forgot_password")
//     res.end();
//   }
// })

// router.get("/setting_new_pass", function (req, res) {
//   if (req.session.email) {
//     res.render("setting_new_pass", { email: req.session.email, err: "" });
//     res.end();
//   } else {
//     res.redirect("/forgot_password");
//     res.end()
//   }
// })

// function translate_noti(req,str){
//   if(req.cookies.lang){
//     if(req.cookies.lang == "vi"){
//       switch (str){
//         case '"Send success!"':
//         return "Gửi lại mã xác nhận thành công";
//       }
//     }else{ return str}
//   }else{
//     return str;
//   }
// }

// module.exports = router;
