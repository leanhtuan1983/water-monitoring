var mysql= require('mysql');
var con1 = mysql.createConnection({
    host: "115.146.123.242",
    user: "yolearn",
    password: "iTl123!$",
    database: 'lorawan'
});

//giải mã scale
function addScale(str){
    if(str=="00")
    return 1;
    else if(str=="ff")
    return 0.1;
    else if(str=="fe")
    return 0.01;
    else if(str=="fd")
    return 0.001;
    else if(str=="fc")
    return 0.0001;
    else if(str=="fb")
    return 0.00001;
}

//giải mã thiết bị nhiệt độ - độ ẩm
function decodeTempHumi(stringCode){
    var data = {
        realTime: null,
        temp: null,
        humi: null,
        pinStatus: null
    }
    var arrCode =[];
    var j=0;
    for(let i=0; i<stringCode.length; i+=2){
        arrCode[j] = stringCode[i] + stringCode[i+1];
        j++;
    }
    for(let i=0; i< arrCode.length;i++){
        if(arrCode[i] == '02'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +1;
            if(i >= arrCode.length) return false;
            // data.realTime = x[4] + x[5] + '-' + x[0] + x[1] + '-' + x[2] + x[3]+ ' '+ x[6] + x[7] + ':' + x[8] + x[9] + ':' + x[10] + x[11]; 
            let st = numToMonth(x[0] + x[1]) + " " + x[2] + x[3] + ", 20"+ x[4] + x[5] + " "+ x[6] + x[7] + ':' + x[8] + x[9] + ':' + x[10] + x[11];
            let date = new Date(st);
            data.realTime = date.getTime();
        }else if(arrCode[i] == '80'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.temp = parseInt(x,16) * addScale(arrCode[i]);
        }else if(arrCode[i] == '81'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.humi = hexToInt(x,16) * addScale(arrCode[i]);
        }else if(arrCode[i] == '70'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.pinStatus = hexToInt(x,16) * addScale(arrCode[i]);
        }else{
            return false;
        }
    }
    return data;
}

