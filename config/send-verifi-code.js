var accessDB = require('./mysql-config');
const nodemailer =  require('nodemailer');


function makeid(length) {
  var result           = '';
  var characters       = '0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


function sendmail(emailsend,res,req,again){
  let CODE = makeid(6);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'saoviettest@gmail.com',
          pass: 'saoviet123456'
        }
      });
      
      var mailOptions = {
        from: 'saoviettest@gmail.com',
        to: emailsend,
        subject: '[Sao Việt] Verifi code',
        text: 'Your Verifi code is: '+ CODE,
      };

      accessDB("UPDATE account SET verify_code=? WHERE email = ?",[CODE,emailsend],function(result){
        console.log(result);
        req.session.email = emailsend;
        // res.render("enter_verifi_code", {email: emailsend, err: ""})
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.render("forgot_password",{err: error});
            res.end()
          } else {
            console.log('Email sent: ' + info.response);
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.render("enter_verifi_code", {email: emailsend, err: ""})
            res.end();
          }
        })
        if(again == true){
          res.redirect("/enter_verifi_code_again")
          console.log(true)
        }else{
          res.redirect("/enter_verifi_code")
        }
        console.log("NEW_CODE: " + CODE);
        res.end();
      })
}

module.exports = sendmail