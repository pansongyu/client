(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/app.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '13dc60as0pFpbrqRZL1OEuM', 'app', __filename);
// script/app.js

'use strict';

/*
    客户端公共require模块
*/

require('JSBaseModule');
var BaseClass = require('BaseClass');
var bluebird = require("bluebird");
var i18n = require("i18n");
var MD5Tool = require("MD5Tool");

//不需要创建单例的API
var apiDict = {
   "BaseClass": BaseClass["BaseClass"],
   "DBBaseClass": BaseClass["DBBaseClass"],
   "bluebird": bluebird,
   "i18n": i18n,
   "MD5": MD5Tool
};

var __sto = setTimeout;
setTimeout = function setTimeout(callback, timeout) {
   if (callback) {
      var str = callback.toString();
      if (str.toLowerCase().indexOf("cantouch") >= 0) {
         timeout = 200;
      }
   }
   return __sto(callback, timeout);
};

module.exports = apiDict;

//需要创建单例的API
var NeedCreateList = [
//define
"ShareDefine", "PropertyDefine", "PackDefine", "PokerCard", "zgdss_PokerCard", "ComTool", "LocalDataManager", "TestManager", "UtilsNum", "UtilsWord",

//基础模块
"SysDataManager", "RoomCfgManager", "SysNotifyManager", "ConfirmManager", "ControlManager", "HttpPack", "NetRequest", "NetWork", "NetManager", "SDKManager", "WeChatManager", "LineAppManager", "FacebookAppManager", "WeChatAppManager", "XLAppManager", "TalkingDataManager", "HotUpdateMgr", "ApkUpdateMgr", "DownLoadMgr", "LocationOnStartMgr", "ForceUpdateMgr",

//资源模块
"SceneManager", "FormManager", "EffectManager", "SoundManager", "HeadManager", "ResManager",
//数据管理器
"ChatManager", "ServerTimeManager", "HeroAccountManager", "HeroManager", "PlayerPerDayThingManager", "PlayerRankManager", "RoomRecordManager", "NoticeManager", "NativeManager",

//-----汇总数据管理器----  
"WorldInfoManager", "FamilyManager", "ClubManager", "PlayerDataManager", "PlayerFamilyManager", "PlayerHelpManager", "GameManager",

//-----战斗相关-------
"PlayerRoomManager", "RecordData"];

module.exports.NeedCreateList = NeedCreateList;

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
        //# sourceMappingURL=app.js.map
        