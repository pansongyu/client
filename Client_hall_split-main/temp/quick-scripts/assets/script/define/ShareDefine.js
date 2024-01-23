(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/define/ShareDefine.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '49681QAFPJFK6KeJrOgIXyS', 'ShareDefine', __filename);
// script/define/ShareDefine.js

"use strict";

/*
 *  ShareDefine.js
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

var ShareDefine = {};

//---------------------------基础(所有项目通用的枚举)--------------------------------------

var Common = function Common() {

	//  ------------------客户端状态-----------------------
	this.State_Prepare = 0; // 客户端初始化状态
	this.State_InitSuccess = 1; //初始化成功
	this.State_WaitLogin = 2; // 客户端未登陆状态
	this.State_Logining = 3; // 客户端登录过程中状态
	this.State_LoginPackSucess = 4; // 客户端登录过程中状态
	this.State_LoginPackFail = 5; // 客户端登录过程中状态
	this.State_Logined = 6; // 客户端已登陆状态


	//计时器显示格式
	this.ShowHourMinSec = 1;
	this.ShowMinSec = 2;
	this.ShowSec = 3;
	this.ShowDayHour = 4;
	this.ShowSecondSec = 5;
	this.YearMonthDayHourMinuteSecond = 6;
	this.DayHourMinuteSecond = 7;

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
	this.ShowAnimeTick = 10 * 1000;

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
		"b-gb": 'background: #255; color: #00ffff',
		//黑色背景,绿文本(发包)
		"b-g": 'background: #255; color: #00ff00',
		//白色背景,绿文本(连接)
		"w-g": 'background: #0; color: #007f00'
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
var GM = function GM() {
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

var SDK = function SDK() {

	//公司自己
	this.SDKType_Company = 0;
	//微信公众号授权
	this.SDKType_WeChat = 2;
	//app授权
	this.SDKType_WeChatApp = 3;
	//手机授权
	this.SDKType_Mobile = 4;
	// line 授权登录
	this.SDKType_LineApp = 5;
	// Facebook 授权登录
	this.SDKType_FacebookApp = 6;

	//H5版本sdk
	this.H5AccountSDKTypeList = [this.SDKType_WeChat];

	//APP版本sdk
	this.AppAccountSDKTypeList = [this.SDKType_WeChatApp];

	this.AppAccountSDKTypeList = [this.SDKType_Mobile];

	this.AccountSDKTypeNameDict = {};
	this.AccountSDKTypeNameDict[this.SDKType_Company] = "公司";
	this.AccountSDKTypeNameDict[this.SDKType_WeChat] = "微信公众号";
	this.AccountSDKTypeNameDict[this.SDKType_WeChatApp] = "微信APP";

	this.AccountSDKTypeNameDict[this.SDKType_Mobile] = "手机授权";

	//玩家性别
	this.HeroSex_Boy = 0;
	this.HeroSex_Girl = 1;

	this.SexTypeList = [this.HeroSex_Boy, this.HeroSex_Girl];
};

var Order = function Order() {
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

var Code = function Code() {
	//服务器下发错误系统提示
	this.ErrorSysMsg = 102;
	//服务器下发错误 非法操作
	this.NotAllow = 103;
	//房卡不足
	this.ErrorNotRoomCard = 903;
	//圈卡不足
	this.ErrorNotQuanCard = 906;
	//可以创建的房间数量不足
	this.ErrorMaxRoom = 5003;
	//没有权限 PLAYER_TUICHU_WEIPIZHUN
	this.NoPower_RoomJoinner = 5006;
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

	//亲友圈房间密码错误
	this.ErrorPassword = 5023;
	//存在相同的IP地址
	this.EXIST_SAME_IP = 5111;
	//相距位置出现问题
	this.APART_LOCATION = 5112;
	//相距位置出现问题
	this.POSITIONING_NOT_ON = 5126;

	//俱乐部创建房间配置已达上限
	this.CLUB_CreateCfgMax = 6001;
	//没有加入俱乐部不能加入该房间
	this.CLUB_NotClubJoinRoomErr = 6003;

	//不是亲友圈创造者
	this.CLUB_NOT_CREATE = 6015;
	//不是推广员
	this.CLUB_NOT_PROMOTION = 6043;
	//亲友圈不存在成员信息
	this.CLUB_NOT_EXIST_MEMBER_INFO = 6009;
	//修改归属的时候不能切换到下线
	this.CLUB_MEMBER_PROMOTION_BELONG = 6050;

	this.CLUB_MEMBER_PROMOTION_CHANGE_IS_EXIT = 6052;

	this.CLUB_MEMBER_PROMOTION_LEVEL_SHARE_LOWER = 6053;

	this.CLUB_MEMBER_PROMOTION_LEVEL_SHARE_UP = 6054;

	// 同赛事不同亲友圈不能重复拉人
	this.CLUB_PLAYER_EXIT_IN_OTHER_UNION = 6300;

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
	//短信验证失败
	this.KickOut_MobileAuthorizationFail = 10023;
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
	this.KickOut_ClientVersion = 10022;

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
var Color = function Color() {
	//红色
	this.Color_Red = new cc.Color(255, 0, 0);
	//绿色
	this.Color_Green = new cc.Color(0, 255, 0);
	//白色
	this.Color_White = new cc.Color(255, 255, 255);
	//黑色
	this.Color_Black = new cc.Color(255, 255, 255);
	//灰色
	this.Color_Gray = new cc.Color(125, 125, 125);
	//紫色
	this.Color_Purple = new cc.Color(255, 125, 255);
	//橙色
	this.Color_Orange = new cc.Color(255, 125, 0);
	//枚红色
	this.Color_RoseRed = new cc.Color(253, 62, 208);
};

var Timer = function Timer() {
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
	this.EffectiveTime = 1000 * 60 * 20;
};

var Chat = function Chat() {
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
	this.ChatTypeList = [this.ChatType_World, this.ChatType_Family, this.ChatType_Private, this.ChatType_System, this.ChatType_Team, this.ChatType_Union, this.ChatType_Horn];

	//允许所有玩家加入的聊天频道
	this.NotAllowJoinChatTypeList = [this.ChatType_Private];

	//聊天对应的字典
	this.ChatNameDict = {
		"1": "世界",
		"2": "公会",
		"3": "私聊",
		"4": "系统",
		"5": "队伍",
		"6": "阵营",
		"7": "喇叭"
	};

	this.ChatTextDict = {
		"1": "<color=#b72310>{S1}</c>：{S2}",
		"2": "<color=#6fd5ff>{S1}</c>：{S2}",
		"3": "<color=#f5f5f5>{S1}</c>：{S2}"
	};
};

var Model = function Model() {};

var Form = function Form() {

	this.Confirm = "Confirm"; // 确认，取消 2次确认类型 UIMessage.js
	this.ConfirmYN = "ConfirmYN"; // 是 否 2次确认类型 UIMessage.js
	this.ConfirmBuyGoTo = "ConfirmBuyGoTo"; // 购买,前往 UIMessage.js
	this.ConfirmOK = "ConfirmOK"; // OK 单按钮 UIMessage.js
	this.ConfirmUse = "ConfirmUse"; // 使用实例确定界面
	this.ConfirmBuy = "ConfirmBuy"; // 购买数量确定界面 UIAmountAffirm.js
	this.ConfirmDIY = "ConfirmDIY"; //自定义按钮文字
	this.ConfirmFamily = "ConfirmFamily"; // 购买,前往 UIMessage.js
	//使用frmSetUpTips界面的确认框类型列表
	this.SetUpTipFormConfirmList = ["Confirm", "ConfirmYN", "ConfirmBuyGoTo", "ConfirmOK"];

	//战队等级未到时界面控件显示类型
	this.FormWnd_EffectLock = 1;
	this.FormWnd_NotShow = 2;
};

var Hero = function Hero() {
	this.MaxPlayerNum = 20; //游戏最大人数
};

var Effect = function Effect() {
	this.EffectPosType_1 = 1; // 控件特效位置1左下
	this.EffectPosType_2 = 2; // 控件特效位置2下中
	this.EffectPosType_3 = 3; // 控件特效位置3右下

	this.EffectPosType_4 = 4; // 控件特效位置中左
	this.EffectPosType_5 = 5; // 控件特效位置中间
	this.EffectPosType_6 = 6; // 控件特效位置中右

	this.EffectPosType_7 = 7; // 控件特效位置上左
	this.EffectPosType_8 = 8; // 控件特效位置上中
	this.EffectPosType_9 = 9; // 控件特效位置上右
	this.EffectPosType_10 = 10; // 控件特效随机位置
};

var Mail = function Mail() {};

//----------------------------------------------------------------项目-------------------------------------------------------------

var Rank = function Rank() {

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

var Game = function Game() {};

var Room = function Room() {
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

	this.SetState_Init = 0;
	this.SetState_Playing = 1;
	this.SetState_End = 2;
	this.SetState_Waiting = 3;
	this.SetState_WaitingEx = 4;
	this.SetStateStringDict = {};
	this.SetStateStringDict["Init"] = this.SetState_Init;
	this.SetStateStringDict["Playing"] = this.SetState_Playing;
	this.SetStateStringDict["End"] = this.SetState_End;
	this.SetStateStringDict["Waiting"] = this.SetState_Waiting;
	this.SetStateStringDict["WaitingEx"] = this.SetState_WaitingEx;
	//仙游炸棒打牌阶段状态
	this.XYZBSetState_FaPai = 0; //发牌阶段
	this.XYZBSetState_Playing = 1; //打牌阶段
	this.XYZBSetState_End = 2; //打牌结束阶段
	this.XYZBSetStateStringDict = {};
	this.XYZBSetStateStringDict["FaPai"] = this.XYZBSetState_FaPai;
	this.XYZBSetStateStringDict["Playing"] = this.XYZBSetState_Playing;
	this.XYZBSetStateStringDict["End"] = this.XYZBSetState_End;
	//510K打牌阶段状态
	this.WSKSetState_FaPai = 0; //发牌阶段
	this.WSKSetState_FenPei = 1; //分配伙伴阶段
	this.WSKSetState_Playing = 2; //打牌阶段
	this.WSKSetState_End = 3; //打牌结束阶段
	this.WSKSetStateStringDict = {};
	this.WSKSetStateStringDict["FaPai"] = this.WSKSetState_FaPai;
	this.WSKSetStateStringDict["FenPei"] = this.WSKSetState_FenPei;
	this.WSKSetStateStringDict["Playing"] = this.WSKSetState_Playing;
	this.WSKSetStateStringDict["End"] = this.WSKSetState_End;
	//斗地主打牌阶段状态
	this.DDZSetState_FaPai = 0; //发牌阶段
	this.DDZSetState_Hog = 1; //抢地主阶段
	this.DDZSetState_AddDouble = 2; //加倍阶段
	this.DDZSetState_Playing = 3; //打牌阶段
	this.DDZSetState_End = 4; //打牌结束阶段
	this.DDZSetStateStringDict = {};
	this.DDZSetStateStringDict["FaPai"] = this.DDZSetState_FaPai;
	this.DDZSetStateStringDict["Hog"] = this.DDZSetState_Hog;
	this.DDZSetStateStringDict["AddDouble"] = this.DDZSetState_AddDouble;
	this.DDZSetStateStringDict["Playing"] = this.DDZSetState_Playing;
	this.DDZSetStateStringDict["End"] = this.DDZSetState_End;

	//福清拼罗松打牌阶段状态
	this.FQPLSSetState_FaPai = 0; //发牌阶段
	this.FQPLSSetState_Hog = 1; //抢庄状态
	this.FQPLSSetState_AddDouble = 2; //加倍阶段
	this.FQPLSSetState_Playing = 3; //比牌阶段
	this.FQPLSSetState_End = 4; //结束阶段
	this.FQPLSSetStateStringDict = {};
	this.FQPLSSetStateStringDict["FQPLS_GAME_STATUS_DEAL"] = this.FQPLSSetState_FaPai;
	this.FQPLSSetStateStringDict["FQPLS_GAME_STATUS_CONFIRMBanker"] = this.FQPLSSetState_Hog;
	this.FQPLSSetStateStringDict["FQPLS_GAME_STATUS_ADDDOUBLE"] = this.FQPLSSetState_AddDouble;
	this.FQPLSSetStateStringDict["FQPLS_GAME_STATUS_PLAYING"] = this.FQPLSSetState_Playing;
	this.FQPLSSetStateStringDict["FQPLS_GAME_STATUS_RESULT"] = this.FQPLSSetState_End;

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
var MaJiang = function MaJiang() {
	//参与的人数
	this.MJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.MJRoomPaiDun = 18;
	//自摸
	this.OpType_Hu = 1;
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
	this.OpType_MenZi = 59;
	//字一色
	this.OpType_ZiYiSe = 74;
	//接炮
	this.OpType_JiePao = 75;
	// 明搂
	this.OpType_MingLou = 78;
	//万
	this.OpType_Wan = 86;
	//条
	this.OpType_Tiao = 87;
	//筒
	this.OpType_Tong = 88;
	//天杠
	this.OpType_TianGang = 89;
	//天听
	this.OpType_TianTing = 93;
	//明杠
	this.OpType_MingGang = 103;
	//明摆
	this.OpType_MingBai = 142;
	//报定
	this.OpType_BaoDing = 143;
	//坎牌
	this.OpType_KanPai = 147;

	this.OpTypeStringDict = {};
	this.OpTypeStringDict["Hu"] = this.OpType_Hu;
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
	this.OpTypeStringDict["Wan"] = this.OpType_Wan;
	this.OpTypeStringDict["Tiao"] = this.OpType_Tiao;
	this.OpTypeStringDict["Tong"] = this.OpType_Tong;
	this.OpTypeStringDict["TianGang"] = this.OpType_TianGang;
	this.OpTypeStringDict["MingGang"] = this.OpType_MingGang;
	this.OpTypeStringDict["MingBai"] = this.OpType_MingBai;
	this.OpTypeStringDict["BaoDing"] = this.OpType_BaoDing;

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
	this.HuType_SSBK_Qing = 37;
	//屁胡
	this.HuType_PiHu = 38;
	//门子
	this.HuType_MenZi = 39;
	//接刀
	this.HuType_JieDao = 40;
	//杠上开花
	this.HuType_GSKH = 41;
	//字一色
	this.HuType_ZiYiSe = 51;
	//接炮
	this.HuType_JiePao = 52;
	//杠冲
	this.HuType_GangChong = 56;
	//一胡牌
	this.HuType_HuOne = 58;
	//二胡牌
	this.HuType_HuTwo = 59;
	//三胡牌
	this.HuType_HuThree = 60;
	//一自摸
	this.HuType_ZiMoOne = 61;
	//二自摸
	this.HuType_ZiMoTwo = 62;
	//三自摸
	this.HuType_ZiMoThree = 63;
	this.HuType_HuFour = 69; //四接炮
	this.HuType_HuFive = 70; //五接炮
	this.HuType_ZiMoFour = 71; //四自摸
	this.HuType_ZiMoFive = 72; //五自摸
	//杠上花
	this.HuType_GangShangHua = 79;

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
	this.HuTypeStringDict["GSKH"] = this.HuType_GSKH;
	this.HuTypeStringDict["ZiYiSe"] = this.HuType_ZiYiSe;
	this.HuTypeStringDict["JiePao"] = this.HuType_JiePao;
	this.HuTypeStringDict["GangChong"] = this.HuType_GangChong;
	this.HuTypeStringDict["HuOne"] = this.HuType_HuOne;
	this.HuTypeStringDict["HuTwo"] = this.HuType_HuTwo;
	this.HuTypeStringDict["HuThree"] = this.HuType_HuThree;
	this.HuTypeStringDict["ZiMoOne"] = this.HuType_ZiMoOne;
	this.HuTypeStringDict["ZiMoTwo"] = this.HuType_ZiMoTwo;
	this.HuTypeStringDict["ZiMoThree"] = this.HuType_ZiMoThree;
	this.HuTypeStringDict["GangShangHua"] = this.HuType_GangShangHua;

	//没胡
	this.HuTypePY_NotHu = "没胡";
	//胡
	this.HuTypePY_Hu = "没胡";
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
	this.HuTypePY_SSBK_Qing = "十三不靠清";
	//屁胡
	this.HuTypePY_PiHu = "屁胡";
	//门子
	this.HuTypePY_MenZi = "门子";
	//接刀
	this.HuTypePY_JieDao = "接刀";
	//海底捞
	this.HuTypePY_HaiDiLao = "海底捞";
	//接炮
	this.HuTypePY_JiePao = "接炮";
	//八花
	this.HuTypePY_BaHua = "八花";
	//门清
	this.HuTypePY_MenQing = "门清";
	//全风
	this.HuTypePY_QuanFeng = "全风";
	//炮胡
	this.HuTypePY_PaoHu = "炮胡";
	//底分
	this.HuTypePY_DiFen = "底分";
	//闲家
	this.HuTypePY_Xian = "闲家";
	//庄家
	this.HuTypePY_Zhuang = "庄家";
	//连庄
	this.HuTypePY_LianZhuang = "连庄";
	//扎码
	this.HuTypePY_ZhaMa = "扎码";

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
	this.HuTypePinYinDict["PaoHu"] = this.HuTypePY_PaoHu;
	this.HuTypePinYinDict["BaHua"] = this.HuTypePY_BaHua;
	this.HuTypePinYinDict["MenQing"] = this.HuTypePY_MenQing;
	this.HuTypePinYinDict["JiePao"] = this.HuTypePY_JiePao;
	this.HuTypePinYinDict["DiFen"] = this.HuTypePY_DiFen;
	this.HuTypePinYinDict["Xian"] = this.HuTypePY_Xian;
	this.HuTypePinYinDict["Zhuang"] = this.HuTypePY_Zhuang;
	this.HuTypePinYinDict["LianZhuang"] = this.HuTypePY_LianZhuang;
	this.HuTypePinYinDict["ZhaMa"] = this.HuTypePY_ZhaMa;
};
var LYMJ = function LYMJ() {
	//参与的人数
	this.LYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LYMJRoomPaiDun = 18;
	//总的牌数量
	this.LYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LYMJRoomDealCardCount = this.LYMJRoomJoinCount * this.LYMJRoomDealPerPosCardCount;
};
var ZJJHMJ = function ZJJHMJ() {
	//参与的人数
	this.ZJJHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZJJHMJRoomPaiDun = 18;
	//总的牌数量
	this.ZJJHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZJJHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZJJHMJRoomDealCardCount = this.ZJJHMJRoomJoinCount * this.ZJJHMJRoomDealPerPosCardCount;

	//对对胡
	this.ZJJHMJ_HuType_DaZhaDan = 1;
	//大对碰
	this.ZJJHMJ_HuType_DaDuiPeng = 2;
	//豪华对对胡
	this.ZJJHMJ_HuType_HHDDHu = 3;
	//清一色
	this.ZJJHMJ_HuType_QingYiSe = 4;
	//敲响
	this.ZJJHMJ_HuType_QiaoXiang = 5;
	//乱风
	this.ZJJHMJ_HuType_LuanFeng = 6;
	//财神头
	this.ZJJHMJ_HuType_CS_Tou = 7;
	//三财一刻
	this.ZJJHMJ_HuType_SC_Ke = 8;
	//无财
	this.ZJJHMJ_HuType_Not_Jin = 9;
	//财归1
	this.ZJJHMJ_HuType_Cai_Gui1 = 10;
	//财归2
	this.ZJJHMJ_HuType_Cai_Gui2 = 11;
	//财归3
	this.ZJJHMJ_HuType_Cai_Gui3 = 12;
	//十三不靠
	this.ZJJHMJ_HuType_SSBK = 13;
	//十三不靠七清风
	this.ZJJHMJ_HuType_SSBK_Qing = 14;
	//胡
	this.ZJJHMJ_HuType_Hu = 15;
	//全求人
	this.ZJJHMJ_HuType_QQR = 16;
	//杠爆
	this.ZJJHMJ_HuType_GangBao = 17;
	//杠上开花
	this.ZJJHMJ_HuType_GSKH = 18;
	//海底捞月
	this.ZJJHMJ_HuType_HDLY = 19;
	//地胡
	this.ZJJHMJ_HuType_DiHu = 20;
	//天胡
	this.ZJJHMJ_HuType_TianHu = 21;
	//抢杠胡
	this.ZJJHMJ_HuType_QGH = 23;

	this.ZJJHMJ_HuTypeStringDict = {};

	this.ZJJHMJ_HuTypeStringDict['DDHu'] = this.ZJJHMJ_HuType_DDHu;
	this.ZJJHMJ_HuTypeStringDict['DaDuiPeng'] = this.ZJJHMJ_HuType_DaDuiPeng;
	this.ZJJHMJ_HuTypeStringDict['HHDDHu'] = this.ZJJHMJ_HuType_HHDDHu;
	this.ZJJHMJ_HuTypeStringDict['QingYiSe'] = this.ZJJHMJ_HuType_QingYiSe;
	this.ZJJHMJ_HuTypeStringDict['QiaoXiang'] = this.ZJJHMJ_HuType_QiaoXiang;
	this.ZJJHMJ_HuTypeStringDict['LuanFeng'] = this.ZJJHMJ_HuType_LuanFeng;
	this.ZJJHMJ_HuTypeStringDict['CS_Tou'] = this.ZJJHMJ_HuType_CS_Tou;
	this.ZJJHMJ_HuTypeStringDict['SC_Ke'] = this.ZJJHMJ_HuType_SC_Ke;
	this.ZJJHMJ_HuTypeStringDict['Not_Jin'] = this.ZJJHMJ_HuType_Not_Jin;
	this.ZJJHMJ_HuTypeStringDict['Cai_Gui1'] = this.ZJJHMJ_HuType_Cai_Gui1;
	this.ZJJHMJ_HuTypeStringDict['Cai_Gui2'] = this.ZJJHMJ_HuType_Cai_Gui2;
	this.ZJJHMJ_HuTypeStringDict['Cai_Gui3'] = this.ZJJHMJ_HuType_Cai_Gui3;
	this.ZJJHMJ_HuTypeStringDict['SSBK'] = this.ZJJHMJ_HuType_SSBK;
	this.ZJJHMJ_HuTypeStringDict['SSBK_Qing'] = this.ZJJHMJ_HuType_SSBK_Qing;
	this.ZJJHMJ_HuTypeStringDict['Hu'] = this.ZJJHMJ_HuType_Hu;
	this.ZJJHMJ_HuTypeStringDict['QQR'] = this.ZJJHMJ_HuType_QQR;
	this.ZJJHMJ_HuTypeStringDict['GangBao'] = this.ZJJHMJ_HuType_GangBao;
	this.ZJJHMJ_HuTypeStringDict['GSKH'] = this.ZJJHMJ_HuType_GSKH;
	this.ZJJHMJ_HuTypeStringDict['HDLY'] = this.ZJJHMJ_HuType_HDLY;
	this.ZJJHMJ_HuTypeStringDict['DiHu'] = this.ZJJHMJ_HuType_DiHu;
	this.ZJJHMJ_HuTypeStringDict['TianHu'] = this.ZJJHMJ_HuType_TianHu;
	this.ZJJHMJ_HuTypeStringDict['QGH'] = this.ZJJHMJ_HuType_QGH;
};
var HBYXMJ = function HBYXMJ() {
	//参与的人数
	this.HBYXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HBYXMJRoomPaiDun = 13;
	//总的牌数量
	this.HBYXMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.HBYXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HBYXMJRoomDealCardCount = this.HBYXMJRoomJoinCount * this.HBYXMJRoomDealPerPosCardCount;
};
var XMMJ = function XMMJ() {
	//参与的人数
	this.XMMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XMMJRoomPaiDun = 16;
	//总的牌数量
	this.XMMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XMMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.XMMJRoomDealCardCount = this.XMMJRoomJoinCount * this.XMMJRoomDealPerPosCardCount;
};
var XYMJ = function XYMJ() {
	//参与的人数
	this.XYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XYMJRoomPaiDun = 18;
	//总的牌数量
	this.XYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XYMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.XYMJRoomDealCardCount = this.XYMJRoomJoinCount * this.XYMJRoomDealPerPosCardCount;
};
var FZMJ = function FZMJ() {
	//参与的人数
	this.FZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.FZMJRoomPaiDun = 18;
	//总的牌数量
	this.FZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.FZMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.FZMJRoomDealCardCount = this.FZMJRoomJoinCount * this.FZMJRoomDealPerPosCardCount;
};
var SMMJ = function SMMJ() {
	//参与的人数
	this.SMMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SMMJRoomPaiDun = 18;
	//总的牌数量
	this.SMMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SMMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.SMMJRoomDealCardCount = this.SMMJRoomJoinCount * this.SMMJRoomDealPerPosCardCount;
};
var QZMJ = function QZMJ() {
	//参与的人数
	this.QZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.QZMJRoomPaiDun = 18;
	//总的牌数量
	this.QZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.QZMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.QZMJRoomDealCardCount = this.QZMJRoomJoinCount * this.QZMJRoomDealPerPosCardCount;
};

var NAMJ = function NAMJ() {
	//参与的人数
	this.NAMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NAMJRoomPaiDun = 18;
	//总的牌数量
	this.NAMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NAMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.NAMJRoomDealCardCount = this.NAMJRoomJoinCount * this.NAMJRoomDealPerPosCardCount;
};

var SSMJ = function SSMJ() {
	//参与的人数
	this.SSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SSMJRoomPaiDun = 18;
	//总的牌数量
	this.SSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SSMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.SSMJRoomDealCardCount = this.SSMJRoomJoinCount * this.SSMJRoomDealPerPosCardCount;
};

var ZZMJ = function ZZMJ() {
	//参与的人数
	this.ZZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZZMJRoomPaiDun = 18;
	//总的牌数量
	this.ZZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZZMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.ZZMJRoomDealCardCount = this.ZZMJRoomJoinCount * this.ZZMJRoomDealPerPosCardCount;
};
var PTMJ = function PTMJ() {
	//参与的人数
	this.PTMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PTMJRoomPaiDun = 18;
	//总的牌数量
	this.PTMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PTMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.PTMJRoomDealCardCount = this.PTMJRoomJoinCount * this.PTMJRoomDealPerPosCardCount;
};
var NDMJ = function NDMJ() {
	//参与的人数
	this.NDMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NDMJRoomPaiDun = 18;
	//总的牌数量
	this.NDMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NDMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.NDMJRoomDealCardCount = this.NDMJRoomJoinCount * this.NDMJRoomDealPerPosCardCount;
};
var NPMJ = function NPMJ() {
	//参与的人数
	this.NPMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NPMJRoomPaiDun = 13;
	//总的牌数量
	this.NPMJRoomAllCardCount = 108;
	//发牌阶段每个人领取卡牌数量
	this.NPMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NPMJRoomDealCardCount = this.NPMJRoomJoinCount * this.NPMJRoomDealPerPosCardCount;
};
var PT13MJ = function PT13MJ() {
	//参与的人数
	this.PT13MJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PT13MJRoomPaiDun = 13;
	//总的牌数量
	this.PT13MJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PT13MJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PT13MJRoomDealCardCount = this.PT13MJRoomJoinCount * this.PT13MJRoomDealPerPosCardCount;
};
var ZJMJ = function ZJMJ() {
	//参与的人数
	this.ZJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZJMJRoomPaiDun = 13;
	//总的牌数量
	this.ZJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZJMJRoomDealCardCount = this.ZJMJRoomJoinCount * this.ZJMJRoomDealPerPosCardCount;
};
var YGMJ = function YGMJ() {
	//参与的人数
	this.YGMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YGMJRoomPaiDun = 13;
	//总的牌数量
	this.YGMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YGMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YGMJRoomDealCardCount = this.YGMJRoomJoinCount * this.YGMJRoomDealPerPosCardCount;
};
var WZMJ = function WZMJ() {
	//参与的人数
	this.WZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.WZMJRoomPaiDun = 13;
	//总的牌数量
	this.WZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.WZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.WZMJRoomDealCardCount = this.WZMJRoomJoinCount * this.WZMJRoomDealPerPosCardCount;
};
var HNZZMJ = function HNZZMJ() {
	//参与的人数
	this.HNZZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HNZZMJRoomPaiDun = 13;
	//总的牌数量
	this.HNZZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HNZZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HNZZMJRoomDealCardCount = this.HNZZMJRoomJoinCount * this.HNZZMJRoomDealPerPosCardCount;
};
var NJLHMJ = function NJLHMJ() {
	//参与的人数
	this.NJLHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NJLHMJRoomPaiDun = 13;
	//总的牌数量
	this.NJLHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NJLHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NJLHMJRoomDealCardCount = this.NJLHMJRoomJoinCount * this.NJLHMJRoomDealPerPosCardCount;
};
var ZA13MJ = function ZA13MJ() {
	//参与的人数
	this.ZA13MJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZA13MJRoomPaiDun = 13;
	//总的牌数量
	this.ZA13MJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.ZA13MJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZA13MJRoomDealCardCount = this.ZA13MJRoomJoinCount * this.ZA13MJRoomDealPerPosCardCount;
};
var ZA16MJ = function ZA16MJ() {
	//参与的人数
	this.ZA16MJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZA16MJRoomPaiDun = 16;
	//总的牌数量
	this.ZA16MJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.ZA16MJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.ZA16MJRoomDealCardCount = this.ZA16MJRoomJoinCount * this.ZA16MJRoomDealPerPosCardCount;
};
var ZASS = function ZASS() {
	//参与的人数
	this.ZASSRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZASSRoomPaiDun = 20;
	//总的牌数量
	this.ZASSRoomAllCardCount = 112;
	//发牌阶段每个人领取卡牌数量
	this.ZASSRoomDealPerPosCardCount = 21;
	//发出去的牌数量
	this.ZASSRoomDealCardCount = this.ZASSRoomJoinCount * this.ZASSRoomDealPerPosCardCount;
};
var YCMJ = function YCMJ() {
	//参与的人数
	this.YCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YCMJRoomPaiDun = 13;
	//总的牌数量
	this.YCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YCMJRoomDealCardCount = this.YCMJRoomJoinCount * this.YCMJRoomDealPerPosCardCount;
};
var HZMJ = function HZMJ() {
	//参与的人数
	this.HZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HZMJRoomPaiDun = 13;
	//总的牌数量
	this.HZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HZMJRoomDealCardCount = this.HZMJRoomJoinCount * this.HZMJRoomDealPerPosCardCount;
};
var LBHZMJ = function LBHZMJ() {
	//参与的人数
	this.LBHZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LBHZMJRoomPaiDun = 13;
	//总的牌数量
	this.LBHZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LBHZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LBHZMJRoomDealCardCount = this.LBHZMJRoomJoinCount * this.LBHZMJRoomDealPerPosCardCount;
};

var WNMJ = function WNMJ() {
	//参与的人数
	this.WNMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.WNMJRoomPaiDun = 13;
	//总的牌数量
	this.WNMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.WNMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.WNMJRoomDealCardCount = this.WNMJRoomJoinCount * this.WNMJRoomDealPerPosCardCount;
};
var WNYH = function WNYH() {
	//参与的人数
	this.WNYHRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.WNYHRoomPaiDun = 13;
	//总的牌数量
	this.WNYHRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.WNYHRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.WNYHRoomDealCardCount = this.WNYHRoomJoinCount * this.WNYHRoomDealPerPosCardCount;
};

var PXZZMJ = function PXZZMJ() {
	//参与的人数
	this.PXZZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PXZZMJRoomPaiDun = 13;
	//总的牌数量
	this.PXZZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PXZZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PXZZMJRoomDealCardCount = this.PXZZMJRoomJoinCount * this.PXZZMJRoomDealPerPosCardCount;
};
var PX258MJ = function PX258MJ() {
	//参与的人数
	this.PX258MJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PX258MJRoomPaiDun = 13;
	//总的牌数量
	this.PX258MJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PX258MJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PX258MJRoomDealCardCount = this.PX258MJRoomJoinCount * this.PX258MJRoomDealPerPosCardCount;
};
var JSYZMJ = function JSYZMJ() {
	//参与的人数
	this.JSYZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JSYZMJRoomPaiDun = 13;
	//总的牌数量
	this.JSYZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JSYZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JSYZMJRoomDealCardCount = this.JSYZMJRoomJoinCount * this.JSYZMJRoomDealPerPosCardCount;
};
var LPMJ = function LPMJ() {
	//参与的人数
	this.LPMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LPMJRoomPaiDun = 13;
	//总的牌数量
	this.LPMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LPMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LPMJRoomDealCardCount = this.LPMJRoomJoinCount * this.LPMJRoomDealPerPosCardCount;
};
var XLQMJ = function XLQMJ() {
	//参与的人数
	this.XLQMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XLQMJRoomPaiDun = 13;
	//总的牌数量
	this.XLQMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XLQMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XLQMJRoomDealCardCount = this.XLQMJRoomJoinCount * this.XLQMJRoomDealPerPosCardCount;
};
var YTMJ = function YTMJ() {
	//参与的人数
	this.YTMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YTMJRoomPaiDun = 13;
	//总的牌数量
	this.YTMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YTMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YTMJMJRoomDealCardCount = this.YTMJRoomJoinCount * this.YTMJRoomDealPerPosCardCount;
};
var QDMJ = function QDMJ() {
	//参与的人数
	this.QDMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.QDMJRoomPaiDun = 13;
	//总的牌数量
	this.QDMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.QDMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.QDMJMJRoomDealCardCount = this.QDMJRoomJoinCount * this.QDMJRoomDealPerPosCardCount;
};
var YXMJ = function YXMJ() {
	//参与的人数
	this.YXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YXMJRoomPaiDun = 13;
	//总的牌数量
	this.YXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YXMJMJRoomDealCardCount = this.YXMJRoomJoinCount * this.YXMJRoomDealPerPosCardCount;
};
var YXTDH = function YXTDH() {
	//参与的人数
	this.YXTDHRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YXTDHRoomPaiDun = 13;
	//总的牌数量
	this.YXTDHRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YXTDHRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YXTDHRoomDealCardCount = this.YXTDHRoomJoinCount * this.YXTDHRoomDealPerPosCardCount;
};
var HBMJ = function HBMJ() {
	//断门类型
	this.HBMJDingQue = { "Not": 0, "Wan": 1, "Tiao": 2, "Tong": 3 };
	//参与的人数
	this.HBMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HBMJRoomPaiDun = 13;
	//总的牌数量
	this.HBMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.HBMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HBMJRoomDealCardCount = this.HBMJRoomJoinCount * this.HBMJRoomDealPerPosCardCount;
};
var BDYXMJ = function BDYXMJ() {
	//断门类型
	this.BDYXMJDingQue = { "Not": 0, "Wan": 1, "Tiao": 2, "Tong": 3 };
	//参与的人数
	this.BDYXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.BDYXMJRoomPaiDun = 13;
	//总的牌数量
	this.BDYXMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.BDYXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.BDYXMJRoomDealCardCount = this.BDYXMJRoomJoinCount * this.BDYXMJRoomDealPerPosCardCount;
};
var HNXYMJ = function HNXYMJ() {
	//参与的人数
	this.HNXYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HNXYMJRoomPaiDun = 13;
	//总的牌数量
	this.HNXYMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.HNXYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HNXYMJRoomDealCardCount = this.HNXYMJRoomJoinCount * this.HNXYMJRoomDealPerPosCardCount;
};
var TCMJ = function TCMJ() {
	//参与的人数
	this.TCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TCMJRoomPaiDun = 13;
	//总的牌数量
	this.TCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.TCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.TCMJRoomDealCardCount = this.TCMJRoomJoinCount * this.TCMJRoomDealPerPosCardCount;
};
var PBYHMJ = function PBYHMJ() {
	//断门类型
	this.PBYHMJDingQue = { "Not": 0, "Wan": 1, "Tiao": 2, "Tong": 3 };
	//参与的人数
	this.PBYHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PBYHMJRoomPaiDun = 13;
	//总的牌数量
	this.PBYHMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.PBYHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PBYHMJRoomDealCardCount = this.PBYHMJRoomJoinCount * this.PBYHMJRoomDealPerPosCardCount;
};
var SDFJMJ = function SDFJMJ() {
	//断门类型
	this.SDFJMJDingQue = { "Not": 0, "Wan": 1, "Tiao": 2, "Tong": 3 };
	//参与的人数
	this.SDFJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SDFJMJRoomPaiDun = 13;
	//总的牌数量
	this.SDFJMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.SDFJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SDFJMJRoomDealCardCount = this.SDFJMJRoomJoinCount * this.SDFJMJRoomDealPerPosCardCount;
};
var PNYHMJ = function PNYHMJ() {
	//断门类型
	this.PNYHMJDingQue = { "Not": 0, "Wan": 1, "Tiao": 2, "Tong": 3 };
	//参与的人数
	this.PNYHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PNYHMJRoomPaiDun = 13;
	//总的牌数量
	this.PNYHMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.PNYHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PNYHMJRoomDealCardCount = this.PNYHMJRoomJoinCount * this.PNYHMJRoomDealPerPosCardCount;
};
var YHZMJ = function YHZMJ() {
	//断门类型
	this.YHZMJDingQue = { "Not": 0, "Wan": 1, "Tiao": 2, "Tong": 3 };
	//参与的人数
	this.YHZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YHZMJRoomPaiDun = 13;
	//总的牌数量
	this.YHZMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.YHZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YHZMJRoomDealCardCount = this.YHZMJRoomJoinCount * this.YHZMJRoomDealPerPosCardCount;
};
var BDMJ = function BDMJ() {
	//参与的人数
	this.BDMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.BDMJRoomPaiDun = 13;
	//总的牌数量
	this.BDMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.BDMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.BDMJRoomDealCardCount = this.BDMJRoomJoinCount * this.BDMJRoomDealPerPosCardCount;
};
var YSIZMJ = function YSIZMJ() {
	//参与的人数
	this.YSIZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YSIZMJRoomPaiDun = 13;
	//总的牌数量
	this.YSIZMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.YSIZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YSIZMJRoomDealCardCount = this.YSIZMJRoomJoinCount * this.YSIZMJRoomDealPerPosCardCount;
};
var DYMJ = function DYMJ() {
	//参与的人数
	this.DYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DYMJRoomPaiDun = 13;
	//总的牌数量
	this.DYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.DYMJRoomDealCardCount = this.DYMJRoomJoinCount * this.DYMJRoomDealPerPosCardCount;
};
var SYMJ = function SYMJ() {
	//参与的人数
	this.SYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SYMJRoomPaiDun = 13;
	//总的牌数量
	this.SYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SYMJRoomDealCardCount = this.SYMJRoomJoinCount * this.SYMJRoomDealPerPosCardCount;
};
var YCMJ = function YCMJ() {
	//参与的人数
	this.YCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YCMJRoomPaiDun = 13;
	//总的牌数量
	this.YCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YCMJRoomDealCardCount = this.YCMJRoomJoinCount * this.YCMJRoomDealPerPosCardCount;
};
var FDMJ = function FDMJ() {
	//参与的人数
	this.FDMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.FDMJRoomPaiDun = 18;
	//总的牌数量
	this.FDMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.FDMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.FDMJRoomDealCardCount = this.FDMJRoomJoinCount * this.FDMJRoomDealPerPosCardCount;
};
var ZPMJ = function ZPMJ() {
	//参与的人数
	this.ZPMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZPMJRoomPaiDun = 18;
	//总的牌数量
	this.ZPMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZPMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.ZPMJRoomDealCardCount = this.ZPMJRoomJoinCount * this.ZPMJRoomDealPerPosCardCount;
};
var TDHMJ = function TDHMJ() {
	//参与的人数
	this.TDHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TDHMJRoomPaiDun = 18;
	//总的牌数量
	this.TDHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.TDHMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.TDHMJRoomDealCardCount = this.TDHMJRoomJoinCount * this.TDHMJRoomDealPerPosCardCount;
};
var DX = function DX() {
	//参与的人数
	this.DXRoomJoinCount = 8;
	//每个人前面牌蹲数量
	this.DXRoomPaiDun = 2;
	//总的牌数量
	this.DXRoomAllCardCount = 32;
	//发牌阶段每个人领取卡牌数量
	this.DXRoomDealPerPosCardCount = 2;
	//发出去的牌数量
	this.DXRoomDealCardCount = this.DXRoomJoinCount * this.DXRoomDealPerPosCardCount;
};
var AYMJ = function AYMJ() {
	//参与的人数
	this.AYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.AYMJRoomPaiDun = 13;
	//总的牌数量
	this.AYMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.AYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.AYMJRoomDealCardCount = this.AYMJRoomJoinCount * this.AYMJRoomDealPerPosCardCount;
};
var SGMJ = function SGMJ() {
	//参与的人数
	this.SGMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SGMJRoomPaiDun = 13;
	//总的牌数量
	this.SGMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.SGMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SGMJRoomDealCardCount = this.SGMJRoomJoinCount * this.SGMJRoomDealPerPosCardCount;
};
var NAMJ = function NAMJ() {
	//参与的人数
	this.NAMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NAMJRoomPaiDun = 18;
	//总的牌数量
	this.NAMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NAMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.NAMJRoomDealCardCount = this.NAMJRoomJoinCount * this.NAMJRoomDealPerPosCardCount;
};
var TZMJ = function TZMJ() {
	//参与的人数
	this.TZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TZMJRoomPaiDun = 13;
	//总的牌数量
	this.TZMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.TZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.TZMJRoomDealCardCount = this.TZMJRoomJoinCount * this.TZMJRoomDealPerPosCardCount;
};
var NHMJ = function NHMJ() {
	//参与的人数
	this.NHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NHMJRoomPaiDun = 18;
	//总的牌数量
	this.NHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NHMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.NHMJRoomDealCardCount = this.NHMJRoomJoinCount * this.NHMJRoomDealPerPosCardCount;
};
var ZJQZMJ = function ZJQZMJ() {
	//参与的人数
	this.ZJQZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZJQZMJRoomPaiDun = 13;
	//总的牌数量
	this.ZJQZMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.ZJQZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZJQZMJRoomDealCardCount = this.ZJQZMJRoomJoinCount * this.ZJQZMJRoomDealPerPosCardCount;
};
var JXFZMJ = function JXFZMJ() {
	//参与的人数
	this.JXFZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JXFZMJRoomPaiDun = 13;
	//总的牌数量
	this.JXFZMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.JXFZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JXFZMJRoomDealCardCount = this.JXFZMJRoomJoinCount * this.JXFZMJRoomDealPerPosCardCount;
};
var HNCSMJ = function HNCSMJ() {
	//参与的人数
	this.HNCSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HNCSMJRoomPaiDun = 13;
	//总的牌数量
	this.HNCSMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.HNCSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HNCSMJRoomDealCardCount = this.HNCSMJRoomJoinCount * this.HNCSMJRoomDealPerPosCardCount;
};
var HAMJ = function HAMJ() {
	//参与的人数
	this.HAMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HAMJRoomPaiDun = 13;
	//总的牌数量
	this.HAMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HAMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HAMJRoomDealCardCount = this.HAMJRoomJoinCount * this.HAMJRoomDealPerPosCardCount;
};
var JMHHMJ = function JMHHMJ() {
	//参与的人数
	this.JMHHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JMHHMJRoomPaiDun = 13;
	//总的牌数量
	this.JMHHMJRoomAllCardCount = 112;
	//发牌阶段每个人领取卡牌数量
	this.JMHHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JMHHMJRoomDealCardCount = this.JMHHMJRoomJoinCount * this.JMHHMJRoomDealPerPosCardCount;
};
var CHMJ = function CHMJ() {
	//参与的人数
	this.CHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CHMJRoomPaiDun = 13;
	//总的牌数量
	this.CHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.CHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.CHMJRoomDealCardCount = this.CHMJRoomJoinCount * this.CHMJRoomDealPerPosCardCount;
};
var TWMJ = function TWMJ() {
	//参与的人数
	this.TWMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TWMJRoomPaiDun = 16;
	//总的牌数量
	this.TWMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.TWMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.TWMJRoomDealCardCount = this.TWMJRoomJoinCount * this.TWMJRoomDealPerPosCardCount;
};
var TZKZMJ = function TZKZMJ() {
	//参与的人数
	this.TZKZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TZKZMJRoomPaiDun = 13;
	//总的牌数量
	this.TZKZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.TZKZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.TZKZMJRoomDealCardCount = this.TZKZMJRoomJoinCount * this.TZKZMJRoomDealPerPosCardCount;
};
var DCZBMJ = function DCZBMJ() {
	//参与的人数
	this.DCZBMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DCZBMJRoomPaiDun = 13;
	//总的牌数量
	this.DCZBMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DCZBMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.DCZBMJRoomDealCardCount = this.DCZBMJRoomJoinCount * this.DCZBMJRoomDealPerPosCardCount;
};
var DCWDMJ = function DCWDMJ() {
	//参与的人数
	this.DCWDMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DCWDMJRoomPaiDun = 13;
	//总的牌数量
	this.DCWDMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DCWDMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.DCWDMJRoomDealCardCount = this.DCWDMJRoomJoinCount * this.DCWDMJRoomDealPerPosCardCount;
};
var XHMJ = function XHMJ() {
	//参与的人数
	this.XHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XHMJRoomPaiDun = 13;
	//总的牌数量
	this.XHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XHMJRoomDealCardCount = this.XHMJRoomJoinCount * this.XHMJRoomDealPerPosCardCount;
};
var XHBBMJ = function XHBBMJ() {
	//参与的人数
	this.XHBBMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XHBBMJRoomPaiDun = 13;
	//总的牌数量
	this.XHBBMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XHBBMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XHBBMJRoomDealCardCount = this.XHBBMJRoomJoinCount * this.XHBBMJRoomDealPerPosCardCount;
};
var TBZFBMJ = function TBZFBMJ() {
	//参与的人数
	this.TBZFBMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TBZFBMJRoomPaiDun = 13;
	//总的牌数量
	this.TBZFBMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.TBZFBMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.TBZFBMJRoomDealCardCount = this.TBZFBMJRoomJoinCount * this.TBZFBMJRoomDealPerPosCardCount;
};
var NYKWXMJ = function NYKWXMJ() {
	//参与的人数
	this.NYKWXMJRoomJoinCount = 3;
	//每个人前面牌蹲数量
	this.NYKWXMJRoomPaiDun = 13;
	//总的牌数量
	this.NYKWXMJRoomAllCardCount = 84;
	//发牌阶段每个人领取卡牌数量
	this.NYKWXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NYKWXMJRoomDealCardCount = this.NYKWXMJRoomJoinCount * this.NYKWXMJRoomDealPerPosCardCount;
};
var XGKWXMJ = function XGKWXMJ() {
	//参与的人数
	this.XGKWXMJRoomJoinCount = 3;
	//每个人前面牌蹲数量
	this.XGKWXMJRoomPaiDun = 13;
	//总的牌数量
	this.XGKWXMJRoomAllCardCount = 84;
	//发牌阶段每个人领取卡牌数量
	this.XGKWXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XGKWXMJRoomDealCardCount = this.XGKWXMJRoomJoinCount * this.XGKWXMJRoomDealPerPosCardCount;
};
var HNXCMJ = function HNXCMJ() {
	//参与的人数
	this.HNXCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HNXCMJRoomPaiDun = 13;
	//总的牌数量
	this.HNXCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HNXCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HNXCMJRoomDealCardCount = this.HNXCMJRoomJoinCount * this.HNXCMJRoomDealPerPosCardCount;
};
var LZMJ = function LZMJ() {
	//参与的人数
	this.LZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LZMJRoomPaiDun = 13;
	//总的牌数量
	this.LZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LZMJRoomDealCardCount = this.LZMJRoomJoinCount * this.LZMJRoomDealPerPosCardCount;
};
var JNMJ = function JNMJ() {
	//参与的人数
	this.JNMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JNMJRoomPaiDun = 13;
	//总的牌数量
	this.JNMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JNMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JNMJRoomDealCardCount = this.JNMJRoomJoinCount * this.JNMJRoomDealPerPosCardCount;
};
var FJYXMJ = function FJYXMJ() {
	//参与的人数
	this.FJYXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.FJYXMJRoomPaiDun = 13;
	//总的牌数量
	this.FJYXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.FJYXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.FJYXMJRoomDealCardCount = this.FJYXMJRoomJoinCount * this.FJYXMJRoomDealPerPosCardCount;
};
var BYZP = function BYZP() {
	//参与的人数
	this.BYZPRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.BYZPRoomPaiDun = 13;
	//总的牌数量
	this.BYZPRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.BYZPRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.BYZPRoomDealCardCount = this.BYZPRoomJoinCount * this.BYZPRoomDealPerPosCardCount;
};
var HHHGW = function HHHGW() {
	//参与的人数
	this.HHHGWRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HHHGWRoomPaiDun = 13;
	//总的牌数量
	this.HHHGWRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HHHGWRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HHHGWRoomDealCardCount = this.HHHGWRoomJoinCount * this.HHHGWRoomDealPerPosCardCount;
};
var XPPHZ = function XPPHZ() {
	//参与的人数
	this.XPPHZRoomJoinCount = 3;
	//每个人前面牌蹲数量
	this.XPPHZRoomPaiDun = 13;
	//总的牌数量
	this.XPPHZRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XPPHZRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XPPHZRoomDealCardCount = this.XPPHZRoomJoinCount * this.XPPHZRoomDealPerPosCardCount;
};
var PXPHZ = function PXPHZ() {
	//参与的人数
	this.PXPHZRoomJoinCount = 3;
	//每个人前面牌蹲数量
	this.PXPHZRoomPaiDun = 13;
	//总的牌数量
	this.PXPHZRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PXPHZRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PXPHZRoomDealCardCount = this.PXPHZRoomJoinCount * this.PXPHZRoomDealPerPosCardCount;
};
var ZJQZSK = function ZJQZSK() {
	//参与的人数
	this.ZJQZSKRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZJQZSKRoomPaiDun = 13;
	//总的牌数量
	this.ZJQZSKRoomAllCardCount = 108;
	//发牌阶段每个人领取卡牌数量
	this.ZJQZSKRoomDealPerPosCardCount = 27;
	//发出去的牌数量
	this.ZJQZSKRoomDealCardCount = this.ZJQZSKRoomJoinCount * this.ZJQZSKRoomDealPerPosCardCount;
};
var NPGZMJ = function NPGZMJ() {
	//参与的人数
	this.NPGZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NPGZMJRoomPaiDun = 13;
	//总的牌数量
	this.NPGZMJRoomAllCardCount = 108;
	//发牌阶段每个人领取卡牌数量
	this.NPGZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NPGZMJRoomDealCardCount = this.NPGZMJRoomJoinCount * this.NPGZMJRoomDealPerPosCardCount;
};
var HSMJ = function HSMJ() {
	//参与的人数
	this.HSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HSMJRoomPaiDun = 13;
	//总的牌数量
	this.HSMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.HSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HSMJRoomDealCardCount = this.HSMJRoomJoinCount * this.HSMJRoomDealPerPosCardCount;
};
var SDLYMJ = function SDLYMJ() {
	//参与的人数
	this.SDLYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SDLYMJRoomPaiDun = 13;
	//总的牌数量
	this.SDLYMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.SDLYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SDLYMJRoomDealCardCount = this.SDLYMJRoomJoinCount * this.SDLYMJRoomDealPerPosCardCount;
};
var CZMJ = function CZMJ() {
	//参与的人数
	this.CZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CZMJRoomPaiDun = 13;
	//总的牌数量
	this.CZMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.CZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.CZMJRoomDealCardCount = this.CZMJRoomJoinCount * this.CZMJRoomDealPerPosCardCount;
};
var YZMJ = function YZMJ() {
	//参与的人数
	this.YZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YZMJRoomPaiDun = 13;
	//总的牌数量
	this.YZMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.YZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YZMJRoomDealCardCount = this.YZMJRoomJoinCount * this.YZMJRoomDealPerPosCardCount;
};
var SRMJ = function SRMJ() {
	//参与的人数
	this.SRMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SRMJRoomPaiDun = 13;
	//总的牌数量
	this.SRMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.SRMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SRMJRoomDealCardCount = this.SRMJRoomJoinCount * this.SRMJRoomDealPerPosCardCount;
};
var LBMJ = function LBMJ() {
	//参与的人数
	this.LBMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LBMJRoomPaiDun = 13;
	//总的牌数量
	this.LBMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LBMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.LBMJRoomDealCardCount = this.LBMJRoomJoinCount * this.LBMJRoomDealPerPosCardCount;
};
var RQMJ = function RQMJ() {
	//参与的人数
	this.RQMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.RQMJRoomPaiDun = 13;
	//总的牌数量
	this.RQMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.RQMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.RQMJRoomDealCardCount = this.RQMJRoomJoinCount * this.RQMJRoomDealPerPosCardCount;
};
var CSMJ = function CSMJ() {
	//参与的人数
	this.CSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CSMJRoomPaiDun = 13;
	//总的牌数量
	this.CSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.CSMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.CSMJRoomDealCardCount = this.CSMJRoomJoinCount * this.CSMJRoomDealPerPosCardCount;
};
var XPLP = function XPLP() {
	//参与的人数
	this.XPLPRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XPLPRoomPaiDun = 14;
	//总的牌数量
	this.XPLPRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XPLPRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.XPLPRoomDealCardCount = this.XPLPRoomJoinCount * this.XPLPRoomDealPerPosCardCount;
};
var HZWMJ = function HZWMJ() {
	//参与的人数
	this.HZWMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HZWMJRoomPaiDun = 13;
	//总的牌数量
	this.HZWMJRoomAllCardCount = 112;
	//发牌阶段每个人领取卡牌数量
	this.HZWMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HZWMJRoomDealCardCount = this.HZWMJRoomJoinCount * this.HZWMJRoomDealPerPosCardCount;
};
var XTMJ = function XTMJ() {
	//参与的人数
	this.XTMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XTMJRoomPaiDun = 13;
	//总的牌数量
	this.XTMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.XTMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XTMJRoomDealCardCount = this.XTMJRoomJoinCount * this.XTMJRoomDealPerPosCardCount;
};

var RCMJ = function RCMJ() {
	//参与的人数
	this.RCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.RCMJRoomPaiDun = 13;
	//总的牌数量
	this.RCMJRoomAllCardCount = 112;
	//发牌阶段每个人领取卡牌数量
	this.RCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.RCMJRoomDealCardCount = this.RCMJRoomJoinCount * this.RCMJRoomDealPerPosCardCount;
};

var JDZMJ = function JDZMJ() {
	//参与的人数
	this.JDZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JDZMJRoomPaiDun = 13;
	//总的牌数量
	this.JDZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JDZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JDZMJRoomDealCardCount = this.JDZMJRoomJoinCount * this.JDZMJRoomDealPerPosCardCount;
};

var BZMJ = function BZMJ() {
	//参与的人数
	this.BZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.BZMJRoomPaiDun = 13;
	//总的牌数量
	this.BZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.BZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.BZMJRoomDealCardCount = this.BZMJRoomJoinCount * this.BZMJRoomDealPerPosCardCount;
};
var BZTDH = function BZTDH() {
	//参与的人数
	this.BZTDHRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.BZTDHRoomPaiDun = 13;
	//总的牌数量
	this.BZTDHRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.BZTDHRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.BZTDHRoomDealCardCount = this.BZTDHRoomJoinCount * this.BZTDHRoomDealPerPosCardCount;
};
var GYZJMJ = function GYZJMJ() {
	//参与的人数
	this.GYZJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GYZJMJRoomPaiDun = 13;
	//总的牌数量
	this.GYZJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GYZJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GYZJMJRoomDealCardCount = this.GYZJMJRoomJoinCount * this.GYZJMJRoomDealPerPosCardCount;
};
var DTLGFMJ = function DTLGFMJ() {
	//参与的人数
	this.DTLGFMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DTLGFMJRoomPaiDun = 13;
	//总的牌数量
	this.DTLGFMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DTLGFMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.DTLGFMJRoomDealCardCount = this.DTLGFMJRoomJoinCount * this.DTLGFMJRoomDealPerPosCardCount;
};
var SHQMMJ = function SHQMMJ() {
	//参与的人数
	this.SHQMMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SHQMMJRoomPaiDun = 13;
	//总的牌数量
	this.SHQMMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SHQMMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SHQMMJRoomDealCardCount = this.SHQMMJRoomJoinCount * this.SHQMMJRoomDealPerPosCardCount;
};
var JSTDHMJ = function JSTDHMJ() {
	//参与的人数
	this.JSTDHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JSTDHMJRoomPaiDun = 13;
	//总的牌数量
	this.JSTDHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JSTDHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JSTDHMJRoomDealCardCount = this.JSTDHMJRoomJoinCount * this.JSTDHMJRoomDealPerPosCardCount;
};
var ZGMJ = function ZGMJ() {
	//参与的人数
	this.ZGMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZGMJRoomPaiDun = 13;
	//总的牌数量
	this.ZGMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZGMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZGMJRoomDealCardCount = this.ZGMJRoomJoinCount * this.ZGMJRoomDealPerPosCardCount;
};
var NBMJ = function NBMJ() {
	//参与的人数
	this.NBMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NBMJRoomPaiDun = 13;
	//总的牌数量
	this.NBMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NBMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NBMJRoomDealCardCount = this.NBMJRoomJoinCount * this.NBMJRoomDealPerPosCardCount;
};
var SWMJ = function SWMJ() {
	//参与的人数
	this.SWMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SWMJRoomPaiDun = 13;
	//总的牌数量
	this.SWMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SWMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SWMJRoomDealCardCount = this.SWMJRoomJoinCount * this.SWMJRoomDealPerPosCardCount;
};
var GDJYMJ = function GDJYMJ() {
	//参与的人数
	this.GDJYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GDJYMJRoomPaiDun = 13;
	//总的牌数量
	this.GDJYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GDJYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GDJYMJRoomDealCardCount = this.GDJYMJRoomJoinCount * this.GDJYMJRoomDealPerPosCardCount;
};
var SQMJ = function SQMJ() {
	//参与的人数
	this.SQMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SQMJRoomPaiDun = 13;
	//总的牌数量
	this.SQMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SQMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SQMJRoomDealCardCount = this.SQMJRoomJoinCount * this.SQMJRoomDealPerPosCardCount;
};
var JYMJ = function JYMJ() {
	//参与的人数
	this.JYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JYMJRoomPaiDun = 13;
	//总的牌数量
	this.JYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JYMJRoomDealCardCount = this.JYMJRoomJoinCount * this.JYMJRoomDealPerPosCardCount;
};
var HTMJ = function HTMJ() {
	//参与的人数
	this.HTMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HTMJRoomPaiDun = 13;
	//总的牌数量
	this.HTMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HTMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HTMJRoomDealCardCount = this.HTMJRoomJoinCount * this.HTMJRoomDealPerPosCardCount;
};
var THGJMJ = function THGJMJ() {
	//参与的人数
	this.THGJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.THGJMJRoomPaiDun = 13;
	//总的牌数量
	this.THGJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.THGJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.THGJMJRoomDealCardCount = this.THGJMJRoomJoinCount * this.THGJMJRoomDealPerPosCardCount;
};
var HNPDSMJ = function HNPDSMJ() {
	//参与的人数
	this.HNPDSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HNPDSMJRoomPaiDun = 13;
	//总的牌数量
	this.HNPDSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HNPDSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HNPDSMJRoomDealCardCount = this.HNPDSMJRoomJoinCount * this.HNPDSMJRoomDealPerPosCardCount;
};
var JSXYMJ = function JSXYMJ() {
	//参与的人数
	this.JSXYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JSXYMJRoomPaiDun = 13;
	//总的牌数量
	this.JSXYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JSXYMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.JSXYMJRoomDealCardCount = this.JSXYMJRoomJoinCount * this.JSXYMJRoomDealPerPosCardCount;
};
var PZMJ = function PZMJ() {
	//参与的人数
	this.PZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PZMJRoomPaiDun = 13;
	//总的牌数量
	this.PZMJRoomAllCardCount = 120;
	//发牌阶段每个人领取卡牌数量
	this.PZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PZMJRoomDealCardCount = this.PZMJRoomJoinCount * this.PZMJRoomDealPerPosCardCount;
};
var HNJYMJ = function HNJYMJ() {
	//参与的人数
	this.HNJYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HNJYMJRoomPaiDun = 13;
	//总的牌数量
	this.HNJYMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.HNJYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HNJYMJRoomDealCardCount = this.HNJYMJRoomJoinCount * this.HNJYMJRoomDealPerPosCardCount;
};
var JSYCMJ = function JSYCMJ() {
	//参与的人数
	this.JSYCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JSYCMJRoomPaiDun = 13;
	//总的牌数量
	this.JSYCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JSYCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JSYCMJRoomDealCardCount = this.JSYCMJRoomJoinCount * this.JSYCMJRoomDealPerPosCardCount;
};
var JSSQMJ = function JSSQMJ() {
	//参与的人数
	this.JSSQMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JSSQMJRoomPaiDun = 13;
	//总的牌数量
	this.JSSQMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JSSQMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JSSQMJRoomDealCardCount = this.JSSQMJRoomJoinCount * this.JSSQMJRoomDealPerPosCardCount;
};
var JSHAMJ = function JSHAMJ() {
	//参与的人数
	this.JSHAMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JSHAMJRoomPaiDun = 13;
	//总的牌数量
	this.JSHAMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JSHAMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JSHAMJRoomDealCardCount = this.JSHAMJRoomJoinCount * this.JSHAMJRoomDealPerPosCardCount;
};
var WXMJ = function WXMJ() {
	//参与的人数
	this.WXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.WXMJRoomPaiDun = 13;
	//总的牌数量
	this.WXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.WXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.WXMJRoomDealCardCount = this.WXMJRoomJoinCount * this.WXMJRoomDealPerPosCardCount;
};
var LYGMJ = function LYGMJ() {
	//参与的人数
	this.LYGMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LYGMJRoomPaiDun = 13;
	//总的牌数量
	this.LYGMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LYGMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LYGMJRoomDealCardCount = this.LYGMJRoomJoinCount * this.LYGMJRoomDealPerPosCardCount;
};
var JSCZMJ = function JSCZMJ() {
	//参与的人数
	this.JSCZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JSCZMJRoomPaiDun = 13;
	//总的牌数量
	this.JSCZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JSCZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JSCZMJRoomDealCardCount = this.JSCZMJRoomJoinCount * this.JSCZMJRoomDealPerPosCardCount;
};
var HNJZMJ = function HNJZMJ() {
	//参与的人数
	this.HNJZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HNJZMJRoomPaiDun = 13;
	//总的牌数量
	this.HNJZMJRoomAllCardCount = 108;
	//发牌阶段每个人领取卡牌数量
	this.HNJZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HNJZMJRoomDealCardCount = this.HNJZMJRoomJoinCount * this.HNJZMJRoomDealPerPosCardCount;
};
var GYMJ = function GYMJ() {
	//参与的人数
	this.GYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GYMJRoomPaiDun = 13;
	//总的牌数量
	this.GYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GYMJRoomDealCardCount = this.GYMJRoomJoinCount * this.GYMJRoomDealPerPosCardCount;
};
var PYMJ = function PYMJ() {
	//参与的人数
	this.PYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PYMJRoomPaiDun = 13;
	//总的牌数量
	this.PYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PYMJRoomDealCardCount = this.PYMJRoomJoinCount * this.PYMJRoomDealPerPosCardCount;
};
var AHMJ = function AHMJ() {
	//参与的人数
	this.AHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.AHMJRoomPaiDun = 13;
	//总的牌数量
	this.AHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.AHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.AHMJRoomDealCardCount = this.AHMJRoomJoinCount * this.AHMJRoomDealPerPosCardCount;
};
var XZMJ = function XZMJ() {
	//参与的人数
	this.XZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XZMJRoomPaiDun = 13;
	//总的牌数量
	this.XZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XZMJRoomDealCardCount = this.XZMJRoomJoinCount * this.XZMJRoomDealPerPosCardCount;
};

var JSGYMJ = function JSGYMJ() {
	//参与的人数
	this.JSGYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JSGYMJRoomPaiDun = 13;
	//总的牌数量
	this.JSGYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JSGYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JSGYMJRoomDealCardCount = this.JSGYMJRoomJoinCount * this.JSGYMJRoomDealPerPosCardCount;
};
var AHPHZ = function AHPHZ() {
	//参与的人数
	this.AHPHZRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.AHPHZRoomPaiDun = 13;
	//总的牌数量
	this.AHPHZRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.AHPHZRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.AHPHZRoomDealCardCount = this.AHPHZRoomJoinCount * this.AHPHZRoomDealPerPosCardCount;
};
var XXMJ = function XXMJ() {
	//参与的人数
	this.XXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XXMJRoomPaiDun = 13;
	//总的牌数量
	this.XXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XXMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.XXMJRoomDealCardCount = this.XXMJRoomJoinCount * this.XXMJRoomDealPerPosCardCount;
};
var HNAYMJ = function HNAYMJ() {
	//参与的人数
	this.HNAYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HNAYMJRoomPaiDun = 13;
	//总的牌数量
	this.HNAYMJRoomAllCardCount = 137;
	//发牌阶段每个人领取卡牌数量
	this.HNAYMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.HNAYMJRoomDealCardCount = this.HNAYMJRoomJoinCount * this.HNAYMJRoomDealPerPosCardCount;
};
var NCMJ = function NCMJ() {
	//参与的人数
	this.NCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NCMJRoomPaiDun = 13;
	//总的牌数量
	this.NCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NCMJRoomDealCardCount = this.NCMJRoomJoinCount * this.NCMJRoomDealPerPosCardCount;
};
var ZKMJ = function ZKMJ() {
	//参与的人数
	this.ZKMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZKMJRoomPaiDun = 13;
	//总的牌数量
	this.ZKMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZKMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZKMJRoomDealCardCount = this.ZKMJRoomJoinCount * this.ZKMJRoomDealPerPosCardCount;
};
var JXXYMJ = function JXXYMJ() {
	//参与的人数
	this.JXXYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JXXYMJRoomPaiDun = 13;
	//总的牌数量
	this.JXXYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JXXYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JXXYMJRoomDealCardCount = this.JXXYMJRoomJoinCount * this.JXXYMJRoomDealPerPosCardCount;
};
var GAMJ = function GAMJ() {
	//参与的人数
	this.GAMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GAMJRoomPaiDun = 13;
	//总的牌数量
	this.GAMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GAMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GAMJRoomDealCardCount = this.GAMJRoomJoinCount * this.GAMJRoomDealPerPosCardCount;
};
var TGMJ = function TGMJ() {
	//参与的人数
	this.TGMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TGMJRoomPaiDun = 13;
	//总的牌数量
	this.TGMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.TGMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.TGMJRoomDealCardCount = this.TGMJRoomJoinCount * this.TGMJRoomDealPerPosCardCount;
};
var HNHBMJ = function HNHBMJ() {
	//参与的人数
	this.HNHBMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HNHBMJRoomPaiDun = 13;
	//总的牌数量
	this.HNHBMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HNHBMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HNHBMJRoomDealCardCount = this.HNHBMJRoomJoinCount * this.HNHBMJRoomDealPerPosCardCount;
};
var LHMJ = function LHMJ() {
	//参与的人数
	this.LHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LHMJRoomPaiDun = 13;
	//总的牌数量
	this.LHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LHMJRoomDealCardCount = this.LHMJRoomJoinCount * this.LHMJRoomDealPerPosCardCount;
};
var JJMJ = function JJMJ() {
	//参与的人数
	this.JJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JJMJRoomPaiDun = 13;
	//总的牌数量
	this.JJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JJMJRoomDealCardCount = this.JJMJRoomJoinCount * this.JJMJRoomDealPerPosCardCount;
};
var FYMJ = function FYMJ() {
	//参与的人数
	this.FYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.FYMJRoomPaiDun = 13;
	//总的牌数量
	this.FYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.FYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.FYMJRoomDealCardCount = this.FYMJRoomJoinCount * this.FYMJRoomDealPerPosCardCount;
};
var GDMJ = function GDMJ() {
	//参与的人数
	this.GDMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GDMJRoomPaiDun = 13;
	//总的牌数量
	this.GDMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GDMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GDMJRoomDealCardCount = this.GDMJRoomJoinCount * this.GDMJRoomDealPerPosCardCount;
};
var GSJMJ = function GSJMJ() {
	//参与的人数
	this.GSJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GSJMJRoomPaiDun = 13;
	//总的牌数量
	this.GSJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GSJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GSJMJRoomDealCardCount = this.GSJMJRoomJoinCount * this.GSJMJRoomDealPerPosCardCount;
};
var BZQZMJ = function BZQZMJ() {
	//参与的人数
	this.BZQZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.BZQZMJRoomPaiDun = 13;
	//总的牌数量
	this.BZQZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.BZQZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.BZQZMJRoomDealCardCount = this.BZQZMJRoomJoinCount * this.BZQZMJRoomDealPerPosCardCount;
};
var FYDDZMJ = function FYDDZMJ() {
	//参与的人数
	this.FYDDZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.FYDDZMJRoomPaiDun = 13;
	//总的牌数量
	this.FYDDZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.FYDDZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.FYDDZMJRoomDealCardCount = this.FYDDZMJRoomJoinCount * this.FYDDZMJRoomDealPerPosCardCount;
};
var HSTDHMJ = function HSTDHMJ() {
	//参与的人数
	this.HSTDHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HSTDHMJRoomPaiDun = 13;
	//总的牌数量
	this.HSTDHMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.HSTDHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HSTDHMJRoomDealCardCount = this.HSTDHMJRoomJoinCount * this.HSTDHMJRoomDealPerPosCardCount;
};
var CCMJ = function CCMJ() {
	//参与的人数
	this.CCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CCMJRoomPaiDun = 13;
	//总的牌数量
	this.CCMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.CCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.CCMJRoomDealCardCount = this.CCMJRoomJoinCount * this.CCMJRoomDealPerPosCardCount;
};
var PCMJ = function PCMJ() {
	//参与的人数
	this.PCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PCMJRoomPaiDun = 13;
	//总的牌数量
	this.PCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PCMJRoomDealCardCount = this.PCMJRoomJoinCount * this.PCMJRoomDealPerPosCardCount;
};
var JLMJ = function JLMJ() {
	//参与的人数
	this.JLMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JLMJRoomPaiDun = 13;
	//总的牌数量
	this.JLMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JLMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JLMJRoomDealCardCount = this.JLMJRoomJoinCount * this.JLMJRoomDealPerPosCardCount;
};
var ZJHZMJ = function ZJHZMJ() {
	//参与的人数
	this.ZJHZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZJHZMJRoomPaiDun = 13;
	//总的牌数量
	this.ZJHZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZJHZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZJHZMJRoomDealCardCount = this.ZJHZMJRoomJoinCount * this.ZJHZMJRoomDealPerPosCardCount;
};
var XJXZMJ = function XJXZMJ() {
	//参与的人数
	this.XJXZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XJXZMJRoomPaiDun = 13;
	//总的牌数量
	this.XJXZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XJXZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XJXZMJRoomDealCardCount = this.XJXZMJRoomJoinCount * this.XJXZMJRoomDealPerPosCardCount;
};
var YSMJ = function YSMJ() {
	//参与的人数
	this.YSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YSMJRoomPaiDun = 13;
	//总的牌数量
	this.YSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YSMJRoomDealCardCount = this.YSMJRoomJoinCount * this.YSMJRoomDealPerPosCardCount;
};
var ZZPH = function ZZPH() {
	//参与的人数
	this.ZZPHRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZZPHRoomPaiDun = 13;
	//总的牌数量
	this.ZZPHRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZZPHRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZZPHRoomDealCardCount = this.ZZPHRoomJoinCount * this.ZZPHRoomDealPerPosCardCount;
};
var KFMJ = function KFMJ() {
	//参与的人数
	this.KFMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.KFMJRoomPaiDun = 13;
	//总的牌数量
	this.KFMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.KFMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.KFMJRoomDealCardCount = this.KFMJRoomJoinCount * this.KFMJRoomDealPerPosCardCount;
};
var NJMJ = function NJMJ() {
	//参与的人数
	this.NJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NJMJRoomPaiDun = 13;
	//总的牌数量
	this.NJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NJMJRoomDealCardCount = this.NJMJRoomJoinCount * this.NJMJRoomDealPerPosCardCount;
};
var JAMJ = function JAMJ() {
	//参与的人数
	this.JAMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JAMJRoomPaiDun = 13;
	//总的牌数量
	this.JAMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JAMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JAMJRoomDealCardCount = this.JAMJRoomJoinCount * this.JAMJRoomDealPerPosCardCount;
};
var XJLSHMJ = function XJLSHMJ() {
	//参与的人数
	this.XJLSHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XJLSHMJRoomPaiDun = 13;
	//总的牌数量
	this.XJLSHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XJLSHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XJLSHMJRoomDealCardCount = this.XJLSHMJRoomJoinCount * this.XJLSHMJRoomDealPerPosCardCount;
};
var YZYZMJ = function YZYZMJ() {
	//参与的人数
	this.YZYZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YZYZMJRoomPaiDun = 13;
	//总的牌数量
	this.YZYZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YZYZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YZYZMJRoomDealCardCount = this.YZYZMJRoomJoinCount * this.YZYZMJRoomDealPerPosCardCount;
};
var LXMJ = function LXMJ() {
	//参与的人数
	this.LXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LXMJRoomPaiDun = 13;
	//总的牌数量
	this.LXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LXMJRoomDealCardCount = this.LXMJRoomJoinCount * this.LXMJRoomDealPerPosCardCount;
};
var CXMJ = function CXMJ() {
	//参与的人数
	this.CXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CXMJRoomPaiDun = 13;
	//总的牌数量
	this.CXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.CXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.CXMJRoomDealCardCount = this.CXMJRoomJoinCount * this.CXMJRoomDealPerPosCardCount;
};
var LS13579 = function LS13579() {
	//参与的人数
	this.LS13579RoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LS13579RoomPaiDun = 13;
	//总的牌数量
	this.LS13579RoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LS13579RoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LS13579RoomDealCardCount = this.LS13579RoomJoinCount * this.LS13579RoomDealPerPosCardCount;
};
var LSKJJMJ = function LSKJJMJ() {
	//参与的人数
	this.LSKJJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LSKJJMJRoomPaiDun = 13;
	//总的牌数量
	this.LSKJJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LSKJJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LSKJJMJRoomDealCardCount = this.LSKJJMJRoomJoinCount * this.LSKJJMJRoomDealPerPosCardCount;
};
var LSLWZMJ = function LSLWZMJ() {
	//参与的人数
	this.LSLWZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LSLWZMJRoomPaiDun = 13;
	//总的牌数量
	this.LSLWZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LSLWZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LSLWZMJRoomDealCardCount = this.LSLWZMJRoomJoinCount * this.LSLWZMJRoomDealPerPosCardCount;
};
var JCMJ = function JCMJ() {
	//参与的人数
	this.JCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JCMJRoomPaiDun = 13;
	//总的牌数量
	this.JCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JCMJRoomDealCardCount = this.JCMJRoomJoinCount * this.JCMJRoomDealPerPosCardCount;
};
var FXMJ = function FXMJ() {
	//参与的人数
	this.FXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.FXMJRoomPaiDun = 13;
	//总的牌数量
	this.FXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.FXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.FXMJRoomDealCardCount = this.FXMJRoomJoinCount * this.FXMJRoomDealPerPosCardCount;
};
var HBTDHMJ = function HBTDHMJ() {
	//参与的人数
	this.HBTDHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HBTDHMJRoomPaiDun = 13;
	//总的牌数量
	this.HBTDHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HBTDHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HBTDHMJRoomDealCardCount = this.HBTDHMJRoomJoinCount * this.HBTDHMJRoomDealPerPosCardCount;
};
var HBHBMJ = function HBHBMJ() {
	//参与的人数
	this.HBHBMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HBHBMJRoomPaiDun = 13;
	//总的牌数量
	this.HBHBMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HBHBMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HBHBMJRoomDealCardCount = this.HBHBMJRoomJoinCount * this.HBHBMJRoomDealPerPosCardCount;
};
var NXKWMJ = function NXKWMJ() {
	//参与的人数
	this.NXKWMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NXKWMJRoomPaiDun = 13;
	//总的牌数量
	this.NXKWMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NXKWMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NXKWMJRoomDealCardCount = this.NXKWMJRoomJoinCount * this.NXKWMJRoomDealPerPosCardCount;
};
var YZGYMJ = function YZGYMJ() {
	//参与的人数
	this.YZGYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YZGYMJRoomPaiDun = 13;
	//总的牌数量
	this.YZGYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YZGYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YZGYMJRoomDealCardCount = this.YZGYMJRoomJoinCount * this.YZGYMJRoomDealPerPosCardCount;
};
var SQSYMJ = function SQSYMJ() {
	//参与的人数
	this.SQSYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SQSYMJRoomPaiDun = 13;
	//总的牌数量
	this.SQSYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SQSYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SQSYMJRoomDealCardCount = this.SQSYMJRoomJoinCount * this.SQSYMJRoomDealPerPosCardCount;
};
var AQMJ = function AQMJ() {
	//参与的人数
	this.AQMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.AQMJRoomPaiDun = 13;
	//总的牌数量
	this.AQMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.AQMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.AQMJRoomDealCardCount = this.AQMJRoomJoinCount * this.AQMJRoomDealPerPosCardCount;
};
var JDMJ = function JDMJ() {
	//参与的人数
	this.JDMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JDMJRoomPaiDun = 16;
	//总的牌数量
	this.JDMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JDMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.JDMJRoomDealCardCount = this.JDMJRoomJoinCount * this.JDMJRoomDealPerPosCardCount;
};
var ZJWZMJ = function ZJWZMJ() {
	//参与的人数
	this.ZJWZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZJWZMJRoomPaiDun = 16;
	//总的牌数量
	this.ZJWZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZJWZMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.ZJWZMJRoomDealCardCount = this.ZJWZMJRoomJoinCount * this.ZJWZMJRoomDealPerPosCardCount;
};
var SZMJ = function SZMJ() {
	//参与的人数
	this.SZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SZMJRoomPaiDun = 19;
	//总的牌数量
	this.SZMJRoomAllCardCount = 152;
	//发牌阶段每个人领取卡牌数量
	this.SZMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.SZMJRoomDealCardCount = this.SZMJRoomJoinCount * this.SZMJRoomDealPerPosCardCount;
};
var ZJSHZMJ = function ZJSHZMJ() {
	//参与的人数
	this.ZJSHZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZJSHZMJRoomPaiDun = 13;
	//总的牌数量
	this.ZJSHZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZJSHZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZJSHZMJRoomDealCardCount = this.ZJSHZMJRoomJoinCount * this.ZJSHZMJRoomDealPerPosCardCount;
};
var WHMJ = function WHMJ() {
	//参与的人数
	this.WHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.WHMJRoomPaiDun = 13;
	//总的牌数量
	this.WHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.WHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.WHMJRoomDealCardCount = this.WHMJRoomJoinCount * this.WHMJRoomDealPerPosCardCount;
};
var YGJZMJ = function YGJZMJ() {
	//参与的人数
	this.YGJZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YGJZMJRoomPaiDun = 13;
	//总的牌数量
	this.YGJZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YGJZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YGJZMJRoomDealCardCount = this.YGJZMJRoomJoinCount * this.YGJZMJRoomDealPerPosCardCount;
};
var TMHHMJ = function TMHHMJ() {
	//参与的人数
	this.TMHHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TMHHMJRoomPaiDun = 13;
	//总的牌数量
	this.TMHHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.TMHHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.TMHHMJRoomDealCardCount = this.TMHHMJRoomJoinCount * this.TMHHMJRoomDealPerPosCardCount;
};
var JXMJ = function JXMJ() {
	//参与的人数
	this.JXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JXMJRoomPaiDun = 13;
	//总的牌数量
	this.JXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JXMJRoomDealCardCount = this.JXMJRoomJoinCount * this.JXMJRoomDealPerPosCardCount;
};
var QZKHMJ = function QZKHMJ() {
	//参与的人数
	this.QZKHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.QZKHMJRoomPaiDun = 13;
	//总的牌数量
	this.QZKHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.QZKHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.QZKHMJRoomDealCardCount = this.QZKHMJRoomJoinCount * this.QZKHMJRoomDealPerPosCardCount;
};
var LCMJ = function LCMJ() {
	//参与的人数
	this.LCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LCMJRoomPaiDun = 13;
	//总的牌数量
	this.LCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LCMJRoomDealCardCount = this.LCMJRoomJoinCount * this.LCMJRoomDealPerPosCardCount;
};
var QZCSMJ = function QZCSMJ() {
	//参与的人数
	this.QZCSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.QZCSMJRoomPaiDun = 13;
	//总的牌数量
	this.QZCSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.QZCSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.QZCSMJRoomDealCardCount = this.QZCSMJRoomJoinCount * this.QZCSMJRoomDealPerPosCardCount;
};
var JCHHMJ = function JCHHMJ() {
	//参与的人数
	this.JCHHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JCHHMJRoomPaiDun = 13;
	//总的牌数量
	this.JCHHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JCHHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JCHHMJRoomDealCardCount = this.JCHHMJRoomJoinCount * this.JCHHMJRoomDealPerPosCardCount;
};
var LSMJ = function LSMJ() {
	//参与的人数
	this.LSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LSMJRoomPaiDun = 13;
	//总的牌数量
	this.LSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LSMJRoomDealCardCount = this.LSMJRoomJoinCount * this.LSMJRoomDealPerPosCardCount;
};
var YSZMJ = function YSZMJ() {
	//参与的人数
	this.YSZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YSZMJRoomPaiDun = 13;
	//总的牌数量
	this.YSZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YSZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YSZMJRoomDealCardCount = this.YSZMJRoomJoinCount * this.YSZMJRoomDealPerPosCardCount;
};
var YXBZMJ = function YXBZMJ() {
	//参与的人数
	this.YXBZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YXBZMJRoomPaiDun = 13;
	//总的牌数量
	this.YXBZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YXBZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YXBZMJRoomDealCardCount = this.YXBZMJRoomJoinCount * this.YXBZMJRoomDealPerPosCardCount;
};
var YCTJMJ = function YCTJMJ() {
	//参与的人数
	this.YCTJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YCTJMJRoomPaiDun = 13;
	//总的牌数量
	this.YCTJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YCTJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YCTJMJRoomDealCardCount = this.YCTJMJRoomJoinCount * this.YCTJMJRoomDealPerPosCardCount;
};
var CQHSZMJ = function CQHSZMJ() {
	//参与的人数
	this.CQHSZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CQHSZMJRoomPaiDun = 13;
	//总的牌数量
	this.CQHSZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.CQHSZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.CQHSZMJRoomDealCardCount = this.CQHSZMJRoomJoinCount * this.CQHSZMJRoomDealPerPosCardCount;
};
var HBWHMJ = function HBWHMJ() {
	//参与的人数
	this.HBWHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HBWHMJRoomPaiDun = 13;
	//总的牌数量
	this.HBWHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HBWHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HBWHMJRoomDealCardCount = this.HBWHMJRoomJoinCount * this.HBWHMJRoomDealPerPosCardCount;
};
var JSNYZMJ = function JSNYZMJ() {
	//参与的人数
	this.JSNYZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JSNYZMJRoomPaiDun = 13;
	//总的牌数量
	this.JSNYZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JSNYZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JSNYZMJRoomDealCardCount = this.JSNYZMJRoomJoinCount * this.JSNYZMJRoomDealPerPosCardCount;
};
var ZZNSB = function ZZNSB() {
	//参与的人数
	this.ZZNSBRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZZNSBRoomPaiDun = 13;
	//总的牌数量
	this.ZZNSBRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZZNSBRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZZNSBRoomDealCardCount = this.ZZNSBRoomJoinCount * this.ZZNSBRoomDealPerPosCardCount;
};
var AK159MJ = function AK159MJ() {
	//参与的人数
	this.AK159MJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.AK159MJRoomPaiDun = 13;
	//总的牌数量
	this.AK159MJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.AK159MJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.AK159MJRoomDealCardCount = this.AK159MJRoomJoinCount * this.AK159MJRoomDealPerPosCardCount;
};
var YLDGZMJ = function YLDGZMJ() {
	//参与的人数
	this.YLDGZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YLDGZMJRoomPaiDun = 13;
	//总的牌数量
	this.YLDGZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YLDGZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YLDGZMJRoomDealCardCount = this.YLDGZMJRoomJoinCount * this.YLDGZMJRoomDealPerPosCardCount;
};
var DLQHMJ = function DLQHMJ() {
	//参与的人数
	this.DLQHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DLQHMJRoomPaiDun = 13;
	//总的牌数量
	this.DLQHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DLQHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.DLQHMJRoomDealCardCount = this.DLQHMJRoomJoinCount * this.DLQHMJRoomDealPerPosCardCount;
};
var LPSMJ = function LPSMJ() {
	//参与的人数
	this.LPSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LPSMJRoomPaiDun = 13;
	//总的牌数量
	this.LPSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LPSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LPSMJRoomDealCardCount = this.LPSMJRoomJoinCount * this.LPSMJRoomDealPerPosCardCount;
};
var LLFYMJ = function LLFYMJ() {
	//参与的人数
	this.LLFYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LLFYMJRoomPaiDun = 13;
	//总的牌数量
	this.LLFYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LLFYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LLFYMJRoomDealCardCount = this.LLFYMJRoomJoinCount * this.LLFYMJRoomDealPerPosCardCount;
};
var SXHTMJ = function SXHTMJ() {
	//参与的人数
	this.SXHTMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SXHTMJRoomPaiDun = 13;
	//总的牌数量
	this.SXHTMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SXHTMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SXHTMJRoomDealCardCount = this.SXHTMJRoomJoinCount * this.SXHTMJRoomDealPerPosCardCount;
};
var SXLSMJ = function SXLSMJ() {
	//参与的人数
	this.SXLSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SXLSMJRoomPaiDun = 13;
	//总的牌数量
	this.SXLSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SXLSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SXLSMJRoomDealCardCount = this.SXLSMJRoomJoinCount * this.SXLSMJRoomDealPerPosCardCount;
};
var DZMJ = function DZMJ() {
	//参与的人数
	this.DZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DZMJRoomPaiDun = 13;
	//总的牌数量
	this.DZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.DZMJRoomDealCardCount = this.DZMJRoomJoinCount * this.DZMJRoomDealPerPosCardCount;
};
var DKGMJ = function DKGMJ() {
	//参与的人数
	this.DKGMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DKGMJRoomPaiDun = 13;
	//总的牌数量
	this.DKGMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DKGMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.DKGMJRoomDealCardCount = this.DKGMJRoomJoinCount * this.DKGMJRoomDealPerPosCardCount;
};
var GZMJ = function GZMJ() {
	//参与的人数
	this.GZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GZMJRoomPaiDun = 13;
	//总的牌数量
	this.GZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GZMJRoomDealCardCount = this.GZMJRoomJoinCount * this.GZMJRoomDealPerPosCardCount;
};
var XFGZMJ = function XFGZMJ() {
	//参与的人数
	this.XFGZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XFGZMJRoomPaiDun = 13;
	//总的牌数量
	this.XFGZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XFGZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XFGZMJRoomDealCardCount = this.XFGZMJRoomJoinCount * this.XFGZMJRoomDealPerPosCardCount;
};
var JXNDMJ = function JXNDMJ() {
	//参与的人数
	this.JXNDMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JXNDMJRoomPaiDun = 13;
	//总的牌数量
	this.JXNDMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JXNDMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JXNDMJRoomDealCardCount = this.JXNDMJRoomJoinCount * this.JXNDMJRoomDealPerPosCardCount;
};
var GNMJ = function GNMJ() {
	//参与的人数
	this.GNMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GNMJRoomPaiDun = 13;
	//总的牌数量
	this.GNMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GNMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GNMJRoomDealCardCount = this.GNMJRoomJoinCount * this.GNMJRoomDealPerPosCardCount;
};
var HNMJ = function HNMJ() {
	//参与的人数
	this.HNMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HNMJRoomPaiDun = 13;
	//总的牌数量
	this.HNMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HNMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HNMJRoomDealCardCount = this.HNMJRoomJoinCount * this.HNMJRoomDealPerPosCardCount;
};
var MMMJ = function MMMJ() {
	//参与的人数
	this.MMMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.MMMJRoomPaiDun = 13;
	//总的牌数量
	this.MMMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.MMMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.MMMJRoomDealCardCount = this.MMMJRoomJoinCount * this.MMMJRoomDealPerPosCardCount;
};
var RJMJ = function RJMJ() {
	//参与的人数
	this.RJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.RJMJRoomPaiDun = 13;
	//总的牌数量
	this.RJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.RJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.RJMJRoomDealCardCount = this.RJMJRoomJoinCount * this.RJMJRoomDealPerPosCardCount;
};
var DNMJ = function DNMJ() {
	//参与的人数
	this.DNMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DNMJRoomPaiDun = 13;
	//总的牌数量
	this.DNMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DNMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.DNMJRoomDealCardCount = this.DNMJRoomJoinCount * this.DNMJRoomDealPerPosCardCount;
};
var LNMJ = function LNMJ() {
	//参与的人数
	this.LNMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LNMJRoomPaiDun = 13;
	//总的牌数量
	this.LNMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LNMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LNMJRoomDealCardCount = this.LNMJRoomJoinCount * this.LNMJRoomDealPerPosCardCount;
};
var FCMJ = function FCMJ() {
	//参与的人数
	this.FCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.FCMJRoomPaiDun = 13;
	//总的牌数量
	this.FCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.FCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.FCMJRoomDealCardCount = this.FCMJRoomJoinCount * this.FCMJRoomDealPerPosCardCount;
};
var HFMJ = function HFMJ() {
	//参与的人数
	this.HFMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HFMJRoomPaiDun = 13;
	//总的牌数量
	this.HFMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HFMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HFMJRoomDealCardCount = this.HFMJRoomJoinCount * this.HFMJRoomDealPerPosCardCount;
};
var MASMJ = function MASMJ() {
	//参与的人数
	this.MASMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.MASMJRoomPaiDun = 13;
	//总的牌数量
	this.MASMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.MASMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.MASMJRoomDealCardCount = this.MASMJRoomJoinCount * this.MASMJRoomDealPerPosCardCount;
};
var YJMJ = function YJMJ() {
	//参与的人数
	this.YJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YJMJRoomPaiDun = 13;
	//总的牌数量
	this.YJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YJMJRoomDealCardCount = this.YJMJRoomJoinCount * this.YJMJRoomDealPerPosCardCount;
};
var XHZMJ = function XHZMJ() {
	//参与的人数
	this.XHZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XHZMJRoomPaiDun = 13;
	//总的牌数量
	this.XHZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XHZMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.XHZMJRoomDealCardCount = this.XHZMJRoomJoinCount * this.XHZMJRoomDealPerPosCardCount;
};
var QYMJ = function QYMJ() {
	//参与的人数
	this.QYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.QYMJRoomPaiDun = 13;
	//总的牌数量
	this.QYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.QYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.QYMJRoomDealCardCount = this.QYMJRoomJoinCount * this.QYMJRoomDealPerPosCardCount;
};
var JMSKMJ = function JMSKMJ() {
	//参与的人数
	this.JMSKMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JMSKMJRoomPaiDun = 13;
	//总的牌数量
	this.JMSKMJRoomAllCardCount = 152;
	//发牌阶段每个人领取卡牌数量
	this.JMSKMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JMSKMJRoomDealCardCount = this.JMSKMJRoomJoinCount * this.JMSKMJRoomDealPerPosCardCount;
};
var XL2VS2MJ = function XL2VS2MJ() {
	//参与的人数
	this.XL2VS2MJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XL2VS2MJRoomPaiDun = 13;
	//总的牌数量
	this.XL2VS2MJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XL2VS2MJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XL2VS2MJRoomDealCardCount = this.XL2VS2MJRoomJoinCount * this.XL2VS2MJRoomDealPerPosCardCount;
};
var XJMJ = function XJMJ() {
	//参与的人数
	this.XJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XJMJRoomPaiDun = 13;
	//总的牌数量
	this.XJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XJMJRoomDealCardCount = this.XJMJRoomJoinCount * this.XJMJRoomDealPerPosCardCount;
};
var FZJXMJ = function FZJXMJ() {
	//参与的人数
	this.FZJXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.FZJXMJRoomPaiDun = 13;
	//总的牌数量
	this.FZJXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.FZJXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.FZJXMJRoomDealCardCount = this.FZJXMJRoomJoinCount * this.FZJXMJRoomDealPerPosCardCount;
};
var JMGGHMJ = function JMGGHMJ() {
	//参与的人数
	this.JMGGHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JMGGHMJRoomPaiDun = 13;
	//总的牌数量
	this.JMGGHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JMGGHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JMGGHMJRoomDealCardCount = this.JMGGHMJRoomJoinCount * this.JMGGHMJRoomDealPerPosCardCount;
};
var SCMJ = function SCMJ() {
	//参与的人数
	this.SCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SCMJRoomPaiDun = 13;
	//总的牌数量
	this.SCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SCMJRoomDealCardCount = this.SCMJRoomJoinCount * this.SCMJRoomDealPerPosCardCount;
};
var YTYJMJ = function YTYJMJ() {
	//参与的人数
	this.YTYJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YTYJMJRoomPaiDun = 13;
	//总的牌数量
	this.YTYJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YTYJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YTYJMJRoomDealCardCount = this.YTYJMJRoomJoinCount * this.YTYJMJRoomDealPerPosCardCount;
};
var YDDGMJ = function YDDGMJ() {
	//参与的人数
	this.YDDGMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YDDGMJRoomPaiDun = 13;
	//总的牌数量
	this.YDDGMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YDDGMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YDDGMJRoomDealCardCount = this.YDDGMJRoomJoinCount * this.YDDGMJRoomDealPerPosCardCount;
};
var NKBHMJ = function NKBHMJ() {
	//参与的人数
	this.NKBHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NKBHMJRoomPaiDun = 13;
	//总的牌数量
	this.NKBHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NKBHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NKBHMJRoomDealCardCount = this.NKBHMJRoomJoinCount * this.NKBHMJRoomDealPerPosCardCount;
};
var LKMJ = function LKMJ() {
	//参与的人数
	this.LKMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LKMJRoomPaiDun = 13;
	//总的牌数量
	this.LKMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LKMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LKMJRoomDealCardCount = this.LKMJRoomJoinCount * this.LKMJRoomDealPerPosCardCount;
};
var JZMJ = function JZMJ() {
	//参与的人数
	this.JZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JZMJRoomPaiDun = 13;
	//总的牌数量
	this.JZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JZMJRoomDealCardCount = this.JZMJRoomJoinCount * this.JZMJRoomDealPerPosCardCount;
};
var LAMJ = function LAMJ() {
	//参与的人数
	this.LAMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LAMJRoomPaiDun = 13;
	//总的牌数量
	this.LAMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LAMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LAMJRoomDealCardCount = this.LAMJRoomJoinCount * this.LAMJRoomDealPerPosCardCount;
};
var XYXMJ = function XYXMJ() {
	//参与的人数
	this.XYXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XYXMJRoomPaiDun = 13;
	//总的牌数量
	this.XYXMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.XYXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XYXMJRoomDealCardCount = this.XYXMJRoomJoinCount * this.XYXMJRoomDealPerPosCardCount;
};
var FZGCMJ = function FZGCMJ() {
	//参与的人数
	this.FZGCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.FZGCMJRoomPaiDun = 13;
	//总的牌数量
	this.FZGCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.FZGCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.FZGCMJRoomDealCardCount = this.FZGCMJRoomJoinCount * this.FZGCMJRoomDealPerPosCardCount;
};
var XXFQMJ = function XXFQMJ() {
	//参与的人数
	this.XXFQMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XXFQMJRoomPaiDun = 13;
	//总的牌数量
	this.XXFQMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XXFQMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XXFQMJRoomDealCardCount = this.XXFQMJRoomJoinCount * this.XXFQMJRoomDealPerPosCardCount;
};
var MZMJ = function MZMJ() {
	//参与的人数
	this.MZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.MZMJRoomPaiDun = 13;
	//总的牌数量
	this.MZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.MZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.MZMJRoomDealCardCount = this.MZMJRoomJoinCount * this.MZMJRoomDealPerPosCardCount;
};
var AHHNMJ = function AHHNMJ() {
	//参与的人数
	this.AHHNMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.AHHNMJRoomPaiDun = 13;
	//总的牌数量
	this.AHHNMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.AHHNMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.AHHNMJRoomDealCardCount = this.AHHNMJRoomJoinCount * this.AHHNMJRoomDealPerPosCardCount;
};
var LYGCMJ = function LYGCMJ() {
	//参与的人数
	this.LYGCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LYGCMJRoomPaiDun = 13;
	//总的牌数量
	this.LYGCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LYGCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LYGCMJRoomDealCardCount = this.LYGCMJRoomJoinCount * this.LYGCMJRoomDealPerPosCardCount;
};
var DXBJMJ = function DXBJMJ() {
	//参与的人数
	this.DXBJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DXBJMJRoomPaiDun = 13;
	//总的牌数量
	this.DXBJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DXBJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.DXBJMJRoomDealCardCount = this.DXBJMJRoomJoinCount * this.DXBJMJRoomDealPerPosCardCount;
};
var GCBGMJ = function GCBGMJ() {
	//参与的人数
	this.GCBGMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GCBGMJRoomPaiDun = 13;
	//总的牌数量
	this.GCBGMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GCBGMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GCBGMJRoomDealCardCount = this.GCBGMJRoomJoinCount * this.GCBGMJRoomDealPerPosCardCount;
};
var TXMJ = function TXMJ() {
	//参与的人数
	this.TXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TXMJRoomPaiDun = 13;
	//总的牌数量
	this.TXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.TXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.TXMJRoomDealCardCount = this.TXMJRoomJoinCount * this.TXMJRoomDealPerPosCardCount;
};
var ZKLYMJ = function ZKLYMJ() {
	//参与的人数
	this.ZKLYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZKLYMJRoomPaiDun = 13;
	//总的牌数量
	this.ZKLYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZKLYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZKLYMJRoomDealCardCount = this.ZKLYMJRoomJoinCount * this.ZKLYMJRoomDealPerPosCardCount;
};
var XYSCMJ = function XYSCMJ() {
	//参与的人数
	this.XYSCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XYSCMJRoomPaiDun = 13;
	//总的牌数量
	this.XYSCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XYSCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XYSCMJRoomDealCardCount = this.XYSCMJRoomJoinCount * this.XYSCMJRoomDealPerPosCardCount;
};
var GSMJ = function GSMJ() {
	//参与的人数
	this.GSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GSMJRoomPaiDun = 13;
	//总的牌数量
	this.GSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GSMJRoomDealCardCount = this.GSMJRoomJoinCount * this.GSMJRoomDealPerPosCardCount;
};
var SXMMJ = function SXMMJ() {
	//参与的人数
	this.SXMMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SXMMJRoomPaiDun = 13;
	//总的牌数量
	this.SXMMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SXMMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SXMMJRoomDealCardCount = this.SXMMJRoomJoinCount * this.SXMMJRoomDealPerPosCardCount;
};
var GXMJ = function GXMJ() {
	//参与的人数
	this.GXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GXMJRoomPaiDun = 13;
	//总的牌数量
	this.GXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GXMJRoomDealCardCount = this.GXMJRoomJoinCount * this.GXMJRoomDealPerPosCardCount;
};
var PDSYXMJ = function PDSYXMJ() {
	//参与的人数
	this.PDSYXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PDSYXMJRoomPaiDun = 13;
	//总的牌数量
	this.PDSYXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PDSYXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PDSYXMJRoomDealCardCount = this.PDSYXMJRoomJoinCount * this.PDSYXMJRoomDealPerPosCardCount;
};
var ZMDMJ = function ZMDMJ() {
	//参与的人数
	this.ZMDMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZMDMJRoomPaiDun = 13;
	//总的牌数量
	this.ZMDMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZMDMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZMDMJRoomDealCardCount = this.ZMDMJRoomJoinCount * this.ZMDMJRoomDealPerPosCardCount;
};
var ZXMJ = function ZXMJ() {
	//参与的人数
	this.ZXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZXMJRoomPaiDun = 13;
	//总的牌数量
	this.ZXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZXMJRoomDealCardCount = this.ZXMJRoomJoinCount * this.ZXMJRoomDealPerPosCardCount;
};
var NZMJ = function NZMJ() {
	//参与的人数
	this.NZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NZMJRoomPaiDun = 13;
	//总的牌数量
	this.NZMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.NZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NZMJRoomDealCardCount = this.NZMJRoomJoinCount * this.NZMJRoomDealPerPosCardCount;
};
var XYGSMJ = function XYGSMJ() {
	//参与的人数
	this.XYGSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XYGSMJRoomPaiDun = 13;
	//总的牌数量
	this.XYGSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XYGSMJRoomDealPerPosCardCount = 14;
	//发出去的牌数量
	this.XYGSMJRoomDealCardCount = this.XYGSMJRoomJoinCount * this.XYGSMJRoomDealPerPosCardCount;
};
var WGFHMJ = function WGFHMJ() {
	//参与的人数
	this.WGFHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.WGFHMJRoomPaiDun = 13;
	//总的牌数量
	this.WGFHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.WGFHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.WGFHMJRoomDealCardCount = this.WGFHMJRoomJoinCount * this.WGFHMJRoomDealPerPosCardCount;
};
var DZSJZMJ = function DZSJZMJ() {
	//参与的人数
	this.DZSJZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DZSJZMJRoomPaiDun = 13;
	//总的牌数量
	this.DZSJZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DZSJZMJRoomDealPerPosCardCount = 19;
	//发出去的牌数量
	this.DZSJZMJRoomDealCardCount = this.DZSJZMJRoomJoinCount * this.DZSJZMJRoomDealPerPosCardCount;
};
var SSPMJ = function SSPMJ() {
	//参与的人数
	this.SSPMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SSPMJRoomPaiDun = 13;
	//总的牌数量
	this.SSPMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.SSPMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SSPMJRoomDealCardCount = this.SSPMJRoomJoinCount * this.SSPMJRoomDealPerPosCardCount;
};
var A3PK = function A3PK() {
	//参与的人数
	this.A3PKRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.A3PKRoomPaiDun = 13;
	//总的牌数量
	this.A3PKRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.A3PKRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.A3PKRoomDealCardCount = this.A3PKRoomJoinCount * this.A3PKRoomDealPerPosCardCount;
};
var GLZP = function GLZP() {
	//参与的人数
	this.GLZPRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GLZPRoomPaiDun = 13;
	//总的牌数量
	this.GLZPRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GLZPRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GLZPRoomDealCardCount = this.GLZPRoomJoinCount * this.GLZPRoomDealPerPosCardCount;
};
var YXSRDDZ = function YXSRDDZ() {
	//参与的人数
	this.YXSRDDZRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YXSRDDZRoomPaiDun = 13;
	//总的牌数量
	this.YXSRDDZRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YXSRDDZRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YXSRDDZRoomDealCardCount = this.YXSRDDZRoomJoinCount * this.YXSRDDZRoomDealPerPosCardCount;
};
var YXDDZ = function YXDDZ() {
	//参与的人数
	this.YXDDZRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YXDDZRoomPaiDun = 13;
	//总的牌数量
	this.YXDDZRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YXDDZRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YXDDZRoomDealCardCount = this.YXDDZRoomJoinCount * this.YXDDZRoomDealPerPosCardCount;
};
var GXCDD = function GXCDD() {
	//参与的人数
	this.GXCDDRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GXCDDRoomPaiDun = 13;
	//总的牌数量
	this.GXCDDRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GXCDDRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GXCDDRoomDealCardCount = this.GXCDDRoomJoinCount * this.GXCDDRoomDealPerPosCardCount;
};
var XYXXMJ = function XYXXMJ() {
	//参与的人数
	this.XYXXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XYXXMJRoomPaiDun = 13;
	//总的牌数量
	this.XYXXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XYXXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XYXXMJRoomDealCardCount = this.XYXXMJRoomJoinCount * this.XYXXMJRoomDealPerPosCardCount;
};
var DEMOMJ = function DEMOMJ() {
	//参与的人数
	this.DEMOMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DEMOMJRoomPaiDun = 13;
	//总的牌数量
	this.DEMOMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DEMOMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.DEMOMJRoomDealCardCount = this.DEMOMJRoomJoinCount * this.DEMOMJRoomDealPerPosCardCount;
};
var XXTDHMJ = function XXTDHMJ() {
	//参与的人数
	this.XXTDHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XXTDHMJRoomPaiDun = 13;
	//总的牌数量
	this.XXTDHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XXTDHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XXTDHMJRoomDealCardCount = this.XXTDHMJRoomJoinCount * this.XXTDHMJRoomDealPerPosCardCount;
};
var NYTHMJ = function NYTHMJ() {
	//参与的人数
	this.NYTHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NYTHMJRoomPaiDun = 13;
	//总的牌数量
	this.NYTHMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.NYTHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NYTHMJRoomDealCardCount = this.NYTHMJRoomJoinCount * this.NYTHMJRoomDealPerPosCardCount;
};
var FCTDHMJ = function FCTDHMJ() {
	//参与的人数
	this.FCTDHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.FCTDHMJRoomPaiDun = 13;
	//总的牌数量
	this.FCTDHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.FCTDHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.FCTDHMJRoomDealCardCount = this.FCTDHMJRoomJoinCount * this.FCTDHMJRoomDealPerPosCardCount;
};
var HZJDMJ = function HZJDMJ() {
	//参与的人数
	this.HZJDMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HZJDMJRoomPaiDun = 16;
	//总的牌数量
	this.HZJDMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HZJDMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.HZJDMJRoomDealCardCount = this.HZJDMJRoomJoinCount * this.HZJDMJRoomDealPerPosCardCount;
};
var XYHCMJ = function XYHCMJ() {
	//参与的人数
	this.XYHCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XYHCMJRoomPaiDun = 13;
	//总的牌数量
	this.XYHCMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.XYHCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XYHCMJRoomDealCardCount = this.XYHCMJRoomJoinCount * this.XYHCMJRoomDealPerPosCardCount;
};
var YHMJ = function YHMJ() {
	//参与的人数
	this.YHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YHMJRoomPaiDun = 13;
	//总的牌数量
	this.YHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YHMJRoomDealCardCount = this.YHMJRoomJoinCount * this.YHMJRoomDealPerPosCardCount;
};
var GLQZMJ = function GLQZMJ() {
	//参与的人数
	this.GLQZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GLQZMJRoomPaiDun = 13;
	//总的牌数量
	this.GLQZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GLQZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GLQZMJRoomDealCardCount = this.GLQZMJRoomJoinCount * this.GLQZMJRoomDealPerPosCardCount;
};
var YYMJ = function YYMJ() {
	//参与的人数
	this.YYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YYMJRoomPaiDun = 13;
	//总的牌数量
	this.YYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YYMJRoomDealCardCount = this.YYMJRoomJoinCount * this.YYMJRoomDealPerPosCardCount;
};
var YZCHZ = function YZCHZ() {
	//参与的人数
	this.YZCHZRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YZCHZRoomPaiDun = 13;
	//总的牌数量
	this.YZCHZRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YZCHZRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YZCHZRoomDealCardCount = this.YZCHZRoomJoinCount * this.YZCHZRoomDealPerPosCardCount;
};
var QJFXJMJ = function QJFXJMJ() {
	//参与的人数
	this.QJFXJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.QJFXJMJRoomPaiDun = 13;
	//总的牌数量
	this.QJFXJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.QJFXJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.QJFXJMJRoomDealCardCount = this.QJFXJMJRoomJoinCount * this.QJFXJMJRoomDealPerPosCardCount;
};
var TJMJ = function TJMJ() {
	//参与的人数
	this.TJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TJMJRoomPaiDun = 13;
	//总的牌数量
	this.TJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.TJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.TJMJRoomDealCardCount = this.TJMJRoomJoinCount * this.TJMJRoomDealPerPosCardCount;
};
var YJNXMJ = function YJNXMJ() {
	//参与的人数
	this.YJNXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YJNXMJRoomPaiDun = 13;
	//总的牌数量
	this.YJNXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YJNXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YJNXMJRoomDealCardCount = this.YJNXMJRoomJoinCount * this.YJNXMJRoomDealPerPosCardCount;
};
var GFT258MJ = function GFT258MJ() {
	//参与的人数
	this.GFT258MJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GFT258MJRoomPaiDun = 13;
	//总的牌数量
	this.GFT258MJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GFT258MJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GFT258MJRoomDealCardCount = this.GFT258MJRoomJoinCount * this.GFT258MJRoomDealPerPosCardCount;
};
var HNSYMJ = function HNSYMJ() {
	//参与的人数
	this.HNSYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HNSYMJRoomPaiDun = 13;
	//总的牌数量
	this.HNSYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HNSYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HNSYMJRoomDealCardCount = this.HNSYMJRoomJoinCount * this.HNSYMJRoomDealPerPosCardCount;
};
var XSMJ = function XSMJ() {
	//参与的人数
	this.XSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XSMJRoomPaiDun = 13;
	//总的牌数量
	this.XSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XSMJRoomDealCardCount = this.XSMJRoomJoinCount * this.XSMJRoomDealPerPosCardCount;
};

var XTLHMJ = function XTLHMJ() {
	//参与的人数
	this.XTLHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XTLHMJRoomPaiDun = 13;
	//总的牌数量
	this.XTLHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XTLHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XTLHMJRoomDealCardCount = this.XTLHMJRoomJoinCount * this.XTLHMJRoomDealPerPosCardCount;
};
var GSLZMJ = function GSLZMJ() {
	//参与的人数
	this.GSLZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GSLZMJRoomPaiDun = 13;
	//总的牌数量
	this.GSLZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GSLZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GSLZMJRoomDealCardCount = this.GSLZMJRoomJoinCount * this.GSLZMJRoomDealPerPosCardCount;
};
var LFPHMJ = function LFPHMJ() {
	//参与的人数
	this.LFPHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LFPHMJRoomPaiDun = 13;
	//总的牌数量
	this.LFPHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LFPHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LFPHMJRoomDealCardCount = this.LFPHMJRoomJoinCount * this.LFPHMJRoomDealPerPosCardCount;
};
var HYLYMJ = function HYLYMJ() {
	//参与的人数
	this.HYLYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HYLYMJRoomPaiDun = 13;
	//总的牌数量
	this.HYLYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HYLYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HYLYMJRoomDealCardCount = this.HYLYMJRoomJoinCount * this.HYLYMJRoomDealPerPosCardCount;
};
var HNYJMJ = function HNYJMJ() {
	//参与的人数
	this.HNYJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HNYJMJRoomPaiDun = 13;
	//总的牌数量
	this.HNYJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HNYJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HNYJMJRoomDealCardCount = this.HNYJMJRoomJoinCount * this.HNYJMJRoomDealPerPosCardCount;
};
var TJTJMJ = function TJTJMJ() {
	//参与的人数
	this.TJTJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TJTJMJRoomPaiDun = 13;
	//总的牌数量
	this.TJTJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.TJTJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.TJTJMJRoomDealCardCount = this.TJTJMJRoomJoinCount * this.TJTJMJRoomDealPerPosCardCount;
};
var NMGYZMJ = function NMGYZMJ() {
	//参与的人数
	this.NMGYZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NMGYZMJRoomPaiDun = 13;
	//总的牌数量
	this.NMGYZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NMGYZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NMGYZMJRoomDealCardCount = this.NMGYZMJRoomJoinCount * this.NMGYZMJRoomDealPerPosCardCount;
};
var BAMJ = function BAMJ() {
	//参与的人数
	this.BAMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.BAMJRoomPaiDun = 13;
	//总的牌数量
	this.BAMJRoomAllCardCount = 152;
	//发牌阶段每个人领取卡牌数量
	this.BAMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.BAMJRoomDealCardCount = this.BAMJRoomJoinCount * this.BAMJRoomDealPerPosCardCount;
};
var AHHBMJ = function AHHBMJ() {
	//参与的人数
	this.AHHBMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.AHHBMJRoomPaiDun = 13;
	//总的牌数量
	this.AHHBMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.AHHBMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.AHHBMJRoomDealCardCount = this.AHHBMJRoomJoinCount * this.AHHBMJRoomDealPerPosCardCount;
};
var SFPHMJ = function SFPHMJ() {
	//参与的人数
	this.SFPHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SFPHMJRoomPaiDun = 13;
	//总的牌数量
	this.SFPHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SFPHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SFPHMJRoomDealCardCount = this.SFPHMJRoomJoinCount * this.SFPHMJRoomDealPerPosCardCount;
};
var JCAHMJ = function JCAHMJ() {
	//参与的人数
	this.JCAHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JCAHMJRoomPaiDun = 13;
	//总的牌数量
	this.JCAHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JCAHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JCAHMJRoomDealCardCount = this.JCAHMJRoomJoinCount * this.JCAHMJRoomDealPerPosCardCount;
};
var XNMJ = function XNMJ() {
	//参与的人数
	this.XNMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XNMJRoomPaiDun = 13;
	//总的牌数量
	this.XNMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XNMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XNMJRoomDealCardCount = this.XNMJRoomJoinCount * this.XNMJRoomDealPerPosCardCount;
};
var HYHSMJ = function HYHSMJ() {
	//参与的人数
	this.HYHSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HYHSMJRoomPaiDun = 13;
	//总的牌数量
	this.HYHSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HYHSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HYHSMJRoomDealCardCount = this.HYHSMJRoomJoinCount * this.HYHSMJRoomDealPerPosCardCount;
};
var JSMJ = function JSMJ() {
	//参与的人数
	this.JSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JSMJRoomPaiDun = 13;
	//总的牌数量
	this.JSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JSMJRoomDealCardCount = this.JSMJRoomJoinCount * this.JSMJRoomDealPerPosCardCount;
};
var SDJNMJ = function SDJNMJ() {
	//参与的人数
	this.SDJNMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SDJNMJRoomPaiDun = 13;
	//总的牌数量
	this.SDJNMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SDJNMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SDJNMJRoomDealCardCount = this.SDJNMJRoomJoinCount * this.SDJNMJRoomDealPerPosCardCount;
};
var ZCMJ = function ZCMJ() {
	//参与的人数
	this.ZCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZCMJRoomPaiDun = 13;
	//总的牌数量
	this.ZCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZCMJRoomDealCardCount = this.ZCMJRoomJoinCount * this.ZCMJRoomDealPerPosCardCount;
};
var NYXXMJ = function NYXXMJ() {
	//参与的人数
	this.NYXXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NYXXMJRoomPaiDun = 13;
	//总的牌数量
	this.NYXXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NYXXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NYXXMJRoomDealCardCount = this.NYXXMJRoomJoinCount * this.NYXXMJRoomDealPerPosCardCount;
};
var TBHMJ = function TBHMJ() {
	//参与的人数
	this.TBHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TBHMJRoomPaiDun = 13;
	//总的牌数量
	this.TBHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.TBHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.TBHMJRoomDealCardCount = this.TBHMJRoomJoinCount * this.TBHMJRoomDealPerPosCardCount;
};
var PDSLSMJ = function PDSLSMJ() {
	//参与的人数
	this.PDSLSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PDSLSMJRoomPaiDun = 13;
	//总的牌数量
	this.PDSLSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PDSLSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PDSLSMJRoomDealCardCount = this.PDSLSMJRoomJoinCount * this.PDSLSMJRoomDealPerPosCardCount;
};
var NXMJ = function NXMJ() {
	//参与的人数
	this.NXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NXMJRoomPaiDun = 13;
	//总的牌数量
	this.NXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NXMJRoomDealCardCount = this.NXMJRoomJoinCount * this.NXMJRoomDealPerPosCardCount;
};
var RZMJ = function RZMJ() {
	//参与的人数
	this.RZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.RZMJRoomPaiDun = 13;
	//总的牌数量
	this.RZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.RZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.RZMJRoomDealCardCount = this.RZMJRoomJoinCount * this.RZMJRoomDealPerPosCardCount;
};
var CZDZMJ = function CZDZMJ() {
	//参与的人数
	this.CZDZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CZDZMJRoomPaiDun = 13;
	//总的牌数量
	this.CZDZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.CZDZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.CZDZMJRoomDealCardCount = this.CZDZMJRoomJoinCount * this.CZDZMJRoomDealPerPosCardCount;
};
var JAWZ = function JAWZ() {
	//参与的人数
	this.JAWZRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JAWZRoomPaiDun = 13;
	//总的牌数量
	this.JAWZRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JAWZRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JAWZRoomDealCardCount = this.JAWZRoomJoinCount * this.JAWZRoomDealPerPosCardCount;
};
var THBBZ = function THBBZ() {
	//参与的人数
	this.THBBZRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.THBBZRoomPaiDun = 13;
	//总的牌数量
	this.THBBZRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.THBBZRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.THBBZRoomDealCardCount = this.THBBZRoomJoinCount * this.THBBZRoomDealPerPosCardCount;
};
var ZGQZMJ = function ZGQZMJ() {
	//参与的人数
	this.ZGQZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZGQZMJRoomPaiDun = 13;
	//总的牌数量
	this.ZGQZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZGQZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZGQZMJRoomDealCardCount = this.ZGQZMJRoomJoinCount * this.ZGQZMJRoomDealPerPosCardCount;
};
var SD = function SD() {
	//参与的人数
	this.SDRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SDRoomPaiDun = 13;
	//总的牌数量
	this.SDRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SDRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SDRoomDealCardCount = this.SDRoomJoinCount * this.SDRoomDealPerPosCardCount;
};
var SQYCMJ = function SQYCMJ() {
	//参与的人数
	this.SQYCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SQYCMJRoomPaiDun = 13;
	//总的牌数量
	this.SQYCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SQYCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SQYCMJRoomDealCardCount = this.SQYCMJRoomJoinCount * this.SQYCMJRoomDealPerPosCardCount;
};
var MYMJ = function MYMJ() {
	//参与的人数
	this.MYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.MYMJRoomPaiDun = 13;
	//总的牌数量
	this.MYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.MYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.MYMJRoomDealCardCount = this.MYMJRoomJoinCount * this.MYMJRoomDealPerPosCardCount;
};
var MYXZMJ = function MYXZMJ() {
	//参与的人数
	this.MYXZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.MYXZMJRoomPaiDun = 13;
	//总的牌数量
	this.MYXZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.MYXZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.MYXZMJRoomDealCardCount = this.MYZMJRoomJoinCount * this.MYXZMJRoomDealPerPosCardCount;
};
var PDSJXMJ = function PDSJXMJ() {
	//参与的人数
	this.PDSJXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PDSJXMJRoomPaiDun = 13;
	//总的牌数量
	this.PDSJXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PDSJXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PDSJXMJRoomDealCardCount = this.PDSJXMJRoomJoinCount * this.PDSJXMJRoomDealPerPosCardCount;
};
var AFMJ = function AFMJ() {
	//参与的人数
	this.AFMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.AFMJRoomPaiDun = 13;
	//总的牌数量
	this.AFMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.AFMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.AFMJRoomDealCardCount = this.AFMJRoomJoinCount * this.AFMJRoomDealPerPosCardCount;
};
var STSTMJ = function STSTMJ() {
	//参与的人数
	this.STSTMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.STSTMJRoomPaiDun = 13;
	//总的牌数量
	this.STSTMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.STSTMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.STSTMJRoomDealCardCount = this.STSTMJRoomJoinCount * this.STSTMJRoomDealPerPosCardCount;
};
var YFCGMJ = function YFCGMJ() {
	//参与的人数
	this.YFCGMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YFCGMJRoomPaiDun = 13;
	//总的牌数量
	this.YFCGMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YFCGMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YFCGMJRoomDealCardCount = this.YFCGMJRoomJoinCount * this.YFCGMJRoomDealPerPosCardCount;
};
var STMJ = function STMJ() {
	//参与的人数
	this.STMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.STMJRoomPaiDun = 13;
	//总的牌数量
	this.STMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.STMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.STMJRoomDealCardCount = this.STMJRoomJoinCount * this.STMJRoomDealPerPosCardCount;
};
var QCDG = function QCDG() {
	//参与的人数
	this.QCDGRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.QCDGRoomPaiDun = 13;
	//总的牌数量
	this.QCDGRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.QCDGRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.QCDGRoomDealCardCount = this.QCDGRoomJoinCount * this.QCDGRoomDealPerPosCardCount;
};
var QYPHMJ = function QYPHMJ() {
	//参与的人数
	this.QYPHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.QYPHMJRoomPaiDun = 13;
	//总的牌数量
	this.QYPHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.QYPHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.QYPHMJRoomDealCardCount = this.QYPHMJRoomJoinCount * this.QYPHMJRoomDealPerPosCardCount;
};
var BFMJ = function BFMJ() {
	//参与的人数
	this.BFMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.BFMJRoomPaiDun = 13;
	//总的牌数量
	this.BFMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.BFMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.BFMJRoomDealCardCount = this.BFMJRoomJoinCount * this.BFMJRoomDealPerPosCardCount;
};
var HFBZMJ = function HFBZMJ() {
	//参与的人数
	this.HFBZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HFBZMJRoomPaiDun = 13;
	//总的牌数量
	this.HFBZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HFBZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HFBZMJRoomDealCardCount = this.HFBZMJRoomJoinCount * this.HFBZMJRoomDealPerPosCardCount;
};
var CYLYMJ = function CYLYMJ() {
	//参与的人数
	this.CYLYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CYLYMJRoomPaiDun = 13;
	//总的牌数量
	this.CYLYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.CYLYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.CYLYMJRoomDealCardCount = this.CYLYMJRoomJoinCount * this.CYLYMJRoomDealPerPosCardCount;
};
var DTMJ = function DTMJ() {
	//参与的人数
	this.DTMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DTMJRoomPaiDun = 13;
	//总的牌数量
	this.DTMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DTMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.DTMJRoomDealCardCount = this.DTMJRoomJoinCount * this.DTMJRoomDealPerPosCardCount;
};
var CZCZMJ = function CZCZMJ() {
	//参与的人数
	this.CZCZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CZCZMJRoomPaiDun = 13;
	//总的牌数量
	this.CZCZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.CZCZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.CZCZMJRoomDealCardCount = this.CZCZMJRoomJoinCount * this.CZCZMJRoomDealPerPosCardCount;
};
var TSDG = function TSDG() {
	//参与的人数
	this.TSDGRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TSDGRoomPaiDun = 13;
	//总的牌数量
	this.TSDGRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.TSDGRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.TSDGRoomDealCardCount = this.TSDGRoomJoinCount * this.TSDGRoomDealPerPosCardCount;
};
var PHMJ = function PHMJ() {
	//参与的人数
	this.PHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PHMJRoomPaiDun = 13;
	//总的牌数量
	this.PHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PHMJRoomDealCardCount = this.PHMJRoomJoinCount * this.PHMJRoomDealPerPosCardCount;
};
var XSY = function XSY() {
	//参与的人数
	this.XSYRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XSYRoomPaiDun = 13;
	//总的牌数量
	this.XSYRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XSYRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XSYRoomDealCardCount = this.XSYRoomJoinCount * this.XSYRoomDealPerPosCardCount;
};
var XSY = function XSY() {
	//参与的人数
	this.XSYRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XSYRoomPaiDun = 13;
	//总的牌数量
	this.XSYRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XSYRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XSYRoomDealCardCount = this.XSYRoomJoinCount * this.XSYRoomDealPerPosCardCount;
};
var WZQSMJ = function WZQSMJ() {
	//参与的人数
	this.WZQSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.WZQSMJRoomPaiDun = 13;
	//总的牌数量
	this.WZQSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.WZQSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.WZQSMJRoomDealCardCount = this.WZQSMJRoomJoinCount * this.WZQSMJRoomDealPerPosCardCount;
};
var JZWZMJ = function JZWZMJ() {
	//参与的人数
	this.JZWZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JZWZMJRoomPaiDun = 13;
	//总的牌数量
	this.JZWZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JZWZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JZWZMJRoomDealCardCount = this.JZWZMJRoomJoinCount * this.JZWZMJRoomDealPerPosCardCount;
};
var GJMJ = function GJMJ() {
	//参与的人数
	this.GJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GJMJRoomPaiDun = 13;
	//总的牌数量
	this.GJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GJMJRoomDealCardCount = this.GJMJRoomJoinCount * this.GJMJRoomDealPerPosCardCount;
};
var GDCZMJ = function GDCZMJ() {
	//参与的人数
	this.GDCZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GDCZMJRoomPaiDun = 13;
	//总的牌数量
	this.GDCZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GDCZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GDCZMJRoomDealCardCount = this.GDCZMJRoomJoinCount * this.GDCZMJRoomDealPerPosCardCount;
};
var ASMJ = function ASMJ() {
	//参与的人数
	this.ASMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ASMJRoomPaiDun = 13;
	//总的牌数量
	this.ASMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ASMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ASMJRoomDealCardCount = this.ASMJRoomJoinCount * this.ASMJRoomDealPerPosCardCount;
};
var HW = function HW() {
	//参与的人数
	this.HWRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HWRoomPaiDun = 13;
	//总的牌数量
	this.HWRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HWRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HWRoomDealCardCount = this.HWRoomJoinCount * this.HWRoomDealPerPosCardCount;
};
var QBSK = function QBSK() {
	//参与的人数
	this.QBSKRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.QBSKRoomPaiDun = 13;
	//总的牌数量
	this.QBSKRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.QBSKRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.QBSKRoomDealCardCount = this.QBSKRoomJoinCount * this.QBSKRoomDealPerPosCardCount;
};
var SCPK = function SCPK() {
	//参与的人数
	this.SCPKRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SCPKRoomPaiDun = 13;
	//总的牌数量
	this.SCPKRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SCPKRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SCPKRoomDealCardCount = this.SCPKRoomJoinCount * this.SCPKRoomDealPerPosCardCount;
};
var WXZMMJ = function WXZMMJ() {
	//参与的人数
	this.WXZMMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.WXZMMJRoomPaiDun = 13;
	//总的牌数量
	this.WXZMMJRoomAllCardCount = 136;
	//发牌阶段每个人领取卡牌数量
	this.WXZMMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.WXZMMJRoomDealCardCount = this.WXZMMJRoomJoinCount * this.WXZMMJRoomDealPerPosCardCount;
};
var LNSYMJ = function LNSYMJ() {
	//参与的人数
	this.LNSYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LNSYMJRoomPaiDun = 13;
	//总的牌数量
	this.LNSYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LNSYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LNSYMJRoomDealCardCount = this.LNSYMJRoomJoinCount * this.LNSYMJRoomDealPerPosCardCount;
};
var ST = function ST() {
	//参与的人数
	this.STRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.STRoomPaiDun = 13;
	//总的牌数量
	this.STRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.STRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.STRoomDealCardCount = this.STRoomJoinCount * this.STRoomDealPerPosCardCount;
};
var YCSDR = function YCSDR() {
	//参与的人数
	this.YCSDRRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YCSDRRoomPaiDun = 13;
	//总的牌数量
	this.YCSDRRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YCSDRRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YCSDRRoomDealCardCount = this.YCSDRRoomJoinCount * this.YCSDRRoomDealPerPosCardCount;
};
var HLDMJ = function HLDMJ() {
	//参与的人数
	this.HLDMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HLDMJRoomPaiDun = 13;
	//总的牌数量
	this.HLDMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HLDMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HLDMJRoomDealCardCount = this.HLDMJRoomJoinCount * this.HLDMJRoomDealPerPosCardCount;
};
var BSMJ = function BSMJ() {
	//参与的人数
	this.BSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.BSMJRoomPaiDun = 13;
	//总的牌数量
	this.BSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.BSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.BSMJRoomDealCardCount = this.BSMJRoomJoinCount * this.BSMJRoomDealPerPosCardCount;
};
var QJFBBMJ = function QJFBBMJ() {
	//参与的人数
	this.QJFBBMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.QJFBBMJRoomPaiDun = 13;
	//总的牌数量
	this.QJFBBMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.QJFBBMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.QJFBBMJRoomDealCardCount = this.QJFBBMJRoomJoinCount * this.QJFBBMJRoomDealPerPosCardCount;
};

var CP = function CP() {
	//参与的人数
	this.CPRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CPRoomPaiDun = 13;
	//总的牌数量
	this.CPRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.CPRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.CPRoomDealCardCount = this.CPRoomJoinCount * this.CPRoomDealPerPosCardCount;
};
var XYWSK = function XYWSK() {
	//参与的人数
	this.XYWSKRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XYWSKRoomPaiDun = 13;
	//总的牌数量
	this.XYWSKRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XYWSKRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XYWSKRoomDealCardCount = this.XYWSKRoomJoinCount * this.XYWSKRoomDealPerPosCardCount;
};
var FCSJ = function FCSJ() {
	//参与的人数
	this.FCSJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.FCSJRoomPaiDun = 13;
	//总的牌数量
	this.FCSJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.FCSJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.FCSJRoomDealCardCount = this.FCSJRoomJoinCount * this.FCSJRoomDealPerPosCardCount;
};
var CXYXMJ = function CXYXMJ() {
	//参与的人数
	this.CXYXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CXYXMJRoomPaiDun = 13;
	//总的牌数量
	this.CXYXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.CXYXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.CXYXMJRoomDealCardCount = this.CXYXMJRoomJoinCount * this.CXYXMJRoomDealPerPosCardCount;
};
var DSMJ = function DSMJ() {
	//参与的人数
	this.DSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DSMJRoomPaiDun = 13;
	//总的牌数量
	this.DSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.DSMJRoomDealCardCount = this.DSMJRoomJoinCount * this.DSMJRoomDealPerPosCardCount;
};
var YCSGMJ = function YCSGMJ() {
	//参与的人数
	this.YCSGMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YCSGMJRoomPaiDun = 13;
	//总的牌数量
	this.YCSGMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YCSGMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YCSGMJRoomDealCardCount = this.YCSGMJRoomJoinCount * this.YCSGMJRoomDealPerPosCardCount;
};
var JMJSMJ = function JMJSMJ() {
	//参与的人数
	this.JMJSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JMJSMJRoomPaiDun = 13;
	//总的牌数量
	this.JMJSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JMJSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JMJSMJRoomDealCardCount = this.JMJSMJRoomJoinCount * this.JMJSMJRoomDealPerPosCardCount;
};
var JXYZ = function JXYZ() {
	//参与的人数
	this.JXYZRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JXYZRoomPaiDun = 13;
	//总的牌数量
	this.JXYZRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JXYZRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JXYZRoomDealCardCount = this.JXYZRoomJoinCount * this.JXYZRoomDealPerPosCardCount;
};
var YCFXMJ = function YCFXMJ() {
	//参与的人数
	this.YCFXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YCFXMJRoomPaiDun = 13;
	//总的牌数量
	this.YCFXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YCFXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YCFXMJRoomDealCardCount = this.YCFXMJRoomJoinCount * this.YCFXMJRoomDealPerPosCardCount;
};
var SCNJMJ = function SCNJMJ() {
	//参与的人数
	this.SCNJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SCNJMJRoomPaiDun = 13;
	//总的牌数量
	this.SCNJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SCNJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SCNJMJRoomDealCardCount = this.SCNJMJRoomJoinCount * this.SCNJMJRoomDealPerPosCardCount;
};
var NBCXMJ = function NBCXMJ() {
	//参与的人数
	this.NBCXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NBCXMJRoomPaiDun = 13;
	//总的牌数量
	this.NBCXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NBCXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NBCXMJRoomDealCardCount = this.NBCXMJRoomJoinCount * this.NBCXMJRoomDealPerPosCardCount;
};
var CXXZMJ = function CXXZMJ() {
	//参与的人数
	this.CXXZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CXXZMJRoomPaiDun = 13;
	//总的牌数量
	this.CXXZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.CXXZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.CXXZMJRoomDealCardCount = this.CXXZMJRoomJoinCount * this.CXXZMJRoomDealPerPosCardCount;
};
var THKB = function THKB() {
	//参与的人数
	this.THKBRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.THKBRoomPaiDun = 13;
	//总的牌数量
	this.THKBRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.THKBRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.THKBRoomDealCardCount = this.THKBRoomJoinCount * this.THKBRoomDealPerPosCardCount;
};
var PTMJ = function PTMJ() {
	//参与的人数
	this.PTMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PTMJRoomPaiDun = 13;
	//总的牌数量
	this.PTMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PTMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PTMJRoomDealCardCount = this.PTMJRoomJoinCount * this.PTMJRoomDealPerPosCardCount;
};
var KLMJ = function KLMJ() {
	//参与的人数
	this.KLMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.KLMJRoomPaiDun = 13;
	//总的牌数量
	this.KLMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.KLMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.KLMJRoomDealCardCount = this.KLMJRoomJoinCount * this.KLMJRoomDealPerPosCardCount;
};
var QWWES = function QWWES() {
	//参与的人数
	this.QWWESRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.QWWESRoomPaiDun = 13;
	//总的牌数量
	this.QWWESRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.QWWESRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.QWWESRoomDealCardCount = this.QWWESRoomJoinCount * this.QWWESRoomDealPerPosCardCount;
};
var YFMJ = function YFMJ() {
	//参与的人数
	this.YFMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YFMJRoomPaiDun = 13;
	//总的牌数量
	this.YFMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YFMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YFMJRoomDealCardCount = this.YFMJRoomJoinCount * this.YFMJRoomDealPerPosCardCount;
};
var JAYXDDZ = function JAYXDDZ() {
	//参与的人数
	this.JAYXDDZRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JAYXDDZRoomPaiDun = 13;
	//总的牌数量
	this.JAYXDDZRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JAYXDDZRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JAYXDDZRoomDealCardCount = this.JAYXDDZRoomJoinCount * this.JAYXDDZRoomDealPerPosCardCount;
};
var GAST = function GAST() {
	//参与的人数
	this.GASTRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.GASTRoomPaiDun = 13;
	//总的牌数量
	this.GASTRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.GASTRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.GASTRoomDealCardCount = this.GASTRoomJoinCount * this.GASTRoomDealPerPosCardCount;
};
var HEBMJ = function HEBMJ() {
	//参与的人数
	this.HEBMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HEBMJRoomPaiDun = 13;
	//总的牌数量
	this.HEBMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HEBMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HEBMJRoomDealCardCount = this.HEBMJRoomJoinCount * this.HEBMJRoomDealPerPosCardCount;
};
var PYSFT = function PYSFT() {
	//参与的人数
	this.PYSFTRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PYSFTRoomPaiDun = 13;
	//总的牌数量
	this.PYSFTRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PYSFTRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PYSFTRoomDealCardCount = this.PYSFTRoomJoinCount * this.PYSFTRoomDealPerPosCardCount;
};
var SXZJMJ = function SXZJMJ() {
	//参与的人数
	this.SXZJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SXZJMJRoomPaiDun = 13;
	//总的牌数量
	this.SXZJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SXZJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SXZJMJRoomDealCardCount = this.SXZJMJRoomJoinCount * this.SXZJMJRoomDealPerPosCardCount;
};
var SCGAMJ = function SCGAMJ() {
	//参与的人数
	this.SCGAMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SCGAMJRoomPaiDun = 13;
	//总的牌数量
	this.SCGAMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SCGAMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SCGAMJRoomDealCardCount = this.SCGAMJRoomJoinCount * this.SCGAMJRoomDealPerPosCardCount;
};
var SCLSMJ = function SCLSMJ() {
	//参与的人数
	this.SCLSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SCLSMJRoomPaiDun = 13;
	//总的牌数量
	this.SCLSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SCLSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SCLSMJRoomDealCardCount = this.SCLSMJRoomJoinCount * this.SCLSMJRoomDealPerPosCardCount;
};
var SXMJ = function SXMJ() {
	//参与的人数
	this.SXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SXMJRoomPaiDun = 13;
	//总的牌数量
	this.SXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SXMJRoomDealCardCount = this.SXMJRoomJoinCount * this.SXMJRoomDealPerPosCardCount;
};
var LWMJ = function LWMJ() {
	//参与的人数
	this.LWMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LWMJRoomPaiDun = 13;
	//总的牌数量
	this.LWMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LWMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LWMJRoomDealCardCount = this.LWMJRoomJoinCount * this.LWMJRoomDealPerPosCardCount;
};
var WABJMJ = function WABJMJ() {
	//参与的人数
	this.WABJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.WABJMJRoomPaiDun = 13;
	//总的牌数量
	this.WABJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.WABJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.WABJMJRoomDealCardCount = this.WABJMJRoomJoinCount * this.WABJMJRoomDealPerPosCardCount;
};
var XJBJMJ = function XJBJMJ() {
	//参与的人数
	this.XJBJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XJBJMJRoomPaiDun = 13;
	//总的牌数量
	this.XJBJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XJBJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XJBJMJRoomDealCardCount = this.XJBJMJRoomJoinCount * this.XJBJMJRoomDealPerPosCardCount;
};
var YCHP = function YCHP() {
	//参与的人数
	this.YCHPRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YCHPRoomPaiDun = 13;
	//总的牌数量
	this.YCHPRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YCHPRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YCHPRoomDealCardCount = this.YCHPRoomJoinCount * this.YCHPRoomDealPerPosCardCount;
};
var SSE = function SSE() {
	//参与的人数
	this.SSERoomJoinCount = 3;
	//每个人前面牌蹲数量
	this.SSERoomPaiDun = 23;
	//总的牌数量
	this.SSERoomAllCardCount = 130;
	//发牌阶段每个人领取卡牌数量
	this.SSERoomDealPerPosCardCount = 23;
	//发出去的牌数量
	this.SSERoomDealCardCount = this.SSERoomJoinCount * this.SSERoomDealPerPosCardCount;
};
var SDZZMJ = function SDZZMJ() {
	//参与的人数
	this.SDZZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SDZZMJRoomPaiDun = 13;
	//总的牌数量
	this.SDZZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SDZZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SDZZMJRoomDealCardCount = this.SDZZMJRoomJoinCount * this.SDZZMJRoomDealPerPosCardCount;
};
var LGMJ = function LGMJ() {
	//参与的人数
	this.LGMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LGMJRoomPaiDun = 13;
	//总的牌数量
	this.LGMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LGMJRoomDealPerPosCardCount = 16;
	//发出去的牌数量
	this.LGMJRoomDealCardCount = this.LGMJRoomJoinCount * this.LGMJRoomDealPerPosCardCount;
};
var LSYJMJ = function LSYJMJ() {
	//参与的人数
	this.LSYJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LSYJMJRoomPaiDun = 13;
	//总的牌数量
	this.LSYJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LSYJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LSYJMJRoomDealCardCount = this.LSYJMJRoomJoinCount * this.LSYJMJRoomDealPerPosCardCount;
};
var CDP = function CDP() {
	//参与的人数
	this.CDPRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CDPRoomPaiDun = 13;
	//总的牌数量
	this.CDPRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.CDPRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.CDPRoomDealCardCount = this.CDPRoomJoinCount * this.CDPRoomDealPerPosCardCount;
};
var CDXZMJ = function CDXZMJ() {
	//参与的人数
	this.CDXZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CDXZMJRoomPaiDun = 13;
	//总的牌数量
	this.CDXZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.CDXZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.CDXZMJRoomDealCardCount = this.CDXZMJRoomJoinCount * this.CDXZMJRoomDealPerPosCardCount;
};
var LZXZMJ = function LZXZMJ() {
	//参与的人数
	this.LZXZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LZXZMJRoomPaiDun = 13;
	//总的牌数量
	this.LZXZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LZXZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LZXZMJRoomDealCardCount = this.LZXZMJRoomJoinCount * this.LZXZMJRoomDealPerPosCardCount;
};
var WFBH = function WFBH() {
	//参与的人数
	this.WFBHRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.WFBHRoomPaiDun = 13;
	//总的牌数量
	this.WFBHRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.WFBHRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.WFBHRoomDealCardCount = this.WFBHRoomJoinCount * this.WFBHRoomDealPerPosCardCount;
};
var PXMJ = function PXMJ() {
	//参与的人数
	this.PXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PXMJRoomPaiDun = 13;
	//总的牌数量
	this.PXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PXMJRoomDealCardCount = this.PXMJRoomJoinCount * this.PXMJRoomDealPerPosCardCount;
};
var SDLCMJ = function SDLCMJ() {
	//参与的人数
	this.SDLCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SDLCMJRoomPaiDun = 13;
	//总的牌数量
	this.SDLCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SDLCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SDLCMJRoomDealCardCount = this.SDLCMJRoomJoinCount * this.SDLCMJRoomDealPerPosCardCount;
};
var ZJGMJ = function ZJGMJ() {
	//参与的人数
	this.ZJGMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZJGMJRoomPaiDun = 13;
	//总的牌数量
	this.ZJGMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZJGMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZJGMJRoomDealCardCount = this.ZJGMJRoomJoinCount * this.ZJGMJRoomDealPerPosCardCount;
};
var ZJTZMJ = function ZJTZMJ() {
	//参与的人数
	this.ZJTZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZJTZMJRoomPaiDun = 13;
	//总的牌数量
	this.ZJTZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZJTZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZJTZMJRoomDealCardCount = this.ZJTZMJRoomJoinCount * this.ZJTZMJRoomDealPerPosCardCount;
};
var SYS = function SYS() {
	//参与的人数
	this.SYSRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SYSRoomPaiDun = 13;
	//总的牌数量
	this.SYSRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SYSRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SYSRoomDealCardCount = this.SYSRoomJoinCount * this.SYSRoomDealPerPosCardCount;
};
var CNMJ = function CNMJ() {
	//参与的人数
	this.CNMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.CNMJRoomPaiDun = 13;
	//总的牌数量
	this.CNMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.CNMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.CNMJRoomDealCardCount = this.CNMJRoomJoinCount * this.CNMJRoomDealPerPosCardCount;
};
var DZZJ = function DZZJ() {
	//参与的人数
	this.DZZJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DZZJRoomPaiDun = 13;
	//总的牌数量
	this.DZZJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DZZJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.DZZJRoomDealCardCount = this.DZZJRoomJoinCount * this.DZZJRoomDealPerPosCardCount;
};
var SDHZMJ = function SDHZMJ() {
	//参与的人数
	this.SDHZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SDHZMJRoomPaiDun = 13;
	//总的牌数量
	this.SDHZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SDHZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SDHZMJRoomDealCardCount = this.SDHZMJRoomJoinCount * this.SDHZMJRoomDealPerPosCardCount;
};
var XLHZMJ = function XLHZMJ() {
	//参与的人数
	this.XLHZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XLHZMJRoomPaiDun = 13;
	//总的牌数量
	this.XLHZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XLHZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XLHZMJRoomDealCardCount = this.XLHZMJRoomJoinCount * this.XLHZMJRoomDealPerPosCardCount;
};
var PYDD = function PYDD() {
	//参与的人数
	this.PYDDRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.PYDDRoomPaiDun = 13;
	//总的牌数量
	this.PYDDRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.PYDDRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.PYDDRoomDealCardCount = this.PYDDRoomJoinCount * this.PYDDRoomDealPerPosCardCount;
};
var NCAYMJ = function NCAYMJ() {
	//参与的人数
	this.NCAYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NCAYMJRoomPaiDun = 13;
	//总的牌数量
	this.NCAYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NCAYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NCAYMJRoomDealCardCount = this.NCAYMJRoomJoinCount * this.NCAYMJRoomDealPerPosCardCount;
};
var KSMJ = function KSMJ() {
	//参与的人数
	this.KSMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.KSMJRoomPaiDun = 13;
	//总的牌数量
	this.KSMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.KSMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.KSMJRoomDealCardCount = this.KSMJRoomJoinCount * this.KSMJRoomDealPerPosCardCount;
};
var SYSYBP = function SYSYBP() {
	//参与的人数
	this.SYSYBPRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.SYSYBPRoomPaiDun = 13;
	//总的牌数量
	this.SYSYBPRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.SYSYBPRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.SYSYBPRoomDealCardCount = this.SYSYBPRoomJoinCount * this.SYSYBPRoomDealPerPosCardCount;
};
var TAMJ = function TAMJ() {
	//参与的人数
	this.TAMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TAMJRoomPaiDun = 13;
	//总的牌数量
	this.TAMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.TAMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.TAMJRoomDealCardCount = this.TAMJRoomJoinCount * this.TAMJRoomDealPerPosCardCount;
};
var DPHMJ = function DPHMJ() {
	//参与的人数
	this.DPHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.DPHMJRoomPaiDun = 13;
	//总的牌数量
	this.DPHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.DPHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.DPHMJRoomDealCardCount = this.DPHMJRoomJoinCount * this.DPHMJRoomDealPerPosCardCount;
};
var QDJT = function QDJT() {
	//参与的人数
	this.QDJTRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.QDJTRoomPaiDun = 13;
	//总的牌数量
	this.QDJTRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.QDJTRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.QDJTRoomDealCardCount = this.QDJTRoomJoinCount * this.QDJTRoomDealPerPosCardCount;
};
var LSXZMJ = function LSXZMJ() {
	//参与的人数
	this.LSXZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LSXZMJRoomPaiDun = 13;
	//总的牌数量
	this.LSXZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LSXZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LSXZMJRoomDealCardCount = this.LSXZMJRoomJoinCount * this.LSXZMJRoomDealPerPosCardCount;
};
var JAYXMJ = function JAYXMJ() {
	//参与的人数
	this.JAYXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JAYXMJRoomPaiDun = 13;
	//总的牌数量
	this.JAYXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JAYXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JAYXMJRoomDealCardCount = this.JAYXMJRoomJoinCount * this.JAYXMJRoomDealPerPosCardCount;
};
var XSDQ = function XSDQ() {
	//参与的人数
	this.XSDQRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XSDQRoomPaiDun = 13;
	//总的牌数量
	this.XSDQRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XSDQRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XSDQRoomDealCardCount = this.XSDQRoomJoinCount * this.XSDQRoomDealPerPosCardCount;
};
var LHGMMJ = function LHGMMJ() {
	//参与的人数
	this.LHGMMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LHGMMJRoomPaiDun = 13;
	//总的牌数量
	this.LHGMMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LHGMMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LHGMMJRoomDealCardCount = this.LHGMMJRoomJoinCount * this.LHGMMJRoomDealPerPosCardCount;
};
var HCNG = function HCNG() {
	//参与的人数
	this.HCNGRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HCNGRoomPaiDun = 13;
	//总的牌数量
	this.HCNGRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HCNGRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HCNGRoomDealCardCount = this.HCNGRoomJoinCount * this.HCNGRoomDealPerPosCardCount;
};
var JTMJ = function JTMJ() {
	//参与的人数
	this.JTMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JTMJRoomPaiDun = 13;
	//总的牌数量
	this.JTMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JTMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JTMJRoomDealCardCount = this.JTMJRoomJoinCount * this.JTMJRoomDealPerPosCardCount;
};
var YBGXMJ = function YBGXMJ() {
	//参与的人数
	this.YBGXMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.YBGXMJRoomPaiDun = 13;
	//总的牌数量
	this.YBGXMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.YBGXMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.YBGXMJRoomDealCardCount = this.YBGXMJRoomJoinCount * this.YBGXMJRoomDealPerPosCardCount;
};
var JTPDK = function JTPDK() {
	//参与的人数
	this.JTPDKRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JTPDKRoomPaiDun = 13;
	//总的牌数量
	this.JTPDKRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JTPDKRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JTPDKRoomDealCardCount = this.JTPDKRoomJoinCount * this.JTPDKRoomDealPerPosCardCount;
};
var XWMJ = function XWMJ() {
	//参与的人数
	this.XWMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XWMJRoomPaiDun = 13;
	//总的牌数量
	this.XWMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XWMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XWMJRoomDealCardCount = this.XWMJRoomJoinCount * this.XWMJRoomDealPerPosCardCount;
};
var TZPDK = function TZPDK() {
	//参与的人数
	this.TZPDKRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TZPDKRoomPaiDun = 13;
	//总的牌数量
	this.TZPDKRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.TZPDKRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.TZPDKRoomDealCardCount = this.TZPDKRoomJoinCount * this.TZPDKRoomDealPerPosCardCount;
};
var WJMJ = function WJMJ() {
	//参与的人数
	this.WJMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.WJMJRoomPaiDun = 13;
	//总的牌数量
	this.WJMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.WJMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.WJMJRoomDealCardCount = this.WJMJRoomJoinCount * this.WJMJRoomDealPerPosCardCount;
};
var QDBH = function QDBH() {
	//参与的人数
	this.QDBHRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.QDBHRoomPaiDun = 13;
	//总的牌数量
	this.QDBHRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.QDBHRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.QDBHRoomDealCardCount = this.QDBHRoomJoinCount * this.QDBHRoomDealPerPosCardCount;
};
var TJTGMJ = function TJTGMJ() {
	//参与的人数
	this.TJTGMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.TJTGMJRoomPaiDun = 13;
	//总的牌数量
	this.TJTGMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.TJTGMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.TJTGMJRoomDealCardCount = this.TJTGMJRoomJoinCount * this.TJTGMJRoomDealPerPosCardCount;
};
var HAXYMJ = function HAXYMJ() {
	//参与的人数
	this.HAXYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HAXYMJRoomPaiDun = 13;
	//总的牌数量
	this.HAXYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HAXYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HAXYMJRoomDealCardCount = this.HAXYMJRoomJoinCount * this.HAXYMJRoomDealPerPosCardCount;
};
var ZYMJ = function ZYMJ() {
	//参与的人数
	this.ZYMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.ZYMJRoomPaiDun = 13;
	//总的牌数量
	this.ZYMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.ZYMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.ZYMJRoomDealCardCount = this.ZYMJRoomJoinCount * this.ZYMJRoomDealPerPosCardCount;
};
var NTCP = function NTCP() {
	//参与的人数
	this.NTCPRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.NTCPRoomPaiDun = 23;
	//总的牌数量
	this.NTCPRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.NTCPRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.NTCPRoomDealCardCount = this.NTCPRoomJoinCount * this.NTCPRoomDealPerPosCardCount;
};
var LNJZMJ = function LNJZMJ() {
	//参与的人数
	this.LNJZMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.LNJZMJRoomPaiDun = 13;
	//总的牌数量
	this.LNJZMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.LNJZMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.LNJZMJRoomDealCardCount = this.LNJZMJRoomJoinCount * this.LNJZMJRoomDealPerPosCardCount;
};
var JSSNMJ = function JSSNMJ() {
	//参与的人数
	this.JSSNMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JSSNMJRoomPaiDun = 13;
	//总的牌数量
	this.JSSNMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JSSNMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.JSSNMJRoomDealCardCount = this.JSSNMJRoomJoinCount * this.JSSNMJRoomDealPerPosCardCount;
};
var JYESSZ = function JYESSZ() {
	//参与的人数
	this.JYESSZRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.JYESSZRoomPaiDun = 13;
	//总的牌数量
	this.JYESSZRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.JYESSZRoomDealPerPosCardCount = 23;
	//发出去的牌数量
	this.JYESSZRoomDealCardCount = this.JYESSZRoomJoinCount * this.JYESSZRoomDealPerPosCardCount;
};
var XCMJ = function XCMJ() {
	//参与的人数
	this.XCMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XCMJRoomPaiDun = 13;
	//总的牌数量
	this.XCMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XCMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XCMJRoomDealCardCount = this.XCMJRoomJoinCount * this.XCMJRoomDealPerPosCardCount;
};
var HZBDMJ = function HZBDMJ() {
	//参与的人数
	this.HZBDMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.HZBDMJRoomPaiDun = 13;
	//总的牌数量
	this.HZBDMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.HZBDMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.HZBDMJRoomDealCardCount = this.HZBDMJRoomJoinCount * this.HZBDMJRoomDealPerPosCardCount;
};
var BDJHMJ = function BDJHMJ() {
	//参与的人数
	this.BDJHMJRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.BDJHMJRoomPaiDun = 13;
	//总的牌数量
	this.BDJHMJRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.BDJHMJRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.BDJHMJRoomDealCardCount = this.BDJHMJRoomJoinCount * this.BDJHMJRoomDealPerPosCardCount;
};
var XCPDK = function XCPDK() {
	//参与的人数
	this.XCPDKRoomJoinCount = 4;
	//每个人前面牌蹲数量
	this.XCPDKRoomPaiDun = 13;
	//总的牌数量
	this.XCPDKRoomAllCardCount = 144;
	//发牌阶段每个人领取卡牌数量
	this.XCPDKRoomDealPerPosCardCount = 13;
	//发出去的牌数量
	this.XCPDKRoomDealCardCount = this.XCPDKRoomJoinCount * this.XCPDKRoomDealPerPosCardCount;
};
// ###.var_=function()_Flag

//-----基础---
Color.apply(ShareDefine, []);
Common.apply(ShareDefine, []);
GM.apply(ShareDefine, []);
Order.apply(ShareDefine, []);
Code.apply(ShareDefine, []);
Timer.apply(ShareDefine, []);
Chat.apply(ShareDefine, []);
Model.apply(ShareDefine, []);
Form.apply(ShareDefine, []);
Hero.apply(ShareDefine, []);
Effect.apply(ShareDefine, []);
SDK.apply(ShareDefine, []);
Mail.apply(ShareDefine, []);
Game.apply(ShareDefine, []);
//-----项目---
Rank.apply(ShareDefine, []);
Room.apply(ShareDefine, []);
MaJiang.apply(ShareDefine, []);
HZMJ.apply(ShareDefine, []);
LBHZMJ.apply(ShareDefine, []);
WNMJ.apply(ShareDefine, []);
LYMJ.apply(ShareDefine, []);
ZJJHMJ.apply(ShareDefine, []);
HBYXMJ.apply(ShareDefine, []);
XMMJ.apply(ShareDefine, []);
XYMJ.apply(ShareDefine, []);
FZMJ.apply(ShareDefine, []);
SMMJ.apply(ShareDefine, []);
QZMJ.apply(ShareDefine, []);
NAMJ.apply(ShareDefine, []);
SSMJ.apply(ShareDefine, []);
ZZMJ.apply(ShareDefine, []);
PTMJ.apply(ShareDefine, []);
NDMJ.apply(ShareDefine, []);
NPMJ.apply(ShareDefine, []);
NPGZMJ.apply(ShareDefine, []);
PT13MJ.apply(ShareDefine, []);
ZJMJ.apply(ShareDefine, []);
YGMJ.apply(ShareDefine, []);
WZMJ.apply(ShareDefine, []);
HNZZMJ.apply(ShareDefine, []);
NJLHMJ.apply(ShareDefine, []);
WNYH.apply(ShareDefine, []);
YCMJ.apply(ShareDefine, []);
PXZZMJ.apply(ShareDefine, []);
PX258MJ.apply(ShareDefine, []);
JSYZMJ.apply(ShareDefine, []);
LPMJ.apply(ShareDefine, []);
XLQMJ.apply(ShareDefine, []);
YXMJ.apply(ShareDefine, []);
YTMJ.apply(ShareDefine, []);
QDMJ.apply(ShareDefine, []);
YXTDH.apply(ShareDefine, []);
HBMJ.apply(ShareDefine, []);
BDYXMJ.apply(ShareDefine, []);
HNXYMJ.apply(ShareDefine, []);
TCMJ.apply(ShareDefine, []);
PBYHMJ.apply(ShareDefine, []);
SDFJMJ.apply(ShareDefine, []);
PNYHMJ.apply(ShareDefine, []);
YHZMJ.apply(ShareDefine, []);
BDMJ.apply(ShareDefine, []);
YSIZMJ.apply(ShareDefine, []);
DYMJ.apply(ShareDefine, []);
SYMJ.apply(ShareDefine, []);
YCMJ.apply(ShareDefine, []);
FDMJ.apply(ShareDefine, []);
ZPMJ.apply(ShareDefine, []);
TDHMJ.apply(ShareDefine, []);
AYMJ.apply(ShareDefine, []);
SGMJ.apply(ShareDefine, []);
NAMJ.apply(ShareDefine, []);
TZMJ.apply(ShareDefine, []);
DX.apply(ShareDefine, []);
NHMJ.apply(ShareDefine, []);
ZJQZMJ.apply(ShareDefine, []);
JXFZMJ.apply(ShareDefine, []);
HNCSMJ.apply(ShareDefine, []);
HAMJ.apply(ShareDefine, []);
JMHHMJ.apply(ShareDefine, []);
CHMJ.apply(ShareDefine, []);
TWMJ.apply(ShareDefine, []);
TZKZMJ.apply(ShareDefine, []);
DCZBMJ.apply(ShareDefine, []);
DCWDMJ.apply(ShareDefine, []);
ZA13MJ.apply(ShareDefine, []);
ZA16MJ.apply(ShareDefine, []);
ZASS.apply(ShareDefine, []);
XHMJ.apply(ShareDefine, []);
XHBBMJ.apply(ShareDefine, []);
TBZFBMJ.apply(ShareDefine, []);
JNMJ.apply(ShareDefine, []);
NYKWXMJ.apply(ShareDefine, []);
XGKWXMJ.apply(ShareDefine, []);
HNXCMJ.apply(ShareDefine, []);
LZMJ.apply(ShareDefine, []);
FJYXMJ.apply(ShareDefine, []);
BYZP.apply(ShareDefine, []);
HHHGW.apply(ShareDefine, []);
ZJQZSK.apply(ShareDefine, []);
HSMJ.apply(ShareDefine, []);
SDLYMJ.apply(ShareDefine, []);
CZMJ.apply(ShareDefine, []);
YZMJ.apply(ShareDefine, []);
SRMJ.apply(ShareDefine, []);
LBMJ.apply(ShareDefine, []);
RQMJ.apply(ShareDefine, []);
CSMJ.apply(ShareDefine, []);
XPLP.apply(ShareDefine, []);
HZWMJ.apply(ShareDefine, []);
XTMJ.apply(ShareDefine, []);
XPPHZ.apply(ShareDefine, []);
PXPHZ.apply(ShareDefine, []);
RCMJ.apply(ShareDefine, []);
JDZMJ.apply(ShareDefine, []);
BZMJ.apply(ShareDefine, []);
BZTDH.apply(ShareDefine, []);
GYZJMJ.apply(ShareDefine, []);
DTLGFMJ.apply(ShareDefine, []);
SHQMMJ.apply(ShareDefine, []);
JSTDHMJ.apply(ShareDefine, []);
ZGMJ.apply(ShareDefine, []);
NBMJ.apply(ShareDefine, []);
SWMJ.apply(ShareDefine, []);
GDJYMJ.apply(ShareDefine, []);
SQMJ.apply(ShareDefine, []);
JYMJ.apply(ShareDefine, []);
HTMJ.apply(ShareDefine, []);
THGJMJ.apply(ShareDefine, []);
HNPDSMJ.apply(ShareDefine, []);
JSXYMJ.apply(ShareDefine, []);
PZMJ.apply(ShareDefine, []);
HNJYMJ.apply(ShareDefine, []);
JSYCMJ.apply(ShareDefine, []);
JSSQMJ.apply(ShareDefine, []);
JSHAMJ.apply(ShareDefine, []);
WXMJ.apply(ShareDefine, []);
JSCZMJ.apply(ShareDefine, []);
LYGMJ.apply(ShareDefine, []);
HNJZMJ.apply(ShareDefine, []);
GYMJ.apply(ShareDefine, []);
PYMJ.apply(ShareDefine, []);
AHMJ.apply(ShareDefine, []);
XZMJ.apply(ShareDefine, []);
JSGYMJ.apply(ShareDefine, []);
AHPHZ.apply(ShareDefine, []);
XXMJ.apply(ShareDefine, []);
HNAYMJ.apply(ShareDefine, []);
NCMJ.apply(ShareDefine, []);
ZKMJ.apply(ShareDefine, []);
GAMJ.apply(ShareDefine, []);
TGMJ.apply(ShareDefine, []);
HNHBMJ.apply(ShareDefine, []);
LHMJ.apply(ShareDefine, []);
JJMJ.apply(ShareDefine, []);
FYMJ.apply(ShareDefine, []);
GDMJ.apply(ShareDefine, []);
GSJMJ.apply(ShareDefine, []);
BZQZMJ.apply(ShareDefine, []);
FYDDZMJ.apply(ShareDefine, []);
HSTDHMJ.apply(ShareDefine, []);
CCMJ.apply(ShareDefine, []);
QZKHMJ.apply(ShareDefine, []);
PCMJ.apply(ShareDefine, []);
JLMJ.apply(ShareDefine, []);
ZJHZMJ.apply(ShareDefine, []);
XJXZMJ.apply(ShareDefine, []);
YSMJ.apply(ShareDefine, []);
ZZPH.apply(ShareDefine, []);
KFMJ.apply(ShareDefine, []);
NJMJ.apply(ShareDefine, []);
JAMJ.apply(ShareDefine, []);
XJLSHMJ.apply(ShareDefine, []);
YZYZMJ.apply(ShareDefine, []);
LXMJ.apply(ShareDefine, []);
CXMJ.apply(ShareDefine, []);
LS13579.apply(ShareDefine, []);
LSKJJMJ.apply(ShareDefine, []);
LSLWZMJ.apply(ShareDefine, []);
JCMJ.apply(ShareDefine, []);
FXMJ.apply(ShareDefine, []);
HBTDHMJ.apply(ShareDefine, []);
HBHBMJ.apply(ShareDefine, []);
NXKWMJ.apply(ShareDefine, []);
YZGYMJ.apply(ShareDefine, []);
SQSYMJ.apply(ShareDefine, []);
AQMJ.apply(ShareDefine, []);
JDMJ.apply(ShareDefine, []);
ZJWZMJ.apply(ShareDefine, []);
SZMJ.apply(ShareDefine, []);
ZJSHZMJ.apply(ShareDefine, []);
WHMJ.apply(ShareDefine, []);
YGJZMJ.apply(ShareDefine, []);
TMHHMJ.apply(ShareDefine, []);
JXMJ.apply(ShareDefine, []);
LCMJ.apply(ShareDefine, []);
QZCSMJ.apply(ShareDefine, []);
JCHHMJ.apply(ShareDefine, []);
LSMJ.apply(ShareDefine, []);
YSZMJ.apply(ShareDefine, []);
YXBZMJ.apply(ShareDefine, []);
YCTJMJ.apply(ShareDefine, []);
CQHSZMJ.apply(ShareDefine, []);
HBWHMJ.apply(ShareDefine, []);
JSNYZMJ.apply(ShareDefine, []);
ZZNSB.apply(ShareDefine, []);
AK159MJ.apply(ShareDefine, []);
YLDGZMJ.apply(ShareDefine, []);
DLQHMJ.apply(ShareDefine, []);
LLFYMJ.apply(ShareDefine, []);
LPSMJ.apply(ShareDefine, []);
SXHTMJ.apply(ShareDefine, []);
SXLSMJ.apply(ShareDefine, []);
DZMJ.apply(ShareDefine, []);
DKGMJ.apply(ShareDefine, []);
GZMJ.apply(ShareDefine, []);
XFGZMJ.apply(ShareDefine, []);
JXNDMJ.apply(ShareDefine, []);
GNMJ.apply(ShareDefine, []);
HNMJ.apply(ShareDefine, []);
MMMJ.apply(ShareDefine, []);
RJMJ.apply(ShareDefine, []);
DNMJ.apply(ShareDefine, []);
LNMJ.apply(ShareDefine, []);
FCMJ.apply(ShareDefine, []);
HFMJ.apply(ShareDefine, []);
MASMJ.apply(ShareDefine, []);
YJMJ.apply(ShareDefine, []);
XHZMJ.apply(ShareDefine, []);
QYMJ.apply(ShareDefine, []);
XL2VS2MJ.apply(ShareDefine, []);
XJMJ.apply(ShareDefine, []);
FZJXMJ.apply(ShareDefine, []);
JMGGHMJ.apply(ShareDefine, []);
SCMJ.apply(ShareDefine, []);
YTYJMJ.apply(ShareDefine, []);
YDDGMJ.apply(ShareDefine, []);
NKBHMJ.apply(ShareDefine, []);
JMSKMJ.apply(ShareDefine, []);
LKMJ.apply(ShareDefine, []);
JZMJ.apply(ShareDefine, []);
LAMJ.apply(ShareDefine, []);
XYXMJ.apply(ShareDefine, []);
FZGCMJ.apply(ShareDefine, []);
XXFQMJ.apply(ShareDefine, []);
MZMJ.apply(ShareDefine, []);
AHHNMJ.apply(ShareDefine, []);
LYGCMJ.apply(ShareDefine, []);
DXBJMJ.apply(ShareDefine, []);
GCBGMJ.apply(ShareDefine, []);
TXMJ.apply(ShareDefine, []);
ZKLYMJ.apply(ShareDefine, []);
XYSCMJ.apply(ShareDefine, []);
GSMJ.apply(ShareDefine, []);
SXMMJ.apply(ShareDefine, []);
GXMJ.apply(ShareDefine, []);
PDSYXMJ.apply(ShareDefine, []);
ZMDMJ.apply(ShareDefine, []);
ZXMJ.apply(ShareDefine, []);
NZMJ.apply(ShareDefine, []);
XYGSMJ.apply(ShareDefine, []);
WGFHMJ.apply(ShareDefine, []);
DZSJZMJ.apply(ShareDefine, []);
SSPMJ.apply(ShareDefine, []);
A3PK.apply(ShareDefine, []);
GLZP.apply(ShareDefine, []);
YXSRDDZ.apply(ShareDefine, []);
YXDDZ.apply(ShareDefine, []);
GXCDD.apply(ShareDefine, []);
XYXXMJ.apply(ShareDefine, []);
DEMOMJ.apply(ShareDefine, []);
XXTDHMJ.apply(ShareDefine, []);
NYTHMJ.apply(ShareDefine, []);
FCTDHMJ.apply(ShareDefine, []);
HZJDMJ.apply(ShareDefine, []);
XYHCMJ.apply(ShareDefine, []);
YHMJ.apply(ShareDefine, []);
GLQZMJ.apply(ShareDefine, []);
YYMJ.apply(ShareDefine, []);
YZCHZ.apply(ShareDefine, []);
QJFXJMJ.apply(ShareDefine, []);
TJMJ.apply(ShareDefine, []);
YJNXMJ.apply(ShareDefine, []);
GFT258MJ.apply(ShareDefine, []);
HNSYMJ.apply(ShareDefine, []);
XTLHMJ.apply(ShareDefine, []);
XSMJ.apply(ShareDefine, []);
GSLZMJ.apply(ShareDefine, []);
LFPHMJ.apply(ShareDefine, []);
HYLYMJ.apply(ShareDefine, []);
HNYJMJ.apply(ShareDefine, []);
TJTJMJ.apply(ShareDefine, []);
NMGYZMJ.apply(ShareDefine, []);
BAMJ.apply(ShareDefine, []);
AHHBMJ.apply(ShareDefine, []);
SFPHMJ.apply(ShareDefine, []);
JCAHMJ.apply(ShareDefine, []);
XNMJ.apply(ShareDefine, []);
HYHSMJ.apply(ShareDefine, []);
JSMJ.apply(ShareDefine, []);
SDJNMJ.apply(ShareDefine, []);
ZCMJ.apply(ShareDefine, []);
NYXXMJ.apply(ShareDefine, []);
TBHMJ.apply(ShareDefine, []);
PDSLSMJ.apply(ShareDefine, []);
NXMJ.apply(ShareDefine, []);
RZMJ.apply(ShareDefine, []);
CZDZMJ.apply(ShareDefine, []);
JAWZ.apply(ShareDefine, []);
THBBZ.apply(ShareDefine, []);
ZGQZMJ.apply(ShareDefine, []);
SD.apply(ShareDefine, []);
SQYCMJ.apply(ShareDefine, []);
MYMJ.apply(ShareDefine, []);
MYXZMJ.apply(ShareDefine, []);
PDSJXMJ.apply(ShareDefine, []);
AFMJ.apply(ShareDefine, []);
STSTMJ.apply(ShareDefine, []);
YFCGMJ.apply(ShareDefine, []);
STMJ.apply(ShareDefine, []);
QCDG.apply(ShareDefine, []);
QYPHMJ.apply(ShareDefine, []);
BFMJ.apply(ShareDefine, []);
HFBZMJ.apply(ShareDefine, []);
CYLYMJ.apply(ShareDefine, []);
DTMJ.apply(ShareDefine, []);
CZCZMJ.apply(ShareDefine, []);
TSDG.apply(ShareDefine, []);
PHMJ.apply(ShareDefine, []);
XSY.apply(ShareDefine, []);
WZQSMJ.apply(ShareDefine, []);
JZWZMJ.apply(ShareDefine, []);
GJMJ.apply(ShareDefine, []);
GDCZMJ.apply(ShareDefine, []);
ASMJ.apply(ShareDefine, []);
HW.apply(ShareDefine, []);
QBSK.apply(ShareDefine, []);
SCPK.apply(ShareDefine, []);
WXZMMJ.apply(ShareDefine, []);
LNSYMJ.apply(ShareDefine, []);
ST.apply(ShareDefine, []);
YCSDR.apply(ShareDefine, []);
HLDMJ.apply(ShareDefine, []);
BSMJ.apply(ShareDefine, []);
QJFBBMJ.apply(ShareDefine, []);
CP.apply(ShareDefine, []);
XYWSK.apply(ShareDefine, []);
FCSJ.apply(ShareDefine, []);
CXYXMJ.apply(ShareDefine, []);
YCSGMJ.apply(ShareDefine, []);
JMJSMJ.apply(ShareDefine, []);
DSMJ.apply(ShareDefine, []);
JXYZ.apply(ShareDefine, []);
YCFXMJ.apply(ShareDefine, []);
SCNJMJ.apply(ShareDefine, []);
NBCXMJ.apply(ShareDefine, []);
CXXZMJ.apply(ShareDefine, []);
THKB.apply(ShareDefine, []);
PTMJ.apply(ShareDefine, []);
KLMJ.apply(ShareDefine, []);
QWWES.apply(ShareDefine, []);
YFMJ.apply(ShareDefine, []);
JAYXDDZ.apply(ShareDefine, []);
GAST.apply(ShareDefine, []);
HEBMJ.apply(ShareDefine, []);
PYSFT.apply(ShareDefine, []);
SXZJMJ.apply(ShareDefine, []);
SCGAMJ.apply(ShareDefine, []);
SCLSMJ.apply(ShareDefine, []);
SXMJ.apply(ShareDefine, []);
LWMJ.apply(ShareDefine, []);
WABJMJ.apply(ShareDefine, []);
XJBJMJ.apply(ShareDefine, []);
YCHP.apply(ShareDefine, []);
SSE.apply(ShareDefine, []);
SDZZMJ.apply(ShareDefine, []);
LGMJ.apply(ShareDefine, []);
LSYJMJ.apply(ShareDefine, []);
CDP.apply(ShareDefine, []);
CDXZMJ.apply(ShareDefine, []);
LZXZMJ.apply(ShareDefine, []);
WFBH.apply(ShareDefine, []);
PXMJ.apply(ShareDefine, []);
SDLCMJ.apply(ShareDefine, []);
ZJGMJ.apply(ShareDefine, []);
ZJTZMJ.apply(ShareDefine, []);
SYS.apply(ShareDefine, []);
CNMJ.apply(ShareDefine, []);
DZZJ.apply(ShareDefine, []);
SDHZMJ.apply(ShareDefine, []);
XLHZMJ.apply(ShareDefine, []);
PYDD.apply(ShareDefine, []);
NCAYMJ.apply(ShareDefine, []);
KSMJ.apply(ShareDefine, []);
SYSYBP.apply(ShareDefine, []);
TAMJ.apply(ShareDefine, []);
DPHMJ.apply(ShareDefine, []);
QDJT.apply(ShareDefine, []);
LSXZMJ.apply(ShareDefine, []);
JAYXMJ.apply(ShareDefine, []);
XSDQ.apply(ShareDefine, []);
LHGMMJ.apply(ShareDefine, []);
HCNG.apply(ShareDefine, []);
JTMJ.apply(ShareDefine, []);
YBGXMJ.apply(ShareDefine, []);
JTPDK.apply(ShareDefine, []);
XWMJ.apply(ShareDefine, []);
TZPDK.apply(ShareDefine, []);
WJMJ.apply(ShareDefine, []);
QDBH.apply(ShareDefine, []);
TJTGMJ.apply(ShareDefine, []);
HAXYMJ.apply(ShareDefine, []);
ZYMJ.apply(ShareDefine, []);
NTCP.apply(ShareDefine, []);
LNJZMJ.apply(ShareDefine, []);
JSSNMJ.apply(ShareDefine, []);
JYESSZ.apply(ShareDefine, []);
XCMJ.apply(ShareDefine, []);
HZBDMJ.apply(ShareDefine, []);
BDJHMJ.apply(ShareDefine, []);
XCPDK.apply(ShareDefine, []);
// ###.apply(ShareDefine, [])_Flag

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	return ShareDefine;
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
        //# sourceMappingURL=ShareDefine.js.map
        