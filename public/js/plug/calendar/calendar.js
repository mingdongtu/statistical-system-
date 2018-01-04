/**
 * 日期空间
 * @date 2016-02-19
 *  use: 
 *    jquery.js
 *    tools.js
 *    calendar.js
 *    example:$.calendar({elem:"#time"})
 */
(function ($) {
    $.extend({
        calendar: function (init) {
            $.require("/js/require.js");
            require(["/js/laydate.js"], function () {
                var config = {
                    elem: '#time', //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
                    event: 'focus', //响应事件。如果没有传入event，则按照默认的click
                    format: 'YYYY/MM/DD hh:mm:ss',
                    min: laydate.now(), //设定最小日期为当前日期
                    max: '2099-06-16 23:59:59', //最大日期
                    istime: true,
                    istoday: true,
                    choose: function (datas) {

                    },
                    clear: function () {
                    }
                }
                if (init) {
                    config = $.extend(config, init);
                }
                laydate(config);
            });
        }
    });
})(jQuery);


