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
    ShowPlayerData: function (setEnd, playerAll, index) {
        let jin1 = setEnd.jin;
        let jin2 = 0;
        if (setEnd.jin2 > 0) {
            jin2 = setEnd.jin2;
        }
        let dPos = setEnd.dPos;
        let posResultList = setEnd["posResultList"];
        let posHuArray = new Array();
        let posCount = posResultList.length;
        for (let i = 0; i < posCount; i++) {
            let posInfo = posResultList[i];
            let pos = posInfo["pos"];
            let posHuType = this.ShareDefine.HuTypeStringDict[posInfo["huType"]];
            posHuArray[pos] = posHuType;
        }
        let PlayerInfo = playerAll[index];
        this.node.active = true;
        let maList = [];
        if(typeof(setEnd.maList) != "undefined"){
            maList = setEnd.maList;
        }else{
            maList = setEnd.maPaiLst;
        }
        this.UpdatePlayData(this.node, posResultList[index], PlayerInfo, jin1, jin2, maList);
        let huNode = this.node.getChildByName('jiesuan').getChildByName('hutype');
        this.ShowPlayerHuImg(huNode, posResultList[index]['huType'], posResultList[index].isJiePao);

        if (dPos === index) {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = true;
        } else {
            this.node.getChildByName("user_info").getChildByName("zhuangjia").active = false;
        }
        //显示头像，如果头像UI
        if (PlayerInfo["pid"] && PlayerInfo["iconUrl"]) {
            app.WeChatManager().InitHeroHeadImage(PlayerInfo["pid"], PlayerInfo["iconUrl"]);
        }
        let weChatHeadImage = this.node.getChildByName("user_info").getChildByName("head_img").getComponent("WeChatHeadImage");
        weChatHeadImage.ShowHeroHead(PlayerInfo["pid"]);
    },
    UpdatePlayData:function(PlayerNode,HuList,PlayerInfo,jin1=0,jin2=0,maList = null){
        this.showLabelNum=1;
        this.ClearLabelShow(PlayerNode.getChildByName('jiesuan').getChildByName('label_lists'));
        this.ShowPlayerRecord(PlayerNode.getChildByName('record'),HuList);
        this.ShowPlayerJieSuan(PlayerNode.getChildByName('jiesuan'),HuList);
        this.ShowPlayerInfo(PlayerNode.getChildByName('user_info'),PlayerInfo);
        this.ShowPlayerDownCard(PlayerNode.getChildByName('downcard'),HuList.publicCardList,jin1,jin2);
        this.ShowPlayerShowCard(PlayerNode.getChildByName('showcard'),HuList.shouCard,HuList.handCard,jin1,jin2);
        // this.ShowPlayerHuaCard(PlayerNode.getChildByName('huacard'),HuList.huaList);
        this.ShowPlayerNiaoPai(PlayerNode.getChildByName('zhongma'),maList,HuList.zhongList,HuList.endPoint);
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
    ShowPlayerNiaoPai:function(ShowNode,maList,zhongList,endPoint){
        for(let i=1;i<=8;i++){
            ShowNode.getChildByName('card'+i).active=false;
            ShowNode.getChildByName("card"+i).color=cc.color(255,255,255);
        }
        for(let i=0;i<maList.length;i++){
            let cardType=Math.floor(maList[i]/100);
            let node=ShowNode.getChildByName("card"+(i+1));
            this.ShowImage(node, 'EatCard_Self_', cardType);
            node.active=true;
            //更改为没中码都显示码牌
            if(typeof(endPoint.huTypeMap["MaiMa"]) != "undefined" && endPoint.huTypeMap["MaiMa"] > 0){
                if(zhongList.indexOf(maList[i]) > -1){
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
                app['majiang_' + imageName] = spriteFrame;
            })
            .catch(function(error){
                that.ErrLog("OpenPoker(%s) error:%s", imagePath, error.stack);
            });
        }
    },
    ShowPlayerHuImg:function(huNode,huTypeName,isJiePao){
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
        }else if (huType == this.ShareDefine.HuType_FHZ) {
            huNode.getComponent(cc.Label).string = '自摸';
        }else if (huType == this.ShareDefine.HuType_DDHu) {
            if(isJiePao){
                huNode.getComponent(cc.Label).string = '接炮';
            }else{
                huNode.getComponent(cc.Label).string = '自摸';
            }
        }else {
            huNode.getComponent(cc.Label).string = '';
        } 
    },
    ShowPlayerJieSuan:function(ShowNode,huInfoAll){
        let huInfo=huInfoAll['endPoint'].huTypeMap;
        // this.ClearLabelShow(ShowNode.getChildByName('label_lists'));
        for (let huType in huInfo) {
            let huPoint = huInfo[huType];
            if(huType == "Point"){
                continue;
            }
            this.ShowLabelName(ShowNode.getChildByName('label_lists'),this.LabelName(huType)+"： "+huPoint);
            console.log("ShowPlayerJieSuan", huType, huPoint);
        }
    },
    LabelName:function(huType){
        let LabelArray=[];
        LabelArray['QYS']='清一色';
        LabelArray['HYS']='混一色';
        LabelArray['ZYS']='字一色';
        LabelArray['QDHu']='小七对';
        LabelArray['ZiMo']='自摸';
        LabelArray['PingHu']='平胡';
        LabelArray['DianPao']='点炮';
        LabelArray['DianGang']='点杠';
        LabelArray['DianPeng']='点碰';
        LabelArray['JiePao']='接炮';
        LabelArray['AnGang']='暗杠';
        LabelArray['Gang']='碰杠';
        LabelArray['JieGang']='明杠';
        LabelArray['MenQing']='门清';
        LabelArray['GSKH']='杠上开花';
        LabelArray['PPHu']='碰碰胡';
        LabelArray['ZhaMa']='钓鱼';
        LabelArray['MaiMa']='买马';
        LabelArray['DiFen']='底分';
        LabelArray['PiaoFen']='飘分';
        LabelArray['DD']='大吊车';
        LabelArray['HDLY']='海底捞月';
        LabelArray['Hua']='花数';
        LabelArray['AnKe']='暗刻';
        LabelArray['OtherPoint']='固定分';
        return LabelArray[huType];
    },
});