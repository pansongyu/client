/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("UIUnionClubUserList"),

    properties: {
    	
    },
    ShowMemberList:function(playerlist,isRefresh){
        if (isRefresh) {
            //this.memberlist_layout.removeAllChildren();
            this.DestroyAllChildren(this.memberlist_layout);
            this.memberlist_scrollView.scrollToTop();
        }
        for(let i=0;i<playerlist.length;i++){
            let heroID = playerlist[i].shortPlayer.pid;
            let shortHeroID=this.ComTool.GetPid(heroID);
            let nodePrefab = cc.instantiate(this.memberlist_demo);
            nodePrefab.name = heroID.toString();
            nodePrefab.minister = playerlist[i].minister;
            nodePrefab.playerData = playerlist[i];
            let headImageUrl = playerlist[i].shortPlayer.iconUrl;
            nodePrefab.getChildByName('name').getComponent(cc.Label).string=this.ComTool.GetBeiZhuName(playerlist[i].shortPlayer.pid,playerlist[i].shortPlayer.name);
            nodePrefab.getChildByName('id').getComponent(cc.Label).string="ID:"+this.ComTool.GetPid(heroID);
            nodePrefab.getChildByName('promoterName').getComponent(cc.Label).string=this.ComTool.GetBeiZhuName(playerlist[i].upShortPlayer.pid,playerlist[i].upShortPlayer.name);
            nodePrefab.getChildByName('promoterId').getComponent(cc.Label).string="ID:"+this.ComTool.GetPid(playerlist[i].upShortPlayer.pid);
            nodePrefab.getChildByName('pl').getComponent(cc.Label).string = playerlist[i].sportsPoint;
            nodePrefab.getChildByName('taotaifen').getComponent(cc.Label).string = playerlist[i].eliminatePoint;
            
            //根据是否禁止来显示按钮
            if (playerlist[i].isUnionBanGame) {
                nodePrefab.getChildByName('btn_jzyx').active=false;
                nodePrefab.getChildByName('btn_qxjz').active=true;
                nodePrefab.getChildByName("img_jzyx").active=true;
            }else{
                nodePrefab.getChildByName('btn_jzyx').active=true;
                nodePrefab.getChildByName('btn_qxjz').active=false;
                nodePrefab.getChildByName("img_jzyx").active=false;
            }
            nodePrefab.active=true;
            this.memberlist_layout.addChild(nodePrefab);
            if(headImageUrl){
                this.WeChatManager.InitHeroHeadImage(heroID, headImageUrl);
                let WeChatHeadImage = nodePrefab.getChildByName('head').getComponent("WeChatHeadImage");
                WeChatHeadImage.OnLoad();
                WeChatHeadImage.ShowHeroHead(heroID,headImageUrl);
            }
        }
    },
});
