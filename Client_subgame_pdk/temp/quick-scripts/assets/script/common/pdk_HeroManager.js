(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/common/pdk_HeroManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'typdkb80-918e-437a-b5cf-d7f55c2bd00a', 'pdk_HeroManager', __filename);
// script/common/pdk_HeroManager.js

"use strict";

/*
    玩家个人数据管理器
*/
var app = require("pdk_app");

var pdk_HeroManager = app.BaseClass.extend({

    Init: function Init() {
        this.JS_Name = app.subGameName + "_HeroManager";

        var SysDataManager = app[app.subGameName + "_SysDataManager"]();
        this.NetManager = app[app.subGameName + "_NetManager"]();
        this.ShareDefine = app[app.subGameName + "_ShareDefine"]();
        this.ComTool = app[app.subGameName + "_ComTool"]();

        this.NetManager.RegNetPack("playerchanged", this.OnPack_HeroProperty, this);

        this.OnReload();

        // this.Log("Init");
    },

    //切换账号
    OnReload: function OnReload() {
        this.dataInfo = {};
        this.heroID = 0;
    },

    //登陆初始化数据
    InitLoginData: function InitLoginData(heroID, heroInfo) {
        this.dataInfo = heroInfo;
        this.heroID = heroID;
        //记录用户活跃度
        if (!cc.sys.isNative) {
            heroInfo['vipExp'] = 0;
        }
        app.LocalDataManager().SetConfigProperty("Account", "AccountActive", heroInfo['vipExp']);
        app[app.subGameName + "Client"].OnEvent("ReloadHeroData", {});
    },

    //-------------------封包函数--------------------------
    //属性变化
    OnPack_HeroProperty: function OnPack_HeroProperty(serverPack) {

        var count = serverPack.length;
        for (var index = 0; index < count; index++) {
            var dataInfo = serverPack[index];
            var property = dataInfo["name"];
            this.SetHeroProperty(property, dataInfo["value"]);
        }
    },

    //----------------设置接口---------------------------
    //设置英雄属性
    SetHeroProperty: function SetHeroProperty(property, value) {
        if (!this.dataInfo.hasOwnProperty(property)) {
            this.ErrLog("SetHeroProperty(%s,%s) error", property, value);
            return false;
        }
        this.dataInfo[property] = value;

        var argDict = {
            "Property": property,
            "Value": value
        };
        app[app.subGameName + "Client"].OnEvent("HeroProperty", argDict);

        return true;
    },

    //----------------获取接口-----------------------------

    //获取英雄ID
    GetHeroID: function GetHeroID() {
        return this.heroID;
    },

    GetHeroInfo: function GetHeroInfo() {
        return this.dataInfo;
    },

    //获取英雄属性值
    GetHeroProperty: function GetHeroProperty(property) {
        if (!this.dataInfo.hasOwnProperty(property)) {
            this.ErrLog("GetHeroProperty(%s) error", property);
            return;
        }
        return this.dataInfo[property];
    }

    //随机角色名
    // GetRandHeroName:function(){
    //     let familyKeyList = Object.keys(this.FamilyName);
    //     let nameKeyList = Object.keys(this.Name);

    //     let familyName = this.FamilyName[this.ComTool.ListChoice(familyKeyList)]["FamilyName"];
    //     let name = this.Name[this.ComTool.ListChoice(nameKeyList)]["Name"];

    //     return [familyName, name].join("");
    // },

    //-------------发包接口------------------------
});

var g_pdk_HeroManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_pdk_HeroManager) {
        g_pdk_HeroManager = new pdk_HeroManager();
    }
    return g_pdk_HeroManager;
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
        //# sourceMappingURL=pdk_HeroManager.js.map
        