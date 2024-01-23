"use strict";
cc._RF.push(module, '5479cjHPd5IfqbH/DbKfpoV', 'UIUnionRankZhongZhi');
// script/ui/club_2/UIUnionRankZhongZhi.js

"use strict";

var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        rankZhongZhiNode: cc.Node
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
    OnShow: function OnShow(clubId, unionId, unionName, unionPostType, myisminister, unionSign, levelPromotion, rankedOpenZhongZhi, rankedOpenEntryZhongZhi) {
        var btn_defaultName = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : "btn_day_0";

        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.unionName = unionName;
        this.unionSign = unionSign;
        this.levelPromotion = levelPromotion;
        this.rankedOpenZhongZhi = rankedOpenZhongZhi;
        this.rankedOpenEntryZhongZhi = rankedOpenEntryZhongZhi;
        this.UpdateLeftBtn();
        this.lastClickBtnName = "";
        var lb_Title = this.node.getChildByName("bg_create").getChildByName("lb_Title");
        lb_Title.getComponent(cc.Label).string = unionName + "（ID:" + unionSign + "）";
        var btn_default = this.node.getChildByName("left").getChildByName(btn_defaultName);
        this.OnClick(btn_default.name, btn_default);
    },
    UpdateLeftBtn: function UpdateLeftBtn() {},
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
        var getType = clickName.replace('btn_day_', '');
        this.rankZhongZhiNode.getComponent("btn_RankZhongzhiNode").InitData(this.clubId, this.unionId, getType, this.rankedOpenZhongZhi, this.rankedOpenEntryZhongZhi);
        // for (let i = 0; i < allRightBtn.length; i++) {
        //     if (allRightBtn[i].name == clickName + "Node") {
        //         allRightBtn[i].active = true;
        //         allRightBtn[i].getComponent(allRightBtn[i].name).InitData(this.clubId, this.unionId, this.unionPostType, this.myisminister, this.unionName, this.unionSign, this.levelPromotion);
        //     }else{
        //         allRightBtn[i].active = false;
        //     }
        // }
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
            this.CloseForm();
        } else if (btnName.startsWith("btn_day_")) {
            this.ClickLeftBtn(btnName);
        }
    }
});

cc._RF.pop();