//giải mã wmeter
function decodeWmeter(){
    var data = {
        realTime: null,
        valNum: null,
        flowRate: null,
        pressure: null
    }
    var arrCode =[];
    var j=0;
    for(let i=0; i<stringCode.length; i+=2){
        arrCode[j] = stringCode[i] + stringCode[i+1];
        j++;
    }
    for(let i=0; i< arrCode.length;i++){
        if(arrCode[i] == '02'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +1;
            if(i >= arrCode.length) return false;
            // data.realTime = x[4] + x[5] + '-' + x[0] + x[1] + '-' + x[2] + x[3]+ ' '+ x[6] + x[7] + ':' + x[8] + x[9] + ':' + x[10] + x[11]; 
            // data.MetterTime = numToMonth(x[0] + x[1]) + " " + x[2] + x[3] + ", 20"+ x[4] + x[5] + " "+ x[6] + x[7] + ':' + x[8] + x[9] + ':' + x[10] + x[11];
            let st = numToMonth(x[0] + x[1]) + " " + x[2] + x[3] + ", 20"+ x[4] + x[5] + " "+ x[6] + x[7] + ':' + x[8] + x[9] + ':' + x[10] + x[11];
            let date = new Date(st);
            data.realTime = date.getTime();
        }else if(arrCode[i] == '90'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.valNum = parseInt(x,16) * addScale(arrCode[i]);
        }else if(arrCode[i] == '91'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.flowRate = hexToInt(x,16) * addScale(arrCode[i]);
        }else if(arrCode[i] == '92'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.pressure = hexToInt(x,16) * addScale(arrCode[i]);
        }else{
            return false;
        }
    }
    return data;
}
// chuyển số sang tháng dùng cho giải mã thời gian
function numToMonth(str){
    if(str == '01'){
        return 'January';
    }else if(str == '02'){
        return 'February';
    }else if(str == '03'){
        return 'March';
    }else if(str == '04'){
        return 'April';
    }else if(str == '05'){
        return 'May';
    }else if(str == '06'){
        return 'June';
    }else if(str == '07'){
        return 'July';
    }else if(str == '08'){
        return 'August';
    }else if(str == '09'){
        return 'September';
    }else if(str == '10'){
        return 'October';
    }else if(str == '11'){
        return 'November';
    }else if(str == '12'){
        return 'December';
    }
}
// giải mã emeter
function decodeEmeter(stringCode){
    var data = {
        MetterTime : null,
        ImRea: null,
        ExRea: null,
        ImAct1: null,
        ImAct2: null,
        ImAct3: null,
        ValAct:null,
        ValRea:null,
        Val_App:null,
        A_RMS:null,
        B_RMS:null,
        C_RMS:null
    };
    var arrCode =[];
    var j=0;
    for(let i=0; i<stringCode.length; i+=2){
        arrCode[j] = stringCode[i] + stringCode[i+1];
        j++;
    };
    for(let i=0; i< arrCode.length;i++){
            if(arrCode[i] == '02'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +1;
            if(i >= arrCode.length) return false;
            // data.MetterTime = x[4] + x[5] + '-' + x[0] + x[1] + '-' + x[2] + x[3]+ ' '+ x[6] + x[7] + ':' + x[8] + x[9] + ':' + x[10] + x[11]; 
            let st = numToMonth(x[0] + x[1]) + " " + x[2] + x[3] + ", 20"+ x[4] + x[5] + " "+ x[6] + x[7] + ':' + x[8] + x[9] + ':' + x[10] + x[11];
            let date = new Date(st);
            data.MetterTime = date.getTime();
        }
        else if(arrCode[i] == '06'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.ImRea = parseInt(x,16) * addScale(arrCode[i]);
        }
        else if(arrCode[i] == '08'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.ExRea = parseInt(x,16) * addScale(arrCode[i]);
        }
        else if(arrCode[i] == '2a'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.ImAct1 = parseInt(x,16) * addScale(arrCode[i]);
        }
        else if(arrCode[i] == '2b'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.ImAct2 = parseInt(x,16) * addScale(arrCode[i]);
        }
        else if(arrCode[i] == '2c'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.ImAct3 = parseInt(x,16) * addScale(arrCode[i]);
        }
        else if(arrCode[i] == '1b'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.ValAct = hexToInt(x,16) * addScale(arrCode[i]);
        }
        else if(arrCode[i] == '1f'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.ValRea = hexToInt(x,16) * addScale(arrCode[i]);
        }
        else if(arrCode[i] == '23'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.Val_App = hexToInt(x,16) * addScale(arrCode[i]);
        }
        else if(arrCode[i] == '0e'){
            let length =parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.A_RMS = hexToInt(x,16) * addScale(arrCode[i]);
        }
        else if(arrCode[i] == '0f'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.B_RMS = hexToInt(x,16) * addScale(arrCode[i]);
        }
        else if(arrCode[i] == '10'){
            let length = parseInt(arrCode[i+1]);
            let x=''
            for(let j=i+2;j<=length+i+1;j++){
                x += arrCode[j];
            };
            i+= length +2;
            if(i >= arrCode.length) return false;
            data.C_RMS = hexToInt(x,16) * addScale(arrCode[i]);
        }else{
            return false;
        }
    }
    return data;
}

