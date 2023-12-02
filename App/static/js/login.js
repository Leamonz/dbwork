const MAX_TRY = 3;
var tryTimes = 0;

function onSignInButton() {
    var url = "http://localhost:8888/login/";
    var data = {
        'username': $("#username").val(),
        'password': $("#password").val(),
    }
    $.post(url, data, function (res) {
        console.log(res.result_msg);
        if (res.result_code === 0) {
            new Promise((resolve, reject) => {
                showModal("登录成功");
                resolve("ok");
            }).then((res1) => {
                window.location.href = "http://localhost:8888/profile/" + $("#username").val() + "/";
            })
        } else {
            tryTimes++;
            console.log(tryTimes);
            showModal("用户名或密码输入错误");
            if (tryTimes >= MAX_TRY) {
                showModal("连续3次用户名/密码输入错误，请1分钟后重新尝试");
                document.getElementById("signInBtn").classList.add("disabled");
                $("#signInBtn").attr("disabled", "disabled");
            }
        }
    })
}

function showModal(msg) {
    document.querySelector("#loginModal .modal-body").innerText = msg;
    $("#loginModal").modal("show");
}