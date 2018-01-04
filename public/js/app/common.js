var hms_host = 'http://' + window.location.host + '/';
var hmc_host = 'http://' + window.location.host + '/';

//配置参数
var config = {
	version: '1.0.0',
	host: '',
	aesKey: 'bdf17047b5b01f5c5040ca43b9f3eae9'
};

var common = {};

//获取用户uid（判断登录）
common.getUser = function(type){
	type = type || 1;
	if(type == -1 || (sessionStorage.id && sessionStorage.name && sessionStorage.role_name)){
		return {
			uid: sessionStorage.id,
			name: sessionStorage.name
		}
	}else{
		location.href = '/web/html/login.html';
	}
};

/**
 * 封装ajax
 * @param data 提交的数据
 * @param callback 回调
 */
common.ajax = function (data,callback){
    data.rand = Math.random();
    $.ajax({
        type:'post',
        dataType:'json',
        url:data.url,
        data:data,
        async:data.async === false ? false : true,
        success:function(json){
            if(json.errcode == '303'){
                setTimeout(function(){
                    parent.window.location.href = '/web/html/login.html';
                },2000);
            }
            callback && callback(json);
        },
        error:function(XMLHttpRequest,textStatus,errorThrown){
            console.log(errorThrown);
        }
    });
};

/**
 * 年龄规则
 * @param {int} year 出生年份
 * @param {int} month 出生月份
 * @return string
 * 3岁以下使用格式为：不足一个月按0岁1个月显示，0岁2个月，1岁0个月，2岁0个月，2岁4个月等
 * 3岁以上（包括3岁）使用格式为：3岁，4岁，12岁等
 * 都通过出生日期换算显示年龄。
 */
common.get_age = function(year, month){
    if(year == '0'){
        return '';
    }
    var age_str = '';
    //当前日期
    var date = new Date();
    var nyear = date.getFullYear();
    var nmonth = date.getMonth() + 1;
    //相差月份
    var months  = (nyear - year) * 12 + (nmonth - month);
    if (months < 36) {
        //3岁以下使用格式为：不足一个月按0岁1个月显示，0岁2个月，1岁0个月，2岁0个月，2岁4个月等
        if (months <= 0) {
            months = 1;
        }
        age_str = Math.floor(months / 12) + '岁' + (months % 12) + '个月';
    } else {
        //3岁以上（包括3岁）使用格式为：3岁，4岁，12岁等
        age_str = Math.floor(months / 12) + '岁';
    }
    return age_str;
};


/**
 * 加载层
 * @param bool flag 显示、隐藏加载层
 */
common.loading = function loading(flag){
    if(flag){
        var $loadingbar = $('.loadingbar');
        if($loadingbar.length == 0){
            var html = '<div class="loadingbar"><div class="loadingbarin"></div></div>';
            $('body').prepend(html);
        }
        $('.loadingbarin').stop(true,true);
        $('.loadingbarin').animate({width: "95%"},1500);
        return true;
    }
    $('.loadingbarin').stop(true,true);
    $('.loadingbarin').animate({width: "100%"},function(){
        $(this).width(0);
    });
    return true;
};




//上传图片
common.upload_img = function(opts,event) {
    if(window.FileReader) {  
        var event = event || window.event;
        var img = event.target.files[0];
        if(!img){
            return ;
        }
        // 判断图片格式
        if(img.size > 2*1024*1204){
            alert('大小不超过2MB');
            return ;
        }
        // 判断图片格式
        if(!(img.type.indexOf('image')==0 && img.type && /\.(?:jpg|png|gif)$/.test(img.name)) ){
            alert('图片只能是jpg,png');
            return ;
        }
        var reader = new FileReader();
        reader.readAsDataURL(img);

        reader.onload = function(e){ 
            var img = new Image;
            img.src = reader.result;
            img.onload = function () {
                var width = img.width;
                var height = img.height;
                if(width !=opts.width || height!=opts.height){
                    alert('图片大小尺寸必须为'+ opts.width +'px*'+ opts.height +'px');
                 return ;
                }
                $.post("/index.php/Uploadify/do_upload", { img: e.target.result,type:opts.type},function(ret){
                if(ret.img!=''){
                    $("#" + opts.ImgPre).attr("src",ret.img);
                }else{
                    alert('上传失败');
                }
            },'json');
            };

        } 
    }else{
        alert('浏览器不兼容，请换google浏览器！');
    }
};

