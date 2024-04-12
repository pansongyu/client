/*
 *  qzmj_ShareDefine.js
 *  LY
 *
 *  author:hongdian
 *  date:2014-10-28
 *  version:1.0
 *
 * 修改时间 修改人 修改内容:
 *
 *
 */


var qzmj_ShareDefine = {
};

//---------------------------基础(所有项目通用的枚举)--------------------------------------

var Common = function(){

	//  ------------------客户端状态-----------------------
	this.State_Prepare = 0;     // 客户端初始化状态
	this.State_InitSuccess = 1; //初始化成功
	this.State_WaitLogin = 2;   // 客户端未登陆状态
	this.State_Logining = 3;    // 客户端登录过程中状态
	this.State_LoginPackSucess = 4;    // 客户端登录过程中状态
	this.State_LoginPackFail = 5;    // 客户端登录过程中状态
	this.State_Logined = 6;         // 客户端已登陆状态


	//计时器显示格式
	this.ShowHourMinSec = 1;
	this.ShowMinSec = 2;
	this.ShowSec = 3;
	this.ShowDayHour = 4;
	this.ShowSecondSec = 5;
	this.YearMonthDayHourMinuteSecond = 6;

	//获取服务器时间的类型(星期,时,分,秒，年，月，日)
	this.GetServerWeek = 1;
	this.GetServerHours = 2;
	this.GetServerMinSec = 3;
	this.GetServerSec = 4;
	this.GetServerYear = 5;
	this.GetServerMonth = 6;
	this.GetServerDay = 7;
	this.GetServerDate = 8;
	this.GetServerDateString = 9;

	//-------------------tagWorldThing keyID-------------------
	this.ThingID = 1;
	//-------------------tagDBDataKey keyID-------------------
	this.DataKeyID = 1;
	//-------------------tagDBPropertyInfoKey keyID-------------------
	this.PropertyInfoID = 1;
	//-----------------玩家角色起始ID-------------------
	this.FirstPlayerID = 10000;

	//允许播放4格动漫的创角间隔时间
	this.ShowAnimeTick = 10*1000;


	//创建账号登陆token的加密key
	this.TokenSecret = "com.ddcat.gameAccount";
	//token过期时间一分钟
	this.TokenExpireTick = 1 * 60 * 1000;

	//是否开发模式
	this.IsDevelopment = 0;

	//主版本号
	this.MainVersion = "1";
	//次版本号
	this.MinorVersion = "0";
	//更新版本号
	this.UpdateVersion = "1";

	//客户端版本号
	this.ClientVersion = [this.MainVersion, this.MinorVersion, this.UpdateVersion].join(".");

	//chrome浏览器log颜色
	this.ChromeLogColorDict = {
		//黑色背景,蓝绿文本(收包)
		"b-gb":'background: #255; color: #00ffff',
		//黑色背景,绿文本(发包)
		"b-g":'background: #255; color: #00ff00',
		//白色背景,绿文本(连接)
		"w-g":'background: #0; color: #007f00'
	};

	//是否金币场
	this.isCoinRoom = false;
	this.practiceId = 0;

	//金币不足
	this.NotEnoughCoin = 902;
	//金币过多
	this.MuchCoin = 904;

	//创建房间选择的玩法
	this.DefaultRoom = 0;
	this.ScoreRoom = 1;
	this.CoinRoom = 2;
};	



//----------------------GM指令枚举---------------------
var GM = function(){
	// GM指令执行成功
	this.GM_CmdOK = 1;
	// 没有GM权限
	this.GM_Limited = 2;
	// 指令不存在
	this.GM_CmdError = 3;
	// 设置失败
	this.GM_CmdFail = 4;
	// 帮助文本
	this.GM_CmdHelp = 5;
	//目标玩家不存在
	this.GM_CmdTargetError = 6;
	//返回结果异常
	this.GM_CmdResultError = 7;

	this.GMType_Area = 1;
	this.GMType_Rank = 2;
};


var SDK = function(){

	//公司自己
	this.SDKType_Company = 0;
	//微信公众号授权
	this.SDKType_WeChat = 2;
	//app授权
	this.SDKType_WeChatApp = 3;

	//H5版本sdk
	this.H5AccountSDKTypeList = [this.SDKType_WeChat];

	//APP版本sdk
	this.AppAccountSDKTypeList = [this.SDKType_WeChatApp];

	this.AccountSDKTypeNameDict = {};
	this.AccountSDKTypeNameDict[this.SDKType_Company] = "公司";
	this.AccountSDKTypeNameDict[this.SDKType_WeChat] = "微信公众号";
	this.AccountSDKTypeNameDict[this.SDKType_WeChatApp] = "微信APP";

	//玩家性别
	this.HeroSex_Boy = 0;
	this.HeroSex_Girl = 1;

	this.SexTypeList = [this.HeroSex_Boy, this.HeroSex_Girl];
};


