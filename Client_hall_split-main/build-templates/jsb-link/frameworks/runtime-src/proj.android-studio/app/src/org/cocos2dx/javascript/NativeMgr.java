package org.cocos2dx.javascript;

import android.annotation.TargetApi;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Resources;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;


//import com.google.android.gms.appindexing.Action;
////import com.google.android.gms.appindexing.AppIndex;
//import com.google.android.gms.appindexing.Thing;
////import com.google.android.gms.common.api.GoogleApiClient;


import com.yangfan.qihang.DDShare.DDShareMgr;
import com.yangfan.qihang.DLShare.DLShareMgr;
import com.yangfan.qihang.gvapi.GvoiceManager;
import com.yangfan.qihang.mwapi.MWEntryMgr;
import com.yangfan.qihang.sgapi.SGEntryMgr;
import com.yangfan.qihang.uploadImage.UploadImageManager;
import com.yangfan.qihang.wxapi.WXEntryActivity;
import com.yangfan.qihang.xlapi.XLEntryMgr;

import org.cocos2dx.javascript.Battery.BatteryReceiver;
import org.cocos2dx.javascript.DownLoad.DownloadMgr;
import org.cocos2dx.javascript.MapLocaltion.Location;
import org.cocos2dx.javascript.Voice.AudioManager;
import org.cocos2dx.javascript.Voice.MediaManager;
import org.cocos2dx.javascript.WeChat.SendWXSDKManager;
import org.cocos2dx.javascript.WyqyService.WyqyUitl;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import android.content.Context;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.ViewConfiguration;
import android.view.WindowManager;

import java.lang.reflect.Method;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Created by guoliangxuan on 2017/3/24.
 */

public class NativeMgr /*extends AppActivity*/ {
    public static AppActivity app = null;
    public static Handler mJniHandler;
    public static final String TAG = "NativeMgr";

    private  static String m_subGameName = "";

    /**
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */
    //private GoogleApiClient client;

    public static void init(AppActivity app) {
        org.cocos2dx.javascript.NativeMgr.app = app;
    }

    public  static void setSubGameName(String  subGameName){
        m_subGameName = subGameName;
    }

    public static String getSubGameName(){
        return  m_subGameName;
    }

    //登录入口
    public static void OnWeChatLogin(String subGameName) {
        SendWXSDKManager.OnJSToAndroidLogin();
        Intent intent = new Intent(Cocos2dxActivity.getContext(), WXEntryActivity.class);
        intent.putExtra(Contants.WX_Login, Contants.WX_Login);
        NativeMgr.setSubGameName(subGameName);
        Log.d("登录 ：", "OnWeChatLogin: " + subGameName);
        if (subGameName.equals("hall")){
            Log.d("登录 ：", "走这里: " + subGameName);
            WXEntryActivity.Login();
        }else{
            Cocos2dxActivity.getContext().startActivity(intent);
        }

    }

    //分享入口
    public static void OnWeChatShare(String title, String description, String urlStr, String flag, String subGameName) {
//        SendWXSDKManager.OnJSToAndroidShare(title, description, urlStr, flag);
        Intent intent = new Intent(Cocos2dxActivity.getContext(), WXEntryActivity.class);
        intent.putExtra(Contants.WX_ShareHttp, Contants.WX_ShareHttp);
        intent.putExtra(Contants.WX_ShareTitle, title);
        intent.putExtra(Contants.WX_ShareDescription, description);
        intent.putExtra(Contants.WX_ShareURL, urlStr);
        intent.putExtra(Contants.WX_ShareFlag, Integer.parseInt(flag));
        NativeMgr.setSubGameName(subGameName);
        Cocos2dxActivity.getContext().startActivity(intent);
    }

    public static void OnWeChatShareImage(String imagePath, String flag, String subGameName) {
        //SendWXSDKManager.OnJSToAndroidShareImage(imagePath, flag);
        Intent intent = new Intent(Cocos2dxActivity.getContext(), WXEntryActivity.class);
        intent.putExtra(Contants.WX_ShareImage, Contants.WX_ShareImage);
        intent.putExtra(Contants.WX_ShareImagePath, imagePath);
        intent.putExtra(Contants.WX_ShareFlag, Integer.parseInt(flag));
        NativeMgr.setSubGameName(subGameName);
        Cocos2dxActivity.getContext().startActivity(intent);
    }