//截取段落文字
common.suolve = function(str, num) {
	if (typeof str == 'undefined' || str.length == 0){
		return '';
	}
    var end;
    var sub_length = num;
    var temp1 = str.replace(/[^\x00-\xff]/g, "**");
    var temp2 = temp1.substring(0, sub_length);
    var x_length = temp2.split("\*").length - 1;
    var hanzi_num = x_length / 2;
    sub_length = sub_length - hanzi_num;
    var res = str.substring(0, sub_length - 5);
    if (res != str) {
        end = res + "……";
    } else {
        end = res;
    }
    return end;
};

common.mydialog = function(obj, tips,confirm_tips,confirm_num) {
    var tips = arguments[1] ? arguments[1] : '<span>确定要删除吗？</span>';
    var confirm_tips=arguments[2] ? arguments[2] : 0;
    var dia = $(".mydialog");
    if (dia.length > 0) {
        if (selectstr == "yes") {
            dia.remove();
                                    //alert(confirm_num.x);
            return true;
        }
        dia.remove();
        return false;
    } else {
        if(confirm_tips){
            var confirm_text='<div style="margin-left: 12px;cursor: pointer;float: left;padding-top: 17px;"><input name="confirm" type="checkbox"> '+confirm_tips+'</div>';
            var mydialog = $('<div class="modify_warp" id="mydialog_modify_warp"><i class="mydiabj"></i><div class="mydialog"><a href="javascript:;" class="close">关闭</a><h2>页面提示</h2><div class="conter">' + tips + confirm_text+'</div><div class="btn_box"><a href="javascript:;" class="no">取消</a><a href="javascript:;" class="yes">确定</a></div></div></div>');
        }else{
            var mydialog = $('<div class="modify_warp" id="mydialog_modify_warp"><i class="mydiabj"></i><div class="mydialog"><a href="javascript:;" class="close">关闭</a><h2>页面提示</h2><div class="conter">' + tips + '</div><div class="btn_box"><a href="javascript:;" class="no">取消</a><a href="javascript:;" class="yes">确定</a></div></div></div>');    
        }
        mydialog.appendTo("body");
        $(".close,.btn_box .no").click(function(e) {
            selectstr = "no";
            obj.click();
            $("#mydialog_modify_warp").remove();
        });
        $(".btn_box .yes").click(function(e) {
            if(confirm_tips){
               if($('input[name="confirm"]').prop("checked")){
                   confirm_num.x=1;
               }
            }
            selectstr = "yes";
            obj.click();
            $("#mydialog_modify_warp").remove();
        });
        return false;
    }
};

 common.mydialogtwo = function(obj, tips, btn) {
    var tips = arguments[1] ? arguments[1] : '<span>确定要删除吗？</span>';
    var btntxt = arguments[2] ? arguments[2] : '确定';
    var dia = $(".mydialog");
    if (dia.length > 0) {
        if (selectstr == "yes") {
            dia.remove();
            return true;
        }
        dia.remove();
        return false;
    } else {
        var mydialog = $('<div class="modify_warp" id="tishiasd"><i class="mydiabj"></i><div class="mydialog" style="width: 400px;margin-left: -200px;"><a href="javascript:;" class="close">关闭</a><h2>页面提示</h2><div class="conter">'+tips+'</div><div class="btn_box"><a href="javascript:;" class="no">取消</a><a href="javascript:;" class="yes">'+btntxt+'</a></div></div></div>');
        mydialog.appendTo("body");
        $(".close,.btn_box .no").click(function(e) {
            selectstr = "no";
            obj.click();
            $("#tishiasd").remove(); 
        });
        $(".btn_box .yes").click(function(e) {
            selectstr = "yes";
            obj.click();
            $("#tishiasd").remove();
        });
        return false;
    }
};

common.Trim = function (str,is_global){
    str = str.replace(/<\/?[^>]*>/g,'');
    str = str.replace(/[\s| ]*\r/,"");
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g,"");
    if(is_global.toLowerCase()=="g"){
        result = result.replace(/\s/g,"");
     }
    result = result.replace(/&nbsp;/ig,'');//去掉&nbsp;
    return result;
}

