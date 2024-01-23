/*
 WeChatManager.js 微信sdk
 */
var app = require('app');

var WeChatManager = app.BaseClass.extend({

	Init:function(){
		this.JS_Name = "WeChatManager";

		this.ShareDefine = app.ShareDefine();
		this.SysDataManager = app.SysDataManager();
		this.HeroAccountManager = app.HeroAccountManager();
		this.NetManager = app.NetManager();
		this.ControlManager = app.ControlManager();
		this.HeroManager = app.HeroManager();
		this.SysNotifyManager = app.SysNotifyManager();

		//如果存在全局sdk对象
		this.wx = window.wx;
		this.sdk = null;

		this.NetManager.RegHttpNetPack(0x0003, this.OnHttpPack_IsSubscribeWeChatMPResult, this);
		this.NetManager.RegHttpNetPack(0x0004, this.OnHttpPack_RequestWeChatSDKInitSignResult, this);
		this.NetManager.RegHttpNetPack(0x0007, this.OnHttpPack_HeadImagePathInfo, this);

		app.Client.RegEvent("PlayerLoginOK", this.OnEvent_PlayerLoginOK, this);

		this.dataInfo = {};

		//玩家第3方头像spriteFrame缓存字典
		//{heroID:{"HeadImageUrl":"XX","SpriteFrame":null}}
		this.heroHeadSpriteFrame = {};

		//this.OnReload();

		this.Log("Init");
	},

	OnReload:function(){
		//这里不能reload，不然会导致登录不了，故直接return
		return;
		this.dataInfo["code"] = null;
		
	},

	//授权参数初始化
	InitWeChatSDKParameter:function(dataInfo){
		let code = dataInfo["code"];
		//使用公众号登录授权启动没有携带code
		if(!code){
			this.ErrLog("InitWeChatSDKParameter dataInfo not find code", dataInfo);
			return
		}
		this.dataInfo = dataInfo;
	},

	//是否已经关注公众号
	OnHttpPack_IsSubscribeWeChatMPResult:function(serverPack){
		this.dataInfo["IsSubscribe"] = serverPack.IsSubscribe;
		app.Client.OnEvent("IsSubscribeWeChatMPResult", serverPack);
	},

	//申请微信sdk初始化签名
	OnHttpPack_RequestWeChatSDKInitSignResult:function(serverPack){
		console.log("OnHttpPack_RequestWeChatSDKInitSignResult :",serverPack);
		if(!this.wx){
			this.ErrLog("OnHttpPack_RequestWeChatSDKInitSignResult not find wx");
			return
		}
		let signature = serverPack.Signature;
		if(!signature){
			this.ErrLog("OnHttpPack_RequestWeChatSDKInitSignResult not find Signature :", serverPack);
			return
		}

		this.wx.config({
			"debug":false,
			"appId":serverPack.AppId,
			"timestamp":serverPack.Timestamp,
			"nonceStr":serverPack.NonceStr,
			"signature":signature,
			"jsApiList":["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "getNetworkType", "chooseWXPay"],
		});
		this.wx.ready(this.OnWeChatReady.bind(this));
		this.wx.error(this.OnWeChatError.bind(this));
	},

	//初始化成功
	OnWeChatReady:function(){
		console.log("XiaoFu InitWeiXinShare OnWeChatReady2");
		this.sdk = this.wx;

		this.InitGameWeChatShare();
	},

	OnWeChatError:function(result){
		this.ErrLog("OnWeChatError :", result);
		app.SysNotifyManager().ShowSysMsg("CodeErrorMsg", ["公众号签名初始化失败"])
	},

	//----------------分享接口------------------------
	InitGameWeChatShare:function(){
		if(!this.sdk){
			return
		}
		let clientConfig = app.Client.GetClientConfig();
		this.SetWeChatShareDataInfo(clientConfig["WeChatShareTitle"], clientConfig["WeChatShareDesc"]);
	},
	BeginShare:function(roomKey,title,desc){
        let weChatShareImageUrl = app.Client.GetClientConfigProperty("WeChatShareImageUrl");
        let link="http://fb.qicaiqh.com:88/room"+roomKey;
        let shareInfo = {
			title:title,
			desc:desc,
			link:link,
			imgUrl:weChatShareImageUrl,
			type:"link",
			dataUrl:"",
			success:this.ShareSuccess.bind(this),
			cancel:this.ShareCancel.bind(this),
		}
		this.sdk.onMenuShareTimeline(shareInfo);
		this.sdk.onMenuShareAppMessage(shareInfo);
		this.sdk.onMenuShareQQ(shareInfo);
		this.sdk.onMenuShareWeibo(shareInfo);
		this.sdk.onMenuShareQZone(shareInfo);



    },
    //微信分享获取短域名并且启动分享
    SuccessTcnUrl:function(serverPack){
        console.log("SuccessTcnUrl serverPack:",serverPack);
        if(typeof(serverPack.requestUrl)=="undefined"){
            return;
        }
        let jsonStr=serverPack.requestUrl;
        jsonStr=jsonStr.replace('[','');
        jsonStr=jsonStr.replace(']','');
        let ShareUrl=eval('(' + jsonStr + ')');
        let url_short=ShareUrl.url_short;
        let weChatShareImageUrl = app.Client.GetClientConfigProperty("WeChatShareImageUrl");
        let shareInfo = {
			title:this.ShareTitle,
			desc:this.ShareDesc,
			link:url_short,
			imgUrl:weChatShareImageUrl,
			type:"link",
			dataUrl:"",
			success:this.ShareSuccess.bind(this),
			cancel:this.ShareCancel.bind(this),
		}
		this.sdk.onMenuShareTimeline(shareInfo);
		this.sdk.onMenuShareAppMessage(shareInfo);
		this.sdk.onMenuShareQQ(shareInfo);
		this.sdk.onMenuShareWeibo(shareInfo);
		this.sdk.onMenuShareQZone(shareInfo);
    },
    //微信分享获取短域名失败分享
    FailTcnUrl:function(event){

    },

	//设置微信预分享数据
	SetWeChatShareDataInfo:function(title, desc, argDict){
		if(!this.sdk){
			this.Log("SetWeChatShareDataInfo not init sdk");
			return
		}
		let gameLoadUrl = app.Client.GetClientConfigProperty("GameLoadUrl");
		let weChatShareImageUrl = app.Client.GetClientConfigProperty("WeChatShareImageUrl");

		//如果没有传递参数字典
		if(!argDict){
			argDict = {};
		}

		let gameID = app.Client.GetClientConfigProperty("GameID");
		if(!gameID){
			this.ErrLog("SetWeChatShareDataInfo not find GameID");
			return
		}
		let mpID = app.Client.GetClientConfigProperty("MPID");
		if(!mpID){
			this.ErrLog("SetWeChatShareDataInfo not find MPID");
			return
		}

		//添加启动标示参数
		argDict["ddmchannel"] = "wechat";
		argDict["ddmgameid"] = gameID;
		argDict["ddmmp"] = mpID;
		//分享携带推广ID
		argDict["popularizeID"] = this.HeroManager.GetHeroID();

		gameLoadUrl += this.GetUrlStr(argDict);

		let shareInfo = {
			title:title,
			desc:desc,
			link:gameLoadUrl,
			imgUrl:weChatShareImageUrl,
			type:"link",
			dataUrl:"",
			success:this.ShareSuccess.bind(this),
			cancel:this.ShareCancel.bind(this),
		}

		this.sdk.onMenuShareTimeline(shareInfo);
		this.sdk.onMenuShareAppMessage(shareInfo);
		this.sdk.onMenuShareQQ(shareInfo);
		this.sdk.onMenuShareWeibo(shareInfo);
		this.sdk.onMenuShareQZone(shareInfo);
	},

	GetUrlStr:function(dataDict){

		if(!dataDict){
			return ""
		}

		var argList = Object.keys(dataDict);
		argList.sort();
		var count = argList.length;

		var urlSendStr = '?';
		for(var index=0; index<count; index++){
			var key = argList[index];
			urlSendStr += key + '=' + dataDict[key] + '&';
		}
		//去掉最后一个&
		urlSendStr = urlSendStr.substring(0, urlSendStr.length-1);

		return urlSendStr;
	},

	//分享成功
	ShareSuccess:function(){
	},

	//取消分享
	ShareCancel:function(){
	},

	GetSDK:function(){
		return this.sdk;
	},

	GetSDKProperty:function(property){
		if(!this.dataInfo.hasOwnProperty(property)){
			this.ErrLog("GetSDKProperty not find property:%s", property);
			return
		}

		return this.dataInfo[property];
	},
	//---------------微信头像-------------------------

	//玩家登陆完成
	OnEvent_PlayerLoginOK:function(){
		let heroID = this.HeroManager.GetHeroID();
		let headImageUrl = this.HeroManager.GetHeroProperty("headImageUrl");
		//初始化第3方玩家头像贴图
		this.InitHeroHeadImage(heroID, headImageUrl);
	},

	HeroIDGetHeadImgUrl:function(heroID){
		let headSpriteFrameInfo =this.heroHeadSpriteFrame.SetDefault(heroID, {});
		if(typeof(headSpriteFrameInfo.HeadImageUrl)=="undefined"){
			return "";
		}
		return headSpriteFrameInfo.HeadImageUrl;
	},

	//------------头像贴图初始化-------------
	//通过玩家ID初始化玩家头像
	InitHeroHeadImage:function(heroID, headImageUrl){
		if(!headImageUrl){
			return
		}
		let headSpriteFrameInfo = this.heroHeadSpriteFrame.SetDefault(heroID, {});
		//如果缓存的url地址没有变化,并且已经存在spriteFrame对象了,则不用申请贴图数据
		if(headSpriteFrameInfo["HeadImageUrl"] == headImageUrl && headSpriteFrameInfo["SpriteFrame"]){
			return
		}
		
		//如果本地有存了地址，直接写入缓存
		if(cc.sys.isNative){
			var dirpath =  jsb.fileUtils.getWritablePath() + 'customHeadImage/';
			let headPathMd5 = app.MD5.hex_md5(headImageUrl);
	        var filepath = dirpath + headPathMd5 + ".png";
	        if(jsb.fileUtils.isFileExist(filepath)){
	            console.log('HeadImg is find:' + filepath);
	            cc.loader.load(filepath,function (err,tex) {
	                var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
	                headSpriteFrameInfo["HeadImageUrl"] = headImageUrl;
					headSpriteFrameInfo["SpriteFrame"] = spriteFrame;
	            });
        		return;
        	}
        }
        headSpriteFrameInfo["HeadImageUrl"] = headImageUrl;
		headSpriteFrameInfo["SpriteFrame"] = null;

		let headInfo = {};
		headInfo[heroID] = headImageUrl;

		this.SendHttpLoadHeadImage(headInfo);
        
	},

	//通过字典初始化玩家头像
	InitHeroHeadImageByDict:function(heroHeadInfo){
		let headInfo = {};

		for(var heroID in heroHeadInfo){
			let headImageUrl = heroHeadInfo[heroID];
			if(!headImageUrl){
				continue
			}
			let headSpriteFrameInfo = this.heroHeadSpriteFrame.SetDefault(heroID, {});
			//如果缓存的url地址没有变化,并且已经存在spriteFrame对象了,则不用申请贴图数据
			if(headSpriteFrameInfo["HeadImageUrl"] == headImageUrl && headSpriteFrameInfo["SpriteFrame"]){
				continue
			}
			headSpriteFrameInfo["HeadImageUrl"] = headImageUrl;
			headSpriteFrameInfo["SpriteFrame"] = null;
			headInfo[heroID] = headImageUrl;
		}

		if(Object.keys(headInfo).length){
			this.SendHttpLoadHeadImage(headInfo);
		}
	},

	//发送封包请求
	SendHttpLoadHeadImage:function(headInfo){

		let gameID = app.Client.GetClientConfigProperty("GameID");
		let sendPack = this.NetManager.GetHttpSendPack(0xFF09);
		sendPack.HeadInfo = headInfo;
		sendPack.GameID = gameID;
		this.NetManager.SendHttpPack(sendPack);
	},

	//接收到资源服务器下载资源回复
	OnHttpPack_HeadImagePathInfo:function(serverPack){
		let resServerUrl = this.NetManager.GetResServerHttpAddress();
		if(!resServerUrl){
			this.ErrLog("OnHttpPack_HeadImagePathInfo(%s,%s) not resServerUrl");
			return
		}
		let bluebirdList = [];
		let headPathInfo = serverPack["HeadPathInfo"];


		//真机
		if(cc.sys.isNative) {
			for(let heroID in headPathInfo){
				this.SaveHeadImgFile(resServerUrl, heroID, headPathInfo[heroID]);
			}
		}else{
		 //网页 	
			for(let heroID in headPathInfo){
				bluebirdList.push(this.CreateSpriteFrame(resServerUrl, heroID, headPathInfo[heroID]));
			}
			let that = this;
			app.bluebird.all(bluebirdList)
			.then(function(heroIDList){
				app.Client.OnEvent("RefreshHeadImageSprite", {"HeroIDList":heroIDList});
			})
			.catch(function(error){
				that.ErrLog("OnHttpPack_HeadImagePathInfo:%s", error.stack)
			})
		}

	},

	//从本地获取微信头像
	SaveHeadImgFile:function(resServerUrl, heroID, headPath){
		if (!cc.sys.isNative) {
			return;
		}
		var dirpath =  jsb.fileUtils.getWritablePath() + 'customHeadImage/';
        let url = [resServerUrl, headPath].join("/");
        let headImageUrl=this.HeroIDGetHeadImgUrl(heroID);
        if(headImageUrl==""){
        	return;
        }
        let headPathMd5 = app.MD5.hex_md5(headImageUrl);
        var filepath = dirpath + headPathMd5 + ".png";
        console.log("filepath ->",filepath);
        let that = this;
        function loadEnd(){
        	return that.ControlManager.CreateLoadPromiseByUrl(filepath)
					.then(function(texture){
						if(texture instanceof cc.Texture2D){
							let spriteFrame = new cc.SpriteFrame(texture);
							let headSpriteFrameInfo = that.heroHeadSpriteFrame.SetDefault(heroID, {});
							headSpriteFrameInfo["SpriteFrame"] = spriteFrame;
							let heroIDList = [];
							heroIDList.push(heroID);
							app.Client.OnEvent("RefreshHeadImageSprite", {"HeroIDList":heroIDList});
							return heroID;
						}
						else{
							that.ErrLog("texture not Texture2D");
						}
					})
					.catch(function(error){
						that.ErrLog("OnHttpPack_HeadImagePathInfo error:%s", error.stack);
					})
        }

        if( jsb.fileUtils.isFileExist(filepath) ){
            console.log('HeadImg is find:' + filepath);
            loadEnd();
            return;
        }

        var saveFile = function(data){
            if( typeof data !== 'undefined' && cc.sys.isNative){
                if( !jsb.fileUtils.isDirectoryExist(dirpath) ){
                    jsb.fileUtils.createDirectory(dirpath);
                }else{
                    // console.log("路径exist");
                }
                // console.log("saveFile data:"+data);
                // console.log("saveFile Uint8Array data:"+new Uint8Array(data));
                // new Uint8Array(data) writeDataToFile  writeStringToFile
                if( jsb.fileUtils.writeDataToFile( new Uint8Array(data) , filepath) ){
                    console.log('HeadImg write file succeed.');
                    loadEnd();
                }else{
                    console.log('HeadImg write file failed.');
                }
            }else{
                console.log('HeadImg download file failed.');
            }
        };
		if (app.ControlManager().IsOpenVpn()) {
            return;
        }
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 ) {
                if(xhr.status === 200){
                    saveFile(xhr.response);
                }else{
                    saveFile(null);
                }
            }
        }.bind(this);
        //responseType一定要在外面设置
        xhr.responseType = 'arraybuffer';
        xhr.open("GET", url, true);
        xhr.send();
    },

	//创建头像贴图对象
	CreateSpriteFrame:function(resServerUrl, heroID, headPath){
		let that = this;

		let targetPath = [resServerUrl, headPath].join("/");

		return this.ControlManager.CreateLoadPromiseByUrl(targetPath)
			.then(function(texture){
				if(texture instanceof cc.Texture2D){
					let spriteFrame = new cc.SpriteFrame(texture);
					let headSpriteFrameInfo = that.heroHeadSpriteFrame.SetDefault(heroID, {});
					headSpriteFrameInfo["SpriteFrame"] = spriteFrame;
					return heroID
				}
				else{
					that.ErrLog("texture not Texture2D");
				}
			})
			.catch(function(error){
				that.ErrLog("OnHttpPack_HeadImagePathInfo error:%s", error.stack);
			})
	},

	//获取指定玩家的第3方头像贴图对象
	GetHeroHeadSpriteFrame:function(heroID){
		if(!this.heroHeadSpriteFrame){
			console.log("头像资源还未初始化...")
			return;
		}
		let headSpriteFrameInfo = this.heroHeadSpriteFrame[heroID];
		if(!headSpriteFrameInfo){
			return
		}
		return headSpriteFrameInfo["SpriteFrame"];
	},

	//---------------------订单接口---------------------
	//收到预订单信息
	ReceivePrepayOrder:function(serverPack){
		let prepayOrderInfo = serverPack["PrepayOrderInfo"];

		let argDict = prepayOrderInfo["ArgDict"];

		argDict["success"] = this.OnPayResult.bind(this);
		this.sdk.chooseWXPay(argDict);
	},

	//接收到扫描支付回调
	ReceivePrepayQRCodeOrder:function(serverPack){
		let code_url = serverPack["Code_url"];

		let orderServerIP = app.Client.GetClientConfigProperty("OrderServerIP");
		let orderServerPort = app.Client.GetClientConfigProperty("OrderServerPort");

		code_url = ["http://",orderServerIP, ":", orderServerPort, "/", code_url].join("");

		//打开扫描支付页面
		cc.sys.openURL(code_url);
	},

	//支付结果通知
	OnPayResult:function(resultInfo){

		this.SysLog("OnPayResult:", resultInfo);

		//{
		//	"errMsg":"chooseWXPay:ok"
		//}
		if(resultInfo["errMsg"] == "chooseWXPay:ok"){
			this.SysLog("支付成功");
		}
		else{
			this.SysLog("支付失败");
			app.SysNotifyManager().ShowSysMsg("CodeErrorMsg", ["微信公众号支付失败:" + JSON.stringify(resultInfo)]);
		}
	},

	//---------------授权接口--------------------
	//微信授权
	Login:function(){
		console.log("WeChatManager Login");
		let token = this.dataInfo["code"];
		if(!token){
			this.ErrLog("Login dataInfo not find code :", this.dataInfo);
			return
		}

		let mpID = app.Client.GetClientConfigProperty("MPID");
		if(!mpID){
			this.ErrLog("Login not find MPID");
			return
		}

		console.log("WeChatManager Login 2222222222222");

		this.HeroAccountManager.LoginAccountBySDK(this.ShareDefine.SDKType_WeChat, token, mpID);
	},

	//检查登录是否是短线重登
	CheckLoginBySDK:function(){
		let token = this.dataInfo["code"];
		if(!token){
			this.ErrLog("Login dataInfo not find code :", this.dataInfo);
			return false;
		}

		let mpID = app.Client.GetClientConfigProperty("MPID");
		if(!mpID){
			this.ErrLog("Login not find MPID");
			return false;
		}
		return true;
	},


	//----------------发包接口------------------------

	//发送请求微信公众号sdk签名
	SendRequestWeChatSDKIntSign:function(){

		let mpID = app.Client.GetClientConfigProperty("MPID");
		//没有配置公众号,不需要分享功能
		if(!mpID){
			this.Log("SendRequestWeChatSDKIntSign not mpID");
			return
		}

		//native版本不需要请求签名,H5才需要
		if(cc.sys.isNative){
			return
		}

		//如果网页没有加载wxSDK
		if(!this.wx){
			this.ErrLog("SendRequestWeChatSDKIntSign not find wx");
			return
		}
		let url = window.location.href.split('#')[0];
		if(!url){
			this.ErrLog("SendRequestWeChatSDKIntSign  window.location.href:%s",  window.location.href)
			return
		}

		let sendPack = this.NetManager.GetHttpSendPack(0xFF06);
		sendPack.MPID = mpID;
		sendPack.Url = url;
		this.NetManager.SendHttpPack(sendPack);
	},

	//是否已经关注公众号
	SendIsSubscribeWeChatMP:function(){

		let mpID = app.Client.GetClientConfigProperty("MPID");
		//没有配置公众号,不需要验证是否关注公众号
		if(!mpID){
			this.ErrLog("SendIsSubscribeWeChatMP not find MPID");
			return
		}

		let accountID = this.HeroAccountManager.GetAccountProperty("AccountID");
		let sendPack = this.NetManager.GetHttpSendPack(0xFF05);
		sendPack.AccountID = accountID;
		sendPack.MPID = mpID;
		this.NetManager.SendHttpPack(sendPack);
	},
});

var g_WeChatManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	if(!g_WeChatManager){
		g_WeChatManager = new WeChatManager();
	}
	return g_WeChatManager;
}