package com.yangfan.qihang.sgapi;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.text.TextUtils;
import android.util.Log;


import com.yangfan.qihang.R;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.NativeMgr;
import org.json.JSONObject;
import org.xianliao.im.sdk.constants.SGConstants;
import org.xianliao.im.sdk.modelmsg.SGGameObject;
import org.xianliao.im.sdk.modelmsg.SGImageObject;
import org.xianliao.im.sdk.modelmsg.SGMediaMessage;
import org.xianliao.im.sdk.modelmsg.SGTextObject;
import org.xianliao.im.sdk.modelmsg.SendAuth;
import org.xianliao.im.sdk.modelmsg.SendMessageToSG;

import java.io.File;


/**
 * Created by nickyang on 2017/1/18.
 *
 * 此类用于接收从闲聊返回到应用的返回值
 *
 * 注意： "sgapi" 目录名和 "SGEntryActivity" 类名都不能改动
 *
 */

public class SGEntryMgr  {
    public static final String TAG = "SGEntryMgr";

    public  static AppActivity app = null;

    public static void init(AppActivity app) {
        SGEntryMgr.app = app;
    }

    //@param
    public static void OnXianLiaoLogin() {
        //可以检测闲聊是否已经安装
        if(!checkInstall()){
            return;
        }
        //构造一个Req
        SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "ddmh5";

        //调用api接口发送数据到闲聊
        boolean result =AppActivity.getInstance().getIsgApi().sendReq(req);
        if (!result){
            onJaveToJS(-4, "发送失败");
        }
    }


    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void Share(String title,String description,String urlStr, String roomId, String roomToken) {
        if (TextUtils.isEmpty(roomId) && TextUtils.isEmpty(roomToken)) {
            onJaveToJS(-4, "没有填写roomID或者roomtoken");
            return;
        }

        //注意ic_launcher 图片的大小，放在res里不同图片资源文件目录下，系统会根据手机屏幕自动缩放，
        // 建议放在xxhdpi目录下，大小不要超过 200 x 200
        Bitmap bmp = BitmapFactory.decodeResource(AppActivity.getInstance().getResources(), R.mipmap.ic_launcher);

//        Bitmap bmp = BitmapFactory.decodeFile(imagePath);

        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, bmp.getWidth()/2, bmp.getHeight()/2, true);
        bmp.recycle();

        //初始化一个SGGameObject对象，设置所分享的应用图片内容
        SGGameObject gameObject = new SGGameObject(thumbBmp);
        gameObject.roomId = roomId;
        gameObject.roomToken = roomToken;

        //可以自定义邀请应用的下载链接，也可以不填，不填会默认使用应用申请appid时填写的链接
        gameObject.androidDownloadUrl = urlStr;
        gameObject.iOSDownloadUrl = urlStr;

        //用SGGameObject对象初始化一个SGMediaMessage对象
        SGMediaMessage msg = new SGMediaMessage();
        msg.mediaObject = gameObject;
        msg.title = title;
        msg.description =description;

        //构造一个Req
        SendMessageToSG.Req req = new SendMessageToSG.Req();
        req.transaction = SGConstants.T_GAME;
        req.mediaMessage = msg;
        req.scene = SendMessageToSG.Req.SGSceneSession; //代表分享到会话列表

        //调用api接口发送数据到闲聊
        boolean result =AppActivity.getInstance().getIsgApi().sendReq(req);
        if (!result){
            onJaveToJS(-4, "发送失败");
        }
    }


    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void ShareImage(String imagePath) {
        //图片本地路径，开发者需要根据自身数据替换该数据
//        String path =  Environment.getExternalStorageDirectory().getAbsolutePath() + "/test.png";
//        String path =  "/storage/emulated/0/Android/data/com.alibaba.android.rimet/cache/outter_share/4AEC3689513A9FA35177B83009490937.jpg";

        File file = new File(imagePath);
        if (!file.exists()) {
            String tip = "no pic";
            onJaveToJS(-4,"文件不存在");
            return;
        }


//        Bitmap bitmap = BitmapFactory.decodeFile(imagePath);
//
//        if(bitmap == null){
//            bitmap = BitmapFactory.decodeResource(AppActivity.getInstance().getResources(), R.mipmap.ic_launcher);
//        }

        Bitmap bmp = BitmapFactory.decodeFile(imagePath);

        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, bmp.getWidth()/2, bmp.getHeight()/2, true);
        bmp.recycle();

        //初始化一个SGImageObject对象，设置所分享的图片内容
        SGImageObject imageObject = new SGImageObject(thumbBmp);

        //用SGImageObject对象初始化一个SGMediaMessage对象
        SGMediaMessage msg = new SGMediaMessage();
        msg.mediaObject = imageObject;

        //构造一个Req
        SendMessageToSG.Req req = new SendMessageToSG.Req();
        req.transaction = SGConstants.T_IMAGE;
        req.mediaMessage = msg;
        req.scene = SendMessageToSG.Req.SGSceneSession; //代表分享到会话列表

        //调用api接口发送数据到闲聊
        boolean result =AppActivity.getInstance().getIsgApi().sendReq(req);
        if (!result){
            onJaveToJS(-4, "发送失败");
        }
    }


    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void ShareText(String text) {
        Log.e(TAG,"ShareText imagpath="+text);


        //初始化一个SGTextObject对象，填写分享的文本内容
        SGTextObject textObject = new SGTextObject();
        textObject.text = text;

        //用SGTextObject对象初始化一个SGMediaMessage对象
        SGMediaMessage msg = new SGMediaMessage();
        msg.mediaObject = textObject;
//        msg.title = "titleXXX";

        //构造一个Req
        SendMessageToSG.Req req = new SendMessageToSG.Req();
        req.transaction = SGConstants.T_TEXT;
        req.mediaMessage = msg;
        req.scene = SendMessageToSG.Req.SGSceneSession; //代表分享到会话列表

        //调用api接口发送数据到闲聊
        boolean result =AppActivity.getInstance().getIsgApi().sendReq(req);
        if (!result){
            onJaveToJS(-4, "发送失败");
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


            NativeMgr.OnCallBackToJs("XLShare", mJsonobjData);
        } catch (Exception e) {
            // TODO: handle exception
            //e.printStackTrace();
            Log.e(TAG,e.toString());
        }
    }

    public static void onJaveToJSLogin(JSONObject data){
        try {
            NativeMgr.OnCallBackToJs("XLLogin", data);
        } catch (Exception e) {
            // TODO: handle exception
            //e.printStackTrace();
            Log.e(TAG,e.toString());
        }
    }

    public  static  boolean checkInstall(){
        if(!AppActivity.getInstance().getIsgApi().isSGAppInstalled() ){
            onJaveToJS(-5, "没有安装闲聊");
            return  false;
        }else{
            return  true;
        }
    }
}