//生成翻页控件
common.pageCtrl = function(maxPage, currPage, total){
	maxPage = parseInt(maxPage);
	currPage = parseInt(currPage) || 1;
	var html = '<p class="totalPage">共' + maxPage + '页' + (total && total > 0 ? '，' + total + ' 条记录' : '' )+ '</p>';
	if(maxPage > 1){
		html += '<div class="pageCtrl">';
		html += '<a class="page-first" href="javascript:;" title="首页"></a>';
		html += '<a class="page-prev" href="javascript:;" title="上一页"></a>';
		html += '<a class="page-index' + (currPage==1 ? ' cue' : '') + '" href="javascript:;">1</a>';
		if(currPage > 4){
			html += '<span>...</span>';
		}
		for(var i = currPage - 2; i < maxPage && i <= currPage + 2; i++){
			if(i > 1){
				html += '<a class="page-index' + (currPage==i ? ' cue' : '') + '" href="javascript:;">' + i + '</a>';
			}
		}
		if(currPage < maxPage - 3){
			html += '<span>...</span>';
		}
		html += '<a class="page-index' + (currPage==maxPage ? ' cue' : '') + '" href="javascript:;">' + maxPage + '</a>';
		html += '<a class="page-next" href="javascript:;" title="下一页"></a>';
		html += '<a class="page-last" href="javascript:;" title="尾页"></a>';
		//html += '<div class="topage"><input name="" type="text" onkeydown="keyDown(event)"/><a href="javascript:;" data-id="'+maxPage+'">GO</a></div>';
		html += '</div>';
	}
	$(".pageWrap").html(html);
};

//生成翻页控件
common.pageCtrl1 = function(maxPage, currPage, total){
	maxPage = parseInt(maxPage);
	currPage = parseInt(currPage) || 1;
	var html = '<p class="totalPage">共' + maxPage + '页' + (total && total > 0 ? '，' + total + ' 条记录' : '' )+ '</p>';
	if(maxPage > 1){
		html += '<div class="pageCtrl">';
		html += '<a class="page-first" href="javascript:;" title="首页"></a>';
		html += '<a class="page-prev" href="javascript:;" title="上一页"></a>';
		html += '<a class="page-index' + (currPage==1 ? ' cue' : '') + '" href="javascript:;">1</a>';
		if(currPage > 4){
			html += '<span>...</span>';
		}
		for(var i = currPage - 2; i < maxPage && i <= currPage + 2; i++){
			if(i > 1){
				html += '<a class="page-index' + (currPage==i ? ' cue' : '') + '" href="javascript:;">' + i + '</a>';
			}
		}
		if(currPage < maxPage - 3){
			html += '<span>...</span>';
		}
		html += '<a class="page-index' + (currPage==maxPage ? ' cue' : '') + '" href="javascript:;">' + maxPage + '</a>';
		html += '<a class="page-next" href="javascript:;" title="下一页"></a>';
		html += '<a class="page-last" href="javascript:;" title="尾页"></a>';
		html += '<div class="topage"><input name="" type="text" onkeydown="keyDown(event)"/><a href="javascript:;" data-id="'+maxPage+'">GO</a></div>';
		html += '</div>';
	}
	$(".pageWrap").html(html);
};

//对日期进行格式化
common.timeFormat = function(date, format){
	date = new Date(date);
	var map = {
		"M": date.getMonth() + 1, //月份
		"d": date.getDate(), //日
		"h": date.getHours(), //小时
		"m": date.getMinutes(), //分
		"s": date.getSeconds(), //秒
		"q": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};
	format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
		var v = map[t];
		if (v !== undefined) {
			if (all.length > 1) {
				v = '0' + v;
				v = v.substr(v.length - 2);
			}
			return v;
		} else if (t === 'y') {
			return (date.getFullYear() + '').substr(4 - all.length);
		}
		return all;
	});
	return format;
};

//获取地址栏参数
common.get_url_param = function (name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var loc = decodeURIComponent(window.location.search);
	var r = loc.substr(1).match(reg);
	if (r != null)
		return  unescape(r[2]);
	return null;
};

