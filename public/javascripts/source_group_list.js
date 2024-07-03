function httpAsync(postData, url, method, callback) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(JSON.stringify(postData));
    xmlHttp.onload = function () {
        if (xmlHttp.readyState === xmlHttp.DONE) {
            if (xmlHttp.status === 200) {
                callback(xmlHttp.responseText);
            }
        }
    }
}


$(document).ready(function () {
    get_group_eq_list();
    Total_group();
})

var LANG = "en";

function get_group_eq_list() {
    httpAsync(null, "/source/get/group", "GET", function (result) {
        let data = [];
        httpAsync(null, "/source/get/lang", "GET", function (result_lang) {
            let l = JSON.parse(result_lang);
            LANG = l.lang;
            console.log(LANG + "ABC")
            if (result == "" || result == null) {
                show_group_eq_list(data);
            } else {
                data = JSON.parse(result);
                show_group_eq_list(data);
            }
        })


    })
}


function translate_data_table(lang) {
    if (lang == "vi") {
        return {
            "aria": {
                "sortAscending": " - click / quay lại để sắp xếp tăng dần"
            },
            "info": "",
            "infoEmpty": "Không có dữ liệu",
            "loadingRecords": "Đang tải...",
            "search": "Tìm kiếm: ",
            "zeroRecords": "Không có giá trị nào",
            "lengthMenu": "  _MENU_  giá trị mỗi trang",
            "paginate": {
                "previous": "Trước",
                "next": "Sau",
            }
        }
    }
    return {
        "aria": {
            "sortAscending": " - click/return to sort ascending"
        },
        "info": "",
        "infoEmpty": "Data Empty!",
        "loadingRecords": "Loading...",
        "search": "Search: ",
        "zeroRecords": "Zero records",
        "lengthMenu": "  _MENU_  items per page",
        "paginate": {
            "previous": "prev",
            "next": "next",
        }
    }
}



function showStatus(a) {
    if (a == 0 || a == '0') {
        return "Ẩn";
    } else {
        return "Hiển thị"
    }
}

var column = ['index', 'id', 'group_name', 'amount', 'active']

function modifi(data) {
    console.log(data);
    var y = [];
    for (let i = 0; i < data.length; i++) {
        let x = {
            index: i + 1,
            id: data[i].id,
            group_name: data[i].group_name,
            amount: '[' + data[i].oneq + '/' + (data[i].oneq + data[i].offeq) + ']',
            active: '<a href="#" data-role="update"  data-id=' + data[i].id + ' class="editbtn mr-2" title="'+translate_mess("Edit")+'"><i class="fas fa-edit fa-2x"></i></a>'+ "<button class='confirmation mr-2' title='"+translate_mess("Delete")+"' style='border: none; padding: 0;outline: 0 !important;' id='delete"+data[i].id+"'><i class='fas fa-trash-alt fa-2x' style='color:red;'></i></button>"+ '<a href="#" data-role="map_detail"  data-id=' + data[i].id + ' class="map_detail_btn" title="'+translate_mess("Map")+'"><i class="fas fa-map-marker-alt fa-2x"></i></a>'
            // edit: "<button class='btn btn-sm btn-success editbtn'" + data[i].id + "'><i class='fas fa-cog'></i></button>",
            // delete: '<a href="/delete_group/delete?id=' + data[i].id + '" class="confirmation"><i class="fas fa-trash-alt fa-2x" style="color:red;"</i></a>',
            // delete: "<button class='confirmation' style='border: none; padding: 0;outline: 0 !important;' id='delete"+data[i].id+"'><i class='fas fa-trash-alt fa-2x' style='color:red;'></i></button>",
            // map: '<a href="/map/get_map_detail?id=' + data[i].id + '" class="btn btn-primary " >Map</a>',
            // map: '<a href="#" data-role="map_detail"  data-id=' + data[i].id + ' class="map_detail_btn"><i class="fas fa-map-marker-alt fa-2x"></i></a>',
        }
        y.push(x);
    }
    return (y);

}

function changedata(x) {
    let y = [];
    for (let i = 0; i < x.length; i++) {
        let z = { data: x[i] };
        y.push(z);
    }
    return y;
}

function show_group_eq_list(data) {
    $(document).ready(function () {
        $('#table_group').DataTable().destroy();
        $('#table_group').DataTable({
            language: translate_data_table(LANG),

            data: modifi(data),
            columns: changedata(column)
        });
    });
}



