/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        LabelMessage:cc.RichText,
        LabelCancel:cc.Label,
        LabelSure:cc.Label,
        BtnCancel: cc.Button,
        BtnSure:cc.Button,
        BtnClose:cc.Button,
    },

    //初始化
    OnCreateInit:function(){
        this.ShareDefine = app.ShareDefine();
        
        this.msgInfoList = [];
        this.MaxMsgCount = 1;

        this.confirmType = 0;

        this.CancelPos = cc.v2(-131,-185);
        this.SurePos = cc.v2(131,-185);

        //单个确定按钮坐标
        this.SingSurePos = cc.v2(0, -185);

        this.SysNotifyManager = app.SysNotifyManager();

        this.isShowingMsg = false;

        this.lbSure = "";
        this.lbCancle = "";
    },

    //---------显示函数--------------------

    OnShow:function(eventType, confirmType, msgID, msgArgList, content, lbSure="", lbCancle=""){
        this.lbSure = lbSure;
        this.lbCancle = lbCancle;

        if(this.msgInfoList.length >= this.MaxMsgCount){
            this.ErrLog("OnShow msgInfoListCount(%s) is max", this.msgInfoList.length, msgID);
        }
        else{
            this.msgInfoList.push([confirmType, msgID, msgArgList, content]);
        }

        //如果正在显示系统提示,则不调用更新接口
        //if(!this.isShowingMsg){
            this.ShowMsgInfo();
        //}
        this.node.setPosition(cc.v2(0,0));
    },

    ShowMsgInfo:function(){
        if (!this.msgInfoList.length){
            this.Log("msgInfoList is empty");
            return;
        }

        this.isShowingMsg = true;

        let tempList = this.msgInfoList.shift();
        this.confirmType = tempList[0];
        let msgID = tempList[1];
        let params = tempList[2];
        let msgContent = tempList[3];

        this.BtnClose.node.active = false;

        this.LabelMessage.string = msgContent;

        //以下根据不同类型改变窗体、控件位置
        //有确定、取消按钮
        if(this.confirmType == this.ShareDefine.Confirm){

	        if(this.LabelCancel){
		        this.LabelCancel.string = app.i18n.t("Cancel");
	        }
            this.BtnCancel.node.setPosition(this.CancelPos);
            this.BtnCancel.node.active = true;

	        if(this.LabelSure){
		        this.LabelSure.string = app.i18n.t("Sure");
	        }
            this.BtnSure.node.setPosition(this.SurePos);
            this.BtnSure.node.active = true;

        }
        //有是、否按钮
        else if(this.confirmType == this.ShareDefine.ConfirmYN){//有确定按钮
	        if(this.LabelCancel){
		        this.LabelCancel.string = app.i18n.t("No");
	        }
            this.BtnCancel.node.setPosition(this.CancelPos);
            this.BtnCancel.node.active = true;

	        if(this.LabelSure){
		        this.LabelSure.string = app.i18n.t("Yes");
	        }
            this.BtnSure.node.setPosition(this.SurePos);
            this.BtnSure.node.active = true;

        }else if(this.confirmType==this.ShareDefine.ConfirmFamily){
            if(this.LabelCancel){
                this.LabelCancel.string = app.i18n.t("Cancel");
            }
            this.BtnCancel.node.setPosition(this.CancelPos);
            this.BtnCancel.node.active = true;

            if(this.LabelSure){
                this.LabelSure.string = app.i18n.t("GoTo");
            }
            this.BtnSure.node.setPosition(this.SurePos);
            this.BtnSure.node.active = true;
        }

        //购买,前往
        else if(this.confirmType == this.ShareDefine.ConfirmBuyGoTo){
	        if(this.LabelCancel){
		        this.LabelCancel.string = app.i18n.t("Cancel");
	        }
            this.BtnCancel.node.setPosition(this.CancelPos);
            this.BtnCancel.node.active = true;

	        if(this.LabelSure){
		        this.LabelSure.string = app.i18n.t("GoTo");
	        }
            this.BtnSure.node.setPosition(this.SurePos);
            this.BtnSure.node.active = true;

        }
        //就一个确定, 需要设置控件坐标
        else if(this.confirmType == this.ShareDefine.ConfirmOK){
            this.BtnCancel.node.active = false;
	        if(this.LabelSure){
		        this.LabelSure.string = app.i18n.t("Sure");
	        }else{
                this.LabelCancel.string="确定";
            }
            this.BtnSure.node.setPosition(this.SingSurePos);
            this.BtnSure.node.active = true;

        }
        //外部自己传按钮文字
        else if(this.confirmType == this.ShareDefine.ConfirmDIY){
            if(this.LabelCancel){
                this.LabelCancel.string = this.lbCancle;
            }
            this.BtnCancel.node.setPosition(this.CancelPos);
            this.BtnCancel.node.active = true;

            if(this.LabelSure){
                this.LabelSure.string = this.lbSure;
            }
            this.BtnSure.node.setPosition(this.SurePos);
            this.BtnSure.node.active = true;

            this.BtnClose.node.active = true;
        }

        else{
            this.isShowingMsg = false;
            this.ErrLog("OnShow msgType(%s) error", this.confirmType);
            return;
        }

    },

    OnClose:function(){
        this.isShowingMsg = false;
    },

    //---------点击函数---------------------

	OnClick:function(btnName, eventData){

		if(btnName == "btnSure"){
			this.AfterOnClick("Sure");
		}
		else if(btnName == "btnCancel"){
			this.AfterOnClick("Cancel");
		}else if(btnName == "btn_close"){
            this.CloseForm();
        }
		else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},

    /**
     * 点击确定
     */
    AfterOnClick:function(eventType){

        this.CloseForm();

	    this.ConfirmManager.OnConFirmResult(eventType);

        // 如果还有消息则继续显示
        if(this.msgInfoList.length){
            this.ShowMsgInfo();
        }
    },

});
