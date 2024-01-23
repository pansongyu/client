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
    "BaseClass":BaseClass["BaseClass"],
    "DBBaseClass":BaseClass["DBBaseClass"],
    "bluebird":bluebird,
    "i18n":i18n,
    "MD5":MD5Tool,
}

var __sto = setTimeout;
setTimeout = function(callback,timeout){
  if (callback) {
     let str = callback.toString()
     if (str.toLowerCase().indexOf("cantouch") >= 0) {
        timeout = 200
     }
  }
  return __sto(callback,timeout);
}

module.exports = apiDict;

//需要创建单例的API
let NeedCreateList = [
    //define
    "ShareDefine",
    "PropertyDefine",
    "PackDefine",
    "PokerCard",
    "zgdss_PokerCard",
    "ComTool",
    "LocalDataManager",
    "TestManager",
    "UtilsNum",
    "UtilsWord",
    
    //基础模块
    "SysDataManager",
    "RoomCfgManager",
    "SysNotifyManager",
    "ConfirmManager",
    "ControlManager",
    "HttpPack",
    "NetRequest",
    "NetWork",
    "NetManager",
    "SDKManager",
    "WeChatManager",
    "LineAppManager",
    "FacebookAppManager",
    "WeChatAppManager",
    "XLAppManager",
    "TalkingDataManager",
    "HotUpdateMgr",
    "ApkUpdateMgr",
    "DownLoadMgr",
    "LocationOnStartMgr",
    "ForceUpdateMgr",
    
    //资源模块
    "SceneManager",
    "FormManager",
    "EffectManager",
	"SoundManager",
    "HeadManager",
    "ResManager",
    //数据管理器
    "ChatManager",
    "ServerTimeManager",
    "HeroAccountManager",
    "HeroManager",
    "PlayerPerDayThingManager",

    "PlayerRankManager",
    "RoomRecordManager",

    "NoticeManager",
    "NativeManager",

    //-----汇总数据管理器----  
    "WorldInfoManager",
    "FamilyManager",
    "ClubManager",
    "PlayerDataManager",
    "PlayerFamilyManager",
    "PlayerHelpManager",
	"GameManager",

    //-----战斗相关-------
	"PlayerRoomManager",
    "RecordData",
];


module.exports.NeedCreateList = NeedCreateList;