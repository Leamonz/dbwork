function onLoadFunction() {
    getAllGoods();
    var preventJumpATags = document.querySelectorAll("a.preventJump");
    for (var i = 0; i < preventJumpATags.length; i++) {
        var aTag = preventJumpATags[i];
        aTag.addEventListener("click", (e) => {
            // 阻止跳转行为
            e.preventDefault();
        })
    }
}

function getAllGoods() {
    var url = "http://localhost:8888/goods/mart/getAll";
    var data = {
        "order_by": document.querySelector("#order_select").value
    };
    $.ajax({
        url: url,
        method: "post",
        async: false,
        data: data,
        success: (res) => {
            console.log(res.result_msg);
            goodsList = res.goods;
            var html = "";
            for (var i = 0; i < goodsList.length; i++) {
                var goods = goodsList[i];
                var aUrl = "http://localhost:8888/mart/" + goods.goodid + "/page/";
                var create_time = new Date(goods.create_time);
                create_time = create_time.toDateString();
                html += `<div class="card card-style">`;
                html += `    <a href="${aUrl}">`;
                html += `        <img class="card-img-top preview" src="${goods.imageurl}" alt="">`;
                html += `    </a>`;
                html += `    <div class="card-body d-flex flex-column">`;
                html += `        <h5 class="flex-row align-items-center">`;
                html += `            <div class="inlineblock">${goods.goodname}&nbsp;<small class="font-8">${create_time}</small></div>`;
                html += `            <div class="float-right inlineblock ml-auto font-14 d-flex align-items-center">`;
                html += `                <img class="avatar avatar-md mr-3" src="/static/images/xs/avatar4.jpg"/>`;
                html += `                <div>`;
                html += `                    ${goods.sellerusername}`;
                html += `                </div>`;
                html += `            </div>`;
                html += `        </h5>`;
                html += `        <p class="text-muted">${goods.description}</p>`;
                html += `        <div class="d-flex align-items-center pt-5 mt-auto">`;
                html += `            <div>`;
                html += `                <span class="text-orange font-20">&yen;${goods.goodprice}</span>`;
                html += `                <small class="d-block text-muted">剩余${goods.goodnum}件</small>`;
                html += `            </div>`;
                html += `            <div class="ml-auto text-muted">`;
                html += `                <i class="fa fa-eye mr-1"></i> ${goods.views}`;
                html += `            </div>`;
                html += `        </div>`;
                html += `    </div>`;
                html += `</div>`;
            }
            $("#mart_goods").html(html);
        }
    })
}

$("#query_button").click((e) => {
    var select = document.querySelector("#query_select");
    var option = select.options[select.selectedIndex].value;
    var search_input = $("#search_input").val();
    console.log(option);
    if (search_input === undefined || search_input === null || search_input === "") {
        showWarningModal("请输入查询信息");
        return;
    }
    var url = "http://localhost:8888/goods/query/";
    var data = {
        "option": option,
        "search_input": search_input
    };
    $.post(
        url,
        data,
        (res) => {
            console.log(res.result_msg);
            goodsList = res.goods;
            if (goodsList !== undefined && goodsList !== null) {
                var html = "";
                for (var i = 0; i < goodsList.length; i++) {
                    var goods = goodsList[i];
                    var aUrl = "http://localhost:8888/mart/" + goods.goodid + "/page/";
                    var create_time = new Date(goods.create_time);
                    create_time = create_time.toDateString();
                    html += `<div class="card">`;
                    html += `    <a href="${aUrl}">`;
                    html += `        <img class="card-img-top preview" src="${goods.imageurl}" alt="">`;
                    html += `    </a>`;
                    html += `    <div class="card-body d-flex flex-column">`;
                    html += `        <h5 class="flex-row align-items-center">`;
                    html += `            <div class="inlineblock">${goods.goodname}&nbsp;<small class="font-8">${create_time}</small></div>`;
                    html += `            <div class="float-right inlineblock ml-auto font-14 d-flex align-items-center">`;
                    html += `                <img class="avatar avatar-md mr-3" src="/static/images/xs/avatar4.jpg"/>`;
                    html += `                <div>`;
                    html += `                    ${goods.sellerusername}`;
                    html += `                </div>`;
                    html += `            </div>`;
                    html += `        </h5>`;
                    html += `        <h6 class="text-muted">${goods.description}</h6>`;
                    html += `        <div class="d-flex align-items-center pt-5 mt-auto">`;
                    html += `            <div>`;
                    html += `                <span class="text-orange font-20">&yen;${goods.goodprice}</span>`;
                    html += `                <small class="d-block text-muted">剩余${goods.goodnum}件</small>`;
                    html += `            </div>`;
                    html += `            <div class="ml-auto text-muted">`;
                    html += `                <i class="fa fa-eye mr-1"></i> ${goods.views}`;
                    html += `            </div>`;
                    html += `        </div>`;
                    html += `    </div>`;
                    html += `</div>`;
                }
                $("#mart_goods").html(html);
            }
        }
    )
})

document.querySelector("#order_select").addEventListener("change", (e) => {
    console.log(e.target.value);
    getAllGoods();
})