//确认提示框
common.confirm = function(msg, callback){
	var html = '<div class="coverWin">' +
		'<div class="popConfirm">' +
		'<h4>提示</h4>' +
		'<div class="cfmCont">' +
		'<p>' + msg + '</p>' +
		'<div class="cfmBtnWrap">' +
		'<a id="cfmSubmit" href="javascript:;">确&nbsp;定</a>' +
		'<a id="cfmCancel" href="javascript:;">取&nbsp;消</a>' +
		'</div></div></div></div>';
	$('body').append(html);
	$("#cfmCancel").click(function(){
		$(this).parents('.coverWin').remove();
	});
	$("#cfmSubmit").click(function(){
		$(this).parents('.coverWin').remove();
		if(typeof(callback) == 'function'){
			callback();
		}
	})
};

//信息提示
common.mytips = function(text, times) {
	$(".mytips,.shield").remove();
	times = times || 2000;
	var mytips = $('<div class="mytips"><i class="bj"><i/></div>');
	mytips.append('<p>' + text + '</p>');
	$("body").append('<i class="shield"></i>');
	mytips.appendTo("body");
	var box = $(".mytips");
	var w = box.width();
	var h = box.height();
	box.css({"margin-left": -w / 2, "margin-top": -h / 2, "position": "fixed",zIndex:99999999});
	setTimeout(function () {
		$(".mytips,.shield").remove();
	}, times);
};

common.mytips_one = function(text, t) {
    text = text.replace(/\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029)/g, '<br>');
    var mytips = $('<div class="mytips"><a href="javascript:;" class="close">关闭</a></div>');
    mytips.append('<p>' + text + '</p>')
    mytips.appendTo("body");
    setTimeout(function() {
        $(".mytips").remove();
    }, typeof t == 'undefined' ? 3000 : t);
    $(".close").click(function(e) {
        $(".mytips").remove();
    });
};


//改变浏览器大小时重置弹窗浮层大小和位置
common.dzbox_resize = function() {
    $(".dzbox").css({
        position: "fixed",
        left: ($(window).width() - $(".dzbox").outerWidth()) / 2,
        top: ($(window).height() - $(".dzbox").outerHeight()) / 2
    });
};

//时间戳转换成字符串
common.unuxtotime = function(unixTime, isFull, timeZone){
    timeZone = timeZone || 8;
    if (typeof (timeZone) == 'number'){
        unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
    }
    var time = new Date(unixTime * 1000);
    var ymdhis = "";
    ymdhis += time.getUTCFullYear() + "-";
    var month = time.getUTCMonth()+1;
    if(month < 10){
        month = '0' + month;
    }
    ymdhis += month + "-";
    var day = time.getUTCDate();
    if(day < 10){
        day = '0' + day;
    }
    ymdhis += day;
    if (isFull === true){
        var hours = time.getUTCHours();
        if(hours < 10){
            hours = '0' + hours;
        }
        ymdhis += " " + hours + ":";
        var minutes = time.getUTCMinutes();
        if(minutes < 10){
            minutes = '0' + minutes;
        }
        ymdhis += minutes;
    }
    return ymdhis;  
};

//显示加载中
common.showLoading = function(){
	var html = '<div class="coverWin" style="z-index: 99999999;"><div class="m-loading"><img src="/web/public/images/loading.gif"></div></div>';
	$('body').append(html);
};

//删除加载中
common.hideLoading = function(){
	$(".m-loading").parent().remove();
};

//下拉框事件切换
$(document).on('click', '.selectWrap>div' ,function(e){
	if($(this).hasClass('cue')){
		$(this).removeClass('cue').next().hide();
	}else{
		$(this).addClass('cue').next().show();
	}
	e.stopPropagation();
});
$(document).click(function(){
	$(".selectWrap>div.cue").trigger('click');
});

//复选框事件
$(document).on('click', '.checkBox', function(e){
	if($(this).hasClass('cue')){
		$(this).removeClass('cue');
	}else{
		$(this).addClass('cue');
	}
	e.stopPropagation();
});

