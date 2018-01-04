var pagenum = 10;//每页数量
var las = 1;
function GoDoctorPage() {
	var pagestr = $("#txtpage").val();
	if (pagestr == "" || pagestr == 0) {
		pagestr = "1";
	} else {
		if (pagestr < 1)
			pagestr = 1;
	}
	pagestr=pagestr*1;
	funpage(pagestr);
}

function fenyeinfo(all) {
	if (all > 0) {
		las = parseInt(all / pagenum);
		if (all % pagenum != 0)
			las++;
	}
	else
		las=0;
	
	$(".page-box em").html("/共"+las+"页，"+all+"条");
	//alert(las+"======"+all+"-----"+pagenum);
	//中间数据
	//<span>1</span><a href="javascript:funpage(2);">2</a>
	if (las > 6) {
		var NumStr = "";
		if (las - page >= 6) {
			if (page > 1) {
				NumStr += "<a href=\"javascript:funpage(" + (page - 1).toString() + ");\">" + (page - 1).toString() + "</a>";
			}
			NumStr += "<span>" + page + "</span>";
			NumStr += "<a href=\"javascript:funpage(" + (page + 1).toString() + ");\">" + (page + 1).toString() + "</a>";
			NumStr += "...";
			for (var num = 3; num > 0; num--) {
				NumStr += "<a href=\"javascript:funpage(" + (las - num).toString() + ");\">" + (las - num).toString() + "</a>";
			}
		} else {
			var jian = 0;
            if (page == (las - 5))
                jian = 1;
            
            for (var i = las - 5-jian; i <= las; i++) {
				if (i == page) {
					NumStr += "<span>" + i + "</span>";
				}else if((i - (page - 1)) == 3 && i + 3 == las) {
					NumStr += "...";
				}
				else {
					NumStr += "<a href=\"javascript:funpage(" + i + ");\">" + i + "</a>";
				}
			}
			
		}
		$(".page-box b").html(NumStr);
	} else {
		var NumStr = "";
		for (var num = 1; num <= las; num++) {
			if (num == page) {
				NumStr += "<span>" + num + "</span>";
			}
			else {
				NumStr += "<a href=\"javascript:funpage(" + num + ");\">" + num + "</a>";
			}
		}
		$(".page-box b").html(NumStr);
	}
	//上一页 
	if (page == 1 || page < 1) {
		$(".page-prev").css("cursor", "default");
	} else {
		$(".page-prev").attr("style","")
	}
	if (page == las || page > las) {
		$(".page-next").css("cursor", "default");
	} else {
		$(".page-next").attr("style", "")
	}
	//$(".lastpage").click(function (e) {lastpage();});
}

function prevpage() {
	if (page > 1) {
		if (page - 1 == 1 || page - 1 < 1) {
			$(".page-prev").css("cursor", "default");
			//$(".page-next").css("cursor", "default");
		}
		funpage(page - 1);

	}
}
function nextpage() {
	if (page < las) {
		if (page + 1 == las || page +1 > las) {
			$(".page-next").css("cursor", "default");
			//$(".page-prev").css("cursor", "default");
		}
		funpage(page + 1);
	}
}
function lastpage() {
	funpage(las);
}