var Order = function(){
	// 1:公司充值
	this.OrderType_Company = 0;
	// 2:anySDK充值
	this.OrderType_AnySDK = 1;
	//3:万普支付
	this.OrderType_WanPuSDK = 2;
	//4:小米支付
	this.OrderType_MiSDK = 3;
	//5:360支付
	this.OrderType_QiHooSDK = 4;
	// 6:苹果支付
	this.OrderType_IOS = 5;
	//微信
	this.OrderType_Wechat = 7;
	//扫码支付
	this.OrderType_QRCode = 8;
	//微信app支付
	this.OrderType_WechatApp = 9;


	this.OrderSDKTypeNameDict = {};
	this.OrderSDKTypeNameDict[this.OrderType_Company] = "公司";
	this.OrderSDKTypeNameDict[this.OrderType_AnySDK] = "AnySDK";
	this.OrderSDKTypeNameDict[this.OrderType_WanPuSDK] = "万普";
	this.OrderSDKTypeNameDict[this.OrderType_MiSDK] = "小米";
	this.OrderSDKTypeNameDict[this.OrderType_QiHooSDK] = "奇虎";
	this.OrderSDKTypeNameDict[this.OrderType_IOS] = "IOS";
	this.OrderSDKTypeNameDict[this.OrderType_Wechat] = "微信公众号";
	this.OrderSDKTypeNameDict[this.OrderType_QRCode] = "微信扫码";
	this.OrderSDKTypeNameDict[this.OrderType_WechatApp] = "微信APP";

	//H5版本sdk
	this.H5OrderSDKTypeList = [this.OrderType_Wechat, this.OrderType_QRCode];

	//APP版本sdk
	this.AppOrderSDKTypeList = [this.OrderType_AnySDK, this.OrderType_WanPuSDK, this.OrderType_MiSDK, this.OrderType_QiHooSDK, this.OrderType_IOS, this.OrderType_WechatApp];


	//需要创建服务器订单缓存的类型
	this.NeedRecordOrderTypeList = [6];
	//账号服务器内购玩家账号不存在
	this.CreateOrder_PurchaseAccountNotFind = 1;
	//账号服务器内购玩家账号异常
	this.CreateOrder_PurchaseAccountError = 2;
	//账号服务器内购GM玩家账号不存在
	this.CreateOrder_SendAccountIDNotFind = 3;
	//账号服务器内购创建订单成功
	this.CreateOrder_CreateOrderSuccess = 4;
	//订单服务器验证签名失败
	this.CreateOrder_CheckSignFail = 5;
	//订单服务器创建订单失败
	this.CreateOrder_CreateOrderFail = 6;
	//订单服务器充值订单成功
	this.CreateOrder_CreateOrderSuccess = 7;
	//游戏服务端兑换订单失败
	this.CreateOrder_ExchangeOrderFail = 8;
	//内部充值玩家服务器名错误
	this.CreateOrder_PurchaseServerNameNotFind = 9;

	// 1:充值成功
	this.RechargeSucess = 1;
	// 2:订单重复
	this.OrderRepeat = 2;
	// 3:订单验证失败
	this.OrderTestingFail = 3;
	// 4:链接游戏服务器失败
	this.ConnectGameServerFail = 4;
	// 5:链接APP服务器失败
	this.ConnectAppServerFail = 5;
	// 6:给予玩家奖励失败
	this.GiveRewardFail = 6;
};


var Code = function(){
	//服务器下发错误系统提示
	this.ErrorSysMsg = 102;
	//服务器下发错误 非法操作
	this.NotAllow = 103;
	//玩家比赛分不足
	this.SportsPointNotEnough = 305;
	//房卡不足
	this.ErrorNotRoomCard = 903;
	//圈卡不足
	this.ErrorNotQuanCard = 906;
	//可以创建的房间数量不足
	this.ErrorMaxRoom = 5003;
	//禁止使用魔法表情
	this.NotMagic = 1506;
	//洗牌失败房卡不足
	this.ErrorNotRoomCardByXiPai = 905;
	//玩家主动断开连接
	this.Player_OffLine = 1000;
	//房间号不存在或解散
	this.NotFind_Room = 5001;
	//正在其他房间游戏
	this.InOtherRoomPlay = 5012;
	//服务器维护中
	this.Maintain = 10;
	//退出房间失败
	this.ExitROOM_ERROR = 5019;
	//找不到房间
	this.NotExistRoom = 5020;
	//继续游戏失败
	this.ResetRoomInfo = 5025;
	//俱乐部创建房间配置已达上限
	this.CLUB_CreateCfgMax = 6001;
	//没有加入俱乐部不能加入该房间
	this.CLUB_NotClubJoinRoomErr = 6003;
	//封包没有什么回复动作,或者条件没有通过不执行
	this.PackNot_Action = 10000;
	//封包执行崩溃
	this.PackRun_Error = 10001;
	//登陆过程失败T下线
	this.KickOut_LoginError = 10002;
	//创建新角色失败T下线
	this.KickOut_CreateNewHeroError = 10003;
	//登陆账号密码错误
	this.KickOut_NotCreateToken = 10004;
	//其他地方登陆
	this.KickOut_OtherLogin = 10005;
	//登陆账号不存在
	this.KickOut_AccountNotFind = 10006;
	//账号登陆的密码错误
	this.KickOut_AccountPswError = 10007;
	//第3方登陆验证失败
	this.KickOut_AccountAuthorizationFail = 10008;
	//登陆的token已经过期
	this.KickOut_TokenExpire = 10009;
	//http请求服务器未开启
	this.Http_ServerNotStart = 10010;
	//http请求执行崩溃
	this.Http_PackRunError = 10011;
	//http请求没有回复动作,或者条件没有通过不执行
	this.Http_PackNotAction = 10012;
	//http请求没有这个封包请求
	this.Http_NotFindPack = 10013;
	//请求账号服务器失败
	this.Http_RequestAccountServerFail = 10014;
	//请求订单服务器失败
	this.Http_RequestOrderServerFail = 10015;
	//服务器还未开启成功
	this.KickOut_ServerClose = 10016;
	//账号登录过程失败
	this.KickOut_AccountLoginError = 10017;
	//自定义账号登录token验证账号ID失败
	this.KickOut_AccountTokenError = 10018;
	//没有多余端口登录
	this.KickOut_NotFreePortID = 10019;
	//客户端请求封包逻辑不存在
	this.PackRun_NotFindPack = 10020;
	//客户端资源错误
	this.KickOut_ClientVersion = 10021;

	this.NoShowSysMsgCodeList = [this.PackNot_Action, this.Http_PackNotAction];

	//0:执行成功
	this.WebJava_Success = 0;
	//1:未定义封包
	this.WebJava_NotFindPack = 1;
	//2:封包执行失败
	this.WebJava_PackRunError = 2;
	//3:玩家ID不存在
	this.WebJava_HeroIDNotFind = 3;
	//4:封包条件判断失败
	this.WebJava_PackNotAction = 4;
	//5:返回值异常非json
	this.WebJava_ReturnNotJson = 5;
	//6:返回值没有携带Code参数
	this.WebJava_ReturnNotFindCode = 6;
	//7:没有找到封包执行模块
	this.WebJava_NotFindPackClass = 7;

	this.WebJavaCodeTextMsgDict = {};
	this.WebJavaCodeTextMsgDict[this.WebJava_Success] = "成功";
	this.WebJavaCodeTextMsgDict[this.WebJava_NotFindPack] = "封包未定义";
	this.WebJavaCodeTextMsgDict[this.WebJava_PackRunError] = "封包执行失败";
	this.WebJavaCodeTextMsgDict[this.WebJava_HeroIDNotFind] = "玩家ID不存在";
	this.WebJavaCodeTextMsgDict[this.WebJava_PackNotAction] = "执行条件不允许";
	this.WebJavaCodeTextMsgDict[this.WebJava_ReturnNotJson] = "返回值非JSON";
	this.WebJavaCodeTextMsgDict[this.WebJava_ReturnNotFindCode] = "返回值未找到Code";
	this.WebJavaCodeTextMsgDict[this.WebJava_NotFindPackClass] = "封包PackClass未找到";

};


