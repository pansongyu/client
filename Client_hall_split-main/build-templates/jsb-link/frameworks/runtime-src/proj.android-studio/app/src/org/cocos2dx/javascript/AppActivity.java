/****************************************************************************
Copyright (c) 2015 Chukong Technologies Inc.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2dx.javascript.MapLocaltion.Location;
import org.cocos2dx.javascript.Voice.AudioManager;
import org.cocos2dx.javascript.Voice.MediaManager;
import org.cocos2dx.javascript.WeChat.Util;
import org.cocos2dx.javascript.WyqyService.UILImageLoader;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.json.JSONException;
import org.json.JSONObject;
import org.xianliao.im.sdk.api.ISGAPI;

import android.annotation.TargetApi;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Handler;
import android.os.Message;
import android.support.multidex.MultiDex;
import android.support.v4.content.FileProvider;
import android.text.TextUtils;
import android.util.Log;
import android.view.WindowManager;
import android.widget.Toast;

import com.android.dingtalk.share.ddsharemodule.DDShareApiFactory;
import com.android.dingtalk.share.ddsharemodule.IDDShareApi;
import com.ixl.talk.xl.opensdk.v2.api.XLAPI;
import com.yangfan.qihang.DDShare.DDShareMgr;
import com.yangfan.qihang.gvapi.GvoiceManager;
import com.yangfan.qihang.gvapi.Utils;
import com.yangfan.qihang.uploadImage.UploadImageManager;
import com.yangfan.qihang.wss.ClientCertificateUtil;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.ImageLoaderConfiguration;
import com.qidalin.hy.dlshare.api.IDLAPI;
import com.qiyukf.unicorn.api.StatusBarNotificationConfig;
import com.qiyukf.unicorn.api.Unicorn;
import com.qiyukf.unicorn.api.YSFOptions;
import com.yangfan.qihang.sgapi.SGEntryMgr;
import com.yangfan.qihang.wxapi.WXEntryActivity;
import com.yangfan.qihang.wxapi.WXPayEntryActivity;
import com.google.android.gms.appindexing.Action;
import com.google.android.gms.appindexing.AppIndex;
import com.google.android.gms.appindexing.Thing;
import com.google.android.gms.common.api.GoogleApiClient;

import com.tencent.gcloud.voice.GCloudVoiceEngine;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.NetworkInterface;
import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;

import android.os.Vibrator;
import android.app.Service;
import com.yangfan.qihang.BaiduMap.LocationService;
import com.baidu.location.BDLocation;
import com.baidu.location.BDAbstractLocationListener;
//import com.fastaccess.permission.base.PermissionHelper;
//import android.location.Location;
//import com.master.permissionhelper.PermissionHelper;

public class AppActivity extends Cocos2dxActivity {

    public static Context applicationContext;
    public static String queryStr = "";
    private Handler mJniHandler;  //jnihelper 的handler
    private static AppActivity g_instance;
    public static IWXAPI api;
    public static final int MY_PERMISSIONS_REQUEST_READ_PHONE_STATE = 0;
    public static final int MY_PERMISSIONS_REQUEST_RECORD_AUDIO = 1;
    public static final int MY_PERMISSIONS_REQUEST_REQUESTCODE = 2;
    public static final int MY_PERMISSIONS_REQUEST_GET_UNKNOWN_APP_SOURCES = 3;
    public static final String TAG = "AppActivity";
    /**
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */
    private GoogleApiClient client;

    /**
     * 钉钉
     * */
    private IDDShareApi iddShareApi ;

    /**
     * 闲聊
     * */
    private ISGAPI isgApi;

    /**
     * 乡聊
     * */
    private XLAPI xlApi;

    /**
     * 多聊
     * */
    public IDLAPI dlapi;

    /**
     * GVoive
     * */
    public static GvoiceManager mManager;
    public static GCloudVoiceEngine mEngine;
    public static String msgStr;
    /**
     * apk文件路径
     * */
    private String apkFilePath = "";
    /**
     * apk名字
     * */
    private String apkName = "";

    /**
     * BaiduMap
     */
    public LocationService locationService = null;
    public Vibrator mVibrator = null;


    public static AppActivity getInstance(){
        return g_instance;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SDKWrapper.getInstance().init(this);
        applicationContext = this;

        //从网页获取分享的app_id
        Util.getDataAsync();

        // 网易七鱼初始化
        Unicorn.init(this, Contants.WYQY_APP_ID, options(), new UILImageLoader());
        // 网易七鱼注册主进程通知消息
        inMainProcess(this);
        ImageLoader.getInstance().init(ImageLoaderConfiguration.createDefault(this));

        api = WXAPIFactory.createWXAPI(this, Contants.WX_APP_ID, true);
        api.registerApp(Contants.WX_APP_ID);
        Utils.logI("当前微信sdk版本：" + api.getWXAppSupportAPI());

        iddShareApi = DDShareApiFactory.createDDShareApi(this, Contants.DD_APP_ID, true);
//        isgApi = SGAPIFactory.createSGAPI(this, Contants.XL_APP_ID);
        //X乡聊
//        xlApi = XLAPIFactory.createDSAPI(this, Contants.XIANGLIAO_APP_ID);
        //默往
        //初始化分享相关
        //分享sdk日志打印
//        MConfigure.debug(true);
//        //配置分享key(请使用开放平台配置的appkey)
//        //appkey:默往开放平台获取
//        MConfigure.init(this.getApplication(), Contants.MOWANG_APP_ID);

        WXEntryActivity.init(this);
        WXPayEntryActivity.init(this);
        org.cocos2dx.javascript.NativeMgr.init(this);
        DDShareMgr.init(this);

        SGEntryMgr.init(this);

        // 百度地图
        locationService = new LocationService(getApplicationContext());
        mVibrator =(Vibrator)getApplicationContext().getSystemService(Service.VIBRATOR_SERVICE);
//        SDKInitializer.initialize(this);
        // SDKInitializer.setCoordType(CoordType.BD09LL);
        /**
         * 初始化GVoice引擎
         */
//        mManager = GvoiceManager.getInstance();
//        if (mManager != null) {
//            mManager.init(this);
//            int ret = mManager.initGvoice(this);
//            if (ret == 0) {
//                msgStr = "GVoice 初始化成功!";
//            } else {
//                msgStr = "GVoice 初始化遇到错误! Error code: " + ret;
//            }
//            Utils.logI(msgStr);
////            Utils.showShortMsg(applicationContext, msgStr);
//
//            /**
//             * 获取引擎
//             */
//            mEngine = mManager.getVoiceEngine();
//        }

        //多聊
        //传入开放平台申请的appid
//        dlapi = DLAPIFactory.createDLAPI(this, Contants.DuoLiao_APP_ID);
        Utils.logI("执行到这了：");
        //保持亮屏
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        g_instance = this;

        Intent i_getvalue = getIntent();
        String action = i_getvalue.getAction();
        if (Intent.ACTION_VIEW.equals(action)) {
            Uri uri = i_getvalue.getData();
            if (uri != null) {
//                String host = uri.getHost();
//                String dataString = i_getvalue.getDataString();
//                String id = uri.getQueryParameter("d");
//                String path = uri.getPath();
//                String path1 = uri.getEncodedPath();
                AppActivity.queryStr = uri.getQuery();

            }
        }
        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        client = new GoogleApiClient.Builder(this).addApi(AppIndex.API).build();


        initHelper();
        handlerIntent(getIntent());

        // init 
        UploadImageManager.getInstance().init(this);
        ClientCertificateUtil.getInstance().init(this);
        Utils.logI("执行结束了：");
    }

    public boolean isWifiProxy() {
        final boolean IS_ICS_OR_LATER = Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH;
        String proxyAddress;
        int proxyPort;
        if (IS_ICS_OR_LATER) {
            proxyAddress = System.getProperty("http.proxyHost");
            String portStr = System.getProperty("http.proxyPort");
            proxyPort = Integer.parseInt((portStr != null ? portStr : "-1"));
            Log.e(TAG, ">>>>>>>>>>>>>>>> isWifiProxy  IS_ICS_OR_LATER");
            Log.e(TAG, ">>>>>>>>>>>>>>>> isWifiProxy IS_ICS_OR_LATER proxyAddress：  " + proxyAddress);
            Log.e(TAG, ">>>>>>>>>>>>>>>> isWifiProxy IS_ICS_OR_LATER proxyPort：  " + proxyPort);
        } else {
            proxyAddress = android.net.Proxy.getHost(this);
            proxyPort = android.net.Proxy.getPort(this);
            Log.e(TAG, ">>>>>>>>>>>>>>>> isWifiProxy  ");
            Log.e(TAG, ">>>>>>>>>>>>>>>> isWifiProxy proxyAddress：  " + proxyAddress);
            Log.e(TAG, ">>>>>>>>>>>>>>>> isWifiProxy proxyPort：  " + proxyPort);
        }
        boolean is = (!TextUtils.isEmpty(proxyAddress)) && (proxyPort != -1);
        Log.e(TAG, ">>>>>>>>>>>>>>>> isWifiProxy result：  " + is);
        return (!TextUtils.isEmpty(proxyAddress)) && (proxyPort != -1);
    }

    /*判断VPN方法*/
    public boolean CheckVpnUsed() {
        //检查网络是否链接
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
        //判断时候有网络
        if (networkInfo != null) {
            try {
                Enumeration<NetworkInterface> niList = NetworkInterface.getNetworkInterfaces();
                if (niList != null) {
                    for (NetworkInterface intf : Collections.list(niList)) {
                        if (!intf.isUp() || intf.getInterfaceAddresses().size() == 0) {
                            continue;
                        }
                        if (
                                "tun0".equals(intf.getName()) || "ppp0".equals(intf.getName())
                        ) {
                            Log.e(TAG, ">>>>>>>>>>>>>>>> isVpnUsed result： VPN_OK ");
                            return true;
                        }
                    }
                    Log.e(TAG, ">>>>>>>>>>>>>>>> isVpnUsed result： VPN_NOT ");
                    return false;
                }
            } catch (Throwable e) {
                Log.e(TAG, ">>>>>>>>>>>>>>>> isVpnUsed 返回网络类型：  "+networkInfo.getTypeName());
                return false;
            }
        }
        Log.e(TAG, ">>>>>>>>>>>>>>>> isVpnUsed result： VPN_NOT2 ");
        return false;
    }

    // 初始化jnihelper
    public void initHelper() {
        mJniHandler = new Handler(new Handler.Callback() {
            @TargetApi(Build.VERSION_CODES.HONEYCOMB)
            @Override
            public boolean handleMessage(Message msg){
                if(msg.what == Contants.MSG_OpenApk)
                {
                    String filePath = msg.getData().getString("filePath");
                    String apkName = msg.getData().getString("apkName");
                    //Log.e("handleMessage", "msg filePath="+filePath);
                    try {
                        downLoad( filePath, apkName);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();

                        Toast.makeText(getContext(), "安装失败!请重新安装!", Toast.LENGTH_LONG).show();
                    }
                }else if(msg.what == Contants.MSG_COPYTEXT){
                    String message = msg.getData().getString("msg");
                    ClipboardManager clipBoard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                    // 将文本内容放到系统剪贴板里。
                    clipBoard.setText(message);

                    try {

                        JSONObject mJsonobjData = new JSONObject();
                        mJsonobjData.put("code", 0);
                        mJsonobjData.put("msg", message);
                        NativeMgr.OnCallBackToJs("copyText", mJsonobjData);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }else if (msg.what == Contants.MSG_GETCLIPBOARDTEXT){
                    ClipboardManager clipBoard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                    // 获取剪贴板的剪贴数据集
                    ClipData clipData = clipBoard.getPrimaryClip();
                    String msgText = "";
                    if (clipData != null && clipData.getItemCount() > 0) {
                        // 从数据集中获取（粘贴）第一条文本数据
                        msgText = clipData.getItemAt(0).getText().toString();
                        System.out.println("getClipboardText: " + msgText);
                    }

                    JSONObject mJsonobjData = new JSONObject();
                    try {
                        mJsonobjData.put("code", 0);
                        mJsonobjData.put("msg", msgText);
                        NativeMgr.OnCallBackToJs("getClipboardText", mJsonobjData);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                return  false;
            }
        });
        org.cocos2dx.javascript.NativeMgr.mJniHandler = mJniHandler;
    }

    public void downLoad(String filePath, String apkName) throws InterruptedException
    {
        //方法2，直接更改文件权限
        Process p;
        int status = -1;
        try {
            p = Runtime.getRuntime().exec("chmod 777 " + filePath+ apkName);
            status = p.waitFor();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        if (status == 0) {
            //Log.e("chmod", "succeed");
            //Toast.makeText(this, "chmod succeed", Toast.LENGTH_LONG).show();
        } else {
            //Log.e("chmod", "failed");
            //Toast.makeText(this, "chmod failed", Toast.LENGTH_LONG).show();
        }

        File file = new File(filePath,apkName);
        Log.e("downLoad", "123456 file.exites()="+file.exists());
        if(file.exists())
        {
            Log.e("downLoad", "123456");
            this.apkFilePath = filePath;
            this.apkName  = apkName;
            checkOreo();
        }
    }

    public String GetQueryStr() {
        return AppActivity.queryStr;
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, getContext());

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        //SDKWrapper.getInstance().onResume();
        MediaManager.getInstance().resume();
        /**
         * 调用GVoice引擎的Resume方法，唤醒引擎
         */
        if (mManager.isEngineInit()) {
            mEngine.Resume();
            Utils.logI("GVoice resume.");
        }

        /**
         * 调用GVoice的Poll方法，驱动引擎获取回调信息
         */
        Utils.poll();
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();
        MediaManager.getInstance().pause();
        // 在onPause()方法终止定位
        /**
         * 调用GVoice引擎的Pause方法，暂停引擎
         */
        if (mManager.isEngineInit()) {
            mEngine.Pause();
            Utils.logI("GVoice pause.");
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();
        Location.getInstance().onDestroy();
        AudioManager.getInstance().release();
        MediaManager.getInstance().release();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case MY_PERMISSIONS_REQUEST_GET_UNKNOWN_APP_SOURCES:
                checkOreo();
                break;
        }
        // 上传图片
        UploadImageManager.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);

        setIntent(intent);
        handlerIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();// ATTENTION: This was auto-generated to implement the App Indexing API.
// See https://g.co/AppIndexing/AndroidStudio for more information.
        AppIndex.AppIndexApi.end(client, getIndexApiAction());
        SDKWrapper.getInstance().onStop();
        // 百度地图
        locationService.unregisterListener(mListener); //注销掉监听
        locationService.stop(); //停止定位服务
        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        client.disconnect();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();// ATTENTION: This was auto-generated to implement the App Indexing API.
// See https://g.co/AppIndexing/AndroidStudio for more information.
        client.connect();
        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        AppIndex.AppIndexApi.start(client, getIndexApiAction());

        // 百度地图 -----------location config ------------
        // locationService = ((LocationApplication) getApplication()).locationService;
        //获取locationservice实例，建议应用中只初始化1个location实例，然后使用，可以参考其他示例的activity，都是通过此种方式获取locationservice实例的
        if (null != locationService) {
            locationService.registerListener(mListener);
            //注册监听
            int type = getIntent().getIntExtra("from", 0);
            if (type == 0) {
                locationService.setLocationOption(locationService.getDefaultLocationClientOption());
            } else if (type == 1) {
                // Log.e(TAG, ">>>>>>>>>>>>>>baidu: locationService.start();");
                //  this.locationServiceStart();
            }
        }
    }

    /**
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */
    public Action getIndexApiAction() {
        Thing object = new Thing.Builder()
                .setName("App Page") // TODO: Define a title for the content shown.
                // TODO: Make sure this auto-generated URL is correct.
                .setUrl(Uri.parse("http://[ENTER-YOUR-URL-HERE]"))
                .build();
        return new Action.Builder(Action.TYPE_VIEW)
                .setObject(object)
                .setActionStatus(Action.STATUS_TYPE_COMPLETED)
                .build();
    }

    //屏幕选装的
    public  void changeOrientationH(boolean val){
        if (val){
            Log.d("切换屏幕","横屏幕");
            this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_REVERSE_LANDSCAPE);
        }else{
            Log.d("切换屏幕","竖屏幕");
            this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        }
    }

    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
    {
        Log.e(TAG, "权限申请回调");
        if (grantResults != null){
            Log.e(TAG, "grantResult="+ Arrays.asList(grantResults).toString()+",length="+grantResults.length);
        }else{
            Log.e(TAG,"grantResult==null");
        }
        if (grantResults != null && grantResults.length == 0){
            return;
        }
        switch (requestCode){
            case MY_PERMISSIONS_REQUEST_READ_PHONE_STATE:
                if (grantResults[0] == PackageManager.PERMISSION_GRANTED)
                {
                    Log.e(TAG, "权限RECORD_AUDIO申请成功");
                }
                else
                {
                    // Permission Denied
                    Log.e(TAG, "权限权限RECORD_AUDIO申请成功申请失败");
                    Toast.makeText(this, "请开启应用获取手机状态权限", Toast.LENGTH_LONG).show();
                }
                break;
            case  MY_PERMISSIONS_REQUEST_RECORD_AUDIO:
                if (grantResults[0] == PackageManager.PERMISSION_GRANTED)
                {
                    Log.e(TAG, "权限RECORD_AUDIO申请成功");
                }
                else
                {
                    // Permission Denied
                    Log.e(TAG, "权限权限RECORD_AUDIO申请成功申请失败");
                    Toast.makeText(this, "请开启应用录音权限", Toast.LENGTH_LONG).show();
                }
                break;
            case  MY_PERMISSIONS_REQUEST_REQUESTCODE:
                if (grantResults[0] == PackageManager.PERMISSION_GRANTED)
                {
                    Log.e(TAG, "权限_REQUESTCODE申请成功");
                }
                else
                {
                    // Permission Denied
                    Log.e(TAG, "权限权限_REQUESTCODE申请成功申请失败");
//                    Toast.makeText(this, "请开启应用定位权限", Toast.LENGTH_LONG).show();
                }
                break;
            case MY_PERMISSIONS_REQUEST_GET_UNKNOWN_APP_SOURCES:
                if (grantResults.length > 0 &&  grantResults[0] == PackageManager.PERMISSION_GRANTED)
                {
                    checkOreo();
                }
                else
                {
                    // Permission Denied
                    Log.e(TAG, "权限权限install apk 申请成功申请失败");
//                    Toast.makeText(this, "请开启应用定位权限", Toast.LENGTH_LONG).show();
                }
                break;
            default:
                Toast.makeText(this, "requestCode="+requestCode, Toast.LENGTH_LONG).show();
                break;
        }
//        if (requestCode == 1)
//        {
//            if (grantResults[0] == PackageManager.PERMISSION_GRANTED)
//            {
//                EMLog.e(TAG, "权限RECORD_AUDIO申请成功");
//            }
//            else
//            {
//                // Permission Denied
//                EMLog.e(TAG, "权限权限RECORD_AUDIO申请成功申请失败");
//            }
//        }
//        else if(requestCode == 0){
//            if (grantResults[0] == PackageManager.PERMISSION_GRANTED)
//            {
//                EMLog.e(TAG, "权限READ_PHONE_STATE申请成功");
//            }
//            else
//            {
//                // Permission Denied
//                EMLog.e(TAG, "权限权限READ_PHONE_STATE申请成功申请失败");
//            }
//        }
    }

    /**
     * 获取钉钉
     * */
    public  IDDShareApi getIddShareApi(){
        return  iddShareApi;
    }

    /**
     * 获取闲聊
     * */
    public  ISGAPI getIsgApi(){
        return  isgApi;
    }

    /**
     * 获取乡聊
     * */
    public  XLAPI getXlApi(){
        return  xlApi;
    }


    private void handlerIntent(Intent intent) {
        if(null == intent || intent.getDataString() == null || intent.getDataString().isEmpty() ) return;
        Toast.makeText(this, "handlerIntent intent="+intent.getDataString(), Toast.LENGTH_LONG).show();
        Log.e(TAG, "handlerIntent intent="+intent.getDataString());
        /**
         *  接收闲聊传入roomId, roomToken
         */
        String roomId = intent.getStringExtra("roomId");
        String openId = intent.getStringExtra("openId");
        String roomToken = intent.getStringExtra("roomToken");
        Log.e(TAG, "roomID="+roomId+",roomToken="+roomToken+", openID="+openId);

        if(roomId == null || roomId.isEmpty() ||openId == null || openId.isEmpty() ||roomToken == null || roomToken.isEmpty()  ){
            return;
        }
        try {
            JSONObject mJsonobjData = new JSONObject();
            mJsonobjData.put("roomID", roomId);
            mJsonobjData.put("roomToken", roomToken);
            mJsonobjData.put("openID", openId);
            NativeMgr.OnCallBackToJs("XLShareYaoQing", mJsonobjData);
        } catch (JSONException e) {
            Log.e(TAG, e.toString());
        }
    }

    /**
     * 检测版本8.0
     */
    public void checkOreo() {

        Log.e(TAG, "checkOreo  000000");
        //判断是否可以直接安装
//        if (android.os.Build.VERSION.SDK_INT >= 26) {
//            boolean canInstall  = getPackageManager().canRequestPackageInstalls();
//            Log.e(TAG, "checkOreo canInstall="+canInstall);
//            //检测是否有权限，没有权限进行申请
//            if (!canInstall){
//                Log.e(TAG, "checkOreo  111111");
//                //引导用户去打开权限
//                Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
//                startActivityForResult(intent, MY_PERMISSIONS_REQUEST_GET_UNKNOWN_APP_SOURCES);
//
////                ActivityCompat.requestPermissions(AppActivity.getInstance(),
////                        new String[]{Manifest.permission.REQUEST_INSTALL_PACKAGES},
////                        MY_PERMISSIONS_REQUEST_GET_UNKNOWN_APP_SOURCES);
//
//            }else{
//                Log.e(TAG, "checkOreo  22222");
//                //安装apk
//                installApk();
//            }
//
////            boolean canInstall  = getPackageManager().canRequestPackageInstalls();
////            if (canInstall) {
////                //rxpermissions请求权限
////                RxPermissions rxPermissions = new RxPermissions(AppActivity.this);
////                rxPermissions.request(Manifest.permission.REQUEST_INSTALL_PACKAGES).subscribe(granted -> {
////                    if (granted) {
////                        //安装apk
////                        installApk();
////                    } else if (shouldShowRequestPermissionRationale(Manifest.permission.REQUEST_INSTALL_PACKAGES)) {
////                        //引导用户去打开权限
////                        Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
////                        startActivityForResult(intent, MY_PERMISSIONS_REQUEST_GET_UNKNOWN_APP_SOURCES);
////                    } else {
////                        Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
////                        startActivityForResult(intent, MY_PERMISSIONS_REQUEST_GET_UNKNOWN_APP_SOURCES);
////                    }
////                });
////            }else{
////                //安装apk
////                installApk();
////            }
//        }else {
//            //安装apk
//            installApk();
//        }
        installApk();
    }

    /**
     * 安装apk
     * */
    public  void installApk(){
        File file = new File(this.apkFilePath, this.apkName);
        Log.e("downLoad", "123456");
        Intent intent = new Intent();
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK| Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
        intent.setAction(android.content.Intent.ACTION_VIEW);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            Log.w(TAG, "版本大于 N ，开始使用 fileProvider 进行安装");
            intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION );
            Uri contentUri = FileProvider.getUriForFile(
                    getContext()
                    , "com.yangfan.qihang.fileprovider"
                    , file);
            intent.setDataAndType(contentUri, "application/vnd.android.package-archive");
        } else {
            Log.w(TAG, "正常进行安装");
            intent.setDataAndType(Uri.fromFile(file), "application/vnd.android.package-archive");
        }