    public static void OnWeChatShareText(String test, String flag, String subGameName) {
        Intent intent = new Intent(Cocos2dxActivity.getContext(), WXEntryActivity.class);
        intent.putExtra(Contants.WX_ShareText, Contants.WX_ShareText);
        intent.putExtra(Contants.WX_ShareFlag, Integer.parseInt(flag));
        intent.putExtra(Contants.WX_ShareDescription, test);
        NativeMgr.setSubGameName(subGameName);
        Cocos2dxActivity.getContext().startActivity(intent);
    }

    //支付入口
    public static void OnWeChatPay(String jsonData, String subGameName) {
        //WXPayManager.OnJSToAndroidWeChatPay(jsonData);
        Intent intent = new Intent(Cocos2dxActivity.getContext(), WXEntryActivity.class);
        intent.putExtra(Contants.WX_pay, Contants.WX_pay);
        intent.putExtra(Contants.WX_payData, jsonData);
        NativeMgr.setSubGameName(subGameName);
        Cocos2dxActivity.getContext().startActivity(intent);
    }

    public static boolean CheckVpnUsed(String subGameName) {
        NativeMgr.setSubGameName(subGameName);
        return AppActivity.getInstance().CheckVpnUsed();
//        ClientCertificateTrustedUtil.getInstance().onRequestNet();
    }

    //获取网页参数入口
    public static String GetQuery(String subGameName) {
        NativeMgr.setSubGameName(subGameName);
        String query = "";
        if(null != app)
            query = app.GetQueryStr();
        if(null == query || query.isEmpty())
            query = "";
        return query;
    }

    /**
     2  * 获取版本号
     3  * @return 当前应用的版本号
     4  */
    public static String getVersion(String subGameName) {
        NativeMgr.setSubGameName(subGameName);
        try {
            PackageManager manager = Cocos2dxActivity.getContext().getPackageManager();
            PackageInfo info = manager.getPackageInfo(Cocos2dxActivity.getContext().getPackageName(), 0);
            String version = info.versionName;
            Log.e("getVersion", "version="+version);
            return version;
        } catch (Exception e) {
            e.printStackTrace();
            return "0.0.0";
        }
     }

   /*
    * 从网络下载文件  filename 为deleteString时去除
    * */
    public static void downLoadFile(final String urls, final String fileName, final String savePath, final  String downloadType, String subGameName) throws IOException {
        Log.e("downLoadFile", "url=" + urls + ",filename=" + fileName + ",savePath=" + savePath);
        NativeMgr.setSubGameName(subGameName);
        if(fileName.equals("deleteString")){
            DownloadMgr.downLoadFile(urls, "", savePath, downloadType);
        }else{
            DownloadMgr.downLoadFile(urls, fileName, savePath, downloadType);
        }
    }

    /*
    * 异步回调js
    * */
    public  static  void OnCallBackToJs(String callType,  JSONObject mJsonobjData){
        try {
            mJsonobjData.put("subGameName", getSubGameName());

            String data = mJsonobjData.toString();
            Log.e("OnCallBackToJs", "callType="+callType+",data="+data);
            final String callData = String.format(getSubGameName()+"_NativeNotify.OnNativeNotify('%s','%s')",callType, data);
            //一定要在GL线程中执行
            app.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString(callData);
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
            Log.e("OnCallBackToJs", "errror:callType="+callType+",errMsg="+e.getMessage());
        }

    }