//---------------------武将枚举---------------
var Color = function(){
	//红色
	this.Color_Red = new cc.Color(255,0,0);
	//绿色
	this.Color_Green = new cc.Color(0,255,0);
	//白色
	this.Color_White = new cc.Color(255,255,255);
	//黑色
	this.Color_Black = new cc.Color(255,255,255);
	//灰色
	this.Color_Gray = new cc.Color(125,125,125);
	//紫色
	this.Color_Purple = new cc.Color(255,125,255);
	//橙色
	this.Color_Orange = new cc.Color(255,125,0);
	//枚红色
	this.Color_RoseRed = new cc.Color(253,62,208);
};

var Timer = function(){
	//金币抽计时器ID
	this.GoldGambleTimerID = 1;
	//钻石抽计时器ID
	this.DiamondGambleTimerID = 2;
	//扫荡计时器ID
	this.AutoFBFightTimerID = 3;
	//BOSS挑战计时器ID
	this.BossFightTimerID = 4;
	//玩家申请公会计时器CD
	this.RequestGuildTimerID = 5;
	//公会升级战复活计时器ID
	this.GuildLvFightTimerID = 6;

	//验证码有效时间
	this.EffectiveTime = 1000*60*20;
};


var Chat = function(){
    //出牌语言
    this.Mandarin = 1;
    this.Dialect = 2;

	//1:世界
	this.ChatType_World = 1;
	//2:公会
	this.ChatType_Family = 2;
	//3:私聊
	this.ChatType_Private = 3;
	//4:系统
	this.ChatType_System = 4;
	//5:队伍
	this.ChatType_Team = 5;
	//6:阵营
	this.ChatType_Union = 6;
	//7:喇叭
	this.ChatType_Horn = 7;

	//聊天频道类型列表
	this.ChatTypeList = [
		this.ChatType_World,
		this.ChatType_Family,
		this.ChatType_Private,
		this.ChatType_System,
		this.ChatType_Team,
		this.ChatType_Union,
		this.ChatType_Horn,
	];

	//允许所有玩家加入的聊天频道
	this.NotAllowJoinChatTypeList = [this.ChatType_Private];

	//聊天对应的字典
	this.ChatNameDict = {
		"1":"世界",
		"2":"公会",
		"3":"私聊",
		"4":"系统",
		"5":"队伍",
		"6":"阵营",
		"7":"喇叭",
	};

	this.ChatTextDict = {
		"1":"<color=#b72310>{S1}</c>：{S2}",
		"2":"<color=#6fd5ff>{S1}</c>：{S2}",
		"3":"<color=#f5f5f5>{S1}</c>：{S2}",
	};
};

var Model = function(){


};

var Form = function(){

	this.Confirm = "Confirm";               // 确认，取消 2次确认类型 UIMessage.js
	this.ConfirmYN = "ConfirmYN";           // 是 否 2次确认类型 UIMessage.js
	this.ConfirmBuyGoTo = "ConfirmBuyGoTo"; // 购买,前往 UIMessage.js
	this.ConfirmOK = "ConfirmOK";           // OK 单按钮 UIMessage.js
	this.ConfirmUse = "ConfirmUse";         // 使用实例确定界面
	this.ConfirmBuy = "ConfirmBuy";         // 购买数量确定界面 UIAmountAffirm.js

	this.ConfirmFamily = "ConfirmFamily"; // 购买,前往 UIMessage.js
	//使用frmSetUpTips界面的确认框类型列表
	this.SetUpTipFormConfirmList = ["Confirm", "ConfirmYN", "ConfirmBuyGoTo", "ConfirmOK"];

	//战队等级未到时界面控件显示类型
	this.FormWnd_EffectLock = 1;
	this.FormWnd_NotShow = 2;
};

var Hero = function(){
	this.MaxPlayerNum = 20; //游戏最大人数

};


