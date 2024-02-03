(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/common/pdk_ShareDefine.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'typdk972-81b4-449b-9387-7becdf8675d5', 'pdk_ShareDefine', __filename);
// script/common/pdk_ShareDefine.js

"use strict";

/*
 *  pdk_ShareDefine.js
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

var pdk_ShareDefine = {};

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
	//申请解散次数
	this.ApplyDissolve = 5125;
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

	//手牌错误码
	this.OpCard_Error = 15001;

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

var Game = function Game() {
	//斗地主
	this.GameType_PDK = 7;

	this.GametTypeNameDict = {};
	this.GametTypeNameDict["PDK"] = this.GameType_PDK;

	this.GametTypeID2Name = {};
	this.GametTypeID2Name[this.GameType_PDK] = "跑得快";

	this.GametTypeID2PinYin = {};
	this.GametTypeID2PinYin[this.GameType_PDK] = "pdk";
};

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

//-----基础---
Color.apply(pdk_ShareDefine, []);
Common.apply(pdk_ShareDefine, []);
GM.apply(pdk_ShareDefine, []);
Order.apply(pdk_ShareDefine, []);
Code.apply(pdk_ShareDefine, []);
Timer.apply(pdk_ShareDefine, []);
Chat.apply(pdk_ShareDefine, []);
Model.apply(pdk_ShareDefine, []);
Form.apply(pdk_ShareDefine, []);
Hero.apply(pdk_ShareDefine, []);
Effect.apply(pdk_ShareDefine, []);
SDK.apply(pdk_ShareDefine, []);
Mail.apply(pdk_ShareDefine, []);
Game.apply(pdk_ShareDefine, []);
//-----项目---
Rank.apply(pdk_ShareDefine, []);
Room.apply(pdk_ShareDefine, []);
/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	return pdk_ShareDefine;
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
        //# sourceMappingURL=pdk_ShareDefine.js.map
        