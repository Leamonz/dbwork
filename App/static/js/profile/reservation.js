async function getReservationList() {
    var username = localStorage.getItem("username");
    var url = "http://localhost:8888/profile/" + username + "/reservations/";
    var data = {};
    $.ajaxSettings.async = false;
    $.post(
        url,
        data,
        (res) => {
            console.log(res.result_msg);
            var html = "";
            if (res.result_code === 0) {
                var reservations = res.reservations;
                for (var i = 0; i < reservations.length; i++) {
                    var reservation = reservations[i];
                    var create_time = new Date(reservation.create_time);
                    create_time = create_time.toDateString();
                    // console.log(reservation);
                    html += `<div class="timeline_item">`;
                    html += `    <img class="tl_avatar" src="/static/images/xs/avatar1.jpg" alt=""/>`;
                    html += `    <span>`
                    html += `        <a href="javascript:void(0);" class="buyer">`;
                    html += `            ${reservation.buyerusername}`;
                    html += `        </a>`;
                    html += `        <small class="float-right text-right">`;
                    html += `            ${create_time}`;
                    html += `        </small>`;
                    html += `    </span>`;
                    html += `    <div class="msg">`;
                    html += `        <h6 class="font600">`;
                    html += `            ${reservation.goodname}`;
                    html += `            <a href="javascript:void(0);" class="ml-auto font-12 text-azure goods"`;
                    html += `               data-id="${reservation.goodid}">`;
                    html += `                商品信息`;
                    html += `            </a>`;
                    html += `            <input type="hidden" value="${reservation.goodid}">`
                    html += `        </h6>`;
                    html += `        <ul style="list-style: none">`;
                    html += `            <li>购买数量: ${reservation.num}件</li>`;
                    html += `        </ul>`;
                    html += `        <span class="mr-20 text-muted text-orange">`;
                    html += `            &yen;${reservation.total}`;
                    html += `        </span>`;
                    html += `        <button class="btn btn-primary float-right transaction-button" data-rid="${reservation.rid}">`;
                    html += `            确认交易`;
                    html += `        </button>`;
                    html += `    </div>`;
                    html += `</div>`;
                }
            }
            $("#reservations_list").html(html);
        }
    )
    initButtons();
    $.ajaxSettings.async = true;
}

function initButtons() {
    $("a.buyer").click((e) => {
        var buyerUsername = e.target.innerText;
        console.log(buyerUsername);
        showBuyerModal(buyerUsername);
    })
    $("a.goods").click((e) => {
        var goodid = e.target.dataset.id;
        console.log(goodid);
        showGoodsModal(goodid);
    })
    $(".transaction-button").click((e) => {
        var rid = e.target.dataset.rid;
        console.log(rid);
        var url = "http://localhost:8888/mart/reservation/confirm_transaction/";
        var data = {
            "rid": rid
        };
        $.post(
            url,
            data,
            (res) => {
                console.log(res.result_msg);
                if (res.result_code === 0) {
                    location.reload();
                }
            }
        )
    })
}

function showBuyerModal(buyerUsername) {
    var url = "http://localhost:8888/profile/getUserById/" + buyerUsername + "/";
    var data = {};
    $.ajaxSettings.async = false;
    $.post(
        url,
        data,
        (res) => {
            console.log(res.result_msg);
            if (res.result_code === 0) {
                var buyer = res.user;
                console.log(buyer);
                $("#buyer_username").val(buyerUsername);
                $("#buyer_email").val(buyer.mailaddress);
                $("#buyer_qqid").val(buyer.qqid);
                $("#buyer_wechatid").val(buyer.wechatid);
            }
        }
    )
    $.ajaxSettings.async = true;
    $("#buyerInfoModal").modal("show");
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