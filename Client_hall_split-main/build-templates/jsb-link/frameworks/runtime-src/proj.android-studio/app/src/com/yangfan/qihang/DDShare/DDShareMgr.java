package com.yangfan.qihang.DDShare;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.android.dingtalk.share.ddsharemodule.message.DDImageMessage;
import com.android.dingtalk.share.ddsharemodule.message.DDMediaMessage;
import com.android.dingtalk.share.ddsharemodule.message.DDTextMessage;
import com.android.dingtalk.share.ddsharemodule.message.DDWebpageMessage;
import com.android.dingtalk.share.ddsharemodule.message.SendMessageToDD;

import com.yangfan.qihang.R;
import com.yangfan.qihang.wxapi.Util;


import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONObject;

import java.io.File;

import static org.cocos2dx.javascript.NativeMgr.getSubGameName;


/**
 * Created by hanhanliu on 15/12/9.
 */
public class DDShareMgr  {
    public static final String TAG = "DDShareMgr";
    /**
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */
//    private GoogleApiClient client;

    public static String dataStr;
    public static String paySuccessMsg = "";
    public  static AppActivity app = null;

    public static void init(AppActivity app) {
        DDShareMgr.app = app;
    }







    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void Share(String title,String description,String urlStr) {

        if(!checkDDSupportAPI()){
            return;
        }

        //初始化一个DDWebpageMessage并填充网页链接地址
        DDWebpageMessage webPageObject = new DDWebpageMessage();
        webPageObject.mUrl = urlStr;

        //构造一个DDMediaMessage对象
        DDMediaMessage webMessage = new DDMediaMessage();
        webMessage.mMediaObject = webPageObject;

        //填充网页分享必需参数，开发者需按照自己的数据进行填充
        webMessage.mTitle = title;
        webMessage.mContent = description;
//        webMessage.mThumbUrl = "https://t.alipayobjects.com/images/rmsweb/T1vs0gXXhlXXXXXXXX.jpg";
//        webMessage.mThumbUrl = "http://ww2.sinaimg.cn/large/85cccab3gw1etdkm64h7mg20dw07tb29.gif";
//        webMessage.mThumbUrl = "http://img.qdaily.com/uploads/20160606152752iqaH5t4KMvn18BZo.gif";
//        webMessage.mThumbUrl = "http://static.dingtalk.com/media/lAHPBY0V4shLSVDMlszw_240_150.gif";
        // 网页分享的缩略图也可以使用bitmap形式传输
        Bitmap bmp = BitmapFactory.decodeResource(app.getResources(), R.mipmap.ic_launcher);
        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, 96, 96, true);
        if (thumbBmp != null){
            webMessage.setThumbImage(thumbBmp);
        }else {
            Log.e(TAG,"DDShare bmp no find:"+R.mipmap.ic_launcher);
        }

        //构造一个Req
        SendMessageToDD.Req webReq = new SendMessageToDD.Req();
        webReq.mMediaMessage = webMessage;
//        webReq.transaction = buildTransaction("webpage");

        boolean result =  app.getIddShareApi().sendReq(webReq);
        if (!result){
            onJaveToJS(-3, "发送失败");
        }
    }


    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void ShareImage(String imagePath) {
        if(!checkDDSupportAPI()){
            return;
        }

        //图片本地路径，开发者需要根据自身数据替换该数据
//        String path =  Environment.getExternalStorageDirectory().getAbsolutePath() + "/test.png";
//        String path =  "/storage/emulated/0/Android/data/com.alibaba.android.rimet/cache/outter_share/4AEC3689513A9FA35177B83009490937.jpg";

        File file = new File(imagePath);
        if (!file.exists()) {
            onJaveToJS(-3, "发送失败");
            return;
        }
        Bitmap bmp = BitmapFactory.decodeFile(imagePath);

        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, bmp.getWidth()/2, bmp.getHeight()/2, true);
        bmp.recycle();
//        msg.thumbData = Util.bmpToByteArray(thumbBmp, true);

        //初始化一个DDImageMessage
        DDImageMessage imageObject = new DDImageMessage();
//        imageObject.mImagePath = imagePath;
        imageObject.mImageData = Util.bmpToByteArray(thumbBmp, true);;

        //构造一个mMediaObject对象
        DDMediaMessage mediaMessage = new DDMediaMessage();
        mediaMessage.mMediaObject = imageObject;

        //构造一个Req
        SendMessageToDD.Req req = new SendMessageToDD.Req();
        req.mMediaMessage = mediaMessage;
//        req.transaction = buildTransaction("image");

        boolean result =   app.getIddShareApi().sendReq(req);
        if (!result){
            onJaveToJS(-3, "发送失败");
        }
    }


    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void ShareText(String text) {
        if(!checkDDSupportAPI()){
            return;
        }

        Log.e(TAG,"ShareText imagpath="+text);


        //初始化一个DDTextMessage对象
        DDTextMessage textObject = new DDTextMessage();
        textObject.mText = text;

        //用DDTextMessage对象初始化一个DDMediaMessage对象
        DDMediaMessage mediaMessage = new DDMediaMessage();
        mediaMessage.mMediaObject = textObject;

        //构造一个Req
        SendMessageToDD.Req req = new SendMessageToDD.Req();
        req.mMediaMessage = mediaMessage;
        boolean result = app.getIddShareApi().sendReq(req);

        if (!result){
            onJaveToJS(-3, "发送失败");
        }
    }

    /**
     * 检查是否支持
     * */
    public static boolean checkDDSupportAPI(){
        if(!app.getIddShareApi().isDDAppInstalled() ){
            onJaveToJS(-5, "没有安装钉钉");
            return  false;
        }else if(!app.getIddShareApi().isDDSupportAPI()){
            onJaveToJS(-5, "不支持钉钉分享");
            return  false;
        }else{
            return  true;
        }
    }

    /**
     * 通知客户端
     * */
    public static void onJaveToJS(int errCode, String errMsg){
        try {
            JSONObject mJsonobjData = new JSONObject();
            mJsonobjData.put("ErrCode", errCode);
            mJsonobjData.put("ErrStr", errMsg);
//                mJsonobjData.put("Type",baseResp.getType());

            dataStr = null;
            dataStr = mJsonobjData.toString();
        } catch (Exception e) {
            // TODO: handle exception
            //e.printStackTrace();
            Log.e("onResp Exception",e.toString());
        }
        paySuccessMsg = String.format(getSubGameName()+"_NativeNotify.OnNativeNotify('%s','%s')","DDShare", dataStr);
        //一定要在GL线程中执行
        app.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString(paySuccessMsg);
            }
        });
    }
}
