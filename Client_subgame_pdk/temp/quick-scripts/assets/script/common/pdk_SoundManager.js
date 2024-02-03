(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/common/pdk_SoundManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'typdk0fe-226d-4d72-9de4-9e3417ca2745', 'pdk_SoundManager', __filename);
// script/common/pdk_SoundManager.js

"use strict";

/*
 声音管理器
 */
var app = require("pdk_app");

var pdk_SoundManager = app.BaseClass.extend({

	Init: function Init() {
		this.JS_Name = app.subGameName + "_SoundManager";

		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
		this.LocalDataManager = app.LocalDataManager();
		this.Sound = this.SysDataManager.GetTableDict("Sound");
		//音量
		this.volume = 1;

		this.loadSoundNameList = [];
		this.Log("Init");
	},

	//播放背景音乐
	PlayBackMusic: function PlayBackMusic(soundName) {
		var filePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

		// let backMusic = this.LocalDataManager.GetConfigProperty("SysSetting", "BackMusic");
		var backVolume = this.LocalDataManager.GetConfigProperty("SysSetting", "BackVolume");
		//如果关闭音效
		if (!backVolume) {
			return app.bluebird.resolve(0);
		}
		if (filePath == "") {
			var soundInfo = this.Sound[soundName];
			if (!soundInfo) {
				this.ErrLog("PlayBackMusic(%s) not find", soundName);
				return app.bluebird.resolve(0);
			}
			filePath = soundInfo["SoundPath"];
		} else {
			filePath = filePath;
		}

		if (this.loadSoundNameList.InArray(soundName)) {
			this.WarnLog("PlayBackMusic loadSoundNameList(%s) have find", soundName);
			return app.bluebird.resolve(0);
		}

		this.loadSoundNameList.push(soundName);
		var that = this;

		var isLoop = true;
		var promisefunc = function promisefunc(resolve, reject) {
			cc.loader.loadRes(filePath, cc.AudioClip, function (error, clip) {

				if (error && error != true) {
					reject(error);
					return;
				}
				that.loadSoundNameList.Remove(soundName);
				that.StopAllSound();
				var soundID = cc.audioEngine.play(clip, isLoop, backVolume);
				resolve(soundID);
			});
		};
		return new app.bluebird(promisefunc);
	},

	//播放音效(返回audioID)
	PlaySound: function PlaySound(soundName) {
		var filePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
		var isLoop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


		var spSound = this.LocalDataManager.GetConfigProperty("SysSetting", "SpSound");
		var spVolume = this.LocalDataManager.GetConfigProperty("SysSetting", "SpVolume");
		//如果关闭音效
		if (!spSound) {
			return app.bluebird.resolve(0);
		}
		if (filePath == "") {
			var soundInfo = this.Sound[soundName];
			if (!soundInfo) {
				this.ErrLog("PlaySound(%s) not find", soundName);
				return app.bluebird.resolve(0);
			}
			filePath = soundInfo["SoundPath"];
		} else {
			filePath = filePath;
		}
		if (!isLoop) {
			isLoop = false;
		}

		if (this.loadSoundNameList.InArray(soundName)) {
			this.WarnLog("loadSoundNameList(%s) have find", soundName);
			return app.bluebird.resolve(0);
		}

		this.loadSoundNameList.push(soundName);
		var that = this;

		var promisefunc = function promisefunc(resolve, reject) {
			cc.loader.loadRes(filePath, cc.AudioClip, function (error, clip) {

				if (error && error != true) {
					reject(error);
					return;
				}
				that.loadSoundNameList.Remove(soundName);
				var soundID = cc.audioEngine.play(clip, isLoop, spVolume);
				resolve(soundID);
			});
		};
		return new app.bluebird(promisefunc);
	},

	//暂停所有音效
	PauseAllSound: function PauseAllSound() {
		cc.audioEngine.pauseAll();
	},
	//暂停正在播放音频。
	PauseSound: function PauseSound(audioID) {
		cc.audioEngine.pause(audioID);
	},
	//恢复所有暂停的音效
	ResumeAllSound: function ResumeAllSound() {
		cc.audioEngine.resumeAll();
	},
	//恢复播放指定的音频。
	ResumeSound: function ResumeSound(audioID) {
		cc.audioEngine.resume(audioID);
	},
	//停止所有正在播放的音效
	StopAllSound: function StopAllSound() {
		cc.audioEngine.stopAll();
	},

	StopSoundByAudioID: function StopSoundByAudioID(audioID) {
		cc.audioEngine.stop(audioID);
	},

	//清除音效加载的资源
	ClearSound: function ClearSound(soundName) {

		var soundInfo = this.Sound[soundName];
		if (!soundInfo) {
			this.ErrLog("ClearSound(%s) not find", soundName);
			return;
		}
		cc.audioEngine.uncache(cc.url.raw(soundInfo["SoundPath"]));
	},

	ClearAllSound: function ClearAllSound() {
		cc.audioEngine.uncacheAll();
	}

});

var g_pdk_SoundManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_pdk_SoundManager) {
		g_pdk_SoundManager = new pdk_SoundManager();
	}
	return g_pdk_SoundManager;
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=pdk_SoundManager.js.map
        