    /**
     * 从网络Url中下载文件
     *
     * @param urls
     * @param fileName
     * @param savePath
     * @throws IOException
     */
    public static void downLoadFromUrl(final String urls, final String fileName, final String savePath, String subGameName) throws IOException {
        Log.e("downLoadFromUrl", "url=" + urls + ",filename=" + fileName + ",savePath=" + savePath);
        NativeMgr.setSubGameName(subGameName);
        DownloadMgr.downLoadFromUrl(urls, fileName, savePath);
    }




//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//
//        // ATTENTION: This was auto-generated to implement the App Indexing API.
//        // See https://g.co/AppIndexing/AndroidStudio for more information.
//        client = new GoogleApiClient.Builder(this).addApi(AppIndex.API).build();
//    }

//    /**
//     * ATTENTION: This was auto-generated to implement the App Indexing API.
//     * See https://g.co/AppIndexing/AndroidStudio for more information.
//     */
//    public Action getIndexApiAction() {
//        Thing object = new Thing.Builder()
//                .setName("NativeMgr Page") // TODO: Define a title for the content shown.
//                // TODO: Make sure this auto-generated URL is correct.
//                .setUrl(Uri.parse("http://[ENTER-YOUR-URL-HERE]"))
//                .build();
//        return new Action.Builder(Action.TYPE_VIEW)
//                .setObject(object)
//                .setActionStatus(Action.STATUS_TYPE_COMPLETED)
//                .build();
//    }

//    @Override
//    public void onStart() {
//        super.onStart();
//
//        // ATTENTION: This was auto-generated to implement the App Indexing API.
//        // See https://g.co/AppIndexing/AndroidStudio for more information.
//        client.connect();
//        AppIndex.AppIndexApi.start(client, getIndexApiAction());
//    }

//    @Override
//    public void onStop() {
//        super.onStop();
//
//        // ATTENTION: This was auto-generated to implement the App Indexing API.
//        // See https://g.co/AppIndexing/AndroidStudio for more information.
//        AppIndex.AppIndexApi.end(client, getIndexApiAction());
//        client.disconnect();
//    }
    //开始录音
    public  static  void startRecord(String fileName, String subGameName){
        NativeMgr.setSubGameName(subGameName);
        AudioManager.getInstance().prepareAudio(fileName);
    }

    //停止录音
    public static void stopRecord(String subGameName){
        NativeMgr.setSubGameName(subGameName);
        AudioManager.getInstance().release();
    }

    //播放录音
    public  static  void playerRecord(String fileName, String subGameName) {
        NativeMgr.setSubGameName(subGameName);
        MediaManager.getInstance().playSound(fileName);
    }

    //停止播放录音
    public  static  void stopPlayerRecord(String subGameName) {
        NativeMgr.setSubGameName(subGameName);
        MediaManager.getInstance().stop();
    }

    //继续播放
    public static  void resumePlayerRecord(String subGameName){
        NativeMgr.setSubGameName(subGameName);
        MediaManager.getInstance().resume();
    }