// hex to int
function hexToInt(hex) {
    if (hex.length % 2 != 0) {
        hex = "0" + hex;
    }
    var num = parseInt(hex, 16);
    var maxVal = Math.pow(2, hex.length / 2 * 8);
    if (num > maxVal / 2 - 1) {
        num = num - maxVal
    }
    return num;
}
var arrEmeterData = [];
var arrTempHumiData = [];
var arrWmeterData = [];
var error = [];
var warning = [];
var notifi = [];
var log = []

    // lấy dataraw, giải mã và xóa sau khi lấy
    function getdataraw(callback){
        con1.query('call get_data_raw_temp()', function(err, result1){
             if(err) console.log(err);
             let result = result1[0];
            if(result.length != 0){
            for(let i=0; i<result.length; i++){
                if((JSON.parse(result[i].data).DevEUI_uplink != null)) {
                    var DevEUI = JSON.parse(result[i].data).DevEUI_uplink.DevEUI;
                    //kiểm tra loại thiết bị
                    if(DevEUI[0]+DevEUI[1] == "01"){
                        // Emeter
                            if(JSON.parse(result[i].data).DevEUI_uplink.payload_hex != '000008' & JSON.parse(result[i].data).DevEUI_uplink.payload_hex != '000006' ){
                                let id = DevEUI
                                let x = JSON.parse(result[i].data).DevEUI_uplink.payload_hex;
                                let dataDecode = decodeEmeter(x);
                                if(dataDecode == false){
                                    // insert err nếu ko giải mã được
                                    error.push(result[i].data);
                                }else{
                                    let a = {
                                        ID: id,
                                        MetterTime : dataDecode.MetterTime,
                                        ImRea: dataDecode.ImRea,
                                        ExRea: dataDecode.ExRea,
                                        ImAct1: dataDecode.ImAct1,
                                        ImAct2: dataDecode.ImAct2,
                                        ImAct3: dataDecode.ImAct3,
                                        ValAct: dataDecode.ValAct,
                                        ValRea: dataDecode.ValRea,
                                        Val_App: dataDecode.Val_App,
                                        A_RMS: dataDecode.A_RMS,
                                        B_RMS: dataDecode.B_RMS,
                                        C_RMS: dataDecode.C_RMS
                                    };
                                    arrEmeterData.push(a);
                                    let l = {
                                        ID: id,
                                        logData: result[i].data
                                    };
                                    log.push(l);
                                }
                            }else if(JSON.parse(result[i].data).DevEUI_uplink.payload_hex == '000008'){
                                //insert canh bao mat dien
                                let w = {
                                    type: 'poweroff',
                                    data: result[i].data
                                }
                                warning.push(w);
                            }else if(JSON.parse(result[i].data).DevEUI_uplink.payload_hex == '000006'){
                                //insert canh bao co dien
                                let w = {
                                    type: 'poweron',
                                    data: result[i].data
                                }
                                warning.push(w);
                            }
                    }else if(DevEUI[0]+DevEUI[1] == "02"){
                        //TemH-HP Actility
                        if(JSON.parse(result[i].data).DevEUI_uplink.payload_hex != '000008' & JSON.parse(result[i].data).DevEUI_uplink.payload_hex != '000006' ){
                            let id = DevEUI
                            let x = JSON.parse(result[i].data).DevEUI_uplink.payload_hex;
                            let dataDecode = decodeTempHumi(x);
                            if(dataDecode == false){
                                error.push(result[i].data);
                                //  insert err
                            }else{
                                let y = (new Date(result[i].date)).getTime();
                                let a = {
                                    ID: id,
                                    time: y,
                                    realTime: dataDecode.realTime,
                                    temp: dataDecode.temp,
                                    humi: dataDecode.humi,
                                    pinStatus: dataDecode.pinStatus
                                }
                                arrTempHumiData.push(a);
                            }
                        }else if(JSON.parse(result[i].data).DevEUI_uplink.payload_hex == '000008'){
                            //insert canh bao mat dien
                        }else if(JSON.parse(result[i].data).DevEUI_uplink.payload_hex == '000006'){
                            //insert canh bao co dien
                        }
                    }else if(DevEUI[0]+DevEUI[1] == "03"){
                        //WM-Itron-HP Actility
                        if(JSON.parse(result[i].data).DevEUI_uplink.payload_hex != '000008' & JSON.parse(result[i].data).DevEUI_uplink.payload_hex != '000006' ){
                            let id = DevEUI
                            let x = JSON.parse(result[i].data).DevEUI_uplink.payload_hex;
                            let dataDecode = decodeWmeter(x);
                            if(dataDecode == false){
                                //  insert err
                                error.push(result[i].data);
                            }else{
                                let a = {
                                    ID: id,
                                    time: result[i].date,
                                    realTime: a.realTime,
                                    valNum: a.valNum,
                                    flowRate: a.flowRate,
                                    pressure: a.pressure
                                }
                                arrWmeterData.push(a);
                            }
                        }else if(JSON.parse(result[i].data).DevEUI_uplink.payload_hex == '000008'){
                            //insert canh bao mat dien
                            console.log("mat dien")
                        }else if(JSON.parse(result[i].data).DevEUI_uplink.payload_hex == '000006'){
                            //insert canh bao co dien
                            console.log("co dien")
                        }
                    }else if(DevEUI[0]+DevEUI[1] == "10"){
                        // E-meter saoviet
                    }else if(DevEUI[0]+DevEUI[1] == "11"){
                        //WM-Elster saoviet
                    }else if(DevEUI[0]+DevEUI[1] == "12"){
                        // Temp saoviet
                    }else if(DevEUI[0]+DevEUI[1] == "14"){
                        //WM-lXung saoviet
                    }
            }else if(JSON.parse(result[i].data).DevEUI_uplink == null){
                if(JSON.parse(result[i].data).DevEUI_notification != null ){
                    //add thông báo
                    var n = result[i].data
                    notifi.push(n);
                }
            }
        }
            callback();
        }
    });
    };
