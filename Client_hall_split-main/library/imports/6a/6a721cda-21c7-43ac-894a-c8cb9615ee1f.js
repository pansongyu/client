"use strict";
cc._RF.push(module, '6a721zaIcdDrIlKyMuWFe4f', 'rqmjChildCreateRoom');
// script/ui/uiGame/rqmj/rqmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var czmjChildCreateRoom = cc.Class({
  extends: require("BaseChildCreateRoom"),

  properties: {},
  //需要自己重写
  CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
    var sendPack = {};
    var xianmeng = this.GetIdxByKey("xianmeng");
    var xianShi = this.GetIdxByKey('xianShi');
    var jiesan = this.GetIdxByKey('jiesan');
    var kexuanwanfa = [];
    for (var i = 0; i < this.Toggles['kexuanwanfa'].length; i++) {
      if (this.Toggles['kexuanwanfa'][i].getChildByName('checkmark').active) {
        kexuanwanfa.push(i);
      }
    }
    var fangjian = [];
    for (var _i = 0; _i < this.Toggles['fangjian'].length; _i++) {
      if (this.Toggles['fangjian'][_i].getChildByName('checkmark').active) {
        fangjian.push(_i);
      }
    }
    var gaoji = [];
    for (var _i2 = 0; _i2 < this.Toggles['gaoji'].length; _i2++) {
      if (this.Toggles['gaoji'][_i2].getChildByName('checkmark').active) {
        gaoji.push(_i2);
      }
    }
    sendPack = {
      "kexuanwanfa": kexuanwanfa,
      "fangjian": fangjian,
      "gaoji": gaoji,
      "xianmeng": xianmeng,
      "jiesan": jiesan,
      "xianShi": xianShi,
      "playerMinNum": renshu[0],
      "playerNum": renshu[1],
      "setCount": setCount,
      "paymentRoomCardType": isSpiltRoomCard
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
      return;
    } else if ('kexuanwanfa' == key) {
      //自摸胡和点炮大包不能同时选择
      if (this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active && toggleIndex == 3) {
        this.Toggles['kexuanwanfa'][2].getChildByName('checkmark').active = false;
        this.UpdateLabelColor(this.Toggles['kexuanwanfa'][2].parent);
      } else if (this.Toggles['kexuanwanfa'][3].getChildByName('checkmark').active && toggleIndex == 2) {
        this.Toggles['kexuanwanfa'][3].getChildByName('checkmark').active = false;
        this.UpdateLabelColor(this.Toggles['kexuanwanfa'][3].parent);
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

module.exports = czmjChildCreateRoom;

cc._RF.pop();