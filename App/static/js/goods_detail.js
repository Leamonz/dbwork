function showSellerModal() {
    getUserById();
    $("#sellerInfoModal").modal("show");
}

function getUserById() {
    var sellerUsername = document.querySelector("#sellerUsername").innerText;
    var url = "http://localhost:8888/mart/getSeller/" + sellerUsername + "/";
    var data = {};
    $.ajax({
        url: url,
        method: "post",
        data: data,
        async: false,
        success: (res) => {
            console.log(res.result_msg);
            console.log(res);
            var seller = res.seller;
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

    })
    $("#reservationModal").modal("show");
}

document.querySelector("#numberOfGoods").oninput = (e) => {
    var numberOfGoods = Number(e.target.value);
    var price = Number($("#detail_price").html());
    var totalPrice = Number((numberOfGoods * price).toFixed(2));
    var maxNumber = Number($("#detail_num").html());
    console.log(totalPrice);
    if (isNaN(totalPrice)) {
        document.querySelector("#totalPrice").classList.add("parsley-error");
        $("#totalPrice").val("商品数量有误！");
    } else if (numberOfGoods > maxNumber) {
        document.querySelector("#totalPrice").classList.add("parsley-error");
        $("#totalPrice").val(`商品数量超过剩余的最大数量: ${maxNumber}！`);
    } else {
        document.querySelector("#totalPrice").classList.remove("parsley-error");
        $("#totalPrice").val(totalPrice);
    }
}