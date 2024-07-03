
var IDACCOUNT;

function translate(str){
  if(LANG =="en"){
    return str;

  }else{
    switch(str){
      case "Are your want delete this account?":
      return "Bạn có chắc muốn xóa tài khoàn này?";
      case "Username cannot be empty!":
      return "Tên đăng nhập không được để trống";
      case "Invalid email format!":
      return "Sai định dạng email";
      case "User Email cannot be empty!":
      return "Email không được để trống";
      case "Password cannot be empty!":
      return "Mật khẩu không được để trống";
      case "Confirm Password cannot be empty!":
      return "Xác nhận mật khẩu không được để trống";
      case "Password must be at least 8 characters long!":
      return "Mật khẩu phải có độ dài ít nhất 8 ký tự";
      case "Username already taken. Please try another!":
      return "Tên đăng nhập đã được sử dụng";
      case "Email already taken. Please try another!":
      return "Email đã được sử dụng";
      case "delete":
      return "xóa";
      case "The password and confirm password must be match!":
        return "Xác nhận mật khẩu không khớp";
      case "Serial sensor cannot be empty":
        return "Serial sensor không được để trống"
    }
  }
}

function addAccount(){
  httpAsync(null,"/admin/get/group_setting","GET",function(result){
    if(result == "" || result == null){
      $("#select_group_resign").empty();
    }else{
      $("#select_group_resign").empty();
      let x = "";
      let data = JSON.parse(result);
      for(let i=0; i<data.length; i++){
        x+= '<option value="'+data[i].id+'">'+data[i].name+'</option>'
      }
      $("#select_group_resign").append(x);
    }
    $("#roleSubcriber").prop('checked', true)
    $("#select_group_sesign_container").css("display","block");

  })
  
    $('#addAcountModal').modal('show');
  }

function showDataAccount(){
  httpAsync(null,"/admin/get/account","GET",function(result){
    let data = [];
    if(result != "" && result != null){
      data = JSON.parse(result);
      console.log(data);
    }
    loadTableAccount(data);
  })
}

function loadTableAccount(data){
    $(document).ready(function() {
      $('#tableAccount').DataTable().destroy();
      $('#tableAccount').DataTable({
            "pageLength": 10,
              language : translate_data_table(LANG),
              "columnDefs": [
                { className: "dt-head-center", targets: [ 0, 1, 2, 3, 4, 5] },
                { "orderable": true, "targets": [0,1,2,3] }
            ],
              data: modifiAccountData(data),
              columns: [
                  {data: "user_name", className: "text-center-data-table align-middle"},
                  {data: "role", className: "text-center-data-table align-middle"},
                  {data: "email", className: "text-center-data-table align-middle"},
                  {data: "group", className: "text-center-data-table align-middle"},
                  {data: "status", className: "text-center-data-table align-middle"},
                  {data: "delete_btn", className: "text-center-data-table align-middle"},
                  // {data: "setting_btn", className: "text-center-data-table align-middle"},
                ],
      });
  });
}

function modifiAccountData(data){
  var y=[];
  for(let i=0; i<data.length; i++){
    let x ={
      user_name: "<div id= 'usr" +data[i].id_acc+"'>"+data[i].usr+ "</div>",
      role: data[i].role,
      email: "<div id= 'email" +data[i].id_acc+"'>"+data[i].email+ "</div>",
      group: (data[i].name) ? data[i].name : "-",
      status: return_status_btn(data[i].status, data[i].id_acc),
      delete_btn: "<button class='btn btn-sm btn-danger deletebtn' id='delete"+data[i].id_acc+"'>"+translate('delete')+"</button>",
      // setting_btn: (data[i].role == "admin") ? "-" : "<button class='btn btn-sm btn-success editbtn' id='edit"+data[i].id_acc+"'><i class='fas fa-cog'></i></button>",
    }
    y.push(x);
  }
  return(y);
}

function return_status_btn(status, id){
  if(status == "1" || status == 1){
    return '<input type="checkbox" checked class="switch_btn_status" id="___'+id+'">'
  }else{
    return '<input type="checkbox"  class="switch_btn_status" id="___'+id+'">'
  }
}

$(document).ready(function(){
  $(document).on('change','.switch_btn_status',function(){
    // console.log("SWBTN:" + $(this).prop('checked'))
    let val =  $(this).prop('checked');
    let id = $(this).attr("id").slice(3);
    if(val){
      console.log("true:" + id);
      httpAsync(null,"/admin/change_status?id="+id+"&status="+1,"GET",function(result){
        alert(result);
      })
    }else{
      console.log("false:" + id);
      httpAsync(null,"/admin/change_status?id="+id+"&status="+0,"GET",function(result){
        alert(result);
      })
    }
  })
})



function changedata(x){
  let y=[];
  for(let i=0; i< x.length;i++){
    let z = {data : x[i]};
    y.push(z);
  }
  return y;
}




$(document).on('click','.deletebtn',function(e){
  if(confirm(translate("Are your want delete this account?"))){
    let id =  $(this).attr('id').slice(6);
    // let x=id.slice(6)
    // console.log(x);
    let postData = {
      usr: document.getElementById("usr"+id).innerHTML
    }
    console.log(postData)
    httpAsync(postData,'/admin/deleteUsr','POST',function(data){
      showDataAccount();
      alert(data);
    })
  }
})


var TOTALEQ_SET_ROLE = [];

  $(document).on('click','.editbtn',function(e){
    let id =  $(this).attr('id').slice(4);
    IDACCOUNT = id;
    fillResetPassTab(id)
    fillRole(id);
    // console.log(IDACCOUNT)
    // let x=id.slice(6)
    // console.log(x);
    let usr = document.getElementById("usr"+id).innerHTML
    // console.log(usr);
    document.getElementById("accountSetting").innerHTML = usr;
    let postData = {
      user_id: IDACCOUNT
    }
    httpAsync(postData,"/admin/get/selectEQ","POST",function(result){
      let data1 = JSON.parse(result);
      console.log(data1)
      ARREQSELECTED = [];
      for(let i=0; i<data1.length; i++){
        ARREQSELECTED.push(data1[i].ideq)
      }
      changeShowSelectedEQ(ARREQSELECTED);
      // let x = data1.ideq.split(",");
      // if(Array.isArray(x)){
        // ARREQSELECTED = x;
        httpAsync(null,"/admin/get/roleAdmin_dataEQ","GET",function(result){
          if(result != null || result !=""){
            let data = JSON.parse(result);
            for(let i=0; i<data.length;i++){
              TOTALEQ_SET_ROLE.push(data[i].id)
            }
            loadTableSetRole(data);
            $("#setRoleEQ").modal('show');
          }else{
            TOTALEQ_SET_ROLE = [];
            loadTableSetRole(TOTALEQ_SET_ROLE);
            $("#setRoleEQ").modal('show');
          }
        })
      // }
    })
  })

var USER;
window.onload = function(){
  var accName = document.getElementById('accountName').innerHTML;
  USER = accName;
  httpAsync(null,"/source/get/lang","GET",function(result){
    let data = JSON.parse(result);
    LANG = data.lang;
    showDataAccount();
  })
}



var LANG = "en";

function translate_data_table(lang){
  if(lang == "vi"){
    return  {
      "aria": {
          "sortAscending": " - click / quay lại để sắp xếp tăng dần"
        },
      "info": "",
      "infoEmpty":      "Không có dữ liệu",
      "loadingRecords": "Đang tải...",
      "search": "Tìm kiếm: ",
      "zeroRecords":    "Không có giá trị nào",
      "lengthMenu": "  _MENU_  giá trị mỗi trang",
      "paginate": {
          "previous": "Trước",
          "next": "Sau",
        }
  }
  }
  return  {
    "aria": {
        "sortAscending": " - click/return to sort ascending"
      },
    "info": "",
    "infoEmpty":      "Data Empty!",
    "loadingRecords": "Loading...",
    "search": "Search: ",
    "zeroRecords":    "Zero records",
    "lengthMenu": "  _MENU_  items per page",
    "paginate": {
        "previous": "prev",
        "next": "next",
      }
}
}


