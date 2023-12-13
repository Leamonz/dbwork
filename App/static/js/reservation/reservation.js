function onLoadFunction() {
    getBuyerReservations();
}

function getBuyerReservations() {
    var buyer = localStorage.getItem("username");
    var url = "http://localhost:8888/reservation/query/";
    var data = {
        "buyer": buyer
    };
    $.ajaxSettings.async = false;
    $.post(
        url,
        data,
        (res) => {
            console.log(res.result_msg);
            if (res.result_code === 0) {
                var reservations = res.reservations;
                console.log(reservations);
                var html = "";
                for (var i = 0; i < reservations.length; i++) {
                    var reservation = reservations[i];
                    html += `<tr class="text-center">`;
                    html += `<td class="width45">`;
                    html += `    <img class="avatar" src="${reservation.imageurl}"`;
                    html += `         alt="${reservation.goodname}">`;
                    html += `</td>`;
                    html += `<td>`;
                    html += `    <a href="javascript:void(0);" class="goods" data-id="${reservation.goodid}">${reservation.goodname}</a>`;
                    html += `</td>`;
                    html += `<td>`;
                    html += `    <a href="javascript:void(0);" class="seller" data-seller="${reservation.sellerusername}">${reservation.sellerusername}</a>`;
                    html += `</td>`;
                    html += `<td>`;
                    html += `    ${reservation.num}`;
                    html += `</td>`;
                    html += `<td class="product-price">`;
                    html += `    &yen;${reservation.total}`;
                    html += `</td>`;
                    html += `<td>`;
                    html += `    <a class="btn btn-sm btn-link hidden-xs"`;
                    html += `       data-type="confirm" href="javascript:void(0)" data-toggle="tooltip"`;
                    html += `       title="取消预约商品"><i class="fa fa-trash delete" data-id="${reservation.rid}"></i></a>`;
                    html += `</td>`;
                    html += `</tr>`;
                }
                $("#reservation_list").html(html);
            }
        }
    )
    $.ajaxSettings.async = true;
    initReservationButtons();
}

function initReservationButtons() {
    $("a.goods").click((e) => {
        var goodid = e.target.dataset.id;
        console.log(goodid);
        showGoodsModal(goodid);
    })

    $("a.seller").click((e) => {
        var seller = e.target.dataset.seller;
        console.log(seller);
        showSellerModal(seller);
    })

    $("i.delete").click((e) => {
        var rid = e.target.dataset.id;
        console.log(rid);
        showReservationDeleteModal(rid);
    })
}

function showGoodsModal(goodid) {
    var url = "http://localhost:8888/mart/" + goodid + "/";
    var data = {};
    $.ajaxSettings.async = false;
    $.post(
        url,
        data,
        (res) => {
            console.log(res.result_msg);
            if (res.result_code === 0) {
                var goods = res.goods;
                $("#modal_goodname").val(goods.goodname);
                $("#modal_goodprice").val(goods.goodprice);
                $("#modal_goodnum").val(goods.goodnum);
                $("#modal_description").val(goods.description);
                document.querySelector("#modal_goodimage").src = goods.imageurl;
            }
        }
    )
    $.ajaxSettings.async = true;
    $("#goodsInfoModal").modal("show");
}

function showSellerModal(sellerUsername) {
    var url = "http://localhost:8888/profile/getUserById/" + sellerUsername + "/";
    var data = {};
    $.ajaxSettings.async = false;
    $.post(
        url,
        data,
        (res) => {
            console.log(res.result_msg);
            if (res.result_code === 0) {
                var seller = res.user;
                console.log(seller);
                $("#seller_username").val(sellerUsername);
                $("#seller_email").val(seller.mailaddress);
                $("#seller_qqid").val(seller.qqid);
                $("#seller_wechatid").val(seller.wechatid);
            }
        }
    )
    $.ajaxSettings.async = true;
    $("#sellerInfoModal").modal("show");
}

function showReservationDeleteModal(rid) {
    $("#deleteModal #deleteConfirmButton").click((e) => {
        var url = "http://localhost:8888/reservation/delete/";
        var data = {
            "rid": rid
        };
        $.post(
            url,
            data,
            (res) => {
                console.log(res.result_msg);
                if (res.result_code === 0) {
                    new Promise((resolve, reject) => {
                        $("#deleteModal").modal("hide");
                        showWarningModal("删除预约记录成功!");
                        resolve("ok");
                    }).then((_) => {
                        location.reload();
                    })
                } else {
                    showWarningModal("删除失败！");
                }
            }
        )
    })
    $("#deleteModal").modal("show");
}