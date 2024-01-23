/*
    UIMessage 模态消息界面
*/

var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        touxiang:cc.Node,
        erweima:cc.Node,
    },

    //初始化
    OnCreateInit:function(){
        this.SDKManager = app.SDKManager();
        this.WeChatHeadImage = this.touxiang.getChildByName('head_img').getComponent("WeChatHeadImage");
       
    },
    OnShow:function(){
        let heroName = app.HeroManager().GetHeroProperty("name");
        let heroID = app.HeroManager().GetHeroProperty("pid"); 
        let cityId=app.HeroManager().GetHeroProperty("cityId");
        let weChatAppShareUrl = app.Client.GetClientConfigProperty("WeChatAppShareUrl");  


        let shareUrl=weChatAppShareUrl+heroID+"&cityid="+cityId;;
        let imgUrl = "http://fb.qicaiqh.com/makeQRcode.php?url=" + shareUrl;
        let that = this;

        cc.loader.load({url:imgUrl,type: 'png'},function (err, texture) {
                if(texture instanceof cc.Texture2D){
                    var frame = new cc.SpriteFrame(texture);
                    that.erweima.getComponent(cc.Sprite).spriteFrame=frame;
                }
                else{
                    that.ErrLog("texture not Texture2D");
                }
        });

        this.touxiang.getChildByName('lb_name').getComponent(cc.Label).string = heroName;
        this.WeChatHeadImage.OnLoad();
        this.WeChatHeadImage.ShowHeroHead(heroID);
        this.scheduleOnce(this.ShareScreen,1);
    },
    ShareScreen:function(){
        this.SDKManager.ShareScreen('1');
        this.scheduleOnce(this.CloseForm,3.5);
    },
});
