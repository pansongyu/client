var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        sp_paipindiLabel:cc.Label,
        sp_haopingdiLabel:cc.Label,
        sp_chapingdiLabel:cc.Label,
        sp_chupaidiLabel:cc.Label,
        sp_zhongtulikaiLabel:cc.Label,
        heroName:cc.Label,
        heroID:cc.Label,
        heroFastCount:cc.Label,
        heroRoomCard:cc.Label,
    },

    OnCreateInit: function () {
        this.PlayerRoomManager = app.PlayerRoomManager();
        this.ComTool = app.ComTool();
        this.RegEvent("InitPlayerRoom", this.Event_InitPlayerRoom);
        this.RegEvent("HeroProperty", this.Event_HeroProperty);
    },
    Event_HeroProperty:function (event) {
        let argDict = event.detail;

        if(argDict["Property"] == "fastCard"){
            this.ShowFastCount();
        }
        else if(argDict["Property"] == "roomCard"){
            this.ShowRoomCard();
        }
    },
    Event_InitPlayerRoom:function () {
        this.Show_PaiYouKouBei();
        let chuPai = this.Show_KuaiSuChuPai();
        let liKai = this.Show_ZhongTuLiKai();
        let haoPingNumber = this.Show_HaoPing();
        let chaPingNumber = this.Show_ChaPing();
        this.Show_PaiPin(haoPingNumber, chaPingNumber, chuPai, liKai);
    },

    OnShow: function () {
        this.ShowHero_NameOrID();
        this.ShowFastCount();
        this.ShowRoomCard();

        this.Show_PaiYouKouBei();

        let chuPai = this.Show_KuaiSuChuPai();
        let liKai = this.Show_ZhongTuLiKai();
        let haoPingNumber = this.Show_HaoPing();
        let chaPingNumber = this.Show_ChaPing();

        this.Show_PaiPin(haoPingNumber, chaPingNumber, chuPai, liKai);
    },
    ShowHero_NameOrID:function () {

        let heroID = app.HeroManager().GetHeroProperty("pid");
        let heroName = app.HeroManager().GetHeroProperty("name");
        this.heroName.string =this.ComTool.GetBeiZhuName(heroID,heroName,9);
        this.heroID.string = app.i18n.t("UIMain_PIDText",{"pid":this.ComTool.GetPid(heroID)});

    },
    ShowFastCount:function () {
        let fastCard = app.HeroManager().GetHeroProperty("fastCard");
        this.heroFastCount.string = fastCard;
    },
    ShowRoomCard:function () {

        let heroRoomCard = app.HeroManager().GetHeroProperty("roomCard");
        this.heroRoomCard.string = heroRoomCard;

    },
    Show_PaiYouKouBei:function () {
        let kouBei = this.PlayerRoomManager.GetPlayerRoomProperty("koubeiList");
        for(let i = kouBei.length; i > 0; i--){
            let kouBeiPath = this.ComTool.StringAddNumSuffix("UIInfo/sp_koubei/nd_koubei/sp_koubei",i,2);
            let kouBeiStringPath = [kouBeiPath,"lb_num"].join("/");
            let kouBeiString = this.GetWndComponent(kouBeiStringPath,cc.Label);
            kouBeiString.string = kouBei[i-1];
        }
    },
    Show_PaiPin:function (haoPingNumber ,chaPingNumber, chuPai, liKai) {
        this.Log(haoPingNumber, chaPingNumber, chuPai, liKai);
        this.sp_paipindiLabel.string = haoPingNumber*100 - chaPingNumber*100 + chuPai - liKai*50;
    },
    Show_HaoPing:function () {
        let kouBei = this.PlayerRoomManager.GetPlayerRoomProperty("koubeiList");
        let haoPingNumber = 0;
        for(let i = 0; i < kouBei.length; i++){
            if(i < 4){
                haoPingNumber += kouBei[i]
            }
        }
        this.sp_haopingdiLabel.string = haoPingNumber;

        return haoPingNumber;
    },

    Show_ChaPing:function () {
        let kouBei = this.PlayerRoomManager.GetPlayerRoomProperty("koubeiList");
        let chaPingNumber = 0;
        for(let i = 4; i < kouBei.length; i++){
            chaPingNumber += kouBei[i]
        }
        // this.chaPing = this.PlayerRoomManager.GetPlayerRoomProperty("evaBad");
        this.sp_chapingdiLabel.string = chaPingNumber;

        return chaPingNumber;
    },
    Show_KuaiSuChuPai:function () {
        let chuPai = this.PlayerRoomManager.GetPlayerRoomProperty("fastOut");
        this.sp_chupaidiLabel.string = chuPai;

        return chuPai;
    },
    Show_ZhongTuLiKai:function () {
        let liKai = this.PlayerRoomManager.GetPlayerRoomProperty("midLeave");
        this.sp_zhongtulikaiLabel.string = liKai;

        return liKai;
    },
    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if(btnName == "btn_buy"){
            let clientConfig = app.Client.GetClientConfig();
            this.FormManager.ShowForm("UIStore");
        }
        else if(btnName == "btn_back"){
	        let that = this;
            this.FormManager.ShowForm("UINewMain")
	            .then(function () {
	                that.CloseForm();
	            })
	            .catch(function(error){
		            that.ErrLog("error:%s", error.stack);
	            })
        }
    },


});