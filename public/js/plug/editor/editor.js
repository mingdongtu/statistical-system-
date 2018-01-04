/**
 * 编辑器
 * use tools.js
 *   example: $.kindeditor(obj);
 */
(function ($) {
    $.extend({
        /**
         * kind编辑器
         * @param {type} obj  初始化对象
         * @param {type} width  宽度
         * @param {type} height 高度
         * @param {type} word_count_selector_id  限制字数节点
         * @param {type} upload_flash
         * @param {type} upload_media
         * @param {type} upload_file
         * @returns {undefined}
         *       use
         *        $.kindeditor($("#content"),'700','300',"word");
         */
        kindeditor: function (obj, width, height, word_count_selector_id, upload_flash, upload_media, upload_file) {
            $.require("/js/editor/kindeditor.js");
            var eobj = obj;
            var eupload_flash = typeof upload_flash == 'undefined' ? false : upload_flash;
            var eupload_media = typeof upload_media == 'undefined' ? false : upload_media;
            var eupload_file = typeof upload_file == 'undefined' ? false : upload_file;
            var width = typeof width == 'undefined' ? '700' : width;
            var height = typeof height == 'undefined' ? '300' : height;
            var minWidth = '650px';
            if (-1 == width.indexOf('%')) {
                if (parseInt(width) < 650)
                    minWidth = width + 'px';
                width += 'px';
            }
            var items = ['undo', 'redo', '|', 'preview', 'template', 'cut', 'copy', 'paste',
                'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
                'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                'superscript', 'clearhtml', 'quickformat', 'selectall', '/',
                'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage'
            ];
            if (true == eupload_flash)
                items.push('flash');

            if (true == eupload_media)
                items.push('media');

            if (true == eupload_file)
                items.push('insertfile');

            var tmp_items = ['table', 'hr', 'emoticons', 'baidumap', 'pagebreak', 'anchor', 'link', 'unlink'];
            for (index in tmp_items) {
                items.push(tmp_items[index]);
            }
            var wordCount = typeof word_count_selector_id == 'undefined' || word_count_selector_id == '' || word_count_selector_id == null ? '' : word_count_selector_id;

            //KindEditor.ready(function(K) {
            window.editor = KindEditor.create(obj, {
                uploadJson: '/index.php/editor_upload/uploadKindEditor',
                fileManagerJson: '/index.php/editor_upload/kindEditorManage',
                allowFileManager: true,
                resizeType: 1,
                pasteType: 1, //只允许粘贴纯文本
                width: width,
                minWidth: minWidth,
                height: height + 'px',
                allowFlashUpload: eupload_flash,
                allowMediaUpload: eupload_media,
                allowFileUpload: eupload_file,
                items: items,
                basePath:"/js/editor/",
                afterChange: function () {
                    if (typeof $('#' + wordCount).html() != null) {
                        var cur_count = this.count('text');
                        var max_content = 5000;
                        if (cur_count > max_content) {
                            //KindEditor($('#'+wordCount)).html('&nbsp;<font color="red">你当前已超出'+(parseInt(cur_count) - max_content)+'个字符</font>');
                            window.editor.html(window.editor.text().substr(0, max_content));
                        } else {
                            KindEditor($('#' + wordCount)).html('&nbsp;你当前已输入' + cur_count + '个字符, 还可以输入<font color="red">' + (max_content - parseInt(cur_count)) + '</font>个字符');
                        }
                    }
                }
            });
        }
    })
})(jQuery)

