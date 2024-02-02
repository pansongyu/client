package com.yangfan.qihang.xlapi;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;


import com.ixl.talk.xl.opensdk.v2.api.XLAPI;
import com.ixl.talk.xl.opensdk.v2.constants.XLConstants;
import com.ixl.talk.xl.opensdk.v2.modelmsg.SendAuth;
import com.ixl.talk.xl.opensdk.v2.modelmsg.SendMessageToXL;
import com.ixl.talk.xl.opensdk.v2.modelmsg.XLImageObject;
import com.ixl.talk.xl.opensdk.v2.modelmsg.XLLinkObject;
import com.ixl.talk.xl.opensdk.v2.modelmsg.XLMediaMessage;
import com.ixl.talk.xl.opensdk.v2.modelmsg.XLTextObject;
import com.yangfan.qihang.R;

import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.javascript.NativeMgr;
import org.json.JSONObject;

import java.io.File;


public class XLEntryMgr  {
    public static final String TAG = "XLEntryMgr";

    public  static AppActivity app = null;

    private XLAPI api;

    public static void init(AppActivity app) {
        XLEntryMgr.app = app;
    }

    //@param
    public static void OnXiangLiaoLogin() {
        //可以检测乡聊是否已经安装
        if(!checkInstall()){
            return;
        }
        //构造一个Req
        SendAuth.Req req = new SendAuth.Req();

        //调用api接口发送数据到闲聊
        boolean result =AppActivity.getInstance().getXlApi().sendReq(req);
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
        //可以检测乡聊是否已经安装
        if(!checkInstall()){
            return;
        }
        try {
            //注意ic_launcher 图片的大小，放在res里不同图片资源文件目录下，系统会根据手机屏幕自动缩放，
            // 建议放在xxhdpi目录下，大小不要超过 200 x 200
            Bitmap bmp = BitmapFactory.decodeResource(AppActivity.getInstance().getResources(), R.mipmap.ic_launcher);

//        Bitmap bmp = BitmapFactory.decodeFile(imagePath);

            Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, bmp.getWidth()/2, bmp.getHeight()/2, true);
            bmp.recycle();

            //初始化一个XLLinkObject对象
            XLLinkObject linkObject = new XLLinkObject();
            //要分享的链接，必填
            linkObject.shareUrl = urlStr;
            //用XLLinkObject对象初始化一个XLMediaMessage对象
            XLMediaMessage msg = new XLMediaMessage();
            msg.title = title;
            msg.description = description;
            msg.mediaObject = linkObject;
            //构造一个Req
            SendMessageToXL.Req req = new SendMessageToXL.Req();
            req.transaction = XLConstants.T_LINK;
            req.mediaMessage = msg;
            //调用api接口发送数据到乡聊
            boolean result =AppActivity.getInstance().getXlApi().sendReq(req);
            if (!result){
                onJaveToJS(-4, "发送失败");
            }
        } catch (Exception e){
            e.printStackTrace();
        }


    }


    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void ShareImage(String imagePath) {
        File file = new File(imagePath);
        if (!file.exists()) {
            String tip = "no pic";
            onJaveToJS(-4,"文件不存在");
            return;
        }
        //可以检测乡聊是否已经安装
        if(!checkInstall()){
            return;
        }
        Bitmap bmp = BitmapFactory.decodeFile(imagePath);

        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, bmp.getWidth()/2, bmp.getHeight()/2, true);
        bmp.recycle();

        //初始化一个XLImageObject对象，设置所分享的图片内容
        XLImageObject imageObject = new XLImageObject(thumbBmp);
        //用XLImageObject对象初始化一个XLMediaMessage对象
        XLMediaMessage msg = new XLMediaMessage();
        msg.mediaObject = imageObject;
        //构造一个Req
        SendMessageToXL.Req req = new SendMessageToXL.Req();
        req.transaction = XLConstants.T_IMAGE;
        req.mediaMessage = msg;
        //调用api接口发送数据到乡聊
        boolean result =AppActivity.getInstance().getXlApi().sendReq(req);
        if (!result){
            onJaveToJS(-4, "发送失败");
        }
    }


    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void ShareText(String text) {
        //可以检测乡聊是否已经安装
        if(!checkInstall()){
            return;
        }
        Log.e(TAG,"ShareText imagpath="+text);
        //初始化一个XLTextObject对象，填写分享的文本内容
        XLTextObject textObject = new XLTextObject();
        textObject.text = text;

        //XLMediaMessage
        XLMediaMessage msg = new XLMediaMessage();
        msg.mediaObject = textObject;

        //构造一个Req
        SendMessageToXL.Req req = new SendMessageToXL.Req();
        req.transaction = XLConstants.T_TEXT;
        req.mediaMessage = msg;
        //调用api接口发送数据到乡聊
        boolean result =AppActivity.getInstance().getXlApi().sendReq(req);
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


            NativeMgr.OnCallBackToJs("XiangLiaoShare", mJsonobjData);
        } catch (Exception e) {
            // TODO: handle exception
            //e.printStackTrace();
            Log.e(TAG,e.toString());
        }
    }

    public static void onJaveToJSLogin(JSONObject data){
        try {
            NativeMgr.OnCallBackToJs("XianglLiaoLogin", data);
        } catch (Exception e) {
            // TODO: handle exception
            //e.printStackTrace();
            Log.e(TAG,e.toString());
        }
    }

    public  static  boolean checkInstall(){
        if(!AppActivity.getInstance().getXlApi().isXLAppInstalled() ){
            Toast.makeText(AppActivity.getInstance(), "未安装乡聊！", Toast.LENGTH_SHORT).show();
            onJaveToJS(-5, "没有安装乡聊");
            return  false;
        }else{
            return  true;
        }
    }
}