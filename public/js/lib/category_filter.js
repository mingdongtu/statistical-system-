
function filteroption(root) {  //初始化列表，参数为列表id
    var tempul;
    tempul = $("#" + root).clone(true);
    tempul.children().each(function() {
        var htmword = $(this).html();
        var pyword = $(this).toPinyin();
        var supperword = "";
        pyword.replace(/[A-Z]/g, function(word) { supperword += word });
        $(this).attr("mka", (htmword).toLowerCase());
        $(this).attr("mkb", (pyword).toLowerCase());
        $(this).attr("mkc", (supperword).toLowerCase());
    });
    window[root] = tempul;
}

//筛选符合的列表项
function resetOption(keys, root) {
    keys = keys.toLowerCase();
    $("#" + root).children().remove();
    var duplul = $(window[root]);
    if (keys.length <= 0) {
        duplul.children().each(function() {
        $("#" + root).append($(this).clone(true).removeAttr("mka").removeAttr("mkb").removeAttr("mkc"));  
        });
        return;
    }
    duplul.children('[mka*="' + keys + '"],[mkb*="' + keys + '"],[mkc*="' + keys + '"]').each(function() {
    $("#" + root).append($(this).clone(true).removeAttr("mka").removeAttr("mkb").removeAttr("mkc"));
    });
}