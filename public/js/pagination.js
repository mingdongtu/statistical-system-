//分页
var pagination = {
    /**
     * 初始化函数
     * @param obj $pagination 存放分页html的对象
     * @param function callback 回调函数
     */
    init: function($pagination, callback, total, size, now_page, is_show_button) {
        size = size || 10;
        now_page = now_page || 1;
        is_show_button = is_show_button === undefined ? true : is_show_button;
        this.set($pagination, total, size, now_page, is_show_button);
        $pagination.unbind();
        //page
        $pagination.on('click', '.pagination', function(e) {
            e.preventDefault();
            if (callback) {
                var page = $(this).attr('data');
                callback(page);
                $.pagination.set($pagination, total, size, page, is_show_button);
            }
        });
        //GO 按钮
        $pagination.on('click', '.page-box-btn', function(e) {
            var $input = $(this).siblings('.page-box-input');
			page_go($input);
        });
		//页码输入框回车
		$pagination.on('keydown', '.page-box-input', function(e) {
			if (e.keyCode == "13") {
				var $input = $(this);
				page_go($input);
			}
		});
		function page_go($input) {
            var page = $input.val();
            var reg = /^[1-9](\d+)?$/;
            if (!reg.test(page)) {
                $input.val('');
                $input.focus();
                return false;
            }
            page = parseInt(page);
            var total_page = parseInt($input.data('total_page'));
            var now_page = parseInt($input.data('now_page'));
            if (page > total_page || page == now_page) {
                $input.val('');
                $input.focus();
                return false;
            }
            if (callback) {
                callback(page);
                $.pagination.set($pagination, total, size, page, is_show_button);
            }
		}
    },
    /**
     * 页码html
     * @param int total 总条数
     * @param int size 每页条数
     * @param int now_page 当前页码
     * @return string
     */
    get: function(total, size, now_page, is_show_button) {
        var pagination = '';
		if(window!=window.top){
			common.loading(true);
		}
        if (parseInt(total) <= parseInt(size)) {
            return '共' + (total > 0 ? 1 : 0) + '页，' + total + '条数据';
        }
        now_page = parseInt(now_page);
        /*if(now_page > 1){
        	pagination += '<button type="button" class="firstpage pagination" data="1">&nbsp;</button>';
        	pagination += '<a class="page-prev pagination" href="javascript:" data="'+(now_page - 1)+'">&nbsp;</a>';
        }*/
        if (is_show_button) {
            var prev_class = now_page > 1 ? ' pagination' : '';
            pagination += '<button type="button" class="firstpage' + prev_class + '" data="1">&nbsp;</button>';
            pagination += '<a class="page-prev' + prev_class + '" href="javascript:" data="' + (now_page - 1) + '">&nbsp;</a>';
        }
        var show_page_count = 10;
        var start_page = 1;
        var end_page = show_page_count;
        var total_page = Math.ceil(total / size);
        if (total_page <= show_page_count) {
            end_page = total_page;
        } else {
            var half = Math.floor(show_page_count / 2);
            if (now_page <= half) {
                end_page = show_page_count;
            } else if (now_page > half && now_page <= total_page - half) {
                start_page = now_page - half + 1;
                if (start_page < 1) {
                    start_page = 1;
                }
                end_page = now_page + half;
                if (end_page > total_page) {
                    end_page = total_page;
                }
            } else {
                start_page = total_page - show_page_count + 1;
                end_page = total_page;
            }
        }
        for (var i = start_page; i <= end_page; i++) {
            if (now_page != i) {
                pagination += '<a href="javascript:;" class="pagination" data="' + i + '">' + i + '</a>';
            } else {
                pagination += '<span>' + now_page + '</span>';
            }
        }
        /*if(now_page < total_page){
        	pagination += '<a class="page-next pagination" href="javascript:;" data="'+(now_page + 1)+'">&nbsp;</a>';
        	pagination += '<button type="button" class="lastpage pagination" data="'+total_page+'">&nbsp;</button>';
        }*/
        if (is_show_button) {
            var next_class = now_page < total_page ? ' pagination' : '';
            pagination += '<a class="page-next' + next_class + '" href="javascript:;" data="' + (now_page + 1) + '">&nbsp;</a>';
            pagination += '<button type="button" class="lastpage' + next_class + '" data="' + total_page + '">&nbsp;</button>';
        }
        pagination += '<input type="text" class="page-box-input" data-total_page="' + total_page + '" data-now_page="' + now_page + '">';
        pagination += '<button type="button" class="page-box-btn">&nbsp;</button>';
        pagination += '/共' + total_page + '页，' + total + '条数据';
        return pagination;
    },
    set: function($pagination, total, size, now_page, is_show_button) {
        $pagination.html(this.get(total, size, now_page, is_show_button));
		if(window!=window.top){
			common.loading(false);
		}
    }
};
jQuery.extend({
    pagination: pagination
});