//点击上一页，点击下一页，首页、尾页
$(document).on('click', '.page-prev', function(){//上一页
	$(".page-index.cue").prev('.page-index').trigger('click');
}).on('click', '.page-next', function(){//下一页
	$(".page-index.cue").next('.page-index').trigger('click');
}).on('click', '.page-first', function(){//首页
	$('.page-index').first().trigger('click');
}).on('click', '.page-last', function(){//尾页
	$('.page-index').last().trigger('click');
}).on('click', '.topage a', function(){//尾页
	var gopage = parseInt($(".topage input").val());
	var maxpageshu = $(this).attr("data-id");
	if(gopage != NaN && gopage <= maxpageshu && gopage>=1){
		getData(gopage);
	}else{
		$(".topage input").val('');
	}
});

//ajax配置
$.ajaxSetup({
	beforeSend: function(){
		//common.showLoading('');
	},
	complete: function(xhr){
		common.hideLoading();
		if(xhr.responseText){
			var res = JSON.parse(xhr.responseText);
			if(res.errcode == '303'){
				localStorage.clear();
				common.mytips(res.errmsg);
				setTimeout(function(){
					parent.window.location.href = '/web/html/login.html';
				},2000);
			}
		}
	},
	dataType: 'json',
	type: "post"
});

common.getNowFormatDate = function() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
			+ " " + date.getHours() + seperator2 + date.getMinutes()
			+ seperator2 + date.getSeconds();
	return currentdate;
};

//跳转按enter键
function keyDown(e) {
	var ev= window.event||e;
	if (ev.keyCode == 13) {
		var gopage = parseInt($(".topage input").val());
		var maxpageshu = $(".topage a").attr("data-id");
		if(gopage != NaN && gopage <= maxpageshu && gopage>=1){
			getData(gopage);
		}else{
			$(".topage input").val('');
		}
	}
}


/**
 *	@todo	注册模板引擎
 *	@author	Xie.shiran	2017-11-3 16:00:35
 *	@param	e		#或.开头则为存放模板代码的dom对象，否则为异步获取模板代码
 *	@param	d		要传递到模板的数据
 */
