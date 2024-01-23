var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
        btnNodeGroup:cc.Node,
        btnPrefab:cc.Node,
        bg_img:cc.Sprite,
        btn_load:cc.Node,
    },

    OnCreateInit:function(){
        this.FormManager = app.FormManager();
        this.NetManager=app.NetManager();
    },
    OnShow:function(event = ''){
        this.clubDatas = app.ClubManager().GetClubData();
        this.dataInfo = event;
        this.infoCount = 0;
        this.LoadTitleBtn(event);
        this.LoadImg();
    },
    LoadTitleBtn:function(event){
        this.btnNodeGroup.removeAllChildren();
        for(let i = 0; i < event.length; i++){
            let node = cc.instantiate(this.btnPrefab);
            node.active = true;
            node.name = 'btn_' + i;
            node.getChildByName('icon_off').getComponent(cc.Label).string = event[i]["title"];
            node.getChildByName('icon').getChildByName('icon_on').getComponent(cc.Label).string = event[i]["title"];
            this.btnNodeGroup.addChild(node);
        }
        this.ShowTitleBtn();
    },
    LoadImg:function(index = 0){
        let self = this;
        
        if(cc.sys.isNative){
            this.imgUrl ="http://fb.qicaiqh.com:88" + this.dataInfo[index]['propaganda'];
        }else{
            this.imgUrl ="http://tfb.qicaiqh.com:88" + this.dataInfo[index]['propaganda'];
        }
        // let imgUrl = "http://fb.qicaiqh.com/myimg.php?url=" + url;

        cc.loader.load(this.imgUrl,function (err, texture) {
            if(texture instanceof cc.Texture2D){
                var frame = new cc.SpriteFrame(texture);
                self.bg_img.spriteFrame=frame;
            }
            else{
                self.ErrLog("texture not Texture2D");
            }
        });
        if(this.dataInfo[index]['beizhu']){
            this.btn_load.active = true;
        }else{
            this.btn_load.active = false;
        }
    },
    ShowTitleBtn:function(index = 0){
        for(let i=0;i<this.btnNodeGroup.children.length;i++){
            this.btnNodeGroup.children[i].getChildByName('icon').active=false;
        }
        this.btnNodeGroup.getChildByName("btn_"+index).getChildByName('icon').active=true;
        this.LoadImg(index);
    },
    InitGameBtnList: function (serverPack) {
        this.FormManager.ShowForm("UICreatRoom", serverPack);
    },
    OnClick:function(btnName,btnNode){
        if('btn_close' == btnName){
            this.CloseForm();
        }else if('btn_load' == btnName){
            let sceneName = this.dataInfo[this.infoCount]['beizhu'];
            if(sceneName == "UIClubNone"){
                if(this.clubDatas.length==0){
                    this.FormManager.ShowForm("ui/club/UIClubNone");
                }else{
                    // this.FormManager.ShowForm("ui/club/UIClubMain");
                    app.ClubManager().ShowClubFrom();
                }
            }
            else if(sceneName == "UICreatRoom"){
                app.NetManager().SendPack('family.CPlayerGameList', {}, this.InitGameBtnList.bind(this), this.InitGameBtnList.bind(this));
            }else{
                this.FormManager.ShowForm(sceneName);
            }
            this.CloseForm();
        }else if(btnName.startsWith("btn_")){
            let index=btnName.replace('btn_','');
            this.ShowTitleBtn(index);
            this.infoCount = index;
        }
    }
});
