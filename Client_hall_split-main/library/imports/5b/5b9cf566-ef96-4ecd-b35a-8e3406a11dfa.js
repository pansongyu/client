"use strict";
cc._RF.push(module, '5b9cfVm75ZOzbNajjQGoR36', 'xsmjChildCreateRoom');
// script/ui/uiGame/xsmj/xsmjChildCreateRoom.js

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

								var shangzhuang = this.GetIdxByKey('shangzhuang');
								var piaocai = this.GetIdxByKey('piaocai');
								var fengDing = this.GetIdxByKey('fengDing');
								var tuodi = this.GetIdxByKey('tuodi');
								var kexuanwanfa = this.GetIdxsByKey('kexuanwanfa');
								var fangjian = this.GetIdxsByKey('fangjian');
								var xianShi = this.GetIdxByKey('xianShi');
								var jiesan = this.GetIdxByKey('jiesan');
								var gaoji = this.GetIdxsByKey('gaoji');

								sendPack = {

												"shangzhuang": shangzhuang,
												"piaocai": piaocai,
												"fengDing": fengDing,
												"tuodi": tuodi,
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
												if (!this.Toggles["renshu"][0].getChildByName("checkmark").active) {
																this.Toggles['kexuanwanfa'][3].getChildByName("checkmark").active = false;
																//置灰
																if (this.Toggles['kexuanwanfa'][3].getChildByName("label")) {
																				this.Toggles['kexuanwanfa'][3].getChildByName("label").color = cc.color(180, 180, 180);
																}
												} else {
																//恢复
																if (this.Toggles['kexuanwanfa'][3].getChildByName("label")) {
																				this.Toggles['kexuanwanfa'][3].getChildByName("label").color = cc.color(158, 49, 16);
																}
												}
								}
				}
});

module.exports = bzqzmjChildCreateRoom;

cc._RF.pop();