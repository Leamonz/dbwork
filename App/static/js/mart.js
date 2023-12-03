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
    var data = {};
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
                html += `<div class="card">`;
                html += `    <a href="${aUrl}">`;
                html += `        <img class="card-img-top preview" src="${goods.imageurl}" alt="">`;
                html += `    </a>`;
                html += `    <div class="card-body d-flex flex-column">`;
                html += `        <h5 class="flex-row align-items-center">`;
                html += `            <div class="inlineblock">${goods.goodname}</div>`;
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
                html += `                <i class="fe fe-eye mr-1"></i> 99`;
                html += `                <a href="" class="icon d-none d-md-inline-block ml-3 preventJump">`;
                html += `                    <i class="fe fe-heart mr-1"></i> 1000`;
                html += `                </a>`;
                html += `            </div>`;
                html += `        </div>`;
                html += `    </div>`;
                html += `</div>`;
            }
            $("#mart_goods").html(html);
        }
    })
}