// insert dữ liệu giải mã vào các cơ sở dữ liệu
function addEmeterData (){
    if(arrEmeterData.length != 0){
        for(let i=0; i< arrEmeterData.length; i++){
            let a={
                ID: arrEmeterData[i].ID,
                MetterTime : arrEmeterData[i].MetterTime,
                ImRea: arrEmeterData[i].ImRea,
                ExRea: arrEmeterData[i].ExRea,
                ImAct1: arrEmeterData[i].ImAct1,
                ImAct2: arrEmeterData[i].ImAct2,
                ImAct3: arrEmeterData[i].ImAct3,
                ValAct: arrEmeterData[i].ValAct,
                ValRea: arrEmeterData[i].ValRea,
                Val_App: arrEmeterData[i].Val_App,
                A_RMS: arrEmeterData[i].A_RMS,
                B_RMS: arrEmeterData[i].B_RMS,
                C_RMS: arrEmeterData[i].C_RMS
            }
            let sql = "INSERT INTO emeterdata (ID, TIME, ImRea, ExRea, ImAct1, ImAct2, ImAct3, ValAct, ValRea, ValApp, A_RMS, B_RMS, C_RMS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
            con1.query(sql,[ a.ID,a.MetterTime,a.ImRea,a.ExRea,a.ImAct1,a.ImAct2,a.ImAct3,a.ValAct,a.ValRea,a.Val_App,a.A_RMS,a.B_RMS,a.C_RMS], function(err, result){
                if(err) {
                    console.log(err);
                }
            });
            
        }
        arrEmeterData = [];
    }
    if(arrTempHumiData.length != 0){
        for(let i=0; i< arrTempHumiData.length; i++){
            let a={
                ID: arrTempHumiData[i].ID,
                time: arrTempHumiData[i].time,
                realTime: arrTempHumiData[i].realTime,
                temp: arrTempHumiData[i].temp,
                humi: arrTempHumiData[i].humi,
                pinStatus: arrTempHumiData[i].pinStatus
            }
            let sql = "INSERT INTO temphumidata (ID, TIME_INSERT, TIME, TEMP, HUMI, PIN_STATUS) VALUES (?,?,?,?,?,?)";
            con1.query(sql,[a.ID,a.time,a.realTime,a.temp,a.humi,a.pinStatus], function(err, result){
                if(err) {
                    console.log(err);
                }
            });
        }
            arrTempHumiData = [];
    }   
    if(arrWmeterData.length != 0){
        for(let i=0; i< arrWmeterData.length; i++){
            let a= {
                id: arrWmeterData[i].ID,
                realTime: arrWmeterData[i].realTime,
                valNum: arrWmeterData[i].valNum,
                flowRate: arrWmeterData[i].flowRate,
                pressure: arrWmeterData[i].pressure
            }
        var sql = "INSERT INTO wmeterdata (ID, TIME, ValOfNum, flowRate, pressure) VALUES (?,?,?,?,?)";
        con1.query(sql,[a.ID,a.realTime,a.valNum,a.flowRate,a.pressure ], function(err, result){
            if(err) {
                console.log(err);
            }
        });
    }
    arrWmeterData = [];
}  
    if(error.length != 0){
        for(let i=0; i< error.length; i++){
            var sql = "INSERT INTO decodefail (data) VALUES ('"+ error[i] +"')";
            con1.query(sql, function(err, result){
                if(err) {
                    console.log(err);
                }
                console.log("insert 1 val to decodefail");
            });          
        }
        error = [];
    }   
    if(warning.length != 0){
        for(let i=0; i< warning.length; i++){
            let a={
                type : warning[i].type,
                data  :warning[i].data
            }
            var sql = "INSERT INTO warning  (TYPE, data) VALUES ('"+ a.type +"','"+a.data +"')";
            con1.query(sql, function(err, result){
                if(err) {
                    console.log(err);
                                }
            });
        }
        warning = [];
    }  
    if(log.length != 0){
        for(let i=0; i< log.length; i++){
            let a={
                ID : log[i].ID,
                data  :log[i].logData
            }
            var sql = "INSERT INTO log  (ID, data) VALUES ('"+ a.ID +"','"+a.data +"')";
            con1.query(sql, function(err, result){
                if(err) {
                    console.log(err);
                        }
            });
        }
        log = [];
    } 
    if(notifi.length != 0){
        // console.log(notifi);
        for(let i=0; i< notifi.length; i++){
            var sql = "INSERT INTO notifi  (data) VALUES ('"+ notifi[i] +"')";
            con1.query(sql, function(err, result){
                if(err) {
                    console.log(err);
                }
            });
        }
        notifi = [];
    }  
}


    getdataraw(addEmeterData);
    var timeUpdate = 1000*60;
    setInterval(function(){
        getdataraw(addEmeterData);
    }, timeUpdate);
   