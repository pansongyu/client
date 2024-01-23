(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIClubForbid.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9e6efmH5W1ExZofyRRuKFQJ', 'UIClubForbid', __filename);
// script/ui/club/UIClubForbid.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        forbid_demo: cc.Node,
        forbid_layout: cc.Node
    },

    //初始化
    OnCreateInit: function OnCreateInit() {},

    //---------显示函数--------------------

    OnShow: function OnShow(clubId, heroID) {
        this.clubId = clubId;
        this.ShowForbid();
    },
    OnClose: function OnClose() {
        this.node.getChildByName("EditBoxForbid1").getComponent(cc.EditBox).string = '';
        this.node.getChildByName("EditBoxForbid2").getComponent(cc.EditBox).string = '';
    },

    RefreshForbid: function RefreshForbid(groupingId) {
        var that = this;
        app.NetManager().SendPack("club.CClubGroupingList", { "clubId": this.clubId }, function (success) {
            if (success.length > 0) {
                var nodePrefab = that.forbid_layout.getChildByName("forbid_" + groupingId);
                for (var i = 0; i < success.length; i++) {
                    if (success[i].groupingId != groupingId) {
                        continue;
                    }
                    nodePrefab.getChildByName('renshu').getChildByName('lb').getComponent(cc.Label).string = "限制人数：" + success[i].groupingSize + "斜15";
                    nodePrefab.getChildByName('layout').getChildByName('user1').active = false;
                    nodePrefab.getChildByName('layout').getChildByName('user2').active = false;
                    for (var j = 0; j < success[i].playerList.length; j++) {
                        var usernode = nodePrefab.getChildByName('layout').getChildByName('user' + (j + 1));
                        usernode.active = true;
                        var heroID = success[i].playerList[j]["pid"];
                        var headImageUrl = success[i].playerList[j]["iconUrl"];
                        usernode.getChildByName('name').getComponent(cc.Label).string = that.ComTool.GetBeiZhuName(heroID, success[i].playerList[j].name);
                        usernode.getChildByName('id').getComponent(cc.Label).string = app.i18n.t("UIMain_PIDText", { "pid": that.ComTool.GetPid(heroID) });
                        var WeChatHeadImage = usernode.getChildByName('head').getChildByName('img').getComponent("WeChatHeadImage");
                        WeChatHeadImage.OnLoad();
                        //用户头像创建
                        if (heroID && headImageUrl) {
                            app.WeChatManager().InitHeroHeadImage(heroID, headImageUrl);
                        }
                        usernode.getChildByName('btn_forbit_del_user').pid = heroID;
                        usernode.getChildByName('btn_forbit_del_user').groupingId = success[i].groupingId;
                        WeChatHeadImage.OnLoad();
                        WeChatHeadImage.ShowHeroHead(heroID, headImageUrl);
                    }
                }
            }
        }, function (error) {});
    },

    ShowForbid: function ShowForbid() {
        var pid1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var pid2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        var that = this;
        //this.forbid_layout.removeAllChildren();
        var sendPack = {};
        sendPack.clubId = this.clubId;
        sendPack.pidOne = pid1;
        sendPack.pidTwo = pid2;

        this.DestroyAllChildren(this.forbid_layout);
        app.NetManager().SendPack("club.CClubGroupingList", sendPack, function (success) {
            if (success.length > 0) {
                for (var i = 0; i < success.length; i++) {
                    var nodePrefab = cc.instantiate(that.forbid_demo);
                    nodePrefab.name = "forbid_" + success[i].groupingId;
                    nodePrefab.getChildByName('renshu').getChildByName('lb').getComponent(cc.Label).string = i + 1 + ".限制人数：" + success[i].groupingSize + "斜15";
                    nodePrefab.groupingId = success[i].groupingId;
                    nodePrefab.getChildByName('layout').getChildByName('user1').active = false;
                    nodePrefab.getChildByName('layout').getChildByName('user2').active = false;
                    nodePrefab.getChildByName('layout').getChildByName('btn_set_forbit').groupingId = success[i].groupingId;

                    nodePrefab.getChildByName('btn_set_forbit').groupingId = success[i].groupingId;
                    nodePrefab.getChildByName('btn_del_forbit').groupingId = success[i].groupingId;

                    nodePrefab.active = true;
                    that.forbid_layout.addChild(nodePrefab);
                    for (var j = 0; j < success[i].playerList.length; j++) {
                        var usernode = nodePrefab.getChildByName('layout').getChildByName('user' + (j + 1));
                        usernode.active = true;
                        var heroID = success[i].playerList[j]["pid"];
                        var headImageUrl = success[i].playerList[j]["iconUrl"];
                        usernode.getChildByName('name').getComponent(cc.Label).string = that.ComTool.GetBeiZhuName(heroID, success[i].playerList[j].name);
                        usernode.getChildByName('id').getComponent(cc.Label).string = app.i18n.t("UIMain_PIDText", { "pid": that.ComTool.GetPid(heroID) });
                        var WeChatHeadImage = usernode.getChildByName('head').getChildByName('img').getComponent("WeChatHeadImage");
                        WeChatHeadImage.OnLoad();
                        //用户头像创建
                        if (heroID && headImageUrl) {
                            app.WeChatManager().InitHeroHeadImage(heroID, headImageUrl);
                        }
                        usernode.getChildByName('btn_forbit_del_user').pid = heroID;
                        usernode.getChildByName('btn_forbit_del_user').groupingId = success[i].groupingId;
                        WeChatHeadImage.ShowHeroHead(heroID, headImageUrl);
                    }
                }
            }
        }, function (error) {});
    },
    //---------点击函数---------------------
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
        var msgArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cbArg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg);
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
    },
    //---------点击函数---------------------

    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_set_forbit' == btnName) {
            this.FormManager.ShowForm('ui/club/UIForbidUserList', this.clubId, btnNode.groupingId);
        } else if ('btn_del_forbit' == btnName) {
            var groupingId = btnNode.groupingId;
            app.NetManager().SendPack('club.CClubGroupingRemove', { 'clubId': this.clubId, 'groupingId': groupingId });
            btnNode.parent.destroy();
        } else if ('btn_forbit_del_user' == btnName) {
            app.NetManager().SendPack('club.CClubGroupingPidRemove', { 'clubId': this.clubId, 'groupingId': btnNode.groupingId, "pid": btnNode.pid });
            this.RefreshForbid(btnNode.groupingId);
        } else if ('btn_add_forbid' == btnName) {
            var self = this;
            app.NetManager().SendPack('club.CClubGroupingAdd', { 'clubId': this.clubId }, function (serverPack) {
                self.ShowForbid();
            }, function (error) {});
        } else if ('btn_ForbidSearch' == btnName) {
            var pid1 = this.node.getChildByName("EditBoxForbid1").getComponent(cc.EditBox).string;
            var pid2 = this.node.getChildByName("EditBoxForbid2").getComponent(cc.EditBox).string;
            if (pid1 != '' || pid2 != '') {
                this.ShowForbid(pid1, pid2);
            }
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    }
});

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
        //# sourceMappingURL=UIClubForbid.js.map
        