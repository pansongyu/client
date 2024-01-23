var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad:function(){

    },
    InitData:function (clubId, unionId, unionPostType, myisminister, unionName, unionSign, levelPromotion) {
        this.clubId = clubId;
        this.unionId = unionId;
        this.unionPostType = unionPostType;
        this.myisminister = myisminister;
        this.unionName = unionName;
        this.unionSign = unionSign;
        this.levelPromotion = levelPromotion;
        if (this.unionPostType == app.ClubManager().UNION_GENERAL && this.levelPromotion > 0) {//普通成员
            this.node.getChildByName("topToggleContainer").getChildByName("toggle2").active = false;
            this.node.getChildByName("topToggleContainer").getChildByName("toggle3").active = false;

        }else{
            this.node.getChildByName("topToggleContainer").getChildByName("toggle2").active = true;
            this.node.getChildByName("topToggleContainer").getChildByName("toggle3").active = true;
        }
        let defaultToggle = this.node.getChildByName("topToggleContainer").getChildByName("toggle1");
        this.node.getChildByName("topToggleContainer").getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
        defaultToggle.getComponent(cc.Toggle).isChecked = true;//先关闭再打开才能出发事件
    },
    //控件点击回调
    OnClick_BtnWnd:function(eventTouch, eventData){
        try{
            app.SoundManager().PlaySound("BtnClick");
            let btnNode = eventTouch.currentTarget;
            let btnName = btnNode.name;
            this.OnClick(btnName, btnNode);
        }
        catch (error){
            console.log("OnClick_BtnWnd:"+error.stack);
        }
    },
    OnClick:function(btnName, btnNode){

    },
    OnClickToggle_1:function(target){
        if (this.unionPostType == app.ClubManager().UNION_GENERAL && this.levelPromotion > 0) {//普通成员
            this.node.getChildByName("zhanduiNode").active = false;
            this.node.getChildByName("zhanduiDetailNode").active = true;
            let sendPack = {};
            sendPack.clubId = this.clubId;
            let sendPackName = "club.CClubGetZhongZhiLevel";
            let self = this;
            app.NetManager().SendPack(sendPackName,sendPack, function(serverPack){
                self.node.getChildByName("zhanduiDetailNode").getComponent("zhanduiDetailNode").InitData(self.clubId, self.unionId, app.HeroManager().GetHeroProperty("pid"), serverPack.levelZhongZhi,self.levelPromotion,self.unionPostType);
            }, function(){

            });
        }else{
            this.node.getChildByName("zhanduiNode").active = true;
            this.node.getChildByName("zhanduiDetailNode").active = false;
        }
        this.node.getChildByName("memberExamineNode").active = false;
        this.node.getChildByName("changeAliveNode").active = false;
        this.node.getChildByName("zhanduiNode").getComponent("zhanduiNode").InitData(this.clubId, this.unionId, this.unionPostType,this.levelPromotion);
    },
    OnClickToggle_2:function(target){
        this.node.getChildByName("zhanduiNode").active = false;
        this.node.getChildByName("zhanduiDetailNode").active = false;
        this.node.getChildByName("memberExamineNode").active = false;
        this.node.getChildByName("changeAliveNode").active = true;
        this.node.getChildByName("changeAliveNode").getComponent("changeAliveNode").InitData(this.clubId, this.unionId, this.unionPostType,this.myisminister, this.unionName, this.unionSign);
    },
    OnClickToggle_3:function(target){
        this.node.getChildByName("zhanduiNode").active = false;
        this.node.getChildByName("zhanduiDetailNode").active = false;
        this.node.getChildByName("changeAliveNode").active = false;
        this.node.getChildByName("memberExamineNode").active = true;
        this.node.getChildByName("memberExamineNode").getComponent("memberExamineNode").InitData(this.clubId, this.unionId, this.unionPostType,this.myisminister, this.unionName, this.unionSign);
    },
});