$.fn.T = function( e, d )
{
	if( typeof template != 'function' )
		return console.error( '模板引擎未加载' );
	if( /^[#|\.]/.test( e ) )
	{
		e = $(e);
		if( e.length )
			return $(this).html( template( e.html(), d ) );   //将数据渲染到模板中
		else
			console.error( '模板对象不存在' );
	}
	else
	{
		$.get( e, {}, function(r)
		{
			return $(this).html( template( r, d ) );
		} ).error( function()
		{
			console.error( '模板不存在' );
		} )
	}
}

$(function() {
	$(".text").not('input[readonly="readonly"]').focus(function(e) {
        $(this).css("border-color","#5eb63c");
    }).blur(function(e) {
        $(this).css("border-color","#cfcfcf");
    });
    $(".table_box tr").hover(
        function() {
            $(this).addClass("on");
        },
        function() {
            $(this).removeClass("on");
        }
    );
	$(".input_warp i").hide();
	$(".input_warp input").each(function(index, element) {
        var tv = $(this).val();
		if(tv == ""){
			$(this).siblings("i").show();
		}else{
			$(this).siblings("i").hide();
		}
    });
	$(".textarea_box i").on('click', function(e) {
        $(this).siblings("input").focus();
    });
    $(".textarea_box textarea").on('focus', function() {
        $(this).siblings("i").hide();
    });
    $(".textarea_box textarea").on('blur', function() {
        var Thisval = $(this).val();
        if (Thisval == "") {
            $(this).siblings("i").show();
        }
    });
    $(".input_warp i").on('click', function(e) {
        $(this).siblings("input").focus();
    });
    $(".input_warp input").on('focus', function() {
        $(this).siblings("i").hide();
        $(this).parent().addClass("bdergreen");
    });
    $(".input_warp input").on('blur', function() {
        var Thisval = $(this).val();
        $(this).parent().removeClass("bdergreen");
        if (Thisval == "") {
            $(this).siblings("i").show();
        }
    });
    $(".select_warp i").on('click', function(e) {
        $(this).siblings("input").focus();
    });
    $(".select_warp input").on('focus', function() {
        if ($(this).parent().hasClass("lock")) {
            return false;
        }
        $(".select_warp ul").hide();
        $(".select_warp").css("z-index", "");
        $(this).parent().css("z-index", "110");
        $(this).siblings("ul").show();
    });
	$("input, a").on("keyup", function (event) {
     	var evt = window.event || arguments.callee.caller.arguments[0];
     	if(evt.keyCode == 9){
			$(".select_warp ul").hide();
			$(".select_warp").css("z-index", "11");
			$(this).parent().css("z-index", "1001");
			if ($(this).parent().hasClass("lock")) {
            	return false;
       	 	}
        	$(this).siblings("ul").show();
		}
    });
    $("#companyinput, #pharmacyinput, #company, #yaodian").focus(function(e) {
		if(!$(this).hasClass("pushsms")){
			if ($(this).val() == "全部" || $(this).val() == "-请选择-") {
				$(this).val("")
			}
		}
    });
    $("#companyinput, #pharmacyinput, #company, #yaodian").blur(function(e) {
        if ($(this).val() == "") {
            $(this).attr("data-id", "");
        }
        //if($(this).attr("data-id")==""){$(this).val("");}
    });
    var mytime;
    var noxuan = false;
    $(".select_warp li,.select_warp2 li").on('click', function(e) {
        var This = $(this);
        var Thisinput = This.parent().next();
        var livalue = This.find("a").text();
        var Thisul = This.parent();
        //clearTimeout(mytime);
		if(This.hasClass("bound")){
			return;
		}
        if (Thisul.hasClass("more")) {
            if (This.hasClass("cur")) {
                This.removeClass("cur");
                if ($(this).attr("data-id") == "-1") {
                    noxuan = false;
                }
            } else {
                if ($(this).attr("data-id") == "-1") {
                    This.addClass("cur");
                    $(this).siblings(".cur").removeClass("cur");
                    noxuan = true;
					Thisinput.val('');
            		Thisinput.attr("alt", '');
                } else {
                    if (noxuan) {
                        return false;
                    }
                    This.addClass("cur");
                }
            }

            var Thistext =This.find("a").text();
            var lsitid = This.attr("data-id");
            var valen = Thisinput.val().split(",");
			if(Thisinput.attr("alt")){
			var valid = Thisinput.attr("alt").split(",");
			}else{
				valid='';
			}
			var newtxt ='';
			var newid = '';
			var cfs = "0";
			if(Thisinput.attr("alt") == "0" || Thisinput.attr("alt") == '' || valid==''){
				newtxt += Thistext;
				newid += lsitid;
			}else{			
				for(var i=0; i<valid.length; i++){
					if(lsitid == valid[i]){
						cfs = "1";
					}else{
						if(newtxt == ''){
							newtxt += valen[i];
							newid += valid[i];
						}else{
							newtxt += ","+valen[i];
							newid += ","+valid[i];
						}
					}
				}
				if(cfs == "0"){
					newtxt += ","+Thistext;
					newid += ","+lsitid;
				}
			}
			Thisinput.val(newtxt);
            Thisinput.attr("alt", newid);
			Thisinput.focus();
        } else {
            This.addClass("cur");
            This.siblings(".cur").removeClass("cur");
            Thisinput.val(livalue);
            var obj = This.attr("data-id");
            if (obj) {
                Thisinput.attr("data-id", obj);
            }
            This.parent().hide();
        }
    });
    $(".select_warp li").on('mouseenter', function(e) {
        $(this).addClass("hover");
    });
    $(".select_warp li").on('mouseleave', function(e) {
        $(this).removeClass("hover");
    });
    $(".select_warp2 input").focus(function() {
        if ($(this).parent().hasClass("lock")) {
            return false;
        }
        $(this).siblings("ul").show();
    });

    $(document).click(function() {
        $(".select_warp ul").hide();
        $(".select_warp2 ul").hide();
    });
    $(".select_warp,.select_warp2").on('click', function(event) {
        event.stopPropagation();
    });
	
	$(document).on("click", ".table_box a", function() {
		var Thistr = $(this).parents("tr");
		Thistr.addClass("cur").siblings(".cur").removeClass("cur");
    });
	
});