/*
设置Cookie
name 为Cookie的名称
value 为Cookie的值
day 为Cookie过期时间，单位为天
*/
function setCookie(name, value, day) {
    if (day !== 0) { //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后失效。
        var expires = day * 24 * 60 * 60 * 1000;
        var date = new Date(+new Date() + expires);
        document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
    } else {
        document.cookie = name + "=" + escape(value);
    }
}

/*
获取Cookie
name为Cookie名称
*/
function getCookie(name) {
    if (document.cookie.length != 0) {
        var cookieStart = document.cookie.indexOf(name + "=");
        if (cookieStart != -1) {
            cookieStart = cookieStart + name.length + 1;
            var cookieEnd = document.cookie.indexOf(";", cookieStart);
            return cookieEnd != -1 ? document.cookie.slice(cookieStart, cookieEnd) : document.cookie.slice(cookieStart);
        } else {
            return "";
        }
    } else {
        return "";
    }
}

/*
删除Cookie
name为Cookie名称
*/
function delCookie(name) {
    // 由于Cookie不能直接删除，只需要将有效时间设置成当前时间之前的某个时间cookie就会失效。
    setCookie(name, "", -1);
}