function resign(){
  let role = $('input[name="role"]:checked').val();
  let email = $("#email").val();
  let username = $("#username").val();
  let pass = $("#pwd").val();
  let cf = $("#cfpwd").val();
  let group = $("#select_group_resign").val()

  if(username == ""){
    $("#alert_message").css("display","block")
    $("#alert_message").html(translate("Username cannot be empty!"))
    return false;
  }
  else if(email == ""){
    $("#alert_message").css("display","block")
    $("#alert_message").html(translate("User Email cannot be empty!"))
    return false;
  }
  else if(!validateEmail(email)){
    $("#alert_message").css("display","block")
    $("#alert_message").html(translate("Invalid email format!"))
    return false;
  }
  else if(pass == ""){
    $("#alert_message").css("display","block")
    $("#alert_message").html(translate("Password cannot be empty!"))
    $("#pwd").val("");
    $("#cfpwd").val("");
    return false;
  }
  else if(cf == ""){
    $("#alert_message").css("display","block")
    $("#alert_message").html(translate("Confirm Password cannot be empty!"))
    $("#pwd").val("");
    $("#cfpwd").val("");
    return false;
  }
  else if(pass.length < 8){
    $("#alert_message").css("display","block")
    $("#alert_message").html(translate("Password must be at least 8 characters long!"))
    $("#pwd").val("");
    $("#cfpwd").val("");
    return false;
  }
  else if(pass != cf){
    $("#alert_message").css("display","block")
    $("#alert_message").html(translate("The password and confirm password must be match!"))
    $("#pwd").val("");
    $("#cfpwd").val("");
    return false;
  }
  else{
    let postData = {
      e: email,
      usr: username,
      pw: pass,
      role: role,
      group: group
    }
    $("#alert_message").css("display","none")
    $("#alert_message").html("");
    console.log(postData)
    httpAsync(postData,"/admin/registerAdmin","POST",function(result){
     console.log(result);
     if(result == "failUserName"){
      $("#alert_message").css("display","block")
      $("#alert_message").html(translate("Username already taken. Please try another!"))
      return false;
     }else if(result == "failEmail"){
      $("#alert_message").css("display","block")
      $("#alert_message").html(translate("Email already taken. Please try another!"))
      return false;
     }else{
       alert(result);
       $("#alert_message").html("");
       $("#username").val("");
       $("#pwd").val("");
       $("#cfpwd").val("");
       $("#email").val("");
       showDataAccount();
     }
    })
  }
}

$(document).ready(function(){
  $("#addAcountModal").on('hidden.bs.modal', function (){
    $("#alert_message").css("display","none")
    $("#alert_message").html("");
    $(this).find('form').trigger('reset');
    $(this).find('select').prop('selectedIndex',0);
    $(this).find('input').val("");
    $("#select_group_resign").empty();
    $("#roleSubcriber").prop('checked', true)
  })
})

$(document).ready(function(){
  $(document).on("click",".role_acc",function(){
    if($("#roleAdminClient").is(':checked') || $("#roleSubcriber").is(':checked')){
      $("#select_group_sesign_container").css("display","block");
    }else{
      $("#select_group_sesign_container").css("display","none")
    }
  })
})




  function httpAsync(postData, url, method, callback){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(JSON.stringify(postData));
    xmlHttp.onload = function(){
    if(xmlHttp.readyState === xmlHttp.DONE){
      if(xmlHttp.status === 200){
          callback(xmlHttp.responseText);
        }
      }
    }
  }


var columns = [ 'checkbox','Id', 'Name'];

  function addChecked(x){
    if(ARREQSELECTED.indexOf(x) > -1){
      return "checked";
    }else return "";
  }

  function modifi(data){
    console.log(data)
    var y=[];
    let checkedbox;
    for(let i=0; i<data.length; i++){
    checkedbox = '<input type="checkbox" '+addChecked(data[i].id)+' class="addEQ" id="' + data[i].id + '">';
    let x ={
    checkbox: checkedbox,
    Id: data[i].id,
    Name: data[i].name,
    }
    y.push(x);
  }
  return(y);
  }

var oTable;

function loadTableSetRole(data){
    $(document).ready(function() {
        $('#tableSetRole').DataTable().destroy();
        oTable =  $('#tableSetRole').DataTable({
                language : translate_data_table(LANG),
                "columnDefs": [
                  { "orderable": false, "targets": [0] },
                  { "orderable": true, "targets": [1, 2] }
              ],
                data: modifi(data),
                columns: changedata(columns),
                stateSave: true
        });
        var allPages = oTable.cells( ).nodes( );
    });
}

var ARREQSELECTED = [];

  $(document).on("click",".addEQ", function(){ //,"input[type=checkbox]"
    if($(this).is(":checked")){
      let x = $(this).attr("id");
      ARREQSELECTED.push(x);
      console.log(ARREQSELECTED);
      changeShowSelectedEQ(ARREQSELECTED);
      let postData = {
        user_id: IDACCOUNT,
        ideq: x
      }
      httpAsync(postData,"/admin/post/AddsendSetRole","POST",function(result){
        console.log(result);
      })
    }else{
      let x = $(this).attr("id");
      let index = ARREQSELECTED.indexOf(x);
      ARREQSELECTED.splice(index, 1);
      console.log(ARREQSELECTED);
      changeShowSelectedEQ(ARREQSELECTED);
      let postData = {
        user_id: IDACCOUNT,
        ideq: x
      }
      httpAsync(postData,"/admin/post/DeletesendSetRole","POST",function(result){
        console.log(result);
      })
    }
  })

  function setRole(op){
    if(!op){
      httpAsync(null,"/admin/get/DeleteSetRoleAll?user_id="+IDACCOUNT,"GET",function(result){
        console.log(result);
      })
    }else{
      let postData = {
        user_id: IDACCOUNT,
        eq: TOTALEQ_SET_ROLE
      }
      console.log(postData)
      httpAsync(postData,"/admin/post/AddSetRoleAll","POST",function(result){
        console.log(result);
      })
    }
  }

  $(document).ready(function(){
    $(document).on("click","#checkAllEQ",function(){
      if($(this).is(":checked")){
        oTable.$("input[type='checkbox']").prop("checked",true);
        ARREQSELECTED = TOTALEQ_SET_ROLE;
        setRole(true);
      }else{
        oTable.$("input[type='checkbox']").prop("checked",false);
        ARREQSELECTED = [];
        setRole(false);
      }
    })
  })

  function changeShowSelectedEQ(arr){
    var x = arr.join();
    $("#selectedEQ").val(x);
  }
  var EMAILSELECTED, USERSELECT;
  function fillResetPassTab(x){
    console.log($("#usr" + x).html())
    USERSELECT = $("#usr" + x).html();
    $("#userNameEdit").val(USERSELECT);
    EMAILSELECTED = $("#email" + x).html();
    $("#mailEdit").val(EMAILSELECTED);
  }

  $(document).ready(function(){
    $('#setRoleEQ').on('hidden.bs.modal', function () {
      $('a[data-target="#setRole"]').tab('show');
    })
  });
 

  function resetPass(){
    let postData = {
      email : EMAILSELECTED,
      usr: USER
    }
    httpAsync(postData,"/admin/set/resetPassword","POST",function(result){
      alert(result);
    })
  }

  function fillRole(id){
    let x = $("#role"+id).html();
    console.log(x)
    if(x == "admin"){
      $("#setRoleAdmin").prop("checked",true)
      $("#setRoleSub").prop("checked",false)
    }else if(x == "sub"){
      $("#setRoleSub").prop("checked",true)
      $("#setRoleAdmin").prop("checked",false)
    }
  }

  $(document).ready(function(){
    $(document).on("click",".changeRole",function(){
      if($(this).is(":checked")){
        let val = $(this).val();
        httpAsync(null,"/admin/set/changeRoleAdmin?role="+val+"&id="+IDACCOUNT,"GET",function(result){
          console.log(result);
        })
      }
    })
  })

  function validateEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }


  // Thêm thiết bị

  function add_meter(){
      $('#add_meter').modal('show');
  }

  function delete_meter(){
    httpAsync(null,"/admin/get_MeterCode_list","GET",function(result){
      if(result != "" && result != null){
        let data = JSON.parse(result);
        $("#delete_meter_select").empty();
        for(let i=0; i<data.length; i++){
          let option = '<option value="'+data[i].id+"|"+data[i].serial_sensor+'" >'+data[i].name+'</option>'
          $("#delete_meter_select").append(option);
        }
        $("#delete_meter_select").selectpicker('refresh');
        if(data.length > 0){
          $("#delete_meter_select").val(data[0].id).trigger("change");
        }
      }
      $('#delete_meter').modal('show');
    })
  }

