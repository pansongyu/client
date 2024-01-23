(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/ui/uiGame/pypp/pyppChildCreateRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9e6b559ftBMJYy6RM2ShA2o', 'pyppChildCreateRoom', __filename);
// script/ui/uiGame/pypp/pyppChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var fzmjChildCreateRoom = cc.Class({
  extends: require("BaseChildCreateRoom"),

  properties: {},
  //需要自己重写
  CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
    var sendPack = {};
    var xianShi = this.GetIdxByKey('xianShi');
    var jiesan = this.GetIdxByKey('jiesan');
    var difen = this.GetIdxByKey('difen');
    var beilv = this.GetIdxByKey('beilv');
    var kexuanwanfa = [];
    for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
      if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
        kexuanwanfa.push(i);
      }
    }
    var gaoji = [];
    for (var _i = 0; _i < this.Toggles['gaoji'].length; _i++) {
      if (this.Toggles['gaoji'][_i].getChildByName('checkmark').active) {
        gaoji.push(_i);
      }
    }
    if (isSpiltRoomCard == 1) {
      isSpiltRoomCard = 2;
    }
    sendPack = {
      "playerMinNum": renshu[0],
      "playerNum": renshu[1],
      "setCount": setCount,
      "paymentRoomCardType": isSpiltRoomCard,
      "kexuanwanfa": kexuanwanfa,
      "difen": difen,
      "beilv": beilv,
      "xianShi": xianShi,
      "jiesan": jiesan,
      "gaoji": gaoji
    };
    return sendPack;
  },
  OnToggleClick: function OnToggleClick(event) {
    this.FormManager.CloseForm("UIMessageTip");
    var toggles = event.target.parent;
    var toggle = event.target;
    var key = toggles.name.substring('Toggles_'.length, toggles.name.length);
    var toggleIndex = parseInt(toggle.name.substring('Toggle'.length, toggle.name.length)) - 1;
    var needClearList = [];
    var needShowIndexList = [];
    needClearList = this.Toggles[key];
    needShowIndexList.push(toggleIndex);
    if ('jushu' == key || 'renshu' == key || 'fangfei' == key) {
      this.ClearToggleCheck(needClearList, needShowIndexList);
      this.UpdateLabelColor(toggles);
      this.UpdateTogglesLabel(toggles, false);
      if ('renshu' == key) {
        //2,3人必须选中比奖
        if (toggleIndex == 0 || toggleIndex == 1) {
          this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active = true;
          this.UpdateLabelColor(this.Toggles['kexuanwanfa'][1].parent);
        }
      }
      return;
    } else if ('kexuanwanfa' == key) {
      if (this.Toggles['kexuanwanfa'][1].getChildByName('checkmark').active == true && toggleIndex == 1) {
        if (this.Toggles['renshu'][2].getChildByName('checkmark').active == false) {
          app.SysNotifyManager().ShowSysMsg('二三人只能玩比奖');
          return;
        }
      }
    }
    if (toggles.getComponent(cc.Toggle)) {
      //复选框
      needShowIndexList = [];
      for (var i = 0; i < needClearList.length; i++) {
        var mark = needClearList[i].getChildByName('checkmark').active;
        //如果复选框为勾选状态并且点击的复选框不是该复选框，则继续保持勾选状态
        if (mark && i != toggleIndex) {
          needShowIndexList.push(i);
        }
        //如果复选框为未勾选状态并且点击的复选框是该复选框，则切换为勾选状态
        else if (!mark && i == toggleIndex) {
            needShowIndexList.push(i);
          }
      }
    }
    this.ClearToggleCheck(needClearList, needShowIndexList);
    this.UpdateLabelColor(toggles, 'fangfei' == key ? true : false);
  }

});

module.exports = fzmjChildCreateRoom;

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
        //# sourceMappingURL=pyppChildCreateRoom.js.map
        