/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
        img_kuang:[cc.SpriteFrame],
    },

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
        this.ShareDefine=app.ShareDefine();
        this.sp_in = this.node.getChildByName("showcard").getChildByName("sp_in");
        this.filePath = "texture/xplp/card";
        //添加吃牌 四色牌吃牌比较多
        let downcard = this.node.getChildByName("downcard");
        var downNode01 = downcard.getChildByName('down01');
        this.ChildCount = 20;
        this.PaiChildCount = 21;
        for (var _i = 6; _i <= this.ChildCount; _i++) {
            var downNode = cc.instantiate(downNode01);
            downNode.name = this.ComTool.StringAddNumSuffix("down", _i, 2);
            downcard.addChild(downNode);
        }
	},
    ShowPlayerHuImg:function(huNode,huTypeName){
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType = this.ShareDefine.HuTypeStringDict[huTypeName];
        if (typeof (huType) == "undefined") {
            huNode.getComponent(cc.Label).string = '';
        } else if (huType == this.ShareDefine.HuType_DianPao) {
            huNode.getComponent(cc.Label).string = '点泡';
        } else if (huType == this.ShareDefine.HuType_JiePao) {
            huNode.getComponent(cc.Label).string = '接炮';
        } else if (huType == this.ShareDefine.HuType_ZiMo) {
            huNode.getComponent(cc.Label).string = '自摸';
        } else if (huType == this.ShareDefine.HuType_QGH) {
            huNode.getComponent(cc.Label).string = '抢杠胡';
        } else {
            huNode.getComponent(cc.Label).string = '';
        } 
    },
    ShowPlayerShowCard: function (showNode, cardIDList, handCard, jin1, jin2) {
        showNode.active = 1;
        let count = 0;
        if (typeof(cardIDList) != "undefined") {
            count = cardIDList.length;
        }
        if (count > 16) {
        	showNode.getComponent(cc.Layout).spacingX = 10 - showNode.children.length;
        }else{
        	showNode.getComponent(cc.Layout).spacingX = 0;
        }
        for (let index = 0; index < count; index++) {
            let cardID = cardIDList[index];
            let childName = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
            let childNode = showNode.getChildByName(childName);
            if (!childNode) {
                // this.ErrLog("ShowAllDownCard not find childName:%s", childName);
                // continue
				//牌不够，继续渲染
				childNode = cc.instantiate(this.sp_in);
				childNode.name = this.ComTool.StringAddNumSuffix("card", index + 1, 2);
				showNode.addChild(childNode);
				showNode.getComponent(cc.Layout).spacingX = 10 - showNode.children.length;
            }
            childNode.active = 1;
            this.ShowImage(childNode, cardID);
        }
        //设置多余的卡牌位置空
        for (let cardIndex = count + 1; cardIndex <= (showNode.children.length - 2); cardIndex++) {
            let childName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
            let childNode = showNode.getChildByName(childName);
            if (!childNode) {
                continue
            }
            childNode.active = 0;
        }
        //进卡不能控制显影只能设置空图片
        if (handCard > 0 && handCard != 5000) {
            this.sp_in.active = 1;
            this.ShowImage(this.sp_in, handCard);
        } else {
            this.sp_in.getComponent(cc.Sprite).spriteFrame = "";
            this.sp_in.UserData = null;
        }
    },
    ShowPlayerDownCard: function (showNode, publishcard, jin1 = 0, jin2 = 0) {
        showNode.active = 1;
        let count=0;
        if(typeof(publishcard)!="undefined"){
            count = publishcard.length;
        }
        for(let index=0; index<count; index++){
            let publicInfoList = publishcard[index];
            let cardIDList = publicInfoList.slice(3, publicInfoList.length);
            //操作类型
            let opType = publicInfoList[0];
            //如果是暗杠,前面3个盖牌，最后一个显示牌
            if(opType == this.ShareDefine.OpType_AnGang){
                cardIDList = [0,0,0,cardIDList[0]];
            }
            let childName = this.ComTool.StringAddNumSuffix("down", index + 1, 2);
            let childNode = showNode.getChildByName(childName);
            if(!childNode){
                continue
            }
            childNode.active = true;
            let cardCount = cardIDList.length;
            for(let cardIndex=0; cardIndex<cardCount; cardIndex++){
                let cardID = cardIDList[cardIndex];
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex + 1, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, showNode);
                if(!childNode){
                    continue
                }
                childNode.active = true;
                this.ShowImage(childNode, cardID);
            }
            //设置多余的卡牌位置空
            for(let cardIndex=cardCount+1; cardIndex <= this.PaiChildCount; cardIndex++){
                let paiChildName = this.ComTool.StringAddNumSuffix("card", cardIndex, 2);
                let childPath = [childName, paiChildName].join("/");
                let childNode = cc.find(childPath, showNode);
                if(!childNode){
                    continue
                }
                childNode.active = false;
                let cardSprite = childNode.getComponent(cc.Sprite);
                cardSprite.spriteFrame = null;

            }
        }

        //隐藏掉剩余的卡牌
        for(let index=count+1; index <= this.ChildCount; index++){
            let childName = this.ComTool.StringAddNumSuffix("down", index, 2);
            let childNode = showNode.getChildByName(childName);
            if(!childNode){
                continue
            }
            childNode.active = false;
        }
    },
    ShowPlayerRecord: function (ShowNode, huInfo) {
        let absNum = Math.abs(huInfo["point"]);
        if (absNum > 10000) {
            let shortNum = (absNum / 10000).toFixed(2);
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + shortNum + "万";
            } else {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '-' + shortNum + "万";
            }
        } else {
            if (huInfo["point"] > 0) {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = '+' + huInfo["point"];
            } else {
                ShowNode.getChildByName('tip_point').getChildByName('lb_point').getComponent("cc.Label").string = huInfo["point"];
            }
        }
          //显示比赛分
        if (typeof (huInfo.sportsPointTemp) != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPointTemp > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string =  "+" + huInfo.sportsPointTemp;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string =  huInfo.sportsPointTemp;
            }
        }else if (typeof (huInfo.sportsPoint) != "undefined") {
            ShowNode.getChildByName('tip_sportspoint').active = true;
            if (huInfo.sportsPoint > 0) {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string =  "+" + huInfo.sportsPoint;
            } else {
                ShowNode.getChildByName('tip_sportspoint').getChildByName('lb_sportspoint').getComponent("cc.Label").string =  huInfo.sportsPoint;
            }
        }else{
            ShowNode.getChildByName('tip_sportspoint').active = false;
        }
    },
    ShowPlayerHuaCard: function (ShowNode, hualist) {
        
    },
    ShowImage: function (childNode, cardID) {
        //显示贴图
        let childSprite = childNode.getComponent(cc.Sprite);
        if (!childSprite) {
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
        }
        app.ResManager().SetMJSpriteFrameToNode(this.filePath,Math.floor(cardID / 100), childNode, function(){});
    },
    LabelName:function(huType){
        let LabelArray=[];
        return LabelArray[huType];
    },
});
