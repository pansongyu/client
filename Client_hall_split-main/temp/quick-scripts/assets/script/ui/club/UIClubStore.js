(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/club/UIClubStore.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '14c3dtXMAdNVbCFZ/L3WyMM', 'UIClubStore', __filename);
// script/ui/club/UIClubStore.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        right_layout: cc.Node,
        quankaDemo: cc.Node

        // store_icon:[cc.SpriteFrame],
    },
    OnCreateInit: function OnCreateInit() {
        this.storeList = [];
        this.quankaDemo.active = false;
    },
    //-----------------显示函数------------------
    OnShow: function OnShow() {
        var nowCLubID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
        var clubName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        this.quankaDemo.active = false;
        //this.right_layout.removeAllChildren();
        this.DestroyAllChildren(this.right_layout);
        app.ClubManager().SendReqClubData();
        //app.ClubManager().SendGetAllRoom();
        if (nowCLubID > 0) {
            this.nowClubID = nowCLubID;
            this.nowClubName = clubName;
            this.ShowStore();
        } else {
            this.nowClubID = -1;
            this.nowClubName = '';
        }
    },
    ShowStore: function ShowStore() {
        if (this.storeList.length == 0) {
            this.SendHttpRequest('http://fb.qicaiqh.com/index.php?module=WxPay&action=GetGoodsID', "&gamename=qinghuai&goodstype=3", "GET", {});
        } else {
            this.ShowStoreData();
        }
    },
    ShowStoreData: function ShowStoreData() {
        //this.right_layout.removeAllChildren();
        this.DestroyAllChildren(this.right_layout);
        var storeList = this.storeList;
        for (var i = 0; i < storeList.length; i++) {
            var nodePrefab = cc.instantiate(this.quankaDemo);
            nodePrefab.AppID = storeList[i].AppID;

            nodePrefab.name = 'btn_store_buy';
            nodePrefab.getChildByName('title').getComponent(cc.Label).string = storeList[i].DiamondNum + '张';
            nodePrefab.getChildByName('num').getComponent(cc.Label).string = storeList[i].AppPrice + '元';
            // nodePrefab.getChildByName('sendNum').getComponent(cc.Label).string="多送";
            // nodePrefab.getChildByName('icon').getComponent(cc.Sprite).spriteFrame=this.store_icon[i];
            nodePrefab.active = true;

            this.right_layout.addChild(nodePrefab);
        }
    },
    SendHttpRequest: function SendHttpRequest(serverUrl, argString, requestType, sendPack) {
        app.NetRequest().SendHttpRequest(serverUrl, argString, requestType, sendPack, 2000, this.OnReceiveHttpPack.bind(this), this.OnConnectHttpFail.bind(this), null, this.OnConnectHttpError.bind(this));
        // var url = [serverUrl, argString].join("")

        // var dataStr = JSON.stringify(sendPack);

        // //每次都实例化一个，否则会引起请求结束，实例被释放了
        // var httpRequest = new XMLHttpRequest();

        // httpRequest.timeout = 2000;


        // httpRequest.open(requestType, url, true);
        // //服务器json解码
        // httpRequest.setRequestHeader("Content-Type", "application/json");
        // var that = this;
        // httpRequest.onerror = function(){
        //     that.ErrLog("httpRequest.error:%s", url);
        //     that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
        // };
        // httpRequest.ontimeout = function(){

        // };
        // httpRequest.onreadystatechange = function(){
        //     //执行成功
        //     if (httpRequest.status == 200){
        //         if(httpRequest.readyState == 4){
        //             that.OnReceiveHttpPack(serverUrl, httpRequest.responseText);
        //         }
        //     }
        //     else{
        //         that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
        //         that.ErrLog("onreadystatechange(%s,%s)", httpRequest.readyState, httpRequest.status);
        //     }
        // };
        // httpRequest.send(dataStr);
    },
    /*
    *AppID  AppName AppPrice    DiamondNum  ExtraReward ImageName   goodsType   channelType
      12     房卡     29          320000       3002    icon_card6       1           2
    */
    OnReceiveHttpPack: function OnReceiveHttpPack(serverUrl, httpResText) {
        try {
            var serverPack = JSON.parse(httpResText);
            for (var i = 0; i < serverPack.data.length; i++) {
                var data = serverPack.data[i];
                var push = [];
                push['AppID'] = data.id;
                push['AppName'] = '圈卡';
                push['AppPrice'] = data.money / 100;
                push['DiamondNum'] = data.roomcard;
                push['ImageName'] = 'icon_card' + (i + 1);
                this.storeList.push(push);
            }
            this.ShowStoreData();
        } catch (error) {}
    },
    OnConnectHttpFail: function OnConnectHttpFail(serverUrl, readyState, status) {},

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
        if ('MSG_CLUB_Store' == msgID) {
            cc.sys.openURL("http://fb.qicaiqh.com/index.php?module=WxPay&action=MWEB_Pay&goodsID=" + this.AppID + "&playerID=" + app.HeroManager().GetHeroProperty("pid") + "&clubId=" + this.nowClubID);
        }
    },

    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_join' == btnName) {
            this.FormManager.ShowForm('ui/club/UIJoinClub');
        } else if (btnName.startsWith("btn_club_")) {
            var clubId = btnNode.clubId;
            this.nowClubID = clubId;
            this.nowClubName = btnNode.clubName;
            this.RefreshLeft();
        } else if (btnName == "btn_back") {
            if (this.FormManager.IsFormShow("ui/club/UIClubMain")) {
                this.FormManager.CloseForm("bottom");
            } else {
                this.FormManager.ShowForm("bottom");
            }
            this.CloseForm();
        } else if ('btn_store_buy' == btnName) {
            this.AppID = btnNode.AppID;
            this.SetWaitForConfirm("MSG_CLUB_Store", this.ShareDefine.Confirm, [this.nowClubName]);
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
        //# sourceMappingURL=UIClubStore.js.map
        