// 健康管理方案和执行计划
var plan_types = ['体检检测', '评估报告', '随访', '健康指导'];
var process_types = ['不限', '消息推送', '短信', '邮件', '电话'];
var plan_exe_units = ['年', '月', '季', '周', '日'];
var plan_level = ['紧急', '一般', '不紧急'];
var rate_types = ['不重复','每天','每周','每月','每年'];

//执行计划中的执行频率
function show_rate(val, type){
	var a = '';
	var vals = '';
	$("div[id^='rate_dtime_']").hide();
	if (val == 1){
		$("#rate_howday,#rate_dtime,#dunion_tr").hide();
		$("#rate_dtime li").removeClass('cur');
		$("#rate_dtime input").removeAttr('readonly').val('').attr('readonly', 'readonly');	
	} else {
		$("#rate_howday,#rate_dtime,#dunion_tr").show();
		vals = 1;
		var sel_val = '';
		if (val == 2){
			a = '天';
			$("#rate_dtime").hide();
			$("#rate_dtime li").removeClass('cur');
			$("#rate_dtime input").removeAttr('readonly').val('').attr('readonly', 'readonly');	
		} else if (val == 3){
			a = '周';
			sel_val = '星期一';
		} else if (val == 4){
			a = '月';
			sel_val = '1号';
		} else if (val == 5){
			a = '年';
			sel_val = '1月';
		}
		if (val > 2){
			$("#rate_dtime_"+val).show();
			$("#rate_dtime_"+val+" li").removeClass('cur');
			if (type == 1){
				$("#rate_dtime_"+val+" li[data-id='1']").addClass('cur');
			} else {
				sel_val = '';
			}
			$("#rate_dtime_"+val+" input").removeAttr('readonly').val(sel_val).attr('alt', vals).attr('readonly', 'readonly');	
		}
	}
	vals = type == 1 ? vals : '';
	$("#howday").val(vals);
	$("#howday_unit").text(a);
}

//将不同单位的执行时长转换为天数再比较
function change_to_day(num, uint){
	if (uint == 1){//年
		num = num * 12 * 30;
	} else if (uint == 3){//季
		num = num * 3 * 30;
	} else if (uint == 2){//月
		num = num * 30;
	} else if (uint == 4){//周
		num = num * 7;
	}
	return num;
}

//执行时长 type 1：修改方案时长 2：修改执行计划时长
//template_type 使用delegate时直接获取数据有延迟
function plan_end_time(type, template_val, template_type_val, plan_val, plan_type_val){
	if (typeof template_type_val == 'undefined'){
		mytips('请选择管理有效期单位');
		return false;
	}
	//console.log(type+','+template_val+','+template_type_val+','+plan_val+','+plan_type_val);
	var duration = change_to_day(template_val, template_type_val);
	//console.log('duration:'+duration);
	if (type == 2){
		if (plan_val == '' || plan_val == 0){
			mytips('请填写执行时长');
			return false;
		}
		if (typeof plan_type_val == 'undefined'){
			mytips('请选择执行时长单位');
			return false;
		}
		var tmp_duration2 = change_to_day(plan_val, plan_type_val);
		//console.log(plan_val+','+plan_type_val+','+tmp_duration2);
		//console.log(duration+','+$("#type li[class='cur']").attr('data-id')+','+$.trim($("#duration").val()));
		if (tmp_duration2 > duration){
			mytips('执行时长不能大于方案的管理有效期');
			return false;
		}
	} else {
		//如果创建了执行计划后再修改方案执行时长则检查是否超出
		if (tijian.length == 0 && health.length == 0 && suifang.length == 0 && teach.length == 0)
			return true;
	
		$("#btn02,#btn03").hide();
		if (tijian.length > 0){
			var i = check_outtime(duration, tijian);
			if (i>0){
				mytips("体检检测第<b>"+i+"</b>个执行时长不能大于方案的管理有效期，请修改执行计划");
				return false;
			}
		}
		if (health.length > 0){
			var i = check_outtime(duration, health);
			if (i>0){
				mytips("评估报告第<b>"+i+"</b>个执行时长不能大于方案的管理有效期，请修改执行计划");
				return false;
			}
		}
		if (suifang.length > 0){
			var i = check_outtime(duration, suifang);
			if (i>0){
				mytips("随访计划第<b>"+i+"</b>个执行时长不能大于方案的管理有效期，请修改执行计划");
				return false;
			}
		}
		if (teach.length > 0){
			var i = check_outtime(duration, teach);
			if (i>0){
				mytips("健康指导第<b>"+i+"</b>个执行时长不能大于方案的管理有效期，请修改执行计划");
				return false;
			}
		}
		$("#btn02,#btn03").show();
	}
	return true;
	//提示先不做
	/*var end_string = '';
	var date = new Date();
	var month = date.getMonth();
	var day = date.getDay();
	if (uint2 == 1){//年
		end_string = date.getFullYear()+duration2.'年'+month+'月'+day+'日';
	} else if (uint2 == 2){//季
		
	} else if (uint2 == 3){//月
		
	} else if (uint2 == 4){//周
		
	} else if (uint2 == 5){//日
		
	}
	
	var time = date.getTime();
	
	$("#plan_end_time").html('预计计划结束时间为：'+end_string);*/
}