$(document).on('click', '.editbtn', function (e) {
    $("#modelEdit").modal('show');
})
$(document).on('click', '.map_detail_btn', function (e) {
    $("#modelMap_detail").modal('show');
})
var DATA_ID;
$(document).ready(function () {
    $(document).on('click', 'a[data-role=update]', function () {
        var id = $(this).data('id');
        // alert(id);
        DATA_ID = id;
        console.log(DATA_ID);
        // Update_group()
        $("#id").val(DATA_ID);
        httpAsync(null, "/source/get/group_eq", "GET", function (result) {
            if (result == "" || result == null) {
                return false;
            } else {
                let data = JSON.parse(result);
                console.log(data)
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == DATA_ID) {
                        $("#update_name").val(data[i].group_name);
                    }

                }

            }
        })
    })
})

//Add
function Add_group() {
    let postData = {
        group_name: $("#group_name").val()
    }
    console.log(postData);
    httpAsync(postData, "/group/add_group/save", "POST", function (result) {
        if(result =="" || result == null){
            if(LANG =="en"){
                alert("save unsuccess")
            }else{
                alert("Lưu không thành công");
            }
        }else{
            let data = JSON.parse(result);
            alert(data.mess);
            if(data.success == true){
                get_group_eq_list();
            }
        }

        // if (result == "true") {
        //     alert("Save success!");
        //     get_group_eq_list();
        // } else {
        //     alert("Save unsuccess");
        // }
    })
}

// Update_group
function Update_group() {
    console.log("Add");
    let postData = {
        id: DATA_ID,
        group_name: $("#update_name").val()
    }
    if(postData.group_name ==""){
        if(LANG =="en"){
            alert("Group name cannot be empty")
            return false
        }else{
            alert("Tên đơn vị không được để trống");
            return false
        }
    }else{
        console.log(postData);
        httpAsync(postData, "/group/edit_group/edit", "POST", function (result) {
            if(result =="" || result == null){
                if(LANG =="en"){
                    alert("save unsuccess")
                }else{
                    alert("Lưu không thành công");
                }
            }else{
                let data = JSON.parse(result);
                alert(data.mess);
                if(data.success == true){
                    get_group_eq_list();
                }
            }
        })
    }

}

// $(document).on('click', '.confirmation', function () {

//     if (LANG == "vi") {

//         return confirm('Bạn có chắc chắn muốn xóa?');

//     }

//     return confirm('Are you sure ?');


// });

//Delete group
$(document).on('click','.confirmation',function(e){
    if(confirm(translate_mess("Are your want delete this group?"))){
      let id =  $(this).attr('id').slice(6);
      let postData = {
        id:id
      }
      console.log(postData)
      httpAsync(postData,'/group/delete_group/delete?id='+id,'POST',function(result){
        get_group_eq_list();
        alert(result);
      })
    }
  })

  function translate_mess(str){
    if(LANG =="en"){
      return str;
  
    }else{
      switch(str){
        case "Are your want delete this group?":
        return "Bạn có chắc muốn xóa đơn vị này?";
        case "Edit":
        return "Sửa";
        case "Delete":
        return "Xóa";
        case "Map":
        return "Vị trí";
      }
    }
  }


 
// Update_Total_group
function Update_Total_group() {
    console.log("Add");
    var Total_id = $("#total_group_id").val();
    let postData = {
        id: Total_id,
        total_group_name: $("#total_group_name").val()
    }
    console.log(postData);
    if(postData.total_group_name =="" ){
        if(LANG == "en"){
            alert("Group name cannot be empty");
            return false;
        }else{
            alert("Tên đơn vị không được để trống")
            return false
        }
    }else{
        httpAsync(postData, "/group/edit_group_total/save", "POST", function (result) {
            alert(result);
            Total_group();
            // if (result == "true") {
            //     alert("Save success!");
            //     Total_group();
    
            // } else {
            //     alert("Save unsuccess");
            // }
        })
    }

}

function Total_group() { // lấy thông tin và điền vào các trường
    httpAsync(null, "/group/get/info", "GET", function (result) {
        if (result == "" || result == null) {
            return false;
        } else {
            let data = JSON.parse(result);
            // console.log(data)
            $("#total_group_id").val(data.id);
            $("#total_group_name").val(data.total_group_name);
            $("#total_group_name_1").val(data.total_group_name);
        }
    })
}
