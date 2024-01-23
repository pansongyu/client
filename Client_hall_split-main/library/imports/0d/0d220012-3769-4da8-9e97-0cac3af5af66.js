"use strict";
cc._RF.push(module, '0d220ASN2lNqJ6XDKw69a9m', 'UIUnionManagerZhongZhi');
// script/ui/club_2/UIUnionManagerZhongZhi.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        zhanduiDetailNode: cc.Node
    },

    OnCreateInit: function OnCreateInit() {
        this.WeChatManager = app.WeChatManager();
        this.InitEvent();
    },
    InitEvent: function InitEvent() {
        //基础网络包
        this.NetManager = app.NetManager();
        this.RegEvent("CodeError", this.Event_CodeError, this);
    },
    Event_CodeError: function Event_CodeError(event) {
        var code = event["Code"];
    },
    //--------------显示函数-----------------
    OnShow: function OnShow(clubId, unionId, unionName, unionPostType, myisminister, unionSign, levelPromotion) {
        var btn_defaultName = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "btn_newRaceRankZhongzhi";

        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.unionName = unionName;
        this.unionSign = unionSign;
        this.levelPromotion = levelPromotion;
        this.UpdateLeftBtn();
        if (this.unionPostType == app.ClubManager().UNION_GENERAL && this.levelPromotion > 0) {
            //普通成员
            btn_defaultName = "btn_RaceManageZhongzhi";
        }
        this.lastClickBtnName = "";
        var lb_Title = this.node.getChildByName("bg_create").getChildByName("lb_Title");
        lb_Title.getComponent(cc.Label).string = unionName + "（ID:" + unionSign + "）";
        var btn_default = this.node.getChildByName("left").getChildByName(btn_defaultName);
        this.OnClick(btn_default.name, btn_default);
    },
    UpdateLeftBtn: function UpdateLeftBtn() {
        var btn_newRaceRankZhongzhi = this.node.getChildByName("left").getChildByName("btn_newRaceRankZhongzhi");
        var btn_RaceManageZhongzhi = this.node.getChildByName("left").getChildByName("btn_RaceManageZhongzhi");
        if (this.myisminister == app.ClubManager().Club_MINISTER_MGRSS) {
            //赛事管理
            btn_RaceManageZhongzhi.active = true;
            btn_newRaceRankZhongzhi.active = true;
        } else if (this.unionPostType == app.ClubManager().UNION_GENERAL) {
            //普通成员
            btn_RaceManageZhongzhi.active = false;
            btn_newRaceRankZhongzhi.active = false;
            if (this.levelPromotion > 0) {
                btn_RaceManageZhongzhi.active = true;
            }
        } else if (this.unionPostType == app.ClubManager().UNION_CLUB) {
            //亲友圈创建者
            btn_RaceManageZhongzhi.active = true;
            btn_newRaceRankZhongzhi.active = true;
        } else if (this.unionPostType == app.ClubManager().UNION_MANAGE) {
            //赛事管理
            btn_RaceManageZhongzhi.active = true;
            btn_newRaceRankZhongzhi.active = true;
        } else if (this.unionPostType == app.ClubManager().UNION_CREATE) {
            //赛事创建者
            btn_RaceManageZhongzhi.active = true;
            btn_newRaceRankZhongzhi.active = true;
        }
    },
    ClickLeftBtn: function ClickLeftBtn(clickName) {
        var rightNode = this.node.getChildByName("right");
        var allRightBtn = [];
        for (var i = 0; i < rightNode.children.length; i++) {
            allRightBtn.push(rightNode.children[i]);
        }
        for (var _i = 0; _i < allRightBtn.length; _i++) {
            if (allRightBtn[_i].name == this.lastClickBtnName + "Node") {
                if (allRightBtn[_i].getComponent(allRightBtn[_i].name).isClickAnyWnd) {
                    allRightBtn[_i].getComponent(allRightBtn[_i].name).isClickAnyWnd = false;
                    return;
                }
            }
        }
        this.lastClickBtnName = clickName;
        var leftNode = this.node.getChildByName("left");
        var allLeftBtn = [];
        for (var _i2 = 0; _i2 < leftNode.children.length; _i2++) {
            allLeftBtn.push(leftNode.children[_i2]);
        }
        for (var _i3 = 0; _i3 < allLeftBtn.length; _i3++) {
            if (allLeftBtn[_i3].name == clickName) {
                allLeftBtn[_i3].getChildByName("img_off").active = false;
                allLeftBtn[_i3].getChildByName("lb_off").active = false;
                allLeftBtn[_i3].getChildByName("img_on").active = true;
                allLeftBtn[_i3].getChildByName("lb_on").active = true;
            } else {
                allLeftBtn[_i3].getChildByName("img_off").active = true;
                allLeftBtn[_i3].getChildByName("lb_off").active = true;
                allLeftBtn[_i3].getChildByName("img_on").active = false;
                allLeftBtn[_i3].getChildByName("lb_on").active = false;
            }
        }
        for (var _i4 = 0; _i4 < allRightBtn.length; _i4++) {
            if (allRightBtn[_i4].name == clickName + "Node") {
                allRightBtn[_i4].active = true;
                allRightBtn[_i4].getComponent(allRightBtn[_i4].name).InitData(this.clubId, this.unionId, this.unionPostType, this.myisminister, this.unionName, this.unionSign, this.levelPromotion);
            } else {
                allRightBtn[_i4].active = false;
            }
        }
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
            if ('MSG_UNOIN_SAVE' == msgID) {
                this.ClickLeftBtn(backArgList[0]);
            }
            return;
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            if (this.zhanduiDetailNode.active && this.unionPostType != app.ClubManager().UNION_GENERAL) {
                this.zhanduiDetailNode.active = false;
                return;
            }
            this.CloseForm();
        } else if ('btn_RaceManageZhongzhi' == btnName) {
            this.ClickLeftBtn(btnName);
        } else if ('btn_newRaceRankZhongzhi' == btnName) {
            this.ClickLeftBtn(btnName);
        }
    }
});

cc._RF.pop();