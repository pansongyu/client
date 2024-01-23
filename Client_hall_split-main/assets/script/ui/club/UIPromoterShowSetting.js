/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        
    },
    // /**
    // * 局数
    // */
    // Game_Count(0),
    // /**
    // * 报名费
    // */
    // Rank_Cost(1),
    // /**
    // * 贡献值
    // */
    // Contribution_Value(2),
    // /**
    // * 分成
    // */
    // Share_Value(3),
    // /**
    // * 活跃度
    // */
    // Activity_Value(4),
    // /**
    // * 消耗钻石
    // */
    // Diamond_Cost(5),
    // *
    // * 输赢比赛分
    
    // SportsPoint_WinOrLose(6),
    // /**
    // * 个人比赛分
    // */
    // SportsPoint_Personal(7),
    // /**
    // * 总比赛分
    // */
    // SportsPoint_Total(8),
    // /**
    // * 推广员预警值
    // */
    // SportsPointWarn_Promotion(9),
    // /**
    // * 个人预警值
    // */
    // SportsPointWarn_Personal(10),
    //初始化

    // * 总积分
    // */
    // totalPoint(11),

     // * 个人总积分
    // */
    //  playerTotalPoint(12),
    // /**

    // * 个人淘汰分
    // */
    // eliminatePoint(13),

    // * 生存积分
    // */
    // alivePoint(14),

     // * 中至总积分
    // */
    //  zhongZhiTotalPoint(15),


    OnCreateInit:function(){

    },

    //---------显示函数--------------------
    OnShow:function(clubId, promotionShow, showListSecond){
        this.clubId = clubId;
        let allToggleNode = this.node.getChildByName("allToggleNode");
        for (let i = 0; i < allToggleNode.children.length; i++) {
            let childName = allToggleNode.children[i].name;
            let index = childName.replace('toggle_','') - 1;
            if (promotionShow.indexOf(index)>-1) {
                allToggleNode.children[i].getComponent(cc.Toggle).isChecked = true;
            }else{
                allToggleNode.children[i].getComponent(cc.Toggle).isChecked = false;
            }
        }

        let secondToggleNode = this.node.getChildByName("secondToggleNode");
        for (let i = 0; i < secondToggleNode.children.length; i++) {
            let childName = secondToggleNode.children[i].name;
            let index = childName.replace('toggle_','') - 1;
            if (showListSecond.indexOf(index)>-1) {
                secondToggleNode.children[i].getComponent(cc.Toggle).isChecked = true;
            }else{
                secondToggleNode.children[i].getComponent(cc.Toggle).isChecked = false;
            }
        }
    },
	OnClick:function(btnName, btnNode){
		if('btn_close'==btnName){
        	this.CloseForm();
        }
        else if('btn_sure'==btnName){
            let self = this;
            let sendPack = {};
            sendPack.clubId = this.clubId;
            let promotionShow = [];
            let allToggleNode = this.node.getChildByName("allToggleNode");
            for (let i = 0; i < allToggleNode.children.length; i++) {
                let childName = allToggleNode.children[i].name;
                let index = childName.replace('toggle_','') - 1;
                if (allToggleNode.children[i].getComponent(cc.Toggle).isChecked) {
                    promotionShow.push(index);
                }
            }
            if (promotionShow.length > 9) {
                app.SysNotifyManager().ShowSysMsg("最多只能勾选9个显示数据");
            }
            sendPack.showList = promotionShow;

            let showListSecond = [];
            let secondToggleNode = this.node.getChildByName("secondToggleNode");
            for (let i = 0; i < secondToggleNode.children.length; i++) {
                let childName = secondToggleNode.children[i].name;
                let index = childName.replace('toggle_','') - 1;
                if (secondToggleNode.children[i].getComponent(cc.Toggle).isChecked) {
                    showListSecond.push(index);
                }
            }
            sendPack.showListSecond = showListSecond;
            app.NetManager().SendPack("club.CClubSavePromotionShowLits",sendPack, function(serverPack){
                app.SysNotifyManager().ShowSysMsg("修改成功，请重新打开推广员界面，刷新数据");
                self.CloseForm();
            }, function(){

            });
        }else{
			this.ErrLog("OnClick:%s not find", btnName);
		}
	},
});
