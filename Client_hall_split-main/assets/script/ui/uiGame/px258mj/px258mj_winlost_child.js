/*
 UICard01-04 牌局吃到的牌显示
 */

let app = require("app");

cc.Class({
	extends: require("BaseMJ_winlost_child"),

	properties: {
    },

	// use this for initialization
	OnLoad: function () {
		this.ComTool = app.ComTool();
        this.IntegrateImage = app.SysDataManager().GetTableDict("IntegrateImage");
        this.ShareDefine=app.ShareDefine();
	},
    UpdatePlayData: function (PlayerNode, HuList, PlayerInfo, jin1 = 0, jin2 = 0, zhuaNiaoList = null) {
        this.showLabelNum = 1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'), HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'), HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'), PlayerInfo);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'), HuList.publicCardList, jin1, jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'), HuList.shouCard, HuList.handCard, jin1, jin2);
        this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'), HuList.huaList);
        this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'),zhuaNiaoList,HuList.endPoint);
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
    
    ShowPlayerNiaoPai:function(ShowNode,zhuaNiaoList,endPoint){
        let niaoPaiList = endPoint["niaoPaiList"] || [];
        for(let i=1;i<=8;i++){
            ShowNode.getChildByName('card'+i).active=false;
            ShowNode.getChildByName("card"+i).color=cc.color(255,255,255);
        }
        // if(typeof(endPoint.huTypeMap["ZhongNiao"]) != "undefined" && endPoint.huTypeMap["ZhongNiao"] > 0){
        //     ShowNode.getChildByName('lb_tip').getComponent(cc.Label).string='中码：';
        // }else{
        //     ShowNode.getChildByName('lb_tip').getComponent(cc.Label).string='';
        //     return;
        // }
        for(let i=0;i<zhuaNiaoList.length;i++){
            let cardType=zhuaNiaoList[i];
            let node=ShowNode.getChildByName("card"+(i+1));
            this.ShowImage(node, 'EatCard_Self_', cardType);
            node.active=true;
            //更改为没中码都显示码牌
            if(typeof(endPoint.huTypeMap["ZhongNiao"]) != "undefined" && endPoint.huTypeMap["ZhongNiao"] > 0){
                if(niaoPaiList.indexOf(cardType) > -1){
                    node.color=cc.color(255,255,0);
                }else{
                    node.color=cc.color(255,255,255);
                }
            }else{
                node.color=cc.color(255,255,255);
            }
        }
    },
    ShowImage:function(childNode, imageString, cardID){
        let childSprite = childNode.getComponent(cc.Sprite);
        if(!childSprite){
            this.ErrLog("ShowOutCard(%s) not find cc.Sprite", childNode.name);
            return
        }
        //取卡牌ID的前2位
        let imageName = [imageString, cardID].join("");
        let imageInfo = this.IntegrateImage[imageName];
        if(!imageInfo){
            this.ErrLog("ShowImage IntegrateImage.txt not find:%s", imageName);
            return
        }
        let imagePath = imageInfo["FilePath"];
        if(app['majiang_'+imageName]){
            childSprite.spriteFrame = app['majiang_'+imageName];
        }else{
            let that = this;
            app.ControlManager().CreateLoadPromise(imagePath, cc.SpriteFrame)
            .then(function(spriteFrame){
                if(!spriteFrame){
                    that.ErrLog("OpenPoker(%s) load spriteFrame fail", imagePath);
                    return
                }
                childSprite.spriteFrame = spriteFrame;
            })
            .catch(function(error){
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            });
        }
    },
    ShowPlayerHuImg:function(huNode,huTypeName){
        /*huLbIcon
        *  0:单吊，1：点炮，2：单游，3：胡，4：六金，5：平胡，6:抢杠胡 7:抢金，8：三游，9：四金倒，10：三金倒，11：三金游，12：十三幺
        *  13：双游，14：天胡，15：五金，16：自摸 17:接炮
        */
        let huType=this.ShareDefine.HuTypeStringDict[huTypeName];
        if(typeof(huType)=="undefined"){
            huNode.getComponent(cc.Label).string = '';
        }else if(huType == this.ShareDefine.HuType_DianPao){
            huNode.getComponent(cc.Label).string = '点泡';
        }else if(huType == this.ShareDefine.HuType_JiePao){
            huNode.getComponent(cc.Label).string = '接炮';
        }else if(huType == this.ShareDefine.HuType_ZiMo){
            huNode.getComponent(cc.Label).string = '自摸';
        }else if(huType == this.ShareDefine.HuType_QGH){
            huNode.getComponent(cc.Label).string = '抢杠胡';
        }else {
            huNode.getComponent(cc.Label).string = '';
        } 
    },
    LabelName:function(huType){
        let LabelArray=[];
        LabelArray['MaiZi']='买子';
        LabelArray['Hu']='胡';
        LabelArray['PPHu']='碰碰胡';
        LabelArray['QDHu']='七对胡';
        LabelArray['HDDHu']='豪华七对';
        LabelArray['CHDDHu']='双豪华七对';
        LabelArray['CCHDDHu']='三豪华七对';
        LabelArray['QYS']='清一色';
        LabelArray['Long']='一条龙';
        LabelArray['LuanJiang']='乱将胡';
        LabelArray['LanHu']='烂胡';
        LabelArray['ZYS']='字一色';
        LabelArray['LuoHan18']='十八罗汉';
        LabelArray['DianGang']='点杠';
        LabelArray['DianPeng']='点碰';
        LabelArray['JieGang']='接杠';
        LabelArray['Gang']='杠';
        LabelArray['AnGang']='暗杠';
        LabelArray['FangGang']='放杠';
        LabelArray['ZiMo']='自摸';
        LabelArray['QGH']='抢杠胡';
        LabelArray['HDLY']='海底捞月';
        LabelArray['GSKH']='杠上开花';
        LabelArray['GSP']='杠上炮';
        LabelArray['ZhongNiao']='中鸟';
        LabelArray['NiaoPai']='鸟牌';
        LabelArray['DianPao']='点炮';
        LabelArray['JiePao']='接炮';
        LabelArray['DaTou']='打骰';
        LabelArray['WeiPai']='喂牌'; 
        LabelArray['TianHu']='天胡';
        LabelArray['DiHu']='地胡';
        LabelArray['QDHu']='七对';
        LabelArray['JYSPPH']='将一色碰碰胡';
        LabelArray['QYSYTL']='清一色一条龙';
        LabelArray['LuanJiangQD']='乱将胡七对';
        LabelArray['QYSZJ']='清一色带真将';
        LabelArray['LanHu']='烂胡';
        LabelArray['QYSZJYTL']='清一色真将一条龙';
        LabelArray['ZYSPPH']='字一色碰碰胡';
        LabelArray['ZYSQD']='字一色七对';
        LabelArray['ZYSHDDHu']='字一色豪华七对';
        LabelArray['ZYSCHDDHu']='字一色双豪华七对';
        LabelArray['LuanJiangCCHDDHu']='乱将胡三豪华七对';
        LabelArray['QYSCCHDDHu']='清一色三豪华七对';
        LabelArray['ZYSCCHDDHu']='字一色三豪华七对';
        LabelArray['QYSPPH']='清一色碰碰胡';
        LabelArray['QYSZJPPH']='清一色真将碰碰胡';
        LabelArray['QYSQD']='清一色七对';
        LabelArray['QYSZJQD']='清一色七对带真将';
        LabelArray['QYSHDDHu']='清一色豪华七对';
        LabelArray['QYSCHDDHu']='清一色双豪华七对';
        LabelArray['QYSZJHDDHu']='清一色豪华七对带真将';
        LabelArray['QYSZJCHDDHu']='清一色双豪华七对带真将';
        LabelArray['QYSZJCCHDDHu']='清一色三豪华七对带真将';
        LabelArray['LuanJiangCHDDHu']='乱将胡双豪华七对';
        LabelArray['LuanJiangHDDHu']='乱将胡豪华七对';
        return LabelArray[huType];
    },
    ShowPlayerJieSuan:function(ShowNode,huInfoAll){
        let huInfo=huInfoAll['endPoint'].huTypeMap;
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            if(huType == "HDLY" || huType == "GSKH"){
                this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType));
            }else{
                this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType)+"： "+huPoint);
            }
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
});