function submit_add_meter(){
  let data = {
    MeterCode: $("#meter_code").val(),
    name: $("#nameEQ").val(),
    serial_sensor: $("#serial_sensor").val(),
  }
  if(data.MeterCode == "" || data.MeterCode == null){
    alert(translate("Meter code cannot be empty!"));
    $("#add_meter").find('form').trigger('reset');
    $("#add_meter").find('select').prop('selectedIndex',0);
    $("#add_meter").find('input').val("");
    return false;
  }
  if(data.name == "" || data.name == null){
    alert(translate("Meter name cannot be empty!"));
    $("#add_meter").find('form').trigger('reset');
    $("#add_meter").find('select').prop('selectedIndex',0);
    $("#add_meter").find('input').val("");
    return false;
  }
  if(data.serial_sensor == "" || data.serial_sensor == null){
    alert(translate("Serial sensor cannot be empty!"));
    $("#add_meter").find('form').trigger('reset');
    $("#add_meter").find('select').prop('selectedIndex',0);
    $("#add_meter").find('input').val("");
    return false;
  }
  httpAsync(data,"/admin/add_meter","POST",function(result){
    alert(result);
    $("#add_meter").find('form').trigger('reset');
    $("#add_meter").find('select').prop('selectedIndex',0);
    $("#add_meter").find('input').val("");
  })
}

// Xóa thiết bị
var DELETE_METER_AND_DATA;
function submit_delete_meter(){
  let data ={
    MeterCode: $("#delete_meter_select").val()
  } 
  httpAsync(data,"/admin/delete_meter","POST",function(result){
    if(result == "no_data"){
      alert("Xóa thiết bị thành công!");
    }else{
      DELETE_METER_AND_DATA = data.MeterCode;
      $("#delete_meter_notify").modal("show");
    }
  })
}

function accept_delete_meter(){
  httpAsync({MeterCode: DELETE_METER_AND_DATA},"/admin/confirm_delete_meter","POST",function(result){
    alert(result);
    $("#delete_meter_notify").modal("hide");
    $('#delete_meter').modal('hide');
  })
}





// Khi đóng modal thêm và xóa thiết bị
$(document).ready(function(){
  $('#add_meter').on('hidden.bs.modal', function () {
      $(this).find('form').trigger('reset');
      $(this).find('select').prop('selectedIndex',0);
      $(this).find('input').val("");

  })
})

$(document).ready(function(){
  $('#delete_meter').on('hidden.bs.modal', function () {
      $(this).find('form').trigger('reset');
      $(this).find('select').prop('selectedIndex',0);
      $(this).find('input').val("");
      $("#delete_meter_select").empty();
  })
})





// function fill_access_tab(id){
//   httpAsync(null,"/admin/get_access_tab?acc_id="+id,"GET",function(result){
//     $(".input_acc_tab").prop("checked",false);
//     if(result == "" || result == null){
//       alert("Error wrong id account!")
//     }else{
//       let x = JSON.parse(result).access_tab
//       if(x){
//         let data = x.split(",");
//         for(let i=0; i<data.length;i++){
//           $("#acc_tab_"+data[i]).prop("checked",true);
//         }
//       }
//     }
//   })
// }

// function return_access_tab_value(x){
//   if($("#acc_tab_"+x).is(":checked") == true){
//     return x;
//   }
//   return null;
// }

// function save_setting_access_tab(){
//   let data = [];
//   for(let i=2; i<10; i++){
//     let x = return_access_tab_value(i);
//     if(x){
//       data.push(x);
//     }
//   }
//   httpAsync({data:data.join(),acc_id: IDACCOUNT},"/admin/save_setting_access_tab","POST",function(result){
//     alert(result);
//   })
// }


// cài đặt phân quyền
var filter_group = "all";
var filter_sub_group = "all";
var filter_group_name = "all";
var filter_sub_group_name = "all"
function setting_unit(){
  $('#setting_unit_modal').modal('show');
  load_filter_unit();
  render_table_setting_unit();
}


function render_table_setting_unit(){
  httpAsync(null,"/admin/get/table_setting_unit","GET",function(result){
    let parse_data = JSON.parse(result);
    if(parse_data.err_code == 1){
      alert(parse_data.message);
    }else{
      let data = parse_data.data;
      load_table_setting_unit(data);
    }
  })
}

function load_filter_unit(){
  // $("#filter_group").empty();
  // $("#filter_group").append('<option value="all" selected>TẤT CẢ</option><i class="fas fa-sort-down"></i>')
  httpAsync(null,"/admin/get/get_filter_group","GET",function(result){
    let parse_data = JSON.parse(result);
    if(parse_data.err_code == 0){
      let role = parse_data.data.role;
      let data = parse_data.data.data;
      if(role == "admin"){
        $("#filter_group").empty();
        $("#filter_group").append('<option value="all" selected>CHƯA CHỌN</option><i class="fas fa-sort-down"></i>')
        let append_string = "";
        for(let i=0; i<data.length; i++){
          append_string += '<option value="'+data[i].id+'" >'+data[i].name+'</option>'
        }
        $("#filter_group").append(append_string);
        $("#filter_sub_group").empty();
        $("#filter_sub_group").append('<option value="all" selected>CHƯA CHỌN</option><i class="fas fa-sort-down"></i>')
      }else if(role == "admin_client"){
        filter_group = parse_data.data.group
        filter_group_name = $("#filter_group").val()
        $("#filter_sub_group").empty();
        $("#filter_sub_group").append('<option value="all" selected>CHƯA CHỌN</option><i class="fas fa-sort-down"></i>')
        let append_string = "";
        for(let i=0; i<data.length; i++){
          append_string += '<option value="'+data[i].group_id+'" >'+data[i].name+'</option>'
        }
        $("#filter_sub_group").append(append_string)
      }
    }else{
      alert(parse_data.message)
    }
  })
}




// cài đặt Đơn vị
function setting_group(){
  $('#setting_group').modal('show');
  httpAsync(null,"/admin/get/group_setting","GET",function(result){
    if(result == "" || result == null){
      $("#body_group_setting_table").empty();
      $("#body_group_setting_table").append("Không có đơn vị nào");
    }else{
      let data = JSON.parse(result);
      let x = "";
      $("#body_group_setting_table").empty();
      for(let i=0; i<data.length; i++){
        x+= '<tr>'
          + '<td>'+(i+1)+'</td>'
          + '<td><input disabled id="group_name_id_'+data[i].id+'" type="text" class="form-control input_group_name" style="width:100%" value="'+data[i].name+'"></td>'
          + '<td><button class="btn btn-warning btn-sm" onclick="edit_group_eq('+data[i].id+')"><i class="fas fa-cog"></i></button></td>'
          + '<td><button class="btn btn-danger btn-sm" onclick="delete_group_eq('+data[i].id+')"><i class="fa fa-trash" aria-hidden="true"></i></button></td>'
          +'</tr>'
      }
      $("#body_group_setting_table").append(x);
    }
  })
}


var EDIT_ID_SETTING_GROUP;
function edit_group_eq(id){
$(".input_group_name").prop('disabled', true);
$("#group_name_id_"+id).prop('disabled', false);
EDIT_ID_SETTING_GROUP = id;
}

function delete_group_eq(id){
    httpAsync({id: id},"/admin/post/delete_group_eq","POST",function(result){
    alert(result);
    setting_group();
    })
}

function save_setting_group(){
    if($("#group_name_id_"+EDIT_ID_SETTING_GROUP).val() == "" || $("#group_name_id_"+EDIT_ID_SETTING_GROUP).val() == null){
      alert("Tên đơn vị không được để trống!");
      return false;
    }
  httpAsync({id:EDIT_ID_SETTING_GROUP, val:  $("#group_name_id_"+EDIT_ID_SETTING_GROUP).val()},"/admin/post/save_setting_group","POST",function(result){
    alert(result);
    setting_group();
  })
}

function add_group(){
    let group_name = $("#add_group").val();
    if(group_name =="" || group_name == null){
    if(LANG == "vi"){
      alert("Tên đơn vị không được để trống!");
    }else{
      alert("Group name cannot be empty!");
    }
    return false;
    }else{
    httpAsync({group_name: group_name},"/admin/post/save_add_group","POST",function(result){
      alert(result);
      $("#add_group").val("");
      setting_group();
    })
    }
}



// function get_data_unit(){
//   httpAsync(null,"/admin/get/get_meter_list?group="+filter_group+"&sub_group="+filter_sub_group,"GET",function(result){
//     let data = JSON.parse(result)
//     load_table_setting_unit(data);
//   })
// }


var oTable_2;
function load_table_setting_unit(data){
  $(document).ready(function() {
    $('#table_set_unit').DataTable().destroy();
    oTable_2 = $('#table_set_unit').DataTable({
      "pageLength": 50,
      language : translate_data_table(LANG),
      "columnDefs": [
        { className: "dt-head-center", targets: [ 0, 1, 2, 3] },
        { "orderable": true, "targets": [1,2,3] }
      ],
      data: config_setting_unit_data(data),
      columns: [
        {data: "checked_box", className: "text-center-data-table align-middle"},
        {data: "meter_id", className: "text-center-data-table align-middle"},
        {data: "name", className: "text-center-data-table align-middle"},
        // {data: "sub_group", className: "text-center-data-table align-middle"},
        {data: "branch_total", className: "text-center-data-table align-middle"},
      ],
      stateSave: true
    })
    var allPages = oTable_2.cells( ).nodes( );
  })
}

