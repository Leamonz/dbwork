function sendNewPasswd() {
    var username = $("#username").val();
    var email = $("#email").val();
    if (username === undefined || username === null || username === "") {
        showModal("请输入用户名");
        return;
    }
    if (email === undefined || email === null || email === "") {
        showModal("请输入邮箱地址");
        return;
    }
    var url = "http://localhost:8888/login/forgot_passwd/";
    var data = {
        "username": username,
        "email": email
    };
    $.post(url, data, (res) => {
        console.log(res.result_msg);
        if (res.result_code === 0) {
            showModal("重置密码的链接已发送到您的邮箱，请查收！");
        } else {
            showModal(res.result_msg);
        }
    })
}

function showModal(msg) {
    document.querySelector("#infoModal .modal-body").innerText = msg;
    $("#infoModal").modal("show");
}