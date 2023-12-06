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
                    console.log(reservation);
                    html += `<div class="timeline_item">`;
                    html += `    <img class="tl_avatar" src="/static/images/xs/avatar1.jpg" alt=""/>`;
                    html += `    <span>`
                    html += `        <a href="javascript:void(0);" onclick="showBuyerModal();">`;
                    html += `            ${reservation.buyerusername}`;
                    html += `        </a>`;
                    html += `        <small class="float-right text-right">`;
                    html += `            ${reservation.create_time}`;
                    html += `        </small>`;
                    html += `    </span>`;
                    html += `    <div class="msg">`;
                    html += `        <h6 class="font600">`;
                    html += `            ${reservation.goodname}`;
                    html += `            <a href="javascript:void(0);" class="ml-auto font-12 text-azure"`;
                    html += `               onclick="showGoodsModal();">`;
                    html += `                商品信息`;
                    html += `            </a>`;
                    html += `        </h6>`;
                    html += `        <ul style="list-style: none">`;
                    html += `            <li>购买数量: ${reservation.num}件</li>`;
                    html += `        </ul>`;
                    html += `        <span class="mr-20 text-muted text-orange">`;
                    html += `            &yen;${reservation.total}`;
                    html += `        </span>`;
                    html += `    </div>`;
                    html += `</div>`;
                }
            }
            $("#reservations_list").html(html);
        }
    )
    $.ajaxSettings.async = true;
}