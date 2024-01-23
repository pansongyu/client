"use strict";
cc._RF.push(module, 'f6225BzcZpAibVvK5dl00AV', 'UIPromoterManager');
// script/ui/club/UIPromoterManager.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {},

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
    OnShow: function OnShow(clubId, unionId, myisPartner, unionPostType, myisminister, unionSign) {
        var btn_defaultName = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "btn_PromoterList";

        this.clubId = clubId;
        this.unionId = unionId;
        this.myisPartner = myisPartner;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.unionSign = unionSign;
        this.lastClickBtnName = "";
        var btn_default = this.node.getChildByName("left").getChildByName(btn_defaultName);
        this.OnClick(btn_default.name, btn_default);
        this.UpdateLeftBtn();
    },
    UpdateLeftBtn: function UpdateLeftBtn() {
        var btn_PromoterList = this.node.getChildByName("left").getChildByName("btn_PromoterList");
        var btn_PromoterMsg = this.node.getChildByName("left").getChildByName("btn_PromoterMsg");
        var btn_PromoterXiaShuList = this.node.getChildByName("left").getChildByName("btn_PromoterXiaShuList");
        //如果是创建者打开
        if (this.myisminister == app.ClubManager().Club_MINISTER_CREATER) {
            btn_PromoterList.active = true;
            btn_PromoterXiaShuList.active = false;
        } else {
            btn_PromoterList.active = false;
            btn_PromoterXiaShuList.active = true;
        }
    },
    ClickLeftBtn: function ClickLeftBtn(clickName) {
        var rightNode = this.node.getChildByName("right");
        var allRightBtn = [];
        for (var i = 0; i < rightNode.children.length; i++) {
            allRightBtn.push(rightNode.children[i]);
        }
        this.lastClickBtnName = clickName;
        var leftNode = this.node.getChildByName("left");
        var allLeftBtn = [];
        for (var _i = 0; _i < leftNode.children.length; _i++) {
            allLeftBtn.push(leftNode.children[_i]);
        }
        for (var _i2 = 0; _i2 < allLeftBtn.length; _i2++) {
            if (allLeftBtn[_i2].name == clickName) {
                allLeftBtn[_i2].getChildByName("img_off").active = false;
                allLeftBtn[_i2].getChildByName("lb_off").active = false;
                allLeftBtn[_i2].getChildByName("img_on").active = true;
                allLeftBtn[_i2].getChildByName("lb_on").active = true;
            } else {
                allLeftBtn[_i2].getChildByName("img_off").active = true;
                allLeftBtn[_i2].getChildByName("lb_off").active = true;
                allLeftBtn[_i2].getChildByName("img_on").active = false;
                allLeftBtn[_i2].getChildByName("lb_on").active = false;
            }
        }
        for (var _i3 = 0; _i3 < allRightBtn.length; _i3++) {
            if (allRightBtn[_i3].name == clickName + "Node") {
                allRightBtn[_i3].active = true;
                allRightBtn[_i3].getComponent(allRightBtn[_i3].name).InitData(this.clubId, this.unionId, this.unionPostType, this.myisminister, this.myisPartner);
            } else {
                allRightBtn[_i3].active = false;
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
            return;
        }
    },
    OnClick: function OnClick(btnName, btnNode) {
        if ('btn_close' == btnName) {
            this.CloseForm();
        } else if ('btn_PromoterList' == btnName) {
            this.ClickLeftBtn(btnName);
        } else if ('btn_PromoterMsg' == btnName) {
            this.ClickLeftBtn(btnName);
        } else if ('btn_PromoterXiaShuList' == btnName) {
            this.ClickLeftBtn(btnName);
        }
    }
});

cc._RF.pop();