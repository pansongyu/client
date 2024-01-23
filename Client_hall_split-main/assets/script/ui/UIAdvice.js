/*
 UIYinSiZhenCe 登陆界面
 */
var app = require("app");
cc.Class({
    extends: require("BaseForm"),

    properties: {
    },
    OnCreateInit: function () {
        this.NetManager = app.NetManager();
        this.AdviceUrl="http://qh.qinghuaimajiang.com/proposal/";
    },

    OnShow:function () {
        this.playerID = app.HeroManager().GetHeroProperty("pid"); 
    },
    click_btn_tijiao:function(){
        let toggleGroup=this.node.getChildByName("ToggleContainer");
        let stype=0;
        if(toggleGroup.getChildByName("toggle1").getComponent(cc.Toggle).isChecked==true){
            stype=1;
        }else if(toggleGroup.getChildByName("toggle2").getComponent(cc.Toggle).isChecked==true){
            stype=2;
        }else if(toggleGroup.getChildByName("toggle3").getComponent(cc.Toggle).isChecked==true){
            stype=3;
        }
        let proposal=this.node.getChildByName("EditBoxContent").getComponent(cc.EditBox).string;
        let phone=this.node.getChildByName("EditBoxPhone").getComponent(cc.EditBox).string;
        if(proposal==""){
            this.ShowSysMsg("请点击输入框填写您宝贵的意见或建议");
            return;
        }

        //找后台验证实名信息是否合法
        var date = new Date();
        let year=date.getFullYear();
        let month=date.getMonth()+1;
        let day=date.getDate();
        if(month<10){
            month="0"+month;
        }
        if(day<10){
            day="0"+day;
        }

        let signString = this.playerID.toString()+stype.toString()+"wanzi"+year.toString()+month.toString()+day.toString();
        let sign = app.MD5.hex_md5(signString);
        this.SendHttpRequest(this.AdviceUrl, "?stype="+stype+"&proposal="+encodeURI(proposal)+"&playerid="+this.playerID+"&phone="+phone+"&sign="+sign, "GET",{});



    },
    OnReceiveHttpPack:function(serverUrl, httpResText){
        try{
            let serverPack = JSON.parse(httpResText);
            if(serverUrl==this.AdviceUrl){
               if(serverPack.code==200){
                  //认证成功
                  this.ShowSysMsg("保存成功，非常感觉您的意见建议");
                  this.CloseForm();
               }else if(serverPack.code==300){
                   this.ShowSysMsg("保存失败!请稍后重试");
                   return;
               }else if(serverPack.code==301){
                   this.ShowSysMsg("玩家id，状态，投诉内容缺一不可！");
                   return;
               }else if(serverPack.code==302){
                   this.ShowSysMsg("签名错误！");
                   return;
               }
            }
        }
        catch (error){
            
        }
    },
    OnConnectHttpFail:function(serverUrl, readyState, status){
        
    },
    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if(btnName=="btn_tijiao"){
            this.click_btn_tijiao();
        }else if(btnName=="btn_close"){
            this.CloseForm();
        }
    },
});
