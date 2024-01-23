"use strict";
cc._RF.push(module, 'bf5b2NiISFE3623oByqB4KP', 'UIPromoterSet_2');
// script/ui/club_2/UIPromoterSet_2.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {},

    //初始化
    OnCreateInit: function OnCreateInit() {},

    //---------显示函数--------------------
    OnShow: function OnShow(clubId, pid, playerData) {
        this.clubId = clubId;
        this.pid = pid;
        this.type = 1; //默认归宿到创建者 0
        this.searchPid = 0;
        this.node.getChildByName("EditBox").getComponent(cc.EditBox).string = "";
        this.node.getChildByName("lb_user").getComponent(cc.Label).string = "";
        this.node.getChildByName("ToggleContainer").getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
        this.node.getChildByName("lb_upname").getComponent(cc.Label).string = this.ComTool.GetBeiZhuName(playerData.pid, playerData.name) + " (ID:" + this.ComTool.GetPid(playerData.pid) + ")";
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_search' == btnName) {
            var value = this.node.getChildByName("EditBox").getComponent(cc.EditBox).string;
            if (value == "") {
                app.SysNotifyManager().ShowSysMsg("请输入目标归属玩家名称或ID");
                return;
            }

            value = this.ComTool.GetBeiZhuID(value);

            var self = this;
            app.NetManager().SendPack("club.CClubPromotionChangeBelongPidInfo", { "clubId": this.clubId, "query": value }, function (serverPack) {
                self.node.getChildByName("lb_user").getComponent(cc.Label).string = self.ComTool.GetBeiZhuName(serverPack.player.pid, serverPack.player.name) + " (ID:" + self.ComTool.GetPid(serverPack.player.pid) + ")";
                self.node.getChildByName("ToggleContainer").getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
                self.searchPid = serverPack.player.pid;
            }, function (error) {
                //app.SysNotifyManager().ShowSysMsg("未找到玩家");
            });
        } else if ('btn_sure' == btnName) {
            this.SetWaitForConfirm('SURE_PROMOTER_SET', this.ShareDefine.Confirm, [], [], "修改从属后该推广员及分支下原数据会归属到当前上级身上，修改后产生的新数据会在新上级那边，且如分成类型与新上级不一致将强制修改类型并默认为0，请确认数据是否已清楚并修改");
            // let self = this;
            // if(this.node.getChildByName("ToggleContainer").getChildByName("toggle1").getComponent(cc.Toggle).isChecked==true){
            //     this.type=0;
            // }else{
            //     this.type=1;
            // }
            // if(this.type==0){
            //     app.NetManager().SendPack("club.CClubChangePromotionBelong",{"clubId":this.clubId,"pid":this.pid,"upLevelId":0,"type":0}, function(serverPack){
            //         app.SysNotifyManager().ShowSysMsg("修改成功");
            //         self.CloseForm();
            //     }, function(){
            //         //app.SysNotifyManager().ShowSysMsg("从属修改失败");
            //     });
            // }else{
            //     if(this.searchPid==0){
            //         app.SysNotifyManager().ShowSysMsg("请搜索归属玩家");
            //         return;
            //     }
            //     app.NetManager().SendPack("club.CClubChangePromotionBelong",{"clubId":this.clubId,"pid":this.pid,"upLevelId":this.searchPid,"type":1}, function(serverPack){
            //         app.SysNotifyManager().ShowSysMsg("修改成功");
            //         self.CloseForm();
            //     }, function(){
            //         //app.SysNotifyManager().ShowSysMsg("从属修改失败");
            //     });
            // }
        } else {
            this.ErrLog("OnClick:%s not find", btnName);
        }
    },
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm: function SetWaitForConfirm(msgID, type) {
        var msgArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var cbArg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
        var content = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
        var lbSure = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
        var lbCancle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "";

        var ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg, content, lbSure, lbCancle);
    },
    OnConFirm: function OnConFirm(clickType, msgID, backArgList) {
        if (clickType != "Sure") {
            return;
        }
        if (msgID == "SURE_PROMOTER_SET") {
            var self = this;
            if (this.node.getChildByName("ToggleContainer").getChildByName("toggle1").getComponent(cc.Toggle).isChecked == true) {
                this.type = 0;
            } else {
                this.type = 1;
            }
            if (this.type == 0) {
                app.NetManager().SendPack("club.CClubChangePromotionBelong", { "clubId": this.clubId, "pid": this.pid, "upLevelId": 0, "type": 0 }, function (serverPack) {
                    app.SysNotifyManager().ShowSysMsg("修改成功");
                    app.Client.OnEvent('UpdateZhanDuiDetailNodeData', {});
                    self.CloseForm();
                }, function () {
                    //app.SysNotifyManager().ShowSysMsg("从属修改失败");
                });
            } else {
                if (this.searchPid == 0) {
                    app.SysNotifyManager().ShowSysMsg("请搜索归属玩家");
                    return;
                }
                app.NetManager().SendPack("club.CClubChangePromotionBelong", { "clubId": this.clubId, "pid": this.pid, "upLevelId": this.searchPid, "type": 1 }, function (serverPack) {
                    app.SysNotifyManager().ShowSysMsg("修改成功");
                    app.Client.OnEvent('UpdateZhanDuiDetailNodeData', {});
                    self.CloseForm();
                }, function () {
                    //app.SysNotifyManager().ShowSysMsg("从属修改失败");
                });
            }
        }
    }
});

cc._RF.pop();