var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        bg_list:cc.Node,
        tb_list:cc.Node,
    },
    OnCreateInit: function () {
        this.LocalDataManager=app.LocalDataManager();
    },
    //-----------------显示函数------------------
    OnShow: function () {
        let clubBg=cc.sys.localStorage.getItem("ClubNewBg");
        if (clubBg == null || typeof(clubBg) == "undefined") {
            cc.sys.localStorage.setItem("ClubNewBg", "4");
            clubBg = 4;
        }
        let ClubTb=cc.sys.localStorage.getItem("ClubNewTb");
        if (ClubTb == null || typeof(ClubTb) == "undefined") {
            cc.sys.localStorage.setItem("ClubNewTb", "4");
            ClubTb = 4;
        }
        this.bgid=clubBg;
        this.tbid=ClubTb;
        this.InitBg(clubBg);
        this.InitTb(ClubTb);

        //换皮存储给服务端，必须是创建者才可以，unionid>0,myisminister
        let lastData = app.ClubManager().GetLastClubData();
        if(lastData){
            let clubData=app.ClubManager().GetClubDataByClubID(lastData.club_data.id)
            this.unionId=clubData.unionId;  
            this.myisminister = clubData.minister;

            this.node.getChildByName("Toggle").getComponent(cc.Toggle).isChecked=false;
            if(this.unionId>0 && this.myisminister==2){
                //赛事，并且是创建者
                this.node.getChildByName("Toggle").active=true;
            }else{
                this.node.getChildByName("Toggle").active=false;
            }
        }else{
            this.node.getChildByName("Toggle").active=false;
        }
    },
    SetUnionTable:function(skinTable){
        if(this.unionId>0 && this.myisminister==2){
            if(this.node.getChildByName("Toggle").getComponent(cc.Toggle).isChecked==false){
                return;
            }
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.skinTable = skinTable;
            let self = this;
            app.NetManager().SendPack("union.CUnionChangeSkinShowInfo",sendPack,function(event){
                
            },function(error){

            });
        }
    },
    SetUnionBackColor:function(skinBackColor){
        if(this.unionId>0 && this.myisminister==2){
            if(this.node.getChildByName("Toggle").getComponent(cc.Toggle).isChecked==false){
                return;
            }
            let sendPack = app.ClubManager().GetUnionSendPackHead();
            sendPack.skinBackColor = skinBackColor;
            let self = this;
            app.NetManager().SendPack("union.CUnionChangeSkinShowInfo",sendPack,function(event){
                
            },function(error){

            });
        }
    },
    InitBg:function(clubBg){
        for(let i=0;i<this.bg_list.children.length;i++){
            if(i==clubBg){
                this.bg_list.children[i].getChildByName('check').active=true;
            }else{
                this.bg_list.children[i].getChildByName('check').active=false;
            }
        }
    },
    InitTb:function(ClubTb){
        for(let i=0;i<this.tb_list.children.length;i++){
            if(i==ClubTb){
                this.tb_list.children[i].getChildByName('on').active=true;
                this.tb_list.children[i].getChildByName('off').active=false;
            }else{
                this.tb_list.children[i].getChildByName('on').active=false;
                this.tb_list.children[i].getChildByName('off').active=true;
            }
        }
    },
    ChangeBg:function(NowBg){
        let clubBg=cc.sys.localStorage.getItem("ClubNewBg");
        if(NowBg==clubBg){
            return;
        }
        cc.sys.localStorage.setItem("ClubNewBg",NowBg);
        cc.sys.localStorage.setItem("ClubNewCuntom","1"); //玩家有自己设置
        this.InitBg(NowBg);
        // this.FormManager.GetFormComponentByFormName("ui/club/UIClubMain").ChangeBg();
        app.ClubManager().GetClubFormComponent().ChangeBg();
    },
    ChangeTb:function(NowTb){
        let ClubTb=cc.sys.localStorage.getItem("ClubNewTb");
        if(NowTb==ClubTb){
            return;
        }
        cc.sys.localStorage.setItem("ClubNewTb",NowTb);
        cc.sys.localStorage.setItem("ClubNewCuntom","1"); //玩家有自己设置
        this.InitTb(NowTb);
        // this.FormManager.GetFormComponentByFormName("ui/club/UIClubMain").Event_RefreshRoomList();
        app.ClubManager().GetClubFormComponent().Event_RefreshRoomList();
    },
    OnClick:function(btnName, btnNode){
        if('btn_close' == btnName){
            if(this.unionId>0 && this.myisminister==2){
                if(this.node.getChildByName("Toggle").getComponent(cc.Toggle).isChecked==true){
                    let sendPack = app.ClubManager().GetUnionSendPackHead();
                    if(this.bgid>-1 || this.tbid>-1){
                        if(this.bgid>-1){
                            sendPack.skinTable = this.tbid;
                        }
                        if(this.tbid>-1){
                            sendPack.skinBackColor = this.bgid;
                        }
                        let self = this;
                        app.NetManager().SendPack("union.CUnionChangeSkin",sendPack,function(event){
                            
                        },function(error){

                        });
                    }
                }
            }
            this.CloseForm();
        }else if (btnName.startsWith("btn_bg")) {
            let bg=btnName.replace('btn_bg','');
            let bgid=parseInt(bg)-1;
            this.bgid=bgid;
           // this.SetUnionTable(bgid);
            this.ChangeBg(bgid);
        }else if (btnName.startsWith("btn_tb")) {
            let tb=btnName.replace('btn_tb','');
            let tbid=parseInt(tb)-1;
            this.tbid=tbid;
            //this.SetUnionBackColor(tbid);
            this.ChangeTb(tbid);
        }
    },
});