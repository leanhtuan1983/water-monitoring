var accessDB = require('./mysql-config');

function add_log(meter_id,serial_sensor,created_at,log,created_by){
    accessDB("INSERT INTO log_data (meter_id,serial_sensor,created_at,log,created_by) VALUES(?,?,?,?,?);",[meter_id,serial_sensor,created_at,log,created_by],function(result){
        console.log("add log")
    })
}

module.exports = add_log;