//如果没超出返回0，否则返回大于0
function check_outtime(max_time, data){
	for(var i = 0;i<data.length;i++){
		var res = change_to_day(data[i].validate, data[i].validate_units);
		//console.log(data[i].validate+', '+data[i].validate_units+', '+res);
		if (res > max_time){
			return (i+1);
		}
	}
	return 0;
}

//初始化弹窗
function addprogram(ptype, is_template){
	$("#dddd").show();
	setTimeout(function () {
	$("#theways_list li, #mainlistli24 li, #mainlistli3 li, #mainlistli4 li, #rate_dtime_3 li, #rate_dtime_4 li, #rate_dtime_5 li, #member_level li, #send_time li").removeClass('cur');
	$("#theways_list, #mainlistli24, #mainlistli3, #mainlistli4, #member_level, #send_time").next().removeAttr('readonly').val('').attr('readonly', 'readonly');
	$("#rate_dtime_3 input, #rate_dtime_4 input, #rate_dtime_5 input").removeAttr('readonly').val('').attr('readonly', 'readonly');
	$("#duration2,#theway3,#duration3,#nrtext,#howday, #send_content").val('');
	$("#dunion li").removeClass('cur');

	if (is_change == 0){
		$("#theways_list li[data-id='0']").addClass('cur');
		$("#theways_list").next().removeAttr('readonly').val('不限').attr('readonly', 'readonly');
		$("#member_level li").addClass('cur');
		$("#member_level").next().removeAttr('readonly').val('一星,二星,三星,四星,五星').attr('readonly', 'readonly');
		$("#send_time li[data-id='1']").addClass('cur');
		$("#send_time").next().removeAttr('readonly').val('自动发送').attr('readonly', 'readonly');
		$("#send_content").next().text(640).next().text(640);
		$("#mainlistli24 li[data-id='0']").addClass('cur');
		$("#mainlistli24").next().removeAttr('readonly').val('指定管理方案之后').attr('readonly', 'readonly');
		$("#stime").val(0);//新增初始化为0
		//把方案执行时长赋给计划
		$("#duration2").val($.trim($("#duration").val()));
		var typeid = $("#type li[class='cur']").attr('data-id');
		$("#dunion li[data-id='"+typeid+"']").addClass('cur');
		$("#dunion").next().removeAttr('readonly').val($("#type li[data-id='"+typeid+"']").children().text()).attr('readonly', 'readonly');
		$("#mainlistli3 li[data-id='3']").addClass('cur');
		$("#mainlistli3").next().removeAttr('readonly').val('每周').attr('readonly', 'readonly');
		$("#howday").val(1);
		$("#rate_howday,#rate_dtime_3").show();
		$("#howday_unit").text('周');
		$("#rate_dtime_3 li[data-id='1']").addClass('cur');
		$("#rate_dtime_3 input").removeAttr('readonly').val('星期一').attr({'alt':'1', 'readonly':'readonly'});
		$("#duration3").val('0');
		$("#mainlistli4 li[data-id='1']").addClass('cur');
		$("#mainlistli4").next().removeAttr('readonly').val('一般').attr('readonly', 'readonly');
		$(".textarea_box i").show();
	} else {
		$("#rate_howday,#rate_dtime_3").hide();
	}
	$("#type2 li").removeClass('cur');
	$("#type2 li[data-id='5']").addClass('cur');
	$("#type2 input").removeAttr('readonly').val('日').attr('readonly', 'readonly');
	//$("#stime,#rate_dtime_4,#rate_dtime_5").hide();
	$("#rate_dtime_4,#rate_dtime_5").hide();
	$("#qdbtn").unbind();
	
	//$("#member_level,#send_time, #send_content").parent().parent().parent().show();
	//只有方案模板的时候才需要会员星级
	if (typeof is_template != 'undefined' && is_template == 1){
		$("#member_level").parent().parent().parent().show();
	}
	if (ptype != 1 || is_change == 0){
		$("#send_time, #send_content").parent().parent().parent().hide();
	}
	}, 20);
}

