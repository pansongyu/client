"use strict";
cc._RF.push(module, '723af7SyT1GF4obe3wT0prc', 'nmgyzmjChildCreateRoom');
// script/ui/uiGame/nmgyzmj/nmgyzmjChildCreateRoom.js

"use strict";

/*
创建房间子界面
 */
var app = require("app");

var bzqzmjChildCreateRoom = cc.Class({
				extends: require("BaseChildCreateRoom"),

				properties: {},
				//需要自己重写
				CreateSendPack: function CreateSendPack(renshu, setCount, isSpiltRoomCard) {
								var sendPack = {};

								var hupaileixing = this.GetIdxByKey('hupaileixing');
								var wanfa = this.GetIdxByKey('wanfa');
								var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
								var fangjian = this.GetIdxsByKey('fangjian');
								var xianShi = this.GetIdxByKey('xianShi');
								var jiesan = this.GetIdxByKey('jiesan');
								var gaoji = this.GetIdxsByKey('gaoji');

								sendPack = {

												"hupaileixing": hupaileixing,
												"wanfa": wanfa,
												"kexuanwanfa": kexuanwanfa,
												"fangjian": fangjian,
												"xianShi": xianShi,
												"jiesan": jiesan,
												"gaoji": gaoji,

												"playerMinNum": renshu[0],
												"playerNum": renshu[1],
												"setCount": setCount,
												"paymentRoomCardType": isSpiltRoomCard

								};
								return sendPack;
				},
				AdjustSendPack: function AdjustSendPack(sendPack) {
								return sendPack;
				},
				UpdateOnClickToggle: function UpdateOnClickToggle() {
								if (this.Toggles["kexuanwanfa"]) {
												this.UpdateLabelColor(this.Toggles['kexuanwanfa'][0].parent);
												if (this.Toggles["wanfa"][1].getChildByName("checkmark").active) {
																this.Toggles['kexuanwanfa'][0].getChildByName("checkmark").active = false;
																//置灰
																if (this.Toggles['kexuanwanfa'][0].getChildByName("label")) {
																				this.Toggles['kexuanwanfa'][0].getChildByName("label").color = cc.color(180, 180, 180);
																}
												} else {
																//恢复
																if (this.Toggles['kexuanwanfa'][0].getChildByName("label")) {
																				this.Toggles['kexuanwanfa'][0].getChildByName("label").color = cc.color(158, 49, 16);
																}
												}
								}
				}
});

module.exports = bzqzmjChildCreateRoom;

cc._RF.pop();