/**
 * 定位服务类
 */
var app = require("app");

var LocationOnStartMgr = app.BaseClass.extend({
    extends: cc.Component,

    properties: {

    },

    Init: function () {
        this.Log("LocationOnStartMgr Init");
        this.JS_Name = "LocationOnStartMgr";
        this.GetLocation_Success = 0;                        //获取位置成功
        this.GetLocation_Error = 1;                        //获取位置失败
        //this.isSendAddress=false;  //是否已经发送位置,3秒内只能发一次
        this.isAllowCallLocation = false;  // 5秒内只能触发一次底层
        // this.callCount = 0;
    },
    //发送请求玩家定位服务
    SendGetLocation: function (isGetError) {
        /*//启动5秒不发送机制
        if(this.isSendAddress==true){
            return;
        }
        this.isSendAddress=true;
        let that=this;
        setTimeout(function(){
            that.isSendAddress = false;
        },5000);*/
        app.NetManager().SendPack("game.CGetLocationEx", { "Address": this.MyAddress, "Latitude": this.MyLatitudeEx, "Longitude": this.MyLongitudeEx, "isGetError": isGetError });
    },
    //获取定位
    OnGetLocationCallBack: function (serverPack) {
        console.log("OnGetLocationCallBack LocationOnStartMgr serverPack:%s", serverPack.toString());
        let isGetError = false;
        this.MyAddress = '';

        // console.log(`>>>>>>>>>>location： 假定模拟高德定位失败！`);
        // serverPack["state"] = this.GetLocation_Error;

        if (serverPack["state"] == this.GetLocation_Error) {
            console.log("定位失败");
            app.Client.OnEvent("EVT_DingWei", { "state": 1 });
            isGetError = true;
            this.MyAddress = "";
            this.MyLatitudeEx = 0;
            this.MyLongitudeEx = 0;
            this.SendGetLocation(isGetError);
            // 高德定位失败, 调用百度定位。
            console.log(`>>>>>>>>>> hall _NativeNotify： baiduMap start location！`);
            //this.GetLocationForBaiduMap();
            return;
        }

        console.log("定位成功");
        app.Client.OnEvent("EVT_DingWei", { "state": 0 });
        this.MyLatitudeEx = serverPack["Latitude"];
        this.MyLongitudeEx = serverPack["Longitude"];
        this.MyAddress = serverPack["City"] + serverPack["District"];
        this.SysLog("OnGetLocationCallBack MyAddRess City:%s", serverPack["City"]);
        this.SysLog("OnGetLocationCallBack MyAddRess District:%s", serverPack["District"]);
        this.SysLog("OnGetLocationCallBack MyAddRess Street:%s", serverPack["Street"]);
        this.SendGetLocation(isGetError);
    },

    //获取定位
    OnGetLocation: function () {
        console.log("OnGetLocation  00");
        if (!cc.sys.isNative) {
            this.SendDefaultLocation();
            return;
        } else {
            // 启动3秒机制
            if (this.isAllowCallLocation == true) {
                console.log("3秒内只能调用一次定位");
                return;
            }

            this.isAllowCallLocation = true;
            let that = this;
            setTimeout(function () {
                that.isAllowCallLocation = false;
            }, 3000);

            // 记录调用次数
            // if (!this.callCount) this.callCount = 0;
            // console.log("OnGetLocation", ++this.callCount);
            // 定位
            console.log("高德:OnGetLocation NativeManager");
            app.NativeManager().CallToNative("GetLocation", []);
        }
    },

    // 默认定位
    SendDefaultLocation: function () {
        var num1 = Math.floor(Math.random() * 10 + 1);
        var num2 = Math.floor(Math.random() * 10 + 1);
        //网页测试随机发送定位上去
        let isGetError = false;
        if (num1 > 9) {
            //    isGetError = true;
        }
        this.MyAddress = "福建省厦门市思明区软件园二期望海路35号";
        this.MyLatitudeEx = 24.48591905381944 + num1;
        this.MyLongitudeEx = 118.1971853298611 - num2;
        this.SendGetLocation(isGetError);
    },

    // ================= 百度地图 ==========================
    //百度地图获取定位
    GetLocationForBaiduMap: function () {
        this.SysLog("GetLocationForBaiduMap  00");
        if (!cc.sys.isNative) {
            this.SendDefaultLocation();
            return;
        } else {
            return;//不使用百度地图
            //手机调用gprs调用上去
            app.NativeManager().CallToNative("GetLocationForBaiduMap", []);
        }
    },

    // 百度地图获取定位结果
    OnGetLocationForBaiduMapCallBack: function (serverPack) {
        this.SysLog("OnGetLocationForBaiduMapCallBack LocationOnStartMgr serverPack:%s", serverPack.toString());
        app.NativeManager().CallToNative("StopLocationForBaiduMap", []);// 停止定位。
        let isGetError = false;
        this.MyAddress = '';
        // :GETLOCATION,eventDataString:{"state":1,"error":"","mapType":"gaodeMap","subGameName":"hall"}
        // {"time":"2020-07-10 17:49:42","locType":62,"locTypeDescription":"Location failed beacuse we can not get any loc information!",// 百度定位失败（手机关闭定位）
        // "Latitude":4.9E-324,"Longitude":4.9E-324,"mapType":"baiduMap","subGameName":"hall"}

        if (serverPack["state"] == this.GetLocation_Error ||
            serverPack["mapType"] == "baiduMap" && typeof (serverPack["Address"]) == "undefined") {// 百度定位失败（手机关闭定位）
            app.Client.OnEvent("EVT_DingWei", { "state": 1 });
            isGetError = true;
            this.MyAddress = "";
            this.MyLatitudeEx = 0;
            this.MyLongitudeEx = 0;
            this.SendGetLocation(isGetError);
            return;
        }

        app.Client.OnEvent("EVT_DingWei", { "state": 0 });
        this.MyLatitudeEx = serverPack["Latitude"];
        this.MyLongitudeEx = serverPack["Longitude"];
        this.MyAddress = serverPack["City"] + serverPack["District"];
        this.SysLog("OnGetLocationForBaiduMapCallBack MyAddRess City:%s", serverPack["City"]);
        this.SysLog("OnGetLocationForBaiduMapCallBack MyAddRess District:%s", serverPack["District"]);
        this.SysLog("OnGetLocationForBaiduMapCallBack MyAddRess Street:%s", serverPack["Street"]);
        this.SendGetLocation(isGetError);
    }

});


var g_LocationOnStartMgr = null;
/**
...
*/
exports.GetModel = function () {
    if (!g_LocationOnStartMgr) {
        g_LocationOnStartMgr = new LocationOnStartMgr();
    }
    return g_LocationOnStartMgr;
}