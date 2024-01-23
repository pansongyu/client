(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/dbmanager/Notice/NoticeManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'eb0e8z0H/9DtK/SzsBm+nOY', 'NoticeManager', __filename);
// script/dbmanager/Notice/NoticeManager.js

"use strict";

/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package NoticeManager.js
 *  @todo: 公告管理器
 *
 *  @author hongdian
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require('app');

/**
 * 类构造
 */
var NoticeManager = app.DBBaseClass.extend({

    /**
     * 初始化
     */
    Init: function Init() {

        this.JS_Name = "NoticeManager";

        this.ComTool = app.ComTool();
        this.ShareDefine = app.ShareDefine();
        this.NetManager = app.NetManager();

        this.NetManager.RegNetPack("base.C2226InitNotice", this.OnPack_InitNotice, this);

        //服务器推送
        this.NetManager.RegNetPack("S2226_InitNotice", this.OnPack_InitNotice, this);

        this.sysText = "1.1 \u724C\u6570:\t\n\u5305\u62EC1~9\u7B52\u30011~9\u7D22\u30011~9\u4E07\u54044\u5F20\uFF0C\u5916\u52A04\u5F20\u7EA2\u4E2D\uFF0C\u5171112\u5F20\u724C\u3002\u9AB0\u5B50\uFF1A2\u7C92\n1.2\t\u5E84\u5BB6:\t\n\u7B2C\u4E00\u5C40\u7531\u521B\u5EFA\u623F\u95F4\u7684\u73A9\u5BB6\u505A\u5E84\u5BB6\uFF0C\u540E\u7EED\u8C01\u80E1\u724C\u4E86\uFF0C\u4E0B\u5C40\u5C31\u7531\u8C01\u505A\u5E84\u3002\u82E5\u51FA\u73B0\u8352\u5E84\uFF0C\u5219\u6700\u540E\u6478\u724C\u7684\u4EBA\u505A\u5E84\u3002\n1.3\t\u63B7\u9AB0\u5B50&\u6478\u724C:\t\n\u5E84\u5BB6\u63B7\u9AB0\u5B50\uFF0C\u4E24\u4E2A\u9AB0\u5B50\u7684\u603B\u548C\uFF08\u4EE5\u63B7\u9AB0\u5B50\u9006\u65F6\u9488\u8BA1\u7B97\uFF09\u51B3\u5B9A\u62FF\u724C\u98CE\u4F4D\uFF0C\u9AB0\u5B50\u4E2D\u8F83\u5C0F\u7684\u70B9\u6570\u4E3A\u8D77\u70B9\u6478\u724C\uFF1B\u5982\uFF1A\u5E84\u5BB6\u63B7\u9AB0\u5B50\uFF0C\u9AB0\u5B50\u5206\u522B\u4E3A2\u70B9\u548C3\u70B9\uFF0C\u9AB0\u5B50\u603B\u548C\u4E3A5\u70B9\uFF0C\u5219\u4ECE\u5E84\u5BB6\u6240\u5728\u98CE\u4F4D\u724C\u5899\u4E2D\u987A\u65F6\u9488\u6478\u7B2C3\u30014\u58A9\u724C\uFF0C\u4E0B\u5BB6\u6478\u540E\u7EED\u4E24\u58A9\u724C\uFF0C\u5FAA\u73AF3\u6B21\u7B49\u5230\u6BCF\u4EBA\u624B\u4E0A\u670912\u5F20\u724C\u65F6\u4ECE\u5E84\u5BB6\u8D77\u6BCF\u4EBA\u64781\u5F20\u724C\uFF0C\u6700\u540E\u5E84\u5BB6\u518D\u64781\u5F20\u724C\u3002\u6478\u724C\u987A\u5E8F\u4E3A\u4ECE\u5E84\u5BB6\u5F00\u59CB\u987A\u65F6\u9488\u6478\u724C\u3002\n\u8D77\u624B\u5E84\u5BB6\u6478\u724C14\u5F20\uFF0C\u5176\u4F59\u4E09\u5BB6\u6478\u724C13\u5F20\u3002\n1.4\t\u6253\u724C:\t\n\u8D77\u624B\u5E84\u5BB6\u9700\u4ECE14\u5F20\u724C\u4E2D\u63111\u5F20\u6700\u6CA1\u7528\u7684\u6253\u51FA\uFF0C\u5E84\u5BB6\u6253\u724C\u540E\uFF0C\u5982\u679C\u6CA1\u4EBA\u78B0\u3001\u6760\uFF0C\u5219\u4E0B\u5BB6\u6478\u724C\uFF0C\u7136\u540E\u81EA\u4E3B\u9009\u62E9\u4E00\u5F20\u624B\u4E0A\u7684\u724C\u6253\u51FA\uFF0C\u4F9D\u6B21\u7C7B\u63A8\uFF0C\u76F4\u81F3\u6709\u4EBA\u80E1\u724C\u3002\u6240\u6709\u4EBA\u6253\u51FA\u7684\u724C\uFF0C\u5176\u4F59\u7684\u4EBA\u90FD\u80FD\u78B0\u548C\u6760\uFF0C\u4E0D\u80FD\u5403\u724C\uFF0C\u53EA\u53EF\u81EA\u6478/\u62A2\u6760\u80E1\uFF0C\u4E0D\u53EF\u6293\u70AE\u3002\n1.5\t\u4E00\u53E5\u8BDD:\t\n\u540C\u82B1\u8272\u7684\u4E09\u4E2A\u8FDE\u7EED\u7684\u724C\n1.6\t\u4E00\u574E\u724C:\t\n\u4E09\u4E2A\u4E00\u6837\u7684\u724C\n1.7\t\u78B0\u724C:\t\n\u5176\u4ED6\u73A9\u5BB6\u6253\u51FA\u7684\u724C\uFF0C\u81EA\u5DF1\u624B\u91CC\u6709\u4E24\u4E2A\uFF0C\u5219\u53EF\u4EE5\u78B0\uFF0C\u78B0\u5B8C\u8981\u51FA\u724C\u3002\n1.8\t\u660E\u6760:\t\n\u5148\u78B0\u4E86\u7684\u724C\uFF0C\u540E\u9762\u6478\u5230\u4E00\u5F20\u4E00\u6837\u7684\uFF0C\u5219\u53EF\u4EE5\u9009\u62E9\u6760\uFF0C\uFF08\u516C\u6760\u5FC5\u987B\u7B2C\u4E00\u65F6\u95F4\u6760\uFF0C\u5982\u679C\u6CA1\u6709\u7B2C\u4E00\u65F6\u95F4\u6760\uFF0C\u5219\u4E0D\u80FD\u518D\u6760\uFF09\u3002\n1.9\t\u6697\u6760:\t\n\u624B\u91CC\u67094\u5F20\u4E00\u6837\u7684\u724C\uFF0C\u53EF\u4EE5\u9009\u62E9\u6760\uFF08\u6697\u6760\u4E0D\u9700\u8981\u7B2C\u4E00\u65F6\u95F4\u6760\uFF0C\u53EA\u8981\u6709\u8FD9\u4E2A\u724C\u578B\uFF0C\u6BCF\u4E00\u6B21\u8F6E\u5230\u8BE5\u73A9\u5BB6\u6253\u724C\uFF0C\u90FD\u53EF\u4EE5\u9009\u62E9\u201C\u6760\u201D\uFF09\u3002\n1.10 \u653E\u6760:\t\n\u81EA\u5DF1\u6253\u51FA\u4E00\u5F20\u724C\uFF0C\u540C\u684C\u6709\u73A9\u5BB6\u624B\u91CC\u6709\u4E00\u574E\u76F8\u540C\u7684\u8BE5\u724C\uFF0C\u5219\u8BE5\u73A9\u5BB6\u53EF\u4EE5\u201C\u63A5\u6760\u201D\uFF0C\u6253\u51FA\u8BE5\u724C\u7684\u73A9\u5BB6\u5C31\u662F\u201C\u653E\u6760\u201D\u3002\n1.11 \u63A5\u6760:\t\n\u4E0E\u201C\u653E\u6760\u201D\u5BF9\u5E94\uFF0C\u6709\u4EBA\u201C\u653E\u201D\u5C31\u5BF9\u5E94\u6709\u4EBA\u201C\u63A5\u201D\u3002\u6760\u540E\uFF0C\u9700\u8981\u6478\u8FDB\u724C\u5899\u4E0A\u7684\u6700\u540E\u4E00\u5F20\u724C\uFF08\u8865\u724C\uFF09\uFF0C\u8865\u5F20\u724C\u540E\u8981\u51FA\u724C\u3002\n1.12 \u81EA\u6478:\t\n\u8F6E\u5230\u73A9\u5BB6\u6478\u724C\u65F6\uFF0C\u521A\u597D\u53EF\u4EE5\u4F7F\u81EA\u5DF1\u80E1\u724C\u3002\n1.13 \u62A2\u6760\u80E1: \nA\u73A9\u5BB6\u9009\u62E9\u201C\u516C\u6760\u201D\uFF0C\u800C\u521A\u597D\u6B64\u65F6B\u73A9\u5BB6\u53EF\u4EE5\u80E1\u8FD9\u5F20\u724C\uFF0C\u5219B\u73A9\u5BB6\u53EF\u9009\u62E9\u201C\u62A2\u6760\u201D\uFF0C\u62A2\u6760\u5C31\u662FB\u73A9\u5BB6\u80E1\u724C\uFF0C\u4F46\u662F\u53EA\u6709A\u73A9\u5BB6\u4E00\u4E2A\u4EBA\u8F93\u5168\u90E8\u7684\u5206\u3002\u591A\u4EBA\u62A2\u6760\uFF0C\u591A\u4EBA\u80E1\uFF0C\u88AB\u62A2\u6760\u7684\u73A9\u5BB6\u4E0B\u5C40\u5750\u5E84\u3002\n1.14 \u624E\u7801:\t\n\u6839\u636E\u624E\u7801\u7684\u6570\u91CF\uFF0C\u6700\u540E\u8981\u7559\u5BF9\u5E94\u6570\u91CF\u7684\u724C\u4E0D\u80FD\u6478\uFF0C\u6BD4\u5982\uFF0C\u9009\u62E94\u4E2A\u7801\u7684\u73A9\u6CD5\uFF0C\u90A3\u4E48\u5230\u5012\u6570\u7B2C\u4E94\u5F20\u724C\u88AB\u6478\u540E\uFF0C\u4F9D\u7136\u65E0\u4EBA\u80E1\u724C\uFF0C\u5219\u8352\u5E84\u3002";

        this.Log("create NoticeManager");
    },

    //切换账号
    InitReload: function InitReload() {
        //{
        //	noticeID:{
        //		"mainTitle":"更新公告",
        //			"title":"更新公告",
        //			"time":"2017/02/13 11:00",
        //			"text":"亲爱的玩家:为丰富广大玩家的娱乐生活,仙游将不断推出新的游戏,祝您游戏愉快",
        //	}
        //}

        this.sysDataInfo = {
            1: {
                "mainTitle": "系统公告",
                "title": "系统公告",
                "beginTime": 1490858700000,
                "endTime": 1490945100000,
                "content": this.sysText,
                "clientType": 0
            }
        };

        this.dataInfo = {};

        this.allNoticeInfo = {};
    },
    //------------封包函数------------------
    //初始化成功
    OnInitData: function OnInitData(dataInfo) {
        this.dataInfo = dataInfo["noticeInfoList"];
        app.Client.OnEvent("InitNotice", {});
    },

    //初始化失败
    OnFailInitData: function OnFailInitData(failInfo) {
        this.ErrLog("failInfo:", failInfo);
    },

    //服务器推送初始化
    OnPack_InitNotice: function OnPack_InitNotice(serverPack) {
        this.OnSuccessInitDBData(serverPack);
    },

    //-----------------------获取接口-----------------------------
    //获取所有公告
    GetAllNoticeInfo: function GetAllNoticeInfo() {
        this.AutoInitDataPack();

        //用来存储全部公告的临时字典,初始化为本地默认配置的公告
        var allNotice = this.ComTool.DeepCopy(this.sysDataInfo);
        var allNoticeKeyArray = Object.keys(allNotice);
        var allNoticeKeyArrayMax = this.ComTool.ListMaxNum(allNoticeKeyArray);
        if (!allNoticeKeyArrayMax) {
            allNoticeKeyArrayMax = 1;
        }
        var count = this.dataInfo.length;
        var localTime = new Date().getTime();
        //如果有新的公告就往allNtice里追加
        for (var i = 0; i < count; i++) {

            var notice = this.dataInfo[i];
            var noticeBeginTime = notice["beginTime"];
            var noticeEndTime = notice["endTime"];
            //如果当前时间在公告的开始时间和结束时间内
            if (noticeEndTime > localTime && noticeBeginTime < localTime) {
                allNoticeKeyArrayMax++;
                allNotice[allNoticeKeyArrayMax] = notice;
            }
        }
        this.allNoticeInfo = allNotice;
        return this.allNoticeInfo;
    },
    //获取指定ID的公告
    GetNoticeInfo: function GetNoticeInfo(NoticeID) {
        if (!NoticeID) {
            this.ErrLog("GetNoticeInfo not find NoticeID:%s", NoticeID);
            return;
        }
        return this.allNoticeInfo[NoticeID];
    },
    //-----------------发送接口----------------
    //自动初始化管理器数据封包
    AutoInitDataPack: function AutoInitDataPack() {
        //发送初始化DB数据
        this.LoadInitDB("base.C2226InitNotice", {});
    }

});

var g_NoticeManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
    if (!g_NoticeManager) g_NoticeManager = new NoticeManager();
    return g_NoticeManager;
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
        //# sourceMappingURL=NoticeManager.js.map
        