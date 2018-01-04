/**
 * select 选择框
 * @param  obj select 对象
 * @param callback 选中后回调函数
 * @param type 1：支持按值搜索
 * need:jquery.js  common.css
 * example: 
 *         $.select.init(".select_warp",'',1);
 */
(function ($) {
    $.extend({
        select: {
            data: [],
            init: function (obj, callback, type) {
                this.getShow(obj, type);
                this.doSelect(obj, callback, type);
                if (type) {
                    this.getData(obj);
                    this.search(obj);
                }
            },
            getShow: function (obj, type) {
                var _this = this;
                $(obj + " input").focus(function () {
                    if ($(this).parent().hasClass("lock")) {
                        return false;
                    }
                    $(this).siblings("ul").show();
                    if (type) {
                        _this.setData(obj);
                    }
                })
                $(document).click(function () {
                    $(obj + " ul").hide();
                    if (type) {
                        _this.setData(obj);
                    }
                });
                $(obj).live('click', function (event) {
                    event.stopPropagation();
                });
                $(obj + " li").live('mouseenter', function (e) {
                    $(this).addClass("hover");
                });
                $(obj + " li").live('mouseleave', function (e) {
                    $(this).removeClass("hover");
                });
            },
            doSelect: function (obj, callback, type) {
                var _this = this;
                $(obj + " li").live('click', function (e) {
                    var This = $(this);
                    var Thisinput = This.parent().next();
                    var livalue = This.find("a").text();
                    var Thisul = This.parent();
                    if (Thisul.hasClass("more")) {
                        //Thisinput.focus();
                        if (This.hasClass("cur")) {
                            This.removeClass("cur");
                        } else {
                            This.addClass("cur");
                        }
                        var Thistext = "";
                        var lsitid = "";
                        var Thisli = This.parent().find(".cur");
                        for (var i = 0; i < Thisli.length; i++) {
                            if (Thistext != "") {
                                Thistext += "," + Thisli.eq(i).find("a").text();
                                lsitid += "," + Thisli.eq(i).attr("data-id");
                            } else {
                                Thistext += Thisli.eq(i).find("a").text();
                                lsitid += Thisli.eq(i).attr("data-id");
                            }
                        }
                        Thisinput.val(Thistext);
                        Thisinput.attr("alt", lsitid);
                    } else {
                        This.addClass("cur");
                        This.siblings(".cur").removeClass("cur");
                        Thisinput.val(livalue);
                        var obj = This.attr("data-id");
                        if (obj)
                        {
                            Thisinput.attr("data-id", obj);
                        }
                        This.parent().hide();
                    }
                    if (type) {
                        _this.setData(obj);
                    }
                    if (typeof (callback) == "function") {
                        callback();
                    }
                });
            },
            search: function (obj) {             //search框需要有.search对象
                var _this = this;
                $(obj + " .search").keyup(function () {
                    var data = [];
                    var val = $(this).val();
                    var parentObj = $(this).parent();
                    var index = parentObj.index();
                    var datas = _this.data;
                    datas = datas[index];
                    var liObj = parentObj.find("li");
                    var i = 0;
                    if (datas.length) {
                        for (k in datas) {
                            var id = datas[k].id;
                            var text = datas[k].text;
                            if (text.indexOf(val) > -1) {
                                data[i] = {
                                    id: id,
                                    "text": text
                                };
                                i++;
                            }
                        }
                        if (data.length) {
                            var str = "";
                            for (j in data) {
                                str += "<li data-id=" + data[j].id + "><a href='javascript:void(0);'>" + data[j].text + "</a></li>";
                            }
                            parentObj.find("ul").html(str);
                        }
                    }
                })
            },
            getData: function (obj) {
                var _this = this;
                $(obj + " ul").each(function (index, cobj) {
                    var data = [];
                    $(cobj).find("li").each(function (i, ccobj) {
                        var id = $(ccobj).attr("data-id") || '';
                        var text = $(ccobj).find("a").text() || "全部";
                        data[i] = {
                            id: id,
                            "text": text
                        };
                    });
                    _this.data[index] = data;
                })
            },
            setData: function (obj) {
                var data = this.data;
                if (data) {
                    for (i in data) {
                        var checked = [];
                        var str = "";
                        $(obj).eq(i).find("li").each(function (k, obs) {
                            if ($(obs).hasClass("cur")) {
                                var id = $(obs).attr("data-id");
                                checked.push(id);
                            }
                        })
                        for (j in data[i]) {
                            if ($.inArray(data[i][j].id, checked) > -1 && checked.length) {
                                str += "<li class='cur' data-id=" + data[i][j].id + "><a href='javascript:void(0);'>" + data[i][j].text + "</a></li>";
                            } else {
                                str += "<li data-id=" + data[i][j].id + "><a href='javascript:void(0);'>" + data[i][j].text + "</a></li>";
                            }
                        }
                        $(obj).eq(i).find("ul").html(str);
                    }
                }
            }
        }
    });
})(jQuery);


