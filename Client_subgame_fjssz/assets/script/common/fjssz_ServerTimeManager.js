/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package ServerTimeManager
 *  @todo: 服务器时间同步
 *  
 *  @author hongdian
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *  
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *  
 */
var app = require("fjssz_app");

/**
 * 构造
 */
var ServerTimeManager = app.BaseClass.extend({
	
	/**
	 * 初始化
	 */
	Init:function(){
		this.JS_Name = "ServerTimeManager";

		this.ShareDefine = app[app.subGameName+"_ShareDefine"]();
		this.ComTool = app[app.subGameName+"_ComTool"]();

		this.Reload();

		// this.Log("create ServerTimeManager.js");
	},

	/**
	 * 重登
	 */
	Reload:function(){
		//收到服务器时间的客户端tick
		this.syncServerDataTimeTick = 0;
		//收到的服务器时间豪秒形式值
		this.serverIntMsTime = 0;
		//收到服务器时间的 Date时间形式
		this.serverDataTime = new Date();
		//收到账号服务器登陆token的客户端tick
		this.logInGameTick = 0;
		//收到服务器首次开服时间
		this.serverStartTime = 0;
	},

	//--------------收包---------------------
	/**
	 * 接收封包
	 */
	InitLoginData:function(serverPack){
		this.SetServerTime(serverPack["time"]);
		this.SetServerStartTime(serverPack["startServerTime"]);
	},
	

	//---------------设置接口------------------------


	/**
	 * 设置服务器时间
	 */
	SetServerTime:function(curServerTick){

		let curDate = new Date();
		let nowTick = curDate.getTime();

		this.serverIntMsTime = curServerTick;
		this.serverDataTime.setTime(this.serverIntMsTime);
		this.syncServerDataTimeTick = nowTick;

		return this.serverDataTime

	},

	/**
	 * 设置服务器首次开服时间
	 */
	SetServerStartTime:function(startTime){
		this.serverStartTime = startTime;
	},

	//-------------获取接口---------------------------
	/**
	 * 获取服务器时间类型
	 */
	GetServerTimeData:function(getType){
		if (!this.serverIntMsTime){
			return 0;
		}

		let curNowTime = new Date().getTime();

		let curDate = this.GetServerTimeByTimeTick(this.serverIntMsTime + curNowTime - this.syncServerDataTimeTick);

		// 星期（0为周日）
		if (getType == this.ShareDefine.GetServerWeek){
			return curDate.getDay();
		}
		// 小时（0到23）
		else if(getType == this.ShareDefine.GetServerHours){

			return curDate.getHours();
		}
		// 分钟（0到59）
		else if(getType == this.ShareDefine.GetServerMinSec){

			return curDate.getMinutes();
		}
		// 秒（0到59）
		else if(getType == this.ShareDefine.GetServerSec){

			return curDate.getSeconds();
		}
		// 年
		else if(getType == this.ShareDefine.GetServerYear){

			return curDate.getFullYear();
		}
		// 月（0表示一月，11表示十二月）
		else if(getType == this.ShareDefine.GetServerMonth){

			return curDate.getMonth();
		}
		// 日（1到31）
		else if(getType == this.ShareDefine.GetServerDay){

			return curDate.getDate();
		}

		else if(getType == this.ShareDefine.GetServerDate){

			return curDate;
		}
		else if(getType == this.ShareDefine.GetServerDateString){

			let year = this.ComTool.StringAddNumSuffix("", curDate.getFullYear(), 4);
			let month = this.ComTool.StringAddNumSuffix("", curDate.getMonth() + 1, 2);
			let day = this.ComTool.StringAddNumSuffix("", curDate.getDate(), 2);
			let hour = this.ComTool.StringAddNumSuffix("", curDate.getHours(), 2);
			let min = this.ComTool.StringAddNumSuffix("", curDate.getMinutes(), 2);
			let second = this.ComTool.StringAddNumSuffix("", curDate.getSeconds(), 2);

			//20160101231701
			return [year, month, day, hour, min, second].join("");
		}
		// 服务器当前毫秒数(不需要转化为本地时间,只是一个整数值,与其他服务器时间整数值比较大小用)
		else{

			return this.serverIntMsTime + (curNowTime - this.syncServerDataTimeTick)
		}


	},

	/**
	 * 更加时间字符串获取服务器时间毫秒值 2016-1-18 -> 1454234400000
	 */
	GetServerTimeByTimeString:function(timeString){
		let dateList = timeString.split("-");
		if(dateList.length != 3){
			console.error("GetServerTimeByTimeString dateList(%s) error", dateList);
			return 0
		}
		return Date.parse([dateList[1], dateList[2], dateList[0]].join("/")) - new Date().getTimezoneOffset() * 60 * 1000 - 8 * 60 * 60 * 1000;
	},

	/**
	 * 通过毫秒整数获取服务器对应时间对象 1454234400000 - > Date()
	 */
	GetServerTimeByTimeTick:function(tick){
		//创建一个本地时间对象
		let nowDate = new Date();

		//计算服务器对应的时间tick 需要加上时区查
		let curNowTime = tick + nowDate.getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000;

		//加上时区查后生成的时间对象才是和服务器时间同步的对象
		return new Date(curNowTime);
	},

	/**
	 * 获取当前时间字符串格式
	 * @returns {String} 2014-11-06
	 */
	GetDateTickToTimeStr:function(tick){

		var myDate = this.GetServerTimeByTimeTick(tick);

		var year = myDate.getFullYear();
		var month = myDate.getMonth() + 1;
		var day = myDate.getDate();

		var dateString = [this.ComTool.StringAddNumSuffix("", year, 4), this.ComTool.StringAddNumSuffix("", month, 2), this.ComTool.StringAddNumSuffix("", day, 2)].join("-");

		return dateString
	},

	/**
	 * 获取指定点数对应的服务器时间tick值
	 */
	GetServerTimeTickByTime:function(hour, min, sec){

		if(!min){
			min = 0;
		}

		if(!sec){
			sec = 0;
		}
		let curDate = this.GetServerTimeData(this.ShareDefine.GetServerDate);
		//设置为0点时间
		curDate.setHours(hour, min, sec, 0);
		//this.Log("GetServerTimeTickByTime {1}-{2}-{3} {4}:{5}:{6},{7}", curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), curDate.getHours(),curDate.getMinutes(),curDate.getSeconds(), curDate.getDay());

		return Math.floor(curDate.getTime()) - new Date().getTimezoneOffset() * 60 * 1000 - 8 * 60 * 60 * 1000;
	},

	/**
	 * 获取服务器首次开服时间
	 */
	GetServerStartTime:function(getType){

		let curDate = this.GetServerTimeByTimeTick(this.serverStartTime);

		//this.Log("{1}-{2}-{3} {4}:{5}:{6},{7}", curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), curDate.getHours(),curDate.getMinutes(),curDate.getSeconds(), curDate.getDay());

		// 星期（0为周日）
		if (getType == this.ShareDefine.GetServerWeek){
			return curDate.getDay();
		}
		// 小时（0到23）
		else if(getType == this.ShareDefine.GetServerHours){

			return curDate.getHours();
		}
		// 分钟（0到59）
		else if(getType == this.ShareDefine.GetServerMinSec){

			return curDate.getMinutes();
		}
		// 秒（0到59）
		else if(getType == this.ShareDefine.GetServerSec){

			return curDate.getSeconds();
		}
		// 年
		else if(getType == this.ShareDefine.GetServerYear){

			return curDate.getFullYear();
		}
		// 月（0表示一月，11表示十二月）
		else if(getType == this.ShareDefine.GetServerMonth){

			return curDate.getMonth();
		}
		// 日（1到31）
		else if(getType == this.ShareDefine.GetServerDay){

			return curDate.getDate();
		}

		else if(getType == this.ShareDefine.GetServerDate){

			return curDate;
		}
		// 服务器当前毫秒数(不需要转化为本地时间,只是一个整数值,与其他服务器时间整数值比较大小用)
		else{

			return this.serverStartTime;
		}

	},

	//-------------------操作接口----------------------------

	/**
	 * 转换tick为时分秒字符串
	 */
	TickToStr : function(tick, showType){

		if(tick < 0){
			tick = 0;
		}
		let dayTick = 24*3600*1000;
		let dayNum = parseInt(tick /dayTick);
		let hourNum = parseInt((tick - tick /dayTick - dayNum*dayTick)/ (3600*1000));

        let Second = parseInt(tick / 1000);
		let intervalMinSec = (tick - hourNum * (3600*1000));
		let min = parseInt(intervalMinSec / (60 * 1000))
		let intervalSec = (intervalMinSec - min * (60*1000))
		let sec = parseInt(intervalSec / 1000)

		hourNum = this.ComTool.StringAddNumSuffix("", hourNum, 2);
		min = this.ComTool.StringAddNumSuffix("", min, 2);
		sec = this.ComTool.StringAddNumSuffix("", sec, 2);

		let showStr = "";
		if (showType == this.ShareDefine.ShowDayHour){
			if(dayNum){
				showStr = this.ComTool.StringReplace("{1}天{2}小时", [dayNum, hourNum]);
			}
			else{
				showStr = this.ComTool.StringReplace("{1}:{2}:{3}", [hourNum, min, sec]);
			}
		}
		else if (showType == this.ShareDefine.ShowHourMinSec){
			showStr = this.ComTool.StringReplace("{1}:{2}:{3}", [hourNum, min, sec]);
		}
		else if(showType == this.ShareDefine.ShowMinSec){
			showStr = this.ComTool.StringReplace("{1}:{2}", [min, sec]);
		}
		else if(showType == this.ShareDefine.ShowSec){
			showStr = this.ComTool.StringReplace("{1}", [sec]);
		}
		else if(showType == this.ShareDefine.ShowSecondSec){
            showStr = this.ComTool.StringReplace("{1}", [Second]);
		}
		// else if(showType == this.ShareDefine.YearMonthDayHourMinuteSecond){
         //    showStr = this.ComTool.StringReplace("{1}/{2}/{3} {4}:{5}:{6}", [Year, Month, Day, Hour, Minute,Second]);
		// }
		else{
			showStr = this.ComTool.StringReplace("{1}:{2}:{3}", [hourNum, min, sec]);
		}
		return showStr
	},

	/**
	 * 获取已过时间的字符串
	 * @param {Number} passSec 已过去秒数
	 * @returns {String} 优先顺序：几天前、几小时前、几分钟前、几秒前
	 * @remarks {}
	 */
	GetPassTimeStr:function(passTick){

		if(isNaN(passTick)){
			ErrLog("GetPassTimeStr passSec(%s) is NaN ", passSec);
			return "0";
		}
		if(passTick <= 0){
			return this.ComTool.StringReplace(this.BeforeSec_Str, [1]);
		}

		// 几天前 24*60*60*1000 = 86400000
		let value = Math.floor(passTick/86400000);
		if(value){
			return app.i18n.t("BeforeDay_Str", {"Value":value});
		}
		// 几小时前 60*60*1000 = 3600000
		value = Math.floor(passTick/3600000);
		if(value){
			return app.i18n.t("BeforeHour_Str", {"Value":value});
		}

		// 几分钟前 60*1000
		value = Math.floor(passTick/60000);
		if(value){
			return app.i18n.t("BeforeMinute_Str", {"Value":value});
		}

		// 几秒前
		return app.i18n.t("BeforeSec_Str", {"Value":Math.floor(passTick/1000)});
	},

	//获取结束tick相对服务器时间的倒计时
	GetCDTimeString:function(endTick, showType){
		let serverTimeTick = this.GetServerTimeData();
		let remainTick = endTick - serverTimeTick;
		if(remainTick <= 0){
			return "00:00:00";
		}

		//默认没传的话返回00:00:00格式
		if(!showType){
			showType = this.ShareDefine.ShowHourMinSec;
		}

		return this.TickToStr(remainTick, showType);
	},

	//获取结束sec相对的服务器倒计时
	GetCDTimeStringBySec:function(endSec, showType){
		return this.GetCDTimeString(endSec*1000, showType);
	},

	/**
	 * 获取毫秒数相对当前服务器时间剩余多少时间到期
	 * @param {Number} timeTick 毫秒数
	 * @returns {String} 优先顺序：剩余几天、剩余几时、剩余几分、剩余几秒,已过期
	 * @remarks {}
	 */
	GetRemainTimeStr:function(timeTick){
		let serverTimeTick = this.GetServerTimeData();
		let remainTick = timeTick - serverTimeTick;

		if(remainTick <= 0){
			return 0;
		}

		// 几天前 24*60*60*1000 = 86400000
		let value = Math.floor(remainTick/86400000);
		if(value){
			return app.i18n.t("RemainDay", {"Value":value});
		}
		// 几小时前 60*60*1000 = 3600000
		value = Math.floor(remainTick/3600000);
		if(value){
			return app.i18n.t("RemainHour", {"Value":value});
		}

		// 几分钟前 60*1000
		value = Math.floor(remainTick/60000);
		if(value){
			return app.i18n.t("RemainMin", {"Value":value});
		}

		// 几秒前
		return app.i18n.t("RemainSec", {"Value":Math.floor(remainTick/1000)});
	},

})

var g_ServerTimeManager = null;

/**
 * 获取单例
 * @returns {ServerTimeManager}
 */
exports.GetModel = function(){
	if (!g_ServerTimeManager)
		g_ServerTimeManager = new ServerTimeManager()

	return g_ServerTimeManager
	
}
