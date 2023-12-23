var code = "";
var interval = null;
var time = 60;
var sec = 1000;

// function checkOriginPasswd() {
//     var inputPasswd = $("#input_origin_password").val();
//     var originPassword = $("#origin_password").val();
//     var flag = inputPasswd === originPassword;
//     if (flag) {
//         document.getElementById("input_origin_password").classList.remove("is-invalid");
//         document.getElementById("input_origin_password").classList.add("is-valid");
//     } else {
//         document.getElementById("input_origin_password").classList.remove("is-valid");
//         document.getElementById("input_origin_password").classList.add("is-invalid");
//     }
//     return flag;
// }

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

function onVerifyButton() {
    clearInterval(interval);
    interval = setInterval(() => {
        document.getElementById("verifyBtn").innerText = `请在${time}s后重新发送`;
        document.getElementById("verifyBtn").classList.add('disabled');
        time--;
    }, sec)
    setTimeout(() => {
        clearInterval(interval);
        interval = null;
        time = 60;
        document.getElementById("verifyBtn").innerText = "发送验证码";
        document.getElementById("verifyBtn").classList.remove('disabled');
    }, 60 * sec);
    var username = $("#username").val();
    var url = "http://localhost:8888/profile/change-password/" + username + "/verify-email/";
    $.post(url, {}, function (res) {
        console.log(res.result_msg);
        code = res.code;
    });
}

function confirmChange() {
    var username = $("#username").val();
    var url = "http://localhost:8888/profile/change-password/" + username + "/confirm/";
    var data = {
        "new_password": $("#new_password").val()
    };
    $.post(url, data, function (res) {
        console.log(res.result_msg);
        new Promise((resolve, reject) => {
            showModal("修改密码成功");
            resolve("ok");
        }).then((res1) => {
            console.log(res1);
            window.location.href = "http://localhost:8888/profile/" + username + "/";
        })
    })
}

function showModal(msg) {
    document.querySelector("#infoModal .modal-body").innerText = msg;
    $("#infoModal").modal("show");
}