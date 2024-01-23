

var PDKDefine = {
};

//---------------------------基础(所有项目通用的枚举)--------------------------------------

var Common = function(){
	//房间最多人数
	this.MaxPlayer = 4;
	//玩家最大手牌
	this.MaxHandCard = 24;
	//玩家16张手牌
	this.MidHandCardEx = 16;
	//玩家15张手牌
	this.MidHandCard = 15;
	//玩家12张手牌
	this.MinHandCard = 12;
	//桌面最多墩牌
	this.MaxTableCard = 96;
	//手牌升起高度
	this.MaxRisePosY = 40;
	//正常倒计时30S
	this.MaxTickTime = 30;
	//最少倒计时5S，龙岩伏击大不起2秒后跳过
	this.MinTickTime = 1;
	
};

var PDK_LYFJShouPai = function(){
	this.LYFJSHOUPAI_15 = 0;
	this.LYFJSHOUPAI_16 = 1;
};

var PDK_SeverShouPai = function(){
	this.SEVER_SHOUPAI_12 = 0;
	this.SEVER_SHOUPAI_15 = 1;
	this.SEVER_SHOUPAI_16 = 2;
	this.SEVER_SHOUPAI_24 = 3;
};

var PDK_SeverWanFa = function(){
	this.SEVER_SHOUJUFIRST3 = 0;
	this.SEVER_FIRST3 = 1;
	this.SEVER_BMUST = 2;
	this.SEVER_MOST3BOOM = 3;
	this.SEVER_AAA = 4;
    this.SEVER_FIGHTEND = 5;
    this.SEVER_MUSTBOMB = 6;
    this.SEVER_DOUBLE10 = 7;
    this.SEVER_LESS3 = 8;
    this.SEVER_MINGCARD = 9;
    this.SEVER_FOURDAIDOUBLE = 10;
    this.SEVER_SHOWCARDNUM = 11;
    this.SEVER_ROBDOOR = 12;
    this.SEVER_BUDAI3 = 13;
    this.SEVER_DAI31 = 14;
    this.SEVER_DAI32 = 15;
    this.SEVER_DAI41 = 16;
    this.SEVER_DAI42 = 17;
	this.SEVER_DAI43 = 18;
	this.SEVER_RAZZ = 19;
	this.SEVER_DOUBLE = 20;
	this.SEVER_DOUBLEBOOM = 21;
	this.SEVER_BMUSTBOMB = 22;//炸弹可拆
	this.SEVER_MAXAAA = 23;//3A炸为最大
	this.SEVER_HONGTAO10ZHANIAO = 24;//红桃10扎鸟
	this.SEVER_FIRST3NOCHU3 = 25;//黑桃3首出不必带黑桃3
	this.SEVER_SHOUDONGGUO = 26;//黑桃3首出不必带黑桃3
	this.SEVER_AUTOREADY = 27;//黑桃3首出不必带黑桃3
	this.SEVER_WEIZHANGSUANFEN = 28;//尾张算分
	this.SEVER_WUZHA = 29;//无炸
	this.SEVER_FANGZUOBI = 30;//防作弊
	this.SEVER_BISAIFENBUDIYULING = 31;//比赛分不能为负
	this.SEVER_ZHIYINGDANGQIANSHENSHANGFEN = 32;//只能赢当前身上分
	this.SEVER_2A_22 = 33;//双A双2
};

var PDK_JDWanFa = function(){
	this.SHOUJUFIRST3 = 0;
	this.FIRST3 = 1;
	this.BMUST = 2;
	this.MOST3BOOM = 3;
	this.AAA = 4;//
    this.FIGHTEND = 5;
    this.MUSTBOMB = 6;
    this.DOUBLE10 = 7;
    this.LESS3 = 8;
    this.MINGCARD = 9;
    this.FOURDAIDOUBLE = 10;
    this.SHOWCARDNUM = 11;
    this.ROBDOOR = 12;
    this.BUDAI3 = 13;
    this.DAI31 = 14;
    this.DAI32 = 15;//
    this.DAI41 = 16;
    this.DAI42 = 17;
    this.DAI43 = 18;//
};

var PDK_WanFa = function(){
	this.PDKSHOUJUFIRST3 = 0;
	this.PDKFIRST3 = 1;
	this.PDKBMUST = 2;
	this.PDKSHOWCARDNUM = 3;
	// this.PDKDOUBLEBOOM = 4;
	this.PDKBMUSTBOMB = 4;
	this.PDKMAXAAA = 5;
	this.PDKHONGTAO10ZHANIAO = 6;
	this.PDKFIRST3NOCHU3 = 7;
	this.PDKSHOUDONGGUO = 8;
	this.PDKAUTOREADY =9;
	this.PDKWEIZHANGSUANFEN = 10;
	this.PDKWUZHA = 11;
	this.PDKAAA = 12;
	this.PDKFANGZUOBI = 13;
	this.PDKBISAIFENBUDIYULING = 14;
	this.PDKZHIYINGDANGQIANSHENSHANGFEN = 15;
};

var PDK_LYFJZHADANSUANFA = function(){
	this.LYFJYOUZHAJIUSUAN = 0;
	this.LYFJZHISUANYINGJIA = 1;
	this.LYFJZHADANBUSUANFA = 2;
};

var PDK_LYFJZHADANFENSHU = function(){
	this.LYFJZHADANFANBEI = 0;
	this.LYFJZHADANJIAFEN = 1;
};

Common.apply(PDKDefine, []);
PDK_JDWanFa.apply(PDKDefine, []);
PDK_WanFa.apply(PDKDefine, []);
PDK_SeverWanFa.apply(PDKDefine, []);
PDK_LYFJShouPai.apply(PDKDefine, []);
PDK_SeverShouPai.apply(PDKDefine, []);
PDK_LYFJZHADANSUANFA.apply(PDKDefine,[]);
PDK_LYFJZHADANFENSHU.apply(PDKDefine,[]);
/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	return PDKDefine;
}
