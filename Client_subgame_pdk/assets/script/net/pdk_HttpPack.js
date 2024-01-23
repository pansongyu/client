/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDCat Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package BasePackReceive.js
 *
 *  @author hongdian
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */

//客户端发送给服务器的封包
var ClientHttpPackDict = {
	//注册账号
	"client.0xFF00.account":"OneKeyRegAccount",
	"client.0xFF01.order":"CheckOrder",
	"client.0xFF02.account":"LoginAccountBySDK",
	"client.0xFF03.account":"LoginAccount",
	"client.0xFF04.account":"RequestAccountHeadImageUrl",
	"client.0xFF05.account":"IsSubscribeWeChatMP",
	"client.0xFF06.account":"RequestWeChatSDKIntSign",
	"client.0xFF07.account":"RegAccount",
	"client.0xFF08.account":"ChangeAccountPsw",
	"client.0xFF09.res":"LoadHeadImage",
	"client.0xFF0A.order":"CreatePrepayOrder",
	"client.0xFF10.gate":"RequestClientConfig",
	//FF00-FF5F:基础预留封包头 项目起始封包FF60
};

//服务器发送给客户端的封包
var ServerHttpPackDict = {
	//注册账号回复
	"account.0x0000.client":"AccountLogin",
	"order.0x0001.client":"CheckOrderResult",
	"account.0x0002.client":"AccountHeadImageUrl",
	"account.0x0003.client":"IsSubscribeWeChatMPResult",
	"account.0x0004.client":"RequestWeChatSDKInitSignResult",
	"account.0x0005.client":"RegAccountResult",
	"account.0x0006.client":"ChangeAccountPswResult",
	"res.0x0007.client":"HeadImagePathInfo",
	"order.0x0008.client":"PrepayOrderInfo",
	"gate.0x0009.client":"ClientConfig",
	//FF00-FF5F:基础预留封包头 项目起始封包FF60
};

//服务器间通信的封包
var ServerToServerHttpPackDict = {
	//检测账号token是否合法
	"manager.0x0001.account":"CheckAccountAuthToken",
	//充值兑换
	"order.0x0002.manager":"ExchangeOrder",
	//GM命令
	"gm.0x0003.account":"GMAction",
	//GM命令
	"gm.0x0004.order":"GMAction",
	//GM命令
	"gm.0x0005.manager":"GMAction",
	//GM命令
	"gm.0x0006.wechat":"GMAction",
	//account服务器请求wechat信息
	"account.0x0007.wechat":"WeChatAccessToken",
	//order服务器请求wechat信息
	"order.0x0008.wechat":"WeChatAccessToken",
	//wechatt服务器通知account信息
	"wechat.0x0009.account":"WeChatAccessToken",
	//wechatt服务器通知order信息
	"wechat.0x000A.order":"WeChatAccessToken",
	//FF00-FF5F:基础预留封包头 项目起始封包FF60
};



var g_pdk_HttpPackDict = {
	"ClientHttpPackDict":ClientHttpPackDict,
	"ServerHttpPackDict":ServerHttpPackDict,
	"ServerToServerHttpPackDict":ServerToServerHttpPackDict,
};

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	return g_pdk_HttpPackDict
}