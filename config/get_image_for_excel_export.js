var pad = function(num) { return ('00'+num).slice(-2) };

function return_date_string(dateObj){
    let date = new Date(dateObj);
    let x = date.getFullYear()         + '-' +
    pad(date.getMonth() + 1)  + '-' +
    pad(date.getDate())       + ' ' +
    pad(date.getHours())      + ':' +
    pad(date.getMinutes())    + ':' +
    pad(date.getSeconds());
    return x;
  }

let { ChartJSNodeCanvas } = require('chartjs-node-canvas');
let backgroundColour = 'white'; 
let width = 2000;
let height = 400;
async function get_image_url(data, type){
    let data_pressure = [];
    let data_flow_rate = [];
    let data_terminal_index = [];
    let data_vol_pin = [];
    let data_vol_ac_quy = [];


    for(let i=0; i<data.length; i++){
      if(data[i].pressure != null){
        data_pressure.push({
          x: return_date_string(data[i].meterTime),
          y: Number(data[i].pressure)
          })
      }
      if(data[i].flowRate != null){
        data_flow_rate.push({
          x: return_date_string(data[i].meterTime),
          y: Number(data[i].flowRate)
          })
      }
    }
    let chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});
    let configuration;
    switch(type){
        case "pressure":
          configuration = {
            type: "line",
            data:{
              datasets: [{
                label: "Áp suất",
                data: data_pressure,
                fill: false,
                borderColor: ['rgba(204, 0, 0, 1)'],
                borderWidth: 2,
              }]
            },
            options: {
              scales: {
                xAxes:[
                  {
                    position: 'bottom',
                    type:"time",
                    time:{
                      unit:"minute"
                    }
                    },
                ],
              },
              elements: {
                point:{
                    radius: 0
                }
              }
            }
          };
          break;
          case "flow_rate":
            configuration = {
              type: "line",
              data:{
                datasets: [{
                  label: "Lưu lượng",
                  data: data_flow_rate,
                  fill: false,
                  borderColor: ['rgba(96, 64, 32, 1)'],
                  borderWidth: 2,
                }]
              },
              options: {
                scales: {
                  xAxes:[
                    {
                      position: 'bottom',
                      type:"time",
                      time:{
                        unit:"minute"
                      }
                      },
                  ],
                },
                elements: {
                  point:{
                      radius: 0
                  }
                }
              }
            };
          break;
    }
      const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);
      return dataUrl;
}

module.exports = get_image_url;