    //暂停播放
    public static  void pausePlayerRecord(String subGameName){
        NativeMgr.setSubGameName(subGameName);
        MediaManager.getInstance().pause();
    }
    //获取当前经纬度
    public  static  void GetLocation(String subGameName){
        Log.e("GetLocation","startLocation");
        NativeMgr.setSubGameName(subGameName);
        Location.getInstance().startLocation();
        Location.getInstance().clearGetLocationThredCount();
//        GetLocationForBaiduMap(subGameName);
//        GetLocationForGPS(subGameName);
    }
    //根据经纬度获取距离
    public  static  float GetDistance(String data, String subGameName){
        Log.e("GetDistance","data="+data);
        NativeMgr.setSubGameName(subGameName);
        double startlatitude = 0.0D, startlongitude = 0.0D, endlatitude = 0.0D, endlongitude = 0.0D;
        try {
            JSONObject jb = new JSONObject(data);
            Log.e("GetDistance","jb="+jb.toString());
            startlatitude = jb.getDouble("startlatitude");
            startlongitude = jb.getDouble("startlongitude");
            endlatitude = jb.getDouble("endlatitude");
            endlongitude = jb.getDouble("endlongitude");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  Location.getInstance().getDistance(startlatitude, startlongitude, endlatitude, endlongitude);
    }
    
    // 百度地图 获取当前经纬度
    public  static  void GetLocationForBaiduMap(String subGameName){
        Log.e("GetLocationForBaiduMap","startLocation");
        NativeMgr.setSubGameName(subGameName);
        AppActivity.getInstance().locationServiceStart();
    }

    public  static  void StopLocationForBaiduMap(String subGameName){
        Log.e("StopLocationForBaiduMap","stopLocation");
        NativeMgr.setSubGameName(subGameName);
        AppActivity.getInstance().locationServiceStop();
    }

    //注册监听
    public static  void registerReceiver(String subGameName){
        NativeMgr.setSubGameName(subGameName);
        BatteryReceiver.getInstance().registerReceiver();
    }

    //取消监听
    public static void unregisterReceiver(String subGameName){
        NativeMgr.setSubGameName(subGameName);
        BatteryReceiver.getInstance().unregisterReceiver();
    }

    //屏幕选装的
    public  static  void changeOrientationH(boolean val){
        Log.e("NativeMgr","changeOrientationH");
        AppActivity.getInstance().changeOrientationH(val);
    }

    /**
     * 获取屏幕高度
     *
     * @return
     */
    public static int getScreenDPI(Context context) {
        int dpi = 0;
        WindowManager windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        Display display = windowManager.getDefaultDisplay();
        DisplayMetrics displayMetrics = new DisplayMetrics();
        Class c;
        try {
            c = Class.forName("android.view.Display");
            Method method = c.getMethod("getRealMetrics", DisplayMetrics.class);
            method.invoke(display, displayMetrics);
            dpi = displayMetrics.heightPixels;
        } catch (Exception e) {
            e.printStackTrace();
        }
        Log.e("getScreenDPI","dpi="+dpi);
        return dpi;
    }

    /**
     * 获取虚拟键盘的高度
     *
     * @return
     */
    public static int getBottomStatusHeight() {

        int totlaHeight = 0;//getScreenDPI(context);
        int contentHeight = 0;//getScreenHeight(context);


        Runnable runnable = new Runnable() {
            public void run() {
                // task to run goes here
                System.out.println("Hello !! " );
                Context context = AppActivity.getContext();
                int height = getNavigationBarHeight(context);
                Log.e("getBottomStatusHeight", "height="+height);

                System.out.println("Hello !! height=" + height);
            }
        };
        ScheduledExecutorService service = Executors
                .newSingleThreadScheduledExecutor();
        // 第二个参数为首次执行的延时时间，第三个参数为定时执行的间隔时间
        service.scheduleAtFixedRate(runnable, 1, 5, TimeUnit.SECONDS);




        return totlaHeight - contentHeight;
    }

    /**
     * 获取底部虚拟键盘的高度
     *
     * @param context
     * @return
     */
    private static int getScreenHeight(Context context) {
        WindowManager wm = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        DisplayMetrics out = new DisplayMetrics();
        wm.getDefaultDisplay().getMetrics(out);
        int height = wm.getDefaultDisplay().getHeight();

        Log.e("getScreenHeight ","height="+height+", out.heightPixels="+out.heightPixels);
        return out.heightPixels;
    }

    //获取虚拟按键的高度
    public static int getNavigationBarHeight(Context context) {
        int result = 0;
//        for (int i = 0 ; i < 1000000; i++) {
            if (hasNavBar(context)) {
                Resources res = context.getResources();
                int resourceId = res.getIdentifier("navigation_bar_height", "dimen", "android");
                if (resourceId > 0) {
                    result = res.getDimensionPixelSize(resourceId);
                }
            }
//            if (result > 0 ) break;
//        }
        return result;
    }

    /**
     * 检查是否存在虚拟按键栏
     *
     * @param context
     * @return
     */
    @TargetApi(Build.VERSION_CODES.ICE_CREAM_SANDWICH)
    public static boolean hasNavBar(Context context) {
        Resources res = context.getResources();
        int resourceId = res.getIdentifier("config_showNavigationBar", "bool", "android");
        if (resourceId != 0) {
            boolean hasNav = res.getBoolean(resourceId);
            // check override flag
            String sNavBarOverride = getNavBarOverride();
            if ("1".equals(sNavBarOverride)) {
                hasNav = false;
            } else if ("0".equals(sNavBarOverride)) {
                hasNav = true;
            }
            return hasNav;
        } else { // fallback
            return !ViewConfiguration.get(context).hasPermanentMenuKey();
        }
    }

    /**
     * 判断虚拟按键栏是否重写
     *
     * @return
     */
    private static String getNavBarOverride() {
        String sNavBarOverride = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            try {
                Class c = Class.forName("android.os.SystemProperties");
                Method m = c.getDeclaredMethod("get", String.class);
                m.setAccessible(true);
                sNavBarOverride = (String) m.invoke(null, "qemu.hw.mainkeys");
            } catch (Throwable e) {
            }
        }
        return sNavBarOverride;
    }
    public static void gpsSetting(String subGameName){
    	Intent intent = new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS);
   		AppActivity.getInstance().startActivityForResult(intent, 0);
        //startActivity(intent);
    }

    public static void ApplicationsSetting(String subGameName){
//        Intent intent = new Intent(android.provider.Settings.ACTION_MANAGE_APPLICATIONS_SETTINGS);
//        AppActivity.getInstance().startActivityForResult(intent, 0);
//        //startActivity(intent);
        Intent mIntent = new Intent();
        mIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if (Build.VERSION.SDK_INT >= 9) {
            mIntent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
            mIntent.setData(Uri.fromParts("package", AppActivity.getInstance().getPackageName(), null));
        } else if (Build.VERSION.SDK_INT <= 8) {
            mIntent.setAction(Intent.ACTION_VIEW);
            mIntent.setClassName("com.android.settings", "com.android.setting.InstalledAppDetails");
            mIntent.putExtra("com.android.settings.ApplicationPkgName", AppActivity.getInstance().getPackageName());
        }
        AppActivity.getInstance().startActivity(mIntent);
    }
    /**
     * 实现文本复制功能
     * add by wangqianzhou
     */
    public static void copyText(String msg, String subGameName)
    {
        NativeMgr.setSubGameName(subGameName);
        if (NativeMgr.mJniHandler != null) {
            Message msgInfo = new Message();
            msgInfo.what = Contants.MSG_COPYTEXT;

            Bundle bundle = new Bundle();
            bundle.putString("msg", msg);
            msgInfo.setData(bundle);
            org.cocos2dx.javascript.NativeMgr.mJniHandler.sendMessage(msgInfo);
        }else{
            // 得到剪贴板管理器
            ClipboardManager cmb = (ClipboardManager)AppActivity.getContext().getSystemService(Context.CLIPBOARD_SERVICE);
            cmb.setText(msg);

            JSONObject mJsonobjData = new JSONObject();
            try {
                mJsonobjData.put("code", 0);
                mJsonobjData.put("msg", msg);
                NativeMgr.OnCallBackToJs("copyText", mJsonobjData);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    // 打开相册
    public static void openPhotoAlbum(String uploadImgURL, String subGameName){
        Log.e(TAG, ">>>>>>>>>>>>>>>>>>>>:  访问相册, openPhotoAlbum ");
        NativeMgr.setSubGameName(subGameName);
        UploadImageManager.getInstance().openPhotoAlbum(uploadImgURL);
    }

    /**
     * 获取剪切板的文本
     * add by wangqianzhou
     */
    public static void getClipboardText(String subGameName)
    {
        NativeMgr.setSubGameName(subGameName);
        String msg = "";
        if (NativeMgr.mJniHandler != null) {
            Message msgInfo = new Message();
            msgInfo.what = Contants.MSG_GETCLIPBOARDTEXT;

            Bundle bundle = new Bundle();
            bundle.putString("msg", msg);
            msgInfo.setData(bundle);
            org.cocos2dx.javascript.NativeMgr.mJniHandler.sendMessage(msgInfo);
        }else {
            // 得到剪贴板管理器
            ClipboardManager cmb = (ClipboardManager) AppActivity.getContext().getSystemService(Context.CLIPBOARD_SERVICE);
            // 获取剪贴板的剪贴数据集
            ClipData clipData = cmb.getPrimaryClip();

            if (clipData != null && clipData.getItemCount() > 0) {
                // 从数据集中获取（粘贴）第一条文本数据
                msg = clipData.getItemAt(0).getText().toString();
                System.out.println("getClipboardText: " + msg);
            }

            JSONObject mJsonobjData = new JSONObject();
            try {
                mJsonobjData.put("code", 0);
                mJsonobjData.put("msg", msg);
                NativeMgr.OnCallBackToJs("getClipboardText", mJsonobjData);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 检查是否有定位权限
     * */
    public static void checkHaveLocationPermission(String subGameName){
        Log.e("NativeMgr ","checkHaveLocationPermission ");
        NativeMgr.setSubGameName(subGameName);
        Location.getInstance().init();
        if (Build.VERSION.SDK_INT <= 23) {
             NativeMgr.GetLocation(subGameName);
            Log.e("NativeMgr ","checkHaveLocationPermission 1111111");
        }
    }

    //钉钉分享入口
    public static void OnDDWeChatShare(String title, String description, String urlStr, String subGameName) {
        Log.e("NativeMgr ","OnDDWeChatShare");
        NativeMgr.setSubGameName(subGameName);
        DDShareMgr.Share(title, description, urlStr);
    }

    public static void OnDDWeChatShareImage(String imagePath, String subGameName) {
        Log.e("NativeMgr ","OnDDWeChatShareImage");
        NativeMgr.setSubGameName(subGameName);
        DDShareMgr.ShareImage(imagePath);
    }

    public static void OnDDWeChatShareText(String test, String subGameName) {
        Log.e("NativeMgr ","OnDDWeChatShareText");
        NativeMgr.setSubGameName(subGameName);
        DDShareMgr.ShareText(test);
    }
    //闲聊
    public static  void OnXLLogin(String subGameName){
        NativeMgr.setSubGameName(subGameName);
        SGEntryMgr.OnXianLiaoLogin();
    }
    public static void OnXLShare(String Title, String description, String urlStr,String roomID,String roomToken, String subGameName ) {
        NativeMgr.setSubGameName(subGameName);
        SGEntryMgr.Share(Title, description, urlStr, roomID, roomToken);
    }

    public static void OnXLShareImage(String ImagePath, String subGameName) {
        NativeMgr.setSubGameName(subGameName);
        SGEntryMgr.ShareImage(ImagePath);
    }

    public static void OnXLShareText(String Text, String subGameName) {
        NativeMgr.setSubGameName(subGameName);
        SGEntryMgr.ShareText(Text);
    }

    //乡聊
    public static  void OnXiangLiaoLogin(String subGameName){
        NativeMgr.setSubGameName(subGameName);
        XLEntryMgr.OnXiangLiaoLogin();
    }
    public static void OnXiangLiaoShare(String Title, String description, String urlStr,String roomID,String roomToken, String subGameName ) {
        Log.e("NativeMgr ","OnXiangliaoShare");
        NativeMgr.setSubGameName(subGameName);
        XLEntryMgr.Share(Title, description, urlStr, roomID, roomToken);
    }

    public static void OnXiangLiaoShareImage(String ImagePath, String subGameName) {
        NativeMgr.setSubGameName(subGameName);
        XLEntryMgr.ShareImage(ImagePath);
    }

    public static void OnXiangliaoShareText(String Text, String subGameName) {
        NativeMgr.setSubGameName(subGameName);
        XLEntryMgr.ShareText(Text);
    }

    //默往
    public static  void OnMWLogin(String subGameName){
        NativeMgr.setSubGameName(subGameName);
        MWEntryMgr.OnMoWangLogin();
    }
    public static void OnMWShare(String Title, String description, String urlStr,String roomID,String roomToken, String subGameName ) {
        NativeMgr.setSubGameName(subGameName);
        MWEntryMgr.Share(Title, description, urlStr, roomID, roomToken);
    }

    public static void OnMWShareImage(String ImagePath, String subGameName) {
        NativeMgr.setSubGameName(subGameName);
        MWEntryMgr.ShareImage(ImagePath);
    }

    public static void OnMWShareText(String Text, String subGameName) {
        NativeMgr.setSubGameName(subGameName);
        MWEntryMgr.ShareText(Text);
    }
    //多聊
    public static void OnDLShare(String Title, String description, String urlStr,String roomID,String roomToken, String subGameName ) {
        NativeMgr.setSubGameName(subGameName);
        DLShareMgr.Share(Title, description, urlStr);
    }

    public static void OnDLShareImage(String ImagePath, String subGameName) {
        NativeMgr.setSubGameName(subGameName);
        DLShareMgr.ShareImage(ImagePath);
    }

    public static void OnDLShareText(String Text, String subGameName) {
        NativeMgr.setSubGameName(subGameName);
        DLShareMgr.ShareText(Text);
    }
    //实时语音
    public  static void  OnGVInit(String pid, String subGameName){
        NativeMgr.setSubGameName(subGameName);
        GvoiceManager.GVInit(pid);
    }
    public  static void  OnGVEnterRealtimeMode(String subGameName){
        NativeMgr.setSubGameName(subGameName);
        GvoiceManager.enterRealtimeMode();
    }
    public  static void  OnGVEnableMultiRoom(String enable, String subGameName){
        NativeMgr.setSubGameName(subGameName);
        GvoiceManager.EnableMultiRoom(enable);
    }
    public  static void  OnGVEnterTeamroom(String teamRoomName, String subGameName){
        NativeMgr.setSubGameName(subGameName);
        GvoiceManager.enterTeamroom(teamRoomName);
    }
    public  static void  OnGVCtrMic(String teamRoomName, String enable, String subGameName){
        NativeMgr.setSubGameName(subGameName);
        GvoiceManager.EnableRoomMicrophone(teamRoomName, enable);
    }

//    public  static void  OnGVCloseMic(String subGameName){
//        NativeMgr.setSubGameName(subGameName);
//        GvoiceManager.closeMic();
//    }

    public  static void  OnGVCtrSpeaker(String teamRoomName, String enable, String subGameName){
        NativeMgr.setSubGameName(subGameName);
        GvoiceManager.EnableRoomSpeaker(teamRoomName, enable);
    }

//    public  static void  OnGVCloseSpeaker(String subGameName){
//        NativeMgr.setSubGameName(subGameName);
//        GvoiceManager.closeSpeaker();
//    }

    public  static void  OnGVQuitRoom(String teamRoomName, String subGameName){
        NativeMgr.setSubGameName(subGameName);
        if ("all".equals(teamRoomName)){
            for (int index = 0; index < GvoiceManager.mRoomNames.size(); ++index){
                GvoiceManager.quitRoom(GvoiceManager.mRoomNames.get(index));
            }
        }else {
            GvoiceManager.quitRoom(teamRoomName);
        }
    }

    /**
     * 检查是否有麦克风权限
     * */
    public static void CheckMicPermission(String name, String switchGameData,String subGameName){
        Log.e("NativeMgr ","CheckMicPermission ");
        NativeMgr.setSubGameName(subGameName);
//        if (Build.VERSION.SDK_INT <= 23) {
//        }

        GvoiceManager.CheckMicPermission(name, switchGameData);
    }
    /**
     * 检查是否有扬声器权限
     * */
    public static void CheckSpeakerPermission(String name, String switchGameData,String subGameName){
        Log.e("NativeMgr ","CheckSpeakerPermission ");
        NativeMgr.setSubGameName(subGameName);
//        if (Build.VERSION.SDK_INT <= 23) {
//        }

        GvoiceManager.CheckSpeakerPermission(name, switchGameData);
    }

    /**
     * 网易七鱼调用客服
     * @param windowsTitle 聊天窗体名
     * @param sourceUrl 来源链接
     * @param sourceTitle 来源标题
     */
    public static void weakUpCustomerService(String windowsTitle,String sourceUrl, String sourceTitle, String subGameName) {
        NativeMgr.setSubGameName(subGameName);
        Log.e("error",windowsTitle);
        Log.e("error",sourceUrl);
        Log.e("error",sourceTitle);
        WyqyUitl.weakUpCustomerService(windowsTitle, sourceUrl,sourceTitle,Cocos2dxActivity.getContext());
        Log.e("error","in");
    }
}
