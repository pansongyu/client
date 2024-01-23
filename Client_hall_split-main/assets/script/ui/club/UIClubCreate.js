var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        demo:cc.Node,

        clubname:cc.EditBox,
    },
    OnCreateInit: function () {
        this.selectCityConfig = app.SysDataManager().GetTableDict("selectCity");
    },
    //-----------------显示函数------------------
    OnShow: function (selcetId) {
        this.ShowAllCity([selcetId]);
    },
    ShowAllCity:function(cityIdList){
        let cityScrollView = this.node.getChildByName("cityScrollView");
        let content = cityScrollView.getChildByName("view").getChildByName("content");
        cityScrollView.getComponent(cc.ScrollView).scrollToTop();
        this.DestroyAllChildren(content);
        let cityToggle = this.node.getChildByName("cityToggle");
        cityToggle.active = false;
        for (let i = 0; i < cityIdList.length; i++) {
            let child = cc.instantiate(cityToggle);
            let cityInfo = this.selectCityConfig[cityIdList[i]];
            child.getChildByName("lb_cityName").getComponent(cc.Label).string = cityInfo.Name;
            if (i == 0) {
                child.getComponent(cc.Toggle).isChecked = true;
            }else{
                child.getComponent(cc.Toggle).isChecked = false;
            }
            child.cityId = cityIdList[i];
            child.active = true;
            content.addChild(child);
        }
    },
    IfChinese(str){
        var reg = /^[\u4E00-\u9FA5]+$/;
        if(reg.test(str)){
            return true;
        } else {
            return false;
        }
    },
    Creater:function(){
        let that=this;
        let name=this.clubname.string;
        if(name==''){
            this.ShowSysMsg("请输入亲友圈名称");
            return;
        }
        if(this.IfChinese(name)==false){
            this.ShowSysMsg("只能输入中文名称");
            return;
        }
        let cityScrollView = this.node.getChildByName("cityScrollView");
        let content = cityScrollView.getChildByName("view").getChildByName("content");
        let allSelectCityData = app.HeroManager().GetCurSelectCityData();
        let selectCityId = allSelectCityData[0]['selcetId'];
        for (let i = 0; i < content.children.length; i++) {
            let childTemp = content.children[i];
            if (childTemp.getComponent(cc.Toggle).isChecked) {
                selectCityId = childTemp.cityId;
                break;
            }
        }
        // if (selectCityId == 0) {
        //     this.ShowSysMsg("请选择一个城市");
        //     return;
        // }
        app.NetManager().SendPack('club.CClubCreate',{'clubName':name,'cityId':selectCityId},function(serverPack){
            that.ShowSysMsg("亲友圈创建成功");
            that.CloseForm();
            if (app.FormManager().GetFormComponentByFormName("UITop")) {
                app.FormManager().GetFormComponentByFormName("UITop").RemoveCloseFormArr("ui/club/UIClubList");
            }
            app.FormManager().CloseForm("UITop");
            
            app.FormManager().CloseForm("ui/club/UIClubList");
            app.FormManager().CloseForm("ui/club/UIClubNone");
            //同步最新数据，打开亲友圈界面
            let clubDatas = app.ClubManager().AddClubData(serverPack);
            app.ClubManager().SetLastClubData(serverPack.id, serverPack.clubsign, serverPack.name,0,0);
            if(clubDatas.length == 0){
                app.FormManager().ShowForm("ui/club/UIClubNone");
            }else{
                // let clubMoban = cc.sys.localStorage.getItem('club_moban');
                // if(clubMoban == 1){
                //     app.FormManager().ShowForm("ui/club/UIClub");
                // }else{
                // app.FormManager().CloseForm("ui/club/UIClubMain");
                // app.FormManager().ShowForm("ui/club/UIClubMain");
                // }
                app.ClubManager().CloseClubFrom();
            }
        },function(error){
            if (error.Msg == "FAMILY_CITY_ID_ERROR") {
                app.SysNotifyManager().ShowSysMsg("城市选择错误，请重新选择");
            }else{
                app.SysNotifyManager().ShowSysMsg(error.Msg);
            }
        });

    },
    OnClick:function(btnName, btnNode){
        if('btn_create' == btnName){
            this.Creater();
        }else if('btn_close' == btnName){
            this.CloseForm();
        }
        
    },
});