
var app = require("app");

cc.Class({
    extends: require("BaseForm"),

    properties: {
        oldPhoneEditBox:cc.EditBox,
        newPhoneEditBox:cc.EditBox,
        codeEditBox:cc.EditBox,
        btnGetCode:cc.Node,
        btnSure:cc.Node,
        btnSure1:cc.Node,
        lb_time:cc.Node,
    },

    //初始化
    OnCreateInit:function(){
        this.RegEvent("CodeError", this.Event_CodeError);
    },
    Event_CodeError:function(event){
        let codeInfo = event;
        if(codeInfo["Code"] == 5120){
            this.ShowSysMsg("手机已被绑定");
            return;
        }else if(codeInfo["Code"] == 5116){
            this.ShowSysMsg("手机号码错误");
            return;
        }else if(codeInfo["Code"] == 5117){
            this.ShowSysMsg("原手机号码错误");
            return;
        }else if(codeInfo["Code"] == 5118){
            this.ShowSysMsg("验证码错误");
            return;
        }else if(codeInfo["Code"] == 5119){
            this.ShowSysMsg("不存在的手机号码");
            return;
        }
    },
    //---------显示函数--------------------
    OnShow:function () {
        this.phoneOldNo = 0;
        this.phoneNo = 0;
        this.oldPhoneEditBox.string = "";
        this.newPhoneEditBox.string = "";
        this.codeEditBox.string = "";
        this.mustBangDing=false;
        //检验是否绑定手机
        let self = this;
        app.NetManager().SendPack("game.CPlayerCheckPhone", {}, function(serverPack){
            if (serverPack == "0") {
                self.oldPhoneEditBox.node.parent.active = false;
                self.btnSure.active = true;
                self.btnSure1.active = false;
            }else{
                self.oldPhoneEditBox.node.parent.active = true;
                self.btnSure.active = false;
                self.btnSure1.active = true;
            }
        }, function(error){
            console.error(error);
        });
        app.NetManager().SendPack("game.CPlayerForcePhone", {}, function(serverPack){
            self.mustBangDing=true;
        }, function(error){
        });
    },

    //---------点击函数---------------------
    OnClick:function(btnName, btnNode){
        if(btnName == "btnClose"){
            if(this.mustBangDing==true){
                this.ShowSysMsg('您是平台合作伙伴，请绑定手机！');
                this.mustBangDing=false;
                return;
            }
            this.CloseForm();
        }
        else if(btnName == "btnGetCode"){
            this.click_btn_yanzhengma();
        }
        else if(btnName == "btnSure"){
            this.click_phone_set();
        }
        else if(btnName == "btnSure1"){
            this.click_phone_reset();
        }
    },
    checkPhone:function(phone){
        if(!(/^1[3456789]\d{9}$/.test(phone))){ 
            //不是国内
        }else{
            return 1;
        }
        if(!(/^09\d{8}$/.test(phone))){ 
            //不是台湾
        }else{
            return 2;
        }
        if(!(/^00886\d{9}$/.test(phone))){ 
            //不是台湾
        }else{
            return 3;
        }
        return false;
    },
   
    click_btn_yanzhengma:function(){
        let phone = this.newPhoneEditBox.string;
        if(!phone){
            this.ShowSysMsg('请填写手机号码');
            return;
        }
        let checkPhone=this.checkPhone(phone);
        if(checkPhone==false){
            this.ShowSysMsg('电话号码有误');
            return;
        }
        let sms_temple="SMS_154085055";
        if(checkPhone==2){
            //台湾手机
            sms_temple="SMS_194050862";
            //00886
            phone="00886"+phone.substr(1);
        }
        if(checkPhone==3){
            //台湾手机
            sms_temple="SMS_194050862";
        }
        this.yanzhengUrl="http://code.qicaiqh.com/SendCode";

        this.SendHttpRequest(this.yanzhengUrl,"?mobile="+phone+"&sms_temple="+sms_temple,"GET",{});

    },
   
    click_phone_set:function(){
        let phone = this.newPhoneEditBox.string;
        if(!phone){
            this.ShowSysMsg('请填写手机号码');
            return;
        }
        this.phoneNo=phone;
        if(this.checkPhone(phone)==false){
            this.ShowSysMsg('电话号码有误');
            return;
        }
        let code = this.codeEditBox.string;
        if(!code){
            this.ShowSysMsg('请填写验证码');
            return;
        }
        this.checkCodeUrl="http://code.qicaiqh.com/CheckCode";
        this.SendHttpRequest(this.checkCodeUrl,"?mobile="+phone+"&code="+code,"GET",{});
    },

    click_phone_reset:function(){
        let phoneOld = this.oldPhoneEditBox.string;
        if(!phoneOld){
            this.ShowSysMsg('请填写旧手机号码');
            return;
        }
        this.phoneOldNo = phoneOld;
        if(this.checkPhone(phoneOld)==false){
            this.ShowSysMsg('旧电话号码有误');
            return;
        }

        let phone = this.newPhoneEditBox.string;
        if(!phone){
            this.ShowSysMsg('请填写新手机号码');
            return;
        }
        this.phoneNo = phone;
        if(this.checkPhone(phone)==false){
            this.ShowSysMsg('新电话号码有误');
            return;
        }
        let code = this.codeEditBox.string;
        if(!code){
            this.ShowSysMsg('请填写验证码');
            return;
        }
        this.checkCodeUrl="http://code.qicaiqh.com/CheckCode";
        this.SendHttpRequest(this.checkCodeUrl,"?mobile="+phone+"&code="+code,"GET",{});
    },

    SendHttpRequest:function(serverUrl, argString, requestType, sendPack){
        app.NetRequest().SendHttpRequest(serverUrl, argString, requestType, sendPack, 2000, 
            this.OnReceiveHttpPack.bind(this), 
            this.OnConnectHttpFail.bind(this),
            null,
            this.OnConnectHttpFail.bind(this),
		);
        // var url = [serverUrl, argString].join("")

        // var dataStr = JSON.stringify(sendPack);

        // //每次都实例化一个，否则会引起请求结束，实例被释放了
        // var httpRequest = new XMLHttpRequest();

        // httpRequest.timeout = 2000;


        // httpRequest.open(requestType, url, true);
        // //服务器json解码
        // //httpRequest.setRequestHeader("Content-Type", "application/json");
        // var that = this;
        // httpRequest.onerror = function(){
        //     that.ErrLog("httpRequest.error:%s", url);
        //     that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
        // };
        // httpRequest.ontimeout = function(){
            
        // };
        // httpRequest.onreadystatechange = function(){
        //     //执行成功
        //     if (httpRequest.status == 200){
        //         if(httpRequest.readyState == 4){
        //             that.OnReceiveHttpPack(serverUrl, httpRequest.responseText);
        //         }
        //     }
        //     else{
        //         that.OnConnectHttpFail(serverUrl, httpRequest.readyState, httpRequest.status);
        //         that.ErrLog("onreadystatechange(%s,%s)", httpRequest.readyState, httpRequest.status);
        //     }
        // };
        // httpRequest.send(dataStr);

    },
    ShowYanZhengMaTime:function(){
        let lb_time = this.lb_time.getComponent(cc.Label);
        this.lb_times = this.lb_times-1;
        if(this.lb_times<=0){
            this.unschedule(this.ShowYanZhengMaTime);
            lb_time.string="";
            return;
        }
        lb_time.string=this.lb_times+"秒";
        this.lb_time.active = true;
    },
    OnReceiveHttpPack:function(serverUrl, httpResText){
        try{
            let serverPack = JSON.parse(httpResText);
            if(serverPack["code"] == 0){
                if(this.yanzhengUrl==serverUrl){
                    // let btn_yanzhengma=this.btnGetCode.getComponent(cc.Button);
                    // btn_yanzhengma.interactable = 0;
                    // btn_yanzhengma.enableAutoGrayEffect = 1;
                    this.btnGetCode.active = false;
                    this.lb_times=60;
                    this.schedule(this.ShowYanZhengMaTime,1);
                    this.scheduleOnce(function(){
                        // btn_yanzhengma.interactable = 1;
                        // btn_yanzhengma.enableAutoGrayEffect = 0;
                        this.btnGetCode.active = true;
                        this.lb_times=0;
                        this.lb_time.active = false;
                    },60);
                }else if(this.checkCodeUrl==serverUrl){
                    let that=this;
                    //提交手机号码给服务端
                    app.NetManager().SendPack("game.CPlayerPhone",{"oldPhone":this.phoneOldNo,"phone":this.phoneNo},function(success){
                        if (that.phoneOldNo == 0) {
                            that.ShowSysMsg('第一次成功绑定手机号码获得10个钻石');
                        }else{
                            that.ShowSysMsg('重新绑定手机号码成功');
                        }
                        that.mustBangDing=false;
                        that.btnGetCode.active = true;
                        that.lb_times=0;
                        that.unschedule(this.ShowYanZhengMaTime);
                        that.lb_time.string = "";
                        that.lb_time.active = false;
                        that.CloseForm();
                    },function(error){
                        // that.ShowSysMsg('绑定手机失败');
                    });
                    
                }
            }else{
                this.ShowSysMsg(serverPack.msg);
            }
        }
        catch (error){
            
        }
    },
    OnConnectHttpFail:function(serverUrl, readyState, status){
        
    },
});
