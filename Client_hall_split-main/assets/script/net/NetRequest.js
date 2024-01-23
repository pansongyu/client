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
var app = require('app');

/**
 * 类方法定义
 */
var NetRequest = app.BaseClass.extend({

	Init: function () {
		this.JS_Name = "NetRequest";
		this.Log("create NetRequest");
	},

	/**
	 * 发送HTTP请求
	 * * @param requestType POST or GET
	调用方式：
	app.NetRequest().SendHttpRequest(serverUrl, argString, requestType, sendPack, 3000, 
            (serverUrl, responseText, httpRequest)=>{ // success

            }, 
            (serverUrl, readyState, status, httpRequest)=>{ // fail
                
            },
            (serverUrl, readyState, status, httpRequest)=>{ // timeout

            }, 
            (serverUrl, readyState, status, httpRequest)=>{ // error

            }
        );
    或
        app.NetRequest().SendHttpRequest(serverUrl, argString, requestType, sendPack, 3000, 
            this.OnReceiveHttpPack.bind(this), 
            this.OnConnectHttpFail.bind(this),
            this.OnConnectHttpTimeout.bind(this),
            this.OnConnectHttpError.bind(this),
		);
	 */
	SendHttpRequest: function (serverUrl, argString, requestType, sendPack, timeout = 15000, successCb = null, failCb = null, timeoutCb = null, errorCb = null) {
		this._SendHttpRequest(serverUrl, argString, requestType, sendPack, timeout, successCb, failCb, timeoutCb, errorCb);
	},

	/**
	 * 发送HTTP POST请求
	 */
	SendHttpRequestPost: function (serverUrl, argString, sendPack, timeout = 3000, successCb = null, failCb = null, timeoutCb = null, errorCb = null) {
		this._SendHttpRequest(serverUrl, argString, "POST", sendPack, timeout, successCb, failCb, timeoutCb, errorCb);
	},

	/**
	 * 发送HTTP GET请求
	 */
	SendHttpRequestGet: function (serverUrl, argString, sendPack, timeout = 3000, successCb = null, failCb = null, timeoutCb = null, errorCb = null) {
		this._SendHttpRequest(serverUrl, argString, "GET", sendPack, timeout, successCb, failCb, timeoutCb, errorCb);
	},

	/**
	 * 发送HTTP请求
	 * @param {*} serverUrl 
	 * @param {*} argString 
	 * @param {*} requestType requestType POST or GET
	 * @param {*} sendPack 
	 * @param {*} timeout 
	 * @param {*} successCb 默认回调app.NetManager().OnReceiveHttpPack(serverUrl, httpRequest.responseText);
	 * @param {*} failCb 默认回调app.NetManager().OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
	 * @param {*} timeoutCb 默认回调app.NetManager().OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
	 * @param {*} errorCb 默认回调app.NetManager().OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
	 */
	_SendHttpRequest: function (serverUrl, argString, requestType, sendPack, timeout = 3000, successCb = null, failCb = null, timeoutCb = null, errorCb = null) {

		if (app.ControlManager().IsOpenVpn()) {
            return;
        }

		var url = [serverUrl, argString].join("")

		// console.log("NetRequest _SendHttpRequest url: ",url);

		var dataStr = JSON.stringify(sendPack);

		// console.log("NetRequest _SendHttpRequest dataStr: ",dataStr);

		let timeOut = false;
		// 每次都实例化一个，否则会引起请求结束，实例被释放了
		var httpRequest = new XMLHttpRequest();
		httpRequest.timeout = timeout;
		httpRequest.open(requestType, url, true);
		// 服务器json解码
		httpRequest.setRequestHeader("Content-Type", "application/json");

		var that = this;
		httpRequest.onerror = function () {
			that.ErrLog("httpRequest.error:%s", url);
			if (!!errorCb) {
				errorCb(serverUrl, httpRequest.readyState, httpRequest.status, httpRequest);
			} else {
				app.NetManager().OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status, httpRequest);
			}
		};
		httpRequest.ontimeout = function () {
			timeOut = true;
			if (!!timeoutCb) {
				timeoutCb(serverUrl, httpRequest.readyState, httpRequest.status, httpRequest);
			} else {
				app.NetManager().OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status, httpRequest);
			}
		};
		httpRequest.onreadystatechange = function () {
			if (timeOut == true) {
				return;
			}
			// 执行成功
			if (httpRequest.status == 200) {
				if (httpRequest.readyState == 4) {
					
					// console.log("NetRequest _SendHttpRequest responseText: ",httpRequest.responseText);

					if (!!successCb) {
						successCb(serverUrl, httpRequest.responseText, httpRequest);
					} else {
						app.NetManager().OnReceiveHttpPack(serverUrl, httpRequest.responseText, httpRequest);
					}
				}
			}
			else {
				if (!!failCb) {
					failCb(serverUrl, httpRequest.readyState, httpRequest.status, httpRequest);
				} else {
					app.NetManager().OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status, httpRequest);
				}
				that.ErrLog("onreadystatechange(%s,%s)", httpRequest.readyState, httpRequest.status);
			}
		};
		httpRequest.send(dataStr);
	},


})



//定义一个全局http
var g_httpRequest = null


/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_httpRequest) {
		g_httpRequest = new NetRequest();
	}
	return g_httpRequest;
}