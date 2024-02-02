package org.cocos2dx.javascript.WeChat;


import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.yangfan.qihang.R;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.Contants;

import java.io.File;


/**
 * Created by guoliangxuan on 2017/3/21.
 */


public class SendWXSDKManager extends AppActivity {
    private static final String TAG = "SendWXSDKManager";
    private static final String APP_ID = Contants.WX_APP_ID;
    private  static IWXAPI api  = null;
    private static final int THUMB_SIZE = 150;

    public static String GetAPP_ID() {
        return APP_ID;
    }
    //登录入口
    public static void OnJSToAndroidLogin () {
        Login();
    }
    //分享入口
    public static void OnJSToAndroidShare (String title,String description,String urlStr,String flag) {
        int num = Integer.parseInt(flag);
        if (num == 0) {
            Share(title, description, urlStr, "0");
        }
        else {
            Share(title, description, urlStr, "1");
        }
    }
    //分享入口
    public static void OnJSToAndroidShareImage(String imagePath, String flag) {
        int num = Integer.parseInt(flag);
        if (num == 0) {
            ShareImage(imagePath, "0");
        }
        else {
            ShareImage(imagePath, "1");
        }
    }

    public static void Login() {
        Log.e("SendWXSDKManager","111111" );
        if(api == null) {
            api = WXAPIFactory.createWXAPI(getContext(), APP_ID);
            api.registerApp(APP_ID);
        }

        // send oauth request
        SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "ddmh5";
        api.sendReq(req);
        Log.e("SendWXSDKManager","222 api=" + api.toString());
    }

    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void Share(String title,String description,String urlStr,String flag) {
        if(api == null) {
            api = WXAPIFactory.createWXAPI(getContext(), APP_ID);
            api.registerApp(APP_ID);
        }
        //初始化一个WXWebpageObject对象，填写分享的url
        WXWebpageObject webpageObject = new WXWebpageObject();
        webpageObject.webpageUrl = urlStr;
        //用WXWebpageObject对象初始化一个WXMediaMessage对象
        WXMediaMessage msg = new WXMediaMessage(webpageObject);
        msg.title = title;
        msg.description = description;

//        //这里替换一张自己工程里的图片资源

        Bitmap bmp = BitmapFactory.decodeResource(getContext().getResources(), R.mipmap.ic_launcher);
        msg.setThumbImage(bmp);//

        //构造一个reg
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = String.valueOf(System.currentTimeMillis());
        //transaction字段用于唯一标示一个请求
        req.message = msg;
        if (flag == "0") {
            req.scene = SendMessageToWX.Req.WXSceneSession;
        }
        else {
            req.scene = SendMessageToWX.Req.WXSceneTimeline;
        }
        api.sendReq(req);
    }

    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void ShareImage(String imagePath, String flag) {
        File file = new File(imagePath);
        if (!file.exists()) {
            Log.i(TAG, "分享路径错误");
            return;
        }
        if(api == null) {
            api = WXAPIFactory.createWXAPI(getContext(), APP_ID);
            api.registerApp(APP_ID);
        }
        WXImageObject imgObj = new WXImageObject();
        imgObj.setImagePath(imagePath);

        //用WXWebpageObject对象初始化一个WXMediaMessage对象
        WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = imgObj;

        //构造一个缩略图
        Bitmap bmp = BitmapFactory.decodeFile(imagePath);
        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, THUMB_SIZE, THUMB_SIZE, true);
        bmp.recycle();
        msg.thumbData = Util.bmpToByteArray(thumbBmp, true);

        int imageSize = msg.thumbData.length / 1024;
        if (imageSize > 32) {
            Log.i(TAG, "分享图片过大");
            return;
        }
        //构造一个reg
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = String.valueOf(System.currentTimeMillis());
        //transaction字段用于唯一标示一个请求
        req.message = msg;
        if (flag == "0") {
            req.scene = SendMessageToWX.Req.WXSceneSession;
        }
        else {
            req.scene = SendMessageToWX.Req.WXSceneTimeline;
        }
        api.sendReq(req);
    }
}
