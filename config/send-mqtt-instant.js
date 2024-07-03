let mqtt_option = {
    server: "mqtt://192.168.5.68:1883",
    username: "syssev",
    password: "sv@sev568"
}
var mqtt = require('mqtt');
const accessDB = require("./mysql-config.js");


function send_mqtt(req,res){
    let meter_id = req.body.meter_id;
    var Options={
        clientId:"danh_duc_",
        username: mqtt_option.username,
        password: mqtt_option.password,
        clean:true
    };
    var client  = mqtt.connect(mqtt_option.server,Options);
    var TOPIC = "";
    let mess = "";
    var mess_hex = Buffer.from(mess, 'hex');
    
    client.subscribe(TOPIC, {qos:1});
    client.publish(TOPIC,mess_hex,{retain:true ,qos:1});
    
    client.on('message',function(topic, message, packet){
        let a = message.toString('hex');
            res.send("Đang gửi bản tin tới thiết bị");
            res.end();
            client.unsubscribe(TOPIC);
            client.on('close',function(){
                console.log("close");
            });
            client.end();
    });
    client.on("error",function(error){
        console.log("Can't connect: " + error);
    })
}

module.exports = send_mqtt