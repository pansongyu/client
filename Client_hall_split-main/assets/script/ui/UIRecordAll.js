/*
小傅最新修改 2017-10-13 
 */
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        UIRecordAll_Child: cc.Prefab,
        Scrollow:cc.Node,

        btnNodeGroup:cc.Node,
        pafabItem:cc.Node,
        pafabAllItem:cc.Node,
        lb_page:cc.Label,
    },

    OnCreateInit: function () {
       this.FormManager = app.FormManager();
       this.ComTool = app.ComTool();
       this.loopScrollView = this.getComponent("LoopScrollView");
       this.NetManager = app.NetManager();
       this.HeroManager = app.HeroManager(); 
       this.heroID = app.HeroManager().GetHeroProperty("pid");
       this.selectGameType = -1;
       this.selectPage = 1;
       this.lastSelectPage = 1;
    },
    OnShow:function(clubId=0,unionId=0){
        this.clubId=clubId;
        this.unionId=unionId;
        this.FormManager.ShowForm('UITop', "UIRecordAll");
        /*if(0 == clubId){
            this.NetManager.SendPack("game.CPlayerRoomRecord",{type:1},this.OnPack_CPlayerRoomRecord.bind(this),this.OnPack_CPlayerRoomRecordFail.bind(this));
        }else{
            this.NetManager.SendPack("club.CClubRoomRecord",{type:1,clubId:this.clubId},this.OnPack_CPlayerRoomRecord.bind(this),this.OnPack_CPlayerRoomRecordFail.bind(this));
        }*/
        // let that=this;
        // app.NetManager().SendPack('family.CPlayerGameList',{},function(serverPack){
        //     that.InitgameBtns(serverPack);
        // },function(serverPack){
        //     that.InitgameBtns(serverPack);
        // });
        this.InitgameBtns({"gameList":app.Client.GetAllGameId()});
        this.node.getChildByName("right").getChildByName("btn_tongji").active=clubId>0;
    },
    ShowRecord:function(gameType,page=1){
        this.selectGameType = gameType;
        this.selectPage = page;
        for(let i=0;i<this.btnNodeGroup.children.length;i++){
            this.btnNodeGroup.children[i].getChildByName('icon').active=false;
        }
        if(gameType==-1){
            this.btnNodeGroup.getChildByName('btn_quanbu').getChildByName('icon').active=true;
        }else{
            let gemePY=this.ShareDefine.GametTypeID2PinYin[gameType];
            this.btnNodeGroup.getChildByName('btn_'+gemePY).getChildByName('icon').active=true;
        }
        this.NetManager.SendPack("game.CPlayerRoomRecord",{"clubId":this.clubId,'gameType':gameType,'pageNum':page},this.OnPack_CPlayerRoomRecord.bind(this),this.OnPack_CPlayerRoomRecordFail.bind(this));
    },
    InitgameBtns:function(serverPack){
        //this.btnNodeGroup.removeAllChildren();
        this.DestroyAllChildren(this.btnNodeGroup);
        this.gameList = {};
        this.gameList['quanbu']="全部";
        if(serverPack.gameList && serverPack.gameList!="null"){
            let gameIDList=serverPack.gameList;
            for(let i=0;i<gameIDList.length;i++){
                let gamePinYin=this.ShareDefine.GametTypeID2PinYin[gameIDList[i]];
                let gameName=this.ShareDefine.GametTypeID2Name[gameIDList[i]];
                this.gameList[gamePinYin]=gameName;
            }
       }else{
            this.gameList['ddz']='斗地主';
       }
       for(let key in this.gameList){
            let node =null;
            if(key!='quanbu'){
                node = cc.instantiate(this.pafabItem);
                node.getChildByName('icon_off').getComponent(cc.Label).string = this.gameList[key];
                node.getChildByName('icon').getChildByName('icon_on').getComponent(cc.Label).string = this.gameList[key];
            }else{
                node = cc.instantiate(this.pafabAllItem);
            }
            node.active = true;
            node.name = 'btn_' + key;
            this.btnNodeGroup.addChild(node);
        }
        this.ShowRecord(-1);


        //this.scroll_Left.scrollToTop();
    },
    SortRecodeByTime:function(a,b){
        // return b.data.endTime - a.data.endTime;
        return b.endTime - a.endTime;
    },
    OnPack_CPlayerRoomRecord:function(serverPack){
        console.log("OnPack_CPlayerRoomRecord serverPack:",serverPack);
        if(serverPack.hasOwnProperty('pRoomRecords')){
            let recodelist=serverPack.pRoomRecords;
            if (recodelist.length <= 0) {
                this.selectPage = this.lastSelectPage;
                return;
            }
            app['recodelist']=recodelist;
            let sortList = [];
            for(let key in recodelist){
                sortList.push(recodelist[key]);
            }
            sortList.sort(this.SortRecodeByTime);
            let everyGameKeys = Object.keys(sortList);
            this.lb_page.string = this.selectPage;
            this.ScrollViewData(everyGameKeys);
        }else{
            this.lb_page.string = "1";
            //this.Scrollow.removeAllChildren();
            this.DestroyAllChildren(this.Scrollow);
            return;
        }
        
    },
    OnPack_CPlayerRoomRecordFail:function(serverPack){
    	//this.ScrollViewData({});
        //this.Scrollow.removeAllChildren();
        this.DestroyAllChildren(this.Scrollow);
        return;
    },
    ScrollViewData:function(everyGameKeys){
        this.loopScrollView.InitScrollData("UIRecordAll_Child", this.UIRecordAll_Child, everyGameKeys);
    },
    OnClick:function(btnName, btnNode){
        if(btnName=="btn_huifang"){
            this.FormManager.ShowForm("UIReplayCode");
        }else if(btnName=="btn_tongji"){
            this.FormManager.ShowForm("ui/club/UIClubPlayerRecord",this.clubId,this.unionId);
        }else if(btnName=="btn_close"){
            this.CloseForm();
        }else if(btnName=="btn_zhanji_next"){
            this.lastSelectPage = this.selectPage;
            this.ShowRecord(this.selectGameType, this.selectPage + 1);
        }else if(btnName=="btn_zhanji_last"){
            if (this.selectPage <= 1) {
                return;
            }
            this.lastSelectPage = this.selectPage;
            this.ShowRecord(this.selectGameType, this.selectPage - 1);
        }else if(btnName.startsWith("btn_")){
            let gameType=btnName.replace('btn_','');
            gameType=gameType.toUpperCase();
            let gameID=-1;
            if(gameType!='QUANBU' && gameType!='quanbu'){
                gameID=this.ShareDefine.GametTypeNameDict[gameType];
            }
            this.ShowRecord(gameID);
        }
        else{
            this.ErrLog("OnClick(%s) not find btnName",btnName);
        }
    },
});
