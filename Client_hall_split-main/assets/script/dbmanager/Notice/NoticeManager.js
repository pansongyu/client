/*
 *  ----------------------------------------------------------------------------------------------------
 *  @copyright: Copyright (c) 2004, 2010 Xiamen DDM Network Technology Co.,Ltd., All rights reserved.
 *  ----------------------------------------------------------------------------------------------------
 *  @package NoticeManager.js
 *  @todo: 公告管理器
 *
 *  @author hongdian
 *  @date 2014-10-30 16:04
 *  @version 1.0
 *
 *  修改时间 修改人 修改内容
 *  -------------------------------------------------------------------------------
 *
 */
var app = require('app');

/**
 * 类构造
 */
var NoticeManager = app.DBBaseClass.extend({

	/**
	 * 初始化
	 */
	Init:function(){

		this.JS_Name = "NoticeManager";

		this.ComTool = app.ComTool();
		this.ShareDefine = app.ShareDefine();
		this.NetManager = app.NetManager();

		this.NetManager.RegNetPack("base.C2226InitNotice", this.OnPack_InitNotice, this);

		//服务器推送
		this.NetManager.RegNetPack("S2226_InitNotice", this.OnPack_InitNotice, this);

		this.sysText=`1.1 牌数:	
包括1~9筒、1~9索、1~9万各4张，外加4张红中，共112张牌。骰子：2粒
1.2	庄家:	
第一局由创建房间的玩家做庄家，后续谁胡牌了，下局就由谁做庄。若出现荒庄，则最后摸牌的人做庄。
1.3	掷骰子&摸牌:	
庄家掷骰子，两个骰子的总和（以掷骰子逆时针计算）决定拿牌风位，骰子中较小的点数为起点摸牌；如：庄家掷骰子，骰子分别为2点和3点，骰子总和为5点，则从庄家所在风位牌墙中顺时针摸第3、4墩牌，下家摸后续两墩牌，循环3次等到每人手上有12张牌时从庄家起每人摸1张牌，最后庄家再摸1张牌。摸牌顺序为从庄家开始顺时针摸牌。
起手庄家摸牌14张，其余三家摸牌13张。
1.4	打牌:	
起手庄家需从14张牌中挑1张最没用的打出，庄家打牌后，如果没人碰、杠，则下家摸牌，然后自主选择一张手上的牌打出，依次类推，直至有人胡牌。所有人打出的牌，其余的人都能碰和杠，不能吃牌，只可自摸/抢杠胡，不可抓炮。
1.5	一句话:	
同花色的三个连续的牌
1.6	一坎牌:	
三个一样的牌
1.7	碰牌:	
其他玩家打出的牌，自己手里有两个，则可以碰，碰完要出牌。
1.8	明杠:	
先碰了的牌，后面摸到一张一样的，则可以选择杠，（公杠必须第一时间杠，如果没有第一时间杠，则不能再杠）。
1.9	暗杠:	
手里有4张一样的牌，可以选择杠（暗杠不需要第一时间杠，只要有这个牌型，每一次轮到该玩家打牌，都可以选择“杠”）。
1.10 放杠:	
自己打出一张牌，同桌有玩家手里有一坎相同的该牌，则该玩家可以“接杠”，打出该牌的玩家就是“放杠”。
1.11 接杠:	
与“放杠”对应，有人“放”就对应有人“接”。杠后，需要摸进牌墙上的最后一张牌（补牌），补张牌后要出牌。
1.12 自摸:	
轮到玩家摸牌时，刚好可以使自己胡牌。
1.13 抢杠胡: 
A玩家选择“公杠”，而刚好此时B玩家可以胡这张牌，则B玩家可选择“抢杠”，抢杠就是B玩家胡牌，但是只有A玩家一个人输全部的分。多人抢杠，多人胡，被抢杠的玩家下局坐庄。
1.14 扎码:	
根据扎码的数量，最后要留对应数量的牌不能摸，比如，选择4个码的玩法，那么到倒数第五张牌被摸后，依然无人胡牌，则荒庄。`;

		this.Log("create NoticeManager");
	},

	//切换账号
    InitReload:function(){
		//{
		//	noticeID:{
		//		"mainTitle":"更新公告",
		//			"title":"更新公告",
		//			"time":"2017/02/13 11:00",
		//			"text":"亲爱的玩家:为丰富广大玩家的娱乐生活,仙游将不断推出新的游戏,祝您游戏愉快",
		//	}
		//}

		this.sysDataInfo = {
            1:{
                "mainTitle":"系统公告",
                "title":"系统公告",
                "beginTime":1490858700000,
                "endTime":1490945100000,
                "content":this.sysText,
                "clientType":0,
            },
		};

		this.dataInfo = {};

		this.allNoticeInfo = {};
	},
	//------------封包函数------------------
	//初始化成功
    OnInitData:function(dataInfo){
        this.dataInfo = dataInfo["noticeInfoList"];
        app.Client.OnEvent("InitNotice", {});
    },

    //初始化失败
    OnFailInitData:function(failInfo){
        this.ErrLog("failInfo:", failInfo);
    },

    //服务器推送初始化
    OnPack_InitNotice:function(serverPack){
        this.OnSuccessInitDBData(serverPack);
    },



	//-----------------------获取接口-----------------------------
    //获取所有公告
    GetAllNoticeInfo:function(){
        this.AutoInitDataPack();

		//用来存储全部公告的临时字典,初始化为本地默认配置的公告
		let allNotice = this.ComTool.DeepCopy(this.sysDataInfo);
		let allNoticeKeyArray = Object.keys(allNotice);
        let allNoticeKeyArrayMax = this.ComTool.ListMaxNum(allNoticeKeyArray);
        if(!allNoticeKeyArrayMax){
            allNoticeKeyArrayMax = 1;
		}
        let count = this.dataInfo.length;
        let localTime = new Date().getTime();
        //如果有新的公告就往allNtice里追加
        for(let i = 0; i < count; i++){

            let notice = this.dataInfo[i];
            let noticeBeginTime = notice["beginTime"];
            let noticeEndTime = notice["endTime"];
            //如果当前时间在公告的开始时间和结束时间内
            if(noticeEndTime > localTime && noticeBeginTime < localTime){
                allNoticeKeyArrayMax++;
                allNotice[allNoticeKeyArrayMax] = notice;
            }
		}
        this.allNoticeInfo = allNotice;
		return this.allNoticeInfo;
	},
    //获取指定ID的公告
    GetNoticeInfo:function (NoticeID) {
        if(!NoticeID){
            this.ErrLog("GetNoticeInfo not find NoticeID:%s", NoticeID);
            return;
        }
        return this.allNoticeInfo[NoticeID];
    },
	//-----------------发送接口----------------
	//自动初始化管理器数据封包
    AutoInitDataPack:function(){
        //发送初始化DB数据
        this.LoadInitDB("base.C2226InitNotice", {});
	},

})


var g_NoticeManager = null;

/**
 * 绑定模块外部方法
 */
exports.GetModel = function(){
	if(!g_NoticeManager)
		g_NoticeManager = new NoticeManager();
	return g_NoticeManager;

}
