/*
    客户端公共require模块
*/
require('JSBaseModule');
let BaseClass = require('BaseClass');
let bluebird = require("bluebird");
let i18n = require("i18n");
let MD5Tool = require("MD5Tool");

//不需要创建单例的API
let apiDict = {
	"BaseClass": BaseClass["BaseClass"],
	"DBBaseClass": BaseClass["DBBaseClass"],
	"bluebird": bluebird,
	"i18n": i18n,
	"MD5": MD5Tool,
};


module.exports = apiDict;

//子游戏名称
let subGameName = "nn";

module.exports.subGameName = subGameName;

//需要创建单例的API
let NeedCreateList = [
	//define
	subGameName.toLowerCase()+"_ShareDefine",

	subGameName.toLowerCase()+"_ComTool",
	"LocalDataManager",
	subGameName.toLowerCase()+"_UtilsWord",

	//基础模块
	subGameName.toLowerCase()+"_SysDataManager",
	subGameName.toLowerCase()+"_SysNotifyManager",
	subGameName.toLowerCase()+"_ConfirmManager",
	subGameName.toLowerCase()+"_ControlManager",
	subGameName.toLowerCase()+"_HttpPack",
	subGameName.toLowerCase()+"_NetRequest",
	subGameName.toLowerCase()+"_NetWork",
	subGameName.toLowerCase()+"_NetManager",
	subGameName.toLowerCase()+"_SDKManager",
	subGameName.toLowerCase()+"_WeChatManager",
	subGameName.toLowerCase()+"_ChatManager",
	subGameName.toLowerCase()+"_WeChatAppManager",
	subGameName.toLowerCase()+"_DownLoadMgr",
	subGameName.toLowerCase()+"_LocationOnStartMgr",
	subGameName.toLowerCase()+"_HotUpdateMgr",

	//资源模块
	subGameName.toLowerCase()+"_SceneManager",
	subGameName.toLowerCase()+"_FormManager",
	subGameName.toLowerCase()+"_EffectManager",
	subGameName.toLowerCase()+"_SoundManager",
	subGameName.toLowerCase()+"_AudioManager",
	subGameName.toLowerCase()+"_HeadManager",
	//数据管理器
	subGameName.toLowerCase()+"_ServerTimeManager",
	subGameName.toLowerCase()+"_HeroAccountManager",
	subGameName.toLowerCase()+"_HeroManager",

	subGameName.toLowerCase()+"_NativeManager",
	subGameName.toLowerCase()+"_PokerCard",

	//-----汇总数据管理器----
	subGameName.toLowerCase()+"_GameManager",

	//-----牌局相关-------
	subGameName.toUpperCase()+"Room",
	subGameName.toUpperCase()+"RoomMgr",
	subGameName.toUpperCase()+"RoomSet",
	subGameName.toUpperCase()+"RoomPosMgr",
	subGameName.toUpperCase()+"SetPos",
];

module.exports.NeedCreateList = NeedCreateList;