let data_draw_map = [
    {
        "point_1": {
            "lat": 21.063382294122867,
            "lng": 107.39660681223272
        },
        "point_2": {
            "lat": 21.06900891591915,
            "lng": 107.40109146570562
        }
    },
    {
        "point_1": {
            "lat": 21.0722526367379,
            "lng": 107.39978254770635
        },
        "point_2": {
            "lat": 21.06892882315205,
            "lng": 107.40111292337774
        }
    },
    {
        "point_1": {
            "lat": 21.06892882315205,
            "lng": 107.40113438104986
        },
        "point_2": {
            "lat": 21.06392293962338,
            "lng": 107.4075716826856
        }
    },
    {
        "point_1": {
            "lat": 21.068968869540996,
            "lng": 107.4011772963941
        },
        "point_2": {
            "lat": 21.07081099177553,
            "lng": 107.40628422235845
        }
    },
    {
        "point_1": {
            "lat": 21.071688177212906,
            "lng": 107.40621810995853
        },
        "point_2": {
            "lat": 21.071376844337166,
            "lng": 107.4161219395602
        }
    },
    {
        "point_1": {
            "lat": 21.07081050950393,
            "lng": 107.40628499482457
        },
        "point_2": {
            "lat": 21.070967251528423,
            "lng": 107.40634601507966
        }
    },
    {
        "point_1": {
            "lat": 21.07144664314297,
            "lng": 107.41639736370476
        },
        "point_2": {
            "lat": 21.087566137581707,
            "lng": 107.41060161508953
        }
    },
    {
        "point_1": {
            "lat": 21.09032512930643,
            "lng": 107.40477991940324
        },
        "point_2": {
            "lat": 21.087542279438154,
            "lng": 107.41059494854753
        }
    },
    {
        "point_1": {
            "lat": 21.087451636019054,
            "lng": 107.41072110982647
        },
        "point_2": {
            "lat": 21.085009090255614,
            "lng": 107.43410997243633
        }
    },
    {
        "point_1": {
            "lat": 21.08735670286255,
            "lng": 107.41074697921574
        },
        "point_2": {
            "lat": 21.107696356746693,
            "lng": 107.4273981327802
        }
    },
    {
        "point_1": {
            "lat": 21.098003867622914,
            "lng": 107.46160993369946
        },
        "point_2": {
            "lat": 21.10344901198658,
            "lng": 107.45667466911206
        }
    },
    {
        "point_1": {
            "lat": 21.10448997272984,
            "lng": 107.45744714530835
        },
        "point_2": {
            "lat": 21.109774737743635,
            "lng": 107.46384153159985
        }
    },
    {
        "point_1": {
            "lat": 21.109614596113893,
            "lng": 107.46405610832105
        },
        "point_2": {
            "lat": 21.108293421075228,
            "lng": 107.46706018241773
        }
    },
    {
        "point_1": {
            "lat": 21.10999380785988,
            "lng": 107.46390606579209
        },
        "point_2": {
            "lat": 21.115238342986128,
            "lng": 107.46017243084336
        }
    }
  ]

  let data_zone_map = [
    [{"lat":21.07097072061729,"lng":107.40634664265329},
    {"lat":21.072332273070568,"lng":107.3997376797043},
    {"lat":21.06288124019584,"lng":107.39621862151068},
    {"lat":21.06328171987407,"lng":107.40806325640627}
    ],[
      {"lat":21.0713711785153,"lng":107.40617498127799},
      {"lat":21.06925196038167, "lng":107.42026274277212},
      {"lat":21.084585684064233,"lng":107.43518575370342},
      {"lat":21.1079684745125,"lng":107.42754682250265},
      {"lat":21.090351645567758,"lng":107.40454419821265}
    ],[
      {"lat":21.097238472966335,"lng":107.46239408168823},
      {"lat":21.10764818718854,"lng":107.46814473776074},
      {"lat":21.11533489218823,"lng":107.45990499174641},
      {"lat":21.091385858861088, "lng":107.43806972622096}
    ]
  ]
  
  let data_point = [
    {lat: 21.07097072061729, lng: 107.40634664265329, name: "Vân đồn 1"},
    {lat: 21.0713711785153, lng:107.40617498127799, name: "Vân đồn 2" },
    {lat: 21.072332273070568, lng: 107.3997376797043, name: "Vân đồn 3"},
    {lat: 21.06288124019584, lng:107.39621862151068, name: "Vân đồn 4"},
    {lat: 21.06328171987407, lng:107.40806325640627, name: "Vân đồn 5"},
    {lat: 21.071291087021965, lng:107.41638883310826, name: "Vân đồn 6"},
    {lat: 21.090351645567758, lng:107.40454419821265, name: "Vân đồn 7"},
    {lat: 21.084585684064233, lng:107.43518575370342, name: "Vân đồn 8"},
    {lat: 21.1079684745125, lng:107.42754682250265, name: "Vân đồn 9"},
    {lat: 21.11533489218823, lng:107.45990499174641, name: "Vân đồn 10"},
    {lat: 21.10764818718854, lng:107.46814473776074, name: "Vân đồn 11"},
    { lat: 21.097238472966335, lng:107.46239408168823, name: "Vân đồn 12"},
    {lat:21.103804685394067, lng:107.45612844148984, name: "Vân đồn 13"}
]


