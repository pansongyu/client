/*
 WeChatManager.js 微信sdk
 */
var app = require("qzmj_app");

var qzmj_WeChatManager = app.BaseClass.extend({

	Init:function(){
		this.JS_Name = app["subGameName"] + "_WeChatManager";

		this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
		this.SysDataManager = app[app.subGameName + "_SysDataManager"]();
		this.HeroAccountManager = app[app.subGameName+"_HeroAccountManager"]();
		this.NetManager = app[app.subGameName + "_NetManager"]();
		this.ControlManager = app[app.subGameName+"_ControlManager"]();
		this.HeroManager = app[app.subGameName+"_HeroManager"]();
		this.SysNotifyManager = app[app.subGameName + "_SysNotifyManager"]();

		//如果存在全局sdk对象
		this.wx = window.wx;
		this.sdk = null;

		this.NetManager.RegHttpNetPack(0x0003, this.OnHttpPack_IsSubscribeWeChatMPResult, this);
		this.NetManager.RegHttpNetPack(0x0004, this.OnHttpPack_RequestWeChatSDKInitSignResult, this);
		this.NetManager.RegHttpNetPack(0x0007, this.OnHttpPack_HeadImagePathInfo, this);

		app[app.subGameName + "Client"].RegEvent("PlayerLoginOK", this.OnEvent_PlayerLoginOK, this);

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
		app[app.subGameName + "Client"].OnEvent("IsSubscribeWeChatMPResult", serverPack);
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
    	let room = app[app.subGameName.toUpperCase()+"Room"]();
		let roomKey = room.GetRoomProperty("key");  //房间号
		if(roomKey){
			this.InitRoomWeChatShare();
		}else{
			this.InitGameWeChatShare();
		}
		


		
	},

	OnWeChatError:function(result){
		this.ErrLog("OnWeChatError :", result);
		app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("CodeErrorMsg", ["公众号签名初始化失败"])
	},

	//----------------分享接口------------------------
	InitGameWeChatShare:function(){
		if(!this.sdk){
			return
		}
		let clientConfig = app[app.subGameName + "Client"].GetClientConfig();
		this.SetWeChatShareDataInfo(clientConfig["WeChatShareTitle"], clientConfig["WeChatShareDesc"]);
	},
	BeginShare:function(roomKey,title,desc){
        let weChatShareImageUrl = app[app.subGameName + "Client"].GetClientConfigProperty("WeChatShareImageUrl");
        let link="https://www.qp355.com/room"+roomKey;
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
        let weChatShareImageUrl = app[app.subGameName + "Client"].GetClientConfigProperty("WeChatShareImageUrl");
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
	//房间微信分享
	InitRoomWeChatShare:function(){
		if(!this.sdk){
			return
		}
    	let room = app[app.subGameName.toUpperCase()+"Room"]();
        var WeChatShare= this.WeChatShare(app.subGameName);
        let title = null;
        if(WeChatShare['special']){
           title =WeChatShare['special'];
        }else{
           title =WeChatShare['title'];
        }
        let desc = WeChatShare['desc'];
        let setCount = room.GetRoomConfigByProperty("setCount");  //多少局
        let roomKey = room.GetRoomProperty("key");  //房间号

        let allPlayerInfo = room.GetRoomProperty('posList');
        let joinPlayerCount = allPlayerInfo.length;  //几人场
        let nowJoin=0;

        for(let i=0;i<joinPlayerCount;i++){
            if(allPlayerInfo[i].pid > 0)
                nowJoin++;
        }
        title=title.replace('{房间号}',roomKey);
        title=title.replace('{几局}',setCount);
        let gamedesc ="";
        gamedesc=joinPlayerCount+"人场";
        let autoCardIdx= room.GetRoomConfigByProperty("paymentRoomCardType"); 
        if(0 == autoCardIdx)
            gamedesc=gamedesc+",房主出钻";
        else if(1 == autoCardIdx)
            gamedesc=gamedesc+",平分钻石";
        else
        	gamedesc=gamedesc+",大赢家出钻";
        let que=joinPlayerCount-nowJoin;
        gamedesc+=","+nowJoin+"缺"+que;
        let teshuwanfan=this.WanFa();
        if(teshuwanfan){
        	gamedesc+=","+teshuwanfan;
        }
        //let text=title+"\n"+gamedesc;
        this.BeginShare(room.GetRoomProperty("key"),title,gamedesc);
	},
	WanFa:function(){
    	this.gameCreateConfig = this.SysDataManager.GetTableDict("gameCreate");
 		let playGame=app.subGameName;
 		if(playGame==''){
 			return false;
 		}
    	let room = app[app.subGameName.toUpperCase()+"Room"]();
    	let wanfa='';
    	for(let key in this.gameCreateConfig){
            if(playGame == this.gameCreateConfig[key].GameName && this.gameCreateConfig[key].isWanFa==1){
            	let dataKey = this.gameCreateConfig[key].Key;
            	let value=room.GetRoomConfigByProperty(dataKey);
            	let ToggleType=this.gameCreateConfig[key].ToggleType;
 				let ToggleDesc=this.gameCreateConfig[key].ToggleDesc.split(',');
 				if(ToggleType==0){
 					//单选
 					let str = '';
 					str = ToggleDesc[value];
 					if('zjh' == gameType && ('dingzhu' == dataKey || 'dizhu' == dataKey)){
						let baseDiZhus = [1,2,5,10];
						let dizhuIdx = room.GetRoomConfigByProperty('dizhu');
						let dizhu = baseDiZhus[dizhuIdx];
						let dingzhu = 0;
						if(0 == value)
				            dingzhu = dizhu * 5;
				        else
				            dingzhu = dizhu * 10;
				        dizhu = dizhu * room.GetRoomConfigByProperty('baseMark');
						dingzhu = dingzhu * room.GetRoomConfigByProperty('baseMark');
						
						if('dingzhu' == dataKey)
							str = dingzhu.toString() + '分';
						else
							str = dizhu.toString() + '分';
					}
 					if (wanfa == ''){
 						wanfa = str;
 					} else {
 						wanfa = wanfa + "，" + str;
 					}
 				}else if(ToggleType==1){
 					//多选
 					for(let j=0;j<value.length;j++){
 						if(wanfa==''){
 							wanfa=ToggleDesc[value[j]];
 						}else{
 							wanfa=wanfa+"，"+ToggleDesc[value[j]];
 						}
 					}
 				}
            }
        }
 		return wanfa;
    },

	//设置微信预分享数据
	SetWeChatShareDataInfo:function(title, desc, argDict){
		if(!this.sdk){
			this.Log("SetWeChatShareDataInfo not init sdk");
			return
		}
		let gameLoadUrl = app[app.subGameName + "Client"].GetClientConfigProperty("GameLoadUrl");
		let weChatShareImageUrl = app[app.subGameName + "Client"].GetClientConfigProperty("WeChatShareImageUrl");

		//如果没有传递参数字典
		if(!argDict){
			argDict = {};
		}

		let gameID = app[app.subGameName + "Client"].GetClientConfigProperty("GameID");
		if(!gameID){
			this.ErrLog("SetWeChatShareDataInfo not find GameID");
			return
		}
		let mpID = app[app.subGameName + "Client"].GetClientConfigProperty("MPID");
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

		let gameID = app[app.subGameName + "Client"].GetClientConfigProperty("GameID");
		let sendPack = this.NetManager.GetHttpSendPack(0xFF09);
		sendPack.HeadInfo = headInfo;
		sendPack.GameID = gameID;
		this.NetManager.SendHttpPack(sendPack);
	},

	//接收到资源服务器下载资源回复
	OnHttpPack_HeadImagePathInfo:function(serverPack){
		// this.SysLog("OnHttpPack_HeadImagePathInfo serverPack:", serverPack);
		let resServerUrl = this.NetManager.GetResServerHttpAddress();
		if(!resServerUrl){
			this.ErrLog("OnHttpPack_HeadImagePathInfo(%s,%s) not resServerUrl");
			return
		}
		let bluebirdList = [];
		let headPathInfo = serverPack["HeadPathInfo"];
		for(let heroID in headPathInfo){
			bluebirdList.push(this.CreateSpriteFrame(resServerUrl, heroID, headPathInfo[heroID]));
		}

		let that = this;

		app.bluebird.all(bluebirdList)
			.then(function(heroIDList){
				app[app.subGameName + "Client"].OnEvent("RefreshHeadImageSprite", {"HeroIDList":heroIDList});
			})
			.catch(function(error){
				that.ErrLog("OnHttpPack_HeadImagePathInfo:%s", error.stack)
			})

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

		let orderServerIP = app[app.subGameName + "Client"].GetClientConfigProperty("OrderServerIP");
		let orderServerPort = app[app.subGameName + "Client"].GetClientConfigProperty("OrderServerPort");

		code_url = ["http://",orderServerIP, ":", orderServerPort, "/", code_url].join("");

		//打开扫描支付页面
		cc.sys.openURL(code_url);
	},

	//支付结果通知
	OnPayResult:function(resultInfo){

		// this.SysLog("OnPayResult:", resultInfo);

		//{
		//	"errMsg":"chooseWXPay:ok"
		//}
		if(resultInfo["errMsg"] == "chooseWXPay:ok"){
			console.log("支付成功");
		}
		else{
			console.log("支付失败");
			app[app.subGameName + "_SysNotifyManager"]().ShowSysMsg("CodeErrorMsg", ["微信公众号支付失败:" + JSON.stringify(resultInfo)]);
		}
	},

	//---------------授权接口--------------------
	//微信授权
	Login:function(){
		let token = this.dataInfo["code"];
		if(!token){
			this.ErrLog("Login dataInfo not find code :", this.dataInfo);
			return
		}

		let mpID = app[app.subGameName + "Client"].GetClientConfigProperty("MPID");
		if(!mpID){
			this.ErrLog("Login not find MPID");
			return
		}
		this.HeroAccountManager.LoginAccountBySDK(this.ShareDefine.SDKType_WeChat, token, mpID);
	},

	//检查登录是否是短线重登
	CheckLoginBySDK:function(){
		let token = this.dataInfo["code"];
		if(!token){
			this.ErrLog("Login dataInfo not find code :", this.dataInfo);
			return false;
		}

		let mpID = app[app.subGameName + "Client"].GetClientConfigProperty("MPID");
		if(!mpID){
			this.ErrLog("Login not find MPID");
			return false;
		}
		return true;
	},


	//----------------发包接口------------------------

	//发送请求微信公众号sdk签名
	SendRequestWeChatSDKIntSign:function(){

		let mpID = app[app.subGameName + "Client"].GetClientConfigProperty("MPID");
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

		let mpID = app[app.subGameName + "Client"].GetClientConfigProperty("MPID");
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

	WeChatShare:function(playgame,gameCfg=null){
        let type=typeof(playgame);
        if(type== 'number'){
            playgame=app[app.subGameName+"_ShareDefine"]().GametTypeID2PinYin[playgame];
        }
        var WeChatShare=new Array();
        let gameId = app[app.subGameName+"_ShareDefine"]().GametTypeNameDict[playgame.toUpperCase()];
        var gamename=app[app.subGameName+"_ShareDefine"]().GametTypeID2Name[gameId];
        var special='';
        if(playgame){
            special = app[app.subGameName + "Client"].GetClientConfigProperty("RoomShare"+playgame.toUpperCase());
        }
        let title='';
        let desc='';
        if(playgame){
            title= app[app.subGameName + "Client"].GetClientConfigProperty("WeChatShareRoomTitle");
            title=title.replace('{游戏名}',gamename);
            desc= app[app.subGameName + "Client"].GetClientConfigProperty("WeChatShareRoomDesc");
            desc=desc.replace('{游戏名}',gamename);
        }else{
            title= app[app.subGameName + "Client"].GetClientConfigProperty("WeChatShareTitle");
            desc= app[app.subGameName + "Client"].GetClientConfigProperty("WeChatShareDesc");
        }
        let weChatAppShareUrl = app[app.subGameName + "Client"].GetClientConfigProperty("WeChatAppShareUrl");  
        let ShortShareUrl = app[app.subGameName + "Client"].GetClientConfigProperty("ShortShareUrl");   
        //获取HeroID
        this.ComTool = app[app.subGameName + "_ComTool"]();
        this.HeroManager = app[app.subGameName+"_HeroManager"]();
        let heroID = app[app.subGameName + "_HeroManager"]().GetHeroProperty("pid");
        let ShortHeroID=this.ComTool.GetPid(heroID);
        WeChatShare['title']=title;
        WeChatShare['desc']=desc;
        WeChatShare['special']=special;
        WeChatShare['url']=weChatAppShareUrl+"/"+ShortHeroID+"/";
		console.log("WeXinShare WeChatShare:",WeChatShare);
        return WeChatShare;
    },
});

var g_qzmj_WeChatManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	if(!g_qzmj_WeChatManager){
		g_qzmj_WeChatManager = new qzmj_WeChatManager();
	}
	return g_qzmj_WeChatManager;
}