//执行计划弹窗确认时对数据验证
function set_data(ptype, is_template){
	temp = [];
	var val = $("#theways_list li[class='cur']").attr('data-id');
	//console.log(val);
	if (typeof val == 'undefined'){
		mytips('请选择执行方式');return false;
	}
	temp['way'] = val;
	temp['way_text'] = $("#theway").val();
	val = $("#mainlistli24 li[class='cur']").attr('data-id');
	if (typeof val == 'undefined'){
		mytips('请选择开始执行时间');return false;
	}
	temp['stime_type'] = val;
	temp['stime_text'] = $("#mainlistli24 li[class='cur']").children().text();
	if (is_template == 0){// 只有创建和修改模板时才需要检查
		val = $("#member_level li[class='cur']").attr('data-id');
		if (typeof val == 'undefined'){
			mytips('请选择会员星级');return false;
		}
		val = '';
		$.each($("#member_level li[class='cur']"), function(k, v){
			val += $(v).attr('data-id')+',';
		});
		temp['member_level'] = val.substr(0, val.length-1);
	} else {
		temp['member_level'] = '';
	}
	if (ptype == 1 && (temp['way'] == 1)){//消息推送
		val = $("#send_time li[class='cur']").attr('data-id');
		if (typeof val == 'undefined'){
			mytips('请选择是否自动发送');return false;
		}
		temp['push_time'] = val;
		temp['push_content'] = '';
		if (temp['push_time'] == 1){//自动发送
			val = $.trim($("#send_content").val());
			if (val == ''){
				mytips('请填写推送信息内容');return false;
			}
			if (val.indexOf('=') != -1 || val.indexOf('&') != -1 || val.indexOf('#') != -1){
				mytips('推送信息内容不能含有=&#等字符');
				return false;
			}
			temp['push_content'] = val;
		}
	} else {
		temp['push_time'] = '0';
		temp['push_content'] = '';
	}
	val = $("#mainlistli3 li[class='cur']").attr('data-id');
	if (typeof val == 'undefined'){
		mytips('请选择执行频率');return false;
	}
	temp['rate'] = val;
	temp['rate_text']=$("#mainlistli3 li[class='cur']").children().text();
	if (temp['rate'] > 1){
		val = $.trim($("#howday").val());
		if (val == '' || val < 1 || val > 999){
			mytips('请填写执行频率'+$("#howday_unit").text()+"数，且大于1小于999");return false;
		}
	} else {
		val = '';
	}
	temp['howDay'] = val;
	var val_arr = [];
	var val_arr_text = [];
	if (temp['rate'] > 2){
		$.each($("#rate_dtime_"+temp['rate']+" li[class='cur']"), function(k,v){
			val_arr.push($(v).attr('data-id'));
			val_arr_text.push($(v).children().text());
		});
		if (val_arr.length == 0){
			mytips('请选择执行频率的执行时间，可多选');return false;
		}
	}
	temp['dtime'] = val_arr.join('|');
	temp['dtime_text'] = val_arr_text.join('|');
	
	val = $.trim($("#duration2").val());//执行时长
	if (val == ''){
		mytips('请填写执行时长');return false;
	}
	temp['validate'] = val;
	val = $("#dunion li[class='cur']").attr('data-id');
	if (typeof val == 'undefined'){
		mytips('请选择执行时长单位');return false;
	}
	//检测执行时长
	var tmp_val = plan_end_time(2, $.trim($("#duration").val()), $("#type li[class='cur']").attr('data-id'), temp['validate'], val);
	//console.log(tmp_val);
	if (!tmp_val)
		return false;
		
	temp['validate_units'] = val;
	temp['validate_units_text'] = $("#dunion li[class='cur']").children().text();
	
	val = $.trim($("#stime").val());
	if (val == ''){
		mytips('请填写指定管理方案后的天数');return false;
	} else if (!checkNum(val)){
		mytips('指定管理方案后的天数必须是非负整数');return false;
	}
	temp['start_time'] = val;
	
	/*val = $.trim($("#duration3").val());
	if (val === 0){
		mytips('提前提醒时间必须大于0');return false;
	}
	temp['remain'] = val;
	val = $("#type2 li[class='cur']").attr('data-id');
	if (temp['remain'] != '' && typeof val == 'undefined'){
		mytips('请选择提前提醒时间单位');return false;
	}
	if (temp['remain'] == ''){*/
		temp['remain'] = '';
		temp['ruion'] = '0';
		temp['ruion_text'] = '日';
	/*} else {
		temp['ruion'] = val;
		temp['ruion_text'] = $("#type2 li[class='cur']").children().text();
	}*/
	//val = $("#mainlistli4 li[class='cur']").attr('data-id');
	temp['level'] = '-1';//typeof val == 'undefined' ? '-1' : val;
	temp['level_text'] = '';//temp['level'] == '-1' ? '' : $("#mainlistli4 li[class='cur']").children().text();
	val = $.trim($("#nrtext").val());
	if (val.indexOf('=') != -1 || val.indexOf('&') != -1 || val.indexOf('#') != -1){
		mytips('备注不能含有=&#等字符');
		return false;
	}
	temp['content'] = val;
	temp_string = 'mod='+temp['way']+'###stime_type='+temp['stime_type']+'###start_time='+temp['start_time']+'###validate='+temp['validate']+
		 '###validate_units='+temp['validate_units']+'###rate='+temp['rate']+'###rate_howday='+temp['howDay']+'###rate_time='+temp['dtime']+
		 '###remind='+temp['remain']+'###remind_units='+temp['ruion']+'###level='+temp['level']+'###content='+temp['content']+
		 '###member_level='+temp['member_level']+'###push_time='+temp['push_time']+'###push_content='+temp['push_content'];
	//console.log(temp_string);
	//console.log(temp);
	return true;
}

