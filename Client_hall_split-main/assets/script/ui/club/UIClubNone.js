var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        layout:cc.Node,
        demo:cc.Node,

        clubname:cc.EditBox,
        clubfangka:cc.EditBox,
    },
    OnCreateInit: function () {
    },
    //-----------------显示函数------------------
    OnShow: function () {
        
    },
    OnClick:function(btnName, btnNode){
        if('btn_create' == btnName){
            this.allSelectCityData = app.HeroManager().GetCurSelectCityData();
            let heroRoomCard = app.HeroManager().GetHeroProperty("roomCard");
            let limit = app.Config ? app.Config.clubCreateNum : 100
            if(heroRoomCard>=limit){
                app.FormManager().ShowForm('ui/club/UIClubCreate',this.allSelectCityData[0].selcetId);
            }else{
                app.SysNotifyManager().ShowSysMsg('钻石不足' + limit + '，无法创建亲友圈');
            }



        }else if('btn_join' == btnName){
            this.FormManager.ShowForm('ui/club/UIJoinClub');
        }else if('btn_close' == btnName){
            this.CloseForm();
        }
    },
});