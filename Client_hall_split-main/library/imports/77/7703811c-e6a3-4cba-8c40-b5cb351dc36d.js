"use strict";
cc._RF.push(module, '77038Ec5qNMuoxAtcs1HcNt', 'ChatManager');
// script/dbmanager/Chat/ChatManager.js

"use strict";

/*
 * 	ChatManager.js
 * 	聊天管理器
 *
 *	author:cyh
 *	date:2017-01-09
 *	version:1.0
 *
 * 修改时间 修改人 修改内容:
 *
 *
 */
var app = require('app');

/*
 * 类方法定义
 */
var ChatManager = app.BaseClass.extend({

    /**
     *  初始化
     */
    Init: function Init() {
        this.JS_Name = "ChatManager";
        this.SysDataManager = app.SysDataManager();
        this.NetManager = app.NetManager();
        this.ShareDefine = app.ShareDefine();
        this.ComTool = app.ComTool();
        this.SysNotifyManager = app.SysNotifyManager();

        this.NetManager.RegNetPack("chatmessage", this.OnPack_ChatMessage, this);

        //默认加入的频道
        this.defaultEnterChannelList = [{ "ChatType": this.ShareDefine.ChatType_World, "UserData": 0 }, { "ChatType": this.ShareDefine.ChatType_System, "UserData": 0 }];

        this.InitChatData();

        this.OnReload();
    },

    //初始化聊天数据
    InitChatData: function InitChatData() {

        //系统聊天频道
        //{
        //	chatID:{},
        //}
        this.systemChatDict = {};

        //{
        //	heroID:{
        //			"HeroName":"xx",
        //			"VipLv":0,
        //			"HeroLv":100,
        //			"IconGeneralID":0,
        //	}
        //}
        this.allHeroInfo = {};

        // 世界聊天记录字典
        //{
        //	chatID:{},
        //}
        this.worldChatDict = {};

        this.allChatInfo = {};
    },
    //--------------回调接口----------------------------
    /**
     * 重登清理
     * @param {}
     * @return {}
     * @remarks {}
     */
    OnReload: function OnReload() {},
    //-----------------收包接口------------------------
    OnPack_ChatMessage: function OnPack_ChatMessage(serverPack) {
        console.log("serverPack:" + serverPack);
        app.Client.OnEvent("ChatMessage", serverPack);
    },

    //-----------------获取接口--------------------
    GetChatChannelDataDict: function GetChatChannelDataDict(chatType, userData) {
        var chatDict = {};

        if (chatType == this.ShareDefine.ChatType_World) {
            chatDict = this.worldChatDict;
        }

        return chatDict;
    },

    GetChatInfoByChatID: function GetChatInfoByChatID(chatID) {
        //不存在
        if (!this.allChatInfo.hasOwnProperty(chatID)) {
            this.ErrLog("GetChatInfoByChatID not find:{1}", chatID);
            return;
        }

        return this.allChatInfo[chatID];
    },

    GetChatHeroInfo: function GetChatHeroInfo(heroID) {
        if (!this.allHeroInfo.hasOwnProperty(heroID)) {
            this.ErrLog("GetChatHeroInfo not find heroID:%s", heroID);
            return false;
        }

        return this.allHeroInfo[heroID];
    },
    GetBaseByQuickId: function GetBaseByQuickId(quickID, playerSex, content) {
        var soundName = '';
        var path = '';
        if (quickID < 101) {
            switch (quickID) {
                case 1:
                    content = app.i18n.t("UIVoiceStringBieChao");
                    soundName = [playerSex, "_FastVoice_1"].join("");
                    break;
                case 2:
                    content = app.i18n.t("UIVoiceStringBieZou");
                    soundName = [playerSex, "_FastVoice_2"].join("");
                    break;
                case 3:
                    content = app.i18n.t("UIVoiceStringZhaoHu");
                    soundName = [playerSex, "_FastVoice_3"].join("");
                    break;
                case 4:
                    content = app.i18n.t("UIVoiceStringZanLi");
                    soundName = [playerSex, "_FastVoice_4"].join("");
                    break;
                case 5:
                    content = app.i18n.t("UIVoiceStringZanShang");
                    soundName = [playerSex, "_FastVoice_5"].join("");
                    break;
                case 6:
                    content = app.i18n.t("UIVoiceStringCuiCu");
                    soundName = [playerSex, "_FastVoice_6"].join("");
                    break;
                case 7:
                    content = app.i18n.t("UIVoiceStringKuaJiang");
                    soundName = [playerSex, "_FastVoice_7"].join("");
                    break;
                case 8:
                    content = app.i18n.t("UIVoiceStringDaShang");
                    soundName = [playerSex, "_FastVoice_8"].join("");
                    break;
                case 9:
                    content = app.i18n.t("UIVoiceStringLiKai");
                    soundName = [playerSex, "_FastVoice_9"].join("");
                    break;
                case 10:
                    content = app.i18n.t("UIVoiceStringYanChi");
                    soundName = [playerSex, "_FastVoice_10"].join("");
                    break;
                default:
                    this.ErrLog("Event_chatmessage not find(%s)", quickID);
            }
        } else {
            switch (quickID) {
                case 101:
                    path = "face1Action";
                    break;
                case 102:
                    path = "face2Action";
                    break;
                case 103:
                    path = "face3Action";
                    break;
                case 104:
                    path = "face4Action";
                    break;
                case 105:
                    path = "face5Action";
                    break;
                case 106:
                    path = "face6Action";
                    break;
                case 107:
                    path = "face7Action";
                    break;
                case 108:
                    path = "face8Action";
                    break;
                case 109:
                    path = "face9Action";
                    break;
                case 110:
                    path = "face10Action";
                    break;
                case 111:
                    path = "face11Action";
                    break;
                case 112:
                    path = "face12Action";
                    break;
                case 113:
                    path = "face13Action";
                    break;
                case 114:
                    path = "face14Action";
                    break;
                case 115:
                    path = "face15Action";
                    break;
                default:
                    this.ErrLog("Event_chatmessage not find(%s)", quickID);
            }
        }
        var data = {};
        data.content = content;
        data.soundName = soundName;
        data.path = path;
        return data;
    }
    //-----------------发包接口----------------------------
});

var g_ChatManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_ChatManager) {
        g_ChatManager = new ChatManager();
    }
    return g_ChatManager;
};

cc._RF.pop();