//                intent.setDataAndType(Uri.fromFile(file), "application/vnd.android.package-archive");
        startActivity(intent);
    }

    /**
     * 主进程注册，用于notification通知
     * @param context
     * @return
     */
    public static boolean inMainProcess(Context context) {
        String mainProcessName = context.getApplicationInfo().processName;
        String processName = getProcessName();
        return TextUtils.equals(mainProcessName, processName);
    }

    /**
     * 获取当前进程名
     */
    private static String getProcessName() {
        BufferedReader reader = null;
        try {
            File file = new File("/proc/" + android.os.Process.myPid() + "/" + "cmdline");
            reader = new BufferedReader(new FileReader(file));
            return reader.readLine().trim();
        } catch (IOException e) {
            return null;
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    // 如果返回值为null，则全部使用默认参数。
    private YSFOptions options() {
        YSFOptions options = new YSFOptions();
        options.statusBarNotificationConfig = new StatusBarNotificationConfig();
        return options;
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }
    
    // ============================= 华丽分割线 =============================
    // 百度地图
    /**
     * baiduMap 发起定位请求
     */
    public void locationServiceStart() {
        if (locationService != null) {
            Log.e(TAG, ">>>>>>>>>>>>>>>> location baiduMap 发起定位请求");
            locationService.start(); // 定位SDK
        }else{
            Log.e(TAG, ">>>>>>>>>>>>>>>> location baiduMap 发起定位请求失败 locationService = null");
        }
    }

    /**
     * baiduMap 停止请求定位
     */
    public void locationServiceStop() {
        if (locationService != null) {
            Log.e(TAG, ">>>>>>>>>>>>>>>> location baiduMap locationService.stop();");
            locationService.stop();
        }else{
            Log.e(TAG, ">>>>>>>>>>>>>>>> location baiduMap 发起定位请求失败 locationService = null");
        }
    }

    /**
     * baiduMap 百度地图 定位结果回调，重写onReceiveLocation方法
     */
    private BDAbstractLocationListener mListener = new BDAbstractLocationListener() {
        /**
         * 定位请求回调函数
         * @param location 定位结果
         */
        @Override
        public void onReceiveLocation(BDLocation location) {
            if (null != location) {
                StringBuffer sb = new StringBuffer(256);
                if (location.getLocType() != BDLocation.TypeServerError) {
                    try {
                        int tag = 1;
                        JSONObject mJsonObjData = new JSONObject();
                        /**
                         * 时间也可以使用systemClock.elapsedRealtime()方法 获取的是自从开机以来，每次回调的时间；
                         * location.getTime() 是指服务端出本次结果的时间，如果位置不发生变化，则时间不变
                         */
                        mJsonObjData.put("time", location.getTime());
                        mJsonObjData.put("locType", location.getLocType());
                        mJsonObjData.put("locTypeDescription", location.getLocTypeDescription()); // *****对应的定位类型说明*****
                        mJsonObjData.put("Latitude", location.getLatitude());// 纬度
                        mJsonObjData.put("Longitude", location.getLongitude());// 经度
                        mJsonObjData.put("Country", location.getCountry());// 国家
                        mJsonObjData.put("Address", location.getAddrStr());// 地址信息
                        mJsonObjData.put("Street", location.getStreet());// 街道
                        mJsonObjData.put("District", location.getStreet());// 区
                        mJsonObjData.put("City", location.getCity());// 城市
                        mJsonObjData.put("Town", location.getTown());// 获取镇信息
                        mJsonObjData.put("mapType", "baiduMap");// 地图类型
                        mJsonObjData.put("locationWhere", location.getLocationWhere());   // 获得当前定位点是否是国内，它的取值及含义如下：
                        // BDLocation.LOCATION_WHERE_IN_CN： // 当前定位点在国内；
                        // BDLocation.LOCATION_WHERE_OUT_CN：// 当前定位点在海外；
                        // public static final int LOCATION_WHERE_IN_CN = 1;
                        // public static final int LOCATION_WHERE_OUT_CN = 0;

    
                        NativeMgr.OnCallBackToJs("OnGetLocationForBaiduMapCallBack", mJsonObjData);
                    } catch (JSONException e) {
                        Log.e(TAG, e.toString());
                    }
                } else {
                    try {
                        JSONObject mJsonobjData = new JSONObject();
                        mJsonobjData.put("state", Contants.GetLocation_Error);
                        mJsonobjData.put("mapType", "baiduMap");
                        mJsonobjData.put("error", sb.toString());

                        NativeMgr.OnCallBackToJs("OnGetLocationForBaiduMapCallBack", mJsonobjData);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }                
            } else {
                try {
                    JSONObject mJsonobjData = new JSONObject();
                    mJsonobjData.put("state", Contants.GetLocation_Error);
                    mJsonobjData.put("error", "定位失败，loc is null");
                    mJsonobjData.put("mapType", "baiduMap");
                    NativeMgr.OnCallBackToJs("OnGetLocationForBaiduMapCallBack", mJsonobjData);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
    };






}
