var app = require("pdk_app");
cc.Class({
    extends: require(app.subGameName + "_BaseForm"),

    properties: {
    },

    OnCreateInit: function () {
        this.headNodes = this.GetWndNode("node/headNodes");
        this.zongfenNode = this.GetWndNode("node/zongfen");
        this.jiFenLayout = this.GetWndNode("node/jifenNode/layout");
        this.demo = this.node.getChildByName("demo");

        this.RoomMgr = app[app.subGameName.toUpperCase()+"RoomMgr"]();
        this.Room = app[app.subGameName.toUpperCase()+"Room"]();
        this.RoomPosMgr = app[app.subGameName.toUpperCase()+"RoomPosMgr"]();
        this.SoundManager = app[app.subGameName+"_SoundManager"]();
        this.HeroManager = app[app.subGameName+"_HeroManager"]();
        this.RoomSet = app[app.subGameName.toUpperCase()+"RoomSet"]();
        this.ComTool = app[app.subGameName+"_ComTool"]();
        this.SDKManager = app[app.subGameName+"_SDKManager"]();
        this.Define = app[app.subGameName.toUpperCase()+"Define"]();

        this.bigWinner = 0;
    },


    OnShow:function(serverPack){
        this.HideAll();
        this.InitHeadAndFen(serverPack["userInfo"]);
        this.ShowJiFen(serverPack["setInfo"]);
    },
    HideAll:function(){
        for (let i = 0; i < 3; i++) {
            this.headNodes.children[i].active = false;
        }
        for (var i = 0; i < 3; i++) {
            let node = this.zongfenNode.getChildByName("point" + i);
            node.active = false;
        }
        this.jiFenLayout.removeAllChildren();
    },
    InitHeadAndFen:function(userInfo){
        for(let pos in userInfo){
            let player = userInfo[pos];
            //显示玩家头像
            let headNode = this.headNodes.getChildByName("headNode" + pos);
            headNode.active = true;
            headNode.getChildByName('touxiang').getComponent(app.subGameName + "_WeChatHeadImage").ShowHeroHead(player["pid"]);

            //显示玩家总分
            let pointNode = this.zongfenNode.getChildByName("point" + pos);
            pointNode.active = true;
            pointNode.getComponent(cc.Label).string = player["totalPoint"];
        }
    },
    ShowJiFen:function(setInfo){
        for (let i = 0; i < setInfo.length; i++) {
            let setID = setInfo[i]["setID"];
            let pointMap = setInfo[i]["point"];
            let jiFenDemo = cc.instantiate(this.demo);
            jiFenDemo.getChildByName("setID").getComponent(cc.Label).string = "第" + setID + "局";
            for(let pos in pointMap){
                jiFenDemo.getChildByName("point" + pos).getComponent(cc.Label).string = pointMap[pos];
                jiFenDemo.getChildByName("point" + pos).active = true;
            }
            if(setID%2 == 1){
               jiFenDemo.getComponent(cc.Sprite).spriteFrame = "";
            }
            jiFenDemo.active = true;
            this.jiFenLayout.addChild(jiFenDemo);
        }
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_jixu"){
        }
    },
});
