function showSellerModal() {
    getUserById();
    $("#sellerInfoModal").modal("show");
}

function getUserById() {
    var sellerUsername = document.querySelector("#sellerUsername").innerText;
    var url = "http://localhost:8888/profile/getUserById/" + sellerUsername + "/";
    var data = {};
    $.ajax({
        url: url,
        method: "post",
        data: data,
        async: false,
        success: (res) => {
            console.log(res.result_msg);
            var seller = res.user;
            console.log(seller);
            $("#seller_username").val(sellerUsername);
            $("#seller_email").val(seller.mailaddress);
            $("#seller_qqid").val(seller.qqid);
            $("#seller_wechatid").val(seller.wechatid);
        }
    })
}

function showReservationModal() {
    $("#reservationModal #reservationConfirmButton").click((e) => {
        var buyer = localStorage.getItem("username");
        var seller = $("#reservationModal #seller_username").val();
        if (buyer === seller) {
            showWarningModal("不能购买自己的商品");
            return;
        }
        var goodid = document.querySelector("#goods_card").dataset.id;
        var num = $("#numberOfGoods").val();
        if (!checkInputNumber(num)) {
            showWarningModal("请输入正确的商品数量");
            return;
        }
        var price = $("#totalPrice").val();
        var url = "http://localhost:8888/mart/reservation/";
        var data = {
            "buyer": buyer,
            "seller": seller,
            "goodid": goodid,
            "num": num,
            "total": price
        };
        console.log(data);
        $.post(
            url,
            data,
            (res) => {
                console.log(res.result_msg);
                console.log(res);
                new Promise((resolve, reject) => {
                    showWarningModal("申请预约成功");
                    resolve("ok");
                }).then((_) => {
                    window.location.href = "http://localhost:8888/mart/";
                })
            }
        )
    })
    $("#reservationModal").modal("show");
}

document.querySelector("#numberOfGoods").oninput = (e) => {
    var numberOfGoods = Number(e.target.value);
    checkInputNumber(numberOfGoods);
}

function checkInputNumber(numberOfGoods) {
    var price = Number($("#detail_price").html());
    var totalPrice = Number((numberOfGoods * price).toFixed(2));
    var maxNumber = Number($("#detail_num").html());
    console.log(totalPrice);
    if (isNaN(totalPrice) || numberOfGoods < 0) {
        document.querySelector("#totalPrice").classList.add("parsley-error");
        $("#totalPrice").val("商品数量有误！");
        return false
    } else if (numberOfGoods > maxNumber) {
        document.querySelector("#totalPrice").classList.add("parsley-error");
        $("#totalPrice").val(`商品数量超过剩余的最大数量: ${maxNumber}！`);
        return false;
    } else {
        document.querySelector("#totalPrice").classList.remove("parsley-error");
        $("#totalPrice").val(totalPrice);
        return true;
    }
}

$("i#like_button").click((e) => {
    var value = e.target.dataset.status;
    var likes = Number(e.target.nextElementSibling.innerText);
    var goodid = e.target.dataset.id;
    if (value === "like") {
        e.target.dataset.status = "unlike";
        e.target.classList.remove("fa-heart");
        e.target.classList.add("fa-heart-o");
        e.target.style.color = "black";
        likes -= 1;
    } else {
        e.target.dataset.status = "like";
        e.target.classList.remove("fa-heart-o");
        e.target.classList.add("fa-heart");
        e.target.style.color = "tomato";
        likes += 1;
    }
    var url = "http://localhost:8888/goods/likes/update/";
    var data = {
        "goodid": goodid,
        "username": localStorage.getItem("username"),
        "likes": likes
    };
    $.ajaxSettings.async = false;
    $.post(
        url,
        data,
        (res) => {
            console.log(res.result_msg);
        }
    )
    $.ajaxSettings.async = true;
    e.target.nextElementSibling.innerText = likes;
})