//编辑方案中的执行计划
//需要引入jquery_time.js文件
function init_edit_data(data, from_template, ptype){
	$("#theways_list li[data-id='"+data['way']+"']").addClass('cur').parent().next().removeAttr('readonly').val(data['way_text']).attr('readonly', 'readonly');
	$("#member_level").parent().parent().parent().hide();
	if (from_template == 0){
		var mlevel = data['member_level'].split(',');
		var mlevel_text = '';
		for(var i = 0; i<mlevel.length; i++){
			$("#member_level li[data-id='"+mlevel[i]+"']").addClass('cur');
			mlevel_text += $("#member_level li[data-id='"+mlevel[i]+"']").children().text() + ',';
		}
		$("#member_level").next().removeAttr('readonly').val(mlevel_text.substr(0, mlevel_text.length-1)).attr('readonly', 'readonly');
		$("#member_level").parent().parent().parent().show();
	}
	if (ptype == 1){
		$("#send_time li[data-id='"+data['push_time']+"']").addClass('cur').parent().next().removeAttr('readonly').val($("#send_time li[data-id='"+data['push_time']+"']").children().text()).attr('readonly', 'readonly');
		if (data['way'] == 1){
			$("#send_time, #send_content").parent().parent().parent().show();
		} else {
			$("#send_time, #send_content").parent().parent().parent().hide();
		}
		if (data['push_time'] == 1){
			$("#send_content").parent().parent().parent().show();
		} else {
			$("#send_content").parent().parent().parent().hide();
		}
		var max_len = data['way'] == 2 ? 240 : 640;
		$('#send_content').val(data['push_content']).next().text((max_len-$.trim(data['push_content']).length)).next().text(max_len);
		if (data['push_content'] != '')
			$("#send_content").prev().hide();
	} else {
		$("#send_time, #send_content").parent().parent().parent().hide();
	}
	$("#mainlistli24 li[data-id='"+data['stime_type']+"']").addClass('cur').parent().next().removeAttr('readonly').val(data['stime_text']).attr('readonly', 'readonly');
	$("#stime").val(data['start_time']);
	/*if (data['stime_type'] == 1){
		$("#stime").show();
	} else if (from_template == '1' && data['start_time'] == 0){//引用模板时将时间初始化为当前日期
		$("#stime").val($.myTime.UnixToDate($.myTime.CurTime()));
	}*/
	$('#duration2').val(data['validate']);
	$("#dunion li[data-id='"+data['validate_units']+"']").addClass('cur').parent().next().removeAttr('readonly').val(data['validate_units_text']).attr('readonly', 'readonly');
	$("#mainlistli3 li[data-id='"+data['rate']+"']").addClass('cur').parent().next().removeAttr('readonly').val(data['rate_text']).attr('readonly', 'readonly');
	show_rate(data['rate'], 0);
	if (data['rate'] > 1){
		$("#howday").val(data['howDay']);
		if (data['rate'] > 2){
			var dtimes = data['dtime'].split('|');
			$("#rate_dtime_"+data['rate']+" input").removeAttr('readonly').val(data['dtime_text'].replace(/\|/g, ',')).attr('readonly', 'readonly');
			for(var i = 0;i<dtimes.length;i++){
				$("#rate_dtime_"+data['rate']+" li[data-id='"+dtimes[i]+"']").addClass('cur');
			}
		}
	}
	$('#duration3').val(data['remain']);
	$("#type2 li[data-id='"+data['ruion']+"']").addClass('cur');
	$("#type2 input").removeAttr('readonly').val(data['ruion_text']).attr('readonly', 'readonly');
	$("#mainlistli4 li[data-id='"+data['level']+"']").addClass('cur').parent().next().removeAttr('readonly').val(data['level_text']).attr('readonly', 'readonly');
	$('#nrtext').val(data['content']).next().text((120-$.trim(data['content']).length));
	if (data['content'] != '')
		$("#nrtext").prev().hide();
}

