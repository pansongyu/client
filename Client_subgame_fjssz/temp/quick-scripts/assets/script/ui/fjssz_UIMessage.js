(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/fjssz_UIMessage.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fjssz23d-ac7f-4702-90c1-86118e279f61', 'fjssz_UIMessage', __filename);
// script/ui/fjssz_UIMessage.js

"use strict";

/*
    UIMessage 模态消息界面
*/

var app = require("fjssz_app");

cc.Class({
  extends: require(app.subGameName + "_BaseForm"),

  properties: {},

  //初始化
  OnCreateInit: function OnCreateInit() {
    this.ZorderLv = 9;
    this.LabelMessage = this.GetWndNode("image01/LabelMessage").getComponent(cc.Label);
    this.LabelCancel = this.GetWndNode("image01/btnCancel/New Sprite");
    this.LabelSure = this.GetWndNode("image01/btnSure/New Sprite");
    this.BtnCancel = this.GetWndNode("image01/btnCancel").getComponent(cc.Button);
    this.BtnSure = this.GetWndNode("image01/btnSure").getComponent(cc.Button);

    this.ShareDefine = app[app.subGameName + "_ShareDefine"]();

    this.msgInfoList = [];
    this.MaxMsgCount = 1;

    this.confirmType = 0;

    this.CancelPos = cc.v2(-131, -118);
    this.SurePos = cc.v2(131, -118);

    //单个确定按钮坐标
    this.SingSurePos = cc.v2(0, -118);

    this.SysNotifyManager = app[app.subGameName + "_SysNotifyManager"]();

    this.isShowingMsg = false;
  },

  //---------显示函数--------------------

  OnShow: function OnShow(eventType, confirmType, msgID, msgArgList, content) {

    if (this.msgInfoList.length >= this.MaxMsgCount) {
      console.error("OnShow msgInfoListCount(%s) is max", this.msgInfoList.length, msgID);
    } else {
      this.msgInfoList.push([confirmType, msgID, msgArgList, content]);
    }

    //如果正在显示系统提示,则不调用更新接口
    //if(!this.isShowingMsg){
    this.ShowMsgInfo();
    //}
    this.node.setPosition(cc.v2(0, 0));
  },

  ShowMsgInfo: function ShowMsgInfo() {
    if (!this.msgInfoList.length) {
      this.Log("msgInfoList is empty");
      return;
    }

    this.isShowingMsg = true;

    var tempList = this.msgInfoList.shift();
    this.confirmType = tempList[0];
    var msgID = tempList[1];
    var params = tempList[2];
    var msgContent = tempList[3];

    this.LabelMessage.string = msgContent;

    //以下根据不同类型改变窗体、控件位置
    //有确定、取消按钮
    if (this.confirmType == this.ShareDefine.Confirm) {

      if (this.LabelCancel) {
        this.LabelCancel.string = app.i18n.t("Cancel");
      }
      this.BtnCancel.node.setPosition(this.CancelPos);
      this.BtnCancel.node.active = true;

      if (this.LabelSure) {
        this.LabelSure.string = app.i18n.t("Sure");
      }
      this.BtnSure.node.setPosition(this.SurePos);
      this.BtnSure.node.active = true;
    }
    //有是、否按钮
    else if (this.confirmType == this.ShareDefine.ConfirmYN) {
        //有确定按钮
        if (this.LabelCancel) {
          this.LabelCancel.string = app.i18n.t("No");
        }
        this.BtnCancel.node.setPosition(this.CancelPos);
        this.BtnCancel.node.active = true;

        if (this.LabelSure) {
          this.LabelSure.string = app.i18n.t("Yes");
        }
        this.BtnSure.node.setPosition(this.SurePos);
        this.BtnSure.node.active = true;
      }

      //购买,前往
      else if (this.confirmType == this.ShareDefine.ConfirmBuyGoTo) {
          if (this.LabelCancel) {
            this.LabelCancel.string = app.i18n.t("Buy");
          }
          this.BtnCancel.node.setPosition(this.CancelPos);
          this.BtnCancel.node.active = true;

          if (this.LabelSure) {
            this.LabelSure.string = app.i18n.t("GoTo");
          }
          this.BtnSure.node.setPosition(this.SurePos);
          this.BtnSure.node.active = true;
        }
        //就一个确定, 需要设置控件坐标
        else if (this.confirmType == this.ShareDefine.ConfirmOK) {
            this.BtnCancel.node.active = false;
            if (this.LabelSure) {
              this.LabelSure.string = app.i18n.t("Sure");
            }
            this.BtnSure.node.setPosition(this.SingSurePos);
            this.BtnSure.node.active = true;
          } else {
            this.isShowingMsg = false;
            console.error("OnShow msgType(%s) error", this.confirmType);
            return;
          }
  },

  OnClose: function OnClose() {
    this.isShowingMsg = false;
  },

  //---------点击函数---------------------

  OnClick: function OnClick(btnName, eventData) {

    if (btnName == "btnSure") {
      this.AfterOnClick("Sure");
    } else if (btnName == "btnCancel") {
      this.AfterOnClick("Cancel");
    } else {
      console.error("OnClick:%s not find", btnName);
    }
  },

  /**
   * 点击确定
   */
  AfterOnClick: function AfterOnClick(eventType) {

    this.CloseForm();

    this.ConfirmManager.OnConFirmResult(eventType);

    // 如果还有消息则继续显示
    if (this.msgInfoList.length) {
      this.ShowMsgInfo();
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
        //# sourceMappingURL=fjssz_UIMessage.js.map
        