function config_setting_unit_data(data){
  var y=[];
  let a = 0
  for(let i= 0; i < data.length; i++){
    let x ={
    checked_box: '<input type="checkbox" disabled class="checked_box_setting_unit" meter_id="'+data[i].meter_id+'" serial_sensor="'+data[i].serial_sensor+'">',
    meter_id: data[i].meter_id,
    name: data[i].name,
    // sub_group: (filter_group != "all" && filter_sub_group != "all") ? data[i].name_sub_group : "-",
    branch_total: "<div class=' branch_total_container align-middle text-center' id='branch_total_container_"+data[i].meter_id+"'></div>"
    }
    a++;
    y.push(x);
  }
  return(y);
}

// function return_status_branch_total(x){
//   switch(x){
//     case 0:
//     case "0":
//       return "Chưa cài đặt"
//     case 1:
//     case "1":
//       return "Thiết bị nhánh"
//     case 2:
//     case "2":
//       return "Thiết bị tổng"
//   }
// }


// $(document).ready(function(){   
//   $("#filter_group").change(function(){
//     filter_group = $(this).children("option:selected").val();
//     filter_group_name = $(this).children("option:selected").html();
//     filter_sub_group = "all";
//     filter_sub_group_name = "all"
//     check_show_setting_sub_group_btn()
//     $("#filter_sub_group").empty();
//     $("#filter_sub_group").append('<option value="all" selected>TẤT CẢ</option><i class="fas fa-sort-down"></i>')
//     httpAsync(null,"/admin/get/get_sub_group_list?group="+filter_group,"GET",function(result){
//       let parse_data = JSON.parse(result);
//       let str_data = "";
//       for(let i=0; i<parse_data.length; i++){
//         str_data += '<option value="'+parse_data[i].id+'" >'+parse_data[i].name_sub_group+'</option>'
//       }
//       $("#filter_sub_group").append(str_data);
//       // get_data_unit();
//       httpAsync(null,"/admin/get/get_meter_list?group="+filter_group+"&sub_group="+filter_sub_group,"GET",function(result){
//         let data = JSON.parse(result)
//         fill_checked_box(data);
//         load_instruction()
//       })
//     })
//   })
// })



$(document).ready(function(){   
  $("#filter_group").change(function(){
    filter_group = $(this).children("option:selected").val();
    filter_group_name = $(this).children("option:selected").html();
    filter_sub_group = "all";
    filter_sub_group_name = "all"
    check_show_setting_sub_group_btn()
    $("#filter_sub_group").empty();
    $("#filter_sub_group").append('<option value="all" selected>TẤT CẢ</option><i class="fas fa-sort-down"></i>')
    httpAsync(null,"/admin/get/filter_sub_group?group="+filter_group,"GET",function(result){
      let parse_data = JSON.parse(result);
      let data = parse_data.data;
      let str_data = "";
      for(let i=0; i<data.length; i++){
        str_data += '<option value="'+data[i].group_id+'" >'+data[i].name+'</option>'
      }
      $("#filter_sub_group").append(str_data);
      // get_data_unit();
      httpAsync(null,"/admin/get/checked_meter?group="+filter_group+"&sub_group="+filter_sub_group,"GET",function(result){
        let parse_data = JSON.parse(result);
        let data = parse_data.data
        fill_checked_box(data);
        load_instruction()
        // load_checked_meter(data)
      })
    })
  })
})


// function load_checked_meter(data){

// }




$(document).ready(function(){   
  $("#filter_sub_group").change(function(){
    filter_sub_group = $(this).children("option:selected").val();
    filter_sub_group_name = $(this).children("option:selected").html();
    // get_data_unit();
    // check_show_setting_sub_group_btn()
    httpAsync(null,"/admin/get/checked_meter?group="+filter_group+"&sub_group="+filter_sub_group,"GET",function(result){
      let parse_data = JSON.parse(result);
      let data = parse_data.data
      fill_checked_box(data);
      load_instruction()
    })
  })
})

function check_show_setting_sub_group_btn(){
  if(filter_group == "all"){
    $("#setting_sub_group_btn").attr("disabled", true);
  }else{
    $("#setting_sub_group_btn").removeAttr("disabled");
  }
}

function fill_checked_box(data){
  // console.log(data)
  oTable_2.$(".checked_box_setting_unit").prop("checked",false);
  // console.log(filter_group)
  $(".branch_total_container").empty();
  console.log(filter_group)
  if(filter_group != "all"){
    for(let i=0; i<data.length; i++){
      oTable_2.$(".checked_box_setting_unit[meter_id="+data[i].id+"][serial_sensor="+data[i].serial_sensor+"]").prop("checked",true);
      if(filter_sub_group != "all"){
        let x = "";
        if(data[i].nhanh_tong == 0){
          x = '<input type="radio" id="branch_id_'+data[i].id+'" gr_info_id="'+data[i].gr_info_id+'" name="name_'+data[i].id+'" checked class="branch_total_checkedbox" value="branch" serial_sensor="'+data[i].serial_sensor+'" meter_id="'+data[i].id+'">'
          + '<label for="branch_id_'+data[i].meter_id+'" class="ml-2 mr-3">Nguồn nhánh</label>'
          +'<input type="radio" id="total_id_'+data[i].id+'" gr_info_id="'+data[i].gr_info_id+'" name="name_'+data[i].id+'" class="branch_total_checkedbox" value="total" serial_sensor="'+data[i].serial_sensor+'" meter_id="'+data[i].id+'">'
          + '<label for="total_id_'+data[i].id+'" class="ml-2 mr-3">Nguồn tổng</label>'
        }else if(data[i].nhanh_tong == 1){
          x = '<input type="radio" id="branch_id_'+data[i].id+'" gr_info_id="'+data[i].gr_info_id+'" name="name_'+data[i].id+'" class="branch_total_checkedbox" value="branch" serial_sensor="'+data[i].serial_sensor+'" meter_id="'+data[i].id+'">'
          + '<label for="branch_id_'+data[i].id+'" class="ml-2 mr-3">Nguồn nhánh</label>'
          +'<input type="radio" id="total_id_'+data[i].id+'" gr_info_id="'+data[i].gr_info_id+'" name="name_'+data[i].id+'" checked class="branch_total_checkedbox" value="total" serial_sensor="'+data[i].serial_sensor+'" meter_id="'+data[i].id+'">'
          + '<label for="total_id_'+data[i].id+'" class="ml-2 mr-3">Nguồn tổng</label>'
        }
        // else{
        //   console.log("test")
        //   x = '<input type="radio" id="branch_id_'+data[i].id+'" gr_info_id="'+data[i].gr_info_id+'" name="name_'+data[i].id+'" class="branch_total_checkedbox" value="branch" serial_sensor="'+data[i].serial_sensor+'" meter_id="'+data[i].id+'">'
        //   + '<label for="branch_id_'+data[i].id+'" class="ml-2 mr-3">Nguồn nhánh</label>'
        //   +'<input type="radio" id="total_id_'+data[i].id+'" gr_info_id="'+data[i].gr_info_id+'" name="name_'+data[i].id+'" class="branch_total_checkedbox" value="total" serial_sensor="'+data[i].serial_sensor+'" meter_id="'+data[i].id+'">'
        //   + '<label for="total_id_'+data[i].id+'" class="ml-2 mr-3">Nguồn tổng</label>'
        // }
        $("#branch_total_container_"+data[i].meter_id).append(x);
      }
    }
  }
}

$(document).ready(function(){
  $(document).on('change','.checked_box_setting_unit',function(){
    let val =  $(this).prop('checked');
    let meter_id = $(this).attr("meter_id");
    let serial_sensor = $(this).attr("serial_sensor");
    console.log(val);
    // console.log("true:" + meter_id);
    let post_data  ={
      meter_id: meter_id, 
      serial_sensor: serial_sensor,
      group: filter_group,
      sub_group: filter_sub_group,
      val: val
    }
    httpAsync(post_data,"/admin/post/decentralization_meter_id","POST",function(result1){
      console.log(JSON.parse(result1) );
      httpAsync(null,"/admin/get/checked_meter?group="+filter_group+"&sub_group="+filter_sub_group,"GET",function(result){
        let parse_data = JSON.parse(result);
        let data = parse_data.data
        fill_checked_box(data);
        load_instruction()
      })
    })
  })
})

