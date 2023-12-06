async function onLoadFunction() {
    await getGoodsList();
    await getReservationList();
}

function onUpdateButton() {
    console.log("更新档案");
    var username = $("#username").val();
    var data = {
        "sid": $("#sid").val(),
        "sname": $("#sname").val(),
        "mailaddress": $("#mailaddress").val(),
        "sdept": $("#sdept").val(),
        "sclass": $("#sclass").val(),
        "qqid": $("#qqid").val(),
        "wechatid": $("#wechatid").val()
    };
    var url = "http://localhost:8888/profile/update/";
    $.post(url, data, (res) => {
        console.log(res.result_msg);
        window.location.reload();
    })
}

function onChangePasswd() {
    var username = $("#username").val();
    console.log(username);
    window.location.href = "http://localhost:8888/profile/change-password/" + username + "/";
}