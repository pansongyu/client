/**
 * 定位服务类
 */
var app = require("nn_app");

var nn_LocationOnStartMgr = app.BaseClass.extend({
    extends: cc.Component,

    properties: {

    },

    Init:function(){
        this.Log(app.subGameName + "_LocationOnStartMgr Init");
        this.JS_Name = app["subGameName"] + "_LocationOnStartMgr";
        this.GetLocation_Success      = 0;                        //获取位置成功
        this.GetLocation_Error        = 1;                        //获取位置失败
        this.isSendAddress=false;  //是否已经发送位置,3秒内只能发一次
    },
    //发送请求玩家定位服务
    SendGetLocation:function(isGetError){
        //启动5秒不发送机制
        if(this.isSendAddress==true){
            return;
        }
        this.isSendAddress=true;
        let that=this;
        setTimeout(function(){
            that.isSendAddress = false;
        },5000);
        app[app.subGameName + "_NetManager"]().SendPack("game.CGetLocationEx", {"Address":this.MyAddress,"Latitude":this.MyLatitudeEx, "Longitude":this.MyLongitudeEx,"isGetError":isGetError});
    },
    //获取定位
    OnGetLocationCallBack:function(serverPack){
        let isGetError = false;
        this.MyAddress = '';
        if(serverPack["state"] == this.GetLocation_Error){
            isGetError = true;
            this.MyAddress="";
            this.MyLatitudeEx = 0;
            this.MyLongitudeEx = 0;
            this.SendGetLocation(isGetError);
            // 高德定位失败, 调用百度定位。
            console.log(`>>>>>>>>>>_NativeNotify： baiduMap start location！`);
            this.GetLocationForBaiduMap();
            return;
        }
        this.MyLatitudeEx = serverPack["Latitude"];
        this.MyLongitudeEx = serverPack["Longitude"];
        this.MyAddress =serverPack["City"]+serverPack["District"]+serverPack["Street"];
        this.SendGetLocation(isGetError);
    },
    
    //获取定位
    OnGetLocation:function(){
        if(!cc.sys.isNative){
            this.SendDefaultLocation();
            return;
        }else{
            //手机调用gprs调用上去
            app[app.subGameName + "_NativeManager"]().CallToNative("GetLocation", []);
        }
    },

    // 默认定位
    SendDefaultLocation:function(){
        var num1=Math.floor(Math.random()*10+1);
        var num2=Math.floor(Math.random()*10+1);
        //网页测试随机发送定位上去
        let isGetError = false;
        if(num1>9){
        //    isGetError = true;
        }
        this.MyAddress="福建省厦门市思明区软件园二期望海路35号";
        this.MyLatitudeEx = 24.48591905381944+num1;
        this.MyLongitudeEx = 118.1971853298611-num2;
        this.SendGetLocation(isGetError);
    },

    // ================= 百度地图 ==========================
    //百度地图获取定位
    GetLocationForBaiduMap:function(){
        if(!cc.sys.isNative){
            this.SendDefaultLocation();
            return;
        }else{
            //手机调用gprs调用上去
            app[app.subGameName + "_NativeManager"]().CallToNative("GetLocationForBaiduMap", []);
        }
    },

    // 百度地图获取定位结果
    OnGetLocationForBaiduMapCallBack:function(serverPack){
        app[app.subGameName + "_NativeManager"]().CallToNative("StopLocationForBaiduMap", []); // 停止定位。

        let isGetError = false;
        this.MyAddress = '';

        if(serverPack["state"] == this.GetLocation_Error){
            isGetError = true;
            this.MyAddress="";
            this.MyLatitudeEx = 0;
            this.MyLongitudeEx = 0;
            this.SendGetLocation(isGetError);
            return;
        }
        this.MyLatitudeEx = serverPack["Latitude"];
        this.MyLongitudeEx = serverPack["Longitude"];
        this.MyAddress =serverPack["City"]+serverPack["District"]+serverPack["Street"];
        this.SendGetLocation(isGetError);
    },

});


var g_nn_LocationOnStartMgr = null;
  /**
  ...
  */
exports.GetModel = function(){
    if(!g_nn_LocationOnStartMgr){
        g_nn_LocationOnStartMgr = new nn_LocationOnStartMgr();
    }
    return g_nn_LocationOnStartMgr;
}