function load_instruction(){
  if(filter_sub_group == "all"){
    if(filter_group == "all"){
      oTable_2.$(".checked_box_setting_unit").prop("checked",false);
      oTable_2.$(".checked_box_setting_unit").attr("disabled", true);
    }else{
      oTable_2.$(".checked_box_setting_unit").removeAttr("disabled");
      $("#instruction").html("Đánh dấu những thiết bị sẽ thay đổi thiết bị thuộc <strong>Đơn vị:</strong> "+ filter_group_name)
    }
  }else{
    oTable_2.$(".checked_box_setting_unit").removeAttr("disabled");
    $("#instruction").html("Đánh dấu những thiết bị này sẽ thay đổi thiết bị thuộc <strong>Đơn vị:</strong> " + filter_group_name + ", <strong>Nhóm:</strong> "+ filter_sub_group_name )
  }
}

$(document).ready(function(){
  $("#setting_unit_modal").on('hidden.bs.modal', function (){
    filter_group = "all";
    filter_sub_group = "all";
    filter_group_name = "all";
    filter_sub_group_name = "all"
    $("#filter_sub_group").empty();
    $("#filter_sub_group").append('<option value="all" selected>TẤT CẢ</option><i class="fas fa-sort-down"></i>')
    // $("#filter_group").empty();
    // $("#filter_group").append('<option value="all" selected>TẤT CẢ</option><i class="fas fa-sort-down"></i>')
    $("#instruction").html("Thay đổi những cài đặt này sẽ thay đổi thiết bị mà tài khoản này được truy cập")
    $("#setting_sub_group_btn").attr("disabled", true);
  })
})

// cài đặt nhóm
function setting_sub_group(){
  $('#setting_sub_group').modal('show');
  httpAsync(null,"/admin/get/sub_group_setting?group="+filter_group,"GET",function(result){
    let parse_data = JSON.parse(result);
    let data = parse_data.data
    if(data.length == 0){
      $("#body_sub_group_setting_table").empty();
      $("#body_sub_group_setting_table").append("Không có nhóm nào");
    }else{
      let x = "";
      $("#body_sub_group_setting_table").empty();
      for(let i=0; i<data.length; i++){
        x+= '<tr>'
          + '<td>'+(i+1)+'</td>'
          + '<td><input disabled id="sub_group_name_id_'+data[i].group_id+'" type="text" class="form-control input_sub_group_name" style="width:100%" value="'+data[i].name+'"></td>'
          + '<td><button class="btn btn-warning btn-sm" onclick="edit_sub_group_eq('+data[i].group_id+')"><i class="fas fa-cog"></i></button></td>'
          + '<td><button class="btn btn-danger btn-sm" onclick="delete_sub_group_eq('+data[i].group_id+')"><i class="fa fa-trash" aria-hidden="true"></i></button></td>'
          +'</tr>'
      }
      $("#body_sub_group_setting_table").append(x);
    }
  })
  setting_filter_add_group()
}

function setting_filter_add_group(){
  $("#father_add_sub_group").empty();
  $("#father_add_sub_group").append("<option depth='1' value ='"+filter_group+"' meter_id='' serial_sensor=''>Không chứa thiết bị cha</option>");

  // $("#son_add_sub_group").empty();
  httpAsync(null,"/admin/get/father_son_add_group?group="+filter_group+"&sub_group="+filter_sub_group,"GET",function(result){
    let parse_data = JSON.parse(result);
    let father = parse_data.data;
    console.log(father)
    // let father = data.father;
    // let son = data.son;
    // let append_string = "<option value ='"+filter_group+"'>"+filter_group_name+"</option>";
    let append_string_father ="";
    for(let i=0; i<father.length; i++){
      append_string_father += "<option depth='"+father[i].depth+"' value ='"+father[i].id+"' meter_id='"+father[i].meter_id+"' serial_sensor='"+father[i].serial_sensor+"'>"+father[i].name+"</option>";
    }
    $("#father_add_sub_group").append(append_string_father);
    // let append_string_son ="";
    // for(let i=0; i<son.length; i++){
    //   append_string_son += "<option depth='"+son[i].id+"' value ='"+son[i].id+"'>"+son[i].name+"</option>";
    // }
    // $("#son_add_sub_group").append(append_string_son);
  })
}


var EDIT_ID_SETTING_SUB_GROUP;
function edit_sub_group_eq(id){
$(".input_sub_group_name").prop('disabled', true);
$("#sub_group_name_id_"+id).prop('disabled', false);
EDIT_ID_SETTING_SUB_GROUP = id;
}

function delete_sub_group_eq(id){
    httpAsync({sub_group: id},"/admin/post/delete_sub_group_eq","POST",function(result){
    alert(result);
    setting_sub_group();
    })
}

function save_setting_sub_group(){
    if($("#sub_group_name_id_"+EDIT_ID_SETTING_SUB_GROUP).val() == "" || $("#sub_group_name_id_"+EDIT_ID_SETTING_SUB_GROUP).val() == null){
      alert("Tên đơn vị không được để trống!");
      return false;
    }
  httpAsync({id:EDIT_ID_SETTING_SUB_GROUP, val:  $("#sub_group_name_id_"+EDIT_ID_SETTING_SUB_GROUP).val()},"/admin/post/save_setting_sub_group","POST",function(result){
    alert(result);
    setting_sub_group();
  })
}

function add_sub_group(){
    let sub_group_name = $("#add_sub_group").val();
    if(sub_group_name =="" || sub_group_name == null){
    if(LANG == "vi"){
      alert("Tên nhóm không được để trống!");
    }else{
      alert("Group name cannot be empty!");
    }
    return false;
    }else{
      let post_data = {
        sub_group_name: sub_group_name,
        father_id: $("#father_add_sub_group").find(":selected").val(),
        // son_id: $("#son_add_sub_group").find(":selected").val(),
        group: filter_group,
        father_depth: $("#father_add_sub_group").find(":selected").attr("depth"),
        meter_id: $("#father_add_sub_group").find(":selected").attr("meter_id"),
        serial_sensor: $("#father_add_sub_group").find(":selected").attr("serial_sensor")
      }
    httpAsync(post_data,"/admin/post/save_add_sub_group","POST",function(result){
      alert(result);
      $("#add_sub_group").val("");
      setting_sub_group();
    })
    }
}

$(document).ready(function(){
  $(document).on("click",".branch_total_checkedbox",function(){
    // console.log($(this).val(), $(this).attr("meter_id"), $(this).attr("sub_group_relative_id"))
    let post_data = {
      data: $(this).val(),
      id: $(this).attr("gr_info_id")
    }
    httpAsync(post_data,"/admin/post/change_branch_total","POST",function(result){
      console.log(result);
    })
  })
})

// cài đặt để có thể scroll sau khi tắt modal trong modal
$(document).ready(function(){
  $('.modal').css('overflow-y', 'auto');
})


// Cài đặt vẽ bản đồ 

var filter_group_setmap = "all";
var filter_sub_group_setmap = "all";
var filter_group_name_setmap = "all";
var filter_sub_group_name_setmap = "all"

function setting_map(){
  $('#clear_setmap_btn').prop('disabled', true);
  $('#reload_setmap_btn').prop('disabled', true);
  $('#save_setmap_btn').prop('disabled', true);
  $('#auto_draw_zone_btn').prop('disabled', true);

  httpAsync(null,"/admin/get/get_filter_group","GET",function(result){
    let parse_data = JSON.parse(result);
    if(parse_data.err_code == 0){
      let role = parse_data.data.role;
      let data = parse_data.data.data;
      if(role == "admin"){
        $("#filter_group_setmap").empty();
        $("#filter_group_setmap").append('<option value="all" selected>CHƯA CHỌN</option><i class="fas fa-sort-down"></i>')
        let append_string = "";
        for(let i=0; i<data.length; i++){
          append_string += '<option value="'+data[i].id+'" >'+data[i].name+'</option>'
        }
        $("#filter_group_setmap").append(append_string);
        $("#filter_sub_setmap").empty();
        $("#filter_sub_setmap").append('<option value="all" selected>CHƯA CHỌN</option><i class="fas fa-sort-down"></i>')
      }else if(role == "admin_client"){
        $("#filter_sub_setmap").empty();
        $("#filter_sub_setmap").append('<option value="all" selected>CHƯA CHỌN</option><i class="fas fa-sort-down"></i>')
        let append_string = "";
        for(let i=0; i<data.length; i++){
          append_string += '<option value="'+data[i].group_id+'" >'+data[i].name+'</option>'
        }
        $("#filter_sub_setmap").append(append_string)
      }
    }else{
      alert(parse_data.message)
    }

    // let data = [];
    // if(result != null && result != ""){
    //   data = JSON.parse(result);
    // }
    // for(let i=0; i<data.length; i++){
    //   $("#filter_group_setmap").append('<option value="'+data[i].id+'" >'+data[i].group_name+'</option>')
    // }
  })
  $("#draw_map_setting").modal('show');
  render_setting_map()
  // $("#draw_map_setting").on('shown.bs.modal',function(){
  //   // $("#draw_map_setting").modal('show');
   
  // })
}


