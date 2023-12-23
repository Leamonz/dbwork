function checkNewPasswdValid() {
    var inputPasswd = $("#new_password").val();
    var passwdRegex = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$");
    var matchResult = inputPasswd.match(passwdRegex);
    if (matchResult === null) {
        document.getElementById("new_password").classList.remove("is-valid");
        document.getElementById("new_password").classList.add("is-invalid");
    } else {
        document.getElementById("new_password").classList.remove("is-invalid");
        document.getElementById("new_password").classList.add("is-valid");
    }
    return matchResult !== null;
}

function checkConsistent() {
    var confirmPasswd = $("#confirm_new_password").val();
    var newPasswd = $("#new_password").val();
    var flag = confirmPasswd === newPasswd;
    if (flag) {
        document.getElementById("confirm_new_password").classList.remove("is-invalid");
        document.getElementById("confirm_new_password").classList.add("is-valid");
    } else {
        document.getElementById("confirm_new_password").classList.remove("is-valid");
        document.getElementById("confirm_new_password").classList.add("is-invalid");
    }
    return flag;
}

function confirmChange() {
    var username = $("#username").val();
    var url = "http://localhost:8888/profile/change-password/" + username + "/confirm/";
    var data = {
        "new_password": $("#new_password").val()
    };
    $.post(url, data, function (res) {
        console.log(res.result_msg);
        showModal(`重置密码成功！<br>5s后将自动导航至登录页面，或点击链接进入登录页面：<a href="http://localhost:8888/login/page/">http://localhost:8888/login/page/</a>`)
        setTimeout((e) => {
            window.location.href = "http://localhost:8888/login/page/";
        }, 5000);
    })
}

function showModal(msg) {
    document.querySelector("#infoModal .modal-body").innerHTML = msg;
    $("#infoModal").modal("show");
}
