function onLoadFunction() {
    getFavouritesList();
}

function getFavouritesList() {
    var username = localStorage.getItem("username");
    var url = "http://localhost:8888/goods/favourites/query/";
    var data = {
        "username": username
    };
    $.post(
        url,
        data,
        (res) => {
            console.log(res.result_msg);
            var favourites = res.favourites;
            var html = "";
            for (var i = 0; i < favourites.length; i++) {
                var favourite = favourites[i];
                var aUrl = "http://localhost:8888/mart/" + favourite.goodid + "/page/";
                var create_time = new Date(favourite.create_time);
                create_time = create_time.toDateString();
                html += `<div class="card">`;
                html += `    <a href="${aUrl}">`;
                html += `        <img class="card-img-top preview"`;
                html += `             src="${favourite.imageurl}"`;
                html += `             alt="${favourite.goodname}">`;
                html += `    </a>`;
                html += `    <div class="card-body d-flex flex-column">`;
                html += `        <h5 class="flex-row align-items-center">`;
                html += `            <div class="inlineblock">${favourite.goodname}&nbsp;<small`;
                html += `                class="font-8">${create_time}</small></div>`;
                html += `            <div class="float-right inlineblock ml-auto font-14 d-flex align-items-center">`;
                html += `                <img class="avatar avatar-md mr-3" src="/static/images/xs/avatar4.jpg">`;
                html += `                    <div>${favourite.sellerusername}</div>`;
                html += `            </div>`;
                html += `        </h5>`;
                html += `        <p class="text-muted">${favourite.description}</p>`;
                html += `        <div class="d-flex align-items-center pt-5 mt-auto">`;
                html += `            <div><span class="text-orange font-20">&yen;${favourite.goodprice}</span> <small`;
                html += `                class="d-block text-muted">剩余${favourite.goodnum}件</small></div>`;
                html += `            <div class="ml-auto text-muted">`;
                html += `                <i class="fa fa-heart text-red mr-1"></i>`;
                html += `            </div>`;
                html += `        </div>`;
                html += `    </div>`;
                html += `</div>`;
            }
            $("#favourites_list").html(html);
        }
    )
}