/**
 * 管理方案中的执行计划，点击确定或使用方案模板
 * 全局变量created_num, tijian_string, temp, tijian_string, tijian, health_string, health, suifang_string, suifang, teach_string, teach
 * 必须有返回值，且为boolean
 */
function do_plan_data(type, is_edit, cid){
	var now_num = is_edit == 0 ? created_num[parseInt(type)-1] : cid;
	if(now_num >= 5){
		mytips('不能超过5个计划');return false;
	}
	if(type==1){
		tijian_string[now_num]=temp_string;
		tijian[now_num]=temp;
		var id_name = 'tijian_'+now_num;
	}else if(type==2){
		health_string[now_num]=temp_string;                                   
		health[now_num]=temp;  
		var id_name = 'health_'+now_num;
	}else if(type==3){
		suifang_string[now_num]=temp_string;
		suifang[now_num]=temp;
		var id_name = 'suifang_'+now_num;
	}else{
		teach_string[now_num]=temp_string;                                    
		teach[now_num]=temp;
		var id_name = 'teach_'+now_num;
	}
	var trhtml = '<tr id="'+id_name+'"><td>'+temp['way_text']+'</td><td>'+temp['validate']+temp['validate_units_text']+'</td><td>'+temp['rate_text']+'</td><td>'+suolve(temp['content'], 30)+'</td>';//<td>'+temp['level_text']+'</td>
	trhtml += '<td><a href="javascript:;" class="green_a edit_plan" data-type="'+type+'" data-id="'+now_num+'">修改</a></td><td><a href="javascript:;" class="red_a delete_plan" data-type="'+type+'" data-id="'+now_num+'">删除</a></td></tr>';
	if(is_edit==0 || is_edit==2){  
		created_num[parseInt(type)-1] = now_num + 1; 
	}else{
		$('#'+id_name).remove();
	}
	var stable = '<table width="100%" border="0" align="center" class="table_list" cellpadding="0" cellspacing="0"><thead><tr><th width="12%">执行方式</th><th width="12%">计划时长</th><th width="12%">执行频率</th><th width="42%">备注</th>';
	stable += /*'<th width="12%">紧急程度</th>*/'<th width="12%">修改</th><th>删除</th></tr></thead><tbody></tbody></table>';
	var table_list = $("#table"+type).find(".table_list");
	if(!table_list.length){
		$("#table"+type).html(stable);
		$("#table"+type).parents(".table_two").addClass("haslist");
	}
	$("#table"+type).find("tbody").eq(0).append(trhtml);
	temp=[];
	temp_string='';
	return true;	
}

