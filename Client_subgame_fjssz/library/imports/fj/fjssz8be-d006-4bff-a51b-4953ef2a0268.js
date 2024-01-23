"use strict";
cc._RF.push(module, 'fjssz8be-d006-4bff-a51b-4953ef2a0268', 'FJSSZDefine');
// script/game/FJSSZ/FJSSZDefine.js

"use strict";

var SSSDefine = {};

//---------------------------基础(所有项目通用的枚举)--------------------------------------

var Common = function Common() {
	//参与的人数
	this.SSSRoomJoinCount = 4;

	//每个人前面牌蹲数量
	this.SSSRoomPaiDun = 13;

	this.RoomStateInit = 0;
	this.RoomStatePlay = 1;
	this.RoomStateEnd = 2;
};

var DunCardNum = function DunCardNum() {
	this.FirstDunCards = 3;
	this.SecondDunCards = 5;
	this.ThirdDunCards = 5;
};

var CountDown = function CountDown() {
	this.CountDownNotice = 20;
};

Common.apply(SSSDefine, []);
DunCardNum.apply(SSSDefine, []);
CountDown.apply(SSSDefine, []);

/**
 * 绑定模块外部方法
 */
exports.GetModel = function () {
	return SSSDefine;
};

cc._RF.pop();