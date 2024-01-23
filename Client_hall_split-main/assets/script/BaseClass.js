/*
    客户端自定义基类
*/

let ShareDefine = require('ShareDefine').GetModel();



var BaseClass = cc.Class({

	ctor:function(){
		var argList = Array.prototype.slice.call(arguments);

		this.JS_Name = "BaseClass";
		this.Init.apply(this, argList);
	},

	Init:function(){
	},

    //是否开发者模式
    IsDevelopment:function(){
        return ShareDefine.IsDevelopment
    },

	//获取包装后的log文本
	GetLogFormatList:function(argList){
		var len = argList.length;
		var logText = argList[0];
		//第一个不是文本格式
		if(typeof(logText) != "string"){
			return argList
		}

		//如果是谷歌浏览器,包装颜色
		if(cc.sys.browserType == "chrome"){
			//如果末尾有携带颜色配置
			var colorType = argList[len - 1];
			var color = ShareDefine.ChromeLogColorDict[colorType];
			//如果存在颜色,替换最后一个参数为颜色值
			if(color){
				//删除末尾的颜色标示
				argList.pop();

				//文本开头添加颜色标示%c
				logText = "%c" + logText;

				//在文本后面插入一个颜色值
				argList.splice(1, 0, color);
			}
		}
		else{
			var colorType = argList[len - 1];
			var color = ShareDefine.ChromeLogColorDict[colorType];
			if(color){
				//删除末尾的颜色标示
				argList.pop();
			}
		}

		//第一个默认是字符串加上文件标示
		argList[0] = this.JS_Name + "\t" + logText;
		return argList
	},

	//接收不定参
	Log:function(){
		if(this.IsDevelopment()){
			var argList = Array.prototype.slice.call(arguments);
			argList = this.GetLogFormatList(argList);
			cc.log.apply(null, argList)
		}
	},

	//网络通信log
	NetLog:function(){
		if(this.IsDevelopment()){
			var argList = Array.prototype.slice.call(arguments);
			argList = this.GetLogFormatList(argList);
			cc.log.apply(null, argList)
		}
	},

	//接收不定参
	SysLog:function(){
		var argList = Array.prototype.slice.call(arguments);
		argList = this.GetLogFormatList(argList);
		cc.log.apply(null, argList)
	},

	//接收不定参
	WarnLog:function(){
		if(this.IsDevelopment()){
			var argList = Array.prototype.slice.call(arguments);
			argList = this.GetLogFormatList(argList);
			cc.warn.apply(null, argList)
		}
	},
	
	//接收不定参
	ErrLog:function(){
		var argList = Array.prototype.slice.call(arguments);
		argList = this.GetLogFormatList(argList);
		cc.error.apply(null, argList)
	},
});

var DBBaseClass = BaseClass.extend({
	ctor:function(){
		var argList = Array.prototype.slice.call(arguments);

		this.JS_Name = "DBBaseClass";
		this.Init.apply(this, argList);

		this.OnReload();
	},

	//下线初始化
	OnReload:function(){
		this.isLoadDB = false;
		this.isSendLoadDB = false;

		this.InitReload();
	},

	//加载数据
	LoadInitDB:function(headName, sendPack){
		if(this.isLoadDB){
			return
		}
		if(this.isSendLoadDB){
			return
		}
		this.isSendLoadDB = true;

		//发送请求初始化管理器数据
		app.NetManager().SendPack(headName, sendPack, this.OnSuccessInitDBData.bind(this), this.OnFailInitDBData.bind(this));
	},

	//初始化请求回调
	OnSuccessInitDBData:function(serverPack){
		this.isLoadDB = true;
		this.OnInitData(serverPack);
	},

	//初始化请求失败回调
	OnFailInitDBData:function(failInfo){
		this.isLoadDB = false;
		this.isSendLoadDB = false;

		this.OnFailInitData(failInfo);
	},

	//-------------子类需要实现的函数-------------
	InitReload:function(){
		this.ErrLog("InitReload 必须实现");
	},

	OnInitData:function(serverPack){
		this.ErrLog("OnInitData 必须实现");
	},

	OnFailInitData:function(failInfo){
		this.ErrLog("OnFailInitData 必须实现");
	},



})


module.exports = {"BaseClass":BaseClass, "DBBaseClass":DBBaseClass};

