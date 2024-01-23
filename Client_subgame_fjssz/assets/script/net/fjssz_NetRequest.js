/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package NetRequest.js
 *  @todo: 发送接收http
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
 * 类方法定义
 */
var sss_NetRequest = app.BaseClass.extend({

	Init:function(){
		this.JS_Name = app.subGameName + "_NetRequest";
	},


	/**
	 * 发送HTTP请求
	 * * @param requestType POST or GET
	 */
	SendHttpRequest:function(serverUrl, argString, requestType, sendPack){

		var url = [serverUrl, argString].join("")

	 	var dataStr = JSON.stringify(sendPack);
	 	let timeOut=false;
		//每次都实例化一个，否则会引起请求结束，实例被释放了
		var httpRequest = new XMLHttpRequest();
		httpRequest.timeout = 3000;
		httpRequest.open(requestType, url, true);
		//服务器json解码
		httpRequest.setRequestHeader("Content-Type", "application/json");
		//httpRequest.setRequestHeader("Content-Length", dataStr.length);

		//['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventname) {
		//	httpRequest["on" + eventname] = function () {
		//		cc.log("\nEvent : " + eventname);
		//	}
		//});

		var that = this;
		httpRequest.onerror = function(){
			that.ErrLog("httpRequest.error:%s", url);
			app[app.subGameName + "_NetManager"]().OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
		};
		httpRequest.ontimeout = function(){
			timeOut=true;
            app[app.subGameName + "_NetManager"]().OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
        };
		httpRequest.onreadystatechange = function(){
			if(timeOut==true){
				return;
			}
			//执行成功
			if (httpRequest.status == 200){
				if(httpRequest.readyState == 4){
					app[app.subGameName + "_NetManager"]().OnReceiveHttpPack(serverUrl, httpRequest.responseText);
				}
			}
			else{
				app[app.subGameName + "_NetManager"]().OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
				that.ErrLog("onreadystatechange(%s,%s)", httpRequest.readyState, httpRequest.status);
			}
		};
		httpRequest.send(dataStr);
		
	},


})



//定义一个全局http
var g_sss_httpRequest = null 


/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
    if(!g_sss_httpRequest){
        g_sss_httpRequest = new sss_NetRequest();
    }
    return g_sss_httpRequest;
}