$(document).ready(function(){   
  $("#filter_group_setmap").change(function(){
    filter_group_setmap = $(this).children("option:selected").val();
    filter_group_name_setmap = $(this).children("option:selected").html();
    filter_sub_group_setmap = "all";
    filter_sub_group_name_setmap = "all";
    $('#clear_setmap_btn').prop('disabled', true);
    $('#reload_setmap_btn').prop('disabled', true);
    $('#save_setmap_btn').prop('disabled', true);
    $('#auto_draw_zone_btn').prop('disabled', true);

    $("#filter_sub_setmap").empty();
    $("#filter_sub_setmap").append('<option value="all" selected>CHƯA CHỌN</option><i class="fas fa-sort-down"></i>')
    if(filter_group_setmap == "all"){
      // $("#setmap").empty();
      // $("#setmap").append("Chưa chọn đơn vị!");
      return false;
    }else{
      httpAsync(null,"/admin/get/get_sub_group_list?group="+filter_group_setmap,"GET",function(result){
        let parse_data = JSON.parse(result);
        let data = parse_data.data;

        let str_data = "";
        for(let i=0; i<data.length; i++){
          str_data += '<option value="'+data[i].group_id+'" >'+data[i].name+'</option>'
        }
        $("#filter_sub_setmap").append(str_data);
        // $("#setmap").empty();
        // $("#setmap").append("Chưa chọn nhóm thiết bị!");
  
        // get_data_unit();
        // httpAsync(null,"/admin/get/get_meter_list?group="+filter_group_setmap+"&sub_group="+filter_sub_group_setmap,"GET",function(result){
        //   let data = JSON.parse(result)
        //   fill_checked_box(data);
        //   load_instruction()
        // })
      })
    }


  })
})


$(document).ready(function(){   
  $("#filter_sub_setmap").change(function(){
    filter_sub_group_setmap = $(this).children("option:selected").val();
    filter_sub_group_name_setmap = $(this).children("option:selected").html();
    $('#clear_setmap_btn').prop('disabled', true);
    $('#reload_setmap_btn').prop('disabled', true);
    $('#save_setmap_btn').prop('disabled', true);
    $('#auto_draw_zone_btn').prop('disabled', true);


    // get_data_unit();
    // check_show_setting_sub_group_btn()
    if(filter_sub_group_setmap == "all"){
      // $("#setmap").empty();
      // $("#setmap").append("Chưa chọn nhóm thiết bị!");
      return false;
    }else{
      // $("#setmap").empty();
      $('#clear_setmap_btn').prop('disabled', false);
      $('#reload_setmap_btn').prop('disabled', false);
      $('#save_setmap_btn').prop('disabled', false);
      if(TYPE_SETMAP == "zone"){
        $('#auto_draw_zone_btn').prop('disabled', false);
      }


      // MAP = null;
      POINT_1 = null;
      POINT_2 = null;
      httpAsync(null,"/admin/get/get_data_set_map?group_id="+filter_sub_group_setmap,"GET",function(result){
        let parse_data = JSON.parse(result);
        METER_LOCATION = parse_data.data.meter_location;
        DRAW_MAP = parse_data.data.draw_map;
        console.log(MAP)
        load_draw_map(METER_LOCATION,DRAW_MAP,TYPE_SETMAP);
        // console.log(METER_LOCATION)
      })
      // httpAsync(null,"/admin/get/get_meter_list?group="+filter_group_setmap+"&sub_group="+filter_sub_group_setmap,"GET",function(result){
      //   let data = JSON.parse(result)
      //   httpAsync(null,"/admin/get/setmap?sub_group="+filter_sub_group_setmap,"GET",function(result2){
      //     let setmap = [];
      //     if(result2 != null && result2 != ""){
      //       setmap = JSON.parse(result2);
      //     }
      //     load_setmap(data,setmap);
      //   })
      // })
    }
  })
})

function sapXepTheoChieuKimDongHo(diem) {
  // Tính toán tọa độ trung bình (điểm trung tâm)
  let trungTam = diem.reduce((acc, curr) => {
    return {
      lat: acc.lat + curr.lat,
      lng: acc.lng + curr.lng
    };
  }, { lat: 0, lng: 0 });

  trungTam.lat /= diem.length;
  trungTam.lng /= diem.length;

  // Sắp xếp mảng điểm theo góc tới điểm trung tâm
  diem.sort((a, b) => {
    let gocA = Math.atan2(a.lat - trungTam.lat, a.lng - trungTam.lng);
    let gocB = Math.atan2(b.lat - trungTam.lat, b.lng - trungTam.lng);
    return gocA - gocB;
  });

  return diem;
}

function auto_draw_zone(){
  clear_setmap_line();
  let AUTO_ZONE = [];
  SAVE_ZONE_SETMAP = [];
  for(let i=0; i<METER_LOCATION.length; i++){
    if(METER_LOCATION[i].location_lat != null && METER_LOCATION[i].location_lat != "" && METER_LOCATION[i].location_long != null && METER_LOCATION[i].location_long != ""){
      AUTO_ZONE.push({
        lat: Number(METER_LOCATION[i].location_lat),
        lng: Number(METER_LOCATION[i].location_long)
      })
    }
  }
  let arr_sort = sapXepTheoChieuKimDongHo(AUTO_ZONE)
  if(arr_sort.length > 0){
    SAVE_ZONE_SETMAP = arr_sort;
    POLYGON_ZONE_MAP = new google.maps.Polyline({
      path: SAVE_ZONE_SETMAP,
      geodesic: true,
      strokeColor: "#36aff5",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    POLYGON_ZONE_MAP.setMap(MAP);
}
}



var MAP = null;
var RED_MARKER = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
var GREEN_MARKER = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
var BLUE_MARKER = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
var YELLOW_MARKER = 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
var TYPE_SETMAP = "line";
var METER_LOCATION = null;
var DRAW_MAP = null;
var SAVE_LINE_SETMAP = [];
var SAVE_ZONE_SETMAP = [];
var FLIGHTPATH_LINE_MAP = [];
var POLYGON_ZONE_MAP = null;
var drawingManager = null;
var POLYGON_ZONE_MAP_2 = []

function render_setting_map(){
  let uluru = {
    lat: 21.02968240219856,
    lng: 105.78508077717274
  }
  let options = {
    zoom : 14,
    center: uluru,
    // lickableIcons: false,
    styles: [
      {
          featureType: "transit",
          elementType: "labels",
          stylers: [
                { visibility: "off" }
          ]
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
              { visibility: "off" }
        ]
    }
    ]    
  }
  MAP = new google.maps.Map(document.getElementById("setmap"), options);
  drawingManager = new google.maps.drawing.DrawingManager({
    // drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.POLYLINE,
      ],
    },
    polygonOptions:{
      editable: true,
      draggable: true,

    },
    polylineOptions:{
      editable: true,
      draggable: true,
    }
  });
  // event lắng nghe chuyển type
  drawingManager.addListener( "drawingmode_changed", function() {
    console.log("drawingmode_changed", drawingManager.getDrawingMode());
    switch(drawingManager.getDrawingMode()){
      case "polyline": TYPE_SETMAP = "line"; break;
      case "polygon": TYPE_SETMAP = "zone"; break;
      default: TYPE_SETMAP = "hand"; break;
    }
  });
  // ẩn khi chưa chọn loại
  drawingManager.setOptions({
    drawingControl: false
  });
  drawingManager.setMap(MAP);
}