let data_level_1_tree = [
    {
      "text": "Quảng Ninh [4/4]",
      "state":{
        opened: true,
        selected: false
      },
      id: "QN",
      icon: "wt-icon",
      "children": [
        {
          "text": "Vân đồn [2/2]",
          id: "VD",
          icon: "wt-icon",
          "children": [
            {
              text: "Vân đồn 1 [2/2]",
              icon: "wt-icon",
              id: "VD1",
            },
            {
              text: "Vân đồn 2 [1/1]",
              icon: "wt-icon",
              id:"VD2"
            }
          ]
        },
        {
          text: "Hạ long [0/0]",
          icon: "wt-icon",
          id: "HL",
        },
        {
          text: "Ba Chẽ [0/0]",
          icon: "wt-icon",
          id: "BC",
        },
        {
          text: "Cô Tô [0/0]",
          icon: "wt-icon",
          id: "CT",
        },
        {
          text: "Hải hà [0/0]",
          icon: "wt-icon",
          id: "HH",
        },
        {
          text: "Tiên Yên [0/0]",
          icon: "wt-icon",
          id: "TY",
        },
        {
          text: "Cẩm phả [0/0]",
          icon: "wt-icon",
          id: "CP",
        },
        {
          text: "Uông bí [0/0]",
          icon: "wt-icon",
          id: "UB",
        },
        {
          text: "Đông Triều [0/0]",
          icon: "wt-icon",
          id: "DT",
        },
        {
          text: "Bình Liêu [0/0]",
          icon: "wt-icon",
          id: "BL",
        },
        {
          text: "Đầm hà [0/0]",
          icon: "wt-icon",
          id: "DH",
        },
        {
          text: "Móng cái [0/0]",
          icon: "wt-icon",
          id: "MC",
        }
      ]
    }
  ]


  let data_level_2_tree = [
    {
      text: "Vân đồn [13/13]",
      id: "VD",
      icon: "wt-icon",
      "state":{
        opened: true,
        selected: false
      },
      children: [
        {
          text: "Vân đồn 1  [2/2]",
          icon: "wt-icon",
          id: "VD1",
          children:[
            {
              text: "Vân đồn 1.1",
              icon: "wt-icon"
            },
            {
              text: "Vân đồn 1.2",
              icon: "wt-icon"
            }
          ]
        },
        {
          text: "Vân đồn 2  [1/1]",
          icon: "wt-icon",
          children: [
            {
              text: "Vân đồn 2.1",
              icon: "wt-icon",
              children:[
                {
                  text: "Vân đồn 2.1.2",
                  icon: "wt-icon"
                }
              ]
            }
          ]
        },{
          text: "Vân đồn 3",
          icon: "wt-icon",
        },{
          text: "Vân đồn 4",
          icon: "wt-icon",
        },{
          text: "Vân đồn 5",
          icon: "wt-icon",
        },{
          text: "Vân đồn 6",
          icon: "wt-icon",
        },{
          text: "Vân đồn 7",
          icon: "wt-icon",
        },{
          text: "Vân đồn 8",
          icon: "wt-icon",
        },{
          text: "Vân đồn 9",
          icon: "wt-icon",
        },{
          text: "Vân đồn 10",
          icon: "wt-icon",
        },{
          text: "Vân đồn 11",
          icon: "wt-icon",
        },{
          text: "Vân đồn 12",
          icon: "wt-icon",
        },{
          text: "Vân đồn 13",
          icon: "wt-icon",
        }
      ]
    }
  ]

let data_main_bar_chart = [
  {
    name: "Vân đồn",
    loss: 10,
    remain: 65
  },{
    name: "Hạ long",
    loss: 35,
    remain: 65
  },{
    name: "Ba Chế",
    loss: 35,
    remain: 65
  },{
    name: "Cô tô",
    loss: 35,
    remain: 65
  },{
    name: "Hải hà",
    loss: 35,
    remain: 65
  },{
    name: "Tiên yên",
    loss: 35,
    remain: 65
  },{
    name: "Cẩm phả",
    loss: 35,
    remain: 65
  },{
    name: "Uông bí",
    loss: 35,
    remain: 65
  },{
    name: "test1",
    loss: 35,
    remain: 65
  },{
    name: "test2",
    loss: 35,
    remain: 65
  },{
    name: "test4",
    loss: 35,
    remain: 65
  },{
    name: "test3",
    loss: 35,
    remain: 65
  },{
    name: "test5",
    loss: 35,
    remain: 65
  },{
    name: "test6",
    loss: 35,
    remain: 65
  },{
    name: "test7",
    loss: 35,
    remain: 65
  },{
    name: "tên dài để test hiển thị ",
    loss: 35,
    remain: 65
  },{
    name: "123456",
    loss: 35,
    remain: 65
  }
]