//字数限制
function msArea(obj,len) {
	var _ms = obj.val();
	var left_len = len - _ms.length;//最大长度 剩余长度
	var zishu = (left_len > 0 ? left_len : 0);
	var id = obj.attr('id');
	if (id == 'cjc'){
		obj.parents(".input_warp").siblings("span").eq(1).html(len);
		obj.parents(".input_warp").siblings("span").eq(0).html(zishu);
	} else {
		obj.siblings("span").eq(1).html(len);
		obj.siblings("span").eq(0).html(zishu);
	}
	if (_ms.length > len) {
		_ms = _ms.substring(0, len)
		obj.val(_ms);
		if (id == 'cjc'){
			obj.parents(".input_warp").siblings("span").eq(0).html("0");
		} else {
			obj.siblings("span").eq(0).html("0");
		}
		mytips('已超出最大允许字数: '+len);
	}        
}

//初始化消息推送内容
function check_push_content(obj){
	var val = $(obj).attr('data-id');
	var ptype = $("#modify_box_title").attr('data-type');
	var val1 = $("#send_time li[class='cur']").attr('data-id');
	if (ptype == 1 && (val == 1)){
		$("#send_time_tr,#send_content_tr").show();
	} else {
		$("#send_time_tr,#send_content_tr").hide();
	}
	var max_len = 640;
	if (val == 2 && val1 == 1){
		max_len = 240;
	} else if (val1 == 2) {
		$("#send_content_tr").hide();
	}
	$("#send_content").attr('onkeyup', 'msArea($(this),\''+max_len+'\')');
	var val2_len = $.trim($("#send_content").val()).length;
	var diff_len = val2_len > max_len ? 0 : (max_len - val2_len);
	$("#send_content").next().text(diff_len).next().text(max_len);
	if (val2_len > max_len){
		msArea($("#send_content"), max_len);
	}	
}

function init_push_content(obj){
	if ($(obj).attr('data-id') == 1){
		$("#send_content").val('').parent().parent().parent().show();
		var max_len = 640;
		if ($("#theways_list li[class='cur']").attr('data-id') == 2){
			max_len = 240;
		}
		$("#send_content").next().text(max_len).next().text(max_len);
	} else {
		$("#send_content").parent().parent().parent().hide();
	}	
}