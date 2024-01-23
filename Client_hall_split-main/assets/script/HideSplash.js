
var app = require('app');

cc.Class({
    extends: cc.Component,

    // onLoad () {},

    start() {
        console.log("-----大厅 HideSplash start-----0");
        if (app.ComTool().IsAndroid()) {
            console.log("-----大厅 HideSplash start-----1");
            //app.NativeManager().CallToNative("HideNativeSplash", []);
            // var timeoutID = setTimeout(function () {
            // app.NativeManager().CallToNative("HideNativeSplash", []);
            // console.log("-----大厅 HideSplash start-----2");
            // clearTimeout(timeoutID);
            // }, 1000);
        }
    },

    // update (dt) {},

});
