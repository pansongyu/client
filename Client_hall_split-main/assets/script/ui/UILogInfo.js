/*
    UILogInfo log信息界面
*/
var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        TextLabel:cc.Label,
    },

    //初始化
    OnCreateInit:function(){
        this.LogManager = app.Client.LogManager;

        //一次最多取多少条信息显示
        this.MaxLogCount = 50;

    },


    OnShow:function(){
        let msgList = this.LogManager.GetLogMsgList(this.MaxLogCount);
        let count = msgList.length;

        let logTypeList = this.InitPrintLogType();

        let messageList = null;
        let index = 0;
        let message = 0;
        let logType = 0;
	    let logId = 0;

	    let allContent = "";
        for(index=0; index<count; index++){
            messageList = msgList[index];
            message = messageList[0];
            logType = messageList[1];
            if(logTypeList.indexOf(logType) != -1){
                logId = messageList[2];
                allContent += ["[", logId, "]", message,"\n"].join("");
            }
        }

	    this.TextLabel.string = allContent;
    },

    InitPrintLogType:function () {
        let logTypeList = [];
        let log = this.GetWndComponent("log",cc.Toggle).isChecked;
        let error = this.GetWndComponent("error",cc.Toggle).isChecked;
        let sys = this.GetWndComponent("sys",cc.Toggle).isChecked;
        let warn = this.GetWndComponent("warn",cc.Toggle).isChecked;
        if(log){
            logTypeList.push("log");
        }
        if(error){
            logTypeList.push("error");
        }
        if(sys){
            logTypeList.push("info");
        }
        if(warn){
            logTypeList.push("warn");
        }
        return logTypeList;
    },
    //-------------回掉函数----------------

    //---------点击函数---------------------

    OnClick:function(btnName, eventData){
        this.Log(btnName);
        if(btnName == "btn_clear"){
            this.Click_btn_clear();
        }
        else if(btnName == "log" || btnName == "error" || btnName == "sys" || btnName == "warn"){
            this.OnShow();
        }
        else{
            this.ErrLog("OnClick:%s not find", btnName);
        }
    },

    Click_btn_clear:function(){
		this.ClearShowLog();
    },

	ClearShowLog:function(){
        this.OnShow();
	},


});
