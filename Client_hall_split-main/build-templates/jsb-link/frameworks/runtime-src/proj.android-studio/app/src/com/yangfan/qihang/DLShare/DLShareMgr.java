package com.yangfan.qihang.DLShare;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.qidalin.hy.dlshare.Constant;
import com.qidalin.hy.dlshare.modelmsg.DLImageObject;
import com.qidalin.hy.dlshare.modelmsg.DLLinkObject;
import com.qidalin.hy.dlshare.modelmsg.DLMediaMessage;
import com.qidalin.hy.dlshare.modelmsg.DLTextObject;
import com.qidalin.hy.dlshare.modelmsg.SendMessageToDL;


import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONObject;

import java.io.File;

import static org.cocos2dx.javascript.NativeMgr.getSubGameName;


/**
 * Created by hanhanliu on 15/12/9.
 */
public class DLShareMgr {
    public static final String TAG = "DLShareMgr";
    public static String dataStr;
    public static String shareSuccessMsg = "";
    public  static AppActivity app = null;

    public static void init(AppActivity app) {
        DLShareMgr.app = app;
    }


    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void Share(String title,String description,String urlStr) {
        DLLinkObject linkObject = new DLLinkObject();
        //要分享的链接，必填
        linkObject.shareUrl = urlStr;
        //建议使用url传入应用logo
        linkObject.imageUrl = "http://duoliao.nbmenghai.com/ind/logo/logo2.png";
        //用DLMediaMessage对象初始化一个DLMediaMessage对象
        DLMediaMessage msg = new DLMediaMessage();
        msg.mediaObject = linkObject;
        msg.title = title;  //链接标题
        msg.description = description;  //链接描述
        //构造一个Req
        SendMessageToDL.Req req = new SendMessageToDL.Req();
        req.transaction = Constant.T_LINK;
        req.mediaMessage = msg;
        req.scene = SendMessageToDL.Req.DLSceneSession; //代表分享到会话列表
        //调用api接口发送数据到多聊
        AppActivity.getInstance().dlapi.sendReq(req);
    }


    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void ShareImage(String imagePath) {
        File file = new File(imagePath);
        if (!file.exists()) {
            onJaveToJS(-3, "发送失败");
            return;
        }
        Bitmap bmp = BitmapFactory.decodeFile(imagePath);

        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, bmp.getWidth()/2, bmp.getHeight()/2, true);
        bmp.recycle();
        DLImageObject imageObject = new DLImageObject(thumbBmp);
        //用DLImageObject对象初始化一个DLMediaMessage对象
        DLMediaMessage msg = new DLMediaMessage();
        msg.mediaObject = imageObject;
        //构造一个Req
        SendMessageToDL.Req req = new SendMessageToDL.Req();
        req.transaction = Constant.T_IMAGE;
        req.mediaMessage = msg;
        req.scene = SendMessageToDL.Req.DLSceneSession; //代表分享到会话列表
        //调用api接口发送数据到多聊
        AppActivity.getInstance().dlapi.sendReq(req);
    }


    //@param flag(0:分享到微信好友，1：分享到微信朋友圈)
    public static void ShareText(String text) {
        //支持链接
        //初始化一个DLTextObject对象，填写分享的文本内容
        DLTextObject textObject = new DLTextObject();
        textObject.text = text;
        //用DLTextObject对象初始化一个DLMediaMessage对象
        DLMediaMessage msg = new DLMediaMessage();
        msg.mediaObject = textObject;
        //构造一个Req
        SendMessageToDL.Req req = new SendMessageToDL.Req();
        req.transaction = Constant.T_TEXT;
        req.mediaMessage = msg;
        req.scene = SendMessageToDL.Req.DLSceneSession; //代表分享到会话列表
        //调用api接口发送数据到多聊
        AppActivity.getInstance().dlapi.sendReq(req);
    }

    /**
     * 检查是否支持
     * */
    public static boolean checkDLSupportAPI(){
        return true;
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
        shareSuccessMsg = String.format(getSubGameName()+"_NativeNotify.OnNativeNotify('%s','%s')","DLShare", dataStr);
        //一定要在GL线程中执行
        app.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString(shareSuccessMsg);
            }
        });
    }
}
