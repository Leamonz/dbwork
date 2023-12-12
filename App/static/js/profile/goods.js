$('.dropify').dropify({
    messages: {
        'default': '拖拽图片到区域内或点击区域进行上传',
        'replace': '拖拽图片到区域内或点击区域上传新的图片',
        'remove': '删除',
        'error': '上传图片格式出错'
    }
});


async function getGoodsList() {
    var username = getUsername();
    var url = "http://localhost:8888/goods/" + username + "/getAll";
    var data = {};
    var html = "";
    $.ajaxSettings.async = false;
    $.post(url, data, (res) => {
        console.log(res.result_msg);
        var list = res.goods;
        for (var i = 0; i < list.length; i++) {
            var goods = list[i];
            var imageurl = goods.imageurl !== null ? goods.imageurl : "/static/images/gallery/6.jpg";
            var description = goods.description;
            if (description === undefined || description === null) {
                description = "";
            }
            html += `<li class="media">`;
            html += `<img src="${imageurl}" class="img-thumbnail mr-3 preview" alt="...">`;
            html += `<div class="media-body">`;
            html += `    <h5 class="mt-0 mb-1">${goods.goodname}</h5>`;
            html += `    <h6>&yen;${goods.goodprice}&nbsp;剩余${goods.goodnum}件</h6>`;
            html += `    <p>${description}</p>`
            html += `    <div class="footer">`;
            html += `        <span><i class="fe fe-eye"></i>&nbsp;${goods.views}</span>&nbsp;`;
            html += `        <span><i class="fe fe-heart"></i>&nbsp;${goods.likes}</span>`;
            html += `        <div class="float-right inlineblock">`;
            html += `            <button class="btn btn-primary modify_goods_button">`;
            html += `                修改商品信息`;
            html += `            </button>`;
            html += `            <button class="btn btn-outline-danger delete_goods_button">`;
            html += `                下架商品`;
            html += `            </button>`;
            html += `        </div>`;
            html += `        <input type="hidden" value="${goods.goodid}">`
            html += `    </div>`;
            html += `</div>`;
            html += `</li>`;
        }
        $("#all_goods").html(html);
    })
    $.ajaxSettings.async = true;
    initGoodsButtons();
}

function initGoodsButtons() {
    var delete_goods_buttons = document.getElementsByClassName("delete_goods_button");
    console.log(delete_goods_buttons);
    for (var i = 0; i < delete_goods_buttons.length; i++) {
        var button = delete_goods_buttons[i];
        button.addEventListener("click", (e) => {
            var goodid = e.currentTarget.parentNode.nextElementSibling.value;
            console.log(goodid);
            var username = getUsername();
            showGoodsDeleteModal(goodid, username);
        })
    }

    var modify_goods_buttons = document.getElementsByClassName("modify_goods_button");
    for (var i = 0; i < modify_goods_buttons.length; i++) {
        var button = modify_goods_buttons[i];
        button.addEventListener("click", (e) => {
            var goodid = e.currentTarget.parentNode.nextElementSibling.value;
            console.log(goodid);
            var username = getUsername();
            showGoodsModifyModal(goodid, username);
        })
    }
}

function showGoodsDeleteModal(goodid, username) {
    document.querySelector("#deleteModal #deleteConfirmButton").onclick = (e) => {
        var url = "http://localhost:8888/goods/" + username + "/delete/";
        var data = {
            "goodid": goodid
        };
        console.log(data);
        $.post(url, data, (res) => {
            console.log(res.result_msg);
            new Promise((resolve, reject) => {
                alertSuccess("删除商品成功！");
                resolve("ok");
            }).then((res1) => {
                console.log(res1);
                location.reload();
            })
        })
    }
    $("#deleteModal").modal("show");
}

function showGoodsModifyModal(goodid, username) {
    $.post(
        "http://localhost:8888/goods/" + username + "/getOne/",
        {"goodid": goodid},
        (res) => {
            console.log(res.result_msg);
            var goods = res.goods;
            console.log(goods);
            $("#modify_goodname").val(goods.goodname);
            $("#modify_goodprice").val(goods.goodprice);
            $("#modify_goodnum").val(goods.goodnum);
            $("#modify_description").val(goods.description);
        }
    )
    document.querySelector("#modifyModal #modifyConfirmButton").onclick = (e) => {
        var url = "http://localhost:8888/goods/" + username + "/modify";
        var form = document.querySelector("#modify_form");
        var formData = new FormData(form);
        formData.append("goodid", goodid);
        $.ajax({
            type: "post",
            data: formData,
            contentType: false,
            processData: false,
            url: url,
            success: function (res) {
                console.log(res.result_msg);
                new Promise((resolve, reject) => {
                    alertSuccess("修改商品成功！");
                    resolve("ok");
                }).then((res1) => {
                    console.log(res1);
                    location.reload();
                })
            }
        })
    }
    $("#modifyModal").modal("show");
}

function addNewGood() {
    var username = getUsername();
    console.log(username);
    var url = "http://localhost:8888/goods/" + username + "/add/";
    var form = document.querySelector("#goods_form");
    var formData = new FormData(form);
    console.log(formData);
    $.ajax({
        type: "post",
        data: formData,
        contentType: false,
        processData: false,
        url: url,
        success: function (res) {
            console.log(res.result_msg);
            new Promise((resolve, reject) => {
                alertSuccess("发布新商品成功！");
                resolve("ok");
            }).then((res1) => {
                console.log(res1);
                location.reload();
            })
        }
    })
}

function getUsername() {
    var list = window.location.href.split("/");
    var len = list.length;
    return list[len - 2];
}

function alertSuccess(msg) {
    $("#alert-success #alert-body").innerText = msg;
    $("#alert-success").display = "block";
    setTimeout(() => {
        $("#alert-success").display = "none";
    }, 2000);
}

$("#upload_image").change(function (e) {
    var file = e.target.files[0];
    console.log(file);
    var reader = new FileReader();
    reader.onload = function (e) {
        $("#upload_image_preview").attr("src", e.target.result);
        console.log(e.target.result);
    }
    reader.readAsDataURL(file);
})
