const elementNames = {
    "username": "用户名",
    "password": "密码",
    "email": "邮箱",
    "sid": "学生卡号",
    "verification": "验证码"
}
var code = "";
var interval = null;
var time = 60;
const sec = 1000;

function onCreateButton() {
    if (checkValid()) {
        var data = {
            'username': $("#username").val(),
            'password': $("#password").val(),
            'sid': $("#sid").val(),
            'email': $("#email").val()
        };
        var url = "http://localhost:8888/login/register/";
        var input_code = $("#verification").val();
        $.post(url, data, function (res) {
            console.log(res.result_msg);
            showModal("用户创建成功");
            window.location.href = "http://localhost:8888/";
        })
    }
}

function onVerifyButton() {
    if (checkEmailValid()) {
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
        var url = "http://localhost:8888/login/register/verify-email/";
        var data = {
            'email': $("#email").val(),
        };
        console.log(data);
        $.post(url, data, function (res) {
            console.log(res.result_msg);
            code = res.code;
        });
    } else {
        showModal("请输入正确的邮箱地址！");
    }
}

function checkEmailValid() {
    var inputEmail = $("#email").val();
    console.log(inputEmail);
    if (inputEmail === "" || inputEmail === undefined || inputEmail === null) {
        document.getElementById("email-wrong").style.visibility = "hidden";
        document.getElementById("email-correct").style.visibility = "hidden";
    }
    var emailRegex = new RegExp("^\\w[-\\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\\.)+[A-Za-z]{2,14}$");
    var matchResult = inputEmail.match(emailRegex);
    console.log(matchResult);
    if (matchResult === null) {
        document.getElementById("email-wrong").style.visibility = "visible";
        document.getElementById("email-correct").style.visibility = "hidden";
    } else {
        document.getElementById("email-correct").style.visibility = "visible";
        document.getElementById("email-wrong").style.visibility = "hidden";
    }
    return matchResult !== null;
}

function checkPasswdValid() {
    var inputPasswd = $("#password").val();
    if (inputPasswd === "" || inputPasswd === undefined || inputPasswd === null) {
        document.getElementById("passwd-wrong").style.visibility = "hidden";
        document.getElementById("passwd-correct").style.visibility = "hidden";
    }
    var passwdRegex = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$");
    var matchResult = inputPasswd.match(passwdRegex);
    if (matchResult === null) {
        document.getElementById("passwd-wrong").style.visibility = "visible";
        document.getElementById("passwd-correct").style.visibility = "hidden";
    } else {
        document.getElementById("passwd-correct").style.visibility = "visible";
        document.getElementById("passwd-wrong").style.visibility = "hidden";
    }
    return matchResult !== null;
}

function checkUsernameValid() {
    var inputUsername = $("#username").val();
    console.log(inputUsername);
    var url = "http://localhost:8888/login/register/checkUsername/" + inputUsername + "/";
    var result_code = 0;
    $.ajax({
        type: "get",
        url: url,
        data_obj: "json",
        async: false,
        success: (res) => {
            result_code = res.result_code;
        }
    })
    return result_code === 0;
}

function checkUsernameEmpty() {
    var inputUsername = $("#username").val();
    var usernameRegex = new RegExp("^[^\\s!?]+$");
    return inputUsername !== undefined && inputUsername !== null && inputUsername !== "" && inputUsername.match(usernameRegex) !== null;
}

function checkSIDValid() {
    var inputSID = $("#sid").val();
    console.log(inputSID);
    var url = "http://localhost:8888/login/register/checkSID/" + inputSID + "/";
    var result_code = 0;
    $.ajax({
        type: "get",
        url: url,
        data_obj: "json",
        async: false,
        success: (res) => {
            result_code = res.result_code;
        }
    })
    return result_code === 0;
}

function checkSIDEmpty() {
    var inputSID = $("#sid").val();
    return inputSID !== undefined && inputSID !== null && inputSID !== "" && inputSID.length === 13;
}

function checkCode() {
    var inputCode = $("#verification").val();
    return code !== "" && (inputCode !== undefined && inputCode !== null && inputCode !== "" && inputCode === code);
}

function checkValid() {
    var flag = true;
    var msg = "";
    if (!checkUsernameEmpty()) {
        msg = "用户名格式错误";
        showModal(msg);
        flag = false;
    } else if (!checkUsernameValid()) {
        msg = "用户名重复";
        showModal(msg);
        flag = false;
    } else if (!checkPasswdValid()) {
        msg = "密码不满足要求，应为8-20位字母和数字的组合";
        showModal(msg);
        flag = false;
    } else if (!checkEmailValid()) {
        msg = "邮箱输入错误";
        showModal(msg);
        flag = false;
    } else if (!checkCode()) {
        msg = "验证码输入错误";
        showModal(msg);
        flag = false;
    } else if (!checkSIDValid()) {
        msg = "您已注册过账号";
        showModal(msg);
        flag = false;
    } else if (!checkSIDEmpty()) {
        msg = "学生ID错误，应为13位";
        showModal(msg);
        flag = false;
    }
    return flag;
}

function showModal(msg) {
    document.querySelector("#registerModal .modal-body").innerText = msg;
    $("#registerModal").modal("show");
}
