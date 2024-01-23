/*
 声音管理器
 */
var app = require("nn_app");

var nn_SoundManager = app.BaseClass.extend({

	Init: function () {
		this.JS_Name = app["subGameName"] + "_SoundManager";

		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
		this.LocalDataManager = app.LocalDataManager();
		this.Sound = this.SysDataManager.GetTableDict("Sound");
		//音量
		this.volume = 1;

		this.loadSoundNameList = [];
		//console.log("Init");
	},


	//播放背景音乐
	PlayBackMusic: function (soundName, filePath = "") {
		// let backMusic = this.LocalDataManager.GetConfigProperty("SysSetting", "BackMusic");
		let backVolume = this.LocalDataManager.GetConfigProperty("SysSetting", "BackVolume");
		//如果关闭音效
		if (!backVolume) {
			return app.bluebird.resolve(0)
		}
		if (filePath == "") {
			let soundInfo = this.Sound[soundName];
			if (!soundInfo) {
				console.error("PlayBackMusic(%s) not find", soundName);
				return app.bluebird.resolve(0)
			}
			filePath = soundInfo["SoundPath"];
		} else {
			filePath = filePath;
		}

		if (this.loadSoundNameList.InArray(soundName)) {
			console.warn("PlayBackMusic loadSoundNameList(%s) have find", soundName);
			return app.bluebird.resolve(0)
		}

		this.loadSoundNameList.push(soundName);
		var that = this;

		let isLoop = true;
		let promisefunc = function (resolve, reject) {
			cc.loader.loadRes(filePath, cc.AudioClip, function (error, clip) {

				if (error && error != true) {
					reject(error);
					return
				}
				that.loadSoundNameList.Remove(soundName);
				that.StopAllSound();
				let soundID = cc.audioEngine.play(clip, isLoop, backVolume);
				resolve(soundID);
			})
		};
		return new app.bluebird(promisefunc);
	},

	//播放音效(返回audioID)
	PlaySound: function (soundName, filePath = "", isLoop = false) {

		let spSound = this.LocalDataManager.GetConfigProperty("SysSetting", "SpSound");
		let spVolume = this.LocalDataManager.GetConfigProperty("SysSetting", "SpVolume");
		//如果关闭音效
		if (!spSound) {
			return app.bluebird.resolve(0)
		}
		if (filePath == "") {
			let soundInfo = this.Sound[soundName];
			if (!soundInfo) {
				console.error("PlaySound(%s) not find", soundName);
				return app.bluebird.resolve(0)
			}
			filePath = soundInfo["SoundPath"];
		} else {
			filePath = filePath;
		}
		if (!isLoop) {
			isLoop = false;
		}

		if (this.loadSoundNameList.InArray(soundName)) {
			console.warn("loadSoundNameList(%s) have find", soundName);
			return app.bluebird.resolve(0)
		}
		console.log("播放音效", soundName);
		this.loadSoundNameList.push(soundName);
		var that = this;

		let promisefunc = function (resolve, reject) {
			cc.loader.loadRes(filePath, cc.AudioClip, function (error, clip) {

				if (error && error != true) {
					reject(error);
					return
				}
				that.loadSoundNameList.Remove(soundName);
				let soundID = cc.audioEngine.play(clip, isLoop, spVolume)
				resolve(soundID);
			})
		};
		return new app.bluebird(promisefunc);
	},

	//暂停所有音效
	PauseAllSound: function () {
		cc.audioEngine.pauseAll();
	},
	//暂停正在播放音频。
	PauseSound: function (audioID) {
		cc.audioEngine.pause(audioID);
	},
	//恢复所有暂停的音效
	ResumeAllSound: function () {
		cc.audioEngine.resumeAll();
	},
	//恢复播放指定的音频。
	ResumeSound: function (audioID) {
		cc.audioEngine.resume(audioID);
	},
	//停止所有正在播放的音效
	StopAllSound: function () {
		cc.audioEngine.stopAll();
	},

	StopSoundByAudioID: function (audioID) {
		cc.audioEngine.stop(audioID);
	},

	//清除音效加载的资源
	ClearSound: function (soundName) {

		let soundInfo = this.Sound[soundName];
		if (!soundInfo) {
			console.error("ClearSound(%s) not find", soundName);
			return
		}
		cc.audioEngine.uncache(cc.url.raw(soundInfo["SoundPath"]));
	},

	ClearAllSound: function () {
		cc.audioEngine.uncacheAll();
	},


});


var g_nn_SoundManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	if (!g_nn_SoundManager) {
		g_nn_SoundManager = new nn_SoundManager();
	}
	return g_nn_SoundManager;
}