var Effect = function(){
	this.EffectPosType_1 = 1;        // 控件特效位置1左下
	this.EffectPosType_2 = 2;        // 控件特效位置2下中
	this.EffectPosType_3 = 3;        // 控件特效位置3右下

	this.EffectPosType_4 = 4;        // 控件特效位置中左
	this.EffectPosType_5 = 5;        // 控件特效位置中间
	this.EffectPosType_6 = 6;        // 控件特效位置中右

	this.EffectPosType_7 = 7;        // 控件特效位置上左
	this.EffectPosType_8 = 8;        // 控件特效位置上中
	this.EffectPosType_9 = 9;        // 控件特效位置上右
	this.EffectPosType_10 = 10;        // 控件特效随机位置
};

var Mail = function(){

};




//----------------------------------------------------------------项目-------------------------------------------------------------

var Rank = function(){

	this.RankType_Arena = 1;
	this.RankType_Droiyan = 2;
	this.RankType_WorldBoss1 = 3;
	this.RankType_WorldBoss2 = 4;
	this.RankType_WorldBoss3 = 5;
	this.RankType_WorldBoss4 = 6;
	this.RankType_Level = 7;
	this.RankType_WingLevel = 8;
	this.RankType_Dungeon = 9;
	this.RankType_Power = 10;
	this.RankType_TianLongPower = 11;
	this.RankType_GuMuPower = 12;
	this.RankType_XiaoYaoPower = 13;
	this.RankType_WinSetCount = 14;
	this.RankType_Integral = 15;

};

var Game = function(){
	//泉州麻将
	this.GameType_QZMJ = 6;

	this.GametTypeNameDict = {};
	this.GametTypeNameDict["QZMJ"] = this.GameType_QZMJ;

    this.GametTypeID2Name = {};
	this.GametTypeID2Name[this.GameType_QZMJ] = "泉州麻将";

  	this.GametTypeID2PinYin = {};
	this.GametTypeID2PinYin[this.GameType_QZMJ] = "qzmj";
};

