/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package SysNotifyManager.js
 *  @todo: 系统通知模块
 *  
 *  @author hongdian
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *  
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *  
 */
var app = require("nn_app");

/**
 * 类构造
 */
var nn_SysNotifyManager = app.BaseClass.extend({
	
	/**
	 * 初始化
	 */
	Init:function(){

		this.JS_Name = app["subGameName"] + "_SysNotifyManager";
		
		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
		this.NewSysMsg = this.SysDataManager.GetTableDict("NewSysMsg");

		this.ComTool = app[app.subGameName + "_ComTool"]();
		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();

		//缓存的正则表达式字典
		this.regExpDict = {};

		app[app.subGameName + "_NetManager"]().RegNetPack("S1010_SystemMessage", this.OnPack_ServerSysMsg, this);
		
	},


	//-----------------------回调函数-----------------------------
	/**
	 * 接收封包
	 */
	OnPack_ServerSysMsg:function(serverPack){
		//系统提示码
		let msgID = serverPack.key;
		let argList = serverPack.p||[];

		let count = argList.length;
		let msgArgList = [];
		for(let index=0; index<count; index++){

			let data = argList[index];

			if(data["StringValue"]){
				msgArgList.push(data["StringValue"]);
			}
			else{
				msgArgList.push(data["IntValue"]);
			}
		}

		this.ShowSysMsg(msgID, msgArgList);

		app[app.subGameName + "Client"].OnEvent("ServerSysMsg", {"MsgID":msgID, "MsgArgList":msgArgList});
	},

	//-----------------------获取函数-----------------------------

	//获取系统提示文本
	GetSysMsgContentByMsgID:function(msgID, paramList){

		if(!paramList){
			paramList = [];
		}
		//如果查找不到系统提示码,则为纯文本弹框提示直接播放不解码
		if(!this.NewSysMsg.hasOwnProperty(msgID)){
			console.error("GetSysMsgContentByMsgID(%s) NewSysMsg.txt not find", msgID);
			return ""
		}
		let msgInfo = this.NewSysMsg[msgID];
		let msgContent = msgInfo['Content'];

		return this.TranslateMsgContent(msgContent, paramList);

	},

	/**
	 * 替换消息文本
	 * @param msgID 消息ID
	 * @return 无返回值
	 * @remarks 
	 */
	TranslateMsgContent:function(msgContent, paramList){

		let count = paramList.length;

		// 替换文本
		for(let index=0; index<=count; index++){

			let param = paramList[index];
			let argIndex = index + 1;
			let regExpObj = null;


			let regKeyString = this.ComTool.StringAddNumSuffix("S", argIndex, 1);
			if(msgContent.indexOf(regKeyString) != -1){

				if(this.regExpDict.hasOwnProperty(regKeyString)){
					regExpObj = this.regExpDict[regKeyString];
				}
				else{
					regExpObj = new RegExp("{" + regKeyString + "}", "g");
					this.regExpDict[regKeyString] = regExpObj
				}
				msgContent = msgContent.replace(regExpObj, param);
			}
		}

		return msgContent
	},
	
	/**
	 * 显示系统提示
	 * @param msgID
	 */
	ShowSysMsg:function(msgID, msgArgList=[]){
		let msgContent = "";
		let msgPos = 0;
		//如果查找不到系统提示码,则为纯文本弹框提示直接播放不解码
		if(this.NewSysMsg.hasOwnProperty(msgID)){
			let msgInfo = this.NewSysMsg[msgID];
			msgPos = msgInfo["Pos"];

			msgContent = msgInfo['Content'];
			msgContent = this.TranslateMsgContent(msgContent, msgArgList);
		}
		else{
			msgPos = 4;
			msgContent = msgID;
		}


		//出现位置 1系统广播(不允许主动调用这种类型,只能又聊天系统频道下发)
		if(msgPos == 1){
			console.error("ShowSysMsg(%s) error", msgID);
		}
		//只触发事件不显示提示,由事件自己决定(服务端下发客户端弹2次确认框等待点击)
		else if(msgPos == 2){

		}
		//浮动提示
		else if(msgPos == 3){
			app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIMessage_Drift", msgID, msgArgList, msgContent);
		}
		//"确定" 弹框提示
		else if(msgPos == 4){
			app[app.subGameName + "_FormManager"]().ShowForm(app.subGameName + "_UIMessage", "OnSys", this.ShareDefine.ConfirmOK, msgID, msgArgList, msgContent);

		}
		//"是","否"" 弹框提示
		else if(msgPos == 5){
			let ConfirmManager = app[app.subGameName+"_ConfirmManager"]();
			ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
			ConfirmManager.ShowConfirm(this.ShareDefine.ConfirmYN, msgID, msgArgList)
		}
		else{
			console.error("ShowSysMsg(%s) msgPos(%s) error", msgID, msgPos);
		}
	},

    OnConFirm:function(clickType, msgID, backArgList){
    	if(clickType == "Sure"){
    		// console.log("打开客服QQ");
    	}
    },

})


var g_nn_SysNotifyManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	if(!g_nn_SysNotifyManager)
		g_nn_SysNotifyManager = new nn_SysNotifyManager();
	return g_nn_SysNotifyManager;
	
}