function load_draw_map(meter_location,draw_map,type_setmap){
  console.log(drawingManager)
  drawingManager.setOptions({
    drawingControl: true
  });
  drawingManager.setMap(MAP);

  SAVE_LINE_SETMAP = [];
  SAVE_ZONE_SETMAP = [];
  FLIGHTPATH_LINE_MAP = [];
  POLYGON_ZONE_MAP = null;
  POLYGON_ZONE_MAP_2 = []
  POINT_1 = null;
  POINT_2 = null;
  // $("#setmap").empty();
  let uluru = {
    lat: 21.02968240219856,
    lng: 105.78508077717274
  }
  for(let i=0; i<meter_location.length; i++){
    if(meter_location[i].location_lat != null && meter_location[i].location_lat != "" && meter_location[i].location_long != null && meter_location[i].location_long != ""){
      uluru.lat = Number(meter_location[i].location_lat);
      uluru.lng = Number(meter_location[i].location_long);
      break;
    }
  }
  // let options = {
  //   zoom : 14,
  //   center: uluru,
  //   styles: [
  //     {
  //         featureType: "transit",
  //         elementType: "labels",
  //         stylers: [
  //               { visibility: "off" }
  //         ]
  //     },
  //     {
  //       featureType: "poi",
  //       elementType: "labels",
  //       stylers: [
  //             { visibility: "off" }
  //       ]
  //   }
  //   ]
  // }
  // console.log(MAP)
  // console.log(uluru)

  MAP.setCenter(uluru)
  MAP.setZoom(16)
  // MAP = new google.maps.Map(document.getElementById("setmap"), options);
  let marker = null;
  for(let i=0; i<meter_location.length; i++){
    if(meter_location[i].location_lat != null && meter_location[i].location_lat != "" && meter_location[i].location_long != null && meter_location[i].location_long != ""){
      let coords = {lat: Number(meter_location[i].location_lat), lng:Number(meter_location[i].location_long)};
      if(meter_location[i].level_icon == 1){
        marker = new google.maps.Marker({
          opacity: 1,
          position: coords,
          map: MAP,
          animation: google.maps.Animation.DROP,
          icon: {
            url: "/images/father-wt-meter-icon.png",
            scaledSize: new google.maps.Size(60, 46), // scaled size
          },
        })
      }else if(meter_location[i].level_icon == 2){
        marker = new google.maps.Marker({
          opacity: 1,
          position: coords,
          map: MAP,
          animation: google.maps.Animation.DROP,
          icon: {
            url: "/images/wt-meter-icon-level_2.png",
            scaledSize: new google.maps.Size(40, 32), // scaled size
          },
        })
      }else if(meter_location[i].level_icon == 3){
        marker = new google.maps.Marker({
          opacity: 1,
          position: coords,
          map: MAP,
          animation: google.maps.Animation.DROP,
          icon: {
            url: "/images/wt-meter-icon.png",
            scaledSize: new google.maps.Size(30, 27), // scaled size
          },
        })
      }else{
        marker = new google.maps.Marker({
          opacity: 1,
          position: coords,
          map: MAP,
          animation: google.maps.Animation.DROP,
          icon: RED_MARKER
        })
      }
      let content = meter_location[i].name;                  
      marker['infowindow'] = new google.maps.InfoWindow({
        content: content
      });
    google.maps.event.addListener(marker, 'mouseover', function () {
      this['infowindow'].open(MAP, this);
    });
    google.maps.event.addListener(marker, 'mouseout', function () {
      this['infowindow'].close(MAP, this);
    });
    }
}
// console.log(JSON.parse(draw_map[0].line_map))
// if(type_setmap == "line"){
  if(draw_map.length > 0){
    SAVE_LINE_SETMAP = JSON.parse(draw_map[0].line_map);
    if(SAVE_LINE_SETMAP == null) SAVE_LINE_SETMAP = [];
    for(let i=0; i<SAVE_LINE_SETMAP.length; i++){
      draw_line(SAVE_LINE_SETMAP[i], MAP);
    }
  }
  // MAP.addListener("click", (mapsMouseEvent) => {
  //   // console.log(mapsMouseEvent.latLng.toJSON())
  //   // SAVE_LINE_SETMAP.push(mapsMouseEvent.latLng.toJSON())
  //   let point = mapsMouseEvent.latLng.toJSON();
  //   if(POINT_1 == null && POINT_2 == null){POINT_1 = point; return true;}
  //   if(POINT_1 != null && POINT_2 == null){POINT_2 = point; creat_2point_line(POINT_1,POINT_2); POINT_1 = null; POINT_2 = null;}
  //   console.log(SAVE_LINE_SETMAP)
  // })
// }else if(type_setmap == "zone"){
    if(draw_map.length > 0){
      SAVE_ZONE_SETMAP = JSON.parse(draw_map[0].zone_map);
      if(SAVE_ZONE_SETMAP == null) SAVE_ZONE_SETMAP = [];
      draw_zone(SAVE_ZONE_SETMAP, MAP)
      // POLYGON_ZONE_MAP = new google.maps.Polyline({
      //   path: SAVE_ZONE_SETMAP,
      //   geodesic: true,
      //   strokeColor: "#36aff5",
      //   strokeOpacity: 1.0,
      //   strokeWeight: 2,
      // });
      // POLYGON_ZONE_MAP.setMap(MAP);
  }
  MAP.addListener("click", (mapsMouseEvent) => {

    let point = mapsMouseEvent.latLng.toJSON();
    if(POLYGON_ZONE_MAP != null){
      let path = POLYGON_ZONE_MAP.getPath();
      path.push(mapsMouseEvent.latLng);
    }else{
      POLYGON_ZONE_MAP = new google.maps.Polyline({
        path: [point],
        geodesic: true,
        strokeColor: "#36aff5",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      POLYGON_ZONE_MAP.setMap(MAP);
    }
    SAVE_ZONE_SETMAP.push(point);
  })
  // }else{
    // if(draw_map.length > 0){
    //   SAVE_ZONE_SETMAP = [];
    //   POLYGON_ZONE_MAP = new google.maps.Polyline({
    //     path: SAVE_ZONE_SETMAP,
    //     geodesic: true,
    //     strokeColor: "#36aff5",
    //     strokeOpacity: 1.0,
    //     strokeWeight: 2,
    //   });
    //   POLYGON_ZONE_MAP.setMap(MAP);
    // }
    // MAP.addListener("click", (mapsMouseEvent) => {

    //   let point = mapsMouseEvent.latLng.toJSON();
    //   if(POLYGON_ZONE_MAP != null){
    //     let path = POLYGON_ZONE_MAP.getPath();
    //     path.push(mapsMouseEvent.latLng);
    //   }else{
    //     POLYGON_ZONE_MAP = new google.maps.Polyline({
    //       path: [point],
    //       geodesic: true,
    //       strokeColor: "#36aff5",
    //       strokeOpacity: 1.0,
    //       strokeWeight: 2,
    //     });
    //     POLYGON_ZONE_MAP.setMap(MAP);
    //   }
    //   SAVE_ZONE_SETMAP.push(point);
    //   console.log(SAVE_ZONE_SETMAP)
    // })
  // } 
}


function draw_line(arr, map){
  var flightPath_son = new google.maps.Polyline({
  path: arr,
  geodesic: true,
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
  editable: true,
  draggable: true,
});
FLIGHTPATH_LINE_MAP.push(flightPath_son);
flightPath_son.setMap(map);
// SAVE_SETMAP.push({point_1:point_1, point_2: point_2})
}

function draw_zone(arr, map){
  var rectangle = new google.maps.Polygon({
    paths: arr,
    geodesic: true,
    strokeColor: "#36aff5",
    strokeOpacity: 1.0,
    strokeWeight: 2,
    fillColor: '#36aff5',
    fillOpacity: 0.35,
    editable: true,
    draggable: true,
});
POLYGON_ZONE_MAP_2.push(rectangle)
rectangle.setMap(map);
}


function creat_2point_line(point_1, point_2){
  var flightPath_son = new google.maps.Polyline({
  path: [point_1,point_2],
  geodesic: true,
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
});
FLIGHTPATH_LINE_MAP.push(flightPath_son);
flightPath_son.setMap(MAP);
SAVE_LINE_SETMAP.push([point_1, point_2])
}

function clear_setmap_line(){
  if(TYPE_SETMAP == "line"){
    for(let i=0; i<FLIGHTPATH_LINE_MAP.length; i++){
      FLIGHTPATH_LINE_MAP[i].setMap(null);
    }
    SAVE_LINE_SETMAP = [];
  }else if(TYPE_SETMAP == "zone"){
    load_draw_map(METER_LOCATION,DRAW_MAP,"delete")

    // console.log(POLYGON_ZONE_MAP.getPath())
    // POLYGON_ZONE_MAP.getPath() = [];
    // POLYGON_ZONE_MAP.setMap(MAP)
  }

}

function save_line_setmap(){
  let post_data = {
    group_id: filter_sub_group_setmap,
    line_setmap: SAVE_LINE_SETMAP
  }
  httpAsync(post_data,"/admin/post/save_line_setmap","POST",function(result){
    let parse_data = JSON.parse(result);
    if(parse_data.err_code == 1){
      alert(parse_data.message)
    }else{
      alert(parse_data.data);
    }
  })
}

function save_zone_setmap(){
  let post_data = {
    group_id: filter_sub_group_setmap,
    zone_setmap: SAVE_ZONE_SETMAP
  }
  httpAsync(post_data,"/admin/post/save_zone_setmap","POST",function(result){
    let parse_data = JSON.parse(result);
    if(parse_data.err_code == 1){
      alert(parse_data.message)
    }else{
      alert(parse_data.data);
    }
  })
}

function save_setmap(){
  if(TYPE_SETMAP == "line"){
    save_line_setmap()
  }else if(TYPE_SETMAP == "zone"){
    save_zone_setmap()
  }
}

function reload_setmap(){
  load_draw_map(METER_LOCATION,DRAW_MAP,TYPE_SETMAP);
}


$(document).ready(function(){
  $(".type_setmap").change(function(){
    $('#auto_draw_zone_btn').prop('disabled', true);
    TYPE_SETMAP = $(this).val();
    if(filter_sub_group_setmap != "all"){
    load_draw_map(METER_LOCATION,DRAW_MAP,TYPE_SETMAP);
    if(TYPE_SETMAP == "zone"){
      $('#auto_draw_zone_btn').prop('disabled', false);
    }
    }
  })
})











function load_setmap(data, setmap){
  SAVE_SETMAP = [];
  // MAP = null;
  POINT_1 = null;
  POINT_2 = null;
  // $("#setmap").empty();
  let uluru = {
    lat: 21.02968240219856,
    lng: 105.78508077717274
  }
  for(let i=0; i<data.length; i++){
    if(data[i].location_lat != null && data[i].location_lat != "" && data[i].location_long != null && data[i].location_long != ""){
      uluru.lat = Number(data[i].location_lat);
      uluru.lng = Number(data[i].location_long);
      break;
    }
  }
  let options = {
    zoom : 14,
    center: uluru,
    // lickableIcons: false,
    styles: [
      {
          featureType: "poi",
          elementType: "labels",
          stylers: [
                { visibility: "off" }
          ]
      }
    ]
  }
  MAP = new google.maps.Map(document.getElementById("setmap"), options);
  let redCoords = [
    {lat:20.97023878114257,lng:106.98588267560704},
    {lat:20.97023878114257,lng:107.00261965969864},
    {lat:20.964563496872607,lng:107.02238288293724},
    {lat:20.960340220759452,lng:107.03042306513409},
    {lat:20.957557691688866,lng:107.03805238991325}, 
    {lat:20.953765729733995,lng:107.02881474141041},
    {lat:20.9553298382963,lng:107.01599542043289}

    ]

   let polygon = new google.maps.Polygon({
    // map_2,
    paths: redCoords,
    strokeColor: "#36aff5",
    strokeOpacity: 0.6,
    strokeWeight: 1,
    fillColor: "#36aff5",
    fillOpacity: 0.35,
    draggable: false,
    geodesic: true,
  });

  polygon.setMap(MAP)
  let marker = null;
  for(let i=0; i<data.length; i++){
    if(data[i].location_lat != null && data[i].location_lat != "" && data[i].location_long != null && data[i].location_long != ""){
      let coords = {
        lat: Number(data[i].location_lat),
        lng: Number(data[i].location_long)
      }
      marker = new google.maps.Marker({
        opacity: 1,
        position: coords,
        map: MAP,
        animation: google.maps.Animation.DROP,
        icon: {
          url: return_icon_map(data[i].branch_total),
          // scaledSize: new google.maps.Size(25, 40), // scaled size
          // origin: new google.maps.Point(0,0), // origin
          // anchor: new google.maps.Point(0, 0) // anchor
        }
      })
      let content = '<div class="col-12">'
                  +'<div class="row">'+'Mã thiết bị: '+data[i].meter_id+'</div>'
                  + '<div class="row">'+'Tên: '+data[i].name+'</div>'
                  // +'<div class="row">'+'Chỉ số: '+data[i].last_ValOfNum+'</div>'
                  // +'<div class="row">'+'Áp suất: '+data[i].last_pressure+'</div>'
                  // +'<div class="row">'+'Thời gian: '+return_date_format_ddmmyyhhmmss(data[i].last_meter_time)+'</div>'
                  +'</div>'                  
        marker['infowindow'] = new google.maps.InfoWindow({
        content: content
      });
      // marker['infowindow'].open(map, marker);
      google.maps.event.addListener(marker, 'click', function () {
        this['infowindow'].open(MAP, this);
      });
    }
  }

  for(let i=0; i<setmap.length; i++){
    creat_line(setmap[i].point_1, setmap[i].point_2);
    SAVE_SETMAP.push(setmap[i])
  }
//  console.log(setmap)
  MAP.addListener("click", (mapsMouseEvent) => {
    // console.log(mapsMouseEvent.latLng.toJSON())
    // SAVE_SETMAP.push(mapsMouseEvent.latLng.toJSON())
    let point = mapsMouseEvent.latLng.toJSON();
    if(POINT_1 == null && POINT_2 == null){POINT_1 = point; return true;}
    if(POINT_1 != null && POINT_2 == null){POINT_2 = point; creat_line(POINT_1,POINT_2); POINT_1 = null; POINT_2 = null;}
  })
}

var POINT_1 = null;
var POINT_2 = null;
var OLD_SAVE_SETMAP = [];

function add_line(){
  // flightPath.setMap(MAP);
  flightPath = flightPath.concat(old_flightPath);
  for(let i=0; i<flightPath.length; i++){
    flightPath[i].setMap(MAP);
  }
  SAVE_SETMAP = SAVE_SETMAP.concat(OLD_SAVE_SETMAP);
  OLD_SAVE_SETMAP = [];
  old_flightPath = [];
}

function removeLine() {
  // flightPath.setMap(null);
  for(let i=0; i<flightPath.length; i++){
    flightPath[i].setMap(null);
  }
  OLD_SAVE_SETMAP = SAVE_SETMAP;
  SAVE_SETMAP = [];
  old_flightPath = flightPath;
  flightPath = [];
}

// $(document).ready(function(){
//   if(MAP !=null){
//     MAP.addListener("click", (mapsMouseEvent) => {
//       console.log(mapsMouseEvent.latLng.toJSON())
//       let point = mapsMouseEvent.latLng.toJSON();
//       if(POINT_1 == null && POINT_2 == null){POINT_1 = point; return true;}
//       if(POINT_1 != null && POINT_2 == null){POINT_2 = point; creat_line(POINT_1,POINT_2); POINT_1 = null; POINT_2 = null;}
//   })
//   }
// })

var flightPath = [];
var old_flightPath = [];
function creat_line(point_1, point_2){
  var flightPath_son = new google.maps.Polyline({
  path: [point_1,point_2],
  geodesic: true,
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
});
flightPath.push(flightPath_son);
flightPath_son.setMap(MAP);
SAVE_SETMAP.push({point_1:point_1, point_2: point_2})
}



function return_icon_map(branch_total){
  // if(status == "1" || status == 1){
  //   return("/images/small-connect.png")
  // }else{
  //   return("/images/small-disconnect.png")
  // }
  switch(branch_total){
    case 1:
      return BLUE_MARKER;
    case 2: 
      return RED_MARKER;
    case 0:
      return YELLOW_MARKER
  }
}

$(document).ready(function(){
  $("#draw_map_setting").on('hidden.bs.modal', function (){
    filter_group_setmap = "all";
    filter_sub_group_setmap = "all";
    filter_group_name_setmap = "all";
    filter_sub_group_name_setmap = "all"
    $("#filter_sub_setmap").empty();
    $("#filter_sub_setmap").append('<option value="all" selected>CHƯA CHỌN</option><i class="fas fa-sort-down"></i>')
    $("#filter_group_setmap").empty();
    $("#filter_group_setmap").append('<option value="all" selected>CHƯA CHỌN</option><i class="fas fa-sort-down"></i>')
    $("#setmap").empty();
    MAP = null;
    // $("#setmap").append("Chưa chọn nhóm thiết bị!");
  } )
})


var SAVE_SETMAP = [];

// function save_setmap(){
//   // console.log(SAVE_SETMAP)
//   if(SAVE_SETMAP.length <2){
//     alert("Bản đồ chưa được vẽ");
//     return false;
//   }
//   let draw_map = [];
//   for(let i=0; i < SAVE_SETMAP.length; i++){
//     if(SAVE_SETMAP[i].point_1 != null && SAVE_SETMAP[i].point_2 != null){
//       draw_map.push(SAVE_SETMAP[i]);
//     }
//   }
//   httpAsync({draw_map: draw_map, filter_sub_group_setmap: filter_sub_group_setmap},"/admin/post/save_setmap","POST",function(result){
//     alert(result);
//   })
// }