var Room = function(){
	//红中麻将房间状态
	this.RoomState_Init = 0;
	this.RoomState_Playing = 1;
	this.RoomState_End = 2;
	this.RoomState_Waiting = 3;
	this.RoomState_WaitingEx = 4;

	this.RoomStateStringDict = {};
	this.RoomStateStringDict["Init"] = this.RoomState_Init;
	this.RoomStateStringDict["Playing"] = this.RoomState_Playing;
	this.RoomStateStringDict["End"] = this.RoomState_End;
	this.RoomStateStringDict["Waiting"] = this.RoomState_Waiting;
	this.RoomStateStringDict["WaitingEx"] = this.RoomState_WaitingEx;
	
	this.SetState_Init=0;	
	this.SetState_Playing=1;
	this.SetState_End=2;
	this.SetState_Waiting=3;
	this.SetState_WaitingEx=4;
	this.SetStateStringDict = {};
	this.SetStateStringDict["Init"] = this.SetState_Init;
	this.SetStateStringDict["Playing"] = this.SetState_Playing;
	this.SetStateStringDict["End"] = this.SetState_End;
	this.SetStateStringDict["Waiting"] = this.SetState_Waiting;
	this.SetStateStringDict["WaitingEx"] = this.SetState_WaitingEx;
	//位置类型
	this.Pos_East = 0;
	this.Pos_South = 1;
	this.Pos_West = 2;
	this.Pos_North = 3;

	//位置顺序列表
	this.PosIDList = [this.Pos_East, this.Pos_South, this.Pos_West, this.Pos_North];

	//位置对应底牌旋转角度
	this.PosIDRotationDict = {};
	this.PosIDRotationDict[this.Pos_East] = 0;
	this.PosIDRotationDict[this.Pos_South] = 90;
	this.PosIDRotationDict[this.Pos_West] = 180;
	this.PosIDRotationDict[this.Pos_North] = 270;
};
var MaJiang=function(){
	//参与的人数
	this.MJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.MJRoomPaiDun = 18;
	//自摸
	// this.OpType_Hu = 1;
	this.OpType_Zimo = 1;
	//碰
	this.OpType_Peng = 2;
	//明杠
	this.OpType_Gang = 3;
	//接杠
	this.OpType_JieGang = 4;
	//暗杠
	this.OpType_AnGang = 5;
	//吃
	this.OpType_Chi = 6;
	//出牌
	this.OpType_Out = 7;
	//过
	this.OpType_Pass = 8;
	//抢杠胡
	this.OpType_QiangGangHu = 9;
	//补花
	this.OpType_BuHua = 10;
    //游金
	this.OpType_DanYou = 11;
	//双游
	this.OpType_ShuangYou = 12;
	//三游
	this.OpType_SanYou = 13;
	//抢金
	this.OpType_QiangJin = 14;
	//三金倒
	this.OpType_SanJinDao = 15;
	//抢金过三金倒过，不抢
	this.OpType_SQPass = 16;
	//四金倒
	this.OpType_SiJinDao = 17;
	//五金倒
	this.OpType_WuJinDao = 18;
	//六金倒
	this.OpType_LiuJinDao = 19;
	//明查
	this.OpType_See = 20;
	//暗查
	this.OpType_AnSee = 21;
	//13幺
	this.OpType_ShiSanYao = 22;
	//听游金
	this.OpType_TingYouJin = 23;
	//对对胡
	this.OpType_DDHu = 24;
	//天胡
	this.OpType_TianHu = 25;
	//平胡
	this.OpType_PingHu = 26;
	//听
	this.OpType_Ting = 27;
	//金雀
	this.OpType_JinQue = 28;
	//金龙
	this.OpType_JinLong = 29;
	//一张花
	this.OpType_YiZhangHua = 30;
	//无花无杠
	this.OpType_WHuaWGang = 31;
	//混一色
    this.OpType_HunYiSe = 32;
    //清一色
    this.OpType_QingYiSe = 33;
    //光游
    this.OpType_GuangYou = 34;
    //小炸弹
    this.OpType_XiaoZhaDan = 35;
    //大炸弹
    this.OpType_DaZhaDan = 36;
    //超级炸弹
    this.OpType_ChaoJiZhaDan = 37;
    //地胡
    this.OpType_JinGang = 38;
    //地胡
    this.OpType_DiHu = 39;
    //大对碰
    this.OpType_DaDuiPeng = 41;
    //大三元
    this.OpType_DaSanYuan = 44;
    //三金游
    this.OpType_SanJinYou = 51;
    //单吊
    this.OpType_DanDiao = 42;
    //三金游
    this.OpType_SanJinYou = 51;
    //乱风
    this.OpType_LuanFeng = 53;
    //财神头
    this.OpType_CS_Tou = 54;
    //三财一刻
    this.OpType_SC_Ke = 55;
    //十三不靠
    this.OpType_SSBK = 56;
    //十三不靠清
    this.OpType_SSBK_Qing = 57;
    //门子
    this.OpType_MenZi= 59;
    //字一色
    this.OpType_ZiYiSe= 74;
    //接炮
    this.OpType_JiePao = 75;
    //打骰
    this.OpType_DaTou = 79;
    //天听
    this.OpType_TianTing = 93;

	
	this.OpTypeStringDict = {};
	 this.OpTypeStringDict["Hu"] = this.OpType_Zimo;
	this.OpTypeStringDict["Zimo"] = this.OpType_Zimo;
	this.OpTypeStringDict["Peng"] = this.OpType_Peng;
	this.OpTypeStringDict["Gang"] = this.OpType_Gang;
	this.OpTypeStringDict["JieGang"] = this.OpType_JieGang;
	this.OpTypeStringDict["AnGang"] = this.OpType_AnGang;
	this.OpTypeStringDict["Chi"] = this.OpType_Chi;
	this.OpTypeStringDict["Out"] = this.OpType_Out;
	this.OpTypeStringDict["Pass"] = this.OpType_Pass;
	this.OpTypeStringDict["QiangGangHu"] = this.OpType_QiangGangHu;
	this.OpTypeStringDict["BuHua"] = this.OpType_BuHua;
	this.OpTypeStringDict["GuangYou"] = this.OpType_GuangYou;
	this.OpTypeStringDict["DanYou"] = this.OpType_DanYou;
	this.OpTypeStringDict["ShuangYou"] = this.OpType_ShuangYou;
	this.OpTypeStringDict["SanYou"] = this.OpType_SanYou;
	this.OpTypeStringDict["QiangJin"] = this.OpType_QiangJin;
	this.OpTypeStringDict["SanJinDao"] = this.OpType_SanJinDao;
	this.OpTypeStringDict["SiJinDao"] = this.OpType_SiJinDao;
	this.OpTypeStringDict["WuJinDao"] = this.OpType_WuJinDao;
	this.OpTypeStringDict["LiuJinDao"] = this.OpType_LiuJinDao;
	this.OpTypeStringDict["SQPass"] = this.OpType_SQPass;
	this.OpTypeStringDict["See"] = this.OpType_See;
	this.OpTypeStringDict["AnSee"] = this.OpType_AnSee;
	this.OpTypeStringDict["ShiSanYao"] = this.OpType_ShiSanYao;
	this.OpTypeStringDict["TingYouJin"] = this.OpType_TingYouJin;
	this.OpTypeStringDict["DDHu"] = this.OpType_DDHu;
	this.OpTypeStringDict["TianHu"] = this.OpType_TianHu;
	this.OpTypeStringDict["PingHu"] = this.OpType_PingHu;
	this.OpTypeStringDict["Ting"] = this.OpType_Ting;
	this.OpTypeStringDict["JinQue"] = this.OpType_JinQue;
	this.OpTypeStringDict["JinLong"] = this.OpType_JinLong;
	this.OpTypeStringDict["YiZhangHua"] = this.OpType_YiZhangHua;
	this.OpTypeStringDict["WHuaWGang"] = this.OpType_WHuaWGang;
	this.OpTypeStringDict["HunYiSe"] = this.OpType_HunYiSe;
	this.OpTypeStringDict["QingYiSe"] = this.OpType_QingYiSe;
	this.OpTypeStringDict["XiaoZhaDan"] = this.OpType_XiaoZhaDan;
	this.OpTypeStringDict["DaZhaDan"] = this.OpType_DaZhaDan;
	this.OpTypeStringDict["ChaoJiZhaDan"] = this.OpType_ChaoJiZhaDan;
	this.OpTypeStringDict["JinGang"] = this.OpType_JinGang;
	this.OpTypeStringDict["DiHu"] = this.OpType_DiHu;
	this.OpTypeStringDict["DaDuiPeng"] = this.OpType_DaDuiPeng;
	this.OpTypeStringDict["DaSanYuan"] = this.OpType_DaSanYuan;
	this.OpTypeStringDict["SanJinYou"] = this.OpType_SanJinYou;
	this.OpTypeStringDict["DanDiao"] = this.OpType_DanDiao;
	this.OpTypeStringDict["LuanFeng"] = this.OpType_LuanFeng;
	this.OpTypeStringDict["CS_Tou"] = this.OpType_CS_Tou;
	this.OpTypeStringDict["SC_Ke"] = this.OpType_SC_Ke;
	this.OpTypeStringDict["SSBK"] = this.OpType_SSBK;
	this.OpTypeStringDict["SSBK_Qing"] = this.OpType_SSBK_Qing;
	this.OpTypeStringDict["MenZi"] = this.OpType_MenZi;
	this.OpTypeStringDict["ZiYiSe"] = this.OpType_ZiYiSe;
	this.OpTypeStringDict["JiePao"] = this.OpType_JiePao;
	this.OpTypeStringDict["DaTou"] = this.OpType_DaTou;
	this.OpTypeStringDict["TianTing"] = this.OpType_TianTing;


	//没胡
	this.HuType_NotHu = 0;
	//自摸
	this.HuType_ZiMo = 1;
	//抢杠胡
	this.HuType_QGH = 2;
	//四红中
	this.HuType_FHZ = 3;
	//三金倒
	this.HuType_SanJinDao = 4;
	//游金
	this.HuType_DanYou = 5;
	//双游
	this.HuType_ShuangYou = 6;
	//三游
	this.HuType_SanYou = 7;
	//抢金
	this.HuType_QiangJin = 8;
	//四金倒
	this.HuType_SiJinDao = 9;
	//五金倒
	this.HuType_WuJinDao = 10;
	//六金倒
	this.HuType_LiuJinDao = 11;
	//13幺
	this.HuType_ShiSanYao = 12;
	//对对胡
	this.HuType_DDHu = 13;
	//天胡
	this.HuType_TianHu = 14;
	//平胡
	this.HuType_PingHu = 15;
	//金雀
	this.HuType_JinQue = 16;
	//金龙
	this.HuType_JinLong = 17;
	//一张花
	this.HuType_YiZhangHua = 18;
	//无花无杠
	this.HuType_WHuaWGang = 19;
	//混一色
	this.HuType_HunYiSe = 20;
	//清一色
	this.HuType_QingYiSe = 21;
	//小炸弹
	this.HuType_XiaoZhaDan = 22;
	//大炸弹
	this.HuType_DaZhaDan = 23;
	//超级炸弹
	this.HuType_ChaoJiZhaDan = 24;
	//金杠
	this.HuType_JinGang = 25;
	//地胡
	this.HuType_DiHu = 26;

	//大对碰
	this.HuType_DaDuiPeng = 28;
	//大三元
	this.HuType_DaSanYuan = 29;
	//三金游
	this.HuType_SanJinYou = 30;
	//点炮
	this.HuType_DianPao = 31;
	//单吊
	this.HuType_DanDiao = 32;
	//乱风
	this.HuType_LuanFeng = 33;
	//财神头
	this.HuType_CS_Tou = 34;
	//三财一刻
	this.HuType_SC_Ke = 35;
	//十三不靠
	this.HuType_SSBK = 36;
	//十三不靠清
	this.HuType_SSBK_Qing= 37;
	//屁胡
	this.HuType_PiHu = 38;
	//门子
	this.HuType_MenZi = 39;
	//接刀
	this.HuType_JieDao = 40;
	//字一色
	this.HuType_ZiYiSe = 51;
	//接炮
	this.HuType_JiePao = 52;

	this.HuTypeStringDict = {};
	this.HuTypeStringDict["NotHu"] = this.HuType_NotHu;
	this.HuTypeStringDict["ZiMo"] = this.HuType_ZiMo;
	this.HuTypeStringDict["QGH"] = this.HuType_QGH;
	this.HuTypeStringDict["FHZ"] = this.HuType_FHZ;
	this.HuTypeStringDict["SanJinDao"] = this.HuType_SanJinDao;
	this.HuTypeStringDict["SiJinDao"] = this.HuType_SiJinDao;
	this.HuTypeStringDict["WuJinDao"] = this.HuType_WuJinDao;
	this.HuTypeStringDict["LiuJinDao"] = this.HuType_LiuJinDao;
	this.HuTypeStringDict["DanYou"] = this.HuType_DanYou;
	this.HuTypeStringDict["ShuangYou"] = this.HuType_ShuangYou;
	this.HuTypeStringDict["SanYou"] = this.HuType_SanYou;
	this.HuTypeStringDict["QiangJin"] = this.HuType_QiangJin;
	this.HuTypeStringDict["ShiSanYao"] = this.HuType_ShiSanYao;
	this.HuTypeStringDict["DDHu"] = this.HuType_DDHu;
	this.HuTypeStringDict["TianHu"] = this.HuType_TianHu;
	this.HuTypeStringDict["PingHu"] = this.HuType_PingHu;
	this.HuTypeStringDict["JinQue"] = this.HuType_JinQue;
	this.HuTypeStringDict["JinLong"] = this.HuType_JinLong;
	this.HuTypeStringDict["YiZhangHua"] = this.HuType_YiZhangHua;
	this.HuTypeStringDict["WHuaWGang"] = this.HuType_WHuaWGang;
	this.HuTypeStringDict["HunYiSe"] = this.HuType_HunYiSe;
	this.HuTypeStringDict["QingYiSe"] = this.HuType_QingYiSe;
	this.HuTypeStringDict["XiaoZhaDan"] = this.HuType_XiaoZhaDan;
	this.HuTypeStringDict["DaZhaDan"] = this.HuType_DaZhaDan;
	this.HuTypeStringDict["ChaoJiZhaDan"] = this.HuType_ChaoJiZhaDan;
	this.HuTypeStringDict["JinGang"] = this.HuType_JinGang;
	this.HuTypeStringDict["DiHu"] = this.HuType_DiHu;
	this.HuTypeStringDict["DaDuiPeng"] = this.HuType_DaDuiPeng;
	this.HuTypeStringDict["DaSanYuan"] = this.HuType_DaSanYuan;
	this.HuTypeStringDict["SanJinYou"] = this.HuType_SanJinYou;
	this.HuTypeStringDict["DanDiao"] = this.HuType_DanDiao;
	this.HuTypeStringDict["DianPao"] = this.HuType_DianPao;
	this.HuTypeStringDict["LuanFeng"] = this.HuType_LuanFeng;
	this.HuTypeStringDict["CS_Tou"] = this.HuType_CS_Tou;
	this.HuTypeStringDict["SC_Ke"] = this.HuType_SC_Ke;
	this.HuTypeStringDict["SSBK"] = this.HuType_SSBK;
	this.HuTypeStringDict["SSBK_Qing"] = this.HuType_SSBK_Qing;
	this.HuTypeStringDict["PiHu"] = this.HuType_PiHu;
	this.HuTypeStringDict["MenZi"] = this.HuType_MenZi;
	this.HuTypeStringDict["JieDao"] = this.HuType_JieDao;
	this.HuTypeStringDict["ZiYiSe"] = this.HuType_ZiYiSe;
	this.HuTypeStringDict["JiePao"] = this.HuType_JiePao;

	//没胡
	this.HuTypePY_NotHu = "没胡";
	//胡
	this.HuTypePY_Hu = "平胡";
	//自摸
	this.HuTypePY_ZiMo = "自摸";
	//抢杠胡
	this.HuTypePY_QGH = "抢杠胡";
	//四红中
	this.HuTypePY_FHZ = "四红中";
	//明杠
	this.HuTypePY_JieGang = "明杠";
	//杠
	this.HuTypePY_Gang = "杠";
	//暗杠
	this.HuTypePY_AnGang = "暗杠";
	//三金倒
	this.HuTypePY_SanJinDao = "三金倒";
	//游金
	this.HuTypePY_DanYou = "游金";
	//双游
	this.HuTypePY_ShuangYou = "双游";
	//三游
	this.HuTypePY_SanYou = "三游";
	//抢金
	this.HuTypePY_QiangJin = "抢金";
	//四金倒
	this.HuTypePY_SiJinDao = "四金倒";
	//五金倒
	this.HuTypePY_WuJinDao = "五金倒";
	//六金倒
	this.HuTypePY_LiuJinDao = "六金倒";
	//13幺
	this.HuTypePY_ShiSanYao = "13幺";
	//对对胡
	this.HuTypePY_DDHu = "对对胡";
	//天胡
	this.HuTypePY_TianHu = "天胡";
	//平胡
	this.HuTypePY_PingHu = "平胡";
	//金番
	this.HuTypePY_Jin = "金番";
	//金雀
	this.HuTypePY_JinQue = "金雀";
	//金龙
	this.HuTypePY_JinLong = "金龙";
	//花番
	this.HuTypePY_Hua = "花番";
	//一张花
	this.HuTypePY_YiZhangHua = "一张花";
	//无花无杠
	this.HuTypePY_WHuaWGang = "无花无杠";
	//混一色
	this.HuTypePY_HunYiSe = "混一色";
	//清一色
	this.HuTypePY_QingYiSe = "清一色";
	//小炸弹
	this.HuTypePY_XiaoZhaDan = "小炸弹";
	//大炸弹
	this.HuTypePY_DaZhaDan = "大炸弹";
	//超级炸弹
	this.HuTypePY_ChaoJiZhaDan = "超级炸弹";
	//金杠
	this.HuTypePY_JinGang = "金杠";
	//地胡
	this.HuTypePY_DiHu = "地胡";
	//大对碰
	this.HuTypePY_DaDuiPeng = "大对碰";
	//大三元
	this.HuTypePY_DaSanYuan = "大三元";
	//三金游
	this.HuTypePY_SanJinYou = "三金游";
	//点炮
	this.HuTypePY_DianPao = "点炮";
	//单吊
	this.HuTypePY_DanDiao = "单吊";
	//乱风
	this.HuTypePY_LuanFeng = "乱风";
	//财神头
	this.HuTypePY_CS_Tou = "财神头";
	//三财一刻
	this.HuTypePY_SC_Ke = "三财一刻";
	//十三不靠
	this.HuTypePY_SSBK = "十三不靠";
	//十三不靠清
	this.HuTypePY_SSBK_Qing= "十三不靠清";
	//屁胡
	this.HuTypePY_PiHu = "屁胡";
	//门子
	this.HuTypePY_MenZi = "门子";
	//接刀
	this.HuTypePY_JieDao = "接刀";
	//海底捞
	this.HuTypePY_HaiDiLao= "海底捞";
	//接炮
	this.HuTypePY_JiePao= "接炮";
	//八花
	this.HuTypePY_BaHua= "八花";
	//门清
	this.HuTypePY_MenQing= "门清";
	//全风
	this.HuTypePY_QuanFeng= "全风";
	//底分
	this.HuTypePY_DiFen= "底分";
	//闲家
	this.HuTypePY_Xian= "闲家";
	//庄家
	this.HuTypePY_Zhuang= "庄家";
	//连庄
	this.HuTypePY_LianZhuang= "连庄";
	this.HuTypePinYinDict = {};
	this.HuTypePinYinDict["Hu"] = this.HuTypePY_Hu;
	this.HuTypePinYinDict["NotHu"] = this.HuTypePY_NotHu;
	this.HuTypePinYinDict["ZiMo"] = this.HuTypePY_ZiMo;
	this.HuTypePinYinDict["QGH"] = this.HuTypePY_QGH;
	this.HuTypePinYinDict["FHZ"] = this.HuTypePY_FHZ;
	this.HuTypePinYinDict["JieGang"] = this.HuTypePY_JieGang;
	this.HuTypePinYinDict["Gang"] = this.HuTypePY_Gang;
	this.HuTypePinYinDict["AnGang"] = this.HuTypePY_AnGang;
	this.HuTypePinYinDict["SanJinDao"] = this.HuTypePY_SanJinDao;
	this.HuTypePinYinDict["SiJinDao"] = this.HuTypePY_SiJinDao;
	this.HuTypePinYinDict["WuJinDao"] = this.HuTypePY_WuJinDao;
	this.HuTypePinYinDict["LiuJinDao"] = this.HuTypePY_LiuJinDao;
	this.HuTypePinYinDict["DanYou"] = this.HuTypePY_DanYou;
	this.HuTypePinYinDict["ShuangYou"] = this.HuTypePY_ShuangYou;
	this.HuTypePinYinDict["SanYou"] = this.HuTypePY_SanYou;
	this.HuTypePinYinDict["QiangJin"] = this.HuTypePY_QiangJin;
	this.HuTypePinYinDict["ShiSanYao"] = this.HuTypePY_ShiSanYao;
	this.HuTypePinYinDict["DDHu"] = this.HuTypePY_DDHu;
	this.HuTypePinYinDict["TianHu"] = this.HuTypePY_TianHu;
	this.HuTypePinYinDict["PingHu"] = this.HuTypePY_PingHu;
	this.HuTypePinYinDict["Jin"] = this.HuTypePY_Jin;
	this.HuTypePinYinDict["JinQue"] = this.HuTypePY_JinQue;
	this.HuTypePinYinDict["JinLong"] = this.HuTypePY_JinLong;
	this.HuTypePinYinDict["YiZhangHua"] = this.HuTypePY_YiZhangHua;
	this.HuTypePinYinDict["Hua"] = this.HuTypePY_Hua;
	this.HuTypePinYinDict["WHuaWGang"] = this.HuTypePY_WHuaWGang;
	this.HuTypePinYinDict["HYS"] = this.HuTypePY_HunYiSe;
	this.HuTypePinYinDict["QYS"] = this.HuTypePY_QingYiSe;
	this.HuTypePinYinDict["XiaoZhaDan"] = this.HuTypePY_XiaoZhaDan;
	this.HuTypePinYinDict["DaZhaDan"] = this.HuTypePY_DaZhaDan;
	this.HuTypePinYinDict["ChaoJiZhaDan"] = this.HuTypePY_ChaoJiZhaDan;
	this.HuTypePinYinDict["JinGang"] = this.HuTypePY_JinGang;
	this.HuTypePinYinDict["DiHu"] = this.HuTypePY_DiHu;
	this.HuTypePinYinDict["DaDuiPeng"] = this.HuTypePY_DaDuiPeng;
	this.HuTypePinYinDict["DaSanYuan"] = this.HuTypePY_DaSanYuan;
	this.HuTypePinYinDict["SanJinYou"] = this.HuTypePY_SanJinYou;
	this.HuTypePinYinDict["DanDiao"] = this.HuTypePY_DanDiao;
	this.HuTypePinYinDict["DianPao"] = this.HuTypePY_DianPao;
	this.HuTypePinYinDict["LuanFeng"] = this.HuTypePY_LuanFeng;
	this.HuTypePinYinDict["CS_Tou"] = this.HuTypePY_CS_Tou;
	this.HuTypePinYinDict["SC_Ke"] = this.HuTypePY_SC_Ke;
	this.HuTypePinYinDict["SSBK"] = this.HuTypePY_SSBK;
	this.HuTypePinYinDict["SSBK_Qing"] = this.HuTypePY_SSBK_Qing;
	this.HuTypePinYinDict["PiHu"] = this.HuTypePY_PiHu;
	this.HuTypePinYinDict["MenZi"] = this.HuTypePY_MenZi;
	this.HuTypePinYinDict["JieDao"] = this.HuTypePY_JieDao;
	this.HuTypePinYinDict["HaiDiLao"] = this.HuTypePY_HaiDiLao;
	this.HuTypePinYinDict["QuanFeng"] = this.HuTypePY_QuanFeng;
	this.HuTypePinYinDict["BaHua"] = this.HuTypePY_BaHua;
	this.HuTypePinYinDict["MenQing"] = this.HuTypePY_MenQing;
	this.HuTypePinYinDict["JiePao"] = this.HuTypePY_JiePao;
	this.HuTypePinYinDict["DiFen"] = this.HuTypePY_DiFen;
	this.HuTypePinYinDict["Xian"] = this.HuTypePY_Xian;
	this.HuTypePinYinDict["Zhuang"] = this.HuTypePY_Zhuang;
	this.HuTypePinYinDict["LianZhuang"] = this.HuTypePY_LianZhuang;
};
var QZMJ = function(){
	//参与的人数
	this.QZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.QZMJRoomPaiDun = 18;
	//总的牌数量
	this.QZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.QZMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.QZMJRoomDealCardCount = this.QZMJRoomJoinCount*this.QZMJRoomDealPerPosCardCount;
};

//-----基础---
Color.apply(qzmj_ShareDefine, []);
Common.apply(qzmj_ShareDefine, []);
GM.apply(qzmj_ShareDefine, []);
Order.apply(qzmj_ShareDefine, []);
Code.apply(qzmj_ShareDefine, []);
Timer.apply(qzmj_ShareDefine, []);
Chat.apply(qzmj_ShareDefine, []);
Model.apply(qzmj_ShareDefine, []);
Form.apply(qzmj_ShareDefine, []);
Hero.apply(qzmj_ShareDefine, []);
Effect.apply(qzmj_ShareDefine, []);
SDK.apply(qzmj_ShareDefine, []);
Mail.apply(qzmj_ShareDefine, []);
Game.apply(qzmj_ShareDefine, []);
//-----项目---
Rank.apply(qzmj_ShareDefine, []);
Room.apply(qzmj_ShareDefine, []);
MaJiang.apply(qzmj_ShareDefine, []);
QZMJ.apply(qzmj_ShareDefine, []);
/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	return qzmj_ShareDefine;
};