/*
小傅最新修改 2017-10-13 
 */
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        UIDaiKaiLog_Child: cc.Prefab,
        Scrollow:cc.Node,
    },

    OnCreateInit: function () {
       this.FormManager = app.FormManager();
       this.ComTool = app.ComTool();
       this.loopScrollView = this.getComponent("LoopScrollView");
       this.NetManager = app.NetManager();
       this.HeroManager = app.HeroManager(); 
       this.heroID = app.HeroManager().GetHeroProperty("pid");
    },
    OnShow:function(){
		  //获取带开放记录
          this.NetManager.SendPack("helproom.CHelpRoomGetList",{type:2},this.OnPack_HelpRoomList.bind(this),this.OnPack_HelpRoomListFail.bind(this));
    },
    OnPack_CPlayerRoomRecord:function(serverPack){
        if(serverPack.hasOwnProperty('helpRoomList')){
            let helpRoomList=serverPack.helpRoomList;
            app['helpRoomList']=helpRoomList;
            let everyGameKeys = Object.keys(helpRoomList);
            this.ScrollViewData(everyGameKeys);
        }else{
            //this.Scrollow.removeAllChildren();
            this.DestroyAllChildren(this.Scrollow);
            return;
        }
        
    },
     OnPack_HelpRoomList:function(serverPack){
        if(serverPack.hasOwnProperty('helpRoomList')){
            let helpRoomList=serverPack.helpRoomList;
            app['helpRoomList']=helpRoomList;
            let everyGameKeys = Object.keys(helpRoomList);
            this.ScrollViewData(everyGameKeys);
            console.log("everyGameKeys :",everyGameKeys);
        }else{
            //this.Scrollow.removeAllChildren();
            this.DestroyAllChildren(this.Scrollow);
            return;
        }
        
    },
    OnPack_HelpRoomListFail:function(serverPack){
        //this.Scrollow.removeAllChildren();
        this.DestroyAllChildren(this.Scrollow);
        return;
    },
    OnPack_CPlayerRoomRecordFail:function(serverPack){
        //this.Scrollow.removeAllChildren();
        this.DestroyAllChildren(this.Scrollow);
        return;
    },
    ScrollViewData:function(everyGameKeys){
        this.loopScrollView.InitScrollData("UIDaiKaiLog_Child", this.UIDaiKaiLog_Child, everyGameKeys);
    },
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_close"){
            this.CloseForm();
        }else if(btnName=='btn_list'){
			//打开代开放记录
            this.FormManager.ShowForm("UIDaiKai");
            this.FormManager.CloseForm('UIDaiKaiLog');
		}else{
            this.ErrLog("OnClick(%s) not find btnName",btnName);
        }
    },
});
