/*
    下载管理类
 */
var app = require("qzmj_app");

var DownLoadstate = function () {
	//下载事件
	this.DwonLoadState_Finish = 0;//下载完成
	this.DwonLoadState_Error = 1;//下载失败
	this.DwonLoadState_Progress = 2;//下载进度
};

var qzmj_DownLoadMgr = app.BaseClass.extend({
	extends: cc.Component,

	properties: {},

	Init: function () {
		this.JS_Name = app.subGameName + "_DownLoadMgr";

		this.serverUrl = null;
		this.loaclPath = null;
		this.fileName = null;
		this.downloadType = null;
		this.count = 0


		//下载事件
		//this.DwonLoadState_Finish       = 0;//下载完成
		//this.DwonLoadState_Error        = 1;//下载失败
		//this.DwonLoadState_Progress     = 2;//下载进度

		//this.DownFile("http://voice.qp355.com:8080/mp3/20170705/1499260230432a2c41d49b5575fab91b8fd37f5e16.amr", "/data/user/0/com.ddmh5.p7/files/100191499260129329.amr", "deleteString",  "AMRFILEDOWNLOADFINISH" );
	},

	//1秒回掉
	OnTimer: function (paqzmjecond) {
		app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("MSG_DOWNLOAD_ERROR");
		this.count++;
		// if(this.count > 3){
		//     let msgID = "Net_ReconnectConnectFail";
		//     let ConfirmManager = app[app.subGameName+"_ConfirmManager"]();
		//     ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, []);
		//     ConfirmManager.ShowConfirm(app[app.subGameName+"_ShareDefine"]().ConfirmOK, msgID, [])

		//     cc.Director.getInstance().getScheduler().unschedule(this.OnTimer, this);
		//     return;
		// }
		this.DownFile(this.serverUrl, this.loaclPath, this.fileName, this.downloadType);
		cc.Director.getInstance().getScheduler().unschedule(this.OnTimer, this);
	},

	//确认框点击
	OnConFirm: function (clickType, msgID, backArgList) {
		if (clickType != "Sure") {
			return
		}

		//如果是尝试继续重连
		if (msgID == "Net_ReconnectConnectFail") {
			this.DownFile(this.serverUrl, this.loaclPath, this.fileName, this.downloadType);
		} else {
			this.ErrLog("OnConFirm:%s", msgID);
		}
	},

	//下载文件  filename 没有值是设置为deleteString
	DownFile: function (serverUrl, localPath, fileName, downloadType) {
		if (serverUrl == null || localPath == null || downloadType == null) {
			this.ErrLog("DownFile serverUrl == null || localPath == null || downloadType == null");
			return;
		}
		this.serverUrl = serverUrl;
		this.loaclPath = localPath;
		this.fileName = fileName;
		this.downloadType = downloadType;
		//this.count = 0
		let argList = [{"Name": "urls", "Value": serverUrl}, {
			"Name": "fileName",
			"Value": fileName
		}, {"Name": "savePath", "Value": localPath}, {"Name": "downloadType", "Value": downloadType}];
		let value = app[app.subGameName + "_NativeManager"]().CallToNative("downLoadFile", argList);
	},

	//下载完成
	OnDownFileFinish: function (serverPack) {
		app[app.subGameName + "Client"].OnEvent(serverPack["downloadType"], serverPack);

		this.serverUrl = null;
		this.loaclPath = null;
		this.fileName = null;
		this.downloadType = null;
		this.count = 0
	},

	//下载失败
	OnDownFileError: function (serverPack) {
		app[app.subGameName + "Client"].OnEvent(serverPack["downloadType"], serverPack);

		if (!cc.Director.getInstance().getScheduler().isScheduled(this.OnTimer, this)) {
			cc.Director.getInstance().getScheduler().schedule(this.OnTimer, this, 3.0);
		}


	},

	//下载进度
	OnDownFileProgress: function (serverPack) {
		//app[app.subGameName + "Client"].OnEvent(serverPack["downloadType"], {"progress": serverPack["proess"]});
		app[app.subGameName + "Client"].OnEvent(serverPack["downloadType"], serverPack);
	},

	//下载事件
	OnDownLoadEvent: function (serverPack) {
		if (serverPack["state"] == qzmj_DownLoadMgr.DwonLoadState_Finish) {
			this.OnDownFileFinish(serverPack);
		} else if (serverPack["state"] == qzmj_DownLoadMgr.DwonLoadState_Error) {
			this.OnDownFileError(serverPack);
		} else if (serverPack["state"] == qzmj_DownLoadMgr.DwonLoadState_Progress) {
			this.OnDownFileProgress(serverPack);
		}
	},

	//获取失败标识
	GetDownLoadStateError: function () {
		return DownLoadMgr.DwonLoadState_Error;
	},
	//获取成功标识
	GetDownLoadStateFinish: function () {
		return DownLoadMgr.DwonLoadState_Finish;
	},
	//获取进度标识
	GetDownLoadStateProgress: function () {
		return DownLoadMgr.DwonLoadState_Progress;
	},
});


DownLoadstate.apply(qzmj_DownLoadMgr, []);

var g_qzmj_DownLoadMgr = null;
/**
 ...
 */
exports.GetModel = function () {
	if (!g_qzmj_DownLoadMgr) {
		g_qzmj_DownLoadMgr = new qzmj_DownLoadMgr();
	}
	return g_qzmj_DownLoadMgr;
};