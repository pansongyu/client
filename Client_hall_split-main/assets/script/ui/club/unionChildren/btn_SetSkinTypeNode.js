var app = require("app");
cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad:function(){

    },
    InitData:function (clubId, unionId) {
        let sendPack = {};
        sendPack.clubId = clubId;
        let self = this;
        this.curSkinType = -1;
        app.NetManager().SendPack("union.CUnionGetSkinInfo",sendPack, function(serverPack){
            self.ShowSkinInfoByType(serverPack.skinType);
            self.SetUpLevelAndQuan(serverPack);
        }, function(){

        });
    },
    SetUpLevelAndQuan:function(info){
        this.node.getChildByName("skinScrollView").getChildByName("toggle_shangji").getComponent(cc.Toggle).isChecked = info.showUplevelId==1;
        this.node.getChildByName("skinScrollView").getChildByName("toggle_benquan").getComponent(cc.Toggle).isChecked = info.showClubSign==1;
    },
    ShowSkinInfoByType:function(skinType){
        this.curSkinType = skinType;

        let content = this.node.getChildByName("skinScrollView").getChildByName("view").getChildByName("content");
        for (let i = 0; i < content.children.length; i++) {
            if (content.children[i].name.startsWith("btn_skin_")) {
                if (skinType == parseInt(content.children[i].name.replace('btn_skin_',''))) {
                    content.children[i].getChildByName("imgSelect").active = true;
                }else{
                    content.children[i].getChildByName("imgSelect").active = false;
                }
            }
        }
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
    SetShangJiAndQuan:function(){
            let shangji=this.node.getChildByName("skinScrollView").getChildByName("toggle_shangji").getComponent(cc.Toggle).isChecked;
            let benquan=this.node.getChildByName("skinScrollView").getChildByName("toggle_benquan").getComponent(cc.Toggle).isChecked;
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            if(shangji==true){
                sendPack.showUplevelId = 1;
            }else{
                sendPack.showUplevelId = 0;
            }
            if(benquan==true){
                sendPack.showClubSign = 1;
            }else{
                sendPack.showClubSign = 0;
            }
            let self = this;
            app.NetManager().SendPack("union.CUnionChangeSkinShowInfo",sendPack,function(event){
                app.ClubManager().SetCurClubShowUplevelId(sendPack.showUplevelId);
                app.ClubManager().SetCurClubShowClubSign(sendPack.showClubSign);
            },function(error){

            });
    },
    OnClick:function(btnName, btnNode){
    	if (btnName.startsWith("btn_skin_")) {
            if (this.curSkinType == -1) {
                return;
            }
            let skinType=parseInt(btnName.replace('btn_skin_',''));
            if (this.curSkinType != skinType) {
                this.SetWaitForConfirm('MSG_SETSKINTYPE',app.ShareDefine().Confirm,[],[skinType],"是否切换赛事皮肤");
            }
        }

    },
    /**
     * 2次确认点击回调
     * @param curEventType
     * @param curArgList
     */
    SetWaitForConfirm:function(msgID,type,msgArg=[],cbArg=[],content=""){
        let ConfirmManager = app.ConfirmManager();
        ConfirmManager.SetWaitForConfirmForm(this.OnConFirm.bind(this), msgID, cbArg);
        ConfirmManager.ShowConfirm(type, msgID, msgArg, content);
    },
    OnConFirm:function(clickType, msgID, backArgList){
        if(clickType != "Sure"){
            return
        }
        if('MSG_SETSKINTYPE' == msgID){
            let skinType = backArgList[0];
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.skinType = skinType;
            let self = this;
            app.NetManager().SendPack("union.CUnionChangeSkin",sendPack, function(serverPack){
                self.ShowSkinInfoByType(serverPack.skinType);
            }, function(){

            });
        }
    },
});