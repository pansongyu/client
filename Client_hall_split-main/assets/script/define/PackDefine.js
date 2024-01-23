/*
 *  PackDefine.js
 *  打包定义
 *
 *  author:hongdian
 *  date:2014-10-28
 *  version:1.0
 *
 * 修改时间 修改人 修改内容:
 *
 *
 */
var PackDefine = {
};

//打包类型
var PACK_TYPE = function(){
	this.APPLE_CHECK = "APPLE_CHECK";       //苹果审核包
	this.NORMAL		 = "NORMAL";		//正常包
};


//-----基础---
PACK_TYPE.apply(PackDefine, []);

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	return PackDefine;
}