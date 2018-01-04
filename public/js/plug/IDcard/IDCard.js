/**
 * 身份证读卡器
 */
var IDcard = {
    msg:{code:1,'msg':''},
    init:function(){
        var card = this.getObj();
        if(card){
            this.read(card);
        }
        return this.msg;
    },
    getObj: function () {       //获取card对象
        if(!this.isIE()){
            this.msg.code =-5;
            this.msg.msg = '请使用ie浏览器！';
            return false;
        }
        if (window.ActiveXObject){
            var card = new ActiveXObject("IDRCONTROL.IdrControlCtrl.1");
        }else{
            var objCard = document.getElementById("card");
            var card = objCard;
            if (objCard.object == null) {
                this.msg.code =-6;
                this.msg.msg = '未检测到读卡器插件！';
                return false;
            }
        }
        return card;
    },
    read: function (card) {
        var photoPath = "c:\\card\\"; //头像保存路径
        var flag = card.ReadCard(1001, photoPath);
        switch (flag)
        {
            case 1:		//正确
                this.msg.msg = 'success';
                this.msg.data = {
                    name:card.GetName(),//姓名
                    sex:card.GetSexN(),//性别
                    folk:card.GetFolk(),//名族
                    birthYear:card.GetBirthYear(),//生日 年
                    birthMonth:card.GetBirthMonth(),//生日 月
                    birthDay:card.GetBirthDay(), // 生日 日
                    address:card.GetAddress(),   //地址
                    agency:card.GetAgency(), //发证机关
                    ID:card.GetCode(),     //身份证号
                    base64_image:card.GetPhotobuf(), //jpg图片base64编码
                    image:photoPath+"photo.jpg"
                };
                break;
            case -1:
                this.msg.msg = '初始化端口失败！';
                break;
            case -2:
                this.msg.msg = "认证失败（请重新将卡放到读卡器）";
                break;
            case -3:
                this.msg.msg = "读取数据失败";
                break;
            case -4:
                this.msg.msg = "生成照片文件失败（请检查设定路径和磁盘空)";
                break;
        }
        this.msg.code = flag;
        card.CloseComm();
        return flag;
    },
    getCard:function(callback){
        setInterval(function(){
            var msg = IDcard.init();
            callback(msg);
        },1000);
    },
    isIE: function () {
        if (window.ActiveXObject || "ActiveXObject" in window)